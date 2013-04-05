--
-- Title:      Clean duplicate alf_node_status entries
-- Database:   Oracle
-- Since:      V3.1 schema 1011
-- Author:     Derek Hulley
--
-- Please contact support@alfresco.com if you need assistance with the upgrade.
--
-- Cleans out duplicate alf_node_status entries for V2.1 installations.
-- This script does not need to run if the server has already been upgraded to schema 90 or later

CREATE TABLE t_node_status
   (
      node_id NUMBER(19,0),
      transaction_id NUMBER(19,0),
      PRIMARY KEY (node_id)
   );

--FOREACH alf_node_status.node_id system.upgrade.t_node_status.batchsize
INSERT INTO t_node_status
   SELECT
      ns.node_id, max(ns.transaction_id) FROM alf_node_status ns
   WHERE
      node_id >= ${LOWERBOUND} AND node_id <= ${UPPERBOUND}
   GROUP BY node_id
   HAVING COUNT(node_id) > 1; 

--FOREACH alf_node_status.node_id system.upgrade.alf_node_status.batchsize
DELETE FROM alf_node_status ns WHERE EXISTS 
   (
      SELECT 1 FROM t_node_status tns WHERE tns.node_id = ns.node_id
   )
   AND ns.node_id >= ${LOWERBOUND} AND ns.node_id <= ${UPPERBOUND}
;
--FOREACH t_node_status.node_id system.upgrade.alf_node_status.batchsize
INSERT INTO alf_node_status (protocol, identifier, guid, node_id, transaction_id, version)
   (
      SELECT n.protocol, n.identifier, n.uuid, n.id, tns.transaction_id, 0 
      FROM t_node_status tns join alf_node n on (n.id = tns.node_id)
      WHERE tns.node_id >= ${LOWERBOUND} AND tns.node_id <= ${UPPERBOUND}
   );

DROP TABLE t_node_status;

--FOREACH alf_transaction.id system.upgrade.alf_transaction.batchsize
DELETE FROM alf_node_status WHERE node_id IS NULL
AND transaction_id >= ${LOWERBOUND} AND transaction_id <= ${UPPERBOUND};

--FOREACH alf_node_status.node_id system.upgrade.alf_node_status.batchsize
UPDATE alf_node_status ns set ns.protocol =
  (
    SELECT n.protocol FROM alf_node n WHERE n.id = ns.node_id
  )
WHERE node_id >= ${LOWERBOUND} AND node_id <= ${UPPERBOUND};

--FOREACH alf_transaction.id system.upgrade.alf_transaction.batchsize
DELETE FROM alf_transaction atr WHERE NOT EXISTS 
   (
      SELECT 1 FROM alf_node_status ans WHERE ans.transaction_id = atr.id
   )
   AND atr.id >= ${LOWERBOUND} AND atr.id <= ${UPPERBOUND}
;

--
-- Record script finish
--
DELETE FROM alf_applied_patch WHERE id = 'patch.db-V2.2-CleanNodeStatuses';
INSERT INTO alf_applied_patch
  (id, description, fixes_from_schema, fixes_to_schema, applied_to_schema, target_schema, applied_on_date, applied_to_server, was_executed, succeeded, report)
  VALUES
  (
    'patch.db-V2.2-CleanNodeStatuses', 'Manually executed script upgrade V2.2: Clean alf_node_status table',
     0, 89, -1, 90, null, 'UNKOWN', ${true}, ${true}, 'Script completed'
   );
