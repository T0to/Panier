package org.alfresco.module.export.service;

import java.io.File;
import java.io.Serializable;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.action.executer.ActionExecuterAbstractBase;
import org.alfresco.repo.action.executer.ImageTransformActionExecuter;
import org.alfresco.repo.action.executer.TransformActionExecuter;
import org.alfresco.repo.content.MimetypeMap;
import org.alfresco.repo.content.transform.magick.ImageMagickContentTransformerWorker;
import org.alfresco.repo.jscript.BaseScopableProcessorExtension;
import org.alfresco.repo.version.VersionBaseModel;
import org.alfresco.service.cmr.action.Action;
import org.alfresco.service.cmr.action.ActionService;
import org.alfresco.service.cmr.action.ParameterDefinition;
import org.alfresco.service.cmr.model.FileFolderService;
import org.alfresco.service.cmr.repository.ChildAssociationRef;
import org.alfresco.service.cmr.repository.ContentReader;
import org.alfresco.service.cmr.repository.ContentService;
import org.alfresco.service.cmr.repository.ContentWriter;
import org.alfresco.service.cmr.repository.MimetypeService;
import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.repository.TransformationOptions;
import org.alfresco.service.cmr.version.Version;
import org.alfresco.service.cmr.version.VersionService;
import org.alfresco.service.cmr.version.VersionType;
import org.alfresco.service.namespace.NamespaceService;
import org.alfresco.service.namespace.QName;
import org.alfresco.util.PropertyMap;
import org.alfresco.util.TempFileProvider;

public class TestActionTransformExecuter extends BaseScopableProcessorExtension {

	private ActionService actionService;
	private NodeService nodeService;
	private ContentService contentService;
	private FileFolderService fileFolderService;
	private VersionService versionService;
	private MimetypeService mimetypeService;

	

	public VersionService getVersionService() {
		return versionService;
	}

	public void setVersionService(VersionService versionService) {
		this.versionService = versionService;
	}

	public MimetypeService getMimetypeService() {
		return mimetypeService;
	}

	public void setMimetypeService(MimetypeService mimetypeService) {
		this.mimetypeService = mimetypeService;
	}

	public ActionService getActionService() {
		return actionService;
	}

	public void setActionService(ActionService actionService) {
		this.actionService = actionService;
	}

	public FileFolderService getFileFolderService() {
		return fileFolderService;
	}

	public void setFileFolderService(FileFolderService fileFolderService) {
		this.fileFolderService = fileFolderService;
	}

	public ContentService getContentService() {
		return contentService;
	}

	public void setContentService(ContentService contentService) {
		this.contentService = contentService;
	}

	public NodeService getNodeService() {
		return nodeService;
	}

	public void setNodeService(NodeService nodeService) {
		this.nodeService = nodeService;
	}

	public void test(String sourceRef) throws Exception {
		NodeRef contentNodeRef = new NodeRef(sourceRef);
		// get the extensions to use
		final PropertyMap propertiesVersionable = new PropertyMap(4);
		propertiesVersionable.put(ContentModel.PROP_AUTO_VERSION_PROPS,
				false);

		nodeService.addAspect(contentNodeRef,
				ContentModel.ASPECT_VERSIONABLE, propertiesVersionable);

		Map<String, Serializable> propertiesVersion = new HashMap<String, Serializable>(
				2, 1.0f);
		propertiesVersion.put(VersionBaseModel.PROP_VERSION_TYPE,
				VersionType.MAJOR);

		Version version = versionService.createVersion(
				contentNodeRef, propertiesVersion);

		
		NodeRef destinationParent = nodeService.getPrimaryParent(contentNodeRef).getParentRef();
	
		Action transformImageAction = actionService.createAction(ImageTransformActionExecuter.NAME);
		Map<String, Serializable> model = new HashMap<String, Serializable>();
		model.put(ImageTransformActionExecuter.PARAM_DESTINATION_FOLDER,destinationParent);
		model.put(ImageTransformActionExecuter.PARAM_MIME_TYPE,MimetypeMap.MIMETYPE_IMAGE_JPEG);
		model.put(ImageTransformActionExecuter.PARAM_ASSOC_TYPE_QNAME,ContentModel.ASSOC_CONTAINS);
		model.put(ImageTransformActionExecuter.PARAM_ASSOC_QNAME,QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, "copy"));
				
		transformImageAction.addParameterValues(model);
		actionService.executeAction(transformImageAction, contentNodeRef);
		Set<QName> set = new HashSet<QName>();
		set.add(QName.createQName(NamespaceService.CONTENT_MODEL_1_0_URI, "copy"));
		List<ChildAssociationRef> list = nodeService.getChildAssocs(destinationParent,ContentModel.ASSOC_CONTAINS,QName.createQName("{http://www.alfresco.org/model/content/1.0}copy"));
		if(list.size() == 0){
			throw new RuntimeException();//just in case
		}
		ContentReader contentReader = contentService.getReader(list.get(0).getChildRef(), ContentModel.PROP_CONTENT);
		ContentWriter contentWriter = contentService.getWriter(contentNodeRef, ContentModel.PROP_CONTENT, true);
		contentWriter.putContent(contentReader);
		String newName = (String)nodeService.getProperty(list.get(0).getChildRef(), ContentModel.PROP_NAME);

		fileFolderService.delete(list.get(0).getChildRef());
		fileFolderService.rename(contentNodeRef, newName);
		
		/**
		 * Action transform = actionService.createAction(
		 * ImageTransformActionExecuter.NAME); List<ChildAssociationRef> list =
		 * nodeService.getParentAssocs(source); if(list.size()!=1){ throw new
		 * RuntimeException(); }
		 * 
		 * Map<String, Serializable> model = new HashMap<String,
		 * Serializable>();
		 * model.put(ImageTransformActionExecuter.PARAM_DESTINATION_FOLDER
		 * ,list.get(0).getParentRef());
		 * model.put(ImageTransformActionExecuter.PARAM_OVERWRITE_COPY, true);
		 * model.put(ImageTransformActionExecuter.PARAM_MIME_TYPE,MimetypeMap.
		 * MIMETYPE_IMAGE_JPEG); transform.setParameterValues(model);
		 * actionService.executeAction(transform, source);
		 */
		// Transformation options

		// transform - will throw NoTransformerException if there are no
		// transformers

	}

}
