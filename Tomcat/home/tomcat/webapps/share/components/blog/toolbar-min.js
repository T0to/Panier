(function(){var e=YAHOO.util.Dom,k=YAHOO.util.Event,a=YAHOO.util.Element;Alfresco.BlogToolbar=function(m){this.name="Alfresco.BlogToolbar";this.id=m;this.widgets={};this.modules={};this.options={};Alfresco.util.YUILoaderHelper.require(["button","container","connection"],this.onComponentsLoaded,this);YAHOO.Bubbling.on("deactivateAllControls",this.onDeactivateAllControls,this);return this};Alfresco.BlogToolbar.prototype={widgets:null,modules:null,options:{siteId:null,containerId:null,allowCreate:null,allowConfigure:null},setOptions:function b(m){this.options=YAHOO.lang.merge(this.options,m);return this},setMessages:function f(m){Alfresco.util.addMessages(m,this.name);return this},onComponentsLoaded:function l(){k.onContentReady(this.id,this.onReady,this,true)},onReady:function g(){this.widgets.createButton=Alfresco.util.createYUIButton(this,"create-button",this.onNewBlogClick,{disabled:!this.options.allowCreate});this.widgets.configureButton=Alfresco.util.createYUIButton(this,"configure-button",this.onConfigureBlogClick,{disabled:!this.options.allowConfigure});this.widgets.rssFeedButton=Alfresco.util.createYUIButton(this,"rssFeed-button",null,{type:"link"});this._generateRSSFeedUrl()},onNewBlogClick:function i(m){window.location.href=Alfresco.constants.URL_PAGECONTEXT+"site/"+this.options.siteId+"/blog-postedit"},onConfigureBlogClick:function d(m,n){if(!this.modules.configblog){this.modules.configblog=new Alfresco.module.ConfigBlog(this.id+"-configblog")}this.modules.configblog.setOptions({siteId:this.options.siteId,containerId:this.options.containerId});this.modules.configblog.showDialog();k.preventDefault(m)},_generateRSSFeedUrl:function h(){var m=YAHOO.lang.substitute(Alfresco.constants.URL_FEEDSERVICECONTEXT+"components/blog/rss?site={site}",{site:this.options.siteId});this.widgets.rssFeedButton.set("href",m)},onConfigureBlog:function j(m,n){if(!this.modules.configblog){this.modules.configblog=new Alfresco.module.ConfigBlog(this.id+"-configblog")}this.modules.configblog.setOptions({siteId:this.options.siteId,containerId:this.options.containerId});this.modules.configblog.showDialog();k.preventDefault(m)},onDeactivateAllControls:function c(o,n){var m,p,q=Alfresco.util.disableYUIButton;for(m in this.widgets){if(this.widgets.hasOwnProperty(m)){q(this.widgets[m])}}}}})();