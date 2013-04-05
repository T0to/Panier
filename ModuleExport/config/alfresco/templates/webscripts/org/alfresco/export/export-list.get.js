<import resource="classpath:/alfresco/templates/webscripts/org/alfresco/slingshot/documentlibrary/evaluator.lib.js">
<import resource="classpath:/alfresco/templates/webscripts/org/alfresco/slingshot/documentlibrary/filters.lib.js">
<import resource="classpath:/alfresco/templates/webscripts/org/alfresco/slingshot/documentlibrary/parse-args.lib.js">
function main(){
	var selection = exportService.getSelection(person.nodeRef);
	 var isThumbnailNameRegistered = thumbnailService.isThumbnailNameRegistered(THUMBNAIL_NAME),
     thumbnail = null,
     items=[],
     locationNode,
     item,
	 favourites = Common.getFavourites();
  // Loop through and evaluate each node in this result set, from doclist.get.js
  for each (node in selection)
  {
     // Get evaluated properties.
     item = Evaluator.run(node);

     // Does this collection of nodes have potentially differering paths?
     //if (filterParams.variablePath || item.isLink)
     //{
        item.likes = Common.getLikes(node);
        locationNode = (item.isLink && item.type == "document") ? item.linkNode : item.node;
        location = Common.getLocation(locationNode);
     /*}
     else
     {
        location =
        {
           site: parsedArgs.location.site,
           siteTitle: parsedArgs.location.siteTitle,
           container: parsedArgs.location.container,
           path: parsedArgs.location.path,
           file: node.name
        };
     }*/
     
     // Resolved location
     item.isFavourite = (favourites[item.node.nodeRef] === true);
     item.location = location;
     
     // Is our thumbnail type registered?
     if (isThumbnailNameRegistered)
     {
        // Make sure we have a thumbnail.
        thumbnail = item.node.getThumbnail(THUMBNAIL_NAME);
        if (thumbnail === null)
        {
           // No thumbnail, so queue creation
           item.node.createThumbnail(THUMBNAIL_NAME, true);
        }
     }
     
     items.push(item);
  }
  model.selection = items;
}

main();


