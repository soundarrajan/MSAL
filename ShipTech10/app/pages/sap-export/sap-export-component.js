angular.module("shiptech.pages").controller("SAPExportController", ["$window", "$scope","Factory_Master", "$element", "$attrs", "$timeout", "$state", "$stateParams", "$filter", 'STATE', 'emailModel', 'newRequestModel', 'listsModel', 'orderModel', 'groupOfRequestsModel', '$sce',
    function($window, $scope, Factory_Master, $element, $attrs, $timeout, $state, $stateParams, $filter, STATE, emailModel, newRequestModel, listsModel, orderModel, groupOfRequestsModel, $sce) {
        var ctrl = this;
        // ctrl.getTableData = function(){
        //     console.log(this);
        // }
        // ctrl.test = 1;
        ctrl.sapExport = function(dateFrom){
            var payload = {};
            var newExport = true;
            if(dateFrom){
                payload = {
                    "Payload": {
                        "TimeZone": jstz().timezone_name,
                        "Columns": null,
                        "ExportType": 1,
                        "DateFrom": dateFrom
                    }
                }
                newExport = false;
            }else{
                payload = {
                    "Payload": {
                        "TimeZone": jstz().timezone_name,
                        "Columns": null,
                        "ExportType": 1
                    }
                }
                newExport = true;
            }
            Factory_Master.sapExport(payload, newExport, function(file, mime) {
                if (file.data && file.status == 200) {
                    console.log(file);
                    var blob = new Blob([file.data], {
                        type: mime
                    });
                    var a = document.createElement("a");
                    a.style = "display: none";
                    document.body.appendChild(a);
                    //Create a DOMString representing the blob and point the link element towards it
                    var url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = "Export_" + (new Date()).getDate() + '/' + (new Date()).getMonth();

                    //programatically click the link to trigger the download
                    a.click();
                    //release the reference to the file by revoking the Object URL
                    window.URL.revokeObjectURL(url);
                    toastr.success('File downloaded successfully.');
                    setTimeout(function(){$state.reload()},200);
                } else {
                    console.log(file);
                    if(file.statusText == 'No Content'){
                        toastr.error('There are no orders to export');
                        return;
                    }
                    // if(file.statusText) toastr.error(file.statusText);
                    // if(file.message) toastr.error(file.message);
                }
            });
        }
    }
]);
angular.module('shiptech.pages').component('sapExport', {
    templateUrl: 'pages/sap-export/views/sap-export-component.html',
    controller: 'SAPExportController'
});
