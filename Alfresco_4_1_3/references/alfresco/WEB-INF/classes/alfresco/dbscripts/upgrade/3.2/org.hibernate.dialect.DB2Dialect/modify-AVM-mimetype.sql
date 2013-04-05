--
-- Title:      Upgrade to V3.2 - modify AVM mimetype
-- Database:   DB2
-- Since:      V3.2 schema 2017
-- Author:     
--
--  modify AVM mimetype (increase column size)
--
-- Please contact support@alfresco.com if you need assistance with the upgrade.
--

ALTER TABLE avm_nodes ALTER COLUMN mime_type SET DATA TYPE VARCHAR(400);

--
-- Record script finish
--
DELETE FROM alf_applied_patch WHERE id = 'patch.db-V3.2-Modify-AVM-MimeType';
INSERT INTO alf_applied_patch
  (id, description, fixes_from_schema, fixes_to_schema, applied_to_schema, target_schema, applied_on_date, applied_to_server, was_executed, succeeded, report)
  VALUES
  (
    'patch.db-V3.2-Modify-AVM-MimeType', 'Manually executed script upgrade V3.2 to modify AVM mimetype',
     0, 2016, -1, 2017, null, 'UNKNOWN', ${TRUE}, ${TRUE}, 'Script completed'
   );
