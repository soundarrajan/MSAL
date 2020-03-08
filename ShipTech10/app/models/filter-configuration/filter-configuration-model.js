angular.module('shiptech.models').factory('filterConfigurationModel', [ 'filterConfigurationResource',
    function(filterConfigurationResource) {
        function getDefaultFiltersConfiguration(route) {

            /*
            if(angular.module("shiptech").value("cachedFilterConfigurations[" + route + "]")) {
                return new Promise(function(resolve, reject) {
                    resolve(angular.module("shiptech").value("cachedFilterConfigurations[" + route + "]"));
                })
            };
            */
            let verb = 'get';
            let typeForCall = 'filterconfigurations';
            let payload = {
                Payload: route
            };
            console.log('filterconfigurations');
            return filterConfigurationResource.getDefaultFiltersConfiguration({
                verb: verb,
                type: typeForCall,
            }, payload).$promise
                .then((data) => {
                // angular.module("shiptech").value("cachedFilterConfigurations[" + route + "]", data);
                    return data;
                });
        }

        function getFiltersConfigurations(route) {
            let verb = 'list';
            let typeForCall = 'filterconfigurations';
            let payload = {
                Payload: route
            };
            return filterConfigurationResource.getFiltersConfigurations({
                verb: verb,
                type: typeForCall,
            }, payload).$promise
                .then((data) => {
                    return data;
                });
        }

        function saveConfiguration(data) {
            let verb = 'save';
            let typeForCall = 'filterconfigurations';
            let payload = {
                Payload: data
            };
            return filterConfigurationResource.saveConfiguration({
                verb: verb,
                type: typeForCall,
            }, payload).$promise
                .then((data) => {
                    return data;
                });
        }

        function deleteConfiguration(data) {
            let verb = 'delete';
            let typeForCall = 'filterconfigurations';
            let payload = {
                Payload: data
            };
            return filterConfigurationResource.deleteConfiguration({
                verb: verb,
                type: typeForCall,
            }, payload).$promise
                .then((data) => {
                    return data;
                });
        }

        // Return public model API.
        return {
            getDefaultFiltersConfiguration: getDefaultFiltersConfiguration,
            getFiltersConfigurations: getFiltersConfigurations,
            saveConfiguration: saveConfiguration,
            deleteConfiguration: deleteConfiguration
        };
    }
]);
