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

            /**
             * 
             * @param value
             * @param precision
             * @returns a number value
             * @description Returns nearest fixed float (NFF) of precision + 1
             * @see https://gauravkk22.medium.com/why-0-1-0-2-0-3-is-false-in-js-mystery-unsolved-with-solution-4f7db2755f18
             * @see https://stackoverflow.com/a/11832950
             */
            function getFixedFloat(value, precision) {
              value = Math.round((value) * Math.pow(10, precision + 1)) / Math.pow(10, precision + 1);
              return value;
            }

            return {
                tenantSettings: $tenantSettings,
                getDateFormat: getDateFormat,
                getDateFormatForPicker: getDateFormatForPicker,
                formatDate: formatDate,
                getAgreementType: getAgreementType,
                getUom: getUom,
                getFixedFloat: getFixedFloat,
                scheduleDashboardConfiguration:$scheduleDashboardConfiguration,
                procurementSettings:$procurementSettings,
                emailSettings:$emailSettings
            };
        } ]);
