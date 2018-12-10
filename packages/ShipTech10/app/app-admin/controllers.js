/**
 * Admin Controller
 */
APP_ADMIN.controller('Controller_Admin', ['$rootScope', '$scope', '$Api_Service', '$listsCache', 'Factory_Admin', '$state', '$location', 'Factory_Master', 'screenLoader', function($rootScope, $scope, $Api_Service, $listsCache, Factory_Admin, $state, $location, Factory_Master, screenLoader) {
    var vm = this;
    vm.admin_id = $state.params.admin_id;
    vm.reset_data = {};
    $scope.tabData = {};
    $scope.listsCache = $listsCache;
    $scope.deliveryPrecedenceRules = [];
    $scope.redirectAuthUser = function() {
        window.location.hash = "#"
    }
    if ($scope.screen) {
        vm.screen_id = $scope.screen;
    } else {
        vm.screen_id = $state.params.screen_id;
    }
    vm.entity_id = $state.params.entity_id;

    if (vm.screen_id == 'sellerrating') {
        setTimeout(function() {
            $state.params.title = "Configure Seller Rating"
        }, 1000)
    }

    if ($state.params.path) {
        vm.app_id = $state.params.path[0].uisref.split('.')[0];
    }
    vm.treant = [{
        "Name": "Company1",
        "slug": "company001",
        "Managers": [{
            "Name": "Manager11",
            "slug": "manager001",
            "Users": [{
                "Name": "user10",
                "slug": "user001"
            }, {
                "Name": "user11",
                "slug": "user001"
            }]
        }, {
            "Name": "Manager12",
            "slug": "manager0012",
            "Users": [{
                "Name": "user121",
                "slug": "user001"
            }, {
                "Name": "user122",
                "slug": "user0012"
            }, {
                "Name": "user123",
                "slug": "user0013"
            }]
        }]
    }];
    var simple_chart_config = {
        chart: {
            container: "#tree-simple",
            connectors: {
                type: "step"
            },
            node: {
                HTMLclass: "nodeExample"
            }
        },
        nodeStructure: {
            text: {
                name: vm.treant[0].Name
            },
            children: []
        }
    };
    $.each(vm.treant[0].Managers, function(key, value) {
        var managersToAdd = {
            text: {
                name: ""
            },
            children: [],
            HTMLid: ""
        };
        simple_chart_config.nodeStructure.children.push(managersToAdd);
        simple_chart_config.nodeStructure.children[key].text.name = vm.treant[0].Managers[key].Name;
        simple_chart_config.nodeStructure.children[key].HTMLid = vm.treant[0].Managers[key].Name;
    });
    $.each(vm.treant[0].Managers, function(key, value) {
        $.each(vm.treant[0].Managers[key].Users, function(i, e) {
            var usersToAdd = {
                text: {
                    name: "",
                },
                HTMLid: ""
            }
            simple_chart_config.nodeStructure.children[key].children.push(usersToAdd);
            simple_chart_config.nodeStructure.children[key].children[i].text.name = vm.treant[0].Managers[key].Users[i].Name;
            simple_chart_config.nodeStructure.children[key].children[i].HTMLid = vm.treant[0].Managers[key].Name;
        });
    });
    if ($state.current.params.path[0].uisref == 'admin.org_chart') {
        new Treant(simple_chart_config);
    }
    $(".nodeExample p").each(function(j, f) {
        if ($(this).html() === vm.admin_id) {
            $(this).parent().addClass("orange-color");
        }
    });
    var managerToColor = $(".orange-color").attr("id");
    var managerToColorID = "*[id*=" + managerToColor + "]";
    $(managerToColorID).each(function() {
        if ($(this).children().html() === managerToColor) {
            $(this).addClass("orange-color");
        }
    });
    vm.reset_Password = function() {
        vm.reset_data = angular.toJson(vm.reset_data);
        Factory_Admin.reset_Password(vm.admin_id, vm.reset_data, function(callback, response) {
            if (response != false) {
                // status | message
                switch (callback.status) {
                    case 'success':
                        toastr.success(callback.message);
                        break;
                    case 'error':
                        toastr.error(callback.message);
                        break;
                }
                vm.reset_data = {};
                //throw new Error('test');
            } else {
                toastr.error("Error occured");
            }
        });
    };
    vm.adminTree = [];
    vm.adminCatalog = function() {
        vm.adminTree = [
            // USERS (8.3)
            // Users list (8.3.1)
            {
                id: 1,
                title: 'Users',
                slug: 'users',
                icon: 'fa fa-folder icon-lg',
                nodes: 1
            },
            // -> User Details (8.3.2)
            // -> Hierarchy Link (Organization Chart) (8.3.2.1)
            // -> Set / Reset password Link (8.3.2.2)
            // -> User Contact Information (8.3.3)
            // -> User Role & Access details (8.3.4)
            // -> User Leave Details (8.3.5)
            // USER ROLE (8.4)
            // User Role Details (8.4.1)
            {
                id: 2,
                title: 'User Role',
                slug: 'role',
                icon: 'fa fa-folder icon-lg',
                nodes: 1
            }, {
                id: 3,
                title: 'Configuration',
                slug: 'configuration/edit/',
                icon: 'fa fa-folder icon-lg',
                nodes: 1
            }, {
                id: 3,
                title: 'Seller Rating',
                slug: 'sellerRating/edit/',
                icon: 'fa fa-folder icon-lg',
                nodes: 1
            },
            // -> Role Details (8.4.2)
            // -> Role - Access Rights (8.4.3)
            // -> Role Access - Procurement App (8.4.4)
            // -> Role Access – Masters App (8.4.4.1)
            // -> Role Access – Admin App (8.4.4.2)
        ];
    };
    vm.selectAdminScreen = function(id, name) {
        $location.path('/admin/' + id);
        $scope.admin_screen_name = name;
    };
    $scope.entities = [{
        name: 'Vessel Access',
        id: 'vessel_access'
    }, {
        name: 'Buyer Access',
        id: 'buyer_access'
    }, {
        name: 'Company Access',
        id: 'company_access'
    }];
    // console.log($scope)
    $scope.triggerChangeFieldsAppSpecific = function(name, id) {
       
        if (vm.screen_id == 'sellerrating') {
            if (name == 'company') {
                Factory_Master.get_master_entity($scope.formValues.company.id, vm.screen_id, vm.app_id, function(response) {
                    newValues = response;
                    $scope.formValues.applications = newValues.applications;
                    $scope.formValues.id = newValues.id;
                    setTimeout(function() {
                        $scope.initMultiTags('applications');
                    }, 500)
                });
            }
        }
    }
    $scope.createRange = function(min, max) {
        min = parseInt(min);
        max = parseInt(max);
        input = [];
        for (var i = min; i <= max; i++) input.push(i);
        return input;
    };
    $scope.generateTemplate = function(obj, timezone) {
        console.log(obj);
        Factory_Master.generateTemplate({
            Payload: {
                "Application": {
                    "Id": obj.Module.application.id,
                    "Name": obj.Module.application.name
                },
                "Screen": {
                    "Id": obj.Screen.id,
                    "Name": obj.Screen.name
                },
                "timeZone": timezone
            }
        }, function(file, mime) {
            if (file.data) {
                var blob = new Blob([file.data], {
                    type: mime
                });
                var a = document.createElement("a");
                a.style = "display: none";
                document.body.appendChild(a);
                //Create a DOMString representing the blob and point the link element towards it
                var url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = obj.Module.application.name + '_' + obj.Screen.name;
                //programatically click the link to trigger the download
                a.click();
                //release the reference to the file by revoking the Object URL
                window.URL.revokeObjectURL(url);
            }
        });
    };
    $scope.downloadFTP = function(obj) {
        console.log(obj);
        // console.log(timezone);
        console.log(jstz().timezone_name);
        if (obj.DateFrom == 'undefined') obj.DateFrom = 'null';
        if (obj.DateTo == 'undefined') obj.DateTo = 'null';
        Factory_Master.downloadFTP({
            Payload: {
                "Application": obj.Module.application,
                "Screen": obj.Screen,
                "TimeZone": jstz().timezone_name,
                "DateFrom": obj.DateFrom,
                "DateTo": obj.DateTo,
                "Status": obj.TransactionStatus,
                "Columns": null,
                "ExportType": 1,
                "Order": null,
                "Filters": [],
                "Pagination": {
                    "Skip": 0,
                    "Take": null
                },
                "SearchText": null,
                "PageFilters": null
            }
        }, function(file, mime) {
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
                a.download = obj.Module.application.name + '_' + obj.Screen.name;
                //programatically click the link to trigger the download
                a.click();
                //release the reference to the file by revoking the Object URL
                window.URL.revokeObjectURL(url);
                toastr.success('File downloaded successfully.');
                $scope.formValues.FTP.Download = {};
            } else {
                console.log(file);
                toastr.error(file.statusText);
            }
        });
    };
    $scope.updateWeightSum = function(applicationIdx, categoryIdx) {
        var weight = 0;
        $.each($scope.formValues.applications[applicationIdx].categories[categoryIdx].details, function(key, value) {
            currentVal = value.weight;
            if (typeof(value.weight) == 'NaN' || typeof(value.weight) == 'undefined' || value.weight == null) {
                currentVal = 0;
            }
            weight += parseFloat(currentVal);
        })
        $scope.formValues.applications[applicationIdx].categories[categoryIdx].weight = weight;
        $scope.totalWeightageCalc();
    }
    $scope.totalWeightageCalc = function() {
        totalWeightage = 0;
        $.each($scope.formValues.applications, function(key, value) {
            $.each(value.categories, function(key1, value1) {
                $.each(value1.details, function(key2, value2) {
                    currentVal = value2.weight;
                    if (typeof(value2.weight) == 'NaN' || typeof(value2.weight) == 'undefined' || value2.weight == null) {
                        currentVal = 0;
                    }
                    totalWeightage += parseFloat(currentVal);
                })
            })
        })
        $scope.totalWeightage = totalWeightage;
    }
    /*ADmin precedence rules*/
    $scope.initAdminPrecedenceRules = function() {
        if (typeof($scope.formValues.temp) == 'undefined') {
            $scope.formValues.temp = {}
        }
        // if (typeof($scope.formValues.temp.buyerPrecedence) == 'undefined') {
        //     $scope.formValues.temp.buyerPrecedence = {}
        // }
        // if (typeof($scope.formValues.temp.sellerPrecedence) == 'undefined') {
        //     $scope.formValues.temp.sellerPrecedence = {}
        // }
        // if (typeof($scope.formValues.temp.finalQtyPrecedence) == 'undefined') {
        //     $scope.formValues.temp.sellerPrecedence = {}
        // }
    

        $scope.deliveryPrecedenceRules = [
            { 
                name: 'buyerPrecedenceLogicRules',
                tempMapping: 'buyerPrecedence',
                valueName: 'buyerOrd_',
                dataName: 'buyer-ord-'
            },{
                name: 'sellerPrecedenceLogicRules',
                tempMapping: 'sellerPrecedence',
                valueName: 'sellerOrd_',
                dataName: 'seller-ord-'
            },{
                name: 'finalQtyPrecedenceLogicRules',
                tempMapping: 'finalQtyPrecedence',
                valueName: 'finalOrd_',
                dataName: 'finalQty-ord-'
            }
        ];
    

        $.each($scope.deliveryPrecedenceRules, function(_,rule){
            if (typeof($scope.formValues.temp[rule.tempMapping]) == 'undefined') {
                $scope.formValues.temp[rule.tempMapping] = {};
            }
            $.each($scope.formValues.delivery[rule.name], function(_, value) {
                $scope.formValues.temp[rule.tempMapping][rule.valueName + value.ord] = value.precedenceRule;
            })
        })

        console.log($scope.formValues);
        // $.each($scope.formValues.delivery.sellerPrecedenceLogicRules, function(key, value) {
        //     $scope.formValues.temp.sellerPrecedence['sellerOrd_' + value.ord] = value.precedenceRule;
        // })
        // $.each($scope.formValues.delivery.finalQtyPrecedenceLogicRules, function(key, value) {
        //     $scope.formValues.temp.finalQtyPrecedence['finalOrd_' + value.ord] = value.finalQtyPick;
        // })
        setTimeout(function() {
            $.each($scope.deliveryPrecedenceRules, function(_, rule){
                var selects = $(".admin-precedence-select[name^=" + rule.dataName + "]");
                $.each(selects, function() {
                    dataOrd = $(this).attr("data-ord");
                    item = $(this);
                    for (var k1 in $scope.formValues.temp[rule.tempMapping]) {
                        objIdx = k1.split("_")[1];
                        if (objIdx < dataOrd) {
                            alreadySelected = $scope.formValues.temp[rule.tempMapping][k1].id;
                            var selectOptions = item.children("option");
                            $.each(selectOptions, function(k2, v2) {
                                if ($(v2).attr("value") == alreadySelected) {
                                    $(v2).attr("disabled", true);
                                }
                            })
                        }
                    }
                })
            })
            // buyerSelects = $(".admin-precedence-select[name^=buyer-ord-]");
            // $.each(buyerSelects, function(key, value) {
            //     dataOrd = $(this).attr("data-ord");
            //     buyerItem = $(this);
            //     for (var k1 in $scope.formValues.temp.buyerPrecedence) {
            //         objIdx = k1.split("_")[1];
            //         if (objIdx < dataOrd) {
            //             alreadySelected = $scope.formValues.temp.buyerPrecedence[k1].id;
            //             selectOptions = buyerItem.children("option");
            //             $.each(selectOptions, function(k2, v2) {
            //                 if ($(v2).attr("value") == alreadySelected) {
            //                     $(v2).attr("disabled", true);
            //                 }
            //             })
            //         }
            //     }
            // })
            // sellerSelects = $(".admin-precedence-select[name^=seller-ord-]");
            // $.each(sellerSelects, function(key, value) {
            //     dataOrd = $(this).attr("data-ord");
            //     sellerItem = $(this);
            //     for (var k1 in $scope.formValues.temp.sellerPrecedence) {
            //         objIdx = k1.split("_")[1];
            //         if (objIdx < dataOrd) {
            //             alreadySelected = $scope.formValues.temp.sellerPrecedence[k1].id;
            //             selectOptions = sellerItem.children("option");
            //             $.each(selectOptions, function(k2, v2) {
            //                 if ($(v2).attr("value") == alreadySelected) {
            //                     $(v2).attr("disabled", true);
            //                 }
            //             })
            //         }
            //     }
            // })


            // finalQtySelects = $(".admin-precedence-select[name^=finalQty-ord-]");
            // $.each(finalQtySelects, function(key, value) {
            //     dataOrd = $(this).attr("data-ord");
            //     finalQtyItem = $(this);
            //     for (var k1 in $scope.formValues.temp.finalQtyPrecedence) {
            //         objIdx = k1.split("_")[1];
            //         if (objIdx < dataOrd) {
            //             alreadySelected = $scope.formValues.temp.finalQtyPrecedence[k1].id;
            //             selectOptions = finalQtyItem.children("option");
            //             $.each(selectOptions, function(_, v2) {
            //                 if ($(v2).attr("value") == alreadySelected) {
            //                     $(v2).attr("disabled", true);
            //                 }
            //             })
            //         }
            //     }
            // })
        }, 1000)
    }


    $scope.precedenceRuleChanged = function(ruleType, changedIdx) {
        if(typeof $scope.formValues.temp['buyerPrecedence']['buyerOrd_6'] != 'undefined'){
            delete $scope.formValues.temp['buyerPrecedence']['buyerOrd_6'];
        }
        if(typeof $scope.formValues.temp['sellerPrecedence']['sellerOrd_6'] != 'undefined'){
            delete $scope.formValues.temp['sellerPrecedence']['sellerOrd_6'];
        }
        for (var k1 in $scope.formValues.temp[ruleType + 'Precedence']) {
            objIdx = k1.split("_")[1];
            if (objIdx > changedIdx) {
                $scope.formValues.temp[ruleType + 'Precedence'][k1] = null;
            }
        }
        entitySelects = $(".admin-precedence-select[name^=" + ruleType + "-ord-]");
        $.each(entitySelects, function(key, value) {
            dataOrd = $(this).attr("data-ord");
            entityItem = $(this);
            entityItem.children("option").removeAttr("disabled");
            for (var k1 in $scope.formValues.temp[ruleType + 'Precedence']) {
                objIdx = k1.split("_")[1];
                if (objIdx < dataOrd) {
                    if($scope.formValues.temp[ruleType + 'Precedence'][k1]){
                        alreadySelected = $scope.formValues.temp[ruleType + 'Precedence'][k1].id;
                        selectOptions = entityItem.children("option");
                        $.each(selectOptions, function(k2, v2) {
                            if ($(v2).attr("value") == alreadySelected) {
                                $(v2).attr("disabled", true);
                            }
                        })
                    }
                }
            }
        })

        var currentChange = ruleType + "Precedence";
        $.each($scope.deliveryPrecedenceRules, function(_, rule){

            // { 
            //     name: 'buyerPrecedenceLogicRules',
            //     tempMapping: 'buyerPrecedence',
            //     valueName: 'buyerOrd_',
            //     dataName: 'buyer-ord-'
            // }
      
            if(rule.tempMapping == currentChange){
                $scope.formValues.delivery[rule.name] = [];
                $.each($scope.formValues.temp[rule.tempMapping], function(key, val) {
                    ordIdx = key.split("_")[1];
                    obj = {
                        ord: ordIdx,
                        id: ordIdx,
                        precedenceRule: val
                    };
                    $scope.formValues.delivery[rule.name].push(obj)
                });
            }
        });
        // $scope.formValues.delivery.buyerPrecedenceLogicRules = [];
        // $scope.formValues.delivery.sellerPrecedenceLogicRules = [];
        // $scope.formValues.delivery.finalQtyPrecedenceLogicRules = [];
        // $.each($scope.formValues.temp.buyerPrecedence, function(key, val) {
        //     ordIdx = key.split("_")[1];
        //     obj = {
        //         ord: ordIdx,
        //         id: ordIdx,
        //         precedenceRule: val
        //     };
        //     $scope.formValues.delivery.buyerPrecedenceLogicRules.push(obj)
        // });
        // $.each($scope.formValues.temp.sellerPrecedence, function(key, val) {
        //     ordIdx = key.split("_")[1];
        //     obj = {
        //         ord: ordIdx,
        //         id: ordIdx,
        //         precedenceRule: val
        //     };
        //     $scope.formValues.delivery.sellerPrecedenceLogicRules.push(obj)
        // })
        // $.each($scope.formValues.temp.finalQtyPrecedence, function(key, val) {
        //     ordIdx = key.split("_")[1];
        //     obj = {
        //         ord: ordIdx,
        //         id: ordIdx,
        //         precedenceRule: val
        //     };
        //     $scope.formValues.delivery.finalQtyPrecedenceLogicRules.push(obj)
        // })
    }
    /*ADmin precedence rules*/
    $scope.uploadSchedulerConfiguration = function(name, dragFlag, obj, timezone, file) {
        var formData = new FormData();
        formData.append('request', '{"Payload": {"TimeZone":"' + timezone + '","FirstDate":"' + obj.AddSchedule.FirstDate + '","ExDate":"' + obj.AddSchedule.ExDate + '","Time":"' + obj.AddSchedule.Time + '","FTPFile": {"Transaction": {"Id":' + obj.Screen.id + ',"Name": "","Code": null,"CollectionName": null}}, "SchedulerInterval":{"Id":' + obj.AddSchedule.Interval.id + ',"Name": null, "Code": null,"CollectionName": null}}}');
        if (file) {
            formData.append('file', file);
        } else if ($('#FTPFileUpload')[0].files) {
            $.each($('#FTPFileUpload')[0].files, function(i, file) {
                formData.append('file', file);
            });
        }
        Factory_Master.uploadSchedulerConfiguration(formData, function(callback) {
            if (callback && callback.status == 200) {
                toastr.success('File uploaded successfully.');
                $('table.ui-jqgrid-btable').trigger("reloadGrid");
                $scope.formValues.FTP.Upload = {};
                $('#FTPFileUpload')[0].files = [];
            } else {
                toastr.error(callback.data.ErrorMessage)
            }
        });
    }

    $scope.uploadFTPFile = function(name, obj, file) {
        var formData = new FormData();
        formData.append('request', '{"Payload": {"FTPFile": {"Transaction": {"Id":' + obj.Screen.id + ',"Name": "","Code": null,"CollectionName": null}}}}');
        if (file) {
            formData.append('file', file);
        } else if ($('#FTPFileUpload')[0].files) {
            $.each($('#FTPFileUpload')[0].files, function(i, file) {
                formData.append('file', file);
            });
        }
        Factory_Master.uploadFTPFile(formData, function(callback) {
            if (callback && callback.status == 200) {
                delete $scope.uploadedFileName;
                toastr.success('File uploaded successfully.');
                $('table.ui-jqgrid-btable').trigger("reloadGrid");
                $scope.formValues.FTP.Upload = {};
                $('#FTPFileUpload').val('');
            } else {
                toastr.error(callback.data.ErrorMessage)
                delete $scope.uploadedFileName;
                $scope.formValues.FTP.Upload = {};
                $('#FTPFileUpload').val('');
            }
        });
    }

    $scope.addedFTPFile = function(flag, file) {
        if (flag == 'drop') {
            $scope.uploadedFileName = file.name;
        }
        if (flag == 'click') {
            $scope.uploadedFileName = $('#FTPFileUpload')[0].files[0].name;
        }
    }

    $scope.setFTPDatepickers = function() {
        //init datepickers
        setTimeout(function() {
            $('#firstDateDP').not('.disabled').datepicker({
                autoclose: true,
                format: "yyyy-mm-ddT12:00:00Z"
            });
            $('#exDateDP').not('.disabled').datepicker({
                autoclose: true,
                format: "yyyy-mm-ddT12:00:00Z"
            });
            $('#timeDP').not('.disabled').datetimepicker({
                showMeridian: 'false',
                autoclose: true,
                format: "HH:mm:ss",
                pickDate: false
            });
        }, 10);
        // FTP datepickers constraints
        setTimeout(function() {
            $('#exDateDP').datepicker('setStartDate', new Date());
            $('#firstDateDP').datepicker('setStartDate', new Date());
        }, 20);
    }
    $scope.firstDateChange = function() {
        var firstDate = $scope.formValues.FTP.Upload.AddSchedule.FirstDate;
        $('#exDateDP').datepicker('setStartDate', new Date(firstDate));
        $scope.formValues.FTP.Upload.AddSchedule.ExDate = firstDate;
    }
    $scope.enableDateTo = function() {
        var dateFrom = $scope.formValues.FTP.Download.DateFrom;
        setTimeout(function() {
            $('#dateTo').datetimepicker('setStartDate', new Date(dateFrom));
        }, 20);
    }
    $scope.getTabData = function() {
       
        $.each($scope.entities, function(key, val) {
            Factory_Admin.getTabData(val.id, function(response) {
                if (response) {
                    if (val.id == 'vessel_access') {
                        if (response.payload.length == 1) {
                            $scope.tabData[val.id] = $scope.buildTree(response.payload[0].children);
                        } else {
                            aligendObject = $scope.setParentUnselectable(response.payload)
                            $scope.tabData[val.id] = aligendObject;
                        }
                    } else {
                        $scope.tabData[val.id] = $scope.buildTree(response.payload);
                    }
                }
            })
        })
    }

    $scope.getAgreementTypeIndividualList = function() {
        Factory_Admin.getAgreementTypeIndividualList(true, function(response) {
        	$scope.contractAgreementTypesList = response.payload.contractAgreementTypesList;
        	$scope.spotAgreementTypesList = response.payload.spotAgreementTypesList;
        })
    }

    $scope.$on('changedSelection', function(evt, value) {
        // console.log(value);
        // $scope.accessSelection = value;
        if (value.buyer_access) {
            $scope.formValues.accessBuyers = value.buyer_access;
        }
        if (value.vessel_access) {
            $scope.formValues.accessVessels = value.vessel_access;
        }
        if (value.company_access) {
            $scope.formValues.accessCompanies = value.company_access;
        }
    });
    $scope.setParentUnselectable = function(list) {
        list.forEach(function(obj) {
            obj.unSelectable = true;
        });
        console.log(list)
        return list;
    }
    $scope.buildTree = function(list, idAttr, parentAttr, childrenAttr) {
        if (!idAttr) idAttr = 'id';
        if (!parentAttr) parentAttr = 'parent';
        if (!childrenAttr) childrenAttr = 'children';
        var treeList = [];
        var lookup = {};
        list.forEach(function(obj) {
            lookup[obj[idAttr]] = obj;
            obj[childrenAttr] = [];
        });
        list.forEach(function(obj) {
            if (obj[parentAttr] != null) {
                if (obj[parentAttr].id) lookup[obj[parentAttr].id][childrenAttr].push(obj);
            } else {
                treeList.push(obj);
            }
        });
        return treeList;
    };
    $scope.changeScheduleStatusDisplayOrder = function(newVal, oldVal) {
        console.log($scope.formValues.schedule.labels);
        $.each($scope.formValues.schedule.labels, function(key, val) {
            if (val.tempDisplayOrder == val.displayOrder) {
                if (newVal > oldVal) {
                    if (val.displayOrder <= newVal && val.displayOrder > oldVal) {
                        val.displayOrder -= 1;
                        val.tempDisplayOrder -= 1;
                    }
                } else {
                    if (val.displayOrder >= newVal && val.displayOrder < oldVal) {
                        val.displayOrder += 1;
                        val.tempDisplayOrder += 1;
                    }
                }
            }
        })
        $.each($scope.formValues.schedule.labels, function(key, val) {
            if (val.tempDisplayOrder != val.displayOrder) {
                val.displayOrder = val.tempDisplayOrder;
            }
        })
    }
    $scope.initMinicolors = function() {
        setTimeout(function() {
            $.minicolors = {
                defaults: {
                    animationSpeed: 50,
                    animationEasing: 'swing',
                    change: null,
                    changeDelay: 0,
                    control: 'hue',
                    defaultValue: '',
                    format: 'hex',
                    hide: null,
                    hideSpeed: 100,
                    inline: false,
                    keywords: '',
                    letterCase: 'lowercase',
                    opacity: false,
                    position: 'bottom left',
                    show: null,
                    showSpeed: 100,
                    theme: 'default',
                    swatches: []
                }
            }
            $('input.minicolors-input').minicolors();
        })
    }


    $scope.getCounterpartyTypeFilterItems = function() {
    	itemlist = []
    	$.each($scope.listsCache.CounterpartyTypeFilter, function(k,v) {
    		itemlist.push(v);
    	})
    	return itemlist;
    }

    $scope.addCounterpartyTypeFilterItem = function(item) {
    	if (item.id) {
	    	console.log(item);
			isAlreadyAdded = false;
	    	$.each($scope.formValues.procurement.request.counterpartyTypeFilters, function(k,v){
	    		if (v.id == item.id) {
	    			isAlreadyAdded = true;
	    		}
	    	})
	    	if (!isAlreadyAdded) {
	    		if (!$scope.formValues.procurement.request.counterpartyTypeFilters) {
	    			$scope.formValues.procurement.request.counterpartyTypeFilters = [];
	    		}
	    		$scope.formValues.procurement.request.counterpartyTypeFilters.push(item);
	    		return false;
	    	} else {
	    		toastr.error("Field is already added");
	    		return false;
	    	}
    	}
		return false;
    }

    $scope.addSellerRatingApplicabbleApp = function(newApp){
    	if (!$scope.formValues.applications || typeof($scope.formValues.applications) == 'undefined') {
    		$scope.formValues.applications = [];
    	}
    	isAlreadyAdded = false;
    	$.each($scope.formValues.applications, function(apk,apv){
    		if (apv.module.id == newApp.id) {
		    	isAlreadyAdded = true;
    		}
    	})
    	if (!isAlreadyAdded) {
    		newObj = {
                "module": {
                    "id": newApp.id,
                    "name": newApp.name
                }
            }
    		$scope.formValues.applications.push(newObj);
    	} else {
    		toastr.error(newApp.name + " app is already added")
    	}
    }


    $scope.setPageTitle = function(title){
        if(title){
            // var title = "Invoice - " + title;
            $rootScope.$broadcast('$changePageTitle', {
                title: title
            })
        }else{
            // debugger;
            var adminPageTitles = {};
            // User
            // Roles
            // Configuration
            // Seller Rating
            // Alerts
            adminPageTitles['users'] = 'User';
            adminPageTitles['role'] = 'Roles';
            adminPageTitles['sellerrating'] = 'Seller Rating';
            adminPageTitles['configuration'] = 'Configuration';
   
            if(adminPageTitles[$state.params.screen_id]){
                $state.params.title = adminPageTitles[$state.params.screen_id];
                $scope.setPageTitle($state.params.title);
            }
        }
    }
    $scope.throwToastrError = function(message) {
    	toastr.error(message);
    }



    $scope.$on('formValues', function(){
        console.log($scope.formValues);
        console.log($state);
        $scope.setPageTitle();
    });

}]);
