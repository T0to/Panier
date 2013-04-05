<#import "/org/alfresco/webscripts.lib.html.ftl" as wsLib/>
<#import "index-check.lib.html.ftl" as icLib/>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <@wsLib.head>Alfresco DM Index Check - check txn (running on: ${ipAddress})</@wsLib.head>
  <body>
    <div>
    <@wsLib.header>Alfresco DM Index/Txn Consistency Check - check txn (running on: <b>${ipAddress}</b>)</@wsLib.header>
    <br/>
Alfresco ADM Index Check - transaction (txnId=${indexTxnInfo.lastProcessedTxn.id?c}) is <#if indexTxnInfo.missingCount gt 0>OUT-OF-SYNC<#else>IN-SYNC</#if> with local indexes (${ipAddress})
    <p/>
    <@icLib.reportDetails></@icLib.reportDetails>
    <p/>
    <a href="${url.serviceContext}/enterprise/admin/indexcheck">Back</a>
  </body>
</html>