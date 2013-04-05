(function(){var b=YAHOO.util.Dom,r=YAHOO.util.Event,m=YAHOO.util.Selector;var l=Alfresco.util.encodeHTML,p=Alfresco.util.hasEventInterest,o=Alfresco.util.siteURL;Alfresco.RulesList=function h(s){Alfresco.RulesList.superclass.constructor.call(this,"Alfresco.RulesList",s,[]);this.isReady=false;this.folderDetails=null;this.rules=null;YAHOO.Bubbling.on("ruleSelected",this.onRuleSelected,this);YAHOO.Bubbling.on("folderDetailsAvailable",this.onFolderDetailsAvailable,this);YAHOO.Bubbling.on("folderRulesetDetailsAvailable",this.onFolderRulesetDetailsAvailable,this);return this};YAHOO.extend(Alfresco.RulesList,Alfresco.component.Base,{options:{nodeRef:null,siteId:"",filter:"all",editable:false,selectDefault:false},isReady:false,folderDetails:null,rules:null,onReady:function f(){this.widgets.rulesListText=b.get(this.id+"-rulesListText");this.widgets.rulesListBarText=b.get(this.id+"-rulesListBarText");this.widgets.rulesListContainerEl=b.get(this.id+"-rulesListContainer");this.widgets.ruleTemplateEl=m.query("li",this.id+"-ruleTemplate",true);this.widgets.buttonsContainerEl=b.get(this.id+"-buttonsContainer");this.widgets.saveButton=Alfresco.util.createYUIButton(this,"save-button",this.onSaveButtonClick,{disabled:true});this.widgets.resetButton=Alfresco.util.createYUIButton(this,"reset-button",this.onResetButtonClick,{disabled:true});b.addClass(this.widgets.rulesListContainerEl,this.options.filter);this.isReady=true;this._displayDetails()},onRuleSelected:function d(t,s){var u=s[1].ruleDetails.id;if(!m.query("input[name=id][value="+u+"]",this.widgets.rulesListContainerEl,true)){Alfresco.util.setSelectedClass(this.widgets.rulesListContainerEl)}},onFolderDetailsAvailable:function e(t,s){this.folderDetails=s[1].folderDetails;this._displayDetails()},onFolderRulesetDetailsAvailable:function i(t,s){this.ruleset=s[1].folderRulesetDetails;this._displayDetails()},onDragAndDropAction:function(w,s,t){if(w==Alfresco.util.DragAndDrop.ACTION_MOVED){this.widgets.saveButton.set("disabled",false);this.widgets.resetButton.set("disabled",false);var x=m.query("li .no",this.widgets.rulesListContainerEl);for(var v=0,u=x.length;v<u;v++){x[v].innerHTML=(v+1)+""}}},onResetButtonClick:function g(t,s){document.location.reload();this.widgets.resetButton.set("disabled",true);this.widgets.saveButton.set("disabled",true)},onSaveButtonClick:function j(w,t){this.widgets.saveButton.set("disabled",true);this.widgets.resetButton.set("disabled",true);var x=[],v=m.query("li input[type=hidden][name=id]",this.widgets.rulesListContainerEl);for(var u=0,s=v.length;u<s;u++){x.push(this.options.nodeRef.storeType+"://"+this.options.nodeRef.storeId+"/"+v[u].value)}Alfresco.util.Ajax.jsonPost({url:Alfresco.constants.PROXY_URI_RELATIVE+"api/actionQueue",dataObj:{actionedUponNode:this.options.nodeRef.toString(),actionDefinitionName:"reorder-rules",parameterValues:{rules:x}},successCallback:{fn:function(y){if(y.json){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.persistRuleorder-success")});this.widgets.saveButton.set("disabled",true)}},scope:this},failureCallback:{fn:function(y){Alfresco.util.PopupManager.displayPrompt({title:Alfresco.util.message("message.failure",this.name),text:this.msg("message.persistRuleorder-failure")});this.widgets.resetButton.set("disabled",false)},scope:this}})},_displayDetails:function n(){if(this.isReady&&this.ruleset&&this.folderDetails){this._renderRules();this._renderText()}},_renderText:function c(){if(this.options.filter=="inherited"){this.widgets.rulesListText.innerHTML=this.msg("label.inheritedRules");this.widgets.rulesListBarText.innerHTML=this.msg("info.inheritedRulesRunOrder")}else{if(this.options.filter=="folder"){this.widgets.rulesListText.innerHTML=l(this.msg("label.folderRules",this.folderDetails.fileName));this.widgets.rulesListBarText.innerHTML=this.msg("info.folderRulesRunOrder")}else{if(this.options.filter=="all"){this.widgets.rulesListText.innerHTML=l(this.msg("label.allRules",this.folderDetails.fileName));if(this.ruleset.linkedFromRuleSets&&this.ruleset.linkedFromRuleSets.length>0){this.widgets.rulesListBarText.innerHTML=this.msg("info.folderLinkedFromRuleSets",this.ruleset.linkedFromRuleSets.length)}}}}},_renderRules:function q(){var x,z,s=0,y=this.ruleset;while(this.widgets.rulesListContainerEl.hasChildNodes()){this.widgets.rulesListContainerEl.removeChild(this.widgets.rulesListContainerEl.firstChild)}var w,v=y.inheritedRules?y.inheritedRules.length:0,B=(y.inheritedRules?y.inheritedRules:[]).concat(y.rules?y.rules:[]);for(var u=0,A=B.length;u<A;u++){w=(u<v);x=B[u];x.index=u;if((this.options.filter=="inherited"&&w)||(this.options.filter=="folder"&&!w)||this.options.filter=="all"){s++;z=this._createRule(x,w,s);z=this.widgets.rulesListContainerEl.appendChild(z)}if(s==1&&this.options.selectDefault){this.onRuleClick(null,{rule:x,ruleEl:z})}}if(s==0){var t=document.createElement("li");b.addClass(t,"message");t.innerHTML=this.msg("message.noRules");this.widgets.rulesListContainerEl.appendChild(t)}else{if(this.options.filter=="folder"&&this.options.editable){this.widgets.dnd=new Alfresco.util.DragAndDrop({draggables:[{container:this.widgets.rulesListContainerEl,groups:[Alfresco.util.DragAndDrop.GROUP_MOVE],callback:{fn:this.onDragAndDropAction,scope:this},cssClass:"rules-list-item"}],targets:[{container:this.widgets.rulesListContainerEl,group:Alfresco.util.DragAndDrop.GROUP_MOVE}]});b.removeClass(this.widgets.buttonsContainerEl,"hidden")}}},_createRule:function k(y,s,w){var v=this.widgets.ruleTemplateEl.cloneNode(true);Alfresco.util.generateDomId(v);b.getElementsByClassName("id","input",v)[0].value=y.id;b.getElementsByClassName("no","span",v)[0].innerHTML=w;b.getElementsByClassName("title","a",v)[0].innerHTML=l(y.title);b.getElementsByClassName("description","span",v)[0].innerHTML=l(y.description);var u=b.getElementsByClassName("active-icon","span",v)[0];if(y.disabled){u.setAttribute("title",this.msg("label.inactive"));b.addClass(u,"disabled")}else{u.setAttribute("title",this.msg("label.active"))}if(s){b.getElementsByClassName("inherited","span",v)[0].innerHTML=this.msg("label.inheritedShort");b.getElementsByClassName("inherited-from","span",v)[0].innerHTML=this.msg("label.inheritedFrom");if(y.owningNode){var t=b.getElementsByClassName("inherited-folder","a",v)[0],x=o("folder-rules?nodeRef={nodeRef}",{nodeRef:y.owningNode.nodeRef});t.href=x;t.innerHTML=l(y.owningNode.name);r.addListener(t,"click",function(A,z){window.location.href=z},x,this)}}r.addListener(v,"click",this.onRuleClick,{rule:y,ruleEl:v},this);return v},onRuleClick:function a(t,s){Alfresco.util.setSelectedClass(s.ruleEl.parentNode,s.ruleEl);YAHOO.Bubbling.fire("ruleSelected",{folderDetails:this.folderDetails,ruleDetails:s.rule});if(t){r.stopEvent(t)}}})})();