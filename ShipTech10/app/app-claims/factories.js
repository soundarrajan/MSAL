/**
 * Claims Factory
 */
APP_CLAIMS.factory('Factory_Claims', [ '$window', '$http', '$Api_Service', function($window, $http, $Api_Service) {
    return {
        getRelatedClaims : function(data, callback) {
            $Api_Service.claim.getRelatedClaims(data, (result) => {
                callback(result);
            });
        },
        deleteClaim : function(data, callback) {
            $Api_Service.claim.deleteClaim(data, (result) => {
                callback(result);
            });
        },
    };
} ]);
