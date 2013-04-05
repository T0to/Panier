package org.alfresco.module.export.model;

import org.alfresco.service.namespace.QName;

public class ExportModel {
    public static final String EXPORT_MODEL_URI            = "http://www.alfresco.org/model/export/1.0";
    public static final String EXPORT_MODEL_PREFIX         = "exp";
    public static final QName  TYPE_EXPORT_LIST			   = QName.createQName(EXPORT_MODEL_URI, "list");
    public static final QName  PROP_EXPORT_GENERATED_FILE  = QName.createQName(EXPORT_MODEL_URI, "generatedFile");
    public static final QName ASSOCIATION_EXPORT_ELEMENT   = QName.createQName(EXPORT_MODEL_URI, "elements");
    /**
     * Does not include the extension for extensibility purpose
     */
    public static final String EXPORT_GENERATED_FILE_NAME  = "export_selection";      

}
