angular.module('shiptech')
    .service('tenantSupplierPortalService', [ 'tenantModel', 'dateService', '$stateParams',
        function(tenantModel, dateService, $stateParams) {
            let $tenantSettings,
                tenantSettings;

            if ($stateParams.token) {
	                $tenantSettings = tenantModel.getGlobalConfigurationForSupplierPortal($stateParams.token);
            } else {
	                $tenantSettings = tenantModel.getGlobalConfiguration();
            }

            tenantSettings = $tenantSettings.payload;


            function getDateFormatForPicker() {
                return dateService.getDateFormatForPicker(tenantSettings);
            }


            function getDateFormat() {
                return dateService.getDateFormat(tenantSettings);
            }


            function formatDate(date) {
                return dateService.formatDate(date, tenantSettings);
            }


            return {
                tenantSettings: $tenantSettings,
                getDateFormat: getDateFormat,
                getDateFormatForPicker: getDateFormatForPicker,
                formatDate: formatDate
            };
        } ]);
