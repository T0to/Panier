--
-- Title:      Update Content tables (pre 3.2 Enterprise Final)
-- Database:   DB2
-- Since:      V3.2 Schema 3009
-- Author:     Derek Hulley
--
-- Please contact support@alfresco.com if you need assistance with the upgrade.
--
-- This update is required for installations that have run any of the early 3.2
-- codelines i.e. anything installed or upgraded to pre-3.2 Enterprise Final.

--ASSIGN:cu_max_id=next_val
SELECT CASE WHEN MAX(id) IS NOT NULL THEN MAX(id)+1 ELSE 1 END AS next_val FROM alf_content_url;  --(optional)

CREATE TABLE t_alf_content_url
(
	id BIGINT GENERATED BY DEFAULT AS IDENTITY (START WITH ${cu_max_id}),
	content_url VARCHAR(1020) NOT NULL,
	content_url_short VARCHAR(48) NOT NULL,
	content_url_crc BIGINT NOT NULL,
	content_size BIGINT NOT NULL,
	orphan_time BIGINT,
	PRIMARY KEY(id)
);   --(optional)

INSERT INTO t_alf_content_url (id, content_url, content_url_short, content_url_crc, content_size) 
SELECT cu.id, cu.content_url, cu.content_url_short, cu.content_url_crc, cu.content_size FROM alf_content_url cu;   --(optional)

DROP TABLE alf_content_url;    --(optional)
RENAME t_alf_content_url TO alf_content_url;    --(optional)

CREATE UNIQUE INDEX idx_alf_conturl_cr ON alf_content_url (content_url_short, content_url_crc);   --(optional)
CREATE INDEX idx_alf_conturl_ot ON alf_content_url (orphan_time);   --(optional)

-- This table will not exist for upgrades from pre 3.2 to 3.2 Enterprise Final
DROP TABLE alf_content_clean;                                       --(optional)

--
-- Record script finish
--
DELETE FROM alf_applied_patch WHERE id = 'patch.db-V3.2-ContentTables2';
INSERT INTO alf_applied_patch
  (id, description, fixes_from_schema, fixes_to_schema, applied_to_schema, target_schema, applied_on_date, applied_to_server, was_executed, succeeded, report)
  VALUES
  (
    'patch.db-V3.2-ContentTables2', 'Manually executed script upgrade V3.2: Content Tables 2 (pre 3.2 Enterprise Final)',
    0, 3008, -1, 3009, null, 'UNKOWN', ${TRUE}, ${TRUE}, 'Script completed'
  );