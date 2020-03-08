var appConfig = (function() {
    let returnVars;
    $.ajax({
        url: 'config/config.json',
        dataType: 'json',
		 method: 'GET',
		 success:function(response) {
	   returnVars = response;
        },
        async:false
    });

    return returnVars;
}());
