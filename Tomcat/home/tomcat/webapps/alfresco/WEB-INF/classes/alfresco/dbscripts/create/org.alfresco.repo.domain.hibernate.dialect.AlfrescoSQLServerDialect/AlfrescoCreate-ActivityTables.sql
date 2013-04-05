--
-- Title:      Activity tables
-- Database:   MS SQL
-- Since:      V3.0 Schema 126
-- Author:     janv
--
-- Please contact support@alfresco.com if you need assistance with the upgrade.
--

CREATE TABLE alf_activity_feed
(
    id NUMERIC(19,0) IDENTITY NOT NULL,
    post_id NUMERIC(19,0),
    post_date DATETIME NOT NULL,
    activity_summary NVARCHAR(1024),
    feed_user_id NVARCHAR(255),
    activity_type NVARCHAR(255) NOT NULL,
    activity_format NVARCHAR(10),
    site_network NVARCHAR(255),
    app_tool NVARCHAR(36),
    post_user_id NVARCHAR(255) NOT NULL,
    feed_date DATETIME NOT NULL,
    PRIMARY KEY (id)
);
CREATE INDEX feed_postdate_idx ON alf_activity_feed (post_date);
CREATE INDEX feed_postuserid_idx ON alf_activity_feed (post_user_id);
CREATE INDEX feed_feeduserid_idx ON alf_activity_feed (feed_user_id);
CREATE INDEX feed_sitenetwork_idx ON alf_activity_feed (site_network);
CREATE INDEX feed_activityformat_idx ON alf_activity_feed (activity_format);

CREATE TABLE alf_activity_feed_control
(
    id NUMERIC(19,0) IDENTITY NOT NULL,
    feed_user_id NVARCHAR(255) NOT NULL,
    site_network NVARCHAR(255),
    app_tool NVARCHAR(36),
    last_modified DATETIME NOT NULL,
    PRIMARY KEY (id)
);
CREATE INDEX feedctrl_feeduserid_idx ON alf_activity_feed_control (feed_user_id);

CREATE TABLE alf_activity_post
(
    sequence_id NUMERIC(19,0) IDENTITY NOT NULL,
    post_date DATETIME NOT NULL,
    status NVARCHAR(10) NOT NULL,
    activity_data NVARCHAR(1024) NOT NULL,
    post_user_id NVARCHAR(255) NOT NULL,
    job_task_node INT NOT NULL,
    site_network NVARCHAR(255),
    app_tool NVARCHAR(36),
    activity_type NVARCHAR(255) NOT NULL,
    last_modified DATETIME NOT NULL,
    PRIMARY KEY (sequence_id)
);
CREATE INDEX post_jobtasknode_idx ON alf_activity_post (job_task_node);
CREATE INDEX post_status_idx ON alf_activity_post (status);


--
-- Record script finish
--
DELETE FROM alf_applied_patch WHERE id = 'patch.db-V3.0-ActivityTables';
INSERT INTO alf_applied_patch
  (id, description, fixes_from_schema, fixes_to_schema, applied_to_schema, target_schema, applied_on_date, applied_to_server, was_executed, succeeded, report)
  VALUES
  (
    'patch.db-V3.0-ActivityTables', 'Manually executed script upgrade V3.0: Activity Tables',
    0, 125, -1, 126, null, 'UNKNOWN', ${TRUE}, ${TRUE}, 'Script completed'
  );