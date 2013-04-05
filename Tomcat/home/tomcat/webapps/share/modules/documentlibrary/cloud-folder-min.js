(function(){var d=YAHOO.util.Dom,j=YAHOO.util.Event;Alfresco.module.DoclibCloudFolder=function(o){Alfresco.module.DoclibCloudFolder.superclass.constructor.call(this,o);this.name="Alfresco.module.DoclibCloudFolder";Alfresco.util.ComponentManager.reregister(this);this.options=YAHOO.lang.merge(this.options,{allowedViewModes:[Alfresco.module.DoclibGlobalFolder.VIEW_MODE_SITE],targetNetwork:"-default-",targetUserid:"",templateUrl:Alfresco.constants.URL_SERVICECONTEXT+"modules/documentlibrary/cloud-folder",sitesAPITemplate:Alfresco.constants.PROXY_URI+"cloud/people/{userid}/sites?network={network}",containersAPITemplate:Alfresco.constants.PROXY_URI+"cloud/doclib/containers/?network={network}",treeNodeAPITemplate:"cloud/doclib/treenode/site/{site}/{container}{path}?children={evaluateChildFoldersSite}&max={maximumFolderCountSite}&network={network}",templateFailMessage:Alfresco.util.message("message.sync.unavailable"),syncOptions:{},mode:"sync"});this.updateAPIURLs();if(o!="null"){YAHOO.Bubbling.on("networkSelected",this._populateSitePicker,this);YAHOO.Bubbling.on("authDetailsAvailable",this.onAuthDetailsAvailable,this)}return this};YAHOO.extend(Alfresco.module.DoclibCloudFolder,Alfresco.module.DoclibGlobalFolder,{onTemplateLoaded:function k(o){if(o.serverResponse.status===204){Alfresco.util.PopupManager.displayMessage({text:this.msg("sync.message.no.active.network")})}else{Alfresco.module.DoclibCloudFolder.superclass.onTemplateLoaded.call(this,o)}},_selectionIncludesFolder:function a(){var p=this.options.files;if(YAHOO.lang.isArray(p)){for(var o in p){if(p[o].jsNode.isContainer){return true}}return false}else{return p.jsNode.isContainer}},_beforeShowDialog:function b(){Alfresco.module.DoclibCloudFolder.superclass._beforeShowDialog.call(this);this.widgets.optionInputs=d.getElementsByClassName("cloudSyncOption","input",this.id+"-wrapper");var p=this.widgets.optionInputs;for(var o in p){if(!this._selectionIncludesFolder()&&p[o].id==="includeSubFolders"){d.addClass(d.get(p[o].id+"-label"),"hidden");break}else{if(d.hasClass(d.get(p[o].id+"-label"),"hidden")){d.removeClass(d.get(p[o].id+"-label"),"hidden");break}}}},_showDialog:function m(){Alfresco.module.DoclibCloudFolder.superclass._showDialog.call(this);if(!this.widgets.networkButtons){this.widgets.networkButtons=new YAHOO.widget.ButtonGroup(this.id+"-networkGroup");this.widgets.networkButtons.on("checkedButtonChange",this.onNetworkSelect,this.widgets.networkButtons,this)}this.onNetworkSelect(null,this.widgets.networkButtons);j.on(d.getElementsByClassName("cloud-path-add-folder","div"),"click",function o(p){j.preventDefault(p);this.createFolderInTheCloud()},{},this)},createFolderInTheCloud:function h(){if(!this.options.createFolderInTheCloudDialog){var r=YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT+"components/form?itemKind={itemKind}&itemId={itemId}&mode={mode}&submitType={submitType}&formId={formId}&showCancelButton=true",{itemKind:"type",itemId:"cm:folder",mode:"create",submitType:"json",formId:"doclib-common"});var p=function q(v,w){d.get(w.id+"-dialogTitle").innerHTML=this.msg("sync.new-folder.in-the-cloud.title");d.get(w.id+"-dialogHeader").innerHTML=this.msg("sync.new-folder.in-the-cloud.header")};var u=function s(v){this.widgets.cancelButton.set("disabled",false)};var t=function o(B){var C=(this.selectedNode.data.nodeRef).replace(":/","");var x="";var A=this.widgets.networkButtons.getButtons();for(var y in A){if(A[y].get("checked")){x=A[y]._button.innerHTML;break}}var w=YAHOO.lang.substitute(Alfresco.constants.PROXY_URI+"cloud/node/folder/{destination}?network={network}",{destination:C,network:x});var v={name:B.dataObj.prop_cm_name,title:B.dataObj.prop_cm_title,description:B.dataObj.prop_cm_description};Alfresco.util.Ajax.jsonPost({url:w,dataObj:v,successCallback:{fn:function z(E){Alfresco.util.PopupManager.displayMessage({text:this.msg("sync.new-folder.creation.success"),displayTime:0.5});var I="/";var J=this.selectedNode.data.path.split(I);J=Alfresco.util.arrayRemove(J,"");J.push(E.config.dataObj.name);var H="";this.pathsToExpand=[];for(var G=0,F=J.length;G<F;G++){H+=I+J[G];this.pathsToExpand.push(H)}YAHOO.Bubbling.fire("siteChanged",{site:this.options.siteId,siteTitle:this.options.siteTitle,eventGroup:this,scrollTo:true})},scope:this},failureCallback:{fn:function D(E){Alfresco.util.PopupManager.displayMessage({text:this.msg("sync.new-folder.creation.failure")})},scope:this}})};this.options.createFolderInTheCloudDialog=new Alfresco.module.SimpleDialog(this.id+"-createFolderInTheCloud");this.options.createFolderInTheCloudDialog.setOptions({width:"33em",templateUrl:r,actionUrl:null,clearForm:true,doBeforeFormSubmit:{fn:u,scope:this},doBeforeDialogShow:{fn:p,scope:this},doBeforeAjaxRequest:{fn:t,scope:this}})}this.options.createFolderInTheCloudDialog.show()},setViewMode:function i(o){this.options.viewMode=o;d.removeClass(this.id+"-wrapper","repository-mode")},onNetworkSelect:function f(p,o){this.options.targetNetwork=o.get("checkedButton").get("name");this.updateAPIURLs();this.options.siteId=null;YAHOO.Bubbling.fire("networkSelected")},updateAPIURLs:function c(){var o={network:this.options.targetNetwork,userid:this.options.targetUserid};this.options.sitesAPI=YAHOO.lang.substitute(this.options.sitesAPITemplate,o);this.options.containersAPI=YAHOO.lang.substitute(this.options.containersAPITemplate,o);this.options.siteTreeContainerTypes={"cm:folder":{uri:YAHOO.lang.substitute(this.options.treeNodeAPITemplate,o)}}},updateSyncOptions:function g(){for(var o=0;o<this.widgets.optionInputs.length;o++){var q=d.getAttribute(this.widgets.optionInputs[o],"value"),p=d.getAttribute(this.widgets.optionInputs[o],"checked");this.options.syncOptions[q]=p}},onExpandComplete:function e(p){if(this.pathsToExpand!=null){var o=this.widgets.treeview.getNodeByProperty("path",this.pathsToExpand.shift());if(o!=null){o.expand();this._updateSelectedNode(o)}}},onAuthDetailsAvailable:function n(p,o){this.options.targetUserid=o[1].authDetails.username}});var l=new Alfresco.module.DoclibCloudFolder("null")})();