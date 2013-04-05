(function(){var c=YAHOO.util.Dom,r=YAHOO.util.Event,k=YAHOO.util.KeyListener;Alfresco.module.HistoricPropertiesViewer=function(t){this.name="Alfresco.module.HistoricPropertiesViewer";this.id=t;var s=Alfresco.util.ComponentManager.get(this.id);if(s!==null){throw new Error("An instance of Alfresco.module.HistoricPropertiesViewer already exists.")}Alfresco.util.ComponentManager.register(this);Alfresco.util.YUILoaderHelper.require(["button","container"],this.onComponentsLoaded,this);return this};Alfresco.module.HistoricPropertiesViewer.prototype={defaultShowConfig:{nodeRef:null,filename:null,version:null},showConfig:{},versions:[],earliestVersion:{},widgets:{},onComponentsLoaded:function o(){if(this.id===null){return}},show:function e(t){this.showConfig=YAHOO.lang.merge(this.defaultShowConfig,t);if(this.showConfig.nodeRef===undefined||this.showConfig.filename===undefined||this.showConfig.currentNodeRef===undefined){throw new Error("A nodeRef, filename and version must be provided")}var s=Alfresco.util.ComponentManager.findFirst("Alfresco.DocumentVersions");if(s){this.versions=s.versionCache}if(this.widgets.panel){this.update(this.showConfig.nodeRef);this._showPanel()}else{Alfresco.util.Ajax.request({url:Alfresco.constants.URL_SERVICECONTEXT+"modules/document-details/historic-properties-viewer?nodeRef="+this.showConfig.currentNodeRef+"&htmlid="+this.id,successCallback:{fn:this.onTemplateLoaded,scope:this},failureMessage:"Could not load html template for properties viewer",execScripts:true});this.widgets.escapeListener=new k(document,{keys:k.KEY.ESCAPE},{fn:this.onCancelButtonClick,scope:this,correctScope:true})}},onTemplateLoaded:function a(s){var u=document.createElement("div");u.innerHTML=s.serverResponse.responseText;var t=YAHOO.util.Dom.getFirstChild(u);this.widgets.panel=Alfresco.util.createYUIPanel(t);this.createMenu(t);this.widgets.headerText=c.get(this.id+"-header-span");this.widgets.cancelButton=Alfresco.util.createYUIButton(this,"cancel-button",this.onCancelButtonClick);this.widgets.formContainer=c.get(this.id+"-properties-form");navEls=c.getElementsByClassName("historic-properties-nav","a",this.id+"-dialog");r.addListener(navEls[0],"click",this.onNavButtonClick,this,true);r.addListener(navEls[1],"click",this.onNavButtonClick,this,true);this.updateNavState();this.loadProperties();this._showPanel()},onVersionMenuChange:function d(x,w,v){var t=w[0],u=w[1],s=u.value;this.update(s)},update:function l(s){if(s){this.showConfig.nodeRef=s;this.loadProperties();this.setMenuTitle();this.updateNavState()}},updateNavState:function j(){var s=c.getElementsByClassName("historic-properties-nav","a",this.id+"-dialog");c.removeClass(s,"disabled");if(this.showConfig.nodeRef===this.earliestVersion.nodeRef){c.addClass(s[0],"disabled")}else{if(this.showConfig.nodeRef===this.showConfig.latestVersion.nodeRef){c.addClass(s[1],"disabled")}}},createMenu:function q(B){var v=c.get(this.id+"-versionNav-menu"),E=c.getElementsByClassName("nav","div",B)[0],w=document.createElement("h6"),A=document.createElement("h6"),D=Alfresco.util.message("historicProperties.menu.title",this.name,{"0":this.showConfig.latestVersion.label}),x,s=[],u;s.push({value:this.showConfig.latestVersion.nodeRef,text:D});for(x in this.versions){var z=this.versions[x],C=Alfresco.util.message("historicProperties.menu.title",this.name,{"0":z.label});if(parseInt(x,10)===this.versions.length-1){this.earliestVersion=z}s.push({value:z.nodeRef,text:C});if(z.nodeRef===this.showConfig.nodeRef){u=C}}for(var x=0;x<s.length;x++){var y=document.createElement("option");y.text=s[x].text;y.value=s[x].value;v.add(y)}this.widgets.versionMenu=new Alfresco.util.createYUIButton(this,"versionNav-button",this.onVersionMenuChange,{type:"menu",menu:v,lazyloadmenu:false});this.setMenuTitle(u);var F=c.getElementsByClassName("first-of-type","ul",E)[0],t=c.getElementsByClassName("first-of-type","li",F)[0];w.innerHTML=Alfresco.util.message("historicProperties.menu.current",this.name);A.innerHTML=Alfresco.util.message("historicProperties.menu.previous",this.name);c.insertBefore(w,t);c.insertAfter(A,t)},getVersionNodeRef:function h(u){var w=this.showConfig.nodeRef,v,x,t,s;t=-1;for(v in this.versions){if(this.versions[v].nodeRef===w){t=v}if(this.versions[v].label===u){s=v}}if(u===this.showConfig.latestVersion.label){return this.showConfig.latestVersion.nodeRef}else{if(u==="next"){s=parseInt(t,10)-1}else{if(u==="previous"){s=parseInt(t,10)+1}}}if(s===-1){return this.showConfig.latestVersion.nodeRef}returnVersion=this.versions[s];if(typeof(returnVersion)!=="undefined"){x=returnVersion.nodeRef;return x}},onCancelButtonClick:function b(){this.widgets.panel.hide();this.widgets.escapeListener.disable()},onNavButtonClick:function f(u,w){var v=r.getTarget(u),t=v.rel,s=this.getVersionNodeRef(t);if(!c.hasClass(v,"disabled")){this.update(s)}r.preventDefault(u)},loadProperties:function n(){Alfresco.util.Ajax.request({url:Alfresco.constants.URL_SERVICECONTEXT+"components/form?itemKind=node&itemId="+this.showConfig.nodeRef+"&mode=view&htmlid="+this.id,successCallback:{fn:this.onPropertiesLoaded,scope:this},failureMessage:"Could not version properties",execScripts:true})},setMenuTitle:function m(u){var s,t;if(!u){if(this.showConfig.nodeRef===this.showConfig.latestVersion.nodeRef){s=this.showConfig.latestVersion.label;u=Alfresco.util.message("historicProperties.menu.title.latest",this.name,{"0":s})}else{for(t in this.versions){if(this.versions[t].nodeRef===this.showConfig.nodeRef){s=this.versions[t].label}}u=Alfresco.util.message("historicProperties.menu.title",this.name,{"0":s})}}this.widgets.versionMenu.set("label",u)},onPropertiesLoaded:function i(s){this.widgets.formContainer.innerHTML=s.serverResponse.responseText},_applyConfig:function g(){var s=Alfresco.util.message("historicProperties.dialogue.header",this.name,{"0":"<strong>"+this.showConfig.filename+"</strong>"});this.widgets.headerText.innerHTML=s;this.widgets.cancelButton.set("disabled",false)},_showPanel:function p(){this._applyConfig();this.widgets.escapeListener.enable();this.widgets.panel.show()}}})();Alfresco.module.getHistoricPropertiesViewerInstance=function(){var a="alfresco-historicPropertiesViewer-instance";return Alfresco.util.ComponentManager.get(a)||new Alfresco.module.HistoricPropertiesViewer(a)};