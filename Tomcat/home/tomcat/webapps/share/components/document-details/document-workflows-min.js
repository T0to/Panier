(function(){var c=Alfresco.util.siteURL;Alfresco.DocumentWorkflows=function b(d){Alfresco.DocumentWorkflows.superclass.constructor.call(this,"Alfresco.DocumentWorkflows",d,[]);return this};YAHOO.extend(Alfresco.DocumentWorkflows,Alfresco.component.Base,{options:{nodeRef:null,siteId:"",destination:null},onAssignWorkflowClick:function a(){Alfresco.util.navigateTo(c("start-workflow"),"POST",{selectedItems:this.options.nodeRef,destination:this.options.destination})}})})();