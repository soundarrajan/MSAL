var appConfig = function () {
	var returnVars;
   $.ajax({
		url: "config/defaultConfig.json",
		dataType: "json",
		 method: "GET",   
		 success:function(response){
	   returnVars = response; 
   },
		async:false
   });
    
	return returnVars;
}();
