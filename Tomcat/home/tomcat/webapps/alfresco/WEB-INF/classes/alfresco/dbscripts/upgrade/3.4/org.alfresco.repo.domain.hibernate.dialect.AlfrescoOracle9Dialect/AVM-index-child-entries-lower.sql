--
-- Title:      Upgrade to V3.4 - AVM rename duplicates (if any)
-- Database:   Oracle
-- Since:      V3.4 schema 4209
-- Author:     dward
--
-- Please contact support@alfresco.com if you need assistance with the upgrade.
--

CREATE TABLE t_avm_child_entries (
    parent_id NUMBER(19,0) NOT NULL,
    lc_name VARCHAR2(160 CHAR) NOT NULL,
    name VARCHAR2(160 CHAR) NOT NULL,
    child_id NUMBER(19,0) NOT NULL,
    PRIMARY KEY (parent_id, lc_name)
);

--FOREACH avm_child_entries.child_id system.upgrade.t_avm_child_entries.batchsize
INSERT INTO t_avm_child_entries (parent_id, lc_name, name, child_id)
SELECT parent_id, LOWER(name), name, child_id
FROM avm_child_entries
WHERE child_id >= ${LOWERBOUND} AND child_id <= ${UPPERBOUND};

DROP TABLE avm_child_entries;
ALTER TABLE t_avm_child_entries RENAME TO avm_child_entries;

ALTER TABLE avm_child_entries        
    ADD CONSTRAINT fk_avm_ce_child
    FOREIGN KEY (child_id)
    REFERENCES avm_nodes (id);
CREATE INDEX fk_avm_ce_child ON avm_child_entries (child_id);

ALTER TABLE avm_child_entries        
    ADD CONSTRAINT fk_avm_ce_parent
    FOREIGN KEY (parent_id)
    REFERENCES avm_nodes (id);
CREATE INDEX fk_avm_ce_parent ON avm_child_entries (parent_id);

CREATE INDEX idx_avm_ce_lc_name ON avm_child_entries (lc_name, parent_id);

--
-- Record script finish
--
DELETE FROM alf_applied_patch WHERE id = 'patch.db-V3.4-AVM-index-child-entries-lower';
INSERT INTO alf_applied_patch
  (id, description, fixes_from_schema, fixes_to_schema, applied_to_schema, target_schema, applied_on_date, applied_to_server, was_executed, succeeded, report)
  VALUES
  (
    'patch.db-V3.4-AVM-index-child-entries-lower', 'Manually executed script upgrade V3.4',
     0, 5027, -1, 5028, null, 'UNKNOWN', ${TRUE}, ${TRUE}, 'Script completed'
   );
