/**
 * Admin Factory
 */
APP_ADMIN.factory('Factory_Admin', ['$window', '$http', '$Api_Service', 'API', function($window, $http, $Api_Service, API) {
    var general_api = '//alinrauta.dev.ascensys.ro/shiptech/api-reset/index.php';
    return {
        reset_Password: function(admin_id, reset_data, callback) {
            var data = $.param({
                type: 'reset_data',
                action: 'save',
                id: admin_id,
                reset_data: reset_data
            });
            $http({
                method: 'POST',
                url: general_api,
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }).then(function successCallback(response) {
                if (response.data) {
                    callback(response.data);
                } else {
                    callback(false);
                }
            }, function errorCallback(response) {
                console.log('HTTP ERROR');
                callback(false);
            });
            return false;
        },
        getTabData: function(tabType, callback) {
            if (tabType == 'vessel_access') {
                url = API.BASE_URL_DATA_MASTERS + '/api/masters/vessels/listVesselTypeVessel'
            } else if (tabType == 'buyer_access') {
                url = API.BASE_URL_DATA_MASTERS + '/api/masters/buyer/listAdmin'
            } else {
                url = API.BASE_URL_DATA_MASTERS + '/api/masters/companies/listAdmin'
            }
            
            $http({
                method: 'POST',
                url: url,
                data: {
                    "Payload": {
                        "pagination": {}
                    }
                }
            }).then(function successCallback(response) {
                if (response.data) {
                    callback(response.data);
                } else {
                    callback(false);
                }
            }, function errorCallback(response) {
                console.log('HTTP ERROR');
                callback(false);
            });
            return false;
        },
        getUsername: function(data, callback){
            var payload = {
                "Payload" :  data
            }
            var url =  API.BASE_URL_DATA_ADMIN + "/api/admin/user/info";
            $http({
                method: 'POST',
                url: url,
                data: payload
            }).then(function successCallback(response) {
                if (response.data) {
                    callback(response.data);
                } else {
                    callback(false);
                }
            }, function errorCallback(response) {
                console.log('HTTP ERROR');
                callback(false);
            });
            return false;

        },
        getAgreementTypeIndividualList : function(data, callback){
            var payload = {"Payload":{"Order":null,"PageFilters":{"Filters":[]},"SortList":{"SortList":[]},"Filters":[],"SearchText":null,"Pagination":{"Skip":0,"Take":10000}}};
            var url =  API.BASE_URL_DATA_MASTERS + "/api/masters/agreementType/individualLists";
            $http({
                method: 'POST',
                url: url,
                data: payload
            }).then(function successCallback(response) {
                if (response.data) {
                    callback(response.data);
                } else {
                    callback(false);
                }
            }, function errorCallback(response) {
                console.log('HTTP ERROR');
                callback(false);
            });
            return false;
        }
    }
}]);
