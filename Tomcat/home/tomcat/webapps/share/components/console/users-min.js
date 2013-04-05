(function(){var f=YAHOO.util.Dom,B=YAHOO.util.Event,u=YAHOO.util.Element;var v=Alfresco.util.encodeHTML;Alfresco.ConsoleUsers=function(ae){this.name="Alfresco.ConsoleUsers";Alfresco.ConsoleUsers.superclass.constructor.call(this,ae);Alfresco.util.ComponentManager.register(this);Alfresco.util.YUILoaderHelper.require(["button","container","datasource","datatable","json","history"],this.onComponentsLoaded,this);YAHOO.Bubbling.on("viewUserClick",this.onViewUserClick,this);var N=this;SearchPanelHandler=function W(){SearchPanelHandler.superclass.constructor.call(this,"search")};YAHOO.extend(SearchPanelHandler,Alfresco.ConsolePanelHandler,{isSearching:false,onLoad:function D(){N.widgets.searchButton=Alfresco.util.createYUIButton(N,"search-button",N.onSearchClick);N.widgets.newuserButton=Alfresco.util.createYUIButton(N,"newuser-button",N.onNewUserClick);N.widgets.uploadUsersButton=Alfresco.util.createYUIButton(N,"uploadusers-button",N.onUploadUsersClick);var ai=function(aj){if(!aj.json.data.creationAllowed){N.widgets.newuserButton.set("disabled",true);N.widgets.uploadUsersButton.set("disabled",true)}};Alfresco.util.Ajax.jsonGet({url:Alfresco.constants.PROXY_URI+"api/authentication",successCallback:{fn:ai,scope:this},failureMessage:N._msg("message.authenticationdetails-failure",v(N.group))});N.widgets.dataSource=new YAHOO.util.DataSource(Alfresco.constants.PROXY_URI+"api/people",{responseType:YAHOO.util.DataSource.TYPE_JSON,responseSchema:{resultsList:"people",metaFields:{recordOffset:"startIndex",totalRecords:"totalRecords"}}});var af=this;N.widgets.dataSource.doBeforeParseData=function ah(an,al){var ak=al;if(al){var aj=al.people;for(var am=0;am<aj.length;am++){if(aj[am].userName=="guest"||aj[am].userName.indexOf("guest&")==0){aj.splice(am,1)}}aj.sort(function(ap,ao){return(ap.userName>ao.userName)});ak={people:aj}}if(aj.length<N.options.maxSearchResults){af._setResultsMessage("message.results",v(N.searchTerm),aj.length)}else{af._setResultsMessage("message.maxresults",N.options.maxSearchResults)}return ak};this._setupDataTable();var ag=f.get(N.id+"-search-text");new YAHOO.util.KeyListener(ag,{keys:YAHOO.util.KeyListener.KEY.ENTER},{fn:function(){N.onSearchClick()},scope:N,correctScope:true},"keydown").enable()},onShow:function T(){f.get(N.id+"-search-text").focus()},onUpdate:function U(){var ah=f.get(N.id+"-search-text");ah.value=N.searchTerm;if(!this.isSearching&&N.searchTerm!==undefined&&N.searchTerm.length>=N.options.minSearchTermLength){this.isSearching=true;var ak=this;ak._setDefaultDataTableErrors(N.widgets.dataTable);N.widgets.dataTable.set("MSG_EMPTY",N._msg("message.searching"));N.widgets.dataTable.deleteRows(0,N.widgets.dataTable.getRecordSet().getLength());var ai=function ag(al,am,an){ak._enableSearchUI();ak._setDefaultDataTableErrors(N.widgets.dataTable);N.widgets.dataTable.onDataReturnInitializeTable.call(N.widgets.dataTable,al,am,an)};var aj=function af(am,an){ak._enableSearchUI();if(an.status==401){window.location.reload()}else{try{var al=YAHOO.lang.JSON.parse(an.responseText);N.widgets.dataTable.set("MSG_ERROR",al.message);N.widgets.dataTable.showTableMessage(al.message,YAHOO.widget.DataTable.CLASS_ERROR);ak._setResultsMessage("message.noresults")}catch(ao){ak._setDefaultDataTableErrors(N.widgets.dataTable)}}};N.widgets.dataSource.sendRequest(ak._buildSearchParams(N.searchTerm+" [hint:useCQ]"),{success:ai,failure:aj,scope:N});ak._setResultsMessage("message.searchingFor",v(N.searchTerm));N.widgets.searchButton.set("disabled",true);YAHOO.lang.later(2000,ak,function(){if(ak.isSearching){if(!ak.widgets.feedbackMessage){ak.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:Alfresco.util.message("message.searching",N.name),spanClass:"wait",displayTime:0})}else{if(!ak.widgets.feedbackMessage.cfg.getProperty("visible")){ak.widgets.feedbackMessage.show()}}}},[])}},_enableSearchUI:function aa(){if(this.widgets.feedbackMessage&&this.widgets.feedbackMessage.cfg.getProperty("visible")){this.widgets.feedbackMessage.hide()}N.widgets.searchButton.set("disabled",false);this.isSearching=false},_setupDataTable:function Y(){var af=function af(aq,ap,ar,at){f.setStyle(aq,"min-height","64px");f.setStyle(aq.parentNode,"width",ar.width+"px");f.setStyle(aq.parentNode,"border-right","1px solid #D7D7D7");var an=Alfresco.constants.URL_RESCONTEXT+"components/images/no-user-photo-64.png";if(ap.getData("avatar")!==undefined){an=Alfresco.constants.PROXY_URI+ap.getData("avatar")+"?c=queue&ph=true"}f.setStyle(aq,"background-image","url('"+an+"')");f.setStyle(aq,"background-repeat","no-repeat");f.setStyle(aq,"background-position","22px 50%");var ao=(ap.getData("enabled")?"enabled":"disabled");aq.innerHTML='<img class="indicator" alt="'+N._msg("label."+ao)+'" src="'+Alfresco.constants.URL_RESCONTEXT+"components/images/account_"+ao+'.gif" alt="" />'};var am=function am(at,ar,au,av){var aq=ar.getData("firstName"),ap=ar.getData("lastName"),ao=aq+" "+(ap?ap:""),an=document.createElement("a");an.innerHTML=v(ao);YAHOO.util.Event.addListener(an,"click",function(aw){YAHOO.Bubbling.fire("viewUserClick",{username:ar.getData("userName")})},null,N);at.appendChild(an)};var ai=function ai(ap,ao,ar,at){var an=ao.getData("quota");var aq=(an!==-1?Alfresco.util.formatFileSize(an):"");ap.innerHTML=aq};var aj=function ai(ao,an,ap,aq){ao.innerHTML=Alfresco.util.formatFileSize(an.getData("sizeCurrent"))};var al=function al(ao,an,ap,aq){ao.innerHTML=v(aq)};var ah=function ah(ao,an,ar){var aq=ao.getData("sizeCurrent"),ap=an.getData("sizeCurrent");if(ar){return(aq<ap?1:(aq>ap?-1:0))}return(aq<ap?-1:(aq>ap?1:0))};var ag=function ag(ao,an,ar){var aq=ao.getData("quota"),ap=an.getData("quota");if(ar){return(aq<ap?1:(aq>ap?-1:0))}return(aq<ap?-1:(aq>ap?1:0))};var ak=[{key:"avatar",label:"",sortable:false,formatter:af,width:70},{key:"fullName",label:N._msg("label.name"),sortable:true,formatter:am},{key:"userName",label:N._msg("label.username"),sortable:true,formatter:al},{key:"jobtitle",label:N._msg("label.jobtitle"),sortable:true,formatter:al},{key:"email",label:N._msg("label.email"),sortable:true,formatter:al},{key:"usage",label:N._msg("label.usage"),sortable:true,sortOptions:{sortFunction:ah},formatter:aj},{key:"quota",label:N._msg("label.quota"),sortable:true,sortOptions:{sortFunction:ag},formatter:ai}];N.widgets.dataTable=new YAHOO.widget.DataTable(N.id+"-datatable",ak,N.widgets.dataSource,{initialLoad:false,renderLoopSize:32,sortedBy:{key:"userName",dir:"asc"},MSG_EMPTY:N._msg("message.empty")})},_setDefaultDataTableErrors:function H(af){var ag=Alfresco.util.message;af.set("MSG_EMPTY",N._msg("message.empty","Alfresco.ConsoleUsers"));af.set("MSG_ERROR",N._msg("message.error","Alfresco.ConsoleUsers"))},_buildSearchParams:function Z(af){return"?filter="+encodeURIComponent(af)+"&maxResults="+N.options.maxSearchResults},_setResultsMessage:function P(ai,ah,ag){var af=f.get(N.id+"-search-bar");af.innerHTML=N._msg(ai,ah,ag)}});new SearchPanelHandler();ViewPanelHandler=function R(){ViewPanelHandler.superclass.constructor.call(this,"view")};YAHOO.extend(ViewPanelHandler,Alfresco.ConsolePanelHandler,{onLoad:function D(){N.widgets.gobackButton=Alfresco.util.createYUIButton(N,"goback-button",N.onGoBackClick);N.widgets.deleteuserButton=Alfresco.util.createYUIButton(N,"deleteuser-button",N.onDeleteUserClick);N.widgets.edituserButton=Alfresco.util.createYUIButton(N,"edituser-button",N.onEditUserClick)},onBeforeShow:function ad(){f.get(N.id+"-view-title").innerHTML="";f.setStyle(N.id+"-view-main","visibility","hidden")},onShow:function T(){window.scrollTo(0,0)},onUpdate:function U(){var af=function(al){var ao=function(au,at){f.get(N.id+au).innerHTML=at?v(at):""};var aj=YAHOO.lang.JSON.parse(al.serverResponse.responseText);var ar=f.getElementsByClassName("view-photoimg","img");for(var ai in ar){ar[ai].src=aj.avatar?Alfresco.constants.PROXY_URI+aj.avatar+"?c=force":Alfresco.constants.URL_RESCONTEXT+"components/images/no-user-photo-64.png"}var an=aj.firstName,ap=aj.lastName,ag=an+" "+(ap?ap:"");ao("-view-title",ag);ao("-view-name",ag);ao("-view-jobtitle",aj.jobtitle);ao("-view-organization",aj.organization);var aq=aj.persondescription?aj.persondescription:"";f.get(N.id+"-view-bio").innerHTML=aq.replace(/\n/g,"<br/>");ao("-view-location",aj.location);ao("-view-email",aj.email);ao("-view-telephone",aj.telephone);ao("-view-mobile",aj.mobile);ao("-view-skype",aj.skype);ao("-view-instantmsg",aj.instantmsg);ao("-view-googleusername",aj.googleusername);ao("-view-companyname",aj.organization);var am="";am+=aj.companyaddress1?(v(aj.companyaddress1)+"<br/>"):"";am+=aj.companyaddress2?(v(aj.companyaddress2)+"<br/>"):"";am+=aj.companyaddress3?(v(aj.companyaddress3)+"<br/>"):"";am+=aj.companypostcode?(v(aj.companypostcode)+"<br/>"):"";f.get(N.id+"-view-companyaddress").innerHTML=am;ao("-view-companytelephone",aj.companytelephone);ao("-view-companyfax",aj.companyfax);ao("-view-companyemail",aj.companyemail);ao("-view-username",N.currentUserId);ao("-view-enabled",aj.enabled?N._msg("label.enabled"):N._msg("label.disabled"));ao("-view-quota",(aj.quota!==-1?Alfresco.util.formatFileSize(aj.quota):""));ao("-view-usage",Alfresco.util.formatFileSize(aj.sizeCurrent));var ak=function(){return this.displayName};for(var ai=0,ah=aj.groups.length;ai<ah;aj.groups[ai++].toString=ak){}ao("-view-groups",aj.groups.join(", "));f.setStyle(N.id+"-view-main","visibility","visible")};Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/people/"+encodeURIComponent(N.currentUserId)+"?groups=true",method:Alfresco.util.Ajax.GET,successCallback:{fn:af,scope:N},failureMessage:N._msg("message.getuser-failure",v(N.currentUserId))})}});new ViewPanelHandler();CreatePanelHandler=function C(){CreatePanelHandler.superclass.constructor.call(this,"create")};YAHOO.extend(CreatePanelHandler,Alfresco.ConsolePanelHandler,{_visible:false,_groups:[],_form:null,onLoad:function D(){YAHOO.Bubbling.on("itemSelected",this.onGroupSelected,this);YAHOO.Bubbling.on("removeGroupCreate",this.onRemoveGroupCreate,this);N.widgets.createuserOkButton=Alfresco.util.createYUIButton(N,"createuser-ok-button",N.onCreateUserOKClick);N.widgets.createuserAnotherButton=Alfresco.util.createYUIButton(N,"createuser-another-button",N.onCreateUserAnotherClick);N.widgets.createuserCancelButton=Alfresco.util.createYUIButton(N,"createuser-cancel-button",N.onCreateUserCancelClick);var af=new Alfresco.forms.Form(N.id+"-create-form");af.setSubmitElements([N.widgets.createuserOkButton,N.widgets.createuserAnotherButton]);af.setShowSubmitStateDynamically(true);af.addValidation(N.id+"-create-firstname",Alfresco.forms.validation.mandatory,null,"keyup");af.addValidation(N.id+"-create-email",Alfresco.forms.validation.mandatory,null,"keyup");af.addValidation(N.id+"-create-email",Alfresco.forms.validation.email,null,"keyup");af.addValidation(N.id+"-create-username",Alfresco.forms.validation.nodeName,null,"keyup");af.addValidation(N.id+"-create-username",Alfresco.forms.validation.length,{min:N.options.minUsernameLength,max:100,crop:true,includeWhitespace:false},"keyup");af.addValidation(N.id+"-create-password",Alfresco.forms.validation.length,{min:N.options.minPasswordLength,max:100,crop:true},"keyup");af.addValidation(N.id+"-create-verifypassword",Alfresco.forms.validation.length,{min:N.options.minPasswordLength,max:100,crop:true},"keyup");af.init();this._form=af;Alfresco.util.Ajax.request({url:Alfresco.constants.URL_SERVICECONTEXT+"components/people-finder/group-finder",dataObj:{htmlid:N.id+"-create-groupfinder"},successCallback:{fn:this.onGroupFinderLoaded,scope:this},failureMessage:"Could not load Group Finder component",execScripts:true})},onGroupFinderLoaded:function I(ag){var af=f.get(N.id+"-create-groupfinder");af.innerHTML=ag.serverResponse.responseText;N.modules.createGroupFinder=Alfresco.util.ComponentManager.get(N.id+"-create-groupfinder");N.modules.createGroupFinder.setOptions({viewMode:Alfresco.GroupFinder.VIEW_MODE_COMPACT,singleSelectMode:false,wildcardPrefix:false})},onGroupSelected:function Q(ag,af){if(this._visible){this.addGroup(af[1])}},addGroup:function L(ak){var ai=false;for(var ah=0,ag=this._groups.length;ah<ag;ah++){if(this._groups[ah]!=null&&this._groups[ah].itemName===ak.itemName){ai=true;break}}if(!ai){this._groups.push(ak);var aj=f.get(N.id+"-create-groups");var af=(this._groups.length-1);var al=document.createElement("span");al.setAttribute("id",N.id+"_group"+af);al.setAttribute("title",N._msg("label.removegroup"));f.addClass(al,"group-item");al.innerHTML=v(ak.displayName);aj.appendChild(al);Alfresco.util.useAsButton(al,function(an,am){YAHOO.Bubbling.fire("removeGroupCreate",{id:am.idx});YAHOO.Bubbling.fire("itemDeselected",{eventGroup:N.modules.createGroupFinder,itemName:am.group.itemName})},{idx:af,group:ak})}},getGroups:function X(){var af=[];for(var ah=0,ag=this._groups.length;ah<ag;ah++){if(this._groups[ah]!=null){af.push(this._groups[ah].itemName)}}return af},onRemoveGroupCreate:function K(ai,af){var ag=af[1].id;var ah=f.get(N.id+"_group"+ag);ah.parentNode.removeChild(ah);this._groups[ag]=null},onBeforeShow:function ad(){f.setStyle(N.id+"-create-main","visibility","hidden");this.clear()},clear:function S(){var af=function(ag){f.get(N.id+ag).value=""};af("-create-firstname");af("-create-lastname");af("-create-email");af("-create-username");af("-create-password");af("-create-verifypassword");af("-create-quota");f.get(N.id+"-create-disableaccount").checked=false;f.get(N.id+"-create-quotatype").value="gb";this._groups=[];f.get(N.id+"-create-groups").innerHTML="";if(N.modules.createGroupFinder){N.modules.createGroupFinder.clearResults()}if(this._form!==null){this._form.init()}YAHOO.Bubbling.fire("allItemsDeselected",{eventGroup:N.modules.createGroupFinder})},onShow:function T(){this._visible=true;window.scrollTo(0,0);f.setStyle(N.id+"-create-main","visibility","visible");f.get(N.id+"-create-firstname").focus()},onHide:function E(){this._visible=false}});new CreatePanelHandler();UpdatePanelHandler=function ac(){UpdatePanelHandler.superclass.constructor.call(this,"update")};YAHOO.extend(UpdatePanelHandler,Alfresco.ConsolePanelHandler,{_visible:false,_removedGroups:[],_addedGroups:[],_originalGroups:[],_groups:[],_photoReset:false,_form:null,onLoad:function D(){YAHOO.Bubbling.on("itemSelected",this.onGroupSelected,this);YAHOO.Bubbling.on("removeGroupUpdate",this.onRemoveGroupUpdate,this);N.widgets.updateuserSaveButton=Alfresco.util.createYUIButton(N,"updateuser-save-button",N.onUpdateUserOKClick);N.widgets.updateuserCancelButton=Alfresco.util.createYUIButton(N,"updateuser-cancel-button",N.onUpdateUserCancelClick);N.widgets.updateuserClearPhotoButton=Alfresco.util.createYUIButton(N,"updateuser-clearphoto-button",N.onUpdateUserClearPhotoClick);var af=new Alfresco.forms.Form(N.id+"-update-form");af.setSubmitElements(N.widgets.updateuserSaveButton);af.setShowSubmitStateDynamically(true);af.addValidation(N.id+"-update-firstname",Alfresco.forms.validation.mandatory,null,"keyup");af.addValidation(N.id+"-update-email",Alfresco.forms.validation.mandatory,null,"keyup");af.addValidation(N.id+"-update-email",Alfresco.forms.validation.email,null,"keyup");af.init();this._form=af;Alfresco.util.Ajax.request({url:Alfresco.constants.URL_SERVICECONTEXT+"components/people-finder/group-finder",dataObj:{htmlid:N.id+"-update-groupfinder"},successCallback:{fn:this.onGroupFinderLoaded,scope:this},failureMessage:"Could not load Group Finder component",execScripts:true})},onGroupFinderLoaded:function I(ag){var af=f.get(N.id+"-update-groupfinder");af.innerHTML=ag.serverResponse.responseText;N.modules.updateGroupFinder=Alfresco.util.ComponentManager.get(N.id+"-update-groupfinder");N.modules.updateGroupFinder.setOptions({viewMode:Alfresco.GroupFinder.VIEW_MODE_COMPACT,singleSelectMode:false,wildcardPrefix:false})},onGroupSelected:function Q(ag,af){if(this._visible){this.addGroup(af[1])}},addGroup:function L(ak){var ai=false,ah,ag;for(ah=0,ag=this._groups.length;ah<ag;ah++){if(this._groups[ah]!==null&&this._groups[ah].itemName===ak.itemName){ai=true;break}}if(!ai){this._groups.push(ak);var aj=f.get(N.id+"-update-groups"),af=(this._groups.length-1),al=document.createElement("span");al.setAttribute("id",N.id+"_group"+af);al.setAttribute("title",N._msg("label.removegroup"));f.addClass(al,"group-item");al.innerHTML=v(ak.displayName);aj.appendChild(al);Alfresco.util.useAsButton(al,function(an,am){YAHOO.Bubbling.fire("removeGroupUpdate",{id:am.idx});YAHOO.Bubbling.fire("itemDeselected",{eventGroup:N.modules.updateGroupFinder,itemName:am.group.itemName})},{idx:af,group:ak});ai=false;for(ah=0,ag=this._originalGroups.length;ah<ag;ah++){if(this._originalGroups[ah].itemName===ak.itemName){ai=true;break}}if(!ai){this._addedGroups.push(ak.itemName)}}},onRemoveGroupUpdate:function G(ak,ag){var ah=ag[1].id;var ai=f.get(N.id+"_group"+ah);ai.parentNode.removeChild(ai);var aj=this._groups[ah];this._groups[ah]=null;for(var ah=0,af=this._originalGroups.length;ah<af;ah++){if(this._originalGroups[ah].itemName===aj.itemName){this._removedGroups.push(aj.itemName);break}}for(var ah=0,af=this._addedGroups.length;ah<af;ah++){if(this._addedGroups[ah]===aj.itemName){this._addedGroups.splice(ah,1);break}}},getAddedGroups:function V(){return this._addedGroups},getRemovedGroups:function ab(){return this._removedGroups},resetGroups:function F(){this._groups=[];this._addedGroups=[];this._removedGroups=[];f.get(N.id+"-update-groups").innerHTML=""},setPhotoReset:function O(){this._photoReset=true},getPhotoReset:function J(){return this._photoReset},onBeforeShow:function ad(){f.get(N.id+"-update-title").innerHTML="";f.setStyle(N.id+"-update-main","visibility","hidden")},onShow:function T(){this._visible=true;window.scrollTo(0,0)},onHide:function E(){this._visible=false},onUpdate:function U(){var af=this;var ag=function(am){var ao=function(au,at){f.get(N.id+au).value=at};var ar=function(av,at,au){if(au["{http://www.alfresco.org/model/content/1.0}"+at]){f.get(N.id+av).setAttribute("disabled",true)}};var al=YAHOO.lang.JSON.parse(am.serverResponse.responseText);var aq=f.getElementsByClassName("update-photoimg","img");for(var ak in aq){aq[ak].src=al.avatar?Alfresco.constants.PROXY_URI+al.avatar+"?c=force":Alfresco.constants.URL_RESCONTEXT+"components/images/no-user-photo-64.png"}var an=al.firstName,ap=al.lastName,ai=an+" "+(ap?ap:"");f.get(N.id+"-update-title").innerHTML=v(ai);ao("-update-firstname",an);ar("-update-firstname","firstName",al.immutability);ao("-update-lastname",ap);ar("-update-lastname","lastName",al.immutability);ao("-update-email",al.email);ar("-update-email","email",al.immutability);if(!al.capabilities.isMutable){f.get(N.id+"-update-old-password").setAttribute("disabled",true);f.get(N.id+"-update-password").setAttribute("disabled",true);f.get(N.id+"-update-verifypassword").setAttribute("disabled",true);f.get(N.id+"-update-disableaccount").setAttribute("disabled",true)}ao("-update-old-password","");ao("-update-password","");ao("-update-verifypassword","");var ah=al.quota;if(ah!==-1){if(ah<Alfresco.util.BYTES_MB){ah=Math.round(ah/Alfresco.util.BYTES_KB);f.get(N.id+"-update-quotatype").value="kb"}else{if(ah<Alfresco.util.BYTES_GB){ah=Math.round(ah/Alfresco.util.BYTES_MB);f.get(N.id+"-update-quotatype").value="mb"}else{ah=Math.round(ah/Alfresco.util.BYTES_GB);f.get(N.id+"-update-quotatype").value="gb"}}ao("-update-quota",ah.toString())}else{ao("-update-quota","")}f.get(N.id+"-update-disableaccount").checked=(al.enabled==false);af.resetGroups();YAHOO.Bubbling.fire("allItemsDeselected",{eventGroup:N.modules.updateGroupFinder});af._originalGroups=al.groups;for(var ak=0,aj=al.groups.length;ak<aj;ak++){af.addGroup({itemName:al.groups[ak].itemName,displayName:al.groups[ak].displayName});YAHOO.Bubbling.fire("itemSelected",{eventGroup:N.modules.updateGroupFinder,itemName:al.groups[ak].itemName,displayName:al.groups[ak].displayName})}if(N.currentUserId.toLowerCase()===Alfresco.constants.USERNAME.toLowerCase()){f.setStyle(N.id+"-oldpassword-wrapper","display","block")}else{f.setStyle(N.id+"-oldpassword-wrapper","display","none")}f.setStyle(N.id+"-update-main","visibility","visible");af._form.updateSubmitElements()};Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/people/"+encodeURIComponent(N.currentUserId)+"?groups=true",method:Alfresco.util.Ajax.GET,successCallback:{fn:ag,scope:N},failureMessage:N._msg("message.getuser-failure",v(N.currentUserId))})}});new UpdatePanelHandler();CSVResultsPanelHandler=function M(){CSVResultsPanelHandler.superclass.constructor.call(this,"csvresults")};YAHOO.extend(CSVResultsPanelHandler,Alfresco.ConsolePanelHandler,{onLoad:function D(){N.widgets.csvGobackButton=Alfresco.util.createYUIButton(N,"csv-goback-button",N.onGoBackClick)},onShow:function T(){if(N.csvResults){var ah;var aj=N.csvResults.successful;if(aj&&aj.length>0&&N.csvResults.successful[0].response){aj=aj[0].response;if(aj.data&&aj.data.users){N.fileUpload.hide();ah=new YAHOO.util.DataSource(aj.data.users);ah.responseType=YAHOO.util.DataSource.TYPE_JSARRAY;ah.responseSchema={fields:["username","uploadStatus"]};if(aj.data.addedUsers==0){Alfresco.util.PopupManager.displayMessage({text:N._msg("message.csvupload.failure")})}else{if(aj.data.addedUsers==aj.data.totalUsers){Alfresco.util.PopupManager.displayMessage({text:N._msg("message.csvupload.success",aj.data.addedUsers)})}else{var af=aj.data.totalUsers-aj.data.addedUsers;Alfresco.util.PopupManager.displayMessage({text:N._msg("message.csvupload.partialSuccess",aj.data.addedUsers,af)})}}var ai=[{key:"username",label:N._msg("label.username"),sortable:true,resizeable:true},{key:"uploadStatus",label:N._msg("label.uploadStatus"),sortable:true,resizeable:true}];var ag=new YAHOO.widget.DataTable(N.id+"-csvresults-datatable",ai,ah);f.removeClass(N.id+"-csvresults-success","hidden");f.addClass(N.id+"-csvresults-failure","hidden")}else{N.fileUpload.hide();Alfresco.util.PopupManager.displayMessage({text:N._msg("message.csvupload.error")});f.get(N.id+"-csvresults-error").innerHTML=aj.message;f.addClass(N.id+"-csvresults-success","hidden");f.removeClass(N.id+"-csvresults-failure","hidden")}}else{}}}});new CSVResultsPanelHandler();return this};YAHOO.extend(Alfresco.ConsoleUsers,Alfresco.ConsoleTool,{options:{minSearchTermLength:1,maxSearchResults:100,minUsernameLength:2,minPasswordLength:3},currentUserId:"",searchTerm:undefined,csvResults:undefined,onReady:function m(){this.popups.deleteDialog=Alfresco.util.createYUIPanel("deleteDialog",{width:"36em",text:'<div class="yui-u" style="text-align:center"><br/>'+this._msg("panel.delete.msg")+"<br/><br/></div>",buttons:[{text:this._msg("button.delete"),handler:{fn:this.onDeleteUserOK,scope:this}},{text:this._msg("button.cancel"),handler:{fn:this.onDeleteUserCancel,scope:this},isDefault:true}]},{type:YAHOO.widget.SimpleDialog});this.popups.deleteDialog.setHeader(this._msg("panel.delete.header"));Alfresco.ConsoleUsers.superclass.onReady.call(this)},onStateChanged:function s(F,D){var E=this.decodeHistoryState(D[1].state);if(E.panel){this.showPanel(E.panel)}if(E.search!==undefined&&this.currentPanelId==="search"){var C=E.search;this.searchTerm=C;this.updateCurrentPanel()}if(E.userid&&(this.currentPanelId==="view"||this.currentPanelId==="create"||this.currentPanelId==="update")){this.currentUserId=E.userid;this.updateCurrentPanel()}},onSearchClick:function A(F,E){var D=f.get(this.id+"-search-text");var C=YAHOO.lang.trim(D.value);if(C.replace(/\*/g,"").length<this.options.minSearchTermLength){Alfresco.util.PopupManager.displayMessage({text:this._msg("message.minimum-length",this.options.minSearchTermLength)});return}this.refreshUIState({search:C})},onUploadUsersClick:function l(F,D){if(!this.fileUpload){this.fileUpload=Alfresco.util.ComponentManager.findFirst("Alfresco.HtmlUpload")}var C={uploadURL:"api/people/upload.html",mode:this.fileUpload.MODE_SINGLE_UPLOAD,onFileUploadComplete:{fn:this.onUsersUploadComplete,scope:this}};this.fileUpload.show(C);var E=f.get(this.fileUpload.id+"-singleUploadTip-span");f.addClass(E,"hidden");B.preventDefault(F)},onUsersUploadComplete:function w(C){this.csvResults=C;this.refreshUIState({panel:"csvresults"})},onNewUserClick:function t(D,C){this.refreshUIState({panel:"create"})},onEditUserClick:function k(D,C){this.refreshUIState({panel:"update"})},onViewUserClick:function h(E,D){var C=D[1].username;this.refreshUIState({panel:"view",userid:C})},onGoBackClick:function x(D,C){this.refreshUIState({panel:"search"})},onDeleteUserClick:function y(D,C){this.popups.deleteDialog.show()},onDeleteUserOK:function n(C){Alfresco.util.Ajax.request({method:Alfresco.util.Ajax.DELETE,url:Alfresco.constants.PROXY_URI+"api/people/"+encodeURIComponent(this.currentUserId),successCallback:{fn:this.onDeletedUser,scope:this},failureMessage:this._msg("panel.delete.fail")})},onDeletedUser:function d(C){this.popups.deleteDialog.hide();Alfresco.util.PopupManager.displayMessage({text:this._msg("message.delete-success")});this.refreshUIState({panel:"search"})},onDeleteUserCancel:function a(C){this.popups.deleteDialog.hide()},onCreateUserOKClick:function j(E,C){var D=function(F){window.scrollTo(0,0);Alfresco.util.PopupManager.displayMessage({text:this._msg("message.create-success")});this.refreshUIState({panel:"search"})};this._createUser(D)},onCreateUserAnotherClick:function p(F,C){var E=this;var D=function(G){window.scrollTo(0,0);Alfresco.util.PopupManager.displayMessage({text:E._msg("message.create-success")});this._getCurrentPanel().clear();f.get(E.id+"-create-firstname").focus()};this._createUser(D)},onCreateUserCancelClick:function r(D,C){this.refreshUIState({panel:"search"})},onUpdateUserOKClick:function z(F,C){var E=this;var D=function(G){window.scrollTo(0,0);Alfresco.util.PopupManager.displayMessage({text:E._msg("message.update-success")});E.refreshUIState({panel:"view"})};this._updateUser(D)},onUpdateUserCancelClick:function o(D,C){this.refreshUIState({panel:"view"})},onUpdateUserClearPhotoClick:function c(D,C){f.get(this.id+"-update-photoimg").src=Alfresco.constants.URL_RESCONTEXT+"components/images/no-user-photo-64.png";this._getCurrentPanel().setPhotoReset()},encodeHistoryState:function q(E){var C={};if(this.currentPanelId!==""){C.panel=this.currentPanelId}if(this.currentUserId!==""){C.userid=this.currentUserId}if(this.searchTerm!==undefined){C.search=this.searchTerm}var D="";if(E.panel||C.panel){D+="panel="+encodeURIComponent(E.panel?E.panel:C.panel)}if(E.userid||C.userid){if(D.length!==0){D+="&"}D+="userid="+encodeURIComponent(E.userid?E.userid:C.userid)}if(E.search!==undefined||C.search!==undefined){if(D.length!==0){D+="&"}D+="search="+encodeURIComponent(E.search!==undefined?E.search:C.search)}return D},_createUser:function g(K){var I=this;var F=function(L){return YAHOO.lang.trim(f.get(I.id+L).value)};var J=F("-create-password");var C=F("-create-verifypassword");if(J!==C){Alfresco.util.PopupManager.displayMessage({text:this._msg("message.password-validate-failure")});return}var G=F("-create-username");var D=this._calculateQuota(I.id+"-create");var E=this._getCurrentPanel().getGroups();var H={userName:G,password:J,firstName:F("-create-firstname"),lastName:F("-create-lastname"),email:F("-create-email"),disableAccount:f.get(I.id+"-create-disableaccount").checked,quota:D,groups:E};Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/people",method:Alfresco.util.Ajax.POST,dataObj:H,requestContentType:Alfresco.util.Ajax.JSON,successCallback:{fn:K,scope:this},failureCallback:{fn:function(M){if(M.serverResponse.status===409){Alfresco.util.PopupManager.displayPrompt({title:this._msg("message.failure"),text:this._msg("message.create-user-exists")})}else{var L=Alfresco.util.parseJSON(M.serverResponse.responseText);Alfresco.util.PopupManager.displayPrompt({title:this._msg("message.failure"),text:this._msg("message.create-failure",L?L.message:M.serverResponse.statusText)})}},scope:this}})},_updateUser:function b(N){var J=this;var K=(this.currentUserId.toLowerCase()===Alfresco.constants.USERNAME.toLowerCase());var G=function(O){return f.get(J.id+O).value};var C=function(O){var P=function(Q){if(YAHOO.lang.trim(G("-update-password")).length!==0){var R={newpw:YAHOO.lang.trim(G("-update-password"))};if(K==true){R.oldpw=YAHOO.lang.trim(G("-update-old-password"))}Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/person/changepassword/"+encodeURIComponent(J.currentUserId),method:Alfresco.util.Ajax.POST,dataObj:R,requestContentType:Alfresco.util.Ajax.JSON,successCallback:{fn:N,scope:J},failureMessage:J._msg("message.password-failure")})}else{N.call()}};if(this._getCurrentPanel().getPhotoReset()){Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"slingshot/profile/resetavatar/"+encodeURIComponent(this.currentUserId),method:Alfresco.util.Ajax.PUT,requestContentType:Alfresco.util.Ajax.JSON,successCallback:{fn:P,scope:this},failureCallback:{fn:function(Q){Alfresco.util.PopupManager.displayPrompt({title:this._msg("message.failure"),text:this._msg("message.clear-photo-failure")});P.call()},scope:this}})}else{P.call()}};var M=G("-update-old-password");var L=G("-update-password");var D=G("-update-verifypassword");if(YAHOO.lang.trim(L).length!==0){if(K==true&&(YAHOO.lang.trim(M).length===0)){Alfresco.util.PopupManager.displayMessage({text:this._msg("message.password-validate-oldpw")});return}if(YAHOO.lang.trim(L).length<this.options.minPasswordLength){Alfresco.util.PopupManager.displayMessage({text:this._msg("message.password-validate-length",this.options.minPasswordLength)});return}if(L!==D){Alfresco.util.PopupManager.displayMessage({text:this._msg("message.password-validate-failure")});return}}var E=this._calculateQuota(J.id+"-update");var H=this._getCurrentPanel().getAddedGroups();var F=this._getCurrentPanel().getRemovedGroups();var I={firstName:G("-update-firstname"),lastName:G("-update-lastname"),email:G("-update-email"),disableAccount:f.get(J.id+"-update-disableaccount").checked,quota:E,addGroups:H,removeGroups:F};Alfresco.util.Ajax.request({url:Alfresco.constants.PROXY_URI+"api/people/"+encodeURIComponent(this.currentUserId),method:Alfresco.util.Ajax.PUT,dataObj:I,requestContentType:Alfresco.util.Ajax.JSON,successCallback:{fn:C,scope:this},failureCallback:{fn:function(P){var O=Alfresco.util.parseJSON(P.serverResponse.responseText);Alfresco.util.PopupManager.displayPrompt({title:this._msg("message.failure"),text:this._msg("message.update-failure",O.message)})},scope:this}})},_calculateQuota:function i(E){var D=-1;var F=f.get(E+"-quota").value;if(F.length!==0){try{D=parseInt(F);if(D>=0){var C=f.get(E+"-quotatype").value;if(C==="gb"){D*=Alfresco.util.BYTES_GB}else{if(C==="mb"){D*=Alfresco.util.BYTES_MB}else{if(C==="kb"){D*=Alfresco.util.BYTES_KB}}}}else{D=-1}}catch(G){}}return D},_msg:function e(C){return Alfresco.util.message.call(this,C,"Alfresco.ConsoleUsers",Array.prototype.slice.call(arguments).slice(1))}})})();