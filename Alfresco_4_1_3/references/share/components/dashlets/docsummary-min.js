(function(){var g=YAHOO.util.Dom,i=YAHOO.util.Event,a=YAHOO.util.Selector;var j="org.alfresco.share.docsummary.dashlet";PREFERENCES_DOCSUMMARY_DASHLET_FILTER=j+".filter",PREFERENCES_DOCSUMMARY_DASHLET_VIEW=j+".simpleView";Alfresco.dashlet.DocSummary=function h(k){return Alfresco.dashlet.DocSummary.superclass.constructor.call(this,k)};YAHOO.extend(Alfresco.dashlet.DocSummary,Alfresco.component.SimpleDocList,{onReady:function d(){this.widgets.filter=Alfresco.util.createYUIButton(this,"filters",this.onFilterChange,{type:"menu",menu:"filters-menu",lazyloadmenu:false});var k=this.options.filter;k=Alfresco.util.arrayContains(this.options.validFilters,k)?k:this.options.validFilters[0];this.widgets.filter.set("label",this.msg("filter."+k));this.widgets.filter.value=k;this.widgets.simpleDetailed=new YAHOO.widget.ButtonGroup(this.id+"-simpleDetailed");if(this.widgets.simpleDetailed!==null){this.widgets.simpleDetailed.check(this.options.simpleView?0:1);this.widgets.simpleDetailed.on("checkedButtonChange",this.onSimpleDetailed,this.widgets.simpleDetailed,this)}g.removeClass(a.query(".toolbar div",this.id,true),"hidden");Alfresco.dashlet.DocSummary.superclass.onReady.apply(this,arguments)},getParameters:function f(){return"filter="+this.widgets.filter.value},getWebscriptUrl:function e(){return Alfresco.constants.PROXY_URI+"slingshot/doclib/doclist/documents/site/"+Alfresco.constants.SITE+"/documentLibrary?max=50"},onFilterChange:function c(l,k){var m=k[1];if(m){this.widgets.filter.set("label",m.cfg.getProperty("text"));this.widgets.filter.value=m.value;this.services.preferences.set(PREFERENCES_DOCSUMMARY_DASHLET_FILTER,this.widgets.filter.value);this.reloadDataTable()}},onSimpleDetailed:function b(k,l){this.options.simpleView=k.newValue.index===0;this.services.preferences.set(PREFERENCES_DOCSUMMARY_DASHLET_VIEW,this.options.simpleView);if(k){i.preventDefault(k)}this.reloadDataTable()}})})();