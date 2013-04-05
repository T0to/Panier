package org.alfresco.module.export.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.io.Serializable;

import org.alfresco.model.ContentModel;
import org.alfresco.module.export.model.ExportModel;
import org.alfresco.module.export.zip.webscripts.ZipToOutputStreamWriter;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.cmr.model.FileFolderService;
import org.alfresco.service.cmr.model.FileInfo;
import org.alfresco.service.cmr.repository.AssociationExistsException;
import org.alfresco.service.cmr.repository.AssociationRef;
import org.alfresco.service.cmr.repository.ChildAssociationRef;
import org.alfresco.service.cmr.repository.ContentWriter;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.namespace.QName;
import org.alfresco.service.namespace.QNamePattern;
import org.apache.log4j.Logger;

public class ExportServiceImpl implements ExportService {

	private String moduleId;
	private NodeService nodeService;
	private FileFolderService fileFolderService;
	private ServiceRegistry serviceRegistry;
	private static final String MIMETYPE_APPLICATION_ZIP = "application/zip";
	private static final String EXTENSION_ZIP = ".zip";

	private static final Logger logger = Logger
			.getLogger(ExportServiceImpl.class);

	public FileFolderService getFileFolderService() {
		return fileFolderService;
	}

	public void setFileFolderService(FileFolderService fileFolderService) {
		this.fileFolderService = fileFolderService;
	}

	public ServiceRegistry getServiceRegistry() {
		return serviceRegistry;
	}

	public void setServiceRegistry(ServiceRegistry serviceRegistry) {
		this.serviceRegistry = serviceRegistry;
	}

	public String getModuleId() {
		return moduleId;
	}

	public void setModuleId(String moduleId) {
		this.moduleId = moduleId;
	}

	public NodeService getNodeService() {
		return nodeService;
	}

	public void setNodeService(NodeService nodeService) {
		this.nodeService = nodeService;
	}

	@Override
	public void addToSelection(List<NodeRef> listToAdd, NodeRef user)
			throws Exception {

		NodeRef exportListRef = retrieveExportList(user);
		List<AssociationRef> listUser = nodeService.getTargetAssocs(
				exportListRef, new QNamePattern() {

					@Override
					public boolean isMatch(QName arg0) {
						return ExportModel.ASSOCIATION_EXPORT_ELEMENT
								.equals(arg0);
					}
				});
		List<NodeRef> list = mergeAssociationList(listUser, listToAdd);
		for (NodeRef nodeRef : list) {
			nodeService.createAssociation(exportListRef, nodeRef,
					ExportModel.ASSOCIATION_EXPORT_ELEMENT);
		}
	}

	@Override
	public void removeFromSelection(List<NodeRef> list, NodeRef user)
			throws Exception {
		// TODO Auto-generated method stub
		NodeRef exportListRef = retrieveExportList(user);

		for (NodeRef nodeRef : list) {
			try {
			nodeService.removeAssociation(exportListRef, nodeRef,
					ExportModel.ASSOCIATION_EXPORT_ELEMENT);
			}
			catch (Exception e)
			{
				logger.error("RemoveAssociation :" + e);
			}
		}
	}

	/* (non-Javadoc)
	 * @see org.alfresco.module.export.service.ExportService#removeFromSelection(org.alfresco.service.cmr.repository.NodeRef, org.alfresco.service.cmr.repository.NodeRef)
	 */
	@Override
	public void removeFromSelection(NodeRef nodeRef, NodeRef user)throws Exception {
		// TODO Auto-generated method stub
		NodeRef exportListRef = retrieveExportList(user);
		try
		{
			nodeService.removeAssociation(exportListRef, nodeRef, ExportModel.ASSOCIATION_EXPORT_ELEMENT);
		}
		catch (Exception e) {
			logger.error("RemoveAssociation :" + e);
		}
	}

	@Override
	public void resetSelection(NodeRef user) throws Exception {
		// TODO On verra si necessaire et le temps

	}

	@Override
	public List<NodeRef> getSelection(NodeRef user) throws Exception {
		NodeRef exportListRef = retrieveExportList(user);
		List<AssociationRef> assocs = nodeService.getTargetAssocs(
				exportListRef, ExportModel.ASSOCIATION_EXPORT_ELEMENT);
		ArrayList<NodeRef> list = new ArrayList<NodeRef>(assocs.size());
		for (AssociationRef assoc : assocs) {
			list.add(assoc.getTargetRef());
		}
		return list;
	}

	@Override
	public void addToSelection(NodeRef nodeRef, NodeRef user) throws Exception {
		NodeRef exportListRef = retrieveExportList(user);
		List<AssociationRef> listUser = nodeService.getTargetAssocs(
				exportListRef, new QNamePattern() {

					@Override
					public boolean isMatch(QName arg0) {
						return ExportModel.ASSOCIATION_EXPORT_ELEMENT
								.equals(arg0);
					}
				});
		for (AssociationRef assoc : listUser) {
			if (assoc.getTargetRef().equals(nodeRef)) {
				logger.info("ignoring exception caused by an element that already exists in the list : "
						+ nodeRef);
				return;
			}
		}
		nodeService.createAssociation(exportListRef, nodeRef,
				ExportModel.ASSOCIATION_EXPORT_ELEMENT);

	}

	private List<NodeRef> mergeAssociationList(List<AssociationRef> list,
			List<NodeRef> listUser) {
		List<NodeRef> listResults = new ArrayList<NodeRef>();
		for (NodeRef nodeRef : listUser) {
			boolean found = false;
			for (AssociationRef assoc : list) {
				if (nodeRef.equals(assoc.getTargetRef())) {
					logger.info("ignoring exception caused by an element that already exists in the list : "
							+ nodeRef);
					found = true;
					break;
				}
			}
			if (!found)
				listResults.add(nodeRef);
		}
		return listResults;
	}

	public void init() {
		// logger.info("Bonjour, me voici initialisé :D");
	}

	private NodeRef retrieveExportList(NodeRef user) throws Exception {
		NodeRef homeSpace = (NodeRef) nodeService.getProperty(user,
				ContentModel.PROP_HOMEFOLDER);
		if (homeSpace == null) {
			throw new RuntimeException("No home space was found.");
		}
		List<ChildAssociationRef> ref = nodeService.getChildAssocs(homeSpace,
				ContentModel.ASSOC_CONTAINS, ExportModel.TYPE_EXPORT_LIST, 1,
				false);
		if (ref == null || ref.size() == 0)
			return createExportList(user);
		return ref.get(0).getChildRef();
	}

	public NodeRef createExportList(NodeRef user) throws Exception {
		NodeRef homeSpace = (NodeRef) nodeService.getProperty(user,
				ContentModel.PROP_HOMEFOLDER);
		if (homeSpace == null) {
			throw new RuntimeException("No home space was found.");
		}
		ChildAssociationRef childAssoc = nodeService.createNode(homeSpace,
				ContentModel.ASSOC_CONTAINS, ExportModel.TYPE_EXPORT_LIST,
				ExportModel.TYPE_EXPORT_LIST);
		return childAssoc.getChildRef();
	}

	@Override
	public NodeRef getGeneratedFileNodeRef(NodeRef user) throws Exception {
		// TODO Auto-generated method stub
		NodeRef homeSpace = (NodeRef) nodeService.getProperty(user,
				ContentModel.PROP_HOMEFOLDER);
		if (homeSpace == null) {
			throw new RuntimeException("No home space was found.");
		}
		Set<QName> set = new HashSet<QName>();
		set.add(ContentModel.TYPE_CONTENT);
		List<FileInfo> listFileInfos = fileFolderService.list(homeSpace);
		for (FileInfo tmp : listFileInfos) {
			if (tmp.getName()
					.startsWith(ExportModel.EXPORT_GENERATED_FILE_NAME)) {
				return tmp.getNodeRef();
			}
		}
		FileInfo fileInfo = fileFolderService.create(homeSpace,
				ExportModel.EXPORT_GENERATED_FILE_NAME,
				ContentModel.TYPE_CONTENT);
		return fileInfo.getNodeRef();
	}

	@Override
	public NodeRef exportAsZip(NodeRef user) throws Exception {
		List<NodeRef> list = getSelection(user);
		FileInfo[] listNode = new FileInfo[list.size()];
		for (int i = 0; i < list.size(); i++) {
			FileInfo fileInfo = fileFolderService.getFileInfo(list.get(i));
			listNode[i] = fileInfo;
		}
		NodeRef generatedFile = getGeneratedFileNodeRef(user);
		if (!fileFolderService.getFileInfo(generatedFile).getName()
				.endsWith(EXTENSION_ZIP)) {
			fileFolderService.rename(generatedFile,
					ExportModel.EXPORT_GENERATED_FILE_NAME + EXTENSION_ZIP);
		}
		ContentWriter contentWriter = serviceRegistry.getContentService()
				.getWriter(generatedFile, ContentModel.PROP_CONTENT, true);
		ZipToOutputStreamWriter atos = new ZipToOutputStreamWriter(
				fileFolderService);
		contentWriter.setMimetype(MIMETYPE_APPLICATION_ZIP);
		atos.write(listNode, contentWriter.getContentOutputStream());
		return generatedFile;
	}

}
