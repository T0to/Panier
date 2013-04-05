--
-- Title:      Update for permissions schema changes
-- Database:   Oracle
-- Since:      V2.2 Schema 85
-- Author:     Andy Hind
--
-- Please contact support@alfresco.com if you need assistance with the upgrade.
--

CREATE TABLE alf_acl_change_set (
   id NUMBER(19,0) NOT NULL,
   version NUMBER(19,0) NOT NULL,
   PRIMARY KEY (id)
);


-- Add to ACL
ALTER TABLE alf_access_control_list ADD (
   type NUMBER(10,0) DEFAULT 0 NOT NULL,
   latest NUMBER(1,0) DEFAULT 1 NOT NULL,
   acl_id VARCHAR2(36 CHAR) DEFAULT 'UNSET' NOT NULL,
   acl_version NUMBER(19,0) DEFAULT 1 NOT NULL,
   inherited_acl NUMBER(19,0),
   is_versioned NUMBER(1,0) DEFAULT 0 NOT NULL,
   requires_version NUMBER(1,0) DEFAULT 0 NOT NULL,
   acl_change_set NUMBER(19,0),
   inherits_from NUMBER(19,0)
);
CREATE INDEX fk_alf_acl_acs ON alf_access_control_list (acl_change_set);
ALTER TABLE alf_access_control_list ADD CONSTRAINT fk_alf_acl_acs FOREIGN KEY (acl_change_set) REFERENCES alf_acl_change_set (id);
CREATE INDEX idx_alf_acl_inh ON alf_access_control_list (inherits, inherits_from);

--FOREACH alf_access_control_list.id system.upgrade.alf_access_control_list.batchsize
UPDATE alf_access_control_list acl
   SET acl_id = (acl.id)
   WHERE acl.id >= ${LOWERBOUND} AND acl.id <= ${UPPERBOUND};

ALTER TABLE alf_access_control_list
   ADD UNIQUE (acl_id, latest, acl_version);

-- Create ACL member list
CREATE TABLE alf_acl_member (
   id NUMBER(19,0) NOT NULL,
   version NUMBER(19,0) NOT NULL,
   acl_id NUMBER(19,0) NOT NULL,
   ace_id NUMBER(19,0) NOT NULL,
   pos NUMBER(10,0) NOT NULL,
   primary key (id),
   unique (acl_id, ace_id, pos)
);


ALTER TABLE alf_access_control_entry DROP UNIQUE (acl_id, permission_id, authority_id);

-- Extend ACE
-- not required from 2.1-A
--  auth_id NUMBER(19,0) DEFAULT -1 NOT NULL,
ALTER TABLE alf_access_control_entry ADD (
   applies NUMBER(10,0) DEFAULT 0 NOT NULL,
   context_id NUMBER(19,0)
);

-- remove unused
DROP TABLE alf_auth_ext_keys;

-- remove authority constraint
DROP INDEX FKFFF41F99B25A50BF;
ALTER TABLE alf_access_control_entry DROP CONSTRAINT FKFFF41F99B25A50BF; -- (optional)

-- not required from 2.1-A
-- restructure authority
-- ALTER TABLE alf_authority DROP PRIMARY KEY;
-- ALTER TABLE alf_authority ADD (
--   id number(19,0) DEFAULT 0 NOT NULL,
--   crc NUMBER(19,0)
-- );
-- UPDATE alf_authority SET id = hibernate_sequence.nextval;
-- ALTER TABLE alf_authority RENAME COLUMN recipient TO authority;
-- ALTER TABLE alf_authority MODIFY (
--   authority VARCHAR(100 char) NULL
-- );
-- ALTER TABLE alf_authority ADD PRIMARY KEY (id);
-- ALTER TABLE alf_authority ADD UNIQUE (authority, crc);
-- CREATE INDEX idx_alf_auth_aut on alf_authority (authority);

-- ------------------------------------------------- --
-- Ensure stats are up to date on all schema objects --
-- ------------------------------------------------- --
begin dbms_stats.gather_schema_stats(ownname => user, options => 'GATHER AUTO', estimate_percent => dbms_stats.auto_sample_size); end;;

-- migrate data - fix up FK refs to authority
-- UPDATE alf_access_control_entry ace
--    SET auth_id = (SELECT id FROM alf_authority a WHERE a.authority = ace.authority_id);


-- migrate data - build equivalent ACL entries
--FOREACH alf_access_control_list.id system.upgrade.alf_acl_member.batchsize
INSERT INTO alf_acl_member (id, version, acl_id, ace_id, pos)
   SELECT hibernate_sequence.nextval, 1, ace.acl_id, ace.id, 0 
   FROM alf_access_control_entry ace JOIN alf_access_control_list acl ON acl.id = ace.acl_id
   WHERE acl.id >= ${LOWERBOUND} AND acl.id <= ${UPPERBOUND};

-- Create ACE context
CREATE TABLE alf_ace_context (
   id NUMBER(19,0) NOT NULL,
   version NUMBER(19,0) NOT NULL,
   class_context VARCHAR2(1024 CHAR),
   property_context VARCHAR2(1024 CHAR),
   kvp_context VARCHAR2(1024 CHAR),
   PRIMARY KEY (id)
);


-- Create auth aliases table
CREATE TABLE alf_authority_alias (
    id NUMBER(19,0) NOT NULL,
    version NUMBER(19,0) NOT NULL,
    auth_id NUMBER(19,0) NOT NULL,
    alias_id NUMBER(19,0) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (auth_id, alias_id)
);
CREATE INDEX fk_alf_autha_ali ON alf_authority_alias (alias_id);
ALTER TABLE alf_authority_alias ADD CONSTRAINT fk_alf_autha_ali FOREIGN KEY (alias_id) REFERENCES alf_authority (id);
CREATE INDEX fk_alf_autha_aut ON alf_authority_alias (auth_id);
ALTER TABLE alf_authority_alias ADD CONSTRAINT fk_alf_autha_aut FOREIGN KEY (auth_id) REFERENCES alf_authority (id);


-- Tidy up unused cols on ace table and add the FK contstraint back
-- finish take out of ACL_ID
DROP INDEX FKFFF41F99B9553F6C;
ALTER TABLE alf_access_control_entry DROP CONSTRAINT FKFFF41F99B9553F6C;
DROP INDEX FKFFF41F9960601995;
ALTER TABLE alf_access_control_entry DROP CONSTRAINT FKFFF41F9960601995;
-- not required from 2.1-A TO 3.1
-- authority_id
ALTER TABLE alf_access_control_entry DROP (
   acl_id
);
-- not required from 2.1-A to 3.1
-- ALTER TABLE alf_access_control_entry RENAME COLUMN auth_id TO authority_id;
CREATE INDEX fk_alf_ace_auth ON alf_access_control_entry (authority_id);
ALTER TABLE alf_access_control_entry ADD CONSTRAINT fk_alf_ace_auth FOREIGN KEY (authority_id) REFERENCES alf_authority (id);
CREATE INDEX fk_alf_ace_perm ON alf_access_control_entry (permission_id);
ALTER TABLE alf_access_control_entry ADD CONSTRAINT fk_alf_ace_perm FOREIGN KEY (permission_id) REFERENCES alf_permission (id);
CREATE INDEX fk_alf_ace_ctx ON alf_access_control_entry (context_id);
ALTER TABLE alf_access_control_entry ADD CONSTRAINT fk_alf_ace_ctx FOREIGN KEY (context_id) REFERENCES alf_ace_context (id);
   

-- ------------------------------------------------- --
-- Ensure stats are up to date on all schema objects --
-- ------------------------------------------------- --
begin dbms_stats.gather_schema_stats(ownname => user, options => 'GATHER AUTO', estimate_percent => dbms_stats.auto_sample_size); end;;

CREATE TABLE alf_tmp_min_ace (
  min NUMBER(19,0) NOT NULL,
  permission_id NUMBER(19,0) NOT NULL,
  authority_id NUMBER(19,0) NOT NULL,
  allowed NUMBER(1) NOT NULL,
  applies number(10,0) NOT NULL,
  UNIQUE (permission_id, authority_id, allowed, applies)
);

--FOREACH alf_access_control_entry.authority_id system.upgrade.alf_tmp_min_ace.batchsize
INSERT INTO alf_tmp_min_ace (min, permission_id, authority_id, allowed, applies)
    SELECT
       min(ace1.id),
       ace1.permission_id,
       ace1.authority_id,
       ace1.allowed,
       ace1.applies
    FROM
       alf_access_control_entry ace1
    WHERE
       ace1.authority_id >= ${LOWERBOUND} AND ace1.authority_id <= ${UPPERBOUND}
    GROUP BY
       ace1.permission_id, ace1.authority_id, ace1.allowed, ace1.applies
;

--FOREACH alf_acl_member.id system.upgrade.alf_acl_member.batchsize
UPDATE alf_acl_member mem
   SET ace_id = (SELECT help.min FROM alf_access_control_entry ace
                     JOIN alf_tmp_min_ace help
                     ON		help.permission_id = ace.permission_id AND
                                help.authority_id = ace.authority_id AND 
                                help.allowed = ace.allowed AND 
                                help.applies = ace.applies 
                     WHERE ace.id = mem.ace_id)
   WHERE mem.id >= ${LOWERBOUND} AND mem.id <= ${UPPERBOUND};

CREATE INDEX fk_alf_aclm_acl ON alf_acl_member (acl_id);
CREATE INDEX fk_alf_aclm_ace ON alf_acl_member (ace_id);

DROP TABLE alf_tmp_min_ace;

-- ------------------------------------------------- --
-- Ensure stats are up to date on all schema objects --
-- ------------------------------------------------- --
begin dbms_stats.gather_schema_stats(ownname => user, options => 'GATHER AUTO', estimate_percent => dbms_stats.auto_sample_size); end;;

CREATE TABLE tmp_to_delete AS 
    SELECT 
        ace.id 
    FROM 
        alf_acl_member mem 
    RIGHT OUTER JOIN alf_access_control_entry ace ON mem.ace_id = ace.id 
    WHERE 
        mem.ace_id IS NULL;
DELETE FROM alf_access_control_entry ace WHERE EXISTS
(
   SELECT 1 FROM tmp_to_delete t WHERE ace.id = t.id
);
DROP TABLE tmp_to_delete;

-- Add constraint for duplicate acls
ALTER TABLE alf_access_control_entry
   ADD UNIQUE (permission_id, authority_id, allowed, applies, context_id);

   
ALTER TABLE alf_acl_member ADD CONSTRAINT fk_alf_aclm_acl FOREIGN KEY (acl_id) REFERENCES alf_access_control_list (id);
ALTER TABLE alf_acl_member ADD CONSTRAINT fk_alf_aclm_ace FOREIGN KEY (ace_id) REFERENCES alf_access_control_entry (id);


-- ------------------------------------------------- --
-- Ensure stats are up to date on all schema objects --
-- ------------------------------------------------- --
begin dbms_stats.gather_schema_stats(ownname => user, options => 'GATHER AUTO', estimate_percent => dbms_stats.auto_sample_size); end;;
   
--
-- Record script finish
--
DELETE FROM alf_applied_patch WHERE id = 'patch.db-V2.2-ACL-From-2.1-A';
INSERT INTO alf_applied_patch
  (id, description, fixes_from_schema, fixes_to_schema, applied_to_schema, target_schema, applied_on_date, applied_to_server, was_executed, succeeded, report)
  VALUES
  (
    'patch.db-V2.2-ACL-From-2.1-A', 'Manually executed script upgrade V2.2: Update acl schema',
    0, 82, -1, 120, null, 'UNKNOWN', ${TRUE}, ${TRUE}, 'Script completed'
  );
