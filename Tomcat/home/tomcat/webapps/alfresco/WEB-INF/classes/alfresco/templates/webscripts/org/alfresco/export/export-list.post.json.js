function main(){
    if (!json.isNull("nodeRefs"))
    {
       var values = [];
       var jsonValues = json.get("nodeRefs");
       // Convert from JSONArray to JavaScript array
       for (var i = 0, j = jsonValues.length(); i < j; i++)
       {
          values.push(jsonValues.get(i));
       }
       exportService.removeDocumentsFromSelection(values, person.nodeRef);
    }
	
}
main();