/**
 * General Components Factory
 */

APP_GENERAL_COMPONENTS.factory('Factory_General_Components', ['$http', '$Api_Service', 'API', function($http, $Api_Service, API) {

    //var general_api = 'api'; // not used anymore

    var table_config = '';

    return {
        /**
         * not used anymore
        list_table: function (master_id) {
            return general_api + master_id;
        },
        */

        get_table_config: function(app_id, config_id, callback) {

            console.log(app_id);

            $http({
                method: 'POST',
                url: 'http://shiptech.dev.ascensys.ro/clc2/master_config.php', // CLC_table_config
                data: $.param({
                    app_id: app_id,
                    config_id: config_id
                }),
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

        },
        entity_export: function(param, callback) {
            $Api_Service.entity.export(param, function(result) {
                callback(result);
            });
        },
        entity_copy: function(id, url, callback) {
            $http({
                method: 'POST',
                url: $Api_Service.route.get('entity_copy'),
                data: $.param({
                    entity_id: id
                }),
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

        },

        entity_new: function(id, url, callback) {
            $http({
                method: 'POST',
                url: $Api_Service.route.get('entity_new'),
                data: $.param({
                    entity_id: id
                }),
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

        },

        entity_save: function(callback) {
            callback(false);
        },

        entity_discard: function(callback) {
            callback(false);
        },

        entity_delete: function(id, payload, callback) {
            // callback(true);
            var url = API.BASE_URL_DATA_MASTERS + '/api/masters/documentupload/delete';

            $http.post(url, {Payload: payload}, {})
            .then(function successCallback(response) {
                if (response) {
                    callback(true);
                } else {
                    callback(false);
                }
            }, function errorCallback(response) {
                console.log('HTTP ERROR');
                callback(false);
            });
        },

        structure_save: function(callback) {
            callback(false);
        },

        structure_discard: function(callback) {
            callback(false);
        },

        action: function(ajax_method) {
            switch (ajax_method) {
                case 'new_entity':
                    break;

            }
        },

        /*
        structure_save_changes: function (callback) {
            console.log('saving data');
            callback(true);
        },

        structure_discard_changes: function (callback) {
            console.log('discard data');
            callback(false);
        },
        */
        update_scheduler_configuration: function(payload, callback) {
            url = API.BASE_URL_DATA_IMPORTEXPORT + '/api/importExport/upload/updateschedulerconfiguration';

            $http.post(url, {Payload: payload}, {})
            .then(function successCallback(response) {
                if(response && response.status == 200){
                    toastr.success('Successfully updated schedule');
                }

            }, function errorCallback(response) {
                console.log('HTTP ERROR');
                toastr.error("Error occured");
            });
        },

        get_note: function(payload, callback) {
            url = API.BASE_URL_DATA_IMPORTEXPORT + '/api/importExport/upload/getnotebyid';

            $http.post(url, {Payload: payload}, {})
            .then(function successCallback(response) {
                if(response && response.status == 200){
                    callback(response.data.payload);
                }

            }, function errorCallback(response) {
                console.log('HTTP ERROR');
            });
        },

        update_note: function(payload, callback) {
            url = API.BASE_URL_DATA_IMPORTEXPORT + '/api/importExport/upload/updatenote';

            $http.post(url, {Payload: payload}, {})
            .then(function successCallback(response) {
                if(response && response.status == 200){
                    // toastr.success('Successfully updated note');
                }

            }, function errorCallback(response) {
                console.log('HTTP ERROR');
                // toastr.error("Error occured");
            });
        },
        
        update_documents_note: function(payload, callback) {
            url = API.BASE_URL_DATA_MASTERS + '/api/masters/documentupload/notes';

            $http.post(url, {Payload: payload}, {})
            .then(function successCallback(response) {
                if(response && response.status == 200){
                    callback(response);
                }

            }, function errorCallback(response) {
                console.log('HTTP ERROR');
                callback(response);
            });
        },

        delete_upload_log: function(payload, callback) {
            url = API.BASE_URL_DATA_IMPORTEXPORT + '/api/importExport/upload/deleteuploadlog';

            $http.post(url, {Payload: payload}, {})
            .then(function successCallback(response) {
                if(response && response.status == 200){
                    // toastr.success('Successfully deleted log');
                    // $('table.ui-jqgrid-btable').trigger("reloadGrid");
                    callback(response);
                }

            }, function errorCallback(response) {
                console.log('HTTP ERROR');
                toastr.error("Error occured");
            });
        },
        updateTreasuryInfo: function(payload, callback) {
            url = API.BASE_URL_DATA_INVOICES + '/api/invoice/updateTreasuryInfo';
            $http.post(url, {Payload: payload}, {})
            .then(function successCallback(response) {
                if(response && response.status == 200){
                    callback(response.data);
                }
            }, function errorCallback(response) {
                console.log('HTTP ERROR');
                toastr.error("Error occured");
            }).finally(function(){
                toastr.error("Error occured while saving");
            });
        },
        updateDocumentVerify: function(payload, callback) {
            url = API.BASE_URL_DATA_MASTERS + "/api/masters/documentupload/update";
            $http.post(url, {Payload: payload}, {})
            .then(function successCallback(response) {
                if(response && response.status == 200){
                    callback(response);
                }
            }, function errorCallback(response) {
                console.log('HTTP ERROR');
                toastr.error("Error occured");
            });
        }

    };

}]);
