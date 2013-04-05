--
-- Title:      Update for permissions schema changes
-- Database:   SQL Server
-- Since:      V2.2 Schema 85
-- Author:     Andy Hind
--
-- Please contact support@alfresco.com if you need assistance with the upgrade.
--

CREATE TABLE alf_acl_change_set
(
   id NUMERIC(19,0) IDENTITY NOT NULL,
   version NUMERIC(19,0) NOT NULL,
   PRIMARY KEY (id)
);

-- Add to ACL
ALTER TABLE alf_access_control_list ADD
   type INT NOT NULL DEFAULT 0,
   latest TINYINT NOT NULL DEFAULT 1,
   acl_id NVARCHAR(36) NOT NULL DEFAULT 'UNSET',
   acl_version NUMERIC(19,0) NOT NULL DEFAULT 1,
   inherited_acl NUMERIC(19,0) NULL,
   is_versioned TINYINT NOT NULL DEFAULT 0,
   requires_version TINYINT NOT NULL DEFAULT 0,
   acl_change_set NUMERIC(19,0) NULL,
   inherits_from NUMERIC(19,0) NULL,
   CONSTRAINT fk_alf_acl_acs FOREIGN KEY (acl_change_set) REFERENCES alf_acl_change_set (id);
CREATE INDEX fk_alf_acl_acs ON alf_access_control_list (acl_change_set);
CREATE INDEX idx_alf_acl_inh ON alf_access_control_list (inherits, inherits_from);

--FOREACH alf_access_control_list.id system.upgrade.alf_access_control_list.batchsize
UPDATE alf_access_control_list
   set acl_id = id
   where id >= ${LOWERBOUND} and id <= ${UPPERBOUND};

ALTER TABLE alf_access_control_list
   ADD UNIQUE (acl_id, latest, acl_version);

-- restructure authority
CREATE TABLE t_alf_authority
(
   id NUMERIC(19,0) identity NOT NULL,
   version NUMERIC(19,0) NOT NULL,
   authority NVARCHAR(100) NULL,
   crc NUMERIC(19,0) NULL,
   PRIMARY KEY (id),
   UNIQUE (authority, crc)
);
CREATE INDEX idx_alf_auth_aut ON t_alf_authority (authority);
INSERT INTO t_alf_authority (version, authority)
   SELECT version, recipient FROM alf_authority;

-- Create ACE context
CREATE TABLE alf_ace_context
(
   id NUMERIC(19,0) identity NOT NULL,
   version NUMERIC(19,0) NOT NULL,
   class_context NVARCHAR(1024) NULL,
   property_context NVARCHAR(1024) NULL,
   kvp_context NVARCHAR(1024) NULL,
   PRIMARY KEY (id)
 );

-- Extend ACE
create table t_alf_access_control_entry
(
   id NUMERIC(19,0) identity NOT NULL,
   version NUMERIC(19,0) NOT NULL,
   acl_id NUMERIC(19,0) NOT NULL,
   permission_id NUMERIC(19,0) NOT NULL,
   allowed TINYINT NOT NULL, 
   authority_id NUMERIC(19,0) NOT NULL DEFAULT -1,
   applies INT NOT NULL DEFAULT 0,
   context_id NUMERIC(19,0) NULL,
   PRIMARY KEY (id),
   CONSTRAINT fk_alf_ace_auth FOREIGN KEY (authority_id) REFERENCES t_alf_authority (id),
   CONSTRAINT fk_alf_ace_perm FOREIGN KEY (permission_id) REFERENCES alf_permission (id),
   CONSTRAINT fk_alf_ace_ctx FOREIGN KEY (context_id) REFERENCES alf_ace_context (id)
);
CREATE INDEX fk_alf_ace_auth ON t_alf_access_control_entry (authority_id);
CREATE INDEX fk_alf_ace_perm ON t_alf_access_control_entry (permission_id);
CREATE INDEX fk_alf_ace_ctx ON t_alf_access_control_entry (context_id);
   
-- Create ACL member list
CREATE TABLE alf_acl_member
(
   id NUMERIC(19,0) identity NOT NULL,
   version NUMERIC(19,0) NOT NULL,
   acl_id NUMERIC(19,0) NOT NULL,
   ace_id NUMERIC(19,0) NOT NULL,
   pos INT NOT NULL,
   CONSTRAINT fk_alf_aclm_acl FOREIGN KEY (acl_id) REFERENCES alf_access_control_list (id),
   CONSTRAINT fk_alf_aclm_ace FOREIGN KEY (ace_id) REFERENCES t_alf_access_control_entry (id),
   PRIMARY KEY (id),
   UNIQUE(acl_id, ace_id, pos)
);
CREATE INDEX fk_alf_aclm_acl ON alf_acl_member (acl_id);
CREATE INDEX fk_alf_aclm_ace ON alf_acl_member (ace_id);

-- remove unused
DROP TABLE alf_auth_ext_keys;

-- migrate data - fix up FK refs to authority
--FOREACH alf_access_control_entry.id system.upgrade.t_alf_access_control_entry.batchsize
INSERT INTO t_alf_access_control_entry (version, acl_id, permission_id, allowed, authority_id)
SELECT ace.version, ace.acl_id, ace.permission_id, ace.allowed, a.id
FROM alf_access_control_entry ace, t_alf_authority a
WHERE a.authority = ace.authority_id AND ace.id >= ${LOWERBOUND} AND ace.id <= ${UPPERBOUND}; 

-- migrate data - build equivalent ACL entries
--FOREACH alf_access_control_list.id system.upgrade.alf_acl_member.batchsize
INSERT INTO alf_acl_member (version, acl_id, ace_id, pos)
   SELECT 1, ace.acl_id, ace.id, 0 
   FROM t_alf_access_control_entry ace JOIN alf_access_control_list acl ON acl.id = ace.acl_id
   WHERE acl.id >= ${LOWERBOUND} AND acl.id <= ${UPPERBOUND};

-- Create auth aliases table
CREATE TABLE alf_authority_alias
(
   id NUMERIC(19,0) identity NOT NULL,
   version NUMERIC(19,0) NOT NULL,
   auth_id NUMERIC(19,0) NOT NULL,
   alias_id NUMERIC(19,0) NOT NULL,
   CONSTRAINT fk_alf_autha_ali FOREIGN KEY (alias_id) REFERENCES t_alf_authority (id),
   CONSTRAINT fk_alf_autha_aut FOREIGN KEY (auth_id) REFERENCES t_alf_authority (id),
   PRIMARY KEY (id),
   UNIQUE (auth_id, alias_id)
) ;
CREATE INDEX fk_alf_autha_ali ON alf_authority_alias (alias_id);
CREATE INDEX fk_alf_autha_aut ON alf_authority_alias (auth_id);

-- Tidy up unused cols on ace table
ALTER TABLE t_alf_access_control_entry DROP 
   COLUMN acl_id;

DROP TABLE alf_access_control_entry;
EXEC sp_rename 't_alf_access_control_entry', 'alf_access_control_entry';

DROP TABLE alf_authority;
EXEC sp_rename 't_alf_authority', 'alf_authority';

CREATE TABLE alf_tmp_min_ace
(
   min NUMERIC(19,0) NOT NULL,
   permission_id NUMERIC(19,0) NOT NULL,
   authority_id NUMERIC(19,0) NOT NULL,
   allowed TINYINT NOT NULL,
   applies INT NOT NULL,
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
   
-- Update members to point to the first use of an access control entry
--FOREACH alf_acl_member.id system.upgrade.alf_acl_member.batchsize
UPDATE alf_acl_member
   SET ace_id = (SELECT help.min FROM alf_access_control_entry ace 
                     JOIN alf_tmp_min_ace help
                     ON      help.permission_id = ace.permission_id AND
                                help.authority_id = ace.authority_id AND 
                                help.allowed = ace.allowed AND 
                                help.applies = ace.applies 
                     WHERE ace.id = alf_acl_member.ace_id)
   WHERE alf_acl_member.id >= ${LOWERBOUND} AND alf_acl_member.id <= ${UPPERBOUND};

DROP TABLE alf_tmp_min_ace;

-- Remove duplicate aces the mysql way (as you can not use the deleted table in the where clause ...)
CREATE TABLE tmp_to_delete (
   id NUMERIC(19,0),
   PRIMARY KEY (id)
);
INSERT INTO tmp_to_delete
   SELECT ace.id FROM alf_acl_member mem RIGHT OUTER JOIN alf_access_control_entry ace ON mem.ace_id = ace.id WHERE mem.ace_id IS NULL
;
DELETE FROM alf_access_control_entry WHERE id IN (SELECT id FROM tmp_to_delete);
DROP TABLE tmp_to_delete;

-- Add constraint for duplicate acls

ALTER TABLE alf_access_control_entry
   ADD UNIQUE (permission_id, authority_id, allowed, applies, context_id);

--
-- Record script finish
--
DELETE FROM alf_applied_patch WHERE id = 'patch.db-V2.2-ACL';
INSERT INTO alf_applied_patch
  (id, description, fixes_from_schema, fixes_to_schema, applied_to_schema, target_schema, applied_on_date, applied_to_server, was_executed, succeeded, report)
  VALUES
  (
    'patch.db-V2.2-ACL', 'Manually executed script upgrade V2.2: Update acl schema',
    0, 119, -1, 120, NULL, 'UNKNOWN', ${TRUE}, ${TRUE}, 'Script completed'
  );