<import resource="classpath:alfresco/site-webscripts/org/alfresco/callutils.js">

function main()
{
   var wikipage = args.wikipage;
   if (wikipage)
   {
      var wikiData = doGetCall("/slingshot/wiki/page/" + page.url.templateArgs.site + "/" + encodeURIComponent(wikipage) + "?minWikiData=true");
      var allowUnfilteredHTML = new XML(config.script).allowUnfilteredHTML;
      model.wikipage = allowUnfilteredHTML ? wikiData.pagetext : stringUtils.stripUnsafeHTML(wikiData.pagetext);
      model.pageList = wikiData.pageList;
      model.wikiLink = String(wikipage);
      model.pageTitle = String(wikipage).replace(/_/g, " ");
   }
   
   // Call the repository to see if the user is site manager or not
   var userIsSiteManager = false,
       json = remote.call("/api/sites/" + page.url.templateArgs.site + "/memberships/" + encodeURIComponent(user.name));
   
   if (json.status == 200)
   {
      var obj = eval('(' + json + ')');
      if (obj)
      {
         userIsSiteManager = (obj.role == "SiteManager");
      }
   }
   model.userIsSiteManager = userIsSiteManager;
}
main();