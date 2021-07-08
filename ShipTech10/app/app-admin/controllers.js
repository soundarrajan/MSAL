/**
 * Admin Controller
 */
APP_ADMIN.controller('Controller_Admin', [ '$rootScope', '$scope', '$Api_Service', '$listsCache', 'Factory_Admin', '$state', '$location', 'Factory_Master', 'screenLoader', '$timeout', function($rootScope, $scope, $Api_Service, $listsCache, Factory_Admin, $state, $location, Factory_Master, screenLoader, $timeout) {
    let vm = this;
    vm.admin_id = $state.params.admin_id;
    vm.reset_data = {};
    $scope.tabData = {};
    $scope.listsCache = $listsCache;
    $scope.deliveryPrecedenceRules = [];
    $scope.redirectAuthUser = function() {
        window.location.hash = '#';
    };
    if ($scope.screen) {
        vm.screen_id = $scope.screen;
    } else {
        vm.screen_id = $state.params.screen_id;
    }
    vm.entity_id = $state.params.entity_id;

    if ($state.params.path) {
        vm.app_id = $state.params.path[0].uisref.split('.')[0];
    }
    vm.treant = [ {
        Name: 'Company1',
        slug: 'company001',
        Managers: [ {
            Name: 'Manager11',
            slug: 'manager001',
            Users: [ {
                Name: 'user10',
                slug: 'user001'
            }, {
                Name: 'user11',
                slug: 'user001'
            } ]
        }, {
            Name: 'Manager12',
            slug: 'manager0012',
            Users: [ {
                Name: 'user121',
                slug: 'user001'
            }, {
                Name: 'user122',
                slug: 'user0012'
            }, {
                Name: 'user123',
                slug: 'user0013'
            } ]
        } ]
    } ];
    let simple_chart_config = {
        chart: {
            container: '#tree-simple',
            connectors: {
                type: 'step'
            },
            node: {
                HTMLclass: 'nodeExample'
            }
        },
        nodeStructure: {
            text: {
                name: vm.treant[0].Name
            },
            children: []
        }
    };
    $.each(vm.treant[0].Managers, (key, value) => {
        let managersToAdd = {
            text: {
                name: ''
            },
            children: [],
            HTMLid: ''
        };
        simple_chart_config.nodeStructure.children.push(managersToAdd);
        simple_chart_config.nodeStructure.children[key].text.name = vm.treant[0].Managers[key].Name;
        simple_chart_config.nodeStructure.children[key].HTMLid = vm.treant[0].Managers[key].Name;
    });
    $.each(vm.treant[0].Managers, (key, value) => {
        $.each(vm.treant[0].Managers[key].Users, (i, e) => {
            let usersToAdd = {
                text: {
                    name: '',
                },
                HTMLid: ''
            };
            simple_chart_config.nodeStructure.children[key].children.push(usersToAdd);
            simple_chart_config.nodeStructure.children[key].children[i].text.name = vm.treant[0].Managers[key].Users[i].Name;
            simple_chart_config.nodeStructure.children[key].children[i].HTMLid = vm.treant[0].Managers[key].Name;
        });
    });
    if ($state.current.params.path[0].uisref == 'admin.org_chart') {
        new Treant(simple_chart_config);
    }
    $('.nodeExample p').each(function(j, f) {
        if ($(this).html() === vm.admin_id) {
            $(this).parent().addClass('orange-color');
        }
    });
    let managerToColor = $('.orange-color').attr('id');
    let managerToColorID = `*[id*=${ managerToColor }]`;
    $(managerToColorID).each(function() {
        if ($(this).children().html() === managerToColor) {
            $(this).addClass('orange-color');
        }
    });
    vm.reset_Password = function() {
        vm.reset_data = angular.toJson(vm.reset_data);
        Factory_Admin.reset_Password(vm.admin_id, vm.reset_data, (callback, response) => {
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
                // throw new Error('test');
            } else {
                toastr.error('Error occured');
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
            }, 
            {
                id: 3,
                title: 'Order Import',
                slug: 'order-import',
                icon: 'fa fa-folder icon-lg',
                nodes: 1
            },{
                id: 3,
                title: 'Seller Rating',
                slug: 'sellerrating/edit/',
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
        $location.path(`/admin/${ id}`);
        $scope.admin_screen_name = name;
    };
    $scope.entities = [ {
        name: 'Vessel Access',
        id: 'vessel_access'
    }, {
        name: 'Buyer Access',
        id: 'buyer_access'
    }, {
        name: 'Company Access',
        id: 'company_access'
    } ];

    // console.log($scope)
    $scope.triggerChangeFieldsAppSpecific = function(name, id) {
        if (vm.screen_id == 'sellerrating') {
            if (name == 'company') {
                Factory_Master.get_master_entity($scope.formValues.company.id, vm.screen_id, vm.app_id, (response) => {
                    let newValues = response;
                    $scope.formValues.applications = newValues.applications;
                    $scope.formValues.id = newValues.id;
                    setTimeout(() => {
                        $scope.initMultiTags('applications');
                    }, 500);
                });
            }
        }
    };
    $scope.createRange = function(min, max) {
        min = parseInt(min);
        max = parseInt(max);
        var input = [];
        for (let i = min; i <= max; i++) {
            input.push(i);
        }
        return input;
    };
    $scope.generateTemplate = function(obj, timezone) {
        console.log(obj);
        Factory_Master.generateTemplate({
            Payload: {
                Application: {
                    Id: obj.Module.application.id,
                    Name: obj.Module.application.name
                },
                Screen: {
                    Id: obj.Screen.id,
                    Name: obj.Screen.name
                },
                timeZone: timezone
            }
        }, (file, mime) => {
            if (file.data) {
                let blob = new Blob([ file.data ], {
                    type: mime
                });
                let a = document.createElement('a');
                a.style = 'display: none';
                document.body.appendChild(a);
                // Create a DOMString representing the blob and point the link element towards it
                let url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = `${obj.Module.application.name }_${ obj.Screen.name}`;
                // programatically click the link to trigger the download
                a.click();
                // release the reference to the file by revoking the Object URL
                window.URL.revokeObjectURL(url);
            }
        });
    };
    $scope.downloadFTP = function(obj) {
        console.log(obj);
        // console.log(timezone);
        console.log(jstz().timezone_name);
        if (obj.DateFrom == 'undefined') {
            obj.DateFrom = 'null';
        }
        if (obj.DateTo == 'undefined') {
            obj.DateTo = 'null';
        }
        Factory_Master.downloadFTP({
            Payload: {
                Application: obj.Module.application,
                Screen: obj.Screen,
                TimeZone: jstz().timezone_name,
                DateFrom: obj.DateFrom,
                DateTo: obj.DateTo,
                Status: obj.TransactionStatus,
                Columns: null,
                ExportType: 1,
                Order: null,
                Filters: [],
                Pagination: {
                    Skip: 0,
                    Take: null
                },
                SearchText: null,
                PageFilters: null
            }
        }, (file, mime) => {
            if (file.data && file.status == 200) {
                console.log(file);
                let blob = new Blob([ file.data ], {
                    type: mime
                });
                let a = document.createElement('a');
                a.style = 'display: none';
                document.body.appendChild(a);
                // Create a DOMString representing the blob and point the link element towards it
                let url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = `${obj.Module.application.name }_${ obj.Screen.name}`;
                // programatically click the link to trigger the download
                a.click();
                // release the reference to the file by revoking the Object URL
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
        let weight = 0;
        $.each($scope.formValues.applications[applicationIdx].categories[categoryIdx].details, (key, value) => {
            var currentVal = value.weight;
            if (typeof value.weight == 'NaN' || typeof value.weight == 'undefined' || value.weight == null) {
                currentVal = 0;
            }
            weight = weight + parseFloat(currentVal);
        });
        $scope.formValues.applications[applicationIdx].categories[categoryIdx].weight = weight;
        $scope.totalWeightageCalc();
    };

    $scope.totalWeightageCalc = function() {
        var totalWeightage = 0;
        $.each($scope.formValues.applications, (key, value) => {
            $.each(value.categories, (key1, value1) => {
                $.each(value1.details, (key2, value2) => {
                    var currentVal = value2.weight;
                    if (typeof value2.weight == 'NaN' || typeof value2.weight == 'undefined' || value2.weight == null) {
                        currentVal = 0;
                    }
                    totalWeightage = totalWeightage + parseFloat(currentVal);
                });
            });
        });
        $scope.totalWeightage = totalWeightage;
    };

    $scope.updateWeightSumSpecificLocations = function(applicationIdx, locationIdx, categoryIdx) {
        let weight = 0;
        $.each($scope.formValues.applications[applicationIdx].specificLocations[locationIdx].categories[categoryIdx].details, (key, value) => {
            var currentVal = value.weight;
            if (typeof value.weight == 'NaN' || typeof value.weight == 'undefined' || value.weight == null) {
                currentVal = 0;
            }
            if (value.ratingRequired && !value.isDeleted) {
                weight = weight + parseFloat(currentVal);
            }
        });
        $scope.formValues.applications[applicationIdx].specificLocations[locationIdx].categories[categoryIdx].weight = weight;
        $scope.formValues.applications[applicationIdx].specificLocations[locationIdx].categories = _.filter( $scope.formValues.applications[applicationIdx].specificLocations[locationIdx].categories, function(object) {
            return object.details.length;
        });
        $scope.totalWeightageCalcSpecificLocations($scope.formValues.applications[applicationIdx].specificLocations[locationIdx]);
    };


    $scope.totalWeightageCalcSpecificLocations = function(specificLocation) {
        var totalWeightage = 0;
        $.each(specificLocation.categories, (key, value) => {
            if (value.weight && !value.isDeleted) {
                totalWeightage += parseFloat(value.weight);
            }
        });
        specificLocation.totalWeightage = totalWeightage;
    };

    $scope.updateWeightSumAllLocations = function(applicationIdx, categoryIdx) {
        let weight = 0;
        $.each($scope.formValues.applications[applicationIdx].allLocations.categories[categoryIdx].details, (key, value) => {
            var currentVal = value.weight;
            if (typeof value.weight == 'NaN' || typeof value.weight == 'undefined' || value.weight == null) {
                currentVal = 0;
            }
            if (value.ratingRequired && !value.isDeleted) {
                weight = weight + parseFloat(currentVal);
            }
        });
        $scope.formValues.applications[applicationIdx].allLocations.categories[categoryIdx].weight = weight;
        $scope.formValues.applications[applicationIdx].allLocations.categories = _.filter($scope.formValues.applications[applicationIdx].allLocations.categories, function(object) {
            return object.details.length;
        });
        $scope.totalWeightageCalcAllLocations($scope.formValues.applications[applicationIdx].allLocations);
    };

    $scope.totalWeightageCalcAllLocations = function(allLocations, categoryIdx) {
        var totalWeightage = 0;
        $.each(allLocations.categories, (key, value) => {
            if (value.weight && !value.isDeleted) {
                totalWeightage += parseFloat(value.weight);
            }
        });
        allLocations.totalWeightage = totalWeightage;
    };

    $scope.deleteCategory = function(category) {
        category.isDeleted = true;
        for (let i = 0; i < category.details.length; i++) {
            category.details[i].isDeleted = true;
        }
    }

    $scope.deleteLocationFromAdminSellerRating = function(location) {
        location.isDeleted = true;
        for (let i = 0; i < location.categories.length; i++) {
            $scope.deleteCategory(location.categories[i]);
        }
    }

    $scope.deleteModule = function(applicationModule) {
        applicationModule.isDeleted = true;
        $scope.deleteLocationFromAdminSellerRating(applicationModule.allLocations);
        for (let i = 0; i < applicationModule.specificLocations.length; i++) {
            $scope.deleteLocationFromAdminSellerRating(applicationModule.specificLocations[i]);
        }
    }

    /* ADmin precedence rules*/
    $scope.initAdminPrecedenceRules = function() {
        if (typeof $scope.formValues.temp == 'undefined') {
            $scope.formValues.temp = {};
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
            }, {
                name: 'sellerPrecedenceLogicRules',
                tempMapping: 'sellerPrecedence',
                valueName: 'sellerOrd_',
                dataName: 'seller-ord-'
            }, {
                name: 'finalQtyPrecedenceLogicRules',
                tempMapping: 'finalQtyPrecedence',
                valueName: 'finalOrd_',
                dataName: 'finalQty-ord-'
            }
        ];


        $.each($scope.deliveryPrecedenceRules, (_, rule) => {
            if (typeof $scope.formValues.temp[rule.tempMapping] == 'undefined') {
                $scope.formValues.temp[rule.tempMapping] = {};
            }
            $.each($scope.formValues.delivery[rule.name], (key, value) => {
                $scope.formValues.temp[rule.tempMapping][rule.valueName + value.ord] = value.precedenceRule;
            });
        });

        console.log($scope.formValues);
        // $.each($scope.formValues.delivery.sellerPrecedenceLogicRules, function(key, value) {
        //     $scope.formValues.temp.sellerPrecedence['sellerOrd_' + value.ord] = value.precedenceRule;
        // })
        // $.each($scope.formValues.delivery.finalQtyPrecedenceLogicRules, function(key, value) {
        //     $scope.formValues.temp.finalQtyPrecedence['finalOrd_' + value.ord] = value.finalQtyPick;
        // })
       
        $.each($scope.deliveryPrecedenceRules, (_, rule) => {
            let selects = $(`.admin-precedence-select[name^=${ rule.dataName }]`);
            $.each(selects, function() {
                var dataOrd = $(this).attr('data-ord');
                var item = $(this);
                for (let k1 in $scope.formValues.temp[rule.tempMapping]) {
                    var objIdx = k1.split('_')[1];
                    if (objIdx < dataOrd) {
                        var alreadySelected = $scope.formValues.temp[rule.tempMapping][k1].id;
                        let selectOptions = item.children('option');
                        $.each(selectOptions, (k2, v2) => {
                            if ($(v2).attr('value') == alreadySelected) {
                                $(v2).attr('disabled', true);
                            }
                        });
                    }
                }
            });
        });
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
    };


    $scope.precedenceRuleChanged = function(ruleType, changedIdx) {
        if(typeof $scope.formValues.temp.buyerPrecedence.buyerOrd_6 != 'undefined') {
            delete $scope.formValues.temp.buyerPrecedence.buyerOrd_6;
        }
        if(typeof $scope.formValues.temp.sellerPrecedence.sellerOrd_6 != 'undefined') {
            delete $scope.formValues.temp.sellerPrecedence.sellerOrd_6;
        }
        for (var k1 in $scope.formValues.temp[`${ruleType }Precedence`]) {
            var objIdx = k1.split('_')[1];
            if (objIdx > changedIdx) {
                $scope.formValues.temp[`${ruleType }Precedence`][k1] = null;
            }
        }
        var entitySelects = $(`.admin-precedence-select[name^=${ ruleType }-ord-]`);
        $.each(entitySelects, function(key, value) {
            var dataOrd = $(this).attr('data-ord');
            var entityItem = $(this);
            entityItem.children('option').removeAttr('disabled');
            for (let k2 in $scope.formValues.temp[`${ruleType }Precedence`]) {
                var objIdx = k1.split('_')[1];
                if (objIdx < dataOrd) {
                    if($scope.formValues.temp[`${ruleType }Precedence`][k2]) {
                        var alreadySelected = $scope.formValues.temp[`${ruleType }Precedence`][k2].id;
                        var selectOptions = entityItem.children('option');
                        $.each(selectOptions, (k3, v2) => {
                            if ($(v2).attr('value') == alreadySelected) {
                                $(v2).attr('disabled', true);
                            }
                        });
                    }
                }
            }
        });

        let currentChange = `${ruleType }Precedence`;
        $.each($scope.deliveryPrecedenceRules, (_, rule) => {
            // {
            //     name: 'buyerPrecedenceLogicRules',
            //     tempMapping: 'buyerPrecedence',
            //     valueName: 'buyerOrd_',
            //     dataName: 'buyer-ord-'
            // }

            if(rule.tempMapping == currentChange) {
                $scope.formValues.delivery[rule.name] = [];
                $.each($scope.formValues.temp[rule.tempMapping], (key, val) => {
                    var ordIdx = key.split('_')[1];
                    var obj = {
                        ord: ordIdx,
                        id: ordIdx,
                        precedenceRule: val
                    };
                    $scope.formValues.delivery[rule.name].push(obj);
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
    };

    /* ADmin precedence rules*/
    $scope.uploadSchedulerConfiguration = function(name, dragFlag, obj, timezone, file) {
        let formData = new FormData();
        formData.append('request', `{"Payload": {"TimeZone":"${ timezone }","FirstDate":"${ obj.AddSchedule.FirstDate }","ExDate":"${ obj.AddSchedule.ExDate }","Time":"${ obj.AddSchedule.Time }","FTPFile": {"Transaction": {"Id":${ obj.Screen.id },"Name": "","Code": null,"CollectionName": null}}, "SchedulerInterval":{"Id":${ obj.AddSchedule.Interval.id },"Name": null, "Code": null,"CollectionName": null}}}`);
        if (file) {
            formData.append('file', file);
        } else if ($('#FTPFileUpload')[0].files) {
            $.each($('#FTPFileUpload')[0].files, (i, file2) => {
                formData.append('file', file2);
            });
        }
        Factory_Master.uploadSchedulerConfiguration(formData, (callback) => {
            if (callback && callback.status == 200) {
                toastr.success('File uploaded successfully.');
                $('table.ui-jqgrid-btable').trigger('reloadGrid');
                $scope.formValues.FTP.Upload = {};
                $('#FTPFileUpload')[0].files = [];
            } else {
                toastr.error(callback.data.ErrorMessage);
            }
        });
    };

    $scope.uploadFTPFile = function(name, obj, file) {
        let formData = new FormData();
        formData.append('request', `{"Payload": {"FTPFile": {"Transaction": {"Id":${ obj.Screen.id },"Name": "","Code": null,"CollectionName": null}}}}`);
        if (file) {
            formData.append('file', file);
        } else if ($('#FTPFileUpload')[0].files) {
            $.each($('#FTPFileUpload')[0].files, (i, file2) => {
                formData.append('file', file2);
            });
        }
        Factory_Master.uploadFTPFile(formData, (callback) => {
            if (callback && callback.status == 200) {
                delete $scope.uploadedFileName;
                toastr.success('File uploaded successfully.');
                $('table.ui-jqgrid-btable').trigger('reloadGrid');
                $scope.formValues.FTP.Upload = {};
                $('#FTPFileUpload').val('');
            } else {
                toastr.error(callback.data.ErrorMessage);
                delete $scope.uploadedFileName;
                $scope.formValues.FTP.Upload = {};
                $('#FTPFileUpload').val('');
            }
        });
    };

    $scope.addedFTPFile = function(flag, file) {
        if (flag == 'drop') {
            $scope.uploadedFileName = file.name;
        }
        if (flag == 'click') {
            $scope.uploadedFileName = $('#FTPFileUpload')[0].files[0].name;
        }
    };

    $scope.setFTPDatepickers = function() {
        // init datepickers
        setTimeout(() => {
            $('#firstDateDP').not('.disabled').datepicker({
                autoclose: true,
                format: 'yyyy-mm-ddT12:00:00Z'
            });
            $('#exDateDP').not('.disabled').datepicker({
                autoclose: true,
                format: 'yyyy-mm-ddT12:00:00Z'
            });
            $('#timeDP').not('.disabled').datetimepicker({
                showMeridian: 'false',
                autoclose: true,
                format: 'HH:mm:ss',
                pickDate: false
            });
        }, 10);
        // FTP datepickers constraints
        setTimeout(() => {
            $('#exDateDP').datepicker('setStartDate', new Date());
            $('#firstDateDP').datepicker('setStartDate', new Date());
        }, 20);
    };
    $scope.firstDateChange = function() {
        let firstDate = $scope.formValues.FTP.Upload.AddSchedule.FirstDate;
        $('#exDateDP').datepicker('setStartDate', new Date(firstDate));
        $scope.formValues.FTP.Upload.AddSchedule.ExDate = firstDate;
    };
    $scope.enableDateTo = function() {
        let dateFrom = $scope.formValues.FTP.Download.DateFrom;
        setTimeout(() => {
            $('#dateTo').datetimepicker('setStartDate', new Date(dateFrom));
        }, 20);
    };
    $scope.getTabData = function() {
        console.log($scope.formValues);
        $scope.checkData = {
            vessel_access: 'accessVessels',
            buyer_access: 'accessBuyers',
            company_access: 'accessCompanies'
        };
        $scope.tabInitalData = {
            vessel_access: 'accessVessels',
            buyer_access: 'accessBuyers',
            company_access: 'accessCompanies'
        }
        if (!$scope.delayAccessRendering) {
            $scope.delayAccessRendering = [];
        }
        $rootScope.listOfVesselTypes = [];
        $.each($scope.entities, (key, val) => {
            Factory_Admin.getTabData(val.id, (response) => {
                if (response) {
                    if (val.id == 'vessel_access') {
                        if (response.payload.length == 1) {
                            $scope.tabData[val.id] = $scope.buildTree(response.payload[0].children, $scope.formValues.accessVessels);
                            $scope.checkData[val.id] = false;
                            $scope.tabData['buyer_access'] = $scope.buildTree($scope.tabInitalData['buyer_access'], $scope.formValues.accessBuyers);
                            $scope.tabData['company_access'] = $scope.buildTree($scope.tabInitalData['company_access'], $scope.formValues.accessCompanies);
                            
                            $scope.delayAccessRendering[val.id] = 500;
                            $scope.delayAccessRendering['buyer_access'] = 100;
                            $scope.delayAccessRendering['company_access'] = 100;
                            
                            $scope.detectInitialAllSelected();
                        } else {
                            var aligendObject = $scope.setParentUnselectable(response.payload, $scope.formValues.accessVessels);
                            for (let i = 0; i < aligendObject.length; i++) {
                                let vesselType = {
                                    'id': aligendObject[i].id,
                                    'name': aligendObject[i].name
                                };
                                $rootScope.listOfVesselTypes.push(vesselType);
                            }
                            $scope.tabData[val.id] = aligendObject;
                            $scope.checkData[val.id] = false;
                            $scope.tabData['buyer_access'] = $scope.buildTree($scope.tabInitalData['buyer_access'], $scope.formValues.accessBuyers);
                            $scope.tabData['company_access'] = $scope.buildTree($scope.tabInitalData['company_access'], $scope.formValues.accessCompanies);
                            $scope.detectInitialAllSelected();
                        }
                    } else {
                        $scope.checkData[val.id] = false;
                        $scope.tabData[val.id] = response.payload
                        $scope.tabInitalData[val.id] = response.payload;
                        if (val.id == 'buyer_access') {
                            $scope.tabData[val.id] = $scope.buildTree($scope.tabInitalData[val.id], $scope.formValues.accessBuyers);
                        } else if (val.id == 'company_access') {
                            $scope.tabData[val.id] = $scope.buildTree($scope.tabInitalData[val.id], $scope.formValues.accessCompanies);
                        }
                        $scope.detectInitialAllSelected();
                    }
                }
            });
        });
    };

    $scope.getAgreementTypeIndividualList = function() {
        Factory_Admin.getAgreementTypeIndividualList(true, (response) => {
        	$scope.contractAgreementTypesList = response.payload.contractAgreementTypesList;
        	$scope.spotAgreementTypesList = response.payload.spotAgreementTypesList;
        });
    };

    $scope.findInObject = function(values, type) {
        $.each($scope.tabData[type], (ki, item) => {
            let findVal = _.find(values, function (object) {
                return object.id == item.id;
            })
            if (findVal) {
                $scope.tabData[type].isSelected = true;
            } else if (item.children) {
                findInObject(values, item.children);
            }
        });
    }

    $scope.$on('changedSelection', (evt, value) => {
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

    $scope.$watch('tabData', function(scope){
       $rootScope.tabData = $scope.tabData;
    }, true);



    $scope.setParentUnselectable = function(list, values) {
        list.forEach((obj) => {
            obj.unSelectable = true;
            obj.open = false;
            for (let i = 0; i < obj.children.length; i++) {
                let element = obj.children[i];
                let findElement = _.find(values, function(object) {
                    return object.id == element.id && object.name == element.name;
                });
                if (findElement) {
                    obj.children[i].isSelected = true;
                }
                setParent(obj, obj, obj.children[0].isSelected, obj);
            }

        });
        return list;
    };

    window.expandHierarchyChildren = function (e) {
        if ($(e).hasClass("collapsed")) {
            if ($scope.searched) {
                $(e).parent().next().find(".search-list").show();
            }
            $(e).parent().next().slideDown();
        } else {
            $(e).parent().next().find(".children").hide();
            $(e).parent().next().find(".expander i").addClass("collapsed");
            $(e).parent().next().slideUp();
        }
        $(e).toggleClass("collapsed");
    }

    $scope.searchHierarchy = function (val, type) {
        if (val == "" || val == undefined) {
            $scope.searched = false;
            $scope.search_terms = "";
            $scope.redrawTree(type);
        } else {
            $(".search-list-user_" + type).show();
            $.each($(".search-list-user_" + type), function (){
                if ($(this).text().toLowerCase().indexOf(val.toLowerCase()) != -1) {
                    $(this).show();
                    $(this).children(".children").show();
                    $(this).children(".expander").find("i").addClass("collapsed");
                }else {
                    $(this).children(".children").hide();
                    $(this).children(".expander").find("i").addClass("collapsed");
                    $(this).hide();
                }
            });0.
            $.each($(".search-list-user_" + type), function (){
                if ($(this).text().toLowerCase().indexOf(val.toLowerCase()) != -1) {
                    let elements = $(this).find(".children .search-list-user");
                    let hasHiddenAllChildren = true;
                    for (let i = 0; i < elements.length; i++) {
                        if (elements[i].style.display == "block" || !elements[i].style.display) {
                            hasHiddenAllChildren = false;
                        }
                    }
                    if (!hasHiddenAllChildren) {
                        $(this).children(".expander").find("i").removeClass("collapsed");
                    }
                }
            });
            $scope.noResultsFound = ($(".hierarchical-tree_" + type).text().toLowerCase().indexOf(val.toLowerCase()) == -1);
            $scope.searched = true;
        }
    }

    $scope.redrawTree = function (type) {
        $scope.noResultsFound = false;
        $(".not-first-level").hide();
        $(".search-list-user_" + type).show();
        $(".search-list-user_" + type).find(".expander i").addClass("collapsed");
    }

    function tree(object, detail, initial) {
        if (object.id == detail.id && object.name == detail.name) {
            object.isSelected = !object.isSelected;
            setChild(object, object.isSelected);
            if (object.parent) {
                setParent(initial, object.parent, object.isSelected, initial);
            } else {
                setParent(initial, initial, object.isSelected, initial);
            }
        }
        if (object.children && object.children.length) {
            for (var i = 0; i < object.children.length; i++) {
                if (object.children[i].id == detail.id && object.name == detail.name) {
                    setChild(object.children[i], object.children[i].isSelected);
                }
                tree(object.children[i], detail, initial);
            }
        }
        
    }

    function setChild(object, value) {
        if (object.children && object.children.length) {
            for (var i = 0; i < object.children.length; i++) {
                object.children[i].isSelected = value;    
                setChild(object.children[i], value);
            }
        }
    }

    function setParent(object, detail, value, initial) {
        if (object.id == detail.id && object.name == detail.name) {
            object.isSelected = value;
            let findElementUnselected = _.find(object.children, function(object) {
                return !object.isSelected;
            });
            if (!findElementUnselected) {
                object.isSelected = value;
            } else {
                object.isSelected = false;
            }
            if (object.parent) {
                setParent(initial, object.parent, object.isSelected, initial);
            }
        }
        if (object.children && object.children.length) {
            for (var i = 0; i < object.children.length; i++) {
                setParent(object.children[i], detail, value, initial);
            }
        }
    }


    function setAllChild(object, value) {
        if (object.children && object.children.length) {
            for (var i = 0; i < object.children.length; i++) {
                object.children[i].isSelected = value;    
                setAllChild(object.children[i], value);
            }
        }
    }

    $scope.selectAll = function(type, value) {
        _.forEach($scope.tabData[type], function(object) {
            object.isSelected = value;
            setAllChild(object, value);
        })
        console.log($scope.tabData[type]);
    }

    function detectAllSelected(object, checkData) {
        if (object.children && object.children.length) {
             for (var i = 0; i < object.children.length; i++) {
                if (!object.children[i].isSelected) {
                    checkData = false;
                    $scope.isAll = false;
                    return;
                }    
                detectAllSelected(object.children[i], checkData);
            }
        } else if (!object.isSelected) {
            checkData = false;
            $scope.isAll = false;
            return;
        }
    }

    $scope.detectInitialAllSelected = function() {
        var dataSrcs = {
            vessel_access: 'accessVessels',
            buyer_access: 'accessBuyers',
            company_access: 'accessCompanies'
        };
        var types = ['vessel_access', 'buyer_access', 'company_access'];
        _.forEach(types, function (type) {
            $scope.isAll = true;
            for (let i = 0; i < $scope.tabData[type].length; i++) {
                detectAllSelected($scope.tabData[type][i], $scope.checkData[type]);
            }
            $scope.checkData[type] = $scope.isAll ? true : false;
            $timeout( () => {
                $scope.delayAccessRendering[type] = $scope.tabData[type].length;
            },1000)
        });
    }
    window.change = function(event) {
        event.value = "off";
        var detail = JSON.parse($(event).attr("hierarchy-detail"));
        var type = $(event).attr("hierarchy-type");
        var dataSrcs = {
            vessel_access: 'accessVessels',
            buyer_access: 'accessBuyers',
            company_access: 'accessCompanies'
        };
        $scope.isAll = true;
        for (let i = 0; i < $scope.tabData[type].length; i++) {
            tree($scope.tabData[type][i], detail, $scope.tabData[type][i]);
            detectAllSelected($scope.tabData[type][i], $scope.checkData[type]);
        }
        $scope.checkData[type] = $scope.isAll ? true : false;
        $scope.$apply();
        console.log($scope.tabData[type]);
        
    }

    $scope.buildTree = function(list, values, idAttr, parentAttr, childrenAttr) {
        if (!idAttr) {
            idAttr = 'id';
        }
        if (!parentAttr) {
            parentAttr = 'parent';
        }
        if (!childrenAttr) {
            childrenAttr = 'children';
        }
        let treeList = [];
        let lookup = {};
        list.forEach((obj) => {
            let findElement = _.find(values, function(object) {
                return object.id == obj.id && object.name == obj.name;
            });
            if (findElement) {
                obj.isSelected = true;
            }
            lookup[obj[idAttr]] = obj;
            obj[childrenAttr] = [];
        });
        list.forEach((obj) => {
            if (obj[parentAttr] != null) {
                if (obj[parentAttr].id) {
                    lookup[obj[parentAttr].id][childrenAttr].push(obj);
                }
            } else {
                treeList.push(obj);
            }
        });
        return treeList;
    };
    $scope.changeScheduleStatusDisplayOrder = function(newVal, oldVal) {
        console.log($scope.formValues.schedule.labels);
        $.each($scope.formValues.schedule.labels, (key, val) => {
            if (val.tempDisplayOrder == val.displayOrder) {
                if (newVal > oldVal) {
                    if (val.displayOrder <= newVal && val.displayOrder > oldVal) {
                        val.displayOrder = val.displayOrder - 1;
                        val.tempDisplayOrder = val.tempDisplayOrder - 1;
                    }
                } else if (val.displayOrder >= newVal && val.displayOrder < oldVal) {
                    val.displayOrder = val.displayOrder + 1;
                    val.tempDisplayOrder = val.tempDisplayOrder + 1;
                }
            }
        });
        $.each($scope.formValues.schedule.labels, (key, val) => {
            if (val.tempDisplayOrder != val.displayOrder) {
                val.displayOrder = val.tempDisplayOrder;
            }
        });
    };
    $scope.initMinicolors = function() {
        setTimeout(() => {
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
            };
            $('input.minicolors-input').minicolors();
        });
    };


    $scope.getCounterpartyTypeFilterItems = function() {
    	var itemlist = [];
    	$.each($scope.listsCache.CounterpartyTypeFilter, (k, v) => {
    		itemlist.push(v);
    	});
    	return itemlist;
    };

    $scope.addCounterpartyTypeFilterItem = function(item) {
    	var returnVal = false;
    	if (item.id) {
	    	console.log(item);
            var isAlreadyAdded = false;
	    	$.each($scope.formValues.procurement.request.counterpartyTypeFilters, (k, v) => {
	    		if (v.id == item.id) {
	    			isAlreadyAdded = true;
	    		}
	    	});
	    	if (!isAlreadyAdded) {
	    		if (!$scope.formValues.procurement.request.counterpartyTypeFilters) {
	    			$scope.formValues.procurement.request.counterpartyTypeFilters = [];
	    		}
	    		$scope.formValues.procurement.request.counterpartyTypeFilters.push(item);
	    		returnVal = false;
	    	}
	    		toastr.error('Field is already added');
	    		returnVal = false;
    	}
        return returnVal;
    };

    $scope.addSellerRatingApplicabbleApp = function(newApp) {
    	if (!$scope.formValues.applications || typeof $scope.formValues.applications == 'undefined') {
    		$scope.formValues.applications = [];
    	}
    	var isAlreadyAdded = false;
    	$.each($scope.formValues.applications, (apk, apv) => {
    		if (apv.module.id == newApp.id) {
		    	isAlreadyAdded = true;
    		}
    	});
    	if (!isAlreadyAdded) {
    		var newObj = {
                module: {
                    id: newApp.id,
                    name: newApp.name
                }
            };
    		$scope.formValues.applications.push(newObj);
    	} else {
    		toastr.error(`${newApp.name } app is already added`);
    	}
    };

    $scope.addSellerRatingApplicabbleAppSpecificLocations = function(specificLocation, index) {
        if (!$scope.formValues.applications[index].specificLocations || typeof $scope.formValues.applications[index].specificLocations  == 'undefined') {
            $scope.formValues.applications[index].specificLocations  = [];
        }
        var isAlreadyAdded = false;
        $.each($scope.formValues.applications[index].specificLocations, (apk, apv) => {
            if (apv.location.id == specificLocation.id) {
                isAlreadyAdded = true;
            }
        });
        if (!isAlreadyAdded) {
            var newObj = {
                location: {
                    id: specificLocation.id,
                    name: specificLocation.name
                }
            };
            $scope.formValues.applications[index].specificLocations.push(newObj);
            $scope.CM.selectedLocation = $scope.formValues.applications[index].specificLocations.length - 1;
        } else {
            toastr.error(`${specificLocation.name } location is already added`);
        }
    };

    $scope.verifyRatingRequired = function(location) {
        if (location.categories) {
            for (let i = 0; i < location.categories.length; i++) {
                if (location.categories[i].details) {
                    for (let j = 0; j < location.categories[i].details.length ; j++) {
                        if (location.categories[i].details[j].ratingRequired) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;

    }



    $scope.setPageTitle = function(title) {
        if(title) {
            // var title = "Invoice - " + title;
            $rootScope.$broadcast('$changePageTitle', {
                title: title
            });
        }else{
            // debugger;
            let adminPageTitles = {};
            // User
            // Roles
            // Configuration
            // Seller Rating
            // Alerts
            adminPageTitles.users = 'User';
            adminPageTitles.role = 'Roles';
            adminPageTitles.sellerrating = 'Seller Rating';
            adminPageTitles.configuration = 'Configuration';

            if(adminPageTitles[$state.params.screen_id]) {
                $state.params.title = adminPageTitles[$state.params.screen_id];
                $scope.setPageTitle($state.params.title);
            }
        }
    };
    $scope.throwToastrError = function(message) {
    	toastr.error(message);
    };


    $scope.$on('formValues', () => {
        console.log($scope.formValues);
        console.log($state);
        $scope.setPageTitle();
    });

    $scope.showEmailLoader = function() {
    	if (typeof $scope.loadedEmail == 'undefined') {
	    	$('.screen-loader').show();
    	}
        setTimeout(() => {
            $scope.loadedEmail = true;
        }, 100);
        $timeout(() => {
            $('.screen-loader').hide();
        }, 300);
        return 4;
    };

    $scope.setQcTolleranceLimitUom = function() {
        if (typeof $scope.formValues.delivery != 'undefined') {
            if ($scope.formValues.delivery.qcMaxToleranceLimit == null && $scope.formValues.delivery.qcMinToleranceLimit == null) {
                $scope.formValues.delivery.qcToleranceLimitUom = null;
            }
        }
    };


    $scope.verifyAllLocation = function(category) {
        if (category.name != null && category.name != "") {
            return true;
        }
        if (category.details) {
            for (let i = 0; i < category.details.length; i++) {
                if ((category.details[i].name  != null   && category.details[i].name != "") ||  category.details[i].weight) {
                    return true;
                }
            }
        }
        return false;
    }

    $scope.getFirstIndex = function(specificLocations) {
        let findIndex = _.findIndex(specificLocations, function(obj) {
            return !obj.isDeleted;
        });
        if (findIndex != -1) {
            return findIndex;
        }
    }

    $scope.getFirstModule = function(modules) {
        let findIndex = _.findIndex(modules, function(obj) {
            return !obj.isDeleted;
        });
        if (findIndex != -1) {
            return findIndex;
        }
    }
} ]);
