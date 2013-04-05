<#--
   Returns a URL to a site page given a relative URL.
   If the current page is within a Site context, that context is used for the generated link.
   The function understands that &amp; needs to be unescaped when in portlet mode.
-->
<#function siteURL relativeURL="" siteId=((page.url.templateArgs.site)!(args.site)!"")>
   <#assign portlet = context.attributes.portletHost!false>
   <#assign portlet_url = (context.attributes.portletUrl!"")>
   <#assign site_url = relativeURL>

   <#if (siteId?length > 0)>
      <#assign site_url = "site/${siteId}/${site_url}">
   </#if>

   <#if site_url?starts_with("/")><#assign site_url = site_url?substring(1)></#if>
   <#if !site_url?starts_with("page/")><#assign site_url = ("page/" + site_url)></#if>
   <#assign site_url = "/" + site_url>

   <#if portlet>
      <#assign site_url = portlet_url?replace("%24%24scriptUrl%24%24", site_url?replace("&amp;", "&")?url)>
   <#else>
      <#assign site_url = url.context + site_url>
   </#if>

   <#return site_url>
</#function>

<#--
   I18N Message string using an array of tokens as the second argument
-->
<#function msgArgs msgId msgTokens>
   <#if msgTokens??>
      <#if msgTokens?is_sequence>
         <#assign templateTokens><#list msgTokens as token>"${token?j_string}"<#if token_has_next>,</#if></#list></#assign>
         <#assign templateSource = r"${msg(msgId," + templateTokens + ")}">
         <#assign inlineTemplate = [templateSource, "msgArgsTemplate"]?interpret>
         <#assign returnValue><@inlineTemplate /></#assign>
         <#return returnValue />
      </#if>
      <#return msg(msgId, msgTokens) />
   </#if>
   <#return msg(msgId) />
</#function>

<#function uriTemplate id>
   <#local uriConfig = config.scoped["UriTemplate"]["uri-templates"]>
   <#list uriConfig.childrenMap["uri-template"] as c>
      <#if c.attributes["id"] == id><#return c.value?string></#if>
   </#list>
   <#return null>
</#function>

<#function userProfileLink userName fullName="" linkAttr="" disableLink=false>
   <#local displayLabel><#if fullName?length == 0>${userName?html}<#else>${fullName?html}</#if></#local>

   <#assign userprofilepage = uriTemplate("userprofilepage")>
   <#if disableLink || (userprofilepage!"")?length == 0 || context.attributes.portletHost!false>
      <#local span><span>${displayLabel}</span></#local>
      <#return span>
   </#if>

   <#local userid=userName>
   <#local userprofilepage = userprofilepage?replace("{", "$" + "{")?interpret/>
   <#local userprofilepage><@userprofilepage/></#local>
   <#local link><a href="${url.context + "/page" + userprofilepage}" ${linkAttr}>${displayLabel}</a></#local>
   <#return link>
</#function>

<#--
   Given a filename, returns either a filetype icon or generic icon file stem
      fileName {string} File to find icon for
      iconSize {int} Icon size: 32
      Return {string} The icon name, e.g. doc-file-32.png
-->
<#function fileIcon fileName iconSize=32>
   <#local exts =
   {
      "aep": "aep",
      "ai": "ai",
      "aiff": "aiff",
      "asf": "video",
      "asnd": "asnd",
      "asx": "video",
      "au": "audio",
      "avi": "video",
      "avx": "video",
      "bmp": "img",
      "css": "text",
      "divx": "video",
      "doc": "doc",
      "docx": "doc",
      "docm": "doc",
      "dotx": "doc",
      "dotm": "doc",
      "eml": "eml",
      "eps": "eps",
      "fla": "fla",
      "flv": "video",
      "fxp": "fxp",
      "gif": "img",
      "htm": "html",
      "html": "html",
      "indd": "indd",
      "jpeg": "img",
      "jpg": "img",
      "key": "key",
      "mkv": "video",
      "mov": "video",
      "movie": "video",
      "m4a": "audio",
      "m4b": "audio",
      "mp3": "mp3",
      "mp4": "video",
      "m4v": "video",
      "mpeg": "video",
      "mpeg2": "video",
      "mpv2": "video",
      "msg": "eml",
      "numbers": "numbers",
      "odg": "odg",
      "odp": "odp",
      "ods": "ods",
      "odt": "odt",
      "ogg": "video",
      "ogv": "video",
      "pages": "pages",
      "pdf": "pdf",
      "png": "img",
      "ppj": "ppj",
      "ppt": "ppt",
      "pptx": "ppt",
      "pptm": "ppt",
      "pps": "ppt",
      "ppsx": "ppt",
      "ppsm": "ppt",
      "pot": "ppt",
      "potx": "ppt",
      "potm": "ppt",
      "ppam": "ppt",
      "sldx": "ppt",
      "sldm": "ppt",
      "psd": "psd",
      "qt": "video",
      "rtf": "rtf",
      "snd": "audio",
      "spx": "audio",
      "svg": "img",
      "swf": "swf",
      "tiff": "img",
      "txt": "text",
      "wav": "audio",
      "webm": "video",
      "wmv": "video",
      "xls": "xls",
      "xlsx": "xls",
      "xltx": "xls",
      "xlsm": "xls",
      "xltm": "xls",
      "xlam": "xls",
      "xlsb": "xls",
      "xml": "xml",
      "xvid": "video",
      "zip": "zip"
   }>
   <#local extn=fileName?substring(fileName?last_index_of(".") + 1)?lower_case>
   <#local prefix=exts[extn]!"generic">
   <#return prefix + "-file-" + iconSize + ".png">
</#function>

<#--
   Renders a path as generated by AlfrescoUtil.getPaths()
-->
<#macro renderPaths paths=[]>
   <#list paths as path>
      <#if path_index != 0>
         <span class="separator"> &gt; </span>
      </#if>
      <span class="${path.cssClass?html}">
         <a href="${siteURL(path.href)}">${path.label?html}</a>
      </span>
   </#list>
</#macro>
<#--
   Renders a path as generated by AlfrescoUtil.getPaths()
-->
<#macro renderPrefixedPaths paths=[] prefix="">
   <#list paths as path>
      <#if path_index != 0>
      <span class="separator"> &gt; </span>
      </#if>
   <span class="${path.cssClass?html}">
         <a target="_blank" href="${prefix}${path.href}">${path.label?html}</a>
      </span>
   </#list>
</#macro>

<#--
   Renders a path as generated by AlfrescoUtil.getPaths()
-->
<#macro renderAbsolutePaths paths=[] absolute=false>
   <#list paths as path>
      <#if path_index != 0>
         <span class="separator"> &gt; </span>
      </#if>
      <#assign pathDisplayHref=siteURL(path.href) />
      <#if absolute>
         <#assign pathDisplayHref=absurl(siteURL(path.href)) />
      </#if>
      <span class="${path.cssClass?html}">
         <a href="${pathDisplayHref}">${path.label?html}</a>
      </span>
   </#list>
</#macro>