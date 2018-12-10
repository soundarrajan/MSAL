/**
 * Labs Factory
 */
APP_LABS.factory('Factory_Labs', ['$window', '$http', '$Api_Service', function ($window, $http, $Api_Service) {
    var general_api = '//irinelnicoara.dev.ascensys.ro/shiptech/index.php';
    return {
        deleteLab : function(data, callback) {
            $Api_Service.labs.deleteLab(data, function(result) {
                callback(result);
            });
        }, 
    };
}]);