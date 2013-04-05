function main(){
    if (!json.isNull("nodeRef"))
    {
       var values = [];
       var jsonValues = json.get("nodeRef");

       transformTest.test(jsonValues);
    }
	
}
main();