(function(){var e=YAHOO.util.Dom,b=YAHOO.util.Event;Alfresco.dashlet.RssFeed=function a(f){Alfresco.dashlet.RssFeed.superclass.constructor.call(this,"Alfresco.dashlet.RssFeed",f);this.configDialog=null;return this};YAHOO.extend(Alfresco.dashlet.RssFeed,Alfresco.component.Base,{options:{componentId:"",feedURL:"",limit:"all",target:"_self"},titleElement:null,feedElement:null,onReady:function d(){var i=this;this.titleElement=e.get(this.id+this.options.titleElSuffix);this.feedElement=e.get(this.id+this.options.targetElSuffix);var g=this.options.feedURL;var h="http://";var f=this.options.feedURL.indexOf("://");if(f!=-1){h=this.options.feedURL.substring(0,f);g=this.options.feedURL.substring(f+3)}Alfresco.util.Ajax.request({url:Alfresco.constants.URL_CONTEXT+"service/components/dashlets/async-rssfeed/protocol/"+h+"/limit/"+this.options.limit+"/target/"+this.options.target+"?feed-url="+encodeURIComponent(g)+"",method:Alfresco.util.Ajax.GET,requestContentType:Alfresco.util.Ajax.JSON,successCallback:{fn:function(j){var k=Alfresco.util.parseJSON(j.serverResponse.responseText);this.feedElement.innerHTML=k.html;this.titleElement.innerHTML=k.title},scope:i},failureCallback:{fn:function(j){this.titleElement.innerHTML=this.msg("title.error.unavailable");this.feedElement.innerHTML=this.msg("label.noItems")},scope:i}})},onConfigFeedClick:function c(i){b.stopEvent(i);var g=Alfresco.constants.URL_SERVICECONTEXT+"modules/feed/config/"+encodeURIComponent(this.options.componentId);if(!this.configDialog){this.configDialog=new Alfresco.module.SimpleDialog(this.id+"-configDialog").setOptions({width:"50em",templateUrl:Alfresco.constants.URL_SERVICECONTEXT+"modules/feed/config",onSuccess:{fn:function h(j){var k=j.json;this.options.feedURL=(k&&k.feedURL)?k.feedURL:this.options.feedURL;this.options.limit=k.limit;e.get(this.id+"-title").innerHTML=k?k.title:"";e.get(this.id+"-scrollableList").innerHTML=(k&&k.content!=="")?k.content:("<h3>"+this.msg("label.noItems")+"</h3>")},scope:this},doSetupFormsValidation:{fn:function f(p){p.addValidation(this.configDialog.id+"-url",Alfresco.forms.validation.mandatory,null,"keyup");p.addValidation(this.configDialog.id+"-url",Alfresco.forms.validation.url,null,"keyup");p.setShowSubmitStateDynamically(true,false);e.get(this.configDialog.id+"-url").value=this.options.feedURL;var k=e.get(this.configDialog.id+"-limit"),m=k.options,o,n,l;for(n=0,l=m.length;n<l;n++){o=m[n];if(o.value===this.options.limit){o.selected=true;break}}},scope:this}})}this.configDialog.setOptions({actionUrl:g}).show()}})})();