package org.alfresco.module.export.service;

import java.util.List;

import org.alfresco.module.export.model.ExportModel;
import org.alfresco.service.cmr.repository.NodeRef;

/**
 * Service that carries the selection list of the users to export the selection
 * @author mapor
 *
 */
public interface ExportService {
	/**
	 * Add elements to selection
	 * Note that the type of the element is not checked here, it's only checked on the export.
	 * @param list
	 * @param user
	 * @throws Exception
	 */
	public void addToSelection(List<NodeRef> list, NodeRef user)throws Exception;
	/**
	 * Add elements to selection
	 * Note that the type of the element is not checked here, it's only checked on the export.
	 * @param nodeRef
	 * @param user
	 * @throws Exception
	 */
	public void addToSelection(NodeRef nodeRef, NodeRef user)throws Exception;
	public void removeFromSelection(NodeRef nodeRef, NodeRef user)throws Exception;
	public void removeFromSelection(List<NodeRef> list, NodeRef user)throws Exception;
	/**
	 * Initialise the metadata(s) need for the export service.
	 * @param user
	 * @return
	 * @throws Exception
	 * @see ExportModel
	 */
	public NodeRef createExportList(NodeRef user)throws Exception;
	/**
	 * Read the list of choosen file by the user.
	 * @param user
	 * @return
	 * @throws Exception
	 */
	public List<NodeRef> getSelection(NodeRef user)throws Exception;
	public void resetSelection(NodeRef user)throws Exception;
	/* 
	 * TODO : Voir comment générer le fichier zip et l'envoyer à l'utilisateur 
	 * A priori récupération de la liste des noeud, 
	 * pour chaque noeud injecter le fichier dans un zip à l'aide d'apache compress
	 * ajouter le zip dans le profil utilisateur, ce zip sera toujours écraser à chaque export (job de nettoyage)
	 */

	public NodeRef getGeneratedFileNodeRef(NodeRef user)throws Exception;
	
	public NodeRef exportAsZip(NodeRef user)throws Exception;
}
