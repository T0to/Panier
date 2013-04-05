--
-- Title:      Create AVM tables
-- Database:   Oracle
-- Since:      V3.2.0 Schema 3002
-- Author:     Pavel Yurkevich
--
-- Please contact support@alfresco.com if you need assistance with the upgrade.
--

    CREATE TABLE avm_aspects (
        node_id NUMBER(19,0) NOT NULL,
        qname_id NUMBER(19,0) NOT NULL,
        PRIMARY KEY (node_id, qname_id)
    );

    CREATE TABLE avm_child_entries (
        parent_id NUMBER(19,0) NOT NULL,
        lc_name VARCHAR2(160 CHAR) NOT NULL,
        name VARCHAR2(160 CHAR) NOT NULL,
        child_id NUMBER(19,0) NOT NULL,
        PRIMARY KEY (parent_id, lc_name)
    );

    CREATE TABLE avm_history_links (
        ancestor NUMBER(19,0) NOT NULL,
        descendent NUMBER(19,0) NOT NULL,
        PRIMARY KEY (ancestor, descendent)
    );

    CREATE TABLE avm_merge_links (
        mfrom NUMBER(19,0) NOT NULL,
        mto NUMBER(19,0) NOT NULL,
        PRIMARY KEY (mfrom, mto)
    );

    CREATE TABLE avm_node_properties (
        node_id NUMBER(19,0) NOT NULL,
        actual_type_n NUMBER(10,0) NOT NULL,
        persisted_type_n NUMBER(10,0) NOT NULL,
        multi_valued NUMBER(1,0) NOT NULL,
        boolean_value NUMBER(1,0),
        long_value NUMBER(19,0),
        FLOAT_value FLOAT,
        DOUBLE_value DOUBLE PRECISION,
        string_value VARCHAR2(1024 CHAR),
        serializable_value BLOB,
        qname_id NUMBER(19,0) NOT NULL,
        PRIMARY KEY (node_id, qname_id)
    );

    CREATE SEQUENCE avm_nodes_seq START WITH 1 INCREMENT BY 1 ORDER;
    CREATE TABLE avm_nodes (
        id NUMBER(19,0) NOT NULL,
        class_type VARCHAR2(20 CHAR) NOT NULL,
        vers NUMBER(19,0) NOT NULL,
        version_id NUMBER(10,0) NOT NULL,
        guid VARCHAR2(36 CHAR),
        creator VARCHAR2(255 CHAR) NOT NULL,
        owner VARCHAR2(255 CHAR) NOT NULL,
        lastModifier VARCHAR2(255 CHAR) NOT NULL,
        createDate NUMBER(19,0) NOT NULL,
        modDate NUMBER(19,0) NOT NULL,
        accessDate NUMBER(19,0) NOT NULL,
        is_root NUMBER(1,0),
        store_new_id NUMBER(19,0),
        acl_id NUMBER(19,0),
        deletedType NUMBER(10,0),
        layer_id NUMBER(19,0),
        indirection VARCHAR2(1024 CHAR),
        indirection_version NUMBER(10,0),
        primary_indirection NUMBER(1,0),
        opacity NUMBER(1,0),
        content_url VARCHAR2(128 CHAR),
        mime_type VARCHAR2(100 CHAR),
        encoding VARCHAR2(16 CHAR),
        length NUMBER(19,0),
        PRIMARY KEY (id)
    );

    CREATE SEQUENCE avm_store_properties_seq START WITH 1 INCREMENT BY 1 ORDER;
    CREATE TABLE avm_store_properties (
        id NUMBER(19,0) NOT NULL,
        avm_store_id NUMBER(19,0),
        qname_id NUMBER(19,0) NOT NULL,
        actual_type_n NUMBER(10,0) NOT NULL,
        persisted_type_n NUMBER(10,0) NOT NULL,
        multi_valued NUMBER(1,0) NOT NULL,
        boolean_value NUMBER(1,0),
        long_value NUMBER(19,0),
        FLOAT_value FLOAT,
        DOUBLE_value DOUBLE PRECISION,
        string_value VARCHAR2(1024 CHAR),
        serializable_value BLOB,
        PRIMARY KEY (id)
    );
		
    CREATE SEQUENCE avm_stores_seq START WITH 1 INCREMENT BY 1 ORDER;
    CREATE TABLE avm_stores (
        id NUMBER(19,0) NOT NULL,
        vers NUMBER(19,0) NOT NULL,
        name VARCHAR2(255 CHAR) UNIQUE,
        next_version_id NUMBER(10,0) NOT NULL,
        current_root_id NUMBER(19,0),
        acl_id NUMBER(19,0),
        PRIMARY KEY (id)
    );
		
    CREATE TABLE avm_version_layered_node_entry (
        version_root_id NUMBER(19,0) NOT NULL,
        md5sum VARCHAR2(32 CHAR) NOT NULL,
        path VARCHAR2(1024 CHAR),
        PRIMARY KEY (version_root_id, md5sum)
    );

    CREATE SEQUENCE avm_version_roots_seq START WITH 1 INCREMENT BY 1 ORDER;
    CREATE TABLE avm_version_roots (
        id NUMBER(19,0) NOT NULL,
        version_id NUMBER(10,0) NOT NULL,
        avm_store_id NUMBER(19,0) NOT NULL,
        create_date NUMBER(19,0) NOT NULL,
        creator VARCHAR2(255 CHAR) NOT NULL,
        root_id NUMBER(19,0) NOT NULL,
        tag VARCHAR2(255 CHAR),
        description VARCHAR2(1024 CHAR),
        PRIMARY KEY (id),
        UNIQUE (version_id, avm_store_id)
    );
	
    ALTER TABLE avm_aspects        
        ADD CONSTRAINT fk_avm_nasp_n
        FOREIGN KEY (node_id)
        REFERENCES avm_nodes (id);
	CREATE INDEX fk_avm_nasp_n ON avm_aspects (node_id);

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

    ALTER TABLE avm_history_links        
        ADD CONSTRAINT fk_avm_hl_desc
        FOREIGN KEY (descendent)
        REFERENCES avm_nodes (id);

	CREATE INDEX fk_avm_hl_desc ON avm_history_links (descendent);

    ALTER TABLE avm_history_links        
        ADD CONSTRAINT fk_avm_hl_ancestor
        FOREIGN KEY (ancestor)
        REFERENCES avm_nodes (id);

	CREATE INDEX fk_avm_hl_ancestor ON avm_history_links (ancestor);

    ALTER TABLE avm_merge_links        
        ADD CONSTRAINT fk_avm_ml_from
        FOREIGN KEY (mfrom)
        REFERENCES avm_nodes (id);

	CREATE INDEX fk_avm_ml_from ON avm_merge_links (mfrom);

    ALTER TABLE avm_merge_links        
        ADD CONSTRAINT fk_avm_ml_to
        FOREIGN KEY (mto)
        REFERENCES avm_nodes (id);

	CREATE INDEX fk_avm_ml_to ON avm_merge_links (mto);

    ALTER TABLE avm_node_properties
        ADD CONSTRAINT fk_avm_nprop_n
        FOREIGN KEY (node_id)
        REFERENCES avm_nodes (id);

    CREATE INDEX fk_avm_nprop_n ON avm_node_properties (node_id);

    CREATE INDEX idx_avm_n_pi ON avm_nodes (primary_indirection);

    ALTER TABLE avm_nodes        
        ADD CONSTRAINT fk_avm_n_acl
        FOREIGN KEY (acl_id)
        REFERENCES alf_access_control_list (id);

	CREATE INDEX fk_avm_n_acl ON avm_nodes (acl_id);

    ALTER TABLE avm_nodes        
        ADD CONSTRAINT fk_avm_n_store
        FOREIGN KEY (store_new_id)
        REFERENCES avm_stores (id);

	CREATE INDEX fk_avm_n_store ON avm_nodes (store_new_id);

    ALTER TABLE avm_store_properties        
        ADD CONSTRAINT fk_avm_sprop_store
        FOREIGN KEY (avm_store_id)
        REFERENCES avm_stores (id);

	CREATE INDEX fk_avm_sprop_store ON avm_store_properties (avm_store_id);

    ALTER TABLE avm_stores        
        ADD CONSTRAINT fk_avm_s_root
        FOREIGN KEY (current_root_id)
        REFERENCES avm_nodes (id);

	CREATE INDEX fk_avm_s_root ON avm_stores (current_root_id);

    ALTER TABLE avm_stores        
        ADD CONSTRAINT fk_avm_s_acl
        FOREIGN KEY (acl_id)
        REFERENCES alf_access_control_list (id);

	CREATE INDEX fk_avm_s_acl ON avm_stores (acl_id);

    ALTER TABLE avm_version_layered_node_entry        
        ADD CONSTRAINT fk_avm_vlne_vr
        FOREIGN KEY (version_root_id)
        REFERENCES avm_version_roots (id);

	CREATE INDEX fk_avm_vlne_vr ON avm_version_layered_node_entry (version_root_id);

    CREATE INDEX idx_avm_vr_version ON avm_version_roots (version_id);

    ALTER TABLE avm_version_roots        
        ADD CONSTRAINT fk_avm_vr_store
        FOREIGN KEY (avm_store_id)
        REFERENCES avm_stores (id);

	CREATE INDEX fk_avm_vr_store ON avm_version_roots (avm_store_id);

    ALTER TABLE avm_version_roots        
        ADD CONSTRAINT fk_avm_vr_root
        FOREIGN KEY (root_id)
        REFERENCES avm_nodes (id);

	CREATE INDEX fk_avm_vr_root ON avm_version_roots (root_id);
        
CREATE INDEX fk_avm_nasp_qn ON avm_aspects (qname_id);
ALTER TABLE avm_aspects ADD CONSTRAINT fk_avm_nasp_qn FOREIGN KEY (qname_id) REFERENCES alf_qname (id);

CREATE INDEX fk_avm_nprop_qn ON avm_node_properties (qname_id);
ALTER TABLE avm_node_properties ADD CONSTRAINT fk_avm_nprop_qn FOREIGN KEY (qname_id) REFERENCES alf_qname (id);

CREATE INDEX fk_avm_sprop_qname ON avm_store_properties (qname_id);
ALTER TABLE avm_store_properties ADD CONSTRAINT fk_avm_sprop_qname FOREIGN KEY (qname_id) REFERENCES alf_qname (id);

CREATE INDEX idx_avm_hl_revpk ON avm_history_links (descendent, ancestor);

CREATE INDEX idx_avm_vr_revuq ON avm_version_roots (avm_store_id, version_id);

CREATE INDEX idx_avm_ce_lc_name ON avm_child_entries (lc_name, parent_id);

--
-- Record script finish
--
DELETE FROM alf_applied_patch WHERE id = 'patch.db-V3.2-AvmTables';
INSERT INTO alf_applied_patch
  (id, description, fixes_from_schema, fixes_to_schema, applied_to_schema, target_schema, applied_on_date, applied_to_server, was_executed, succeeded, report)
  VALUES
  (
    'patch.db-V3.2-AvmTables', 'Manually executed script upgrade V3.2: AVM Tables',
    0, 3001, -1, 3002, null, 'UNKNOWN', ${TRUE}, ${TRUE}, 'Script completed'
  );