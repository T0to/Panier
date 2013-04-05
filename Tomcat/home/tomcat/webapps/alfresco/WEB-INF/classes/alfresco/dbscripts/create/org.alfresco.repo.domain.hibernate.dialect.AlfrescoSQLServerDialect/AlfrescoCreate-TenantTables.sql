--
-- Title:      Tenant tables
-- Database:   MS SQL
-- Since:      V4.0 Schema 5030
-- Author:     janv
--
-- Please contact support@alfresco.com if you need assistance with the upgrade.
--

CREATE TABLE alf_tenant (
  tenant_domain NVARCHAR(75) NOT NULL,
  version NUMERIC(19,0) NOT NULL,
  enabled TINYINT NOT NULL,
  tenant_name NVARCHAR(75),
  content_root NVARCHAR(255),
  db_url NVARCHAR(255),
  PRIMARY KEY (tenant_domain)
);

--
-- Record script finish
--
DELETE FROM alf_applied_patch WHERE id = 'patch.db-V4.0-TenantTables';
INSERT INTO alf_applied_patch
  (id, description, fixes_from_schema, fixes_to_schema, applied_to_schema, target_schema, applied_on_date, applied_to_server, was_executed, succeeded, report)
  VALUES
  (
    'patch.db-V4.0-TenantTables', 'Manually executed script upgrade V4.0: Tenant Tables',
    0, 5029, -1, 5030, null, 'UNKNOWN', ${TRUE}, ${TRUE}, 'Script completed'
  );