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
        vm.listsCache = $listsCache;
        $scope.formValues = [];

        $('.search-part').on('click','div',function (e) {
          setTimeout(() => {
            angular.element('#fileUpload').trigger('click');
            angular.element('#FTPFileUpload').trigger('click');
            }, 1);
         });
        
         $('.drop-part').on('click','div',function (e) {
          setTimeout(() => {
            angular.element('#fileUpload').trigger('click');
            angular.element('#FTPFileUpload').trigger('click');
            }, 1);
         });
        $('.drop-part').on('dragover', 'div', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
        $('.drop-part').on('dragenter', 'div', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
        $('.drop-part').on('drop', 'div', function(e) {
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
            let listOfDocumentTypes = vm.listsCache['DocumentType'];
            let findRequestToInvoiceImport = _.find(listOfDocumentTypes, function(object) {
                return object.name == 'RequestToInvoiceImport';
            });
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
            if (findRequestToInvoiceImport) {
                data.request.Payload.documentType = findRequestToInvoiceImport;
                FD.append('file', file);
                FD.append('request', JSON.stringify(data.request));
                screenLoader.showLoader();
                Factory_Master.upload_document_import_data(FD, (callback) => {
                    if (callback) {
                        toastr.success("Operation completed successfully");
                        $scope.formValues = callback.payload;
                        $rootScope.droppedDoc = null;
                        $scope.droppedDoc = null;
                        screenLoader.hideLoader();
                    } else {
                        toastr.error('Upload error');
                        screenLoader.hideLoader();
                    }
                });    
            } else {
                toastr.warning("Document type RequestToInvoiceImport doesn't exist in lists cache!");
            }
           
            
        }
        
        vm.uploadedFile = function() {
            console.log("UPLOAD");
        }


    }

]);
