--
-- Title:      Create lock tables
-- Database:   MS SQL
-- Since:      V3.2 Schema 2011
-- Author:     
--
-- Please contact support@alfresco.com if you need assistance with the upgrade.
--

CREATE TABLE alf_lock_resource
(
   id NUMERIC(19,0) IDENTITY NOT NULL,
   version NUMERIC(19,0) NOT NULL,
   qname_ns_id NUMERIC(19,0) NOT NULL,
   qname_localname NVARCHAR(255) NOT NULL,
   CONSTRAINT fk_alf_lockr_ns FOREIGN KEY (qname_ns_id) REFERENCES alf_namespace (id),
   PRIMARY KEY (id)   
);
CREATE UNIQUE INDEX idx_alf_lockr_key ON alf_lock_resource (qname_ns_id, qname_localname);

CREATE TABLE alf_lock
(
   id NUMERIC(19,0) IDENTITY NOT NULL,
   version NUMERIC(19,0) NOT NULL,
   shared_resource_id NUMERIC(19,0) NOT NULL,
   excl_resource_id NUMERIC(19,0) NOT NULL,
   lock_token NVARCHAR(36) NOT NULL,
   start_time NUMERIC(19,0) NOT NULL,
   expiry_time NUMERIC(19,0) NOT NULL,
   CONSTRAINT fk_alf_lock_shared FOREIGN KEY (shared_resource_id) REFERENCES alf_lock_resource (id),
   CONSTRAINT fk_alf_lock_excl FOREIGN KEY (excl_resource_id) REFERENCES alf_lock_resource (id),
   PRIMARY KEY (id)
);
CREATE UNIQUE INDEX idx_alf_lock_key ON alf_lock (shared_resource_id, excl_resource_id);
CREATE INDEX fk_alf_lock_excl ON alf_lock (excl_resource_id);

--
-- Record script finish
--
DELETE FROM alf_applied_patch WHERE id = 'patch.db-V3.2-LockTables';
INSERT INTO alf_applied_patch
  (id, description, fixes_from_schema, fixes_to_schema, applied_to_schema, target_schema, applied_on_date, applied_to_server, was_executed, succeeded, report)
  VALUES
  (
    'patch.db-V3.2-LockTables', 'Manually executed script upgrade V3.2: Lock Tables',
    0, 2010, -1, 2011, null, 'UNKNOWN', ${TRUE}, ${TRUE}, 'Script completed'
  );