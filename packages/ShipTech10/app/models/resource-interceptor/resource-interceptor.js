angular.module('shiptech.models').
factory('resourceInterceptor', ['$q', 'VALIDATION_MESSAGES', function($q, VALIDATION_MESSAGES) {
    //show toastr messages for requests on selected resources
    return {
        response: function(response) {
            if (response.config.url.indexOf("api/sellerPortal/supplierOffer/changePhysicalSupplier")===-1) {
                toastr.success(VALIDATION_MESSAGES.SUCCESS);
            }
            return response.data;
        },
        responseError: function(response) {
            return $q.reject(response);
        }
    };
}]);