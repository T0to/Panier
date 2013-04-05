function main(){
	//model.userName = person.properties["cm:userName"];
    if (!json.isNull("nodeRefs"))
    {
       try{
       		var values = [];
       		var jsonValues = json.get("nodeRefs");
       		// Convert from JSONArray to JavaScript array
       		for (var i = 0, j = jsonValues.length(); i < j; i++)
       		{
       			values.push(jsonValues.get(i));
       		}
       		exportService.addDocumentsToSelection(values, person.nodeRef);
       		model.success = true;
       }catch(e){
    	   status.setCode(status.STATUS_INTERNAL_SERVER_ERROR, "Unknow error, contact your administrator");
 	       return;
       }
    }else{
    	status.setCode(status.STATUS_BAD_REQUEST, "Missings nodeRefs parameter");
	    return;
    }
	
}

main();