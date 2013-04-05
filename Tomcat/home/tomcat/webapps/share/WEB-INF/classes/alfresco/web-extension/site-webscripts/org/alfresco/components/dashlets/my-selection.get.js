<import resource="classpath:/alfresco/templates/org/alfresco/import/alfresco-util.js">

function runEvaluator(evaluator)
{
   return eval(evaluator);
}

/* Max Items */
function getMaxItems()
{
   var myConfig = new XML(config.script),
      maxItems = myConfig["max-items"];

   if (maxItems)
   {
      maxItems = myConfig["max-items"].toString();
   }
   return parseInt(maxItems && maxItems.length > 0 ? maxItems : 50, 10);
}

function main(){
	  	model.maxItems = getMaxItems();
	  	model.preferences = AlfrescoUtil.getPreferences("org.alfresco.share.myselection.dashlet");
}
main();