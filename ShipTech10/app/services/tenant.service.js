angular.module('shiptech')
    .service('tenantService', [ 'tenantModel', 'dateService',
        function(tenantModel, dateService) {
            let $tenantSettings,
                tenantSettings;
            let $procurementSettings,
                procurementSettings;
            let $emailSettings,
                emailSettings;
            let $scheduleDashboardConfiguration,
                scheduleDashboardConfiguration;

            $tenantSettings = tenantModel.getGlobalConfiguration();
            $procurementSettings = tenantModel.get();
            $emailSettings = tenantModel.getEmailConfiguration();
            $scheduleDashboardConfiguration = tenantModel.getScheduleDashboardConfiguration();
            $tenantSettings.then((data) => {
                tenantSettings = data.payload;
            });
            $procurementSettings.then((data) => {
                procurementSettings = data.payload;
            });
            $emailSettings.then((data) => {
                emailSettings = data.payload;
            });
            $scheduleDashboardConfiguration.then((data) => {
                scheduleDashboardConfiguration = data.payload;
            });
            function getDateFormatForPicker() {
                return dateService.getDateFormatForPicker(tenantSettings);
            }

            function getDateFormat() {
                return dateService.getDateFormat(tenantSettings);
            }


            function formatDate(date) {
                return dateService.formatDate(date, tenantSettings);
            }

            function getAgreementType() {
                if (!tenantSettings || !tenantSettings.tenantFormats) {
                    return null;
                }
                return tenantSettings.tenantFormats.agreementType;
            }
            function getUom() {
                if (!tenantSettings || !tenantSettings.tenantFormats) {
                    return null;
                }
                return tenantSettings.tenantFormats.uom;
            }

            return {
                tenantSettings: $tenantSettings,
                getDateFormat: getDateFormat,
                getDateFormatForPicker: getDateFormatForPicker,
                formatDate: formatDate,
                getAgreementType: getAgreementType,
                getUom: getUom,
                scheduleDashboardConfiguration:$scheduleDashboardConfiguration,
                procurementSettings:$procurementSettings,
                emailSettings:$emailSettings
            };
        } ]);
