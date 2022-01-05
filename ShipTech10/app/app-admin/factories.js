/**
 * Admin Factory
 */
APP_ADMIN.factory('Factory_Admin', [ '$window', '$http', '$Api_Service', 'API', function($window, $http, $Api_Service, API) {
    let general_api = '//alinrauta.dev.ascensys.ro/shiptech/api-reset/index.php';
    return {
        reset_Password: function(admin_id, reset_data, callback) {
            let data = $.param({
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
            }).then((response) => {
                if (response.data) {
                    callback(response.data);
                } else {
                    callback(false);
                }
            }, (response) => {
                console.log('HTTP ERROR');
                callback(false);
            });
            return false;
        },
        getTabData: function(tabType, userId, callback) {
            if (tabType == 'vessel_access') {
                var url = `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/listVesselTypeVessel`;
            } else if (tabType == 'buyer_access') {
                var url = `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/listAdmin`;
            } else {
                var url = `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/listAdmin`;
            }

            $http({
                method: 'POST',
                url: url,
                data: {
                    Payload: {
                        Filters: [
                            {
                                ColumnName: 'UserId',
                                Value: userId
                            }
                        ],
                        pagination: {}
                    }
                }
            }).then((response) => {
                if (response.data) {
                    callback(response.data);
                } else {
                    callback(false);
                }
            }, (response) => {
                console.log('HTTP ERROR');
                callback(false);
            });
            return false;
        },
        getUsername: function(data, callback) {
            let payload = {
                Payload :  data
            };
            let url = `${API.BASE_URL_DATA_ADMIN }/api/admin/user/info`;
            $http({
                method: 'POST',
                url: url,
                data: payload
            }).then((response) => {
                if (response.data) {
                    callback(response.data);
                } else {
                    callback(false);
                }
            }, (response) => {
                console.log('HTTP ERROR');
                callback(false);
            });
            return false;
        },
        getAgreementTypeIndividualList : function(data, callback) {
            let payload = { Payload:{ Order:null, PageFilters:{ Filters:[] }, SortList:{ SortList:[] }, Filters:[], SearchText:null, Pagination:{ Skip:0, Take:10000 } } };
            let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/agreementType/individualLists`;
            $http({
                method: 'POST',
                url: url,
                data: payload
            }).then((response) => {
                if (response.data) {
                    callback(response.data);
                } else {
                    callback(false);
                }
            }, (response) => {
                console.log('HTTP ERROR');
                callback(false);
            });
            return false;
        }
    };
} ]);
