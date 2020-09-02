/**
 * Master_Hierarchy Controller
 */

APP_MASTERS.controller('OrderImport_Controller', [
    'API',
    '$tenantSettings',
    'tenantService',
    '$scope',
    '$rootScope',
    '$sce',
    '$Api_Service',
    'Factory_Master',
    '$state',
    '$location',
    '$q',
    '$compile',
    '$timeout',
    '$interval',
    '$templateCache',
    '$listsCache',
    '$uibModal',
    'uibDateParser',
    'uiGridConstants',
    '$filter',
    '$http',
    '$window',
    '$controller',
    'payloadDataModel',
    'statusColors',
    'screenLoader',
    '$parse',
    'orderModel',
    'API',
    function (API, $tenantSettings, tenantService, $scope, $rootScope, $sce, $Api_Service, Factory_Master, $state, $location, $q, $compile, $timeout, $interval, $templateCache, $listsCache, $uibModal, uibDateParser, uiGridConstants, $filter, $http, $window, $controller, payloadDataModel, statusColors, screenLoader, $parse, orderModel, API) {
        let vm = this;
        $scope.screen_id = $state.params.screen_id;

        var getListUrl = function () {
            var map = {
                "counterparty": "counterparties",
                "location": "locations",
                "buyer": "buyer",
                "strategy": "strategies",
                "service": "services",
                "product": "products",
                "company": "companies"
            };
            var currentList = "locations";

            return `${API.BASE_URL_DATA_MASTERS}/api/masters/${currentList}/listMasters`;
        }

        vm.getData = function (callback) {
            apiJSON = {
                "Payload": {
                    "Pagination": {
                        "Skip": 0,
                        "Take": 10
                    }
                }
            }
            url = getListUrl();
            $http.post(url, angular.toJson(apiJSON)).then(
                (response) => {
                    if (response.data) {
                        console.log("Start", Date.now());
                        callback(response.data.payload);
                    } else {
                        callback(false);
                    }
                },
                (response) => {
                    console.log('HTTP ERROR');
                    callback(false);
                }
            );
        }

        vm.getData(function (response) {
            $scope.formValues = response;
            console.log($scope.formValues);
        });

        $('.display').on('click','div',function (e) {
          setTimeout(() => {
            angular.element('#fileUpload').trigger('click');
            angular.element('#FTPFileUpload').trigger('click');
            }, 1);
         });


        $('.display').on('dragover', 'div', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
         $('.display').on('dragenter', 'div', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
        $('.display').on('drop', 'div', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.originalEvent.dataTransfer){
                if (e.originalEvent.dataTransfer.files.length > 0) {
                    vm.dropDocument(e.originalEvent.dataTransfer.files[0]);
                }
            }
            return false;
        });

        vm.dropDocument = function(file) {
            var fileScope = angular.element($('input').parent().find('.fileNameLabel')).scope();
            $rootScope.droppedDoc = file;
            fileScope.$apply(() => {
                fileScope.droppedDoc = file;
            });             
        };

        vm.uploadDocument = function(selector) {
            let data = {
                request: {
                    Payload: {
                        name: 'File2',
                        documentType: {}, // { "id":1, "name":"BDN","code":"","collectionName":null } (dinamic)
                        size: 100,
                        fileType: 'FileType',
                        transactionType: {}, // {"id":1,"name":"Request","code":"","collectionName":null} (dinamic)
                        fileId: 1,
                        uploadedBy: {
                            id: 1,
                            name: 'Admin',
                            code: '',
                            collectionName: null
                        },
                        uploadedOn: '2017-01-11T14:21:37.96',
                        notes: '',
                        isVerified: false,
                        referenceNo: 1,
                        createdBy: {
                            id: 1,
                            name: 'Admin',
                            code: '',
                            collectionName: null
                        },
                        createdOn: '2017-01-11T14:21:37.96',
                        lastModifiedByUser: null,
                        lastModifiedOn: null,
                        id: 0,
                        isDeleted: false
                    }
                },
                file: {}
            };
            let FD = new FormData();
            if ($rootScope.droppedDoc) {
                file = $rootScope.droppedDoc;
            } else {
                file = $(selector)[0].files[0];
            }
            FD.append('file', file);
            // add file
            Factory_Master.upload_document(FD, (callback) => {
                if (callback) {
                    toastr.success('Document saved!');
                    // $state.reload();
                    // $('.ui-jqgrid-btable').trigger('reloadGrid');
                    // location.reload();
                } else {
                    toastr.error('Upload error');
                    // $state.reload();
                    // location.reload();
                }
            });
            
        };

        vm.searchClick = function() {
            console.log("IOANA");
            setTimeout(() => {
                angular.element('#fileUpload').trigger('click');
                angular.element('#FTPFileUpload').trigger('click');
            }, 1);
        }

        vm.uploadedFile = function() {
            console.log("UPLOAD");
        }


    }

]);
