var appConfig = (function() {
    let returnVars;
    $.ajax({
        url: 'config/dev.shiptech.24software.ro.json',
        dataType: 'json',
		 method: 'GET',
		 success:function(response) {
	   returnVars = response;
        },
        async:false
    });

    return returnVars;
}());
