/**
 * Claims Factory
 */
APP_CLAIMS.factory('Factory_Claims', ['$window', '$http', '$Api_Service', function($window, $http, $Api_Service) {
    var general_api = '//irinelnicoara.dev.ascensys.ro/shiptech/index.php';
    return {
        getRelatedClaims : function(data, callback) {
            $Api_Service.claim.getRelatedClaims(data, function(result) {
                callback(result);
            });
        }, 
        deleteClaim : function(data, callback) {
            $Api_Service.claim.deleteClaim(data, function(result) {
                callback(result);
            });
        }, 
    };
}]);