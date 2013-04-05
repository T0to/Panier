--
-- Title:      Create AVM tables
-- Database:   MS SQL
-- Since:      V3.2.0 Schema 3002
-- Author:     Pavel Yurkevich
--
-- Please contact support@alfresco.com if you need assistance with the upgrade.
--

    create table avm_aspects (
        node_id numeric(19,0) not null,
        qname_id numeric(19,0) not null,
        primary key (node_id, qname_id)
    );

    create table avm_child_entries (
        parent_id numeric(19,0) not null,
        lc_name nvarchar(160) not null,
        name nvarchar(160) not null,
        child_id numeric(19,0) not null,
        primary key (parent_id, lc_name)
    );

    create table avm_history_links (
        ancestor numeric(19,0) not null,
        descendent numeric(19,0) not null,
        primary key (ancestor, descendent)
    );

    create table avm_merge_links (
        mfrom numeric(19,0) not null,
        mto numeric(19,0) not null,
        primary key (mfrom, mto)
    );

    create table avm_node_properties (
        node_id numeric(19,0) not null,
        actual_type_n int not null,
        persisted_type_n int not null,
        multi_valued tinyint not null,
        boolean_value tinyint,
        long_value numeric(19,0),
        float_value float,
        double_value double precision,
        string_value nvarchar(1024),
        serializable_value image,
        qname_id numeric(19,0) not null,
        primary key (node_id, qname_id)
    );

    create table avm_nodes (
        id numeric(19,0) identity not null,
        class_type nvarchar(20) not null,
        vers numeric(19,0) not null,
        version_id int not null,
        guid nvarchar(36),
        creator nvarchar(255) not null,
        owner nvarchar(255) not null,
        lastModifier nvarchar(255) not null,
        createDate numeric(19,0) not null,
        modDate numeric(19,0) not null,
        accessDate numeric(19,0) not null,
        is_root tinyint,
        store_new_id numeric(19,0),
        acl_id numeric(19,0),
        deletedType int,
        layer_id numeric(19,0),
        indirection nvarchar(1024),
        indirection_version int,
        primary_indirection tinyint,
        opacity tinyint,
        content_url nvarchar(128),
        mime_type nvarchar(100),
        encoding nvarchar(16),
        length numeric(19,0),
        primary key (id)
    );

    create table avm_store_properties (
        id numeric(19,0) identity not null,
        avm_store_id numeric(19,0),
        qname_id numeric(19,0) not null,
        actual_type_n int not null,
        persisted_type_n int not null,
        multi_valued tinyint not null,
        boolean_value tinyint,
        long_value numeric(19,0),
        float_value float,
        double_value double precision,
        string_value nvarchar(1024),
        serializable_value image,
        primary key (id)
    );

    create table avm_stores (
        id numeric(19,0) identity not null,
        vers numeric(19,0) not null,
        name nvarchar(255) unique,
        next_version_id int not null,
        current_root_id numeric(19,0),
        acl_id numeric(19,0),
        primary key (id)
    );

    create table avm_version_layered_node_entry (
        version_root_id numeric(19,0) not null,
        md5sum nvarchar(32) not null,
        path nvarchar(1024),
        primary key (version_root_id, md5sum)
    );

    create table avm_version_roots (
        id numeric(19,0) identity not null,
        version_id int not null,
        avm_store_id numeric(19,0) not null,
        create_date numeric(19,0) not null,
        creator nvarchar(255) not null,
        root_id numeric(19,0) not null,
        tag nvarchar(255),
        description nvarchar(1024),
        primary key (id),
        unique (version_id, avm_store_id)
    );

    alter table avm_aspects        
        add constraint fk_avm_nasp_n
        foreign key (node_id)
        references avm_nodes (id);
	create index fk_avm_nasp_n on avm_aspects (node_id);

    alter table avm_child_entries        
        add constraint fk_avm_ce_child
        foreign key (child_id)
        references avm_nodes (id);
	create index fk_avm_ce_child on avm_child_entries (child_id);

    alter table avm_child_entries        
        add constraint fk_avm_ce_parent
        foreign key (parent_id)
        references avm_nodes (id);
	create index fk_avm_ce_parent on avm_child_entries (parent_id);

    alter table avm_history_links        
        add constraint fk_avm_hl_desc
        foreign key (descendent)
        references avm_nodes (id);
	create index fk_avm_hl_desc on avm_history_links (descendent);

    alter table avm_history_links        
        add constraint fk_avm_hl_ancestor
        foreign key (ancestor)
        references avm_nodes (id);
	create index fk_avm_hl_ancestor on avm_history_links (ancestor);

    alter table avm_merge_links        
        add constraint fk_avm_ml_from
        foreign key (mfrom)
        references avm_nodes (id);
	create index fk_avm_ml_from on avm_merge_links (mfrom);

    alter table avm_merge_links        
        add constraint fk_avm_ml_to
        foreign key (mto)
        references avm_nodes (id);
	create index fk_avm_ml_to on avm_merge_links (mto);

    alter table avm_node_properties        
        add constraint fk_avm_nprop_n
        foreign key (node_id)
        references avm_nodes (id);
	create index fk_avm_nprop_n on avm_node_properties (node_id);

    create index idx_avm_n_pi on avm_nodes (primary_indirection);

    alter table avm_nodes        
        add constraint fk_avm_n_acl
        foreign key (acl_id)
        references alf_access_control_list (id);
	create index fk_avm_n_acl on avm_nodes (acl_id);

    alter table avm_nodes        
        add constraint fk_avm_n_store
        foreign key (store_new_id)
        references avm_stores (id);
	create index fk_avm_n_store on avm_nodes (store_new_id);

    alter table avm_store_properties        
        add constraint fk_avm_sprop_store
        foreign key (avm_store_id)
        references avm_stores (id);
	create index fk_avm_sprop_store on avm_store_properties (avm_store_id);

    alter table avm_stores        
        add constraint fk_avm_s_root
        foreign key (current_root_id)
        references avm_nodes (id);
	create index fk_avm_s_root on avm_stores (current_root_id);

    alter table avm_stores        
        add constraint fk_avm_s_acl
        foreign key (acl_id)
        references alf_access_control_list (id);
	create index fk_avm_s_acl on avm_stores (acl_id);

    alter table avm_version_layered_node_entry        
        add constraint fk_avm_vlne_vr
        foreign key (version_root_id)
        references avm_version_roots (id);
	create index fk_avm_vlne_vr on avm_version_layered_node_entry (version_root_id);

    create index idx_avm_vr_version on avm_version_roots (version_id);

    alter table avm_version_roots        
        add constraint fk_avm_vr_store
        foreign key (avm_store_id)
        references avm_stores (id);
	create index fk_avm_vr_store on avm_version_roots (avm_store_id);

    alter table avm_version_roots        
        add constraint fk_avm_vr_root
        foreign key (root_id)
        references avm_nodes (id);
	create index fk_avm_vr_root on avm_version_roots (root_id);
        
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
    0, 3001, -1, 3002, null, 'UNKOWN', ${TRUE}, ${TRUE}, 'Script completed'
  );