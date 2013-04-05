(function(){var M=YAHOO.util.Dom,K=YAHOO.util.Event;var J=Alfresco.util.encodeHTML,E=Alfresco.util.combinePaths,D=Alfresco.util.siteURL,P=Alfresco.util.isValueSet;var i;Alfresco.doclib.Actions={};Alfresco.doclib.Actions.prototype={actionsView:null,onRegisterAction:function w(X,W){var Y=W[1];if(Y&&P(Y.actionName)&&P(Y.fn)){this.registerAction(Y.actionName,Y.fn)}else{Alfresco.logger.error("DL_onRegisterAction: Custom action registion invalid: "+Y)}},registerAction:function c(W,X){if(P(W)&&P(X)){this.constructor.prototype[W]=X;return true}return false},renderAction:function O(X,aa){var W=Alfresco.constants.URL_RESCONTEXT+"components/documentlibrary/actions/",ac='style="background-image:url('+W+'{icon}-16.png)" ',Z={link:'<div class="{id}"><a title="{label}" class="simple-link" href="{href}" '+ac+"{target}><span>{label}</span></a></div>",pagelink:'<div class="{id}"><a title="{label}" class="simple-link" href="{pageUrl}" '+ac+"><span>{label}</span></a></div>",javascript:'<div class="{id}" title="{jsfunction}"><a title="{label}" class="action-link" href="#"'+ac+"><span>{label}</span></a></div>"};aa.actionParams[X.id]=X.params;var Y={id:X.id,icon:X.icon,label:J(Alfresco.util.substituteDotNotation(this.msg(X.label),aa))};if(X.type==="link"){if(X.params.href){Y.href=Alfresco.util.substituteDotNotation(X.params.href,aa);Y.target=X.params.target?'target="'+X.params.target+'"':""}else{Alfresco.logger.warn("Action configuration error: Missing 'href' parameter for actionId: ",X.id)}}else{if(X.type==="pagelink"){if(X.params.page){Y.pageUrl=Alfresco.util.substituteDotNotation(X.params.page,aa);if(X.params.page.charAt(0)!=="{"){var ab=P(aa.location.site)?aa.location.site.name:null;Y.pageUrl=D(Y.pageUrl,{site:ab})}}else{Alfresco.logger.warn("Action configuration error: Missing 'page' parameter for actionId: ",X.id)}}else{if(X.type==="javascript"){if(X.params["function"]){Y.jsfunction=X.params["function"]}else{Alfresco.logger.warn("Action configuration error: Missing 'function' parameter for actionId: ",X.id)}}}}return YAHOO.lang.substitute(Z[X.type],Y)},getActionUrls:function t(ac,X){var Z=ac.jsNode,af=Z.isLink?Z.linkedNode.nodeRef:Z.nodeRef,ad=af.toString(),W=af.uri,ab=Z.contentURL,ag=ac.workingCopy||{},Y=P(ac.location.site)?ac.location.site.name:null,ae=Alfresco.util.bind(function(ah){return Alfresco.util.siteURL(ah,{site:YAHOO.lang.isString(X)?X:Y})},this),aa={downloadUrl:E(Alfresco.constants.PROXY_URI,ab)+"?a=true",viewUrl:E(Alfresco.constants.PROXY_URI,ab)+'" target="_blank',documentDetailsUrl:ae("document-details?nodeRef="+ad),folderDetailsUrl:ae("folder-details?nodeRef="+ad),editMetadataUrl:ae("edit-metadata?nodeRef="+ad),inlineEditUrl:ae("inline-edit?nodeRef="+ad),managePermissionsUrl:ae("manage-permissions?nodeRef="+ad),manageTranslationsUrl:ae("manage-translations?nodeRef="+ad),workingCopyUrl:ae("document-details?nodeRef="+(ag.workingCopyNodeRef||ad)),workingCopySourceUrl:ae("document-details?nodeRef="+(ag.sourceNodeRef||ad)),viewGoogleDocUrl:ag.googleDocUrl+'" target="_blank',explorerViewUrl:E(this.options.repositoryUrl,"/n/showSpaceDetails/",W)+'" target="_blank',cloudViewUrl:E(Alfresco.constants.URL_SERVICECONTEXT,"cloud/cloudUrl?nodeRef="+ad)};aa.sourceRepositoryUrl=this.viewInSourceRepositoryURL(ac,aa)+'" target="_blank';return aa},getAction:function V(X,W,ab){var ad=W.className,aa=Alfresco.util.findInArray(X.actions,ad,"id")||{};if(ab===false){return aa}else{aa=Alfresco.util.deepCopy(aa);var ac=aa.params||{};for(var Y in ac){ac[Y]=YAHOO.lang.substitute(ac[Y],X,function Z(af,ag,ae){return Alfresco.util.findValueByDotNotation(X,af)})}return aa}},getParentNodeRef:function U(X){var aa=null;if(YAHOO.lang.isArray(X)){try{aa=this.doclistMetadata.parent.nodeRef}catch(ab){aa=null}if(aa===null){for(var Z=1,Y=X.length,W=true;Z<Y&&W;Z++){W=(X[Z].parent.nodeRef==X[Z-1].parent.nodeRef)}aa=W?X[0].parent.nodeRef:this.doclistMetadata.container}}else{aa=X.parent.nodeRef}return aa},onActionDetails:function F(Z){var af=this,ab=Z.nodeRef,Y=Z.jsNode;var ad=function W(ah,ai){var ag='<span class="light">'+J(Z.displayName)+"</span>";Alfresco.util.populateHTML([ai.id+"-dialogTitle",af.msg("edit-details.title",ag)]);this.widgets.editMetadata=Alfresco.util.createYUIButton(ai,"editMetadata",null,{type:"link",label:af.msg("edit-details.label.edit-metadata"),href:D("edit-metadata?nodeRef="+ab)})};var X=YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT+"components/form?itemKind={itemKind}&itemId={itemId}&destination={destination}&mode={mode}&submitType={submitType}&formId={formId}&showCancelButton=true",{itemKind:"node",itemId:ab,mode:"edit",submitType:"json",formId:"doclib-simple-metadata"});var ae=new Alfresco.module.SimpleDialog(this.id+"-editDetails-"+Alfresco.util.generateDomId());ae.setOptions({width:"40em",templateUrl:X,actionUrl:null,destroyOnHide:true,doBeforeDialogShow:{fn:ad,scope:this},onSuccess:{fn:function aa(ah){Alfresco.util.Ajax.request({url:E(Alfresco.constants.URL_SERVICECONTEXT,"components/documentlibrary/data/node/",Y.nodeRef.uri)+"?view="+this.actionsView,successCallback:{fn:function ai(ak){var aj=ak.json.item;aj.jsNode=new Alfresco.util.Node(ak.json.item.node);YAHOO.Bubbling.fire(aj.node.isContainer?"folderRenamed":"fileRenamed",{file:aj});YAHOO.Bubbling.fire("tagRefresh");Alfresco.util.PopupManager.displayMessage({text:this.msg("message.details.success")});this._updateDocList.call(this)},scope:this},failureCallback:{fn:function ag(aj){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.details.failure")})},scope:this}})},scope:this},onFailure:{fn:function ac(ag){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.details.failure")})},scope:this}}).show()},onActionLocate:function T(W){var Y=W.jsNode,aa=W.location.path,X=Y.isLink?Y.linkedNode.properties.name:W.displayName,Z=P(W.location.site)?W.location.site.name:null;if(P(this.options.siteId)&&Z!==this.options.siteId){window.location=D((Z===null?"repository":"documentlibrary")+"?file="+encodeURIComponent(X)+"&path="+encodeURIComponent(aa),{site:Z})}else{this.options.highlightFile=X;YAHOO.Bubbling.fire("changeFilter",{filterId:"path",filterData:aa})}},onActionDelete:function N(Y){var ac=this,W=Y.jsNode,ab=W.isContainer?"folder":"document",ad=Y.displayName,X=(this.options.syncMode==="CLOUD");var ae=this.msg("message.confirm.delete",ad);if(W.hasAspect("sync:syncSetMemberNode")){if(X){ae+=this.msg("actions.synced.cloud."+ab+".delete",ad)}else{ae+=this.msg("actions.synced."+ab+".delete",ad)}}Alfresco.util.PopupManager.displayPrompt({title:this.msg("actions."+ab+".delete"),text:ae,noEscape:true,buttons:[{text:this.msg("button.delete"),handler:function aa(){this.destroy();ac._onActionDeleteConfirm.call(ac,Y)}},{text:this.msg("button.cancel"),handler:function Z(){this.destroy()},isDefault:true}]})},_onActionDeleteConfirm:function R(X){var aa=X.jsNode,ab=X.location.path,ac=X.location.file,Y=E(ab,ac),W=X.displayName,Z=aa.nodeRef;this.modules.actions.genericAction({success:{activity:{siteId:this.options.siteId,activityType:"file-deleted",page:"documentlibrary",activityData:{fileName:ac,path:ab,nodeRef:Z.toString()}},event:{name:aa.isContainer?"folderDeleted":"fileDeleted",obj:{path:Y}},message:this.msg("message.delete.success",W)},failure:{message:this.msg("message.delete.failure",W)},webscript:{method:Alfresco.util.Ajax.DELETE,name:"file/node/{nodeRef}",params:{nodeRef:Z.uri}},wait:{message:this.msg("message.multiple-delete.please-wait")}})},onActionEditOffline:function b(W){Alfresco.logger.error("onActionEditOffline","Abstract implementation not overridden")},onlineEditMimetypes:{"application/msword":"Word.Document","application/vnd.openxmlformats-officedocument.wordprocessingml.document":"Word.Document","application/vnd.ms-word.document.macroenabled.12":"Word.Document","application/vnd.openxmlformats-officedocument.wordprocessingml.template":"Word.Document","application/vnd.ms-word.template.macroenabled.12":"Word.Document","application/vnd.ms-powerpoint":"PowerPoint.Slide","application/vnd.openxmlformats-officedocument.presentationml.presentation":"PowerPoint.Slide","application/vnd.ms-powerpoint.presentation.macroenabled.12":"PowerPoint.Slide","application/vnd.openxmlformats-officedocument.presentationml.slideshow":"PowerPoint.Slide","application/vnd.ms-powerpoint.slideshow.macroenabled.12":"PowerPoint.Slide","application/vnd.openxmlformats-officedocument.presentationml.template":"PowerPoint.Slide","application/vnd.ms-powerpoint.template.macroenabled.12":"PowerPoint.Slide","application/vnd.ms-powerpoint.addin.macroenabled.12":"PowerPoint.Slide","application/vnd.openxmlformats-officedocument.presentationml.slide":"PowerPoint.Slide","application/vnd.ms-powerpoint.slide.macroEnabled.12":"PowerPoint.Slide","application/vnd.ms-excel":"Excel.Sheet","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"Excel.Sheet","application/vnd.openxmlformats-officedocument.spreadsheetml.template":"Excel.Sheet","application/vnd.ms-excel.sheet.macroenabled.12":"Excel.Sheet","application/vnd.ms-excel.template.macroenabled.12":"Excel.Sheet","application/vnd.ms-excel.addin.macroenabled.12":"Excel.Sheet","application/vnd.ms-excel.sheet.binary.macroenabled.12":"Excel.Sheet","application/vnd.visio":"Visio.Drawing"},onActionEditOnline:function n(W){if(this._launchOnlineEditor(W)){YAHOO.Bubbling.fire("metadataRefresh")}else{Alfresco.util.PopupManager.displayMessage({text:this.msg("message.edit-online.office.failure")})}},_launchOnlineEditor:function z(aa){var ad="SharePoint.OpenDocuments",X=aa.jsNode,ab=aa.location,ae=X.mimetype,Y=null,Z=null,W={doc:"application/msword",docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",docm:"application/vnd.ms-word.document.macroenabled.12",dotx:"application/vnd.openxmlformats-officedocument.wordprocessingml.template",dotm:"application/vnd.ms-word.template.macroenabled.12",ppt:"application/vnd.ms-powerpoint",pptx:"application/vnd.openxmlformats-officedocument.presentationml.presentation",pptm:"application/vnd.ms-powerpoint.presentation.macroenabled.12",ppsx:"application/vnd.openxmlformats-officedocument.presentationml.slideshow",ppsm:"application/vnd.ms-powerpoint.slideshow.macroenabled.12",potx:"application/vnd.openxmlformats-officedocument.presentationml.template",potm:"application/vnd.ms-powerpoint.template.macroenabled.12",ppam:"application/vnd.ms-powerpoint.addin.macroenabled.12",sldx:"application/vnd.openxmlformats-officedocument.presentationml.slide",sldm:"application/vnd.ms-powerpoint.slide.macroEnabled.12",xls:"application/vnd.ms-excel",xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",xltx:"application/vnd.openxmlformats-officedocument.spreadsheetml.template",xlsm:"application/vnd.ms-excel.sheet.macroenabled.12",xltm:"application/vnd.ms-excel.template.macroenabled.12",xlam:"application/vnd.ms-excel.addin.macroenabled.12",xlsb:"application/vnd.ms-excel.sheet.binary.macroenabled.12"};if(this.onlineEditMimetypes.hasOwnProperty(ae)){Y=this.onlineEditMimetypes[ae]}else{var ac=Alfresco.util.getFileExtension(aa.location.file);if(ac!==null){ac=ac.toLowerCase();if(W.hasOwnProperty(ac)){ae=W[ac];if(this.onlineEditMimetypes.hasOwnProperty(ae)){Y=this.onlineEditMimetypes[ae]}}}}if(Y!==null){if(!P(aa.onlineEditUrl)){aa.onlineEditUrl=Alfresco.util.onlineEditUrl(this.doclistMetadata.custom.vtiServer,ab)}if(YAHOO.env.ua.ie>0){return this._launchOnlineEditorIE(ad,aa,Y)}if(Alfresco.util.isSharePointPluginInstalled()){return this._launchOnlineEditorPlugin(aa,Y)}else{Alfresco.util.PopupManager.displayPrompt({text:this.msg("actions.editOnline.failure",ab.file)});return false}}return window.open(aa.onlineEditUrl,"_blank")},_launchOnlineEditorIE:function G(Y,W,X){try{if(X==="Visio.Drawing"){throw ("Visio should be invoked using activeXControl.EditDocument2.")}activeXControl=new ActiveXObject(Y+".3");return activeXControl.EditDocument3(window,W.onlineEditUrl,true,X)}catch(aa){try{activeXControl=new ActiveXObject(Y+".2");return activeXControl.EditDocument2(window,W.onlineEditUrl,X)}catch(ab){try{activeXControl=new ActiveXObject(Y+".1");return activeXControl.EditDocument(W.onlineEditUrl,X)}catch(Z){}}}return false},_launchOnlineEditorPlugin:function g(X,Y){var Z=document.getElementById("SharePointPlugin");if(Z==null&&Alfresco.util.isSharePointPluginInstalled()){var W=null;if(YAHOO.env.ua.webkit&&Alfresco.util.isBrowserPluginInstalled("application/x-sharepoint-webkit")){W="application/x-sharepoint-webkit"}else{W="application/x-sharepoint"}var ad=document.createElement("object");ad.id="SharePointPlugin";ad.type=W;ad.width=0;ad.height=0;ad.style.setProperty("visibility","hidden","");document.body.appendChild(ad);Z=document.getElementById("SharePointPlugin");if(!Z){return false}}try{if(Y==="Visio.Drawing"){throw ("Visio should be invoked using activeXControl.EditDocument2.")}return Z.EditDocument3(window,X.onlineEditUrl,true,Y)}catch(ab){try{return Z.EditDocument2(window,X.onlineEditUrl,Y)}catch(ac){try{return Z.EditDocument(X.onlineEditUrl,Y)}catch(aa){return false}}}},onActionCheckoutToGoogleDocs:function f(W){Alfresco.logger.error("onActionCheckoutToGoogleDocs","Abstract implementation not overridden")},onActionCheckinFromGoogleDocs:function v(W){Alfresco.logger.error("onActionCheckinFromGoogleDocs","Abstract implementation not overridden")},onActionSimpleRepoAction:function e(Y,W){var aa=this.getAction(Y,W).params,X=Y.displayName;var Z={success:{event:{name:"metadataRefresh",obj:Y}},failure:{message:this.msg(aa.failureMessage,X)},webscript:{method:Alfresco.util.Ajax.POST,stem:Alfresco.constants.PROXY_URI+"api/",name:"actionQueue"},config:{requestContentType:Alfresco.util.Ajax.JSON,dataObj:{actionedUponNode:Y.nodeRef,actionDefinitionName:aa.action}}};if(YAHOO.lang.isFunction(this[aa.success])){Z.success.callback={fn:this[aa.success],obj:Y,scope:this}}if(aa.successMessage){Z.success.message=this.msg(aa.successMessage,X)}if(YAHOO.lang.isFunction(this[aa.failure])){Z.failure.callback={fn:this[aa.failure],obj:Y,scope:this}}if(aa.failureMessage){Z.failure.message=this.msg(aa.failureMessage,X)}this.modules.actions.genericAction(Z)},onActionFormDialog:function o(Y,W){var aa=this.getAction(Y,W),ac=aa.params,Z={title:this.msg(aa.label)},X=Y.displayName;delete ac["function"];var ab=ac.success;delete ac.success;Z.success={fn:function(ad,ae){if(YAHOO.lang.isFunction(this[ab])){this[ab].call(this,ad,ae)}YAHOO.Bubbling.fire("metadataRefresh",ae)},obj:Y,scope:this};if(ac.successMessage){Z.successMessage=this.msg(ac.successMessage,X);delete ac.successMessage}if(YAHOO.lang.isFunction(this[ac.failure])){Z.failure={fn:this[ac.failure],obj:Y,scope:this};delete ac.failure}if(ac.failureMessage){Z.failureMessage=this.msg(ac.failureMessage,X);delete ac.failureMessage}Z.properties=ac;Alfresco.util.PopupManager.displayForm(Z)},onActionUploadNewVersion:function m(Y){var ad=Y.jsNode,X=Y.displayName,aa=ad.nodeRef,W=Y.version;if(!this.fileUpload){this.fileUpload=Alfresco.getFileUploadInstance()}var ac=this.msg("label.filter-description",X),Z="*";if(X&&new RegExp(/[^\.]+\.[^\.]+/).exec(X)){Z="*"+X.substring(X.lastIndexOf("."))}if(Y.workingCopy&&Y.workingCopy.workingCopyVersion){W=Y.workingCopy.workingCopyVersion}var ab={updateNodeRef:aa.toString(),updateFilename:X,updateVersion:W,overwrite:true,filter:[{description:ac,extensions:Z}],mode:this.fileUpload.MODE_SINGLE_UPDATE,onFileUploadComplete:{fn:this.onNewVersionUploadComplete,scope:this}};if(P(this.options.siteId)){ab.siteId=this.options.siteId;ab.containerId=this.options.containerId}this.fileUpload.show(ab)},_uploadComplete:function L(W,aa){var ab=W.successful.length,X,Z;if(ab>0){if(ab<(this.options.groupActivitiesAt||5)){for(var Y=0;Y<ab;Y++){Z=W.successful[Y];X={fileName:Z.fileName,nodeRef:Z.nodeRef};this.modules.actions.postActivity(this.options.siteId,"file-"+aa,"document-details",X)}}else{X={fileCount:ab,path:this.currentPath,parentNodeRef:this.doclistMetadata.parent.nodeRef};this.modules.actions.postActivity(this.options.siteId,"files-"+aa,"documentlibrary",X)}}},onFileUploadComplete:function q(W){this._uploadComplete(W,"added")},onNewVersionUploadComplete:function x(W){this._uploadComplete(W,"updated")},onActionCancelEditing:function k(X){var W=X.displayName;this.modules.actions.genericAction({success:{event:{name:"metadataRefresh"},message:this.msg("message.edit-cancel.success",W)},failure:{message:this.msg("message.edit-cancel.failure",W)},webscript:{method:Alfresco.util.Ajax.POST,name:"cancel-checkout/node/{nodeRef}",params:{nodeRef:X.jsNode.nodeRef.uri}}})},onActionCopyTo:function j(W){this._copyMoveTo("copy",W)},onActionMoveTo:function h(W){this._copyMoveTo("move",W)},_copyMoveTo:function C(Y,X){if(!Y in {copy:true,move:true}){throw new Error("'"+Y+"' is not a valid Copy/Move to mode.")}if(!this.modules.copyMoveTo){this.modules.copyMoveTo=new Alfresco.module.DoclibCopyMoveTo(this.id+"-copyMoveTo")}var W=[Alfresco.module.DoclibGlobalFolder.VIEW_MODE_SITE];if(this.options.repositoryBrowsing===true){W.push(Alfresco.module.DoclibGlobalFolder.VIEW_MODE_REPOSITORY,Alfresco.module.DoclibGlobalFolder.VIEW_MODE_USERHOME)}this.modules.copyMoveTo.setOptions({allowedViewModes:W,mode:Y,siteId:this.options.siteId,containerId:this.options.containerId,path:this.currentPath,files:X,rootNode:this.options.rootNode,parentId:this.getParentNodeRef(X)}).showDialog()},onActionAssignWorkflow:function d(X){var ab="",W=this.getParentNodeRef(X);if(YAHOO.lang.isArray(X)){for(var Z=0,Y=X.length;Z<Y;Z++){ab+=(Z===0?"":",")+X[Z].nodeRef}}else{ab=X.nodeRef}var aa={selectedItems:ab};if(W){aa.destination=W}Alfresco.util.navigateTo(D("start-workflow"),"POST",aa)},onActionManagePermissions:function I(W){if(!this.modules.permissions){this.modules.permissions=new Alfresco.module.DoclibPermissions(this.id+"-permissions")}this.modules.permissions.setOptions({siteId:this.options.siteId,containerId:this.options.containerId,path:this.currentPath,files:W}).showDialog()},onActionManageAspects:function s(W){if(!this.modules.aspects){this.modules.aspects=new Alfresco.module.DoclibAspects(this.id+"-aspects")}this.modules.aspects.setOptions({file:W}).show()},onActionChangeType:function r(aa){var W=aa.jsNode,ab=W.type,ad=aa.displayName,X=Alfresco.constants.PROXY_URI+E("slingshot/doclib/type/node",W.nodeRef.uri);var ae=function Z(ag){ag.addValidation(this.id+"-changeType-type",function af(am,ai,al,ak,ah,aj){return am.options[am.selectedIndex].value!=="-"},null,"change");ag.setShowSubmitStateDynamically(true,false)};this.modules.changeType=new Alfresco.module.SimpleDialog(this.id+"-changeType").setOptions({width:"30em",templateUrl:Alfresco.constants.URL_SERVICECONTEXT+"modules/documentlibrary/change-type?currentType="+encodeURIComponent(ab),actionUrl:X,doSetupFormsValidation:{fn:ae,scope:this},firstFocus:this.id+"-changeType-type",onSuccess:{fn:function ac(af){YAHOO.Bubbling.fire("metadataRefresh",{highlightFile:ad});Alfresco.util.PopupManager.displayMessage({text:this.msg("message.change-type.success",ad)})},scope:this},onFailure:{fn:function Y(af){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.change-type.failure",ad)})},scope:this}});this.modules.changeType.show()},viewInSourceRepositoryURL:function p(Y,aa){var Z=Y.node,X=Y.location.repositoryId,W=this.options.replicationUrlMapping,ab;if(!X||!W||!W[X]){return"#"}ab=Z.isContainer?aa.folderDetailsUrl:aa.documentDetailsUrl;ab=ab.substring(Alfresco.constants.URL_CONTEXT.length);return E(W[X],"/",ab)},onActionPublish:function l(W){Alfresco.module.getSocialPublishingInstance().show({nodeRef:W.nodeRef,filename:W.fileName})},onActionCloudSync:function Q(W){if(!i){i=new Alfresco.module.DoclibCloudFolder(this.id+"-cloud-folder");var Y=this;YAHOO.Bubbling.on("folderSelected",function Z(ac,ab){this.updateSyncOptions();Alfresco.util.Ajax.jsonPost({url:Alfresco.constants.PROXY_URI+"enterprise/sync/syncsetdefinitions",dataObj:YAHOO.lang.merge(this.options.syncOptions,{memberNodeRefs:Y.getMemberNodeRefs(this.options.files),remoteTenantId:this.options.targetNetwork,targetFolderNodeRef:ab[1].selectedFolder.nodeRef}),successCallback:{fn:function ad(){YAHOO.Bubbling.fire("metadataRefresh");Alfresco.util.PopupManager.displayMessage({text:this.msg("message.sync.success")})},scope:this},failureMessage:this.msg("message.sync.failure")})},i)}else{var aa=i.widgets.optionInputs;if(aa){for(var X=0;X<aa.length;X++){aa[X].checked=aa[X].defaultChecked}}}if(!this.modules.cloudAuth){this.modules.cloudAuth=new Alfresco.module.CloudAuth(this.id+"cloudAuth")}i.setOptions({files:W});this.modules.cloudAuth.setOptions({authCallback:i.showDialog,authCallbackContext:i}).checkAuth()},onActionCloudUnsync:function B(Y){var ad=this,ac=Y.jsNode.isContainer?"folder":"document",X=Y.displayName,ab=(this.options.syncMode==="CLOUD"),W=ab?"":'<div><input type="checkbox" id="requestDeleteRemote" class="requestDeleteRemote-checkBox"><span class="requestDeleteRemote-text">'+this.msg("sync.remove."+ac+".from.cloud",X)+"</span></div>";Alfresco.util.PopupManager.displayPrompt({title:this.msg("actions."+ac+".cloud-unsync"),noEscape:true,text:this.msg("message.unsync.confirm",X)+W,buttons:[{text:this.msg("button.unsync"),handler:function Z(){var ae=ab?false:M.getAttribute("requestDeleteRemote","checked");this.destroy();Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"enterprise/sync/syncsetmembers/"+Y.jsNode.nodeRef.uri+"?requestDeleteRemote="+ae,method:Alfresco.util.Ajax.DELETE,successCallback:{fn:function af(){YAHOO.Bubbling.fire("metadataRefresh");Alfresco.util.PopupManager.displayMessage({text:ad.msg("message.unsync.success")})},scope:ad},failureMessage:ad.msg("message.unsync.failure")})}},{text:this.msg("button.cancel"),handler:function aa(){this.destroy()},isDefault:true}]})},onCloudSyncIndicatorAction:function y(W,aa){var Y=new Alfresco.util.createInfoBalloon(this.widgets.dataTable.getTrEl(aa),{text:this.msg("label.loading"),width:"455px"});Y.show();Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"slingshot/doclib2/node/"+W.nodeRef.replace("://","/"),successCallback:{fn:function Z(ac){var ad=this,ab={showTitle:true,showRequestSyncButton:true,showUnsyncButton:true,showMoreInfoLink:true};Alfresco.util.getSyncStatus(this,W,ac.json,ab,function(af){if(af!=null){Y.html(af.html);Y.requestsync=Alfresco.util.createYUIButton(ad,"button-requestsyn",function(){ad.onActionCloudSyncRequest(W);Y.hide()},{id:ad.id});if(!af.showRequestSyncButton&&Y.requestsync!=null){Y.requestsync.setStyle("display","none")}Y.unsync=Alfresco.util.createYUIButton(ad,"button-unsync",function(){ad.onActionCloudUnsync(W);Y.hide()},{id:ad.id});if(!af.showUnsyncButton&&Y.unsync!=null){Y.unsync.setStyle("display","none")}var ae=Y.content;Alfresco.util.syncClickOnShowDetailsLinkEvent(ad,ae);Alfresco.util.syncClickOnHideLinkEvent(ad,ae);Alfresco.util.syncClickOnTransientErrorShowDetailsLinkEvent(ad,ae);Alfresco.util.syncClickOnTransientErrorHideLinkEvent(ad,ae)}else{Y.hide()}})},scope:this},failureCallback:{fn:function X(ab){Alfresco.util.PopupManager.displayMessage({text:this.msg("sync.unable.get.details")})},scope:this}})},onActionCloudSyncRequest:function u(W,Y){Alfresco.util.Ajax.jsonPost({url:Alfresco.constants.PROXY_URI+"enterprise/sync/syncrequest",dataObj:{memberNodeRefs:this.getMemberNodeRefs(W)},successCallback:{fn:function X(){YAHOO.Bubbling.fire("metadataRefresh");Alfresco.util.PopupManager.displayMessage({text:this.msg("message.request.sync.success")})},scope:this},failureMessage:this.msg("message.request.sync.failure")})},getMemberNodeRefs:function a(W){var Y=new Array();if(YAHOO.lang.isArray(W)){for(var X in W){Y.push(W[X].nodeRef)}}else{Y.push(W.nodeRef)}return Y},onCloudSyncFailedIndicatorAction:function A(W,X){this.onCloudSyncIndicatorAction(W,X)},onCloudIndirectSyncIndicatorAction:function S(W,X){this.onCloudSyncIndicatorAction(W,X)},onCloudIndirectSyncFailedIndicatorAction:function H(W,X){this.onCloudSyncIndicatorAction(W,X)}}})();