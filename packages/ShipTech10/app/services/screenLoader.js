angular.module('shiptech').service('screenLoader', [
    function(){

        function showLoader() {
         
            $('.screen-loader').show();
        }

        function hideLoader(){
            $('.screen-loader').hide();
           
        }
    
        return {
            showLoader: showLoader,
            hideLoader: hideLoader,
        }

    }
]);
