import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellEditableComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-editable.component';
import { AGGridCellRendererComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-renderer.component';
import { AgGridCellStyleComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-style.component';
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
  public chipData = [
    {Title:'Invoice No', Data:''},
    {Title:'Status', Data:'Draft'},
    {Title:'Invoice Total', Data:''},
    {Title:'Estimated Total', Data:'33,898.00 USD'},
    {Title:'Total Difference', Data:'-33.898.00 USD'},
    {Title:'Provisional Inv No.', Data:''},
    {Title:'Provisional Total', Data:''},
    {Title:'Deductions', Data:'USD'},
    {Title:'Net Payable', Data:''}
  ]
  public orderDetails = {
    contents: [
      {
        label: "Vessel",
        value: "Puget Shipping",
        customLabelClass: [],
        customValueClass: [],
      },
      {
        label: "Vessel Code",
        value: "PUGET",
        customLabelClass: [],
        customValueClass: [],
      },
      {
        label: "Port",
        value: "Melbourne",
        customLabelClass: [],
        customValueClass: [],
      },
      {
        label: "ETA",
        value: "12/12/2020",
        customLabelClass: [],
        customValueClass: [],
      }
    ],
    hasSeparator: false
  }
  public counterpartyDetails = {
    contents: [
      {
        label: "Seller",
        value: "AA Fuel Solns",
        customLabelClass: [],
        customValueClass: [],
      },
      {
        label: "Broker",
        value: "Marine Brokerage",
        customLabelClass: [],
        customValueClass: [],
      }
    ],
    hasSeparator: true
  }

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private invoiceService: InvoiceDetailsService) {
    iconRegistry.addSvgIcon(
      'data-picker-gray',
      sanitizer.bypassSecurityTrustResourceUrl('../../assets/customicons/calendar-dark.svg'));

    this.gridOptions_data = <GridOptions>{
      defaultColDef: {
        resizable: true,
        filtering: false,
        sortable: false
      },
      columnDefs: this.columnDef_aggrid_pd,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 35,
      rowHeight: 45,
      animateRows: false,

      onGridReady: (params) => {
        this.gridOptions_data.api = params.api;
        this.gridOptions_data.columnApi = params.columnApi;
        this.gridOptions_data.api.sizeColumnsToFit();
        this.gridOptions_data.api.setRowData(this.rowData_aggrid_pd);
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

    this.gridOptions_ac = <GridOptions>{
      defaultColDef: {
        resizable: true,
        filtering: false,
        sortable: false
      },
      columnDefs: this.columnDef_aggrid_ac,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 35,
      rowHeight: 45,
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

  }
  private columnDef_aggrid_pd = [
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
      headerName: 'Delivery No./ Order Product', headerTooltip: 'Delivery No./ Order Product', field: 'del_no'
    },
    {
      children: [{
        headerName: 'Deliv Product', headerTooltip: 'Deliv Product', field: 'del_product'
      },
      {
        headerName: 'Deliv. Qty', headerTooltip: 'Deliv. Qty', field: 'del_qty'
      },
      {
        headerName: 'Estd. Rate', editable: true, headerTooltip: 'Estd. Rate', field: 'est_rate'
      },
      { headerName: 'Amount', headerTooltip: 'Amount', field: 'amount1' }]
    },
    { headerName: 'Invoice Product', headerTooltip: 'Invoice Product', field: 'inv_product' },
    { headerName: 'Invoice Qty', headerTooltip: 'Invoice Qty', field: 'inv_qty' },
    { headerName: 'Invoice Rate', headerTooltip: 'Invoice Rate', field: 'inv_rate' },
    { headerName: 'Amount', headerTooltip: 'Amount', field: 'amount2' },
    { headerName: 'Recon status', headerTooltip: 'Recon status', field: 'recon_status',
    cellRendererFramework:AGGridCellRendererComponent, cellRendererParams: function(params) {
      var classArray:string[] =[];
        classArray.push('aggridtextalign-center');
        let newClass= params.value==='Unmatched'?'custom-chip-type1 red-chip':
                      params.value==='Matched'?'custom-chip-type1 mediumgreen':
                      'custom-chip-type1';
                      classArray.push(newClass);
        return {cellClass: classArray.length>0?classArray:null} }},
    { headerName: 'Sulpher content', headerTooltip: 'Sulpher content', field: 'sulpher_content',
      cellRendererFramework:AGGridCellActionsComponent, cellRendererParams: {type: 'dashed-border'}
    },
    { headerName: 'Phy. suppier', headerTooltip: 'Phy. supplier', field: 'phy_supplier', width: 250,
      cellRendererFramework:AGGridCellActionsComponent, cellRendererParams: {type: 'dashed-border-with-expand'}
    }
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
      headerName: 'Item', editable: true, headerTooltip: 'Item', field: 'cost',
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-dropdown', label: 'cost-type', items: ['Pay', 'Receive'] }
    },
    {
      headerName: 'Cost Type', headerTooltip: 'Cost Type', field: 'name',
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-autocomplete', label: 'cost-name' }
    },
    {
      headerName: '%of', headerTooltip: '% of', field: 'provider',
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-autocomplete', label: 'service-provider' }
    },
    {
      headerName: 'BDN Qty', editable: true, headerTooltip: 'BDN Qty', field: 'type',
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

  private rowData_aggrid_pd = [
    {
      del_no: '23243/DMA 0.1%', del_product: 'DMA 0.1%', del_qty: '1200 MT', est_rate: '1290 USD', amount1: '120,000 USD',
      inv_product: 'RMG 380', inv_qty: '1200 MT', inv_rate: '', amount2: '0.00 USD', recon_status: 'Matched', sulpher_content: '0.05', phy_supplier: 'British Petroleum'
    },
    {
      del_no: '23243/RMK 380 3.5', del_product: '380 3.5%', del_qty: '1200 MT', est_rate: '1290 USD', amount1: '120,000 USD',
      inv_product: 'RMG 380', inv_qty: '1200 MT', inv_rate: '', amount2: '0.00 USD', recon_status: 'Unmatched', sulpher_content: '0.05', phy_supplier: 'British Petroleum'
    },
    {
      del_no: '23243/RMK 380 3.5', del_product: '380 3.5%', del_qty: '1200 MT', est_rate: '1290 USD', amount1: '120,000 USD',
      inv_product: 'RMG 380', inv_qty: '1200 MT', inv_rate: '', amount2: '0.00 USD', recon_status: 'Matched', sulpher_content: '0.05', phy_supplier: 'British Petroleum'
    }
  ];

  private rowData_aggrid = [];

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

  // constructor(private iconRegistry: MatIconRegistry,
  //   private sanitizer: DomSanitizer,
  //   private invoiceService: InvoiceDetailsService){
  //   iconRegistry.addSvgIcon(
  //     'data-picker-gray',
  //     sanitizer.bypassSecurityTrustResourceUrl('../../assets/customicons/calendar-dark.svg'));

  //     this.gridOptions_data = <GridOptions>{
  //       defaultColDef: {
  //         resizable: true,
  //         filtering: false,
  //         sortable: false
  //       },
  //       columnDefs: this.columnDef_aggrid,
  //       suppressRowClickSelection: true,
  //       suppressCellSelection: true,
  //       headerHeight: 35,
  //       rowHeight: 35,
  //       animateRows: false,

  //       onGridReady: (params) => {
  //         this.gridOptions_data.api = params.api;
  //         this.gridOptions_data.columnApi = params.columnApi;
  //         this.gridOptions_data.api.sizeColumnsToFit();
  //         this.gridOptions_data.api.setRowData(this.rowData_aggrid);
  //         this.addCustomHeaderEventListener();

  //       },
  //       onColumnResized: function (params) {
  //         if (params.columnApi.getAllDisplayedColumns().length <= 9 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
  //           params.api.sizeColumnsToFit();
  //         }
  //       },
  //       onColumnVisible: function (params) {
  //         if (params.columnApi.getAllDisplayedColumns().length <= 9) {
  //           params.api.sizeColumnsToFit();

  //         }
  //       }
  //     }

  //     this.gridOptions_ac= <GridOptions>{
  //       defaultColDef: {
  //         resizable: true,
  //         filtering: false,
  //         sortable: false
  //       },
  //       columnDefs: this.columnDef_aggrid_ac,
  //       suppressRowClickSelection: true,
  //       suppressCellSelection: true,
  //       headerHeight: 35,
  //       rowHeight: 35,
  //       animateRows: false,

  //       onGridReady: (params) => {
  //         this.gridOptions_data.api = params.api;
  //         this.gridOptions_data.columnApi = params.columnApi;
  //         this.gridOptions_data.api.sizeColumnsToFit();
  //         this.gridOptions_data.api.setRowData(this.rowData_aggrid);
  //         this.addCustomHeaderEventListener();

  //       },
  //       onColumnResized: function (params) {
  //         if (params.columnApi.getAllDisplayedColumns().length <= 9 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
  //           params.api.sizeColumnsToFit();
  //         }
  //       },
  //       onColumnVisible: function (params) {
  //         if (params.columnApi.getAllDisplayedColumns().length <= 9) {
  //           params.api.sizeColumnsToFit();

  //         }
  //       }
  //     }


  //     // const form: InvoiceFormModel<IInvoiceDetailsItemDto> = {
  //     //   // firstName: ['', Validators.required],
  //     //   // lastName: ['', Validators.required],
  //     //   // email: ['', [Validators.required, Validators.email]],
  //     //   // favoriteAnimals: this.formBuilder.group(subForm)
  //     // };
  // }

  addCustomHeaderEventListener() {
    let addButtonElement = document.getElementsByClassName('add-btn');
    addButtonElement[0].addEventListener('click', (event) => {
      this.gridOptions_data.api.applyTransaction({
        add: [
          {
            del_no: '23243', order_product: 'DMA 0.1%', del_product: 'DMA 0.1%', del_qty: '1200 MT', est_rate: '1290 USD', amount1: '120,000 USD',
            inv_product: 'RMG 380', inv_qty: '1200 MT', inv_rate: '', amount2: '0.00 USD', recon_status: 'Matched', sulpher_content: '0.05', phy_supplier: 'British Petroleum'
          },
          {
            del_no: '23243/RMK 380 3.5', del_product: '380 3.5%', del_qty: '1200 MT', est_rate: '1290 USD', amount1: '120,000 USD',
            inv_product: 'RMG 380', inv_qty: '1200 MT', inv_rate: '', amount2: '0.00 USD', recon_status: 'Unmatched', sulpher_content: '0.05', phy_supplier: 'British Petroleum'
          },
          {
            del_no: '23243/RMK 380 3.5', del_product: '380 3.5%', del_qty: '1200 MT', est_rate: '1290 USD', amount1: '120,000 USD',
            inv_product: 'RMG 380', inv_qty: '1200 MT', inv_rate: '', amount2: '0.00 USD', recon_status: 'Matched', sulpher_content: '0.05', phy_supplier: 'British Petroleum'
          }
      ]
      });
    });

  }

  ngOnInit(): void {
<<<<<<< HEAD
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
=======

>>>>>>> origin/invoice-new-ui
  }

  ngOnDestroy(): void {
  }
}
