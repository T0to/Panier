<#assign idJS=args.htmlid?js_string>
<script type="text/javascript">//<![CDATA[
(function()
{
   new Alfresco.dashlet.MyDocsEditing("${idJS}").setMessages(${messages});
   new Alfresco.widget.DashletResizer("${idJS}", "${instance.object.id}");
   new Alfresco.widget.DashletTitleBarActions("${idJS}").setOptions(
   {
      actions:
      [
         {
            cssClass: "help",
            bubbleOnClick:
            {
               message: "${msg("dashlet.help")?js_string}"
            },
            tooltip: "${msg("dashlet.help.tooltip")?js_string}"
         }
      ]
   });
})();
//]]></script>

<#assign el=args.htmlid?html>
<div class="dashlet">
   <div class="title">${msg("header")}</div>
   <div id="${el}-list" class="body scrollableList" <#if args.height??>style="height: ${args.height}px;"</#if>>
      <div id="${el}-message" class="my-docs-editing-message hidden"></div>
      <div id="${el}-my-docs" class="my-docs-editing">
         <div class="hdr">
            <h3>${msg('text.documents')}</h3>
         </div>
         <div id="${el}-documents" class="hidden"></div>
         <div id="${el}-documents-wait" class="my-docs-editing-wait"></div>
         <div class="hdr">
            <h3>${msg('text.blogposts')}</h3>
         </div>
         <div id="${el}-blogposts" class="hidden"></div>
         <div class="hdr">
            <h3>${msg('text.wikipages')}</h3>
         </div>
         <div id="${el}-wikipages" class="hidden"></div>
         <div class="hdr">
            <h3>${msg('text.forumposts')}</h3>
         </div>
         <div id="${el}-forumposts" class="hidden"></div>
         <div id="${el}-content-wait" class="my-docs-editing-wait"></div>
      </div>
   </div>
</div>
<div class="hidden">
   <#-- HTML template for a document item -->
   <div id="${el}-document-template" class="detail-list-item">
      <div class="icon">
         <img title="{name}" width="32" src="${url.context}/components/images/filetypes/{fileExt}-file-32.png" {onerror} />
      </div>
      <div class="details">
         <h4><a href="${url.context}/page/site/{site}/documentlibrary?file={filename}&amp;filter=editingMe" class="theme-color-1">{name}</a></h4>
         <div>{editingMessage}</div>
      </div>
   </div>
   
   <#-- HTML template for a blog, wiki or forum item -->
   <div id="${el}-item-template" class="detail-list-item">
      <div class="icon">
         <img src="${url.context}/res/{icon}" alt="{name}" />
      </div>
      <div class="details">
         <h4><a href="{browseURL}" class="theme-color-1">{name}</a></h4>
         <div>{editingMessage}</div>
      </div>
   </div>
</div>