angular.module("shiptech").service("dataProcessors", ['$filtersData', '$state', '$rootScope', function($filtersData, $state, $rootScope) {
    function formatClcColumns(colmodel, CLC, tenantSettings) {
    	var filtersData = $filtersData
        $.each(colmodel, function(key, obj) {
            if (obj.cellFormat) {
                colmodel[key].formatter = CLC.get_formatter(obj.cellFormat);
            } else if (obj.formatter) {
                colmodel[key].cellFormat = obj.formatter;
                colmodel[key].formatter = CLC.get_formatter(obj.formatter);
            } else {
                obj.formatter = CLC.get_formatter('generalCell');
            }
            if (obj.widthOrg) {
                colmodel[key].width = obj.width;
            } else {
                if (
                    obj.name.indexOf("id") > -1 ||
                    obj.name.indexOf("Id") > -1 ||
                    obj.name.indexOf("No") > -1 ||
                    obj.name.indexOf("status") > -1 ||
                    obj.name.indexOf("Status") > -1 ||
                    obj.name == "createdOn" ||
                    obj.name == "lastModifiedOn" ||
                    obj.name == "activateOn" ||
                    obj.name == "deactivateOn" ||
                    obj.name == "validTo" ||
                    obj.name == "validFrom" ||
                    obj.name == "confirmedOn" ||
                    obj.name == "claimDate" ||
                    obj.name == "orderDate" ||
                    obj.name == "requestDate" ||
                    obj.name == "date" ||
                    obj.name == "quoteDate" ||
                    obj.name == "uploadedOn" ||
                    obj.name == "verifiedOn" ||
                    obj.name.indexOf("Date") > -1 ||
                    obj.name.indexOf("date") > -1 ||
                    obj.name.indexOf("amount") != -1 ||
                    obj.name.indexOf("Amount") != -1
                ) {
                    colmodel[key].width = 150;
                }
            	if (obj.editableFormatter == "date") {
                    colmodel[key].width = 185;
            	}
                if (obj.name.indexOf("name") > -1) {
                    colmodel[key].width = 300;
                }
                if (obj.name.indexOf("uom") > -1 || obj.name.indexOf("Uom") > -1 || obj.name.indexOf("amount") > -1 || obj.name.indexOf("price") > -1 || obj.name.indexOf("claimNo") > -1 || obj.name.indexOf("delivery") > -1 || obj.name.indexOf("Term") > -1 || obj.name.indexOf("Cost") > -1) {
                    colmodel[key].width = 110;
                }
                if (obj.name == "deliveryStatus.name") {
                    colmodel[key].width = 190;
                }
                if (obj.name == "order.name") {
                    colmodel[key].width = 200;
                }
                if (obj.name == "eta" || obj.name == "deliveryDate" || obj.name == "etb") {
                    colmodel[key].width = 180;
                }

                
                // best contract
                if(obj.name == "contractExpiryDate"){
                    colmodel[key].width = 250;
                }
                if(obj.name == "requestProductLocationName" ||  obj.name == "products" || obj.name == "locations"){
                    colmodel[key].width = 350;
                }
                if(obj.name == "requestProductName"){
                    colmodel[key].width = 400;
                }
                if(obj.name == "fixedPrice" || obj.name == "contractedQuantity" || obj.name == "availableQuantity"){
                    colmodel[key].width = 350;
                }
                if(obj.name == "priceType"){
                    colmodel[key].width = 250;
                }
                if(obj.name  == "product.name" && obj.formatter == "best_contract_is_match"){
                    colmodel[key].width = 500;
                }
            }


            if (obj.name == "uploadedOn" || obj.name == "verifiedOn" || obj.name == "createdOn" || obj.name == "modifiedOn" || obj.name == "lastModifiedOn" || obj.name == "deliveryLastModifiedOn" || obj.name == "activateOn" || obj.name == "deactivateOn" || obj.name == "validTo" || obj.name == "validFrom" || obj.name == "confirmedOn" || obj.name == "requestDate") {
                if (obj.name == "delayInDays" || obj.name.indexOf("delay") > -1) {
                } else {
                    colmodel[key].formatter = CLC.get_formatter("formatDate");
                }
            }

            if (obj.name.indexOf("status") > -1 || obj.name.indexOf("Status") > -1) {
            	console.log($state);


                if($state.current.name !== "default.dashboard-table"){ // keep formatter set in layout
                    colmodel[key].formatter = CLC.get_formatter("formatStatus");
	            }

            }
            if (obj.name == "claimDate" || obj.name == "orderDate" || /*obj.name == "requestDate" ||*/ obj.name == "date" || obj.name == "quoteDate" || obj.name == "validTo" || obj.name == "validFrom" || (obj.name.indexOf("Date") > -1) || (obj.name.indexOf("date") > -1) || obj.name == "voyageDetail.deliveryTo" || obj.name == "voyageDetail.deliveryFrom") {
                if (obj.name == "delayInDays" || obj.name.indexOf("delay") > -1) {
                } else {
                    if (obj.label == "Date (UTC)" || obj.label == "Due Date" || obj.label == "Working Due Date" || obj.label == "Seller Due Date" || obj.label == "Order Date" || obj.name == "voyageDetail.deliveryTo" || obj.name == "voyageDetail.deliveryFrom") {
                        colmodel[key].formatter = CLC.get_formatter("formatDateUtc");
                    } else if(obj.name == 'requestDate') {
	                    colmodel[key].formatter = CLC.get_formatter("formatDate");
                    } else {
                        colmodel[key].formatter = CLC.get_formatter("formatOnlyDate");
                    }
                }
            }
            // if (obj.name.toLowerCase().indexOf("amount") != -1) {
            //     colmodel[key].formatter = CLC.get_formatter("numberText");
            // }
            // if (obj.name.toLowerCase().indexOf("amount") != -1) {
            //     colmodel[key].formatter = CLC.get_formatter("amount");
            // }
            // if (obj.name.toLowerCase().indexOf("price") != -1) {
            //     colmodel[key].formatter = CLC.get_formatter("price");
            // }
            // if (obj.name.toLowerCase().indexOf("quantity") != -1 || obj.name.toLowerCase().indexOf("qty") != -1) {
            //     colmodel[key].formatter = CLC.get_formatter("quantity");
            // }  
            if (obj.name == "recentEta" || obj.name == "etd" || obj.name == "eta" || obj.name == "deliveryDate" || obj.name == "etb" || obj.name == "bunkeringEta" || obj.name == "orderEta" || obj.name.indexOf(".eta") != -1) {
                if (colmodel[key].formatter) {
                    if (colmodel[key].formatter.name != "formatOnlyDate") {
                        colmodel[key].formatter = CLC.get_formatter("formatDateUtc");
                    }
                } else {
                  colmodel[key].formatter = CLC.get_formatter("formatDateUtc");
                }
            }
            if (obj.name == "lastEmailSentDate") {
                  colmodel[key].formatter = CLC.get_formatter("formatDate");
            }
            // if(obj.name =="sumOfCosts"){
            //     colmodel[key].formatter = CLC.get_formatter("generalCellAllowZero");
            // }
            if (obj.editableFormatter) {
                colmodel[key].formatter = CLC.editable_formatter(obj.editableFormatter, obj.name);
                // return "<span>editable formatter "+obj.editableFormatter+"<span>"
            }
            /* customizations - columns that don't fit with according to their name */
            if (obj.name == "id") {
                // debugger;
                if (obj.editableFormatter == "sap_download_link") {
                    return;
                }
                colmodel[key].formatter = CLC.get_formatter("edit_link");
            }
            if (obj.name == "delivery.id") {
                colmodel[key].formatter = CLC.get_formatter("edit_delivery_link");
            }
            if (obj.name == "requestNo") {
                colmodel[key].formatter = CLC.get_formatter("edit_request_link_from_delivery");
            }
            if(obj.name == "notes" && obj.label == "Add/View Notes"){
                colmodel[key].formatter = CLC.get_formatter("documents_notes_modal");
            }
            if(CLC.screen_id == "contract"){
                if(obj.name == "isVerified"){
                    colmodel[key].formatter = CLC.get_formatter("yes_no");
                }
            }

            // to be moved in the screen layout (screen id: 113)
            if(CLC.screen_id == "treasuryreport"){
                if(obj.name == "accountancyDate"){
                    colmodel[key].edit_required = "false";
                }
            }
      
            /* Label Changes based on tenant configuration */
            if(obj.label.toLowerCase().indexOf('company') >= 0) {
                if (typeof tenantSettings.companyDisplayName != 'undefined'){
                    if(obj.label.indexOf('Company') >= 0) colmodel[key]['label'] = obj.label.replace('Company',tenantSettings.companyDisplayName.name);
                    if(obj.label.indexOf('company') >= 0) colmodel[key]['label'] = obj.label.replace('company',tenantSettings.companyDisplayName.name.toLowerCase());
                }
            }
            /* End Label Changes */

            /**********
            Change formatters for quantity price and amount based on BE columnType 
            ***********/
        	if ($state.current.url.indexOf(":screen_id") > -1) {
                currentList = $state.current.url.replace(":screen_id", $state.params.screen_id).replace("/", "");
            } else {
                currentList = $state.current.url.replace("/", "");
            }

            if ($rootScope.isModal) {
                list = currentList.split("/")[0];
                currentList = list + "/" + $rootScope.modalTableId;
            }
            // console.log(modalTableId)
            if ($state.current.name == "default.home") {
                currentList = "schedule-dashboard-calendar";
            }
            if (currentList == "contract-planning/") currentList = "contract-planning";
            if (currentList.indexOf("contract-planning") >= 0) currentList = "contract-planning";
            if (currentList.indexOf(":entity_id") > -1) {
                currentList = currentList.replace("/:entity_id", "");
            }
    
            currentColumns = [];
            conditions = filtersData.filterConditions;
            $.each(filtersData.filterColumns, function(key, value) {
                if (value.columnRoute == currentList) {
                    currentColumns.push(value);
                }
            });
            $rootScope.currentColumnRoute = currentList;
            $.each(currentColumns, function(cck,ccv){
            	ccvColumnValue = angular.copy(ccv.columnValue);
            	ccvColumnValue = ccvColumnValue.replace(/_/g, '.');
            	if (ccvColumnValue.toLowerCase() == obj.name.toLowerCase()) {
            		if (ccv.columnType.toLowerCase() == "quantity" ||
            			ccv.columnType.toLowerCase() == "price" ||
            			ccv.columnType.toLowerCase() == "amount") {
            			if (ccv.columnRoute != 'contract-planning' && ccv.columnValue != "MaxQuantity" && ccv.columnRoute != "edit-request/:requestId") {
		            		colmodel[key].formatter = CLC.get_formatter(ccv.columnType.toLowerCase());
            			}
            		}
            	}
            })
            /**********
            End Change formatters for quantity price and amount based on BE columnType 
            ***********/


            obj.sortable = false;
        });
        return colmodel;
    }
    function normalizeTableData(tableData) {
        var result = [],
            resultRow,
            voyageStop,
            dataRow;
        for (var i = 0; i < tableData.length; i++) {
            dataRow = tableData[i];
            for (var j = 0; j < dataRow.voyageDetail.length; j++) {
                voyageStop = dataRow.voyageDetail[j];
                if (voyageStop.request) {
                    for (var k = 0; k < voyageStop.request.requestDetail.length; k++) {
                        requestDetail = voyageStop.request.requestDetail[k];
                        resultRow = {};
                        if (voyageStop.request.id != 0) {
                            // resultRow.buttonStyle = getButtonStyle(voyageStop.request.requestStatus);
                            resultRow.status = voyageStop.request.requestStatusDisplayName ? voyageStop.request.requestStatusDisplayName : voyageStop.request.requestStatus;
                        } else {
                            // resultRow.buttonStyle = getButtonStyle(voyageStop.portStatus);
                            resultRow.status = voyageStop.portStatusDisplayName ? voyageStop.portStatusDisplayName : voyageStop.portStatus;
                        }
                        resultRow.id = voyageStop.request.requestName;
                        resultRow.reqId = voyageStop.request.requestName;
                        resultRow.service = dataRow.serviceName;
                        resultRow.vessel = dataRow.vesselName;

                        resultRow.requestProduct = requestDetail.fuelOilOfRequest;
                        if(requestDetail.fuelOilOfRequestType != null){
                            resultRow.requestProductType = requestDetail.fuelOilOfRequestType.name;
                        }else{
                            resultRow.requestProductType = null;
                        }

                        resultRow.voyageCode = voyageStop.vesselVoyageCode;
                        resultRow.location = voyageStop.locationName;
                        resultRow.eta = voyageStop.eta;
                        resultRow.buyer = dataRow.buyerName;
                        resultRow.companyName = dataRow.companyName;
                        resultRow.agreement = requestDetail.agreementType;
                        resultRow.minMaxQuantity = requestDetail.fuelMinQuantity + "-" + requestDetail.fuelMaxQuantity;
                        resultRow.comments = null;
                        resultRow.requestId = voyageStop.request.id;
                        resultRow.requestGroupId = voyageStop.request.requestGroupId;
                        resultRow.defaultFuel = dataRow.defaultFuel;
                        resultRow.defaultDistillate = dataRow.defaultDistillate;
                        resultRow.defaultLsfo = dataRow.defaultLsfo;
                        resultRow.vesselVoyageId = voyageStop.id;
                        if (requestDetail.contractMinQuantity == null || requestDetail.contractMaxQuantity == null) {
                            resultRow.contractMinMaxQuantity = '-'
                        }
                        resultRow.contractMinQuantity = requestDetail.contractMinQuantity;
                        resultRow.contractMaxQuantity = requestDetail.contractMaxQuantity;
                        result.push(resultRow);
                    }
                }
            }
        }
        console.log(result)
        return result;
    }


    return {
        formatClcColumns: formatClcColumns,
        normalizeTableData: normalizeTableData
    };
}]);
