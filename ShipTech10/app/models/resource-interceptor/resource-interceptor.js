angular.module('shiptech.models').
factory('resourceInterceptor', ['$q', 'VALIDATION_MESSAGES', function($q, VALIDATION_MESSAGES) {
    //show toastr messages for requests on selected resources
    return {
        response: function(response) {
            if (response.config.url.indexOf("api/sellerPortal/supplierOffer/changePhysicalSupplier")===-1)
            	// toastr.clear();
		        $(".toast.toast-success").parent().remove();
                toastr.success(VALIDATION_MESSAGES.SUCCESS);
            return response.data;
        },
        responseError: function(response) {
            // if (response.data) {
            // 	toastr.error(response.data.ErrorCode + "<br/>" + response.data.ErrorMessage);
            // } else {
            // 	toastr.error(VALIDATION_MESSAGES.GENERAL_ERROR);
            // }
            return $q.reject(response);
        }
    };
}]);