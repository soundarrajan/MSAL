angular.module('shiptech.models').factory('filterConfigurationModel', ['filterConfigurationResource' ,
    function(filterConfigurationResource) {

        function getDefaultFiltersConfiguration(route) {
            /*
            if(angular.module("shiptech").value("cachedFilterConfigurations[" + route + "]")) {
                return new Promise(function(resolve, reject) {
                    resolve(angular.module("shiptech").value("cachedFilterConfigurations[" + route + "]"));
                })
            };
            */
            var verb = "get";
            var typeForCall = "filterconfigurations";
            var payload = {
                "Payload": route
            }
            console.log('filterconfigurations');
            return filterConfigurationResource.getDefaultFiltersConfiguration({
                verb: verb,
                type: typeForCall,
            }, payload).$promise.
            then(function(data) {
                // angular.module("shiptech").value("cachedFilterConfigurations[" + route + "]", data);
                return data;
            });
        }

        function getFiltersConfigurations(route) {
            var verb = "list";
            var typeForCall = "filterconfigurations";
            var payload = {
                "Payload": route
            }
            return filterConfigurationResource.getFiltersConfigurations({
                verb: verb,
                type: typeForCall,
            }, payload).$promise.
            then(function(data) {
                return data;
            });
        }

        function saveConfiguration(data){
            var verb = "save";
            var typeForCall = "filterconfigurations";
            var payload = {
                "Payload": data
            }
            return filterConfigurationResource.saveConfiguration({
                verb: verb,
                type: typeForCall,
            }, payload).$promise.
            then(function(data) {
                return data;
            });
        }

        function deleteConfiguration(data){
            var verb = "delete";
            var typeForCall = "filterconfigurations";
            var payload = {
                "Payload": data
            }
            return filterConfigurationResource.deleteConfiguration({
                verb: verb,
                type: typeForCall,
            }, payload).$promise.
            then(function(data) {
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
