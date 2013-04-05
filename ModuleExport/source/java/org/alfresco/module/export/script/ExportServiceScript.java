package org.alfresco.module.export.script;

import java.util.ArrayList;
import java.util.List;

import org.alfresco.model.ContentModel;
import org.alfresco.module.export.model.ExportModel;
import org.alfresco.module.export.service.ExportService;
import org.alfresco.module.export.zip.webscripts.ZipToOutputStreamWriter;
import org.alfresco.repo.jscript.BaseScopableProcessorExtension;
import org.alfresco.repo.jscript.ScriptNode;
import org.alfresco.repo.model.filefolder.FileInfoImpl;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.model.FileFolderService;
import org.alfresco.service.cmr.model.FileInfo;
import org.alfresco.service.cmr.repository.ContentWriter;
import org.alfresco.service.cmr.repository.MimetypeService;
import org.alfresco.service.cmr.repository.NodeRef;

public class ExportServiceScript extends BaseScopableProcessorExtension{

	/**
	 * 
	 */
	private static final long serialVersionUID = -836484822370748243L;
	private static final String MIMETYPE_APPLICATION_ZIP = "application/zip";
	private static final String EXTENSION_ZIP = ".zip";
	
	private ExportService exportService;
	
	private ServiceRegistry serviceRegistry;
	
	private FileFolderService fileFolderService;
	
	public FileFolderService getFileFolderService() {
		return fileFolderService;
	}

	public void setFileFolderService(FileFolderService fileFolderService) {
		this.fileFolderService = fileFolderService;
	}

	public ExportService getExportService() {
		return exportService;
	}

	public void setExportService(ExportService exportService) {
		this.exportService = exportService;
	}

	public ServiceRegistry getServiceRegistry() {
		return serviceRegistry;
	}

	public void setServiceRegistry(ServiceRegistry serviceRegistry) {
		this.serviceRegistry = serviceRegistry;
	}
	public void addDocumentsToSelection(String[] list, NodeRef user)throws Exception{
		List<NodeRef> listNodeRef = new ArrayList<NodeRef>(list.length);
		for(String s : list){
			listNodeRef.add(new NodeRef(s));
		}
		exportService.addToSelection(listNodeRef, user);
	}
	
	public void addDocumentToSelection(NodeRef nodeRef, NodeRef user)throws Exception{
		exportService.addToSelection(nodeRef, user);
	}
	
	public void removeDocumentFromSelection(NodeRef nodeRef, NodeRef user)throws Exception{
		exportService.removeFromSelection(nodeRef, user);
	}
	
	public void removeDocumentsFromSelection(String[] list, NodeRef user)throws Exception{
		List<NodeRef> listNodeRef = new ArrayList<NodeRef>(list.length);
		for(String s : list){
			listNodeRef.add(new NodeRef(s));
		}
		exportService.removeFromSelection(listNodeRef, user);
	}
	public ScriptNode[] getSelection(NodeRef user)throws Exception{
		List<NodeRef> list = exportService.getSelection(user);
		ScriptNode[] listNode = new ScriptNode[list.size()];
		for(int i = 0 ; i < list.size(); i++){
			FileInfo fileInfo = fileFolderService.getFileInfo(list.get(i));
			listNode[i] = new ScriptNode(fileInfo, serviceRegistry, this.getScope());
		}
		return listNode;
	}
	public void resetSelection(NodeRef user)throws Exception{

	}

	public NodeRef exportAsZip(NodeRef user)throws Exception{
		return exportService.exportAsZip(user);
	}

}
