import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellEditableComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-editable.component';
import { GridOptions } from 'ag-grid-community';
import { IInvoiceDetailsItemBaseInfo, IInvoiceDetailsItemCounterpartyDetails, IInvoiceDetailsItemDto, IInvoiceDetailsItemInvoiceCheck, IInvoiceDetailsItemInvoiceSummary, IInvoiceDetailsItemOrderDetails, IInvoiceDetailsItemPaymentDetails, IInvoiceDetailsItemProductDetails, IInvoiceDetailsItemRequest, IInvoiceDetailsItemRequestInfo, IInvoiceDetailsItemResponse, IInvoiceDetailsItemStatus, InvoiceFormModel } from '../../../services/api/dto/invoice-details-item.dto';
import { InvoiceCompleteService } from '../../../services/invoice-complete.service';
import { InvoiceDetailsService } from '../../../services/invoice-details.service';

@Component({
  selector: 'shiptech-invoice-detail',
  templateUrl: './invoice-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceDetailComponent implements OnInit, OnDestroy {
  buttonToggleData = { names: ['Final', 'Provisional', 'Credit', 'Debit'] }

  _entityId;
  activeBtn = 'Final';

  public gridOptions_data: GridOptions;
  public gridOptions_ac: GridOptions;
  public chipData =[
    {Title:'Title 1', Data:'Data 1234'},
    {Title:'Title 2', Data:'Data 1234'},
    {Title:'Title 3', Data:'Data 1234'},
    {Title:'Title 4', Data:'Data 1234'},
    {Title:'Title 5', Data:'Data 1234'},
    {Title:'Title 6', Data:'Data 1234'},
    {Title:'Title 7', Data:'Data 1234'},
    {Title:'Title 8', Data:'Data 1234'},
    {Title:'Title 9', Data:'Data 1234'}
  ]

  private columnDef_aggrid = [
    {
      resizable: false,
      width: 30,
      suppressMenu: true,
      headerName: "",
      headerClass: ['aggridtextalign-center'],
      headerComponentParams: {
        template: `<span  unselectable="on">
             <div class="add-btn"></div>
             <span ref="eMenu"></span>`
      },
      cellClass: ['aggridtextalign-left'],
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: { type: 'row-remove-icon' }
    },
    {
      headerName: 'Delivery No. / Order Product', editable: true, headerTooltip: 'Delivery No. / Order Product', field: 'cost', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-dropdown', label: 'cost-type', items: ['Pay', 'Receive'] }
    },
    {
      headerName: 'Deliv Product', headerTooltip: 'Deliv Product', field: 'name', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-autocomplete', label: 'cost-name' }
    },
    {
      headerName: 'Deliv. Qty', headerTooltip: 'Deliv. Qty', field: 'provider', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-autocomplete', label: 'service-provider' }
    },
    {
      headerName: 'Estd. Rate', editable: true, headerTooltip: 'Estd. Rate', field: 'type', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-dropdown', label: 'rate-type', items: ['Flat', 'Option 2'] }
    },
    { headerName: 'Amount', headerTooltip: 'Amount', field: 'currency' },
    { headerName: 'Invoice Product', headerTooltip: 'Invoice Product', field: 'name' },
    { headerName: 'Invoice Qty', headerTooltip: 'Invoice Qty', field: 'name' },
    { headerName: 'Invoice Rate', headerTooltip: 'Invoice Rate', field: 'name' },
    { headerName: 'Amount', headerTooltip: 'Amount', field: 'name' },
    { headerName: 'Recon status', headerTooltip: 'Recon status', field: 'name' },
    { headerName: 'Sulpher content', headerTooltip: 'Sulpher content', field: 'name' }
    // { headerName: 'Phy. supplier', headerTooltip: 'Phy. supplier', field: 'name' },
    // { headerName: 'Rate', editable: true, singleClickEdit: true, headerTooltip: 'Rate', field: 'rate', type: "numericColumn", cellClass: ['aggridtextalign-right editable-cell cell-align'] },
    // { headerName: 'UOM', headerTooltip: 'UOM', field: 'uom' },
    // { headerName: 'Invoice ID', headerTooltip: 'Invoice ID', field: 'id' },
  ];

  private columnDef_aggrid_ac = [
    {
      resizable: false,
      width: 30,
      suppressMenu: true,
      headerName: "",
      headerClass: ['aggridtextalign-center'],
      headerComponentParams: {
        template: `<span  unselectable="on">
             <div class="add-btn"></div>
             <span ref="eMenu"></span>`
      },
      cellClass: ['aggridtextalign-left'],
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: { type: 'row-remove-icon' }
    },
    {
      headerName: 'Item', editable: true, headerTooltip: 'Item', field: 'cost', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-dropdown', label: 'cost-type', items: ['Pay', 'Receive'] }
    },
    {
      headerName: 'Cost Type', headerTooltip: 'Cost Type', field: 'name', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-autocomplete', label: 'cost-name' }
    },
    {
      headerName: '%of', headerTooltip: '% of', field: 'provider', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-autocomplete', label: 'service-provider' }
    },
    {
      headerName: 'BDN Qty', editable: true, headerTooltip: 'BDN Qty', field: 'type', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-dropdown', label: 'rate-type', items: ['Flat', 'Option 2'] }
    },
    { headerName: 'Estd. Rate', headerTooltip: 'Estd. Rate', field: 'currency' },
    { headerName: 'Amount', headerTooltip: 'Amount', field: 'name' },
    { headerName: 'Extra %', headerTooltip: 'Extra %', field: 'name' },
    { headerName: 'ExtraAmt', headerTooltip: 'ExtraAmt', field: 'name' },
    { headerName: 'Amount', headerTooltip: 'Amount', field: 'name' },
    { headerName: 'Total', headerTooltip: 'Total', field: 'name' },
    { headerName: 'Invoice Qty', headerTooltip: 'Invoice Qty', field: 'name' },
    { headerName: 'Invoice Rate', headerTooltip: 'Invoice Rate', field: 'name' },
    { headerName: 'Amount', headerTooltip: 'Amount', field: 'name' },
    { headerName: 'Extra%', headerTooltip: 'Extra%', field: 'name' },
    { headerName: 'ExtraAmt', headerTooltip: 'ExtraAmt', field: 'name' },
    { headerName: 'Total', headerTooltip: 'Total', field: 'name' },
    { headerName: 'Difference', headerTooltip: 'Difference', field: 'name' }
  ];

  private rowData_aggrid = [
    {
      type: 'Flat', provider: 'Kinder Morgan', currency: 'USD', rate: '100', cost: 'Pay', name: 'Barging', id: "", uom: "GAL"
    }
  ]

  formValues: IInvoiceDetailsItemDto = {
    sellerInvoiceNo: 0,
    documentNo: 0,
    invoiceId: 0,
    documentType: <IInvoiceDetailsItemBaseInfo>{},
    canCreateFinalInvoice: false,
    receivedDate: '',
    dueDate: '',
    manualDueDate: '',
    accountNumber: 0,
    workingDueDate: '',
    sellerInvoiceDate: '',
    sellerDueDate: '',
    approvedDate: '',
    paymentDate: '',
    accountancyDate: '',
    invoiceRateCurrency: <IInvoiceDetailsItemBaseInfo>{},
    backOfficeComments: '',
	  customStatus: '',
    status:<IInvoiceDetailsItemStatus>{},
    reconStatus: <IInvoiceDetailsItemStatus>{},
    deliveryDate: '',
    orderDeliveryDate: '',
    workflowId: '',
    invoiceChecks: <IInvoiceDetailsItemInvoiceCheck[]>[],
    invoiceAmount: 0,
	  invoiceTotalPrice: 0,
    createdByUser:<IInvoiceDetailsItemBaseInfo>{},
    createdAt: '',
    invoiceDate: '',
    lastModifiedByUser: <IInvoiceDetailsItemBaseInfo>{},
    lastModifiedAt: '',
    relatedInvoices: '',
	  relatedInvoicesSummary: [],
    orderDetails: <IInvoiceDetailsItemOrderDetails>{},
    counterpartyDetails: <IInvoiceDetailsItemCounterpartyDetails>{},
    paymentDetails: <IInvoiceDetailsItemPaymentDetails>{},
    productDetails: <IInvoiceDetailsItemProductDetails[]>[],
    costDetails: [],
    invoiceClaimDetails: [],
    invoiceSummary: <IInvoiceDetailsItemInvoiceSummary>{},
    screenActions: <IInvoiceDetailsItemBaseInfo[]>[],
    requestInfo: <IInvoiceDetailsItemRequestInfo>{},
    isCreatedFromIntegration: false,    hasManualPaymentDate: false,
    attachments: [],
    customNonMandatoryAttribute1: '',
    customNonMandatoryAttribute2: '',
    customNonMandatoryAttribute3: '',
    customNonMandatoryAttribute4: '',
    customNonMandatoryAttribute5: '',
    customNonMandatoryAttribute6: '',
    customNonMandatoryAttribute7: '',
    customNonMandatoryAttribute8: '',
    customNonMandatoryAttribute9: '',
    name: '',
    id: 0,
    isDeleted: false,
    modulePathUrl: '',
    clientIpAddress: '',
    userAction: '',
  };

  constructor(private iconRegistry: MatIconRegistry, 
    private sanitizer: DomSanitizer,
    private invoiceService: InvoiceDetailsService){
    iconRegistry.addSvgIcon(
      'data-picker-gray',
      sanitizer.bypassSecurityTrustResourceUrl('../../assets/customicons/calendar-dark.svg'));

      this.gridOptions_data = <GridOptions>{
        defaultColDef: {
          resizable: true,
          filtering: false,
          sortable: false
        },
        columnDefs: this.columnDef_aggrid,
        suppressRowClickSelection: true,
        suppressCellSelection: true,
        headerHeight: 35,
        rowHeight: 35,
        animateRows: false,
  
        onGridReady: (params) => {
          this.gridOptions_data.api = params.api;
          this.gridOptions_data.columnApi = params.columnApi;
          this.gridOptions_data.api.sizeColumnsToFit();
          this.gridOptions_data.api.setRowData(this.rowData_aggrid);
          this.addCustomHeaderEventListener();
  
        },
        onColumnResized: function (params) {
          if (params.columnApi.getAllDisplayedColumns().length <= 9 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
            params.api.sizeColumnsToFit();
          }
        },
        onColumnVisible: function (params) {
          if (params.columnApi.getAllDisplayedColumns().length <= 9) {
            params.api.sizeColumnsToFit();
  
          }
        }
      }

      this.gridOptions_ac= <GridOptions>{
        defaultColDef: {
          resizable: true,
          filtering: false,
          sortable: false
        },
        columnDefs: this.columnDef_aggrid_ac,
        suppressRowClickSelection: true,
        suppressCellSelection: true,
        headerHeight: 35,
        rowHeight: 35,
        animateRows: false,
  
        onGridReady: (params) => {
          this.gridOptions_data.api = params.api;
          this.gridOptions_data.columnApi = params.columnApi;
          this.gridOptions_data.api.sizeColumnsToFit();
          this.gridOptions_data.api.setRowData(this.rowData_aggrid);
          this.addCustomHeaderEventListener();
  
        },
        onColumnResized: function (params) {
          if (params.columnApi.getAllDisplayedColumns().length <= 9 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
            params.api.sizeColumnsToFit();
          }
        },
        onColumnVisible: function (params) {
          if (params.columnApi.getAllDisplayedColumns().length <= 9) {
            params.api.sizeColumnsToFit();
  
          }
        }
      }


      // const form: InvoiceFormModel<IInvoiceDetailsItemDto> = {
      //   // firstName: ['', Validators.required],
      //   // lastName: ['', Validators.required],
      //   // email: ['', [Validators.required, Validators.email]],
      //   // favoriteAnimals: this.formBuilder.group(subForm)
      // };
  } 

  addCustomHeaderEventListener() {
    let addButtonElement = document.getElementsByClassName('add-btn');
    addButtonElement[0].addEventListener('click', (event) => {
      this.gridOptions_data.api.applyTransaction({
        add: [{
          type: 'Flat', provider: 'Kinder Morgan', currency: 'USD', rate: '100', cost: 'Pay', name: 'Barging', id: "", uom: "GAL"
        }]
      });
    });

  }
   
  ngOnInit(): void {
    this.getInvoiceItem();
  }

  getInvoiceItem() {
    this._entityId = 10851;
    let data : IInvoiceDetailsItemRequest = {
      Payload: this._entityId
    };
    
    this.invoiceService
    .getInvoicDetails(data)
    .subscribe((response: IInvoiceDetailsItemResponse) => {
      console.log(response);
        // this.invoiceDetails = response;
        // console.log(this.invoiceDetails.payload.sellerInvoiceNo);
    });
  }

  ngOnDestroy(): void {
  }
}
