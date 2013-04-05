(function(){var e=YAHOO.util.Dom,n=YAHOO.util.Event;var c=Alfresco.util.siteURL;Alfresco.RuleEdit=function d(p){Alfresco.RuleEdit.superclass.constructor.call(this,"Alfresco.RuleEdit",p,[]);return this};YAHOO.extend(Alfresco.RuleEdit,Alfresco.component.Base);YAHOO.lang.augmentProto(Alfresco.RuleEdit,Alfresco.RuleConfigUtil);YAHOO.lang.augmentObject(Alfresco.RuleEdit.prototype,{options:{nodeRef:null,siteId:"",constraints:{},rule:null,ruleTemplate:{title:"",description:"",ruleType:["inbound"],applyToChildren:false,executeAsynchronously:false,disabled:false,action:{actionDefinitionName:"composite-action",actions:[{actionDefinitionName:"",parameterValues:{}}],conditions:[{conditionDefinitionName:"",parameterValues:{}}],compensatingAction:{actionDefinitionName:"script",parameterValues:{"script-ref":""}}}}},onReady:function j(){this.loadRuleConfigs();var p=e.get(this.id+"-executeAsynchronously");n.addListener(p,"click",function(s,r){this._toggleScriptRef(!r.checked)},p,this);this.widgets.createButton=Alfresco.util.createYUIButton(this,"create-button",function(){this.createAnotherRule=false},{type:"submit"},this.id+"-create-button");this.widgets.createAnotherButton=Alfresco.util.createYUIButton(this,"createAnother-button",function(){this.createAnotherRule=true},{type:"submit"},this.id+"-createAnother-button");this.widgets.saveButton=Alfresco.util.createYUIButton(this,"save-button",function(){this.createAnotherRule=false},{type:"submit"},this.id+"-save-button");this.widgets.cancelButton=Alfresco.util.createYUIButton(this,"cancel-button",this.onCancelButtonClick);var q=new Alfresco.forms.Form(this.id+"-rule-form");this.widgets.form=q;this.widgets.formEl=e.get(this.id+"-rule-form");q.setSubmitElements([this.widgets.createButton,this.widgets.createAnotherButton,this.widgets.saveButton]);q.setShowSubmitStateDynamically(true);q.setSubmitAsJSON(true);q.doBeforeFormSubmit={fn:function(){var u=e.get(this.id+"-id").value,t=Alfresco.constants.PROXY_URI+"api/node/"+this.options.nodeRef.uri+"/ruleset/rules",s,r;if(u.length>0){r=this.msg("message.updating");this.widgets.formEl.attributes.action.nodeValue=t+"/"+u;this.widgets.form.setAjaxSubmitMethod(Alfresco.util.Ajax.PUT);s={fn:this.onRuleUpdated,scope:this}}else{r=this.msg("message.creating");this.widgets.formEl.attributes.action.nodeValue=t;this.widgets.form.setAjaxSubmitMethod(Alfresco.util.Ajax.POST);s={fn:this.onRuleCreated,scope:this}}this.widgets.form.setAJAXSubmit(true,{successCallback:s,failureCallback:{fn:this.onPersistRuleFailed,scope:this}});this._toggleButtons(true);this.widgets.feedbackMessage=Alfresco.util.PopupManager.displayMessage({text:r,spanClass:"wait",displayTime:0})},obj:null,scope:this};q.doBeforeAjaxRequest={fn:function(t){var w=t.dataObj;w.disabled=e.get(this.id+"-disabled").checked;w.applyToChildren=e.get(this.id+"-applyToChildren").checked;w.executeAsynchronously=e.get(this.id+"-executeAsynchronously").checked;w.ruleType=[];var u=this.ruleConfigs[this.id+"-ruleConfigType"].getRuleConfigs();for(var s=0,r=u.length;s<r;s++){w.ruleType.push(u[s].name)}w.action.conditions=this.ruleConfigs[this.id+"-ruleConfigIfCondition"].getRuleConfigs();var v=this.ruleConfigs[this.id+"-ruleConfigUnlessCondition"].getRuleConfigs();for(s=0,r=v.length;s<r;s++){v[s].invertCondition=true;w.action.conditions.push(v[s])}if(w.action.conditions.length==0){w.action.conditions.push({conditionDefinitionName:"no-condition"})}w.action.actions=this.ruleConfigs[this.id+"-ruleConfigAction"].getRuleConfigs();if(!w.action.compensatingAction.parameterValues||w.action.compensatingAction.parameterValues["script-ref"].length==0){delete w.action.compensatingAction}else{if(!w.action.compensatingAction.id){delete w.action.compensatingAction.id}}return true},obj:null,scope:this};q.addValidation(this.id+"-title",Alfresco.forms.validation.mandatory,null,"keyup")},onRuleConfigsLoaded:function f(){e.addClass(this.id+"-configsMessage","hidden");e.removeClass(this.id+"-configsContainer","hidden")},onRuleConfigsReady:function a(){if(this.options.rule){this.displayRule(this.options.rule)}else{this.displayRule(this.options.ruleTemplate)}this.widgets.form.init()},displayRule:function h(s){e.get(this.id+"-id").value=s.id?s.id:"";if(s.id){e.removeClass(this.id+"-body","create-mode");e.addClass(this.id+"-body","edit-mode")}else{e.addClass(this.id+"-body","create-mode");e.removeClass(this.id+"-body","edit-mode")}var q=e.get(this.id+"-title");q.value=s.title;q.focus();e.get(this.id+"-description").value=s.description;this.displayRuleConfigs(s,Alfresco.RuleConfig.MODE_EDIT,this.widgets.form);e.get(this.id+"-disabled").checked=s.disabled;e.get(this.id+"-applyToChildren").checked=s.applyToChildren;e.get(this.id+"-executeAsynchronously").checked=s.executeAsynchronously;var p=Alfresco.util.findValueByDotNotation(s,"action.compensatingAction.parameterValues.script-ref",null);if(p){Alfresco.util.setSelectedIndex(e.get(this.id+"-scriptRef"),p)}var r=Alfresco.util.findValueByDotNotation(s,"action.compensatingAction.id",null);e.get(this.id+"-compensatingActionId").value=r?r:"";this._toggleScriptRef(!s.executeAsynchronously)},onCancelButtonClick:function l(q,p){this._toggleButtons(false);this._navigateToFoldersPage()},onRuleCreated:function g(p){this.widgets.feedbackMessage.hide();if(this.createAnotherRule){Alfresco.util.PopupManager.displayMessage({text:this.msg("message.createAnotherRule")});this.displayRule(this.options.ruleTemplate);this.widgets.cancelButton.set("disabled",false)}else{this._navigateToFoldersPage()}},onRuleUpdated:function k(p){this.widgets.feedbackMessage.hide();this._navigateToFoldersPage()},onPersistRuleFailed:function m(p){this._toggleButtons(false);this.widgets.feedbackMessage.hide();var r=this.msg("message.failure"),q=(p.json&&p.json.message)?p.json.message:this.msg("message.persist-failure");Alfresco.util.PopupManager.displayPrompt({title:r,text:q})},_navigateToFoldersPage:function b(){window.location.href=c("folder-rules?nodeRef={nodeRef}",{nodeRef:this.options.nodeRef.toString()})},_toggleButtons:function i(p){this.widgets.cancelButton.set("disabled",p);this.widgets.saveButton.set("disabled",p);this.widgets.createButton.set("disabled",p);this.widgets.createAnotherButton.set("disabled",p)},_toggleScriptRef:function o(q){var p=e.get(this.id+"-scriptRef");if(q){p.setAttribute("disabled",true)}else{p.removeAttribute("disabled")}}},true)})();