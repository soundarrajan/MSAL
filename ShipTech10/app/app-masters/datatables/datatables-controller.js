/**
 * Labs Controller
 */
APP_MASTERS.controller('Controller_Datatables', [
    '$scope',
    '$rootScope',
    '$Api_Service',
    'Factory_Labs',
    '$state',
    '$location',
    '$q',
    '$compile',
    '$timeout',
    '$templateCache',
    'Factory_Master',
    '$tenantSettings',
    '$listsCache',
    '$filter',
    '$uibModal',
    function($scope, $rootScope, $Api_Service, Factory_Labs, $state, $location, $q, $compile, $timeout, $templateCache, Factory_Master, $tenantSettings, $listsCache, $filter, $uibModal) {
        let vm = this;
        if ($state.params.path) {
            vm.app_id = $state.params.path[0].uisref.split('.')[0];
        }
        if ($scope.screen) {
            vm.screen_id = $scope.screen;
        } else {
            vm.screen_id = $state.params.screen_id;
        }
        vm.amount = 3;
        vm.quantity = 3;
        vm.price = 3;
        if ($tenantSettings) {
            if ($tenantSettings.defaultValues) {
                vm.amount = $tenantSettings.defaultValues.amountPrecision;
                vm.quantity = $tenantSettings.defaultValues.quantityPrecision;
                vm.price = $tenantSettings.defaultValues.pricePrecision;
            }
        }
        $templateCache.put('ui-grid/uiGridViewport', '<div class="ui-grid-viewport" ng-style="colContainer.getViewportStyle()"><div class="ui-grid-canvas"><div ng-repeat="(rowRenderIDX, row) in rowContainer.renderedRows track by $index" ng-if="grid.appScope.showRow(row.entity, grid)" class="ui-grid-row" ng-init="rowRenderIndex = $index" ng-style="Viewport.rowStyle($index)"><div ui-grid-row="row" row-render-index="$index"></div></div></div></div>');
        // alert("dataTables - controller");
        $scope.gridScope = $scope;
        $scope.dataTableTemplates = {
            text: $templateCache.get('app-general-components/views/data-table-formatters/text.html'),
            textUOM: $templateCache.get('app-general-components/views/data-table-formatters/textUOM.html'),
            simpleTextUOM: $templateCache.get('app-general-components/views/data-table-formatters/simpleTextUOM.html'),
            date: $templateCache.get('app-general-components/views/data-table-formatters/date.html'),
            dateDisplay: $templateCache.get('app-general-components/views/data-table-formatters/dateDisplay.html'),
            lookup: $templateCache.get('app-general-components/views/data-table-formatters/lookup.html'),
            lookup_adminTemplates: $templateCache.get('app-general-components/views/data-table-formatters/lookup_adminTemplates.html'),
            dropdown: $templateCache.get('app-general-components/views/data-table-formatters/dropdown.html'),
            dropdownDisplayName: $templateCache.get('app-general-components/views/data-table-formatters/dropdownDisplayName.html'),
            multiDropdown: $templateCache.get('app-general-components/views/data-table-formatters/multiDropdown.html'),
            checkbox: $templateCache.get('app-general-components/views/data-table-formatters/checkbox.html'),
            link: $templateCache.get('app-general-components/views/data-table-formatters/link.html'),
            invoiceLink: $templateCache.get('app-general-components/views/data-table-formatters/invoiceLink.html'),
            passedFailed: $templateCache.get('app-general-components/views/data-table-formatters/passedFailed.html'),
            reconLabsPassedFailed: $templateCache.get('app-general-components/views/data-table-formatters/reconLabsPassedFailed.html'),
            yesNo: $templateCache.get('app-general-components/views/data-table-formatters/yesNo.html'),
            matchedUnmatched: $templateCache.get('app-general-components/views/data-table-formatters/matchedUnmatched.html'),
            customStatus: $templateCache.get('app-general-components/views/data-table-formatters/customStatus.html'),
            addRow: '<a ng-if="!$eval(col.colDef.Disabled)" id="{{ grid.element[0].id }}_addRow_{{ rowRenderIndex }}" class="st-btn-icon addData" ng-click="grid.appScope.addData(grid.options.data)"><i class="fa fa-plus"></i></a>',
            remRow: '<a id="{{ grid.element[0].id }}_remRow_{{ rowRenderIndex }}" class="st-btn-icon" ng-click="grid.appScope.remData(grid.options.data, row.entity, rowRenderIndex)"><i class="fa fa-minus"></i></a>',
            headerBlue: $templateCache.get('app-general-components/views/data-table-formatters/headerBlue.html'),
            headerWhite: $templateCache.get('app-general-components/views/data-table-formatters/headerWhite.html'),
            labsResultRecon: $templateCache.get('app-general-components/views/data-table-formatters/labsResultRecon.html'),
            labResultStatus: $templateCache.get('app-general-components/views/data-table-formatters/labResultStatus.html'),
            labReconStatus: $templateCache.get('app-general-components/views/data-table-formatters/labReconStatus.html'),
            modalSpecGroupEdit: $templateCache.get('app-general-components/views/modalSpecGroupEdit.html'),
            doubleRow: $templateCache.get('app-general-components/views/data-table-formatters/doubleRow.html'),
            invoiceCostTypeDropdown: $templateCache.get('app-general-components/views/data-table-formatters/invoiceCostTypeDropdown.html'),
            tenantFormattedText: $templateCache.get('app-general-components/views/data-table-formatters/tenantFormattedText.html'),
            textWithTooltip: $templateCache.get('app-general-components/views/data-table-formatters/textWithTooltip.html'),
            yesNoInverted: $templateCache.get('app-general-components/views/data-table-formatters/yesNoInverted.html'),
            claimsRaisedStatus: $templateCache.get('app-general-components/views/data-table-formatters/claimsRaisedStatus.html'),
            colorCodedStatus: $templateCache.get('app-general-components/views/data-table-formatters/colorCodedStatus.html'),
            multiSelectCell: $templateCache.get('app-general-components/views/data-table-formatters/multiSelectCell.html'),
            multiselect: $templateCache.get('app-general-components/views/data-table-formatters/multiselect.html'),
            readonlyNumber: $templateCache.get('app-general-components/views/data-table-formatters/readonlyNumber.html'),
            customRemRow: $templateCache.get('app-general-components/views/data-table-formatters/customRemRow.html'),
            decodeText: $templateCache.get('app-general-components/views/data-table-formatters/decodeText.html')

        };
        $scope.gridScope = $scope;
        $scope.initGridDropdowns = function(id) {
            $scope.alreadyDone = '';
            $.each($scope.gridOptions[id].columnDefs, (key, attrs) => {
                if (attrs.cellObject) {
                    if ($scope.alreadyDone != attrs.cellObject.Name) {
                        vm.getOptions(attrs.cellObject);
                        $scope.alreadyDone = attrs.cellObject.Name;
                    }
                }
            });
        };


        $scope.gridOptions = {
            invoiceClaimDetails: {
                data: 'formValues.invoiceClaimDetails',
                multiSelect: false,
                noUnselect: true,
                enableSorting: false,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: 'claim.id',
                        displayName: 'Claim ID'
                    },
                    {
                        name: 'delivery.id',
                        displayName: 'Delivery No'
                    },
                    {
                        name: 'product.name',
                        displayName: 'Product'
                    },
                    {
                        name: 'claimType.displayName',
                        displayName: 'Claim Type'
                    },
                    {
                        name: 'deliveryQuantity',
                        displayName: 'Delivery Quantity',
                        cellTemplate: $scope.dataTableTemplates.simpleTextUOM,
                        cellUomName: 'deliveryQuantityUom'
                    },
                    {
                        name: 'invoiceAmount',
                        displayName: 'Invoice Amount',
                        cellTemplate: $scope.dataTableTemplates.textUOM,
                        // cellUomName: "invoiceAmountCurrency",
                        cellObject: {
                            Name: 'invoiceAmountCurrency',
                            Type: 'dropdown',
                            masterSource: 'Currency',
                            UniqueId: 'invoiceAmountCurrency',
                            Disabled: 'grid.appScope.fVal().formValues.status.name == \'Approved\'',
                            UomDisabled: true,
                            changeEvent: 'computeTotalInvoiceAmountOnClaimAmountChange()'
                            // uomBindSource: "invoiceAmountCurrency"
                        }

                    },
                    {
                        name: 'orderCurrencyAmount',
                        displayName: 'Amount in order Currency',
                        cellTemplate: $scope.dataTableTemplates.simpleTextUOM,
                        cellUomName: 'orderCurrency'
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                    }, 10);
                }
            },
            invoiceRelatedInvoices: {
                data: 'formValues.relatedInvoices',
                multiSelect: false,
                noUnselect: true,
                enableSorting: false,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: 'id',
                        displayName: 'Invoice ID',
                        cellTemplate: $scope.dataTableTemplates.invoiceLink
                    },
                    {
                        name: 'invoiceType.name',
                        displayName: 'Invoice Type'
                    },
                    {
                        name: 'invoiceDate',
                        displayName: 'Invoice Date',
                        cellTemplate: $scope.dataTableTemplates.dateDisplay
                    },
                    {
                        name: 'invoiceAmount',
                        displayName: 'Invoice Amount',
                        cellFilter: `number:${ vm.amount}`
                    },
                    {
                        name: 'deductions',
                        displayName: 'Deductions',
                        cellFilter: `number:${ vm.amount}`
                    },
                    {
                        name: 'paidAmount',
                        displayName: 'Paid Amount',
                        cellFilter: `number:${ vm.amount}`
                    },
                    {
                        name: 'invoiceStatus.displayName',
                        displayName: 'Invoice Status',
                        cellTemplate: $scope.dataTableTemplates.customStatus
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                    }, 10);
                }
            },
            invoiceCostDetails: {
                data: 'formValues.costDetails',
                multiSelect: false,
                noUnselect: true,
                enableSorting: false,
                rowHeight: 40,
                excessRows: 999,
                enableHorizontalScrollbar: 1,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        minWidth: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow,
                        category: '1'
                    },
                    {
                        name: 'description',
                        displayName: 'Description',
                        width: 150,
                        cellTemplate: $scope.dataTableTemplates.text
                    },
                    {
                        name: 'costName.name',
                        displayName: 'Item',
                        minWidth: 150
                    },
                    {
                        name: 'costType',
                        displayName: 'Cost Type',
                        cellTemplate: $scope.dataTableTemplates.invoiceCostTypeDropdown,
                        minWidth: 150,
                        cellObject: {
	                        Required: true,
                            Name: 'CostType',
                            Type: 'dropdown',
                            dropdownSource: 'filterInvoiceCostTypeDropdown( grid.appScope.fVal().formValues.costDetails[grid.appScope.rowIdx(row)].costName )',
                            Action: 'CostType',
                            changeEvent: 'invoiceConvertUom(\'cost\', rowRenderIndex, grid.appScope.fVal().formValues, true)',
                            keyPressEvent: 'invoiceKeyPress(\'cost\')',
                            Disabled: 'grid.appScope.fVal().formValues.costDetails[grid.appScope.rowIdx(row)].orderAdditionalCostId || [\'Approved\', \'Cancelled\'].indexOf(grid.appScope.fVal().formValues.status.name) != -1'
                        }
                    },
                    {
                        name: 'product',
                        displayName: '% of',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        scopeMasterSource: 'applyFor',
                        minWidth: 150,
                        // Disabled: "['Approved', 'Cancelled'].indexOf(grid.appScope.fVal().status.name) != -1",
                        cellObject: {
	                        Name: 'applyFor',
                            Disabled: 'grid.appScope.fVal().formValues.costDetails[grid.appScope.rowIdx(row)].orderAdditionalCostId || grid.appScope.fVal().formValues.costDetails[grid.appScope.rowIdx(row)].isTaxComponent || [\'Approved\', \'Cancelled\'].indexOf(grid.appScope.fVal().formValues.status.name) != -1',
                            Required: 'grid.appScope.fVal().formValues.costDetails[grid.appScope.rowIdx(row)].costType.id > 1',
                            changeEvent: 'invoiceConvertUom(\'cost\', rowRenderIndex, grid.appScope.fVal().formValues, true)',
                            keyPressEvent: 'invoiceKeyPress(\'cost\')'
                        }
                    },
                    {
                        name: 'invoiceQuantity',
                        displayName: 'Inv. Qty.',
                        minWidth: 200,
                        format: vm.quantity,
                        cellTemplate: $scope.dataTableTemplates.textUOM,
                        cellObject: {
                            Name: 'invoiceQuantityUom',
                            masterSource: 'Uom',
                            UniqueId: 'invoiceQuantityUom',
                            // changeEvent: "invoiceConvertUom('cost', rowRenderIndex, grid.appScope.fVal().formValues)"
                            changeEvent: 'invoiceConvertUom(\'cost\', rowRenderIndex, grid.appScope.fVal().formValues, true)',
                            keyPressEvent: 'invoiceKeyPress(\'cost\')'

                        }
                    },
                    {
                        name: 'invoiceRate',
                        displayName: 'Inv. Rate',
                        minWidth: 250,
                        format: vm.amount,
                        cellTemplate: $scope.dataTableTemplates.textUOM,
                        cellObject: {
                            Name: 'invoiceRateCurrency',
                            masterSource: 'Currency',
                            UniqueId: 'invoiceRateCurrency',
                            UomDisabled: true,
                            FirstUomDisabled: 'grid.appScope.fVal().formValues.costDetails[grid.appScope.rowIdx(row)].costType.name != \'Unit\'',
                            hasUom: true,
                            additionalUomModel: 'invoiceRateUom',
                            changeEvent: 'invoiceConvertUom(\'cost\', rowRenderIndex, grid.appScope.fVal().formValues, true)',
                            keyPressEvent: 'invoiceKeyPress(\'cost\')'

                        }
                    },
                    {
                        name: 'invoiceAmount',
                        displayName: 'Amount',
                        cellTemplate: $scope.dataTableTemplates.textUOM,
                        cellUomName: 'invoiceRateCurrency',
                        minWidth: 150,
                        format: vm.amount,
                        cellObject: {
                            Name: 'invoiceRateCurrency',
                            masterSource: 'Currency',
                            UniqueId: 'invoiceRateCurrency',
                            UomDisabled: true,
                            Disabled: 'grid.appScope.fVal().formValues.costDetails[grid.appScope.rowIdx(row)].costType.name != \'Percent\'',
                            changeEvent: 'invoiceConvertUom(\'cost\', rowRenderIndex, grid.appScope.fVal().formValues)',
                            keyPressEvent: 'invoiceKeyPress(\'cost\')'

                        }
                    },
                    {
                        name: 'invoiceExtras',
                        displayName: 'Extra (%)',
                        minWidth: 100,
                        cellTemplate: $scope.dataTableTemplates.text,
                        ChangeAction: 'invoiceConvertUom(\'cost\', rowRenderIndex, grid.appScope.fVal().formValues)',
                        format: `number:${ vm.amount}`,
                        keyPressEvent: 'invoiceKeyPress(\'cost\')'
                    },
                    {
                        name: 'invoiceExtrasAmount',
                        displayName: 'Extra Amount',
                        minWidth: 100,
                        format: `number:${ vm.amount}`,
                        cellTemplate: $scope.dataTableTemplates.text,
                        readOnly: true
                    },
                    {
                        name: 'invoiceTotalAmount',
                        displayName: 'Total Amount',
                        cellTemplate: $scope.dataTableTemplates.text,
                        format: `number:${ vm.amount}`,
                        minWidth: 100,
                        readOnly: true
                    },
                    {
                        name: 'deliveryQuantity',
                        displayName: 'BDN Qty',
                        minWidth: 150,
                        format: vm.quantity,
                        cellTemplate: $scope.dataTableTemplates.simpleTextUOM,
                        cellUomName: 'deliveryQuantityUom',
                        headerCellTemplate: $scope.dataTableTemplates.headerBlue
                    },
                    {
                        name: 'estimatedRate',
                        displayName: 'Est. Rate',
                        minWidth: 150,
                        format: vm.amount,
                        cellTemplate: $scope.dataTableTemplates.simpleTextUOM,
                        cellUomName: 'invoiceRateCurrency',
                        cellSecondUomName: 'estimatedRateUom',
                        headerCellTemplate: $scope.dataTableTemplates.headerBlue,
                        cellObject: {
                            hasUom: true,
                            cellUomName: 'estimatedRateUom'
                        }
                    },
                    {
                        name: 'estimatedAmount',
                        displayName: 'Amount',
                        minWidth: 150,
                        format: vm.amount,
                        cellTemplate: $scope.dataTableTemplates.simpleTextUOM,
                        cellUomName: 'invoiceRateCurrency',
                        headerCellTemplate: $scope.dataTableTemplates.headerBlue
                    },
                    {
                        name: 'estimatedExtras',
                        displayName: 'Extra (%)',
                        minWidth: 150,
                        headerCellTemplate: $scope.dataTableTemplates.headerBlue,
                        cellFilter: 'number:3'
                    },
                    {
                        name: 'estimatedExtrasAmount',
                        displayName: 'Extra Amount',
                        minWidth: 100,
                        cellFilter: `number:${vm.amount}`
                    },
                    {
                        name: 'estimatedTotalAmount',
                        minWidth: 100,
                        displayName: 'Total Amount',
                        cellFilter: `number:${vm.amount}`
                    },
                    {
                        name: 'estimatedExtrasAmount',
                        displayName: 'Extra Amount',
                        minWidth: 150,
                        headerCellTemplate: $scope.dataTableTemplates.headerBlue,
                        cellFilter: `number:${vm.amount}`
                    },
                    {
                        name: 'estimatedTotalAmount',
                        displayName: 'Total Amount',
                        minWidth: 150,
                        headerCellTemplate: $scope.dataTableTemplates.headerBlue,
                        cellFilter: `number:${vm.amount}`
                    },
                    // {
                    //     name: 'amountInInvoiceCurrency',
                    //     displayName: 'Amount in Inv. Cur.',
                    //     cellFilter: 'number: 3',
                    //     minWidth: 100,
                    //     headerCellTemplate: $scope.dataTableTemplates.headerBlue,
                    // },
                    {
                        name: 'difference',
                        displayName: 'Diff.',
                        minWidth: 100,
                        cellFilter: `number:${vm.amount}`
                    }
                    // ,{
                    //     name: 'reconStatus.name',
                    //     displayName: 'Recon Status',
                    //     minWidth: 100,
                    //     cellTemplate: $scope.dataTableTemplates.matchedUnmatched,
                    // }
                ],
                onRegisterApi: function(api) {
                    let gridClass = `.grid${ api.grid.id}`;
                    let gridContainer = $(gridClass);
                    let gridViewport = '';
                    // Note: Set 1000 to avoid removing max-height logic, it can be necessary in the future
                    let maxRowsWithoutScroll = 1000;

                    setTimeout(() => {
                        gridContainer.removeAttr('style');
                        gridContainer.css('height', 'auto');

                        gridViewport = gridContainer.find('.ui-grid-viewport');
                        // Note: removing ng-style to avoid auto style calculation
                        gridViewport.removeAttr('ng-style')
                            .removeAttr('style')
                            .css('overflow-y', 'hidden', 'important')
                            .css('height', 'auto')
                            // Note: using the min height of an row to avoid grid adhesion
                            .css('min-height', `${api.grid.options.rowHeight }px`)
                            .css('padding', '5px 0')
                            .css('max-height', `${api.grid.options.rowHeight * maxRowsWithoutScroll }px`);
                    }, 100);
                }
            },
            invoiceProductDetails: {
                data: 'formValues.productDetails',
                multiSelect: false,
                noUnselect: true,
                enableSorting: false,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow,
                        category: '1'
                    },
                    {
                        name: 'description',
                        displayName: 'Description',
                        width: 150,
                        cellTemplate: $scope.dataTableTemplates.text
                    },
                    {
                        name: 'invoicedProduct',
                        displayName: 'Inv. Product',
                        width: 180,
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'invoicedProduct',
                            Type: 'lookup',
                            masterSource: 'Product',
                            clc_id: 'masters_productlist'
                        }
                    },
                    {
                        name: 'invoiceQuantity',
                        displayName: 'Inv. Qty.',
                        width: 170,
                        format: vm.quantity,
                        cellTemplate: $scope.dataTableTemplates.textUOM,
                        cellObject: {
                            Name: 'invoiceQuantityUom',
                            masterSource: 'Uom',
                            UomRequired: true,
                            UniqueId: 'invoiceQuantityUom',
                            changeEvent: 'invoiceConvertUom(\'product\', rowRenderIndex, grid.appScope.fVal().formValues, true)',
                            keyPressEvent: 'invoiceKeyPress(\'product\')'
                        }
                    },
                    {
                        name: 'invoiceRate',
                        displayName: 'Inv. Rate',
                        width: 190,
                        cellTemplate: $scope.dataTableTemplates.textUOM,
                        format: vm.price,
                        cellObject: {
                            Name: 'invoiceRateCurrency',
                            masterSource: 'Currency',
                            UomDisabled: true,
                            UomRequired: true,
                            hasUom: true,
                            additionalUomModel: 'invoiceRateUom',
                            UniqueId: 'invoiceRateCurrency',
                            parentGroup: 'productDetails',
                            // changeEvent: "invoiceConvertUom('product', rowRenderIndex, grid.appScope.fVal().formValues)"
                            changeEvent: 'invoiceConvertUom(\'product\', rowRenderIndex, grid.appScope.fVal().formValues, true)',
                            keyPressEvent: 'invoiceKeyPress(\'product\')'
                        }
                    },
                    {
                        name: 'invoiceAmount',
                        displayName: 'Amount',
                        format: vm.amount,
                        cellTemplate: $scope.dataTableTemplates.simpleTextUOM,
                        cellUomName: 'invoiceRateCurrency',
                        width: 200,
                        cellObject: {
                            Disabled: true
                        }
                    },
                    // {
                    //     name: 'orderedProduct.name',
                    //     displayName: 'Ord. Product',
                    //     // cellTemplate: $scope.dataTableTemplates.text,
                    //     headerCellTemplate: $scope.dataTableTemplates.headerWhite,
                    //     width: 200,
                    // }, {
                    //     name: 'confirmedQuantity',
                    //     displayName: 'Confirmed Qty.',
                    //     cellTemplate: $scope.dataTableTemplates.simpleTextUOM,
                    //     headerCellTemplate: $scope.dataTableTemplates.headerWhite,
                    //     width: 200,
                    //     cellUomName: 'confirmedQuantityUom',
                    // }, {
                    //     name: 'estimatedRate',
                    //     displayName: 'Est. Rate',
                    //     cellTemplate: $scope.dataTableTemplates.simpleTextUOM,
                    //     width: 200,
                    //     cellUomName: 'estimatedRateCurrency',
                    //     cellSecondUomName: 'estimatedRateUom',
                    //     headerCellTemplate: $scope.dataTableTemplates.headerWhite,
                    //     cellObject: {
                    //         hasUom: true,
                    //         cellUomName: 'estimatedRateUom',
                    //     }
                    // }, {
                    //     name: 'estimatedAmount',
                    //     displayName: 'Amount',
                    //     cellTemplate: $scope.dataTableTemplates.simpleTextUOM,
                    //     width: 200,
                    //     cellUomName: 'estimatedRateCurrency',
                    //     headerCellTemplate: $scope.dataTableTemplates.headerWhite,
                    // }, {
                    //     name: 'product.name',
                    //     displayName: 'Delivery Product',
                    //     // cellTemplate: $scope.dataTableTemplates.text,
                    //     width: 200,
                    //     headerCellTemplate: $scope.dataTableTemplates.headerBlue,
                    // }, {
                    //     name: 'deliveryQuantity',
                    //     displayName: 'Delivery Qty.',
                    //     cellTemplate: $scope.dataTableTemplates.simpleTextUOM,
                    //     width: 200,
                    //     cellUomName: 'deliveryQuantityUom',
                    //     headerCellTemplate: $scope.dataTableTemplates.headerBlue,
                    // }, {
                    //     name: 'sulphurContent',
                    //     width: 100,
                    //     displayName: 'Sulphur Content',
                    //     headerCellTemplate: $scope.dataTableTemplates.headerBlue,
                    //     cellTemplate: $scope.dataTableTemplates.text,
                    // }, {
                    //     name: 'physicalSupplierCounterparty',
                    //     displayName: 'Physical Supplier',
                    //     headerCellTemplate: $scope.dataTableTemplates.headerBlue,
                    //     cellTemplate: $scope.dataTableTemplates.lookup,
                    //     width: 200,
                    //     cellObject: {
                    //         "Name": "physicalSupplierCounterparty",
                    //         "Type": "lookup",
                    //         "clc_id": "masters_counterpartylist",
                    //         "masterSource": "Seller",
                    //     }
                    // }, {
                    //     name: 'deliveryMFM',
                    //     displayName: 'Delivery MFM',
                    //     headerCellTemplate: $scope.dataTableTemplates.headerBlue,
                    //     cellTemplate: $scope.dataTableTemplates.dropdown,
                    //     width: 200,
                    //     cellObject: {
                    //         "Name": "deliveryMFM",
                    //         "Type": "dropdown",
                    //         "masterSource": "DeliveryFeedback",
                    //     }
                    // }, {
                    //     name: 'deliveryNo',
                    //     displayName: 'Delivery No',
                    //     headerCellTemplate: $scope.dataTableTemplates.headerBlue,
                    //     width: 120,
                    // },
                    // {
                    //     name: 'difference',
                    //     width: 120,
                    //     displayName: 'Diff.',
                    //     cellFilter: 'number: 2',
                    // },
                    // {
                    //     name: 'reconStatus.name',
                    //     width: 120,
                    //     displayName: 'Recon Status',
                    //     cellTemplate: $scope.dataTableTemplates.matchedUnmatched,
                    // },
                    // {
                    //     name: 'amountInInvoice',
                    //     displayName: 'Amount Inv. Cur.',
                    //     width: 150,
                    //     cellFilter: 'number: 2',
                    // },
                    {
                        name: 'pricingDate',
                        width: 150,
                        displayName: 'Pricing Event Date',
                        cellTemplate: $scope.dataTableTemplates.date,
                        // cellTemplate: '<span>{{grid.appScope.fVal().adminConfiguration.procurement.price.pricingDateStopOption.name}}</span>',
                        cellCondition: '!grid.appScope.fVal().formValues.productDetails[grid.appScope.rowIdx(row)].manualPricingDateOverride || grid.appScope.fVal().adminConfiguration.procurement.price.pricingDateStopOption.name != "Invoice" ',
                        cellConditionType: 'ng-disabled',
                        cellObject: {
                            type: 'date',
                            path : 'formValues.productDetails'
                        }
                    },
                    {
                        name: 'pricingScheduleName',
                        width: 170,
                        cellTemplate: $scope.dataTableTemplates.textWithTooltip,
                        displayName: 'Pricing Schedule',
                    },
                    {
                        name: 'agreementType.name',
                        displayName: 'Agreement',
                        cellTemplate: $scope.dataTableTemplates.decodeText,
                        width: 130
                    },
                    {
                        name: 'contract.id',
                        displayName: 'Contract',
                        width: 120,
                        tooltip: 'grid.appScope.fVal().formValues.productDetails[grid.appScope.rowIdx(row)].contract.name',
                        cellTemplate: $scope.dataTableTemplates.link,
                        cellLink: '#/contracts/contract/edit/'
                    },
                    {
                        name: 'amountInOrder',
                        displayName: 'Inv. Amount in order curr.',
                        cellTemplate: $scope.dataTableTemplates.simpleTextUOM,
                        cellUomName: 'estimatedRateCurrency',
                        format: vm.amount,
                        width: 200,
                        cellObject: {
                            Disabled: true
                        }
                    },
                    {
                        name: 'reconStatus.name',
                        displayName: 'Recon Status',
                        width: 150,
                        cellTemplate: $scope.dataTableTemplates.matchedUnmatched
                    }

                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                    }, 10);
                    // recon status padding:   /* padding: 3px 10px 5px 10px; */
                }
            },
            priceRecon: {
                data: 'dynamicTable.price',
                multiSelect: false,
                noUnselect: true,
                enableSorting: false,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: 'invoice',
                        displayName: 'Invoice ID',
                        cellTemplate: $scope.dataTableTemplates.link,
                        cellLink: '#/invoices/invoice/edit/'
                    },
                    {
                        name: 'delivery.id',
                        displayName: 'Del. ID'
                    },
                    {
                        name: 'invoiceType.name',
                        displayName: 'Type'
                    },
                    {
                        name: 'deliveryAmount',
                        displayName: 'Delivered Amount',
                        cellTemplate: $scope.dataTableTemplates.tenantFormattedText,
                        tenantFormat: vm.amount,
                    },
                    {
                        name: 'invoiceAmountInOrderCurrency',
                        displayName: 'Invoice Amnt in Order Curr',
                        cellTemplate: $scope.dataTableTemplates.tenantFormattedText,
                        tenantFormat: vm.amount,
                    },
                    {
                        name: 'invoiceAmount',
                        displayName: 'Invoice Amnt',
                        cellTemplate: $scope.dataTableTemplates.tenantFormattedText,
                        tenantFormat: vm.amount,
                    },
                    {
                        name: 'variance',
                        displayName: 'Variance',
                        cellTemplate: $scope.dataTableTemplates.tenantFormattedText,
                        tenantFormat: vm.amount,
                    },
                    {
                        name: 'matched',
                        displayName: 'Matched'
                        // cellTemplate: $scope.dataTableTemplates.yesNo,
                    },
                    {
                        name: 'status.name',
                        displayName: 'Status',
                        cellTemplate: $scope.dataTableTemplates.status
                    },
                    {
                        name: 'claim',
                        displayName: 'Claim',
                        cellTemplate: $scope.dataTableTemplates.yesNoInverted
                    }
                ],
                appScopeProvider: {
                    showRow: function(row) {
                        return row.isDeleted !== true;
                    },
                    rowIdx: function(row) {
                        return row.grid.rows.indexOf(row);
                    },
                    fVal: function() {
                        return $scope;
                    }
                },
                onRegisterApi: function(api) {}
            },
            qualityreconlist: {
                data: 'dynamicTable.qualityreconlist',
                multiSelect: false,
                noUnselect: true,
                enableSorting: false,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: 'id',
                        displayName: 'Lab Result ID',
                        cellTemplate: $scope.dataTableTemplates.link,
                        cellLink: '#/labs/labresult/edit/'
                    },
                    {
                        name: 'deliveryId',
                        displayName: 'Delivery ID'
                    },
                    {
                        name: 'product',
                        displayName: 'Product',
                        cellTemplate: $scope.dataTableTemplates.labsResultRecon,
                        cellLink: '#/labs/labresult/edit/'
                    },
                    {
                        name: 'status',
                        cellTemplate: $scope.dataTableTemplates.reconLabsPassedFailed,
                        displayName: 'Status'
                    },
                    {
                        name: 'claim',
                        displayName: 'Claim',
                        cellTemplate: $scope.dataTableTemplates.claimsRaisedStatus
                    }
                ],
                appScopeProvider: {
                    showRow: function(row) {
                        return row.isDeleted !== true;
                    },
                    rowIdx: function(row) {
                        return row.grid.rows.indexOf(row);
                    },
                    fVal: function() {
                        return $scope;
                    }
                },
                onRegisterApi: function(api) {}
            },
            reconLabTestResults: {
                data: 'dynamicTable.labstestslist',
                multiSelect: false,
                noUnselect: true,
                enableSorting: false,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: ' ',
                        displayName: ' ',
                        cellTemplate: $scope.dataTableTemplates.checkbox,
                        cellAction: 'grid.appScope.multiSelectLabTestResult(row)'
                    },
                    {
                        name: 'specParameter',
                        displayName: 'Spec Parameter',
                        cellTemplate: $scope.dataTableTemplates.link,
                        cellLink: '#/masters/specparameter/edit/'
                    },
                    {
                        name: 'min',
                        displayName: 'Min'
                    },
                    {
                        name: 'max',
                        displayName: 'Max'
                    },
                    {
                        name: 'uom',
                        displayName: 'UOM'
                    },
                    {
                        name: 'value',
                        displayName: 'Labs'
                    },
                    {
                        name: 'bdnValue',
                        displayName: 'BDN'
                    },
                    {
                        name: 'qualityMatch',
                        displayName: 'Passed/Failed',
                        cellTemplate: $scope.dataTableTemplates.colorCodedStatus
                    },
                    {
                        name: 'claimsRaised',
                        displayName: 'Claim',
                        cellTemplate: $scope.dataTableTemplates.claimsRaisedStatus
                    }
                ]
            },
            quantityRecon: {
                data: 'dynamicTable.quantity',
                multiSelect: false,
                noUnselect: true,
                enableSorting: false,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: '<input type="radio" name="qtyReconRow" ng-click="grid.appScope.selectReconRow(row, rowRenderIndex);" ng-checked="rowRenderIndex == grid.appScope.isSelectedRow" >',
                        category: '1'
                    },
                    {
                        name: 'delivery',
                        displayName: 'Del. ID',
                        cellTemplate: $scope.dataTableTemplates.link,
                        cellLink: 'v2/delivery/delivery/',
                        isDeliveryLink: true
                    },
                    {
                        name: 'product',
                        displayName: 'Prod. Name',
                        cellTemplate: $scope.dataTableTemplates.link,
                        cellLink: '#/masters/product/edit/'
                    },
                    {
                        name: 'deliveryDate',
                        displayName: 'Del. Date',
                        cellTemplate: $scope.dataTableTemplates.dateDisplay
                    },
                    {
                        name: 'orderQuantity',
                        displayName: 'Ord. Qty',
                        cellTemplate: $scope.dataTableTemplates.textUOM,
                        format: vm.quantity,
                        cellObject: {
                            Name: 'Uom',
                            Type: 'dropdown',
                            masterSource: 'Uom',
                            uomBindSource: 'reconQtyUom'
                        }
                    },
                    {
                        name: 'buyerQuantityAmount',
                        displayName: 'Vessel Qty',
                        cellTemplate: $scope.dataTableTemplates.textUOM,
                        format: vm.quantity,
                        cellObject: {
                            Name: 'Uom',
                            Type: 'dropdown',
                            masterSource: 'Uom',
                            uomBindSource: 'reconQtyUom'
                        }
                    },
                    {
                        name: 'sellerQuantityAmount',
                        displayName: 'BDN Qty',
                        cellTemplate: $scope.dataTableTemplates.textUOM,
                        format: vm.quantity,
                        cellObject: {
                            Name: 'Uom',
                            Type: 'dropdown',
                            masterSource: 'Uom',
                            uomBindSource: 'reconQtyUom'
                        }
                    },
                    {
                        name: 'variance',
                        displayName: 'Variance',
                        cellTemplate: $scope.dataTableTemplates.textUOM,
                        format: vm.quantity,
                        cellObject: {
                            Name: 'Uom',
                            Type: 'dropdown',
                            masterSource: 'Uom',
                            uomBindSource: 'reconQtyUom'
                        }
                    },
                    {
                        name: 'matched',
                        displayName: 'Matched',
                        cellTemplate: $scope.dataTableTemplates.yesNo
                    },
                    {
                        name: 'claims',
                        displayName: 'Claim',
                        cellTemplate: $scope.dataTableTemplates.yesNoInverted
                    }
                ],
                rowTemplate: '<div  ng-class="rowRenderIndex == grid.appScope.isSelectedRow ? \'selectedRow\' : \'\'"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="col.colIndex()" ui-grid-cell></div>'
            },
            labTestResults: {
                data: 'formValues.labTestResults',
                enableSorting: false,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        displayName: '  ',
                        cellTemplate: $scope.dataTableTemplates.checkbox,
                        cellName: 'labResults',
                        cellParams: true,
                        cellAction: 'grid.appScope.calcQualityClaimType(row,null,rowRenderIndex)',
                        cellCondition: 'grid.appScope.fVal().formValues.labTestResults[grid.appScope.rowIdx(row)].noAction || !grid.appScope.fVal().formValues.labTestResults[grid.appScope.rowIdx(row)].claimTypes',
                        cellConditionType: 'ng-disabled',
                    },
                    {
                        name: 'specParameter',
                        displayName: 'Order Spec Parameter',
                        cellTemplate: $scope.dataTableTemplates.link,
                        cellLink: '#/masters/specparameter/edit/',
                        width: 200
                    },
                    {
                        name: 'uom',
                        displayName: 'UOM',
                    },
                    {
                        name: 'min',
                        displayName: 'Min',
                    },
                    {
                        name: 'max',
                        displayName: 'Max',
                    },
                    {
                        name: 'offerSpecParameter',
                        displayName: 'Offer Spec Parameter',
                        cellTemplate: $scope.dataTableTemplates.readonlyNumber,
                        decimalNumbers: vm.quantity,
                        width: 200
                    },
                    {
                        name: 'value',
                        displayName: 'Labs',
                        cellTemplate: $scope.dataTableTemplates.text,
                        format: 'number:3',
                        ChangeAction : 'calculatePassedFailedInLab(grid.appScope.fVal().formValues.labTestResults[grid.appScope.rowIdx(row)])',
                        cellCondition: 'grid.appScope.fVal().formValues.status.name == \'Verified\'',
                        cellConditionType: 'ng-disabled',
                        cellObject: {
                            required: false
                        }
                    },
                    {
                        name: 'bdnValue',
                        displayName: 'BDN',
                        cellTemplate: $scope.dataTableTemplates.text,
                        // format: 'number:3',
                        cellCondition: 'grid.appScope.fVal().formValues.status.name == \'Verified\'',
                        cellConditionType: 'ng-disabled',
                        isLabResultTooltip: true,
                    },
                    {
                        name: 'qualityMatch',
                        displayName: 'Passed/Failed',
                        cellTemplate: $scope.dataTableTemplates.colorCodedStatus,
                        template: 1
                    },
                    {
                        name: 'claimsRaised',
                        displayName: 'Claim',
                        cellTemplate: $scope.dataTableTemplates.claimsRaisedStatus,
                    },
                    {
                        name: 'noAction',
                        displayName: 'No Action',
                        cellTemplate: $scope.dataTableTemplates.checkbox
                    }
                ],
                onRegisterApi: function(api) {
                    $('.group_labTestResults').hide();
                    api.core.on.rowsRendered($scope, () => {
                        api.core.handleWindowResize().then(() => {
                            let height = Math.min(Math.max(api.grid.rows.length * 60, 80), 400);
                            $('#grid_labTestResults').css('height', `${height }px`);
                            $timeout(() => {
                                $('.group_labTestResults').show();
                            }, 400);
                        });
                    });
                }
            },
            adminConfigurationEmail: {
                data: 'formValues.email',
                multiSelect: false,
                noUnselect: true,
                enableSorting: false,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: 'transactionType.name',
                        displayName: 'Transaction',
                        width: 350
                    },
                    {
                        name: 'process',
                        displayName: 'Process',
                        width: 350
                    },
                    {
                        name: 'emailType',
                        displayName: 'Email Type',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellCondition: 'grid.appScope.fVal().formValues.email[grid.appScope.rowIdx(row)].isEmailRequired == false',
                        cellConditionType: 'ng-disabled',
                        width: 350,
                        cellObject: {
                            Name: 'EmailType',
                            Type: 'dropdown',
                            masterSource: 'EmailType'
                        }
                    },
                    {
                        name: 'template',
                        displayName: 'Template',
                        width: 350,
                        cellTemplate: $scope.dataTableTemplates.lookup_adminTemplates,
                        cellObject: {
                            Name: 'EmailTemplate',
                            Type: 'lookup',
                            clc_id: 'admin_templates',
                            masterSource: 'EmailTemplate',
                            filter: 'filter__admin_templates'
                        }
                    },
                    {
                        name: 'replyTo',
                        displayName: 'Reply To',
                        // width: 350,
                        cellTemplate: $scope.dataTableTemplates.text,
                        cellObject: {
                            Name: 'EmailTemplate',
                            Type: 'lookup',
                            clc_id: 'admin_templates',
                            masterSource: 'EmailTemplate',
                            filter: 'filter__admin_templates'
                        }
                    },
                    {
                        name: 'toEmailsConfiguration',
                        displayName: 'To email configuration',
                        // width: 350,
                        cellTemplate: $scope.dataTableTemplates.multiselect,
                        cellObject: {
                            masterSource: 'EmailAddressTypes',
                            Name: 'toEmailsConfiguration',
                            Type: 'text',
                        }
                    },
                    {
                        name: 'ccEmailsConfiguration',
                        displayName: 'CC email configuration',
                        // width: 350,
                        cellTemplate: $scope.dataTableTemplates.multiselect,
                        cellObject: {
                            masterSource: 'EmailAddressTypes',
                            Name: 'ccEmailsConfiguration',
                            Type: 'text',
                        }
                    }
                ],
                appScopeProvider: {
                    showRow: function(row) {
                        return row.isDeleted !== true;
                    },
                    rowIdx: function(row) {
                        return row.grid.rows.indexOf(row);
                    },
                    fVal: function() {
                        return $scope;
                    }
                },
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        $.each(api.grid.rows, (k, v) => {
                            var field = {
                                Name: `EmailTemplate_${ k}`,
                                Type: 'lookup',
                                clc_id: 'admin_templates',
                                masterSource: 'EmailTemplate',
                                Filter: [
                                    {
                                        ColumnName: 'EmailTransactionTypeId',
                                        Value: v.entity.transactionType.id
                                    },
                                    {
                                        ColumnName: 'Process',
                                        Value: v.entity.process
                                    }
                                ]
                            };
                            vm.getOptions(field);
                        });
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.adminConfigurationEmail) {
                            $scope.formValues.adminConfigurationEmail = [ {} ];
                        } else if (angular.equals($scope.formValues.adminConfigurationEmail, [])) {
                            $scope.formValues.adminConfigurationEmail.push({});
                        }
                        api.core.handleWindowResize();
                    }, 10);
                }
            },
            mtmFormulaProducts: {
                data: 'formValues.mtmFormulaProducts',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow
                    },
                    {
                        name: 'formula',
                        displayName: 'Formula Description',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'Formula',
                            Type: 'lookup',
                            masterSource: 'Formula',
                            clc_id: 'masters_forrmulalist',
                            required: 'grid.appScope.fVal().formValues.mtmType.id == 1',
                            customNumberOfRowsAction: 'getRowNumbers(rowRenderIndex, productTypeTypeahead[rowRenderIndex], grid.appScope.fVal().formValues)'


                        },
                    },
                    {
                        name: 'product',
                        displayName: 'Product',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'Product',
                            Type: 'lookup',
                            masterSource: 'Product',
                            clc_id: 'masters_productlist',
                            required: 'grid.appScope.fVal().formValues.mtmType.id == 1',
                            customNumberOfRowsAction: 'getRowNumbers(rowRenderIndex, productTypeTypeahead[rowRenderIndex], grid.appScope.fVal().formValues)'

                        },
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.mtmFormulaProducts) {
                            $scope.formValues.mtmFormulaProducts = [ {} ];
                        } else if (angular.equals($scope.formValues.mtmFormulaProducts, [])) {
                            $scope.formValues.mtmFormulaProducts.push({});
                        }
                    }, 10);
                }
            },
            contractualQuantity: {
                data: 'formValues.details',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow,
                        category: '1'
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow,
                        category: '1'
                    },
                    {
                        name: 'contractualQuantityOption',
                        displayName: 'QuantityType',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'ContractualQuantityOption',
                            Type: 'dropdown',
                            masterSource: 'ContractualQuantityOption',
                            Required: true
                        }
                    },
                    {
                        name: 'minContractQuantity',
                        displayName: 'Min',
                        cellTemplate: $scope.dataTableTemplates.text,
                        format: `number:${ vm.quantity}`,
                        cellCondition: 'grid.appScope.fVal().formValues.details[grid.appScope.rowIdx(row)].tolerance.length > 0',
                        ChangeAction : 'grid.appScope.fVal().formValues.details[grid.appScope.rowIdx(row)].minContractQuantity.length > 0 ? grid.appScope.fVal().formValues.details[grid.appScope.rowIdx(row)].tolerance = null : \'\' ',
                        cellConditionType: 'ng-disabled',
                        cellObject: {
                            Required: true
                        }
                    },
                    {
                        name: 'maxContractQuantity',
                        displayName: 'Max',
                        cellTemplate: $scope.dataTableTemplates.text,
                        format: `number:${ vm.quantity}`,
                        cellObject: {
                            Required: true
                        }
                    },
                    {
                        name: 'uom',
                        displayName: 'UOM',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'Uom',
                            Type: 'dropdown',
                            masterSource: 'Uom',
                            Required: true
                        }
                    },
                    {
                        name: 'tolerance',
                        displayName: 'Tolerance (%)',
                        cellCondition: 'grid.appScope.fVal().formValues.details[grid.appScope.rowIdx(row)].minContractQuantity.length > 0',
                        ChangeAction : 'grid.appScope.fVal().formValues.details[grid.appScope.rowIdx(row)].tolerance.length > 0 ? grid.appScope.fVal().formValues.details[grid.appScope.rowIdx(row)].minContractQuantity = null : \'\' ',
                        cellConditionType: 'ng-disabled',
                        cellTemplate: $scope.dataTableTemplates.text
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        $scope.gridApi = api;
                        api.core.handleWindowResize();
                        var defaultUom = $tenantSettings.tenantFormats.uom;
                        var defaultQuantityType = $listsCache.ContractualQuantityOption[0];
                        let firstEntry = {
                            contractualQuantityOption: defaultQuantityType,
                            minContractQuantity: null,
                            maxContractQuantity: null,
                            convertedMaxContractQuantity: null,
                            uom: defaultUom,
                            tolerance: null,
                            id: 0
                        };
                        if (typeof $scope.formValues.details == 'undefined') {
                            $scope.formValues.details = [ firstEntry ];
                        }
                        // if (angular.equals($scope.formValues, {}) || !$scope.formValues.contractualQuantity) {
                        //     // a= $scope.CM.adminConfiguration;
                        //     // debugger
                        //     // $scope.formValues.contractualQuantity = [{}];
                        //     $scope.formValues.details = [firstEntry];
                        // } else if (angular.equals($scope.formValues.contractualQuantity, [])) {
                        //     // $scope.formValues.contractualQuantity.push({})
                        //     // $scope.formValues.details.push(firstEntry);
                        // }
                    }, 10);
                }
            },
            generalNotes: {
                data: 'formValues.notes',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.customRemRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow,
                        cellTemplateCondition: 'detectCurrentUser(grid.appScope.fVal().formValues.notes, grid.appScope.rowIdx(row))',
                        Disabled: 'grid.appScope.fVal().formValues.status.name == \'Closed\' || grid.appScope.fVal().formValues.status.name == \'Cancelled\''
                    },
                    {
                        name: 'note',
                        displayName: 'Notes',
                        cellTemplate: $scope.dataTableTemplates.text,
                        ChangeAction : 'updateDateAndTime(grid.appScope.fVal().formValues.notes[grid.appScope.rowIdx(row)])',
                        BlurAction: 'autoSaveNotes()',
                        cellTemplateCondition: 'detectCurrentUser(grid.appScope.fVal().formValues.notes, grid.appScope.rowIdx(row))',
                        Disabled: 'grid.appScope.fVal().formValues.status.name == \'Closed\' || grid.appScope.fVal().formValues.status.name == \'Cancelled\'',
                        enableSorting: false
                        
                    },
                    {
                        name: 'createdBy.name',
                        displayName: 'Added By',
                        enableCellEdit: false,
                        enableSorting: false
                    },
                    {
                        name: 'createdAt',
                        displayName: 'Date & Time',
                        cellTemplate: $scope.dataTableTemplates.dateDisplay,
                        enableCellEdit: false,
                        enableSorting: false
                    }
    
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.notes) {
                            $scope.formValues.notes = [];
                            if (!$scope.entity_id) {
                                $scope.formValues.isEditable = true;
                            }
                        }
                    }, 10);
                }

            },
            voyages: {
                data: 'formValues.flattenedVoyages',
                rowHeight: 40,
                excessRows: 999,
                multiSelect: false,
                noUnselect: true,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: 'code',
                        width: 150,
                        enableCellEdit: false,
                        displayName: 'Voyage Code',
                        // cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.fVal().formValues.voyages[0].code}}</div>'
                    },
                    {
                        name: 'port.code',
                        width: 110,
                        enableCellEdit: false,
                        displayName: 'Port Code'
                    },
                    {
                        name: 'portFunction',
                        width: 130,
                        enableCellEdit: false,
                        displayName: 'Port Function'
                    },
                    {
                        name: 'port.name',
                        width: 150,
                        enableCellEdit: false,
                        displayName: 'Port Name',
                        cellTemplate: $scope.dataTableTemplates.decodeText
                    },
                    {
                        name: 'country.name',
                        width: 130,
                        enableCellEdit: false,
                        displayName: 'Country',
                        cellTemplate: $scope.dataTableTemplates.decodeText
                    },
                    {
                        name: 'eta',
                        width: 180,
                        enableCellEdit: false,
                        displayName: 'ETA',
                        cellTemplate: $scope.dataTableTemplates.dateDisplay
                    },
                    {
                        name: 'etb',
                        width: 180,
                        enableCellEdit: false,
                        cellTemplate: $scope.dataTableTemplates.dateDisplay,
                        displayName: 'ETB'
                    },
                    {
                        name: 'etd',
                        width: 180,
                        enableCellEdit: false,
                        cellTemplate: $scope.dataTableTemplates.dateDisplay,
                        displayName: 'ETD'
                    },
                    {
                        name: 'remarks',
                        width: 150,
                        enableCellEdit: false,
                        displayName: 'Remarks'
                    },
                    {
                        name: 'speed',
                        width: 130,
                        enableCellEdit: false,
                        displayName: 'Speed'
                    },
                    {
                        name: 'distanceStandard',
                        width: 130,
                        enableCellEdit: false,
                        displayName: 'Distance (Standard) in Nautical Miles'
                    },
                    {
                        name: 'distanceECA',
                        width: 130,
                        enableCellEdit: false,
                        displayName: 'Distance (ECA) in Nautical Miles'
                    },
                    {
                        name: 'id',
                        enableCellEdit: false,
                        width: 50,
                        cellTemplate: '<div class="ui-grid-cell-contents"><span style="cursor: pointer;" ng-click="grid.appScope. showVesselVoyageDetails(grid.appScope.fVal().formValues.flattenedVoyages[grid.appScope.rowIdx(row)].id)"><i class="fa fa-2x fa-plus-circle" style="color: #364150;"></i></span></div>',
                        displayName: ''

                    }, 
                    {
                        name: 'hasUsdRestrictions',
                        width: 130,
                        enableCellEdit: false,
                        displayName: 'USD Restrictions Port',
                        cellTemplate: $scope.dataTableTemplates.checkbox,
                        cellConditionType: 'true'
                    }
                ]
            },
            kpis: {
                data: 'formValues.kpis',
                rowHeight: 40,
                excessRows: 999,
                enableRowSelection: true,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow,
                        category: '1'
                    },
                    {
                        name: 'consumptionMode',
                        displayName: 'Consumption Mode',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'ConsumptionMode',
                            Type: 'dropdown',
                            masterSource: 'ConsumptionMode'
                        }
                    },
                    {
                        name: 'productType',
                        displayName: 'Product Type',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'ProductType',
                            Type: 'dropdown',
                            masterSource: 'ProductType',
                        }
                    },
                    {
                        name: 'consumptionQuantity',
                        displayName: 'Consumption Quantity',
                        cellTemplate: $scope.dataTableTemplates.text
                    },
                    {
                        name: 'uom',
                        displayName: 'UOM',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'Uom',
                            Type: 'lookup',
                            masterSource: 'Uom',
                            clc_id: 'masters_uomlist'
                        }
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.kpis) {
                            $scope.formValues.kpis = [ {} ];
                        } else if (angular.equals($scope.formValues.kpis, [])) {
                            $scope.formValues.kpis.push({});
                        }
                    }, 10);
                }
            },
            templates: {
                data: 'formValues.templates',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow,
                        category: '1'
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow,
                        category: '1'
                    },
                    {
                        name: 'transactionType',
                        displayName: 'Transaction Name',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'TransactionType',
                            Type: 'dropdown',
                            masterSource: 'TransactionType'
                        }
                    },
                    {
                        name: 'emailTemplate',
                        displayName: 'Template',
                        cellCondition: '!grid.appScope.fVal().formValues.templates[grid.appScope.rowIdx(row)].transactionType.id',
                        cellConditionType: 'ng-disabled',
                        cellTemplate: $scope.dataTableTemplates.lookup_adminTemplates,
                        cellObject: {
                            Name: 'EmailTemplate',
                            Type: 'lookup',
                            clc_id: 'masters_documenttypetemplates',
                            masterSource: 'EmailDocumentTypeTemplatesTemplate',
                            filter: 'filter__master_documenttypetemplates'
                        }
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        $.each(api.grid.rows, (k, v) => {
                            var field = {
                                Name: `EmailTemplate_${ k}`,
                                Type: 'lookup',
                                clc_id: 'masters_documenttypetemplates',
                                masterSource: 'DocumentTypeTemplates',
                                Filter: [
                                    {
                                        ColumnName: 'EmailTransactionTypeId',
                                        Value: v.entity.transactionType.id
                                    }
                                ]
                            };
                            vm.getOptions(field);
                        });
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.templates) {
                            $scope.formValues.templates = [ {} ];
                        } else if (angular.equals($scope.formValues.templates, [])) {
                            $scope.formValues.templates.push({});
                        }
                    }, 10);
                }
            },
            tanks: {
                data: 'formValues.tanks',
                rowHeight: 40,
                excessRows: 999,
                enableRowSelection: true,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        cellClass: 'actionsCol',
                        enableCellEdit: false,
                        cellTemplate: $scope.dataTableTemplates.remRow
                    },
                    {
                        name: 'name',
                        displayName: 'Tank Name'
                    },
                    {
                        name: 'product.name',
                        displayName: 'Product'
                    },
                    {
                        name: 'capacity',
                        displayName: 'Capacity'
                    },
                    {
                        name: 'rob',
                        displayName: 'ROB'
                    },
                    {
                        name: 'availableCapacity',
                        displayName: 'Available Capacity'
                    },
                    {
                        name: 'uom.name',
                        displayName: 'Quantity UOM'
                    }
                ],
                rowTemplate: '<div ng-click="grid.appScope.selectRow(row, colRenderIndex)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="col.colIndex()" ui-grid-cell></div>',
                appScopeProvider: {
                    showRow: function(row) {
                        return row.isDeleted !== true;
                    },
                    addData: function(obj, index) {
                        obj = eval(obj);
                        obj.push({
                            id: 0
                        });
                    },
                    cellTemplateFunc: function(row) {
                        $scope.formValues.temp.sellectedRow = false;
                        if (row.id > 0) {
                            row.isDeleted = true;
                        } else {
                            let index = $scope.formValues.tanks.indexOf(row.entity);
                            $scope.formValues.tanks.splice(index, 1);
                        }
                    },
                    selectRow: function(row) {
                        $('.group_VesselTankDetailsCLC .ui-grid-canvas .ui-grid-row').removeClass('active');
                        $scope.formValues.temp = {
                            tanks: {}
                        };
                        $scope.formValues.temp.tanks = row.entity;
                        $scope.formValues.temp.tanks.productType = { id: row.entity.productTypeId };
                        var index = row.grid.rows.indexOf(row);
                        $($('.group_VesselTankDetailsCLC .ui-grid-canvas .ui-grid-row')[index]).addClass('active');
                        angular.merge($scope.formValues.tanks[index], $scope.formValues.temp.tanks);
                        $scope.refreshValue = 1;
                        $scope.formValues.temp.sellectedRow = true;
                        $scope.options.ProductFiltered = $filter('filter')(angular.copy($listsCache.Product), { productTypeId:$scope.formValues.temp.tanks.productType.id });


                        $('.group_VesselTankDetails input').removeAttr('disabled');
                        $('.group_VesselTankDetails select').removeAttr('disabled');
                        $('.group_VesselTankDetails span.input-group-addon').removeClass('disabled');
                    },
                    remData: function(obj, row, idx) {
                        obj = eval("$scope." + obj);
                        var index = obj.indexOf(row);
                        length = 0;
                        $.each(Object.values(obj), (key, val) => {
                            if (!val.isDeleted) {
                                length++;
                            }
                        });
                        if (row.id > 0) {
                            row.isDeleted = true;
                        } else {
                            obj.splice(index, 1);
                        }
                        $scope.formValues.temp = {
                            tanks: {}
                        };
                        $scope.formValues.temp.sellectedRow = false;
                        $('.group_VesselTankDetails input').attr('disabled', 'disabled');
                        $('.group_VesselTankDetails select').attr('disabled', 'disabled');
                        $('.group_VesselTankDetails span.input-group-addon').addClass('disabled');
                    }
                },
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        $('.group_VesselTankDetails input').attr('disabled', 'disabled');
                        $('.group_VesselTankDetails select').attr('disabled', 'disabled');
                        $('.group_VesselTankDetails span.input-group-addon').addClass('disabled');
                    }, 10);
                }
            },

            locationDiscountRules: {
                data: 'formValues.locationDiscountRules',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow,
                        category: '1'
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow,
                        category: '1'
                    },
                    {
                        name: 'location',
                        displayName: 'Vessel-Location',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'Location',
                            Type: 'lookup',
                            masterSource: 'Location',
                            clc_id: 'masters_locationlist'
                        }
                    },
                    {
                        name: 'plusMinus',
                        displayName: '+/-',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'FormulaPlusMinus',
                            Type: 'dropdown',
                            masterSource: 'FormulaPlusMinus'
                        }
                    },
                    {
                        name: 'amount',
                        displayName: 'Amount',
                        format: `number:${ vm.amount}`,
                        cellTemplate: $scope.dataTableTemplates.text,
                        cellCondition: 'grid.appScope.fVal().formValues.locationDiscountRules[grid.appScope.rowIdx(row)].plusMinus.id == 3',
                        cellConditionType: 'ng-disabled'
                    },
                    {
                        name: 'flatPercentage',
                        displayName: '$/%',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellCondition: 'grid.appScope.fVal().formValues.locationDiscountRules[grid.appScope.rowIdx(row)].plusMinus.id == 3',
                        cellConditionType: 'ng-disabled',
                        cellObject: {
                            Name: 'FormulaFlatPercentage',
                            Type: 'dropdown',
                            masterSource: 'FormulaFlatPercentage',
                            Disabled: 'grid.appScope.fVal().formValues.locationDiscountRules[grid.appScope.rowIdx(row)].plusMinus.id == 3'
                        }
                    },
                    {
                        name: 'uom',
                        displayName: 'UOM',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellCondition: 'grid.appScope.fVal().formValues.locationDiscountRules[grid.appScope.rowIdx(row)].plusMinus.id == 3',
                        cellConditionType: 'ng-disabled',
                        cellObject: {
                            Name: 'Uom',
                            Type: 'lookup',
                            masterSource: 'Uom',
                            clc_id: 'masters_uomlist',
                            Disabled: 'grid.appScope.fVal().formValues.locationDiscountRules[grid.appScope.rowIdx(row)].plusMinus.id == 3 || grid.appScope.fVal().formValues.locationDiscountRules[grid.appScope.rowIdx(row)].flatPercentage.id == 2'
                        }
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.locationDiscountRules) {
                            $scope.formValues.locationDiscountRules = [ {} ];
                        } else if (angular.equals($scope.formValues.locationDiscountRules, [])) {
                            $scope.formValues.locationDiscountRules.push({});
                        }
                    }, 10);
                }
            },
            productDiscountRules: {
                data: 'formValues.productDiscountRules',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow,
                        category: '1'
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow,
                        category: '1'
                    },
                    {
                        name: 'product',
                        displayName: 'Product',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'Product',
                            Type: 'lookup',
                            masterSource: 'Product',
                            clc_id: 'masters_productlist'
                        }
                    },
                    {
                        name: 'plusMinus',
                        displayName: '+/-',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'FormulaPlusMinus',
                            Type: 'dropdown',
                            masterSource: 'FormulaPlusMinus'
                        }
                    },
                    {
                        name: 'amount',
                        displayName: 'Amount',
                        format:  `number:${ vm.amount}`,
                        cellTemplate: $scope.dataTableTemplates.text,
                        cellCondition: 'grid.appScope.fVal().formValues.productDiscountRules[grid.appScope.rowIdx(row)].plusMinus.id == 3',
                        cellConditionType: 'ng-disabled'
                    },
                    {
                        name: 'flatPercentage',
                        displayName: '$/%',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellCondition: 'grid.appScope.fVal().formValues.productDiscountRules[grid.appScope.rowIdx(row)].plusMinus.id == 3',
                        cellConditionType: 'ng-disabled',
                        cellObject: {
                            Name: 'FormulaFlatPercentage',
                            Type: 'dropdown',
                            masterSource: 'FormulaFlatPercentage',
                            Disabled: 'grid.appScope.fVal().formValues.productDiscountRules[grid.appScope.rowIdx(row)].plusMinus.id == 3'
                        }
                    },
                    {
                        name: 'uom',
                        displayName: 'UOM',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellCondition: 'grid.appScope.fVal().formValues.productDiscountRules[grid.appScope.rowIdx(row)].plusMinus.id == 3',
                        cellConditionType: 'ng-disabled',
                        cellObject: {
                            Name: 'Uom',
                            Type: 'lookup',
                            masterSource: 'Uom',
                            clc_id: 'masters_uomlist',
                            Disabled: 'grid.appScope.fVal().formValues.productDiscountRules[grid.appScope.rowIdx(row)].plusMinus.id == 3 || grid.appScope.fVal().formValues.productDiscountRules[grid.appScope.rowIdx(row)].flatPercentage.id == 2 '
                        }
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.productDiscountRules) {
                            $scope.formValues.productDiscountRules = [ {} ];
                        } else if (angular.equals($scope.formValues.productDiscountRules, [])) {
                            $scope.formValues.productDiscountRules.push({});
                        }
                    }, 10);
                }
            },
            quantityDiscountRules: {
                data: 'formValues.quantityDiscountRules',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow,
                        category: '1'
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow,
                        category: '1'
                    },
                    {
                        name: 'quantityType',
                        displayName: 'Quantity Type',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'QuantityType',
                            Type: 'dropdown',
                            masterSource: 'QuantityType'
                        }
                    },
                    {
                        name: 'quantityRangeFrom',
                        displayName: 'Quantity From',
                        cellTemplate: $scope.dataTableTemplates.text,
                        format: `number:${ vm.quantity }`
                    },
                    {
                        name: 'quantityRangeTo',
                        displayName: 'Quantity To',
                        cellTemplate: $scope.dataTableTemplates.text,
                        format: `number:${ vm.quantity }`
                    },
                    {
                        name: 'uom',
                        displayName: 'UOM',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellCondition: 'grid.appScope.fVal().formValues.quantityDiscountRules[grid.appScope.rowIdx(row)].plusMinus.id == 3',
                        cellConditionType: 'ng-disabled',
                        cellObject: {
                            Name: 'Uom',
                            Type: 'lookup',
                            masterSource: 'Uom',
                            clc_id: 'masters_uomlist',
                            Disabled: 'grid.appScope.fVal().formValues.quantityDiscountRules[grid.appScope.rowIdx(row)].plusMinus.id == 3'
                        }
                    },
                    {
                        name: 'plusMinus',
                        displayName: '+/-',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'FormulaPlusMinus',
                            Type: 'dropdown',
                            masterSource: 'FormulaPlusMinus'
                        }
                    },
                    {
                        name: 'amount',
                        format: `number:${ vm.amount }`,
                        displayName: 'Amount',
                        cellTemplate: $scope.dataTableTemplates.text,
                        cellCondition: 'grid.appScope.fVal().formValues.quantityDiscountRules[grid.appScope.rowIdx(row)].plusMinus.id == 3',
                        cellConditionType: 'ng-disabled'
                    },
                    {
                        name: 'flatPercentage',
                        displayName: '$/%',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellCondition: 'grid.appScope.fVal().formValues.quantityDiscountRules[grid.appScope.rowIdx(row)].plusMinus.id == 3',
                        cellConditionType: 'ng-disabled',
                        cellObject: {
                            Name: 'FormulaFlatPercentage',
                            Type: 'dropdown',
                            masterSource: 'FormulaFlatPercentage',
                            Disabled: 'grid.appScope.fVal().formValues.quantityDiscountRules[grid.appScope.rowIdx(row)].plusMinus.id == 3'
                        }
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.quantityDiscountRules) {
                            $scope.formValues.quantityDiscountRules = [ {} ];
                        } else if (angular.equals($scope.formValues.quantityDiscountRules, [])) {
                            $scope.formValues.quantityDiscountRules.push({});
                        }
                    }, 10);
                }
            },
            complexFormulaQuoteLines: {
                data: 'formValues.complexFormulaQuoteLines',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: '<div><a class="remove" ng-click="grid.appScope.cellTemplateFunc(row.entity, \'$scope.formValues.complexFormulaQuoteLines\')"></a></div>'
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow
                    },
                    {
                        name: 'formulaOperation',
                        displayName: 'Operation',
                        cellCondition: 'grid.appScope.fVal().formValues.isMean ? grid.appScope.fVal().formValues.complexFormulaQuoteLines[grid.appScope.rowIdx(row)].formulaOperation.id = 3 : ""',
                        cellConditionType: 'ng-init',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'FormulaOperation',
                            Type: 'dropdown',
                            masterSource: 'FormulaOperation',
                            Disabled: 'grid.appScope.fVal().formValues.isMean'
                        }
                    },
                    {
                        name: 'weight',
                        displayName: 'Weight',
                        cellCondition: 'grid.appScope.fVal().formValues.isMean',
                        cellConditionType: 'ng-disabled',
                        cellTemplate: $scope.dataTableTemplates.text
                    },
                    {
                        name: 'formulaFunction',
                        displayName: 'Function',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'FormulaFunction',
                            Type: 'dropdown',
                            masterSource: 'FormulaFunction'
                        }
                    },
                    {
                        name: 'systemInstruments[0].systemInstrument',
                        displayName: 'Instrument1',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellFilter: 'currency',
                        cellFilterValue: 'grid.appScope.fVal().formValues.currency.id',
                        cellObject: {
                            Name: 'SystemInstrument',
                            Type: 'lookup',
                            masterSource: 'SystemInstrument',
                            clc_id: 'masters_systeminstrument'
                        }
                    },
                    {
                        name: 'systemInstruments[0].marketPriceTypeId',
                        displayName: 'Price Type',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'MarketPriceType',
                            Type: 'dropdown',
                            masterSource: 'MarketPriceType'
                        }
                    },
                    {
                        name: 'systemInstruments[1].systemInstrument',
                        displayName: 'Instrument2',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellFilter: 'currency',
                        cellFilterValue: 'grid.appScope.fVal().formValues.currency.id',
                        cellObject: {
                            Name: 'SystemInstrument',
                            Type: 'lookup',
                            masterSource: 'SystemInstrument',
                            clc_id: 'masters_systeminstrument'
                        }
                    },
                    {
                        name: 'systemInstruments[1].marketPriceTypeId',
                        displayName: 'Price Type',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'MarketPriceType',
                            Type: 'dropdown',
                            masterSource: 'MarketPriceType'
                        }
                    },
                    {
                        name: 'systemInstruments[2].systemInstrument',
                        displayName: 'Instrument3',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellFilter: 'currency',
                        cellFilterValue: 'grid.appScope.fVal().formValues.currency.id',
                        cellObject: {
                            Name: 'SystemInstrument',
                            Type: 'lookup',
                            masterSource: 'SystemInstrument',
                            clc_id: 'masters_systeminstrument'
                        }
                    },
                    {
                        name: 'systemInstruments[2].marketPriceTypeId',
                        displayName: 'Price Type',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'MarketPriceType',
                            Type: 'dropdown',
                            masterSource: 'MarketPriceType'
                        }
                    },
                    {
                        name: 'formulaPlusMinus',
                        displayName: '+/-',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'FormulaPlusMinus',
                            Type: 'dropdown',
                            masterSource: 'FormulaPlusMinus'
                        }
                    },
                    {
                        name: 'amount',
                        format: 'number:3',
                        displayName: 'Amount',
                        cellTemplate: $scope.dataTableTemplates.text,
                        cellCondition: 'grid.appScope.fVal().formValues.complexFormulaQuoteLines[grid.appScope.rowIdx(row)].formulaPlusMinus.id == 3',
                        cellConditionType: 'ng-disabled',
                    },
                    {
                        name: 'formulaFlatPercentage',
                        displayName: 'Flat or Percentage',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellCondition: 'grid.appScope.fVal().formValues.complexFormulaQuoteLines[grid.appScope.rowIdx(row)].formulaPlusMinus.id == 3',
                        cellConditionType: 'ng-disabled',
                        cellObject: {
                            Name: 'FormulaFlatPercentage',
                            Type: 'dropdown',
                            masterSource: 'FormulaFlatPercentage',
                            Disabled: 'grid.appScope.fVal().formValues.complexFormulaQuoteLines[grid.appScope.rowIdx(row)].formulaPlusMinus.id == 3'
                        }
                    },
                    {
                        name: 'uom',
                        displayName: 'UOM',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellCondition: 'grid.appScope.fVal().formValues.complexFormulaQuoteLines[grid.appScope.rowIdx(row)].formulaFlatPercentage.id == 2 || grid.appScope.fVal().formValues.complexFormulaQuoteLines[grid.appScope.rowIdx(row)].formulaPlusMinus.id == 3',
                        cellConditionType: 'ng-disabled',
                        cellObject: {
                            Name: 'Uom',
                            Type: 'dropdown',
                            masterSource: 'Uom',
                            Disabled: 'grid.appScope.fVal().formValues.complexFormulaQuoteLines[grid.appScope.rowIdx(row)].formulaFlatPercentage.id == 2 || grid.appScope.fVal().formValues.complexFormulaQuoteLines[grid.appScope.rowIdx(row)].formulaPlusMinus.id == 3'
                        }
                    }
                ],
                appScopeProvider: {
                    showRow: function(row) {
                        return row.isDeleted !== true;
                    },
                    rowIdx: function(row) {
                        return row.grid.rows.indexOf(row);
                    },
                    fVal: function() {
                        return $scope;
                    },
                    addData: function(obj, index) {
                        obj = eval("$scope." + obj);
                        // count = Object.keys(obj).length;
                        var count = 0;
                        $.each(obj, (key, val) => {
                            if(!val.isDeleted) {
                                count++;
                            }
                        });

                        if (count < 3) {
                            obj.push({
                                id: 0,
                                formulaOperation: {
                                    id: $scope.formValues.isMean ? 3 : 1,
                                    name: $scope.formValues.isMean ? 'Mean' : 'Add',
                                    internalName: null,
                                    code: null
                                },
                                weight: '100',
                                formulaFunction: {
                                    id: 1,
                                    name: 'Min',
                                    internalName: null,
                                    code: null
                                },
                                systemInstruments: [ {} ]
                            });
                        } else {
                            toastr.error('Max 3 Quotes allowed');
                        }
                    },
                    cellTemplateFunc: function(row, obj) {
                        obj = eval(obj);
                        var count = Object.keys(obj).length;
                        if (count > 1) {
                            if (row.id > 0) {
                                row.isDeleted = true;
                            } else {
                                let index = $scope.formValues.complexFormulaQuoteLines.indexOf(row);
                                $scope.formValues.complexFormulaQuoteLines.splice(index, 1);
                            }
                        } else {
                            toastr.error('Min 1 Quote');
                        }
                    }
                },
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.complexFormulaQuoteLines || angular.equals($scope.formValues.complexFormulaQuoteLines, [])) {
                            $scope.formValues.complexFormulaQuoteLines = [
                                {
                                    id: 0,
                                    weight: '100',
                                    formulaFunction: {
                                        id: 1,
                                        name: 'Min',
                                        internalName: null,
                                        code: null
                                    }
                                }
                            ];
                            if (!$scope.formValues.isMean) {
                                $scope.formValues.complexFormulaQuoteLines[0].formulaOperation = {
                                    id: 1,
                                    name: 'Add',
                                    internalName: null,
                                    code: null
                                };
                            } else {
                                $scope.formValues.complexFormulaQuoteLines[0].formulaOperation = {
                                    id: 3,
                                    name: 'Mean',
                                    internalName: null,
                                    code: null
                                };
                            }
                            $scope.formValues.complexFormulaQuoteLines[0].systemInstruments = [ {} ];
                        }
                    }, 50);
                }
            },
            locations: {
                data: 'formValues.locations',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                enableColumnMenus: false,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow
                    },
                    {
                        name: 'location',
                        displayName: 'Location',
                        enableSorting: false,
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'Location',
                            Type: 'lookup',
                            masterSource: 'Location',
                            clc_id: 'masters_locationlist',
                            customNumberOfRowsAction: 'getRowNumbers(rowRenderIndex, productTypeTypeahead[rowRenderIndex], grid.appScope.fVal().formValues)'
                        },
                        required: true
                    },
                    {
                        name: 'productTypes',
                        displayName: 'Product Type',
                        width: 500,
                        enableSorting: false,
                        cellTemplate: $scope.dataTableTemplates.multiSelectCell,
                        cellObject: {
                            Name: 'ProductType',
                            Type: 'dropdown',
                            customChangeAction : 'addProductTypeMasterService(rowRenderIndex, productTypeTypeahead[rowRenderIndex], grid.appScope.fVal().formValues)',
                            masterSource: 'ProductType',
                            customNumberOfRowsProductType: 'getRowNumbersOfProductType(rowRenderIndex, productTypeTypeahead[rowRenderIndex], grid.appScope.fVal().formValues)',
                            customNumberOfRowsAction: 'getRowNumbers(rowRenderIndex, productTypeTypeahead[rowRenderIndex], grid.appScope.fVal().formValues)'
                        },
                        required: true
                    },
                    {
                        enableSorting: false,
                        name: 'createdBy.name',
                        displayName: 'Created by'
                    },
                    {
                        name: 'createdOn',
                        enableSorting: false,
                        displayName: 'Created on',
                        cellTemplate: $scope.dataTableTemplates.dateDisplay,
                        type: 'date'
                    },
                    {
                        enableSorting: false,
                        name: 'lastModifiedByUser.name',
                        displayName: 'Last Modified by'
                    },
                    {
                        enableSorting: false,
                        name: 'lastModifiedOn',
                        displayName: 'Last Modified on',
                        cellTemplate: $scope.dataTableTemplates.dateDisplay,
                        type: 'date'
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.locations) {
                            $scope.formValues = {
                                locations: [ {} ]
                            };
                        } else if (angular.equals($scope.formValues.locations, [])) {
                            $scope.formValues.locations.push({});
                        }
                    }, 10);
                }
            },
            productsSystemInstruments: {
                data: 'formValues.productsSystemInstruments',
                treeRowHeaderAlwaysVisible: true,
                headerTemplate: $templateCache.get('app-general-components/views/screen_parts/ui-grid_headerTemplate.html'),
                category: [
                    {
                        name: '1',
                        visible: true,
                        labelVisible: false
                    },
                    {
                        name: 'Benchmark Schedule Option',
                        visible: true
                    },
                    {
                        name: '2',
                        visible: true,
                        labelVisible: false
                    }
                ],
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow,
                        category: '1'
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow,
                        category: '1'
                    },
                    {
                        name: 'product',
                        displayName: 'Product',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'Product',
                            Type: 'lookup',
                            masterSource: 'Product',
                            clc_id: 'masters_productlist'
                        },
                        required: true,
                        category: '1'
                    },
                    {
                        name: 'systemInstrument',
                        displayName: 'System Instrument',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'SystemInstrument',
                            Type: 'lookup',
                            masterSource: 'SystemInstrument',
                            clc_id: 'masters_systeminstrument'
                        },
                        required: true,
                        category: '1'
                    },
                    {
                        name: 'benchmarkType',
                        displayName: '+/-',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'BenchmarkType',
                            Type: 'dropdown',
                            masterSource: 'BenchmarkType'
                        },
                        category: 'Benchmark Schedule Option'
                    },
                    {
                        name: 'benchmarkAmount',
                        displayName: 'Amount',
                        format: `number:${ vm.amount }`,
                        cellTemplate: $scope.dataTableTemplates.text,
                        category: 'Benchmark Schedule Option',
                        cellCondition: 'grid.appScope.fVal().formValues.productsSystemInstruments[grid.appScope.rowIdx(row)].benchmarkType.id == 1',
                        cellConditionType: 'ng-disabled'
                    },
                    {
                        name: 'benchmarkUom',
                        displayName: 'UOM',
                        category: 'Benchmark Schedule Option',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellCondition: 'grid.appScope.fVal().formValues.productsSystemInstruments[grid.appScope.rowIdx(row)].benchmarkType.id == 1',
                        cellConditionType: 'ng-disabled',
                        cellObject: {
                            Name: 'UOM',
                            Type: 'dropdown',
                            masterSource: 'Uom',
                            Disabled: 'grid.appScope.fVal().formValues.productsSystemInstruments[grid.appScope.rowIdx(row)].benchmarkType.id == 1'
                        },
                    },
                    {
                        name: 'isBunkerwireDefault',
                        displayName: 'Reference price 1',
                        cellTemplate: $scope.dataTableTemplates.checkbox,
                        category: '2',
                        cellCondition: 'false',
                        cellConditionType: 'ng-disabled'
                    },
                    {
                        name: 'isCargoDefault',
                        displayName: 'Reference price 2',
                        cellTemplate: $scope.dataTableTemplates.checkbox,
                        category: '2',
                        cellCondition: 'false',
                        cellConditionType: 'ng-disabled'
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.productsSystemInstruments) {
                            $scope.formValues.productsSystemInstruments = [];
                        } else if (angular.equals($scope.formValues.productsSystemInstruments, [])) {
                            $scope.formValues.productsSystemInstruments = [];
                        }
                    }, 10);
                }
            },
            locationsSystemInstruments: {
                data: 'formValues.productsLocations',
                treeRowHeaderAlwaysVisible: true,
                headerTemplate: $templateCache.get('app-general-components/views/screen_parts/ui-grid_headerTemplate.html'),
                category: [
                    {
                        name: '1',
                        visible: true,
                        labelVisible: false
                    },
                    {
                        name: 'Benchmark Schedule Option',
                        visible: true
                    },
                    {
                        name: '2',
                        visible: true,
                        labelVisible: false
                    }
                ],
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow,
                        category: '1'
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow,
                        category: '1'
                    },
                    {
                        name: 'location',
                        displayName: 'Location',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'Location',
                            Type: 'lookup',
                            masterSource: 'Location',
                            clc_id: 'masters_locationlist'
                        },
                        category: '1',
                        required: true
                    },
                    {
                        name: 'product',
                        displayName: 'Product',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'Product',
                            Type: 'lookup',
                            masterSource: 'Product',
                            clc_id: 'masters_productlist'
                        },
                        category: '1',
                        required: true
                    },
                    {
                        name: 'benchmarkType',
                        displayName: '+/-',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'BenchmarkType',
                            Type: 'dropdown',
                            masterSource: 'BenchmarkType'
                        },
                        category: 'Benchmark Schedule Option'
                    },
                    {
                        name: 'benchmarkAmount',
                        displayName: 'Amount',
                        format: `number:${ vm.amount }`,
                        cellTemplate: $scope.dataTableTemplates.text,
                        category: 'Benchmark Schedule Option',
                        cellCondition: 'grid.appScope.fVal().formValues.productsLocations[grid.appScope.rowIdx(row)].benchmarkType.id == 1',
                        cellConditionType: 'ng-disabled'
                    },
                    {
                        name: 'benchmarkUom',
                        displayName: 'UOM',
                        category: 'Benchmark Schedule Option',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellCondition: 'grid.appScope.fVal().formValues.productsLocations[grid.appScope.rowIdx(row)].benchmarkType.id == 1',
                        cellConditionType: 'ng-disabled',
                        cellObject: {
                            Name: 'UOM',
                            Type: 'dropdown',
                            masterSource: 'Uom',
                            Disabled: 'grid.appScope.fVal().formValues.productsLocations[grid.appScope.rowIdx(row)].benchmarkType.id == 1'
                        },
                    },
                    {
                        name: 'isBunkerwireDefault',
                        displayName: 'Reference price 1',
                        cellTemplate: $scope.dataTableTemplates.checkbox,
                        category: '2',
                        cellCondition: 'false',
                        cellConditionType: 'ng-disabled'
                    },
                    {
                        name: 'isCargoDefault',
                        displayName: 'Reference price 2',
                        cellTemplate: $scope.dataTableTemplates.checkbox,
                        category: '2',
                        cellCondition: 'false',
                        cellConditionType: 'ng-disabled'
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.productsLocations) {
                            $scope.formValues.productsLocations = [];
                        } else if (angular.equals($scope.formValues.productsLocations, [])) {
                            $scope.formValues.productsLocations = [];
                        }
                    }, 10);
                }
            },
            additionalCosts: {
                data: 'formValues.additionalCosts',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow
                    },
                    {
                        name: 'additionalCost',
                        displayName: 'Item Name',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'AdditionalCost',
                            Type: 'lookup',
                            masterSource: 'AdditionalCost',
                            clc_id: 'masters_additionalcostlist'
                        }
                    },
                    {
                        name: 'costType',
                        displayName: 'Type',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'CostType',
                            Type: 'lookup',
                            masterSource: 'CostType',
                            clc_id: 'masters_costtypelist'
                        }
                    },
                    {
                        name: 'amount',
                        displayName: 'Amount',
                        cellTemplate: $scope.dataTableTemplates.text,
                        format: 'number:3'
                    },
                    {
                        name: 'priceUom',
                        displayName: 'Price UOM',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'Uom',
                            Type: 'lookup',
                            masterSource: 'Uom',
                            clc_id: 'masters_uomlist',
                            Disabled: 'grid.appScope.fVal().formValues.additionalCosts[grid.appScope.rowIdx(row)].costType.name != \'Unit\'',
                            Required: 'grid.appScope.fVal().formValues.additionalCosts[grid.appScope.rowIdx(row)].costType.name == \'Unit\''
                        }
                    },
                    {
                        name: 'extrasPercentage',
                        displayName: 'Extra %',
                        cellTemplate: $scope.dataTableTemplates.text
                    },
                    {
                        name: 'currency',
                        displayName: 'Currency',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'Currency',
                            Type: 'lookup',
                            masterSource: 'Currency',
                            clc_id: 'masters_currencylist'
                        }
                    },
                    {
                        name: 'comment',
                        displayName: 'Comment',
                        cellTemplate: $scope.dataTableTemplates.text
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.additionalCosts) {
                            $scope.formValues.additionalCosts = [ {} ];
                        } else if (angular.equals($scope.formValues.additionalCosts, [])) {
                            $scope.formValues.additionalCosts.push({});
                        }
                    }, 10);
                }
            },
            marketPrices: {
                data: 'formValues.marketPrices',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: 'marketPriceType.name',
                        displayName: 'Type',
                        enableCellEdit: false
                    },
                    {
                        name: 'quotePrice',
                        displayName: 'Price',
                        format: 'number:3',
                        cellTemplate: $scope.dataTableTemplates.text,
                        ChangeAction: 'grid.appScope.fVal().formValues.marketPrices[grid.appScope.rowIdx(row)].id > 0 ? return : grid.appScope.fVal().formValues.marketPrices[grid.appScope.rowIdx(row)].id = 0'
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        $scope.getPriceTypes();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.marketPrices) {
                            $scope.formValues = {
                                marketPrices: [ {} ]
                            };
                        }
                    }, 10);
                }
            },
            productsLocations: {
                data: 'formValues.productsLocations',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow
                    },
                    {
                        name: 'location',
                        displayName: 'Location',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'Location',
                            Type: 'lookup',
                            masterSource: 'Location',
                            clc_id: 'masters_locationlist'
                        }
                    },
                    {
                        name: 'product',
                        displayName: 'Product',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellCondition: '!grid.appScope.fVal().formValues.productsLocations[grid.appScope.rowIdx(row)].location.id',
                        cellConditionType: 'ng-disabled',
                        cellObject: {
                            Name: 'Product',
                            Type: 'lookup',
                            masterSource: 'Product',
                            clc_id: 'masters_productlist'
                        }
                    },
                    {
                        name: 'createdBy.name',
                        displayName: 'Created by'
                    },
                    {
                        name: 'createdOn',
                        displayName: 'Created on',
                        cellTemplate: $scope.dataTableTemplates.dateDisplay,
                        type: 'date'
                    },
                    {
                        name: 'lastModifiedByUser.name',
                        displayName: 'Last Modified by'
                    },
                    {
                        name: 'lastModifiedOn',
                        displayName: 'Last Modified on',
                        cellTemplate: $scope.dataTableTemplates.dateDisplay,
                        type: 'date'
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.productsLocations) {
                            $scope.formValues.productsLocations = [ {} ];
                        } else if (angular.equals($scope.formValues.productsLocations, [])) {
                            $scope.formValues.productsLocations.push({});
                        }
                    }, 10);
                }
            },
            periods: {
                data: 'formValues.periods',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow
                    },
                    {
                        name: 'period',
                        displayName: 'Period Name',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'Period',
                            Type: 'lookup',
                            masterSource: 'Period',
                            clc_id: 'masters_periodlist'
                        }
                    },
                    {
                        name: 'validFrom',
                        displayName: 'Period From',
                        cellTemplate: $scope.dataTableTemplates.date
                    },
                    {
                        name: 'validTo',
                        displayName: 'Period To',
                        cellTemplate: $scope.dataTableTemplates.date
                    },
                    {
                        name: 'isDeleted',
                        displayName: 'Inactive',
                        cellTemplate: $scope.dataTableTemplates.checkbox
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.periods || angular.equals($scope.formValues.periods, [])) {
                            $scope.formValues.periods = [ {} ];
                        }
                    }, 10);
                }
            },
            conditions: {
                data: 'formValues.conditions',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow
                    },
                    {
                        name: 'day',
                        displayName: 'Days',
                        cellTemplate: $scope.dataTableTemplates.text
                    },
                    {
                        name: 'isDayOfMonth',
                        displayName: 'Day of the month',
                        cellTemplate: $scope.dataTableTemplates.checkbox,
                        cellConditionType: 'ng-change',
                        cellCondition: 'refreshSelect()'
                    },
                    {
                        name2: 'conditionTypeMonth',
                        name: 'conditionTypeDay',
                        displayName: 'Condition ',
                        cellTemplate: $scope.dataTableTemplates.multiDropdown,
                        cellObject: {
                            Name: 'ConditionTypeMonth',
                            Type: 'dropdown',
                            masterSource: 'ConditionTypeMonth'
                        },
                        cellObject2: {
                            Name: 'ConditionTypeDay',
                            Type: 'dropdown',
                            masterSource: 'ConditionTypeDay'
                        }
                    },
                    {
                        name: 'event',
                        displayName: 'Event ',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'Event',
                            Type: 'lookup',
                            masterSource: 'Event',
                            clc_id: 'masters_eventlist'
                        }
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.conditions || angular.equals($scope.formValues.conditions, [])) {
                            $scope.formValues.conditions = [ {} ];
                        }
                    }, 10);
                }
            },
            holidays: {
                data: 'formValues.holidays',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow
                    },
                    {
                        name: 'date',
                        displayName: 'Holiday Date',
                        cellTemplate: $scope.dataTableTemplates.date,
                        cellObject: {
                            type: 'date',
                            unique: true
                        }
                    },
                    {
                        name: 'name',
                        displayName: 'Holiday Name',
                        cellTemplate: $scope.dataTableTemplates.text
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.holidays || angular.equals($scope.formValues.holidays, [])) {
                            $scope.formValues.holidays = [ {} ];
                        }
                    }, 10);
                }
            },
            sealNumber: {
                data: 'formValues.labSealNumberInformation',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                treeRowHeaderAlwaysVisible: true,
                headerTemplate: $templateCache.get('app-general-components/views/screen_parts/ui-grid_headerTemplate.html'),
                category: [
                    {
                        name: '1',
                        visible: true,
                        labelVisible: false
                    },
                    {
                        name: 'Seal Numbers',
                        visible: true
                    }
                ],
                columnDefs: [
                    {
                        name: 'sampleDetail.name',
                        displayName: 'Sample Details',
                        category: '1'
                    },
                    {
                        name: 'quantity',
                        displayName: 'Qty',
                        tenantFormat: 'quantity', // quantity or amount
                        cellTemplate: $scope.dataTableTemplates.tenantFormattedText,
                        category: '1'
                    },
                    {
                        name: 'sealNumberLab',
                        // override cell model with custom src
                        displayName: 'Labs',
                        category: 'Seal Numbers',
                        cellTemplate: $scope.dataTableTemplates.doubleRow,
                        custom_src: 'labSealNumbers'
                    },
                    {
                        name: 'sealNumberSupplier',
                        // override cell model with custom src
                        displayName: 'Supplier',
                        category: 'Seal Numbers',
                        cellTemplate: $scope.dataTableTemplates.doubleRow,
                        custom_src: 'labSealNumbers'
                    }
                ],
                onRegisterApi: function(api) {
                    api.core.on.rowsRendered($scope, () => {
                        api.core.handleWindowResize().then(() => {
                            $('#grid_sealNumber > div.ui-grid-contents-wrapper > div.ui-grid-render-container > div.ui-grid-viewport > div.ui-grid-canvas > .ui-grid-row').each((index, elm) => {
                                if ($(elm).find('input').length > 2) {
                                    $(elm).addClass('double-cells');
                                } else {
                                    $(elm).addClass('single-cells');
                                }
                            });
                        });
                    });
                }
            },
            specGroupParameters: {
                data: 'formValues.specGroupParameters',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow
                    },
                    {
                        name: '   ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow
                    },
                    {
                        name: 'specParameter',
                        displayName: 'Spec Parameter',
                        cellTemplate: $scope.dataTableTemplates.lookup,
                        cellObject: {
                            Name: 'specparameter',
                            Type: 'lookup',
                            masterSource: 'SpecParameter',
                            clc_id: 'masters_specparameterlist',
                            customChangeAction: 'specParamChanged(rowRenderIndex, grid.appScope.fVal().formValues)'
                        }
                    },
                    {
                        name: 'min',
                        displayName: 'Min',
                        cellTemplate: $scope.dataTableTemplates.text
                    },
                    {
                        name: 'max',
                        displayName: 'Max',
                        cellTemplate: $scope.dataTableTemplates.text
                    },
                    {
                        name: 'uom',
                        displayName: 'UOM'
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.specGroupParameters || angular.equals($scope.formValues.specGroupParameters, [])) {
                            $scope.formValues.specGroupParameters = [ {} ];
                        }
                    }, 10);
                }
            },
            claimNotes: {
                data: 'formValues.claimNotes',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow
                    },
                    {
                        name: 'claimNote',
                        displayName: 'Claim Notes',
                        cellTemplate: $scope.dataTableTemplates.text
                    },
                    {
                        name: 'createdBy.name',
                        width: 200,
                        displayName: 'Added By',
                        enableCellEdit: false
                    },
                    {
                        name: 'createdOn',
                        width: 150,
                        displayName: 'Date & Time',
                        cellTemplate: $scope.dataTableTemplates.dateDisplay,
                        enableCellEdit: false
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {}) || !$scope.formValues.claimNotes) {
                            $scope.formValues.claimNotes = [];
                            if (!$scope.entity_id) {
                                $scope.formValues.isEditable = true;
                            }
                        }
                    }, 10);
                }
            },
            quantitySubtypes: {
                data: 'formValues.quantitySubtypes',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow
                    },
                    {
                        name: 'specParameter.name',
                        displayName: 'Parameter',
                        enableCellEdit: false
                    },
                    {
                        name: 'sellerQuantity',
                        displayName: 'Seller quantity',
                        enableCellEdit: false,
                        // ChangeAction: "grid.appScope.fVal().checkClaimType()",
                        BlurAction: 'grid.appScope.fVal().checkClaimType()',
                        cellTemplate: $scope.dataTableTemplates.text,
                        format: `number:${vm.quantity}`
                    },
                    {
                        name: 'buyerQuantity',
                        displayName: 'Buyer quantity',
                        enableCellEdit: false,
                        // ChangeAction: "grid.appScope.fVal().checkClaimType()",
                        BlurAction: 'grid.appScope.fVal().checkClaimType()',
                        cellTemplate: $scope.dataTableTemplates.text,
                        format: `number:${vm.quantity}`
                    },
                    {
                        name: 'quantityUom',
                        displayName: 'UOM',
                        enableCellEdit: false,
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        // ChangeAction: "grid.appScope.fVal().checkClaimType()",
                        BlurAction: 'grid.appScope.fVal().checkClaimType()',
                        cellObject: {
	                        changeEvent: 'grid.appScope.fVal().checkClaimType()',
                            Name: 'Uom',
                            Type: 'dropdown',
                            masterSource: 'Uom',
                            required: false
                        }
                    },
                    {
                        name: 'reconStatus',
                        displayName: 'Recon status',
                        enableCellEdit: false,
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'reconStatus',
                            Type: 'dropdown',
                            masterSource: 'ReconMatch',
                            required: false
                        }
                    },
                    {
                        name: 'claimAppreciation',
                        displayName: 'Out Of Limit Appreciation',
                        cellTemplate: $scope.dataTableTemplates.dropdownDisplayName,
                        cellObject: {
                            Name: 'claimAppreciation',
                            Type: 'dropdown',
                            masterSource: 'ClaimAppreciation',
                            required: false
                        }
                    },
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {})) {
                            $scope.formValuesquantitySubtypes = [];
                        }
                        if (!$scope.formValues.quantitySubtypes) {
                            $scope.formValues.quantitySubtypes = [];
                        }
                    }, 10);
                }
            },
            densitySubtypes: {
                data: 'formValues.densitySubtypes',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow
                    },
                    {
                        name: 'specParameter.name',
                        displayName: 'Parameter',
                        enableCellEdit: false
                    },
                    {
                        name: 'bdnDensity',
                        displayName: 'BDN density',
                        enableCellEdit: false,
                        cellTemplate: $scope.dataTableTemplates.text,
                        BlurAction: 'formattedData(rowRenderIndex, grid.appScope.fVal().formValues)',
                        ChangeAction: 'computeDensityDifference(rowRenderIndex, grid.appScope.fVal().formValues)',
                        format: `number:${vm.quantity}`
                    },
                    {
                        name: 'labDensity',
                        displayName: 'Lab density',
                        enableCellEdit: false,
                        cellTemplate: $scope.dataTableTemplates.text,
                        BlurAction: 'formattedData(rowRenderIndex, grid.appScope.fVal().formValues)',
                        ChangeAction: 'computeDensityDifference(rowRenderIndex, grid.appScope.fVal().formValues)',
                        format: `number:${vm.quantity}`
                    },
                    {
                        name: 'densityDifference',
                        displayName: 'Density difference',
                        enableCellEdit: false
                    },
                    {
                        name: 'claimAppreciation',
                        displayName: 'Out Of Limit Appreciation',
                        cellTemplate: $scope.dataTableTemplates.dropdownDisplayName,
                        cellObject: {
                            Name: 'claimAppreciation',
                            Type: 'dropdown',
                            masterSource: 'ClaimAppreciation',
                            required: false
                        }
                    },
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {})) {
                            $scope.formValues.densitySubtypes = [];
                        }
                        if (!$scope.formValues.densitySubtypes) {
                            $scope.formValues.densitySubtypes = [];
                        }
                    }, 10);
                }
            },
            qualitySubtypes: {
                data: 'formValues.qualitySubtypes',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow
                    },
                    {
                        name: 'specParameter.name',
                        displayName: 'Parameter',
                        enableCellEdit: false
                    },
                    {
                        name: 'specParameterUom',
                        displayName: 'UOM',
                        enableCellEdit: false
                    },
                    {
                        name: 'minValue',
                        displayName: 'Min Value',
                        enableCellEdit: false,
                        cellTemplate: $scope.dataTableTemplates.text,
                        format: `number:${vm.quantity}`
                    },
                    {
                        name: 'maxValue',
                        displayName: 'Max Value',
                        enableCellEdit: false,
                        cellTemplate: $scope.dataTableTemplates.text,
                        format: `number:${vm.quantity}`
                    },
                    {
                        name: 'testValue',
                        displayName: 'Test Value',
                        enableCellEdit: false,
                        cellTemplate: $scope.dataTableTemplates.text,
                        format: `number:${vm.quantity}`,
                        ChangeAction: 'clearTestValueNull(rowRenderIndex, grid.appScope.fVal().formValues)'
                    },
                    {
                        name: 'claimAppreciation',
                        displayName: 'Out Of Limit Appreciation',
                        cellTemplate: $scope.dataTableTemplates.dropdownDisplayName,
                        cellObject: {
                            Name: 'claimAppreciation',
                            Type: 'dropdown',
                            masterSource: 'ClaimAppreciation',
                            required: false
                        }
                    },
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {})) {
                            $scope.formValues = {
                                qualitySubtypes: []
                            };
                        }
                        if (!$scope.formValues.qualitySubtypes) {
                            $scope.formValues.qualitySubtypes = [];
                        }
                    }, 10);
                }
            },
            complianceSubtypes: {
                data: 'formValues.complianceSubtypes',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow
                    },
                    {
                        name: 'specParameter.name',
                        displayName: 'Parameter',
                        enableCellEdit: false
                    },
                    {
                        name: 'specParameterUom',
                        displayName: 'UOM',
                        enableCellEdit: false
                    },
                    {
                        name: 'minValue',
                        displayName: 'Min Value',
                        enableCellEdit: false,
                        cellTemplate: $scope.dataTableTemplates.text,
                        format: `number:${vm.quantity}`
                    },
                    {
                        name: 'maxValue',
                        displayName: 'Max Value',
                        enableCellEdit: false,
                        cellTemplate: $scope.dataTableTemplates.text,
                        format: `number:${vm.quantity}`
                    },
                    {
                        name: 'testValue',
                        displayName: 'Test Value',
                        enableCellEdit: false,
                        cellTemplate: $scope.dataTableTemplates.text,
                        format: `number:${vm.quantity}`,
                        ChangeAction: 'clearTestValueNull(rowRenderIndex, grid.appScope.fVal().formValues)'
                    },
                    {
                        name: 'claimAppreciation',
                        displayName: 'Out Of Limit Appreciation',
                        cellTemplate: $scope.dataTableTemplates.dropdownDisplayName,
                        cellObject: {
                            Name: 'claimAppreciation',
                            Type: 'dropdown',
                            masterSource: 'ClaimAppreciation',
                            required: false
                        }
                    },
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {})) {
                            $scope.formValues = {
                                complianceSubtypes: []
                            };
                        }
                        if (!$scope.formValues.complianceSubtypes) {
                            $scope.formValues.complianceSubtypes = [];
                        }
                    }, 10);
                }
            },
            exchangeRateDetails: {
                data: 'formValues.exchangeRateDetails',
                multiSelect: false,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 999,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: ' ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.addRow,
                        headerCellTemplate: $scope.dataTableTemplates.addRow
                    },
                    {
                        name: '  ',
                        width: 40,
                        enableCellEdit: false,
                        enableSorting: false,
                        cellClass: 'actionsCol',
                        cellTemplate: $scope.dataTableTemplates.remRow
                    },
                    {
                        name: 'date',
                        displayName: 'Date',
                        cellTemplate: $scope.dataTableTemplates.date,
                        required: true
                    },
                    {
                        name: 'currency',
                        displayName: 'Currency',
                        cellTemplate: $scope.dataTableTemplates.dropdown,
                        cellObject: {
                            Name: 'Currency',
                            Type: 'dropdown',
                            masterSource: 'Currency',
                            required: true
                        }
                    },
                    {
                        name: 'exchangeRateValue',
                        displayName: 'Exchangez Rate',
                        format: 'number:4',
                        cellTemplate: $scope.dataTableTemplates.text,
                        required: true
                    }
                ],
                onRegisterApi: function(api) {
                    setTimeout(() => {
                        api.core.handleWindowResize();
                        if (angular.equals($scope.formValues, {})) {
                            $scope.formValues = {
                                exchangeRateDetails: [ {} ]
                            };
                        }
                        if (!$scope.formValues.exchangeRateDetails) {
                            $scope.formValues.exchangeRateDetails = [ {} ];
                        }
                    }, 10);
                }
            },
            related_labs: {
                data: 'formValues.orderRelatedLabResults',
                multiSelect: true,
                noUnselect: true,
                rowHeight: 40,
                excessRows: 0,
                rowEditWaitInterval: -1, // Important for skipping the promise
                columnDefs: [
                    {
                        name: ' ',
                        displayName: ' ',
                        cellName: 'labResults',
                        cellParams: true,
                        cellAction:'grid.appScope.em(row, rowRenderIndex)',
                        cellTemplate: $scope.dataTableTemplates.checkbox,
                        cellCondition: 'false',
                        cellConditionType: 'ng-disabled',
                        field: 'isSelected'
                    },
                    {
                        name: 'id',
                        displayName: 'Lab Result ID',
                        cellTemplate: $scope.dataTableTemplates.link,
                        cellLink: '#/labs/labresult/edit/',
                        required: true
                    },
                    {
                        name: 'labCounterparty',
                        displayName: 'Lab CounterParty',
                        required: true,
                        width: 300
                    },
                    {
                        name: 'labStatus',
                        displayName: 'Lab Status',
                        cellTemplate: $scope.dataTableTemplates.colorCodedStatus,
                        required: true
                    },
                    {
                        name: 'resultDate',
                        displayName: 'Result Date',
                        cellTemplate: $scope.dataTableTemplates.dateDisplay,
                        required: true
                    },
                    {
                        name: 'testType',
                        displayName: 'Test Type',
                        required: true
                    },
                    {
                        name: 'product',
                        displayName: 'Product',
                        cellTemplate: $scope.dataTableTemplates.decodeText,
                        required: true
                    },
                    {
                        name: 'reconStatus',
                        displayName: 'Recon Status',
                        cellTemplate: $scope.dataTableTemplates.colorCodedStatus,
                        required: true,
                    }
                ],
                onRegisterApi: function(api) {
                    $('#grid_related_labs').hide();
                    api.core.on.rowsRendered($scope, () => {
                        api.core.handleWindowResize().then(() => {
                            let height = Math.min(Math.max(api.grid.rows.length * 60, 80), 220);
                            $('#grid_related_labs').css('height', `${height }px`).show();
                            if (api.grid.rows.length < 5) {
                                $('#grid_related_labs').css('pointer-events', 'none');
                            } else {
                                $('#grid_related_labs').css('pointer-events', '');
                            }
                        });
                    });
                }
            }
        };
        $scope.selectedRowIds = [];
        $scope.selectRowsByType = function(row) {};

        var decodeHtmlEntity = function(str) {
            return str.replace(/&#(\d+);/g, function(match, dec) {
                return String.fromCharCode(dec);
            });
        };
        
        $scope.addClaimData = function(obj, spec, objKey) {
        	if (!$scope.formValues.orderDetails.product) {
        		toastr.error('Please select a product first');
        		return;
        	}
            spec = angular.fromJson(spec);
            spec.specParameter.name = decodeHtmlEntity(_.unescape(spec.specParameter.name));
            var id = spec.specParameter.id;
    		if (typeof $scope.formValues[objKey] == 'undefined') {
    			$scope.formValues[objKey] = [];
    		}
            obj = $scope.formValues[objKey];
            var addedAlready = new Array();
            $.each(obj, (key, val) => {
                if (!val.isDeleted) {
                    if (typeof val.specParameter == 'undefined') {
                        val.specParameter = {};
                    }
                    addedAlready.push(val.specParameter.id);
                }
            });
            if (typeof obj == 'undefined') {
            	obj = [];
            }
            if (spec) {
                if ($.inArray(id, addedAlready) == -1) {
                    obj.push(angular.fromJson(spec));
                } else {
                    toastr.error('Please check the list.');
                }
            } else {
                obj.push({
                    id: 0
                });
            }
            console.log(obj);
            if (obj.length == 1) {
                $scope.formValues.claimType.quantityShortage = obj[0].quantityShortage;
            }
        	if (!$scope.formValues.claimDetails.isEstimatedSettlementAmountManual) {
                $scope.getQuantityShortage();
            }
            var subTypeObjects = [ 'quantitySubtypes', 'densitySubtypes', 'qualitySubtypes', 'complianceSubtypes' ];
            $.each(subTypeObjects, (stk, stv) => {
            	if (stv != objKey) {
			    		if (typeof $scope.formValues[stv] == 'undefined') {
			    			$scope.formValues[stv] = [];
			    		}
			            for (let i = $scope.formValues[stv].length - 1; i >= 0; i--) {
			            	if ($scope.formValues[stv][i].id) {
			            		$scope.formValues[stv][i].isDeleted = true;
			            	} else {
			            		$scope.formValues[stv].splice(i, 1);
			            	}
			            }
            	}
                // If density subtype then on each new addition take retested density as lab density if available
                if(stv == 'densitySubtypes') {
                    for (let k = 0; k <= $scope.formValues[stv].length - 1; k++) {
                        if ($scope.formValues.claimType.retestedDensity) {
                            $scope.formValues[stv][k].labDensity = $scope.formValues.claimType.retestedDensity;
                            $scope.computeDensityDifference(0, $scope.formValues);
                        }
                    }
                }
            });
        };
        $scope.removeData = function(obj, index) {
            obj = eval(obj);
            obj.splice(index, 1);
        };
        $scope.deleteGroup = function(obj, group) {
            obj = eval(obj);
            delete obj[group];
        };
	    $rootScope.$on('adminConfiguration', (ev, data) => {
	    	$scope.adminConfiguration = data;
	    });
        vm.getOptions = function(field) {
            // Move this somewhere nice and warm
            var objectByString = function(obj, string) {
                if (string.includes('.')) {
                    return objectByString(obj[string.split('.', 1)], string.replace(`${string.split('.', 1) }.`, ''));
                }
                return obj[string];
            };
            if (field) {
                if (!$scope.options) {
                    $scope.options = [];
                }
                Factory_Master.get_master_list(vm.app_id, vm.screen_id, field, (callback) => {
                    if (callback) {
                        if ($scope.options[field.Name]) {
                            return;
                        }
                        $scope.options[field.Name] = callback;
                        $scope.$watchGroup([ $scope.formValues, $scope.options ], () => {
                            $timeout(() => {
                                var id;
                                if (field.Type == 'textUOM') {
                                    id = `#${ field.Name}`;
                                } else {
                                    id = `#${ field.masterSource }${field.Name}`;
                                }
                                if ($(id).data('val')) {
                                    $(id).val($(id).data('val'));
                                }
                            }, 50);
                        });
                    }
                });
            }
        };

        // Get market price types
        $scope.getPriceTypes = function() {
            Factory_Master.getPriceTypes(vm.app_id, 'priceTypes', (callback) => {
                if (callback) {
                    var pricetypesDef = $scope.formValues.marketPrices;
                    var pricetypesNew = [];
                    $.each(callback, (key, val) => {
                        pricetypesNew[key] = {};
                        pricetypesNew[key].marketPriceType = val.marketPriceType;
                    });
                    if (!$scope.isEdit) {
                        angular.merge($scope.formValues.marketPrices, pricetypesNew);
                    }
                }
            });
        };
        $scope.fVal = function(id) {
            return $scope;
        };
        $scope.rowIdx = function(row) {
            return row.grid.rows.indexOf(row);
        };
        $scope.calcQualityClaimType = function($event, productIdx, rowRenderIndex) {
        	$rootScope.selectedLabResults_claimId = null;
            var raiseNoteButton = angular.element(document).find(`#Product_${ productIdx }_Raise_Quality_Note`);
            var currentTableCheckboxes = angular.element(document).find('input[name^=\'labResults\']');
            // $scope.labResults_claimId;
            var currentSelectionClaimIds = [];
            var loopClaimTypeIds = [];
            $.each($event.entity.claimTypes, (k, v) => {
            	currentSelectionClaimIds.push(v.id);
            });
            // if (typeof($scope.labResults_claimId) == 'undefined') {
            // }
            	$scope.labResults_claimId = [];
            var currentChecksNo = 0;
            $scope.labResults_specParamIds = [];
            $.each(currentTableCheckboxes, function() {
                loopClaimTypeIds = [];
                if ($(this).attr('spec-selection')) {
                    $.each(JSON.parse($(this).attr('spec-selection')), (k, v) => {
                        loopClaimTypeIds.push(v.id);
                    });
                } else {
                    $(this).attr('disabled', 'disabled');
                }

                if ($scope.labResults_claimId.length == 0 || $scope.checkIfAtLeastOneElementIsInArray(loopClaimTypeIds, $scope.labResults_claimId)) {
	                if ($(this).is(':checked')) {
	                    currentChecksNo = currentChecksNo + 1;
	                    $.each(loopClaimTypeIds, (lctk, lctv) => {
	                    	$scope.labResults_claimId.push(lctv);
	                    });
	                    $scope.labResults_specParamIds.push($(this).attr('spec-param-id'));
	                }
                }
            });
            if (currentChecksNo > 0) {
                $.each(currentTableCheckboxes, function() {
                	loopClaimTypeIds = [];
                    if ($(this).attr('spec-selection')) {
                        $.each(JSON.parse($(this).attr('spec-selection')), (k, v) => {
                            loopClaimTypeIds.push(v.id);
                        });
                    }

                    if (!$scope.checkIfAtLeastOneElementIsInArray(loopClaimTypeIds, $scope.labResults_claimId)) {
                        $(this).attr('disabled', 'disabled');
                    }
                });
            } else {
                $.each(currentTableCheckboxes, function() {
                    $(this).removeAttr('disabled');
	                loopClaimTypeIds = [];
                    if (!$(this).attr('spec-selection')) {
                        $(this).attr('disabled', 'disabled');
                    }
                });
            }
        };

        $scope.updateDateAndTime = function(row) {
            row.createdAt =  moment().format();
        }

        $scope.detectCurrentUser = function(values, index) {
            if (values[index] && values[index].createdBy && $rootScope.user) {
                return $rootScope.user.name != values[index].createdBy.name ? true : false;
            }
            return false;
        }

        $scope.checkIfAtLeastOneElementIsInArray = function(needle, haystack) {
            var isInArray = false;
        	$.each(needle, (nk, nv) => {
	        	$.each(haystack, (hk, hv) => {
	        		if (nv == hv) {
			        	isInArray = true;
	        		}
	        	});
        	});
        	return isInArray;
        };

        $scope.selectReconRow = function(row, index) {
            $scope.selectedReconProduct = row.entity.deliveryProductId;
            $scope.isSelectedRow = index;
        };
        $scope.specParamChanged = function(rowIndex, fval) {
            var val = fval.specGroupParameters[rowIndex].specParameter.id;
            Factory_Master.get_master_entity(val, 'specparameter', 'masters', (response) => {
                if (response) {
                    $scope.formValues = $rootScope.formValuesLoaded;
                    $scope.formValues.specGroupParameters[rowIndex].uom = response.uom;
                }
            });
        };

        $scope.getRowNumbers = function(rowIdx, item, fVal) {
            if (vm.app_id == 'masters' && vm.screen_id == 'service') {
                let currentRowIdx = 0;
                for (let i = 0; i < fVal.locations.length; i++) {
                    if (i < rowIdx && !fVal.locations[i].isDeleted) {
                        currentRowIdx ++ ;
                    }

                }
                return currentRowIdx + 1;
            } else if (vm.app_id == 'masters' && vm.screen_id == 'strategy') {
                let currentRowIdx = 0;
                for (let i = 0; i < fVal.mtmFormulaProducts.length; i++) {
                    if (i < rowIdx && !fVal.mtmFormulaProducts[i].isDeleted) {
                        currentRowIdx ++ ;
                    }

                }
                return currentRowIdx + 1;
            }
            return rowIdx + 1;
        }

        $scope.getRowNumbersOfProductType = function(rowIdx, item, fVal) {
            if (vm.app_id == 'masters' && vm.screen_id == 'service') {
                let number = _.filter(fVal.locations[rowIdx].productTypes, function(object) {
                    return !object.isDeleted;
                })
                if (!number.length) {
                    return true;
                }
                return false;
            }
        }

        $scope.addProductTypeMasterService = function(rowIdx, item, fVal) {
            if (!item) {
                toastr.warning('Please select a product type');
                return;
            }
            if (!item.name) {
                toastr.warning('Please select a valid product type');
                return;
            }
            if (!fVal.locations[rowIdx].productTypes) {
                fVal.locations[rowIdx].productTypes = [];
            }
            var itemExists = _.find(fVal.locations[rowIdx].productTypes, (el) => {
                return el.productType.id == item.id;
            });
            if (itemExists) {
                if (itemExists.isDeleted != true) {
                    toastr.warning('This product type is already added');
                    return;
                }
            }
            var itemToAdd = angular.copy(item);
            itemToAdd.id = 0;
            itemToAdd.productType = item;

            if (itemExists) {
                if (itemExists.isDeleted == true) {
                    itemExists.isDeleted = false;
                    $('.multiselectcell-wrapper .multiselect-typeahead').val('');
                    return;
                }
            }
            fVal.locations[rowIdx].productTypes.push(itemToAdd);
            $('.multiselectcell-wrapper .multiselect-typeahead').val('');
        };

        $scope.removeProductTypeMasterService = function(rowIndex, productTypeKey) {
            var scope = angular.element($('entity-edit-form > div')).scope();
            if (scope.formValues.locations[rowIndex].productTypes[productTypeKey].id == 0) {
                scope.formValues.locations[rowIndex].productTypes.splice(productTypeKey, 1);
            } else {
                scope.formValues.locations[rowIndex].productTypes[productTypeKey].isDeleted = true;
            }
        };


        $('body').on('click', '.removeProductTypeMasterService', (el) => {
            $('.multiselectcell-show-all-tags').popover('hide');
            let rowIndex = $(el.currentTarget).attr('row-index');
            let productTypeKey = $(el.currentTarget).attr('product-type-key');
            let productTypeId = $(el.currentTarget).attr('product-type-id');
            var scope = angular.element($('entity-edit-form > div')).scope();
            $.each(scope.formValues.locations[rowIndex].productTypes, (k, v) => {
                if (v) {
                    if (v.productType.id == parseFloat(productTypeId)) {
                        scope.$apply(() => {
                            if (scope.formValues.locations[rowIndex].productTypes[k].id == 0) {
                                scope.formValues.locations[rowIndex].productTypes.splice(k, 1);
                            } else {
                                scope.formValues.locations[rowIndex].productTypes[k].isDeleted = true;
                            }
                        });
                        $(el.currentTarget).parent().remove();
                        $compile($(el.currentTarget).parents('.multiselectcell-wrapper'))(scope);
                        $scope.initMultiselectPopover();
                    }
                }
            });
        });

        $scope.$watch('formValues.temp.sellectedRow', (newVal, oldVal) => {
            // console.log(newVal, oldVal);

        	// alert('hey, myVar has changed!');
        });

        $scope.showVesselVoyageDetails = function(vesselVoyageDetailId) {
            Factory_Master.getVesselVoyageBunkeringDetails(vesselVoyageDetailId, (response) => {
                if (response) {
                    if (!response.payload || response.payload.length === 0) {
                        toastr.error('There are no vessel voyage details available');
                        return;
                    }
                    $scope.vesselVoyageDetails = response.payload;
                    var tpl = $templateCache.get('app-masters/views/vessel_voyage_details.html');
                    $scope.modalInstance = $uibModal.open({
                        template: tpl,
                        appendTo: angular.element(document.getElementsByClassName('page-container')),
                        windowTopClass: 'fullWidthModal',
                        // windowClass: 'limited-max-height',
                        scope: $scope
                    });
                }
            });
        };
    }
]);
