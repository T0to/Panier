<#-- {
	"nodeRefs":[<#list selection as item>${item.nodeRef}<#if item_has_next>,</#if></#list>]
} -->

<#import "../slingshot/documentlibrary/item.lib.ftl" as itemLib />
<#escape x as jsonUtils.encodeJSONString(x)>
{
   "items":
   [
      <#list selection as item>
      {
         <@itemLib.itemJSON item=item />
      }<#if item_has_next>,</#if>
      </#list>
   ]
}
</#escape>