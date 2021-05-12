import { IInvoiceDetailsItemRequest } from './../../../services/api/dto/invoice-details-item.dto';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit,ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { forkJoin, Observable, of, ReplaySubject, throwError } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@shiptech/environment';

// import { EMPTY$ } from './utils/rxjs-operators';
import { TenantSettingsApi } from '@shiptech/core/services/tenant-settings/api/tenant-settings-api.service';
import { TenantSettingsModuleName } from '../../../../../../../core/src/lib/store/states/tenant/tenant-settings.interface';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellEditableComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-editable.component';
import { AGGridCellRendererComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-renderer.component';
import { AgGridCellStyleComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-style.component';
import { GridOptions } from 'ag-grid-community';
import moment from 'moment';
import { IInvoiceDetailsItemBaseInfo, IInvoiceDetailsItemCounterpartyDetails,IInvoiceDetailsItemResponse, IInvoiceDetailsItemDto, IInvoiceDetailsItemInvoiceCheck, IInvoiceDetailsItemInvoiceSummary, IInvoiceDetailsItemOrderDetails, IInvoiceDetailsItemPaymentDetails, IInvoiceDetailsItemProductDetails, IInvoiceDetailsItemRequestInfo, IInvoiceDetailsItemStatus } from '../../../services/api/dto/invoice-details-item.dto';
import { InvoiceDetailsService } from '../../../services/invoice-details.service';
import { TenantSettingsService } from '../../../../../../../core/src/lib/services/tenant-settings/tenant-settings.service';
import { ToastrService } from 'ngx-toastr';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { InvoiceTypeSelectionComponent } from './component/invoice-type-selection/invoice-type-selection.component';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
// import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


  export const MY_FORMATS = {
    parse: {
      dateInput: 'LL',
    },
    display: {
      dateInput: 'ddd DD/MM/yyyy HH:mm',
      monthYearLabel: 'YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'YYYY',
    },
  };

@Component({
  selector: 'shiptech-invoice-detail',
  templateUrl: './invoice-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],

})
export class InvoiceDetailComponent implements OnInit, OnDestroy {

  //Default Values - strats
  public _entityId = null;
  orderId: number;
  public gridOptions_data: GridOptions;
  public gridOptions_ac: GridOptions;
  public gridOptions_claims: GridOptions;
  private rowData_aggrid_pd = [];
  private rowData_aggrid_ac = [];
  public productData:any = [];
  paymentStatus:number=0;
  customInvoice:number=0;
  dateFormat;
  isLoading:boolean = false;
  formSubmitted:boolean = false;
  emptyStringVal = '--';
  emptyNumberVal = '00';
  @ViewChildren('addProductMenu') addproductMenu;
  invoice_types =[
    {
      displayName:'Final',
      value:'FinalInvoice',
    },
    {
      displayName:'Provisional',
      value:'ProvisionalInvoice',
    },
    {
      displayName:'Credit',
      value:'CreditNote',
    },
    {
      displayName:'Debit',
      value:'DebitNote',
    },
  ]

  public chipData = [
    {Title:'Invoice No', Data:this.emptyStringVal},
    {Title:'Status', Data:this.emptyStringVal},
    {Title:'Invoice Total', Data:this.emptyStringVal},
    {Title:'Estimated Total', Data:this.emptyStringVal},
    {Title:'Total Difference', Data:this.emptyStringVal},
    {Title:'Provisional Inv No.', Data:this.emptyStringVal},
    {Title:'Provisional Total', Data:this.emptyStringVal},
    {Title:'Deductions', Data:this.emptyStringVal},
    {Title:'Net Payable', Data:this.emptyStringVal}
  ]
  public orderDetails = {
    contents: [
      {
        label: "Vessel",
        value: this.emptyStringVal,
        customLabelClass: [],
        customValueClass: [],
      },
      {
        label: "Vessel Code",
        value: this.emptyStringVal,
        customLabelClass: [],
        customValueClass: [],
      },
      {
        label: "Port",
        value: this.emptyStringVal,
        customLabelClass: [],
        customValueClass: [],
      },
      {
        label: "ETA",
        value: this.emptyStringVal,
        customLabelClass: [],
        customValueClass: [],
      }
    ],
    hasSeparator: false
  }
  public counterpartyDetails ={
    contents: [
      {
        label: "Seller",
        value: this.emptyStringVal,
        customLabelClass: [],
        customValueClass: [],
      },
      {
        label: "Broker",
        value: this.emptyStringVal,
        customLabelClass: [],
        customValueClass: [],
      }
    ],
    hasSeparator: true
  }
  invoiceStatusList:any;
  paymentStatusList:any;
  invoiceTypeList:any;
  manualtab:any;
// detailFormvalues:any;
@Input('detailFormvalues') set _detailFormvalues(val) {
  if(val){
    this.formValues = val;
    if(!this.formValues.paymentDetails){
      this.formValues.paymentDetails = <IInvoiceDetailsItemPaymentDetails>{};
    }
    this.parseProductDetailData(this.formValues.productDetails);
    //  console.log(this.invoiceDetailsComponent.parseProductDetailData);
    this.setOrderDetailsLables(this.formValues.orderDetails);
    this.setcounterpartyDetailsLables(this.formValues.counterpartyDetails);
    this.setChipDatas();
    this.paymentStatus = this.formValues.paymentDetails?.paymentStatus?.id;
    this.customInvoice = this.formValues.customStatus?.id;
    this.manualtab = this.invoice_types.filter(x=>{ return x.value === this.formValues.documentType?.internalName});
    if(this.manualtab.length == 0){
      this.invoice_types.pop();
    }
  }
}
  //Default Values - strats
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private invoiceService: InvoiceDetailsService,  public dialog: MatDialog,
    private toastrService: ToastrService,private format: TenantFormattingService, private legacyLookupsDatabase: LegacyLookupsDatabase) {
    iconRegistry.addSvgIcon('data-picker-gray',sanitizer.bypassSecurityTrustResourceUrl('./../../assets/customicons/calendar-dark.svg'));
    this.setupGrid();
    this.setClaimsDetailsGrid();
  }

  ngOnInit(): void {
    this.buildProductDetilsGrid();
    this.getCounterPartiesList();
    this.legacyLookupsDatabase.getInvoiceCustomStatus().then(list=>{
      this.invoiceStatusList = list;
    })
    this.legacyLookupsDatabase.getPaymentStatus().then(list=>{
      this.paymentStatusList = list;
    })
    this.legacyLookupsDatabase.getsInvoiceType().then(list=>{
      this.invoiceTypeList = list;
    })
    this.dateFormat = this.format.dateFormat.replace('DDD', 'E');
    this.getProductList();
  }
  private setupGrid(){
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
        this.gridOptions_data.api.setRowData(this.rowData_aggrid_ac);
        this.addCustomHeaderEventListener_AC(params);

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
    /* {
      children: [{headerName: 'Delivery No./ ', headerTooltip: 'Delivery No./ Order Product', field: 'del_no',
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: function(params) {
                  let keyData = params.value;
                  let newLink =
                  `<a href= "https://www.figma.com/proto/vdYj7vV3e5WCNVIxzpMkzA/Shiptech-Invoice-screen_Final?node-id=94%3A7895&scaling=min-zoom"
                  target="_blank">${keyData}</a>`;
                  return newLink;
              }
      },
      {
        headerName: 'Order Product', headerTooltip: 'Order Product', field: 'order_product'
      }]
    }, */
    {
      headerName: 'Delivery No. / Order Product', width: 250, headerTooltip: 'Delivery No. / Order Product', field: 'del_no',
      cellRendererFramework:AGGridCellActionsComponent, cellRendererParams: {type: 'border-cell'}
    },
    {
      children: [
      {
        headerName: 'Deliv Product', headerTooltip: 'Deliv Product', field: 'del_product', cellClass:'border-padding-5 p-r-0',
        cellRendererFramework:AgGridCellStyleComponent, cellRendererParams: {cellClass: ['cell-bg-border'],label:'div-in-cell'}
      },
      {
        headerName: 'Deliv. Qty', headerTooltip: 'Deliv. Qty', field: 'del_qty',cellClass:'blue-opacity-cell pad-lr-0'
      },
      {
        headerName: 'Estd. Rate', editable: true, headerTooltip: 'Estd. Rate', field: 'est_rate',cellClass:'blue-opacity-cell pad-lr-0'
      },
      {
        headerName: 'Amount', headerTooltip: 'Amount', field: 'amount1', cellClass:'blue-opacity-cell pad-lr-5' } ]
    },
    {
        children: [
          { headerName: 'Invoice Product', headerTooltip: 'Invoice Product', field: 'inv_product', cellClass:'border-padding-5 p-r-0',
            cellRendererFramework:AGGridCellActionsComponent, cellRendererParams: {type: 'dashed-border-dark'}
          },
          {
            headerName: 'Invoice Qty', headerTooltip: 'Invoice Qty', field: 'inv_qty', cellClass:'blue-opacity-cell dark pad-lr-0',
            cellRendererFramework:AGGridCellActionsComponent, cellRendererParams: {type: 'dashed-border-darkcell'}
          },
          {
            headerName: 'Invoice Rate', headerTooltip: 'Invoice Rate', field: 'inv_rate', cellClass:'blue-opacity-cell dark pad-lr-0',
            cellRendererFramework:AGGridCellActionsComponent, cellRendererParams: {type: 'dashed-border-darkcell'}
          },
          {
            headerName: 'Amount', headerTooltip: 'Amount', field: 'amount2', cellClass:'blue-opacity-cell dark pad-lr-5'
          }
        ]
      },
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
             <div class="add-btn-ac"></div>
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

  private columnDef_aggrid_claims = [
    { headerName: 'Claim ID', headerTooltip: 'Claim ID', field: 'claim.id' },
    { headerName: 'Delivery No', headerTooltip: 'Delivery No', field: 'delivery.id' },
    { headerName: 'Claim Type', headerTooltip: 'Claim Type', field: 'claimType.name' },
    { headerName: 'Product', headerTooltip: 'Product', field: 'product.name' },
    { headerName: 'Delivery Qty', headerTooltip: 'Delivery Quantity', field: 'deliveryQuantity'},
    {
      headerName: 'Invoice Amount', headerTooltip: 'Invoice Amount', field: 'invoiceAmount', editable: true,
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'dashed-border-with-expand'}
    },
    { headerName: 'Amount(order currency)', headerTooltip: ' Amount', field: 'baseInvoiceAmount' },
  ];

  public formValues: IInvoiceDetailsItemDto = {
    sellerInvoiceNo: 0,
    documentNo: 0,
    invoiceId: 0,
    documentType: <IInvoiceDetailsItemBaseInfo>{
      internalName:'FinalInvoice'
    },
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
    createdByUser:<IInvoiceDetailsItemBaseInfo>{name:''},
    createdAt: '',
    invoiceDate: '',
    lastModifiedByUser: <IInvoiceDetailsItemBaseInfo>{},
    lastModifiedAt: '',
    relatedInvoices: '',
	  relatedInvoicesSummary: [],
    orderDetails: <IInvoiceDetailsItemOrderDetails>{},
    counterpartyDetails: <IInvoiceDetailsItemCounterpartyDetails>{
      paymentTerm:<IInvoiceDetailsItemBaseInfo>{name:''}
    },
    paymentDetails: <IInvoiceDetailsItemPaymentDetails>{},
    productDetails: <IInvoiceDetailsItemProductDetails[]>[],
    costDetails: [],
    invoiceClaimDetails: [],
    invoiceSummary: <IInvoiceDetailsItemInvoiceSummary>{},
    screenActions: <IInvoiceDetailsItemBaseInfo[]>[],
    requestInfo: <IInvoiceDetailsItemRequestInfo>{
      request:<IInvoiceDetailsItemBaseInfo>{id:0}
    },
    isCreatedFromIntegration: false,
    hasManualPaymentDate: false,
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

  addCustomHeaderEventListener(params) {
    /*let addButtonElement = document.getElementsByClassName('add-btn');
    if(addButtonElement && addButtonElement.length > 0){
      addButtonElement[0].addEventListener('mouseover', (event) => {
        const dialogRef = this.dialog.open(ProductDetailsModalComponent, {
          width: '600px',
          data:  { orderId: this.formValues.orderDetails?.order?.id }
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result && result != 'close'){
            this.addrow(params,result);
          }
        });
        });

      addButtonElement[0].addEventListener('click', (event) => {
        // this.addrow(params);
      });
    }*/
  }

  addrow(param,details){
    let value = details.data;
      // console.log('add btn');

      let productdetail = {
        del_no: {no: value.deliveryId, order_prod: value.invoicedProduct.name},
        del_product: value.product.name,
        del_qty: value.deliveryQuantity +' '+ value.deliveryQuantityUom.name,
        est_rate: value.estimatedRate +' '+ value.estimatedRateCurrency.code,
        amount1: value.estimatedAmount + ' '+ value.estimatedRateCurrency.code,
        inv_product: value.invoicedProduct.name,
        inv_qty: value.invoiceQuantity +' '+ value.invoiceQuantityUom.name,
        inv_rate: value.invoiceRate + ' '+ value.estimatedRateCurrency.code,//invoiceRateCurrency
        amount2: value.invoiceComputedAmount + ' '+ value.estimatedRateCurrency.code,
        recon_status: value.reconStatus ? value.reconStatus.name : '',
        sulpher_content: value.sulphurContent,
        phy_supplier: value.physicalSupplierCounterparty.name
      }
      param.api.applyTransaction({
      add: [productdetail]
    });
  }

  addCustomHeaderEventListener_AC(params) {
    let addButtonElementAC = document.getElementsByClassName('add-btn-ac');
    addButtonElementAC[0].addEventListener('click', (event) => {
      var newItems = [{}];
         params.api.applyTransaction({
        add: newItems
    });
    });

  }

  buildProductDetilsGrid(){
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
      masterDetail: true,

      onGridReady: (params) => {
        this.gridOptions_data.api = params.api;
        this.gridOptions_data.columnApi = params.columnApi;
        this.gridOptions_data.api.sizeColumnsToFit();
        this.gridOptions_data.api.setRowData(this.rowData_aggrid_pd);
        // this.addCustomHeaderEventListener(params);

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

  parseProductDetailData( productDetails : IInvoiceDetailsItemProductDetails[]){
    for ( let value of productDetails) {
      let productdetail = {
        del_no: {no: value.deliveryId, order_prod: value.invoicedProduct.name},
        del_product: value.product.name,
        del_qty: value.deliveryQuantity +' '+ value.deliveryQuantityUom.name,
        est_rate: value.estimatedRate +' '+ value.estimatedRateCurrency.code,
        amount1: value.estimatedAmount + ' '+ value.estimatedRateCurrency.code,
        inv_product: value.invoicedProduct.name,
        inv_qty: value.invoiceQuantity +' '+ value.invoiceQuantityUom.name,
        inv_rate: value.invoiceRate + ' '+ value.invoiceRateCurrency.code,
        amount2: value.invoiceComputedAmount + ' '+ value.invoiceRateCurrency.code,
        recon_status: value.reconStatus?value.reconStatus.name:'',
        sulpher_content: value.sulphurContent,
        phy_supplier: value.physicalSupplierCounterparty.name
      }
      this.rowData_aggrid_pd.push(productdetail);
    };
  }

  setOrderDetailsLables(orderDetails){
    this.orderDetails.contents[0].value = orderDetails?.vesselName? orderDetails?.vesselName:this.emptyStringVal;
    this.orderDetails.contents[1].value = orderDetails?.vesselCode? orderDetails?.vesselCode:this.emptyStringVal;
    this.orderDetails.contents[2].value = orderDetails?.portName? orderDetails?.portName:this.emptyStringVal;
    this.orderDetails.contents[3].value = orderDetails?.eta? moment(orderDetails?.eta).format(this.format.dateFormat.replace('DDD', 'ddd').replace('dd/', 'DD/')):this.emptyStringVal;

    this.formValues.orderDetails.frontOfficeComments = this.formValues.orderDetails.frontOfficeComments?.trim() ==''? null :this.formValues.orderDetails.frontOfficeComments;
    this.formValues.backOfficeComments = this.formValues.backOfficeComments?.trim() ==''? null :this.formValues.backOfficeComments;
    if(this.formValues.paymentDetails != undefined && this.formValues.paymentDetails !=null){
      this.formValues.paymentDetails.comments = this.formValues.paymentDetails?.comments?.trim() ==''? null :this.formValues.paymentDetails?.comments;
    }

  }

  setcounterpartyDetailsLables(counterpartyDetails){
    this.counterpartyDetails.contents[0].value = counterpartyDetails?.sellerName? counterpartyDetails?.sellerName : this.emptyStringVal;
    this.counterpartyDetails.contents[1].value = counterpartyDetails?.brokerName? counterpartyDetails?.brokerName : this.emptyStringVal;
  }

  setChipDatas(){
    var ivs =  this.formValues.invoiceSummary;
    this.chipData[0].Data = this.formValues.id?.toString();
    this.chipData[1].Data = this.formValues.status.displayName? this.formValues.status.displayName : this.emptyStringVal;
    this.chipData[2].Data = this.formValues.invoiceTotalPrice? this.formValues.invoiceTotalPrice?.toString():this.emptyNumberVal;
    this.chipData[3].Data = ivs?.estimatedAmountGrandTotal? ivs?.estimatedAmountGrandTotal.toString():this.emptyNumberVal;
    this.chipData[4].Data = ivs?.totalDifference? ivs?.totalDifference?.toString():this.emptyNumberVal;
    this.chipData[5].Data = ivs?.provisionalInvoiceNo? ivs?.provisionalInvoiceNo?.toString():this.emptyNumberVal;
    this.chipData[6].Data = ivs?.provisionalInvoiceAmount? ivs?.provisionalInvoiceAmount?.toString(): this.emptyNumberVal;
    this.chipData[7].Data = ivs?.deductions? ivs?.deductions?.toString() : this.emptyNumberVal;
    this.chipData[8].Data = ivs?.netPayable? ivs?.netPayable?.toString() : this.emptyNumberVal;
  }

  formatDateForBe(value) {
    if (value) {
     let beValue = moment(value).format(this.format.dateFormat.replace('DDD', 'ddd').replace('dd/', 'DD/'))
      return new Date(beValue);
    } else {
      return null;
    }
  }

  ngOnDestroy(): void {
    // this.invoiceService.getInvoicDetails().
  }

  public saveInvoiceDetails(){
    this.isLoading = true;
    if(this.formSubmitted){
      return;
    }
    this.formSubmitted = true;
    if(!this.formValues.dueDate || !this.formValues.workingDueDate || !this.formValues.counterpartyDetails.paymentTerm.name
       || !this.formValues.orderDetails.paymentCompany.name){
        if(!this.formValues.dueDate){
          this.toastrService.error("Due date is required.");
        }
        if(!this.formValues.workingDueDate){
          this.toastrService.error("Working due date is required.");
        }
        if(!this.formValues.counterpartyDetails.paymentTerm.name){
          this.toastrService.error("Payment term is required.");
        }
        if(!this.formValues.orderDetails.paymentCompany.name){
          this.toastrService.error("Payment company is required.");
        }
        this.isLoading = false;
        this.formSubmitted = false;
        return;
      }
      this.formValues.paymentDetails.paymentStatus = { id: this.paymentStatus };
      this.formValues.customStatus = { id: this.customInvoice };

    //  alert("Has to save please wait");
    let data : any = {
      Payload: this.formValues
    };
    this.invoiceService
    .updateInvoiceItem(data)
    .subscribe((response: IInvoiceDetailsItemResponse) => {
      this.toastrService.success('Invoice updated successfully');
      this.isLoading = false;
      this.formSubmitted = false;
    });
  }

  public openRequest(){
    //https://bvt.shiptech.com/#/edit-request/89053
  }


  getCounterPartiesList(){

  }

  onModelChanged(evt){

  }
  AC_valueChanges(type,event){
    let eventValueObject = {
      "id": event.id ? event.id : null,
      "name": event.name ? event.name : null,
      "internalName": event.internalName ? event.internalName : null,
      "displayName": event.displayName ? event.displayName : null,
      "code": event.code ? event.code : null,
      "collectionName": event.collectionName ? event.collectionName : null,
      "customNonMandatoryAttribute1": event.customNonMandatoryAttribute1 ? event.customNonMandatoryAttribute1 : null,
      "isDeleted": event.isDeleted ? event.isDeleted : null,
      "modulePathUrl": event.modulePathUrl ? event.modulePathUrl :null,
      "clientIpAddress": event.clientIpAddress ? event.clientIpAddress : null,
      "userAction": event.userAction ? event.userAction : null
    };
    if(type === 'company'){
      this.formValues.orderDetails.paymentCompany = eventValueObject;
      // this.formValues.orderDetails.paymentCompany.displayName = event.displayName ? event.displayName : event.name ? event.name : null;
      // this.formValues.orderDetails.paymentCompany.code = event.code ? event.code : '';
    }else if(type === 'carrier'){
      this.formValues.orderDetails.carrierCompany = eventValueObject;
      // this.formValues.orderDetails.carrierCompany.displayName = event.displayName ? event.displayName : '';
      // this.formValues.orderDetails.carrierCompany.code = event.code ? event.code : '';
    }else if(type === 'customer'){

    }else if(type === 'payableto'){
      this.formValues.counterpartyDetails.payableTo = eventValueObject;
    }else if(type === 'paymentterms'){
      this.formValues.counterpartyDetails.paymentTerm = eventValueObject;
    }
    // console.log('type',type,'evnt',event);
  }
  invoiceOptionSelected(option){
    this.isLoading = true;
    if(this.formSubmitted){
      return;
    }
    this.formSubmitted = true;
    if(option == 'submitreview'){
      let data : any = {
        Payload: {"id":this.formValues.id}
      };
      this.invoiceService
      .submitReview(data)
      .subscribe((response: IInvoiceDetailsItemResponse) => {
        this.toastrService.success('Invoice submitted for approval successfully');
        this.isLoading = false;
        this.formSubmitted = false;
      });
    }else if(option == 'submitapprove'){
      let data : any = {
        Payload: {"id":this.formValues.id}
      };
      this.invoiceService
      .submitapproval(data)
      .subscribe((response: IInvoiceDetailsItemResponse) => {
        this.toastrService.success('Invoice submitted for approval successfully');
        this.isLoading = false;
        this.formSubmitted = false;
      });
    }else if(option == 'cancel'){
      let data : any = {
        Payload: {"id":this.formValues.id}
      };
      this.invoiceService
      .cancelInvoiceItem(data)
      .subscribe((response: IInvoiceDetailsItemResponse) => {
        this.toastrService.success('Invoice cancelled successfully');
        this.isLoading = false;
        this.formSubmitted = false;
      });
    }else if(option == 'accept'){
      let data : any = {
        Payload: {"id":this.formValues.id}
      };
      this.invoiceService
      .acceptInvoiceItem(data)
      .subscribe((response: IInvoiceDetailsItemResponse) => {
        this.toastrService.success('Invoice accepted successfully');
        this.isLoading = false;
        this.formSubmitted = false;
      });
    }else if(option == 'revert'){
      let data : any = {
        Payload: {"id":this.formValues.id}
      };
      this.invoiceService
      .revertInvoiceItem(data)
      .subscribe((response: IInvoiceDetailsItemResponse) => {
        this.toastrService.success('Invoice reverted successfully');
        this.isLoading = false;
        this.formSubmitted = false;
      });
    }else if(option == 'reject'){
      let data : any = {
        Payload: {"id":this.formValues.id}
      };
      this.invoiceService
      .rejectInvoiceItem(data)
      .subscribe((response: IInvoiceDetailsItemResponse) => {
        this.toastrService.success('Invoice rejected successfully');
        this.isLoading = false;
        this.formSubmitted = false;
      });
    }else if(option == 'create'){
      this.isLoading = false;
      const dialogRef = this.dialog.open(InvoiceTypeSelectionComponent, {
        width: '400px',
        height: '400px',
        panelClass: 'popup-grid',
        data:  { orderId: this.formValues.orderDetails?.order?.id, lists : this.invoiceTypeList }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.formSubmitted = false;
        if(result && result != 'close'){

        }
      });
    }else if(option == 'approve'){
      let data : any = {
        Payload: this.formValues
      };
      this.invoiceService
      .approveInvoiceItem(data)
      .subscribe((response: IInvoiceDetailsItemResponse) => {
        this.toastrService.success('Invoice approved successfully');
        this.isLoading = false;
        this.formSubmitted = false;
      });
    }
  }

  setClaimsDetailsGrid(){
    this.gridOptions_claims = <GridOptions>{
      defaultColDef: {
        resizable: true,
        filtering: false,
        sortable: false
      },
      columnDefs: this.columnDef_aggrid_claims,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 35,
      rowHeight: 45,
      animateRows: false,
      masterDetail: true,
      onGridReady: (params) => {
        this.gridOptions_claims.api = params.api;
        this.gridOptions_claims.columnApi = params.columnApi;
        this.gridOptions_claims.api.sizeColumnsToFit();
        this.gridOptions_claims.api.setRowData(this.formValues.invoiceClaimDetails);
        // this.addCustomHeaderEventListener(params);
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
  getProductList(){
    let data : any = {
      Payload: {"Order":null,"PageFilters":{"Filters":[]},"SortList":{"SortList":[]},"Filters":[{"ColumnName":"Order_Id","Value": this.orderId}],"SearchText":null,"Pagination":{}}
    };
    this.invoiceService
    .productListOnInvoice(data)
    .subscribe((response: any) => {
      response.payload.forEach(row => {
        this.productData.push({selected:false, product:row.product.name, deliveries:row.order.id, details:row});
      });
    });
  }
  addnewProduct(event){
    console.log(event);
    var itemsToUpdate = [];
    this.gridOptions_data.api.forEachNodeAfterFilterAndSort(function (rowNode, index) {
      if (index >= 1) {
        return;
      }
      var data = rowNode.data;

      // data.price = Math.floor(Math.random() * 20000 + 20000);
      itemsToUpdate.push(data);
    });
    this.gridOptions_data.api.applyTransaction({
      update: itemsToUpdate
    });

  }
}

