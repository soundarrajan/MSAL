import { Component, OnInit, Output, EventEmitter, Inject,ViewChild, Input } from '@angular/core';
import { GridOptions } from '@ag-grid-community/core';
import { AGGridCellRendererComponent } from '../ag-grid/ag-grid-cell-renderer.component';
import { AGGridDownloadFileComponent } from '../ag-grid/ag-grid-download-file.component';
import { AGGridCellDataComponent } from '../ag-grid/ag-grid-celldata.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchVesselComponent } from '../search-vessel/search-vessel.component';
import { LocalService } from '../../services/local-service.service';
import { VesselDetailsComponent } from '../vessel-details/vessel-details.component';
import { RequestsDetailsComponent } from "./../requests-details/requests-details.component";
import { VesselPopupService } from '../../services/vessel-popup.service';
import moment from 'moment';
import { ModuleError } from '@shiptech/core/ui/components/documents/error-handling/module-error';
import { ApiCall } from '@shiptech/core/utils/decorators/api-call.decorator';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { FileSaverService } from 'ngx-filesaver';
import { DOCUMENTS_API_SERVICE } from '@shiptech/core/services/masters-api/documents-api.service';
import { IDocumentsApiService } from '@shiptech/core/services/masters-api/documents-api.service.interface';
@Component({
  selector: 'app-smart-operator',
  templateUrl: './smart-operator.component.html',
  styleUrls: ['./smart-operator.component.scss']
})
export class SmartOperatorComponent implements OnInit {
  isValue: number = 3 ;
  public gridOptions: GridOptions;
  gridOrderDetailsOptions: GridOptions;
  public gridBdnReportOptions: GridOptions;
  public gridOptions1: GridOptions;
  public gridOptions2: GridOptions;
  public colResizeDefault;
  public rowCount: Number;
  rowData: any[];
  BdnReportsData: any = [];
  public date = new FormControl(new Date());
  currentDate = new Date();
  selectedFromDate: Date = new Date(this.currentDate.setMonth((this.currentDate.getMonth())-1));
  selectedToDate: Date = new Date();
  public vesselList = [];
  @Output() showTableViewEmit = new EventEmitter();
  @Output() clickEvent = new EventEmitter();
  @ViewChild(SearchVesselComponent) searchComponent;
  @Output() showBPlan = new EventEmitter();
  @ViewChild(VesselDetailsComponent) vesselDetail;
  public changeVessel;
  public coldefOnClick:any;
    public shiptechUrl : string = '';
  rowSelection: any;
  defaultColDef:any;
  getSelectedbdnreport: any[];
  EnableReportDate: boolean;
  OrderDetailsData: any[];
  Enabledbdnreports: boolean;
  pagesize: any;
  // public paginationPageSize : number = 20;
  // public currentPage : number = 1;
  // public lastPage : number = 99;
  // public activePage : boolean = true; 
  
  constructor(private localService: LocalService,private vesselService : VesselPopupService, private _FileSaverService: FileSaverService,
    @Inject(DOCUMENTS_API_SERVICE) private mastersApi: IDocumentsApiService,
    private appErrorHandler: AppErrorHandler,
    iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'data-picker',
      sanitizer.bypassSecurityTrustResourceUrl('../assets/customicons/datepicker.svg'));
    
    this.shiptechUrl =  new URL(window.location.href).origin;
    this.defaultColDef = {
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 100,
      flex: 1,
    };
    this.rowSelection = 'multiple';

    this.gridOptions = <GridOptions>{
      columnDefs: this.columnDefs_myvessels,
      animateRows: true,
      headerHeight: 32,
      rowHeight: 50,
      groupHeaderHeight: 40,
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true
      },
      rowSelection: 'single',
       overlayNoRowsTemplate:
       `<span>Rows are loading...</span>`,
      onGridReady: (params) => {
       
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;
        this.gridOptions.api.setRowData(this.rowData1);
        this.vesselList = this.rowData1;
        this.rowCount = this.gridOptions.api.getDisplayedRowCount();
        this.gridOptions.api.setColumnDefs(this.columnDefs_myvessels);
      },
      onCellClicked: (params) => { this.coldefOnClick = params.colDef.field; },
      onColumnResized: function (params) {
      },
      onColumnVisible: function (params) {
      },
      onColumnPinned: function (params) {
      },
      onGridSizeChanged: function (params) {
        params.api.sizeColumnsToFit();
      },
      onRowClicked: (event) =>{
        let req = { vesselView: 'standard-view', name: event.data.vesselName,  id: event.data.vesselId, vesselId: event.data.vesselId }
         this.localService.setVesselPopupData(req);
         
         if(this.coldefOnClick != 'vesselName' && this.coldefOnClick != 'newrequest'){
         this.showBPlan.emit(true);
         this.clickEvent.emit();
         }
       },
      //  onPaginationChanged:(event) =>{
      //   this.gridOptions.api.paginationSetPageSize(Number(this.paginationPageSize));
      //  }
    };


    this.gridBdnReportOptions = <GridOptions>{
      columnDefs: this.columnDefs_BdnReport,
      animateRows: true,
      headerHeight: 32,
     
      pagination:true,
      rowHeight: 50,
      groupHeaderHeight: 40,
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true
      },
      rowSelection: 'multiple',
       overlayNoRowsTemplate:
       `<span>Rows are loading...</span>`,
      onGridReady: (params) => {

        this.gridBdnReportOptions.api = params.api;
        this.gridBdnReportOptions.columnApi = params.columnApi;
        this.gridBdnReportOptions.api.setRowData(this.BdnReportsData);
        this.rowCount = this.gridBdnReportOptions.api.getDisplayedRowCount();
        this.gridBdnReportOptions.api.setColumnDefs(this.columnDefs_BdnReport);
      },
      onCellClicked: (params) => { this.coldefOnClick = params.colDef.field; },
      onColumnResized: function (params) {
      },
      onColumnVisible: function (params) {
      },
      onColumnPinned: function (params) {
      },
      onGridSizeChanged: function (params) {
        params.api.sizeColumnsToFit();
      },
      onRowClicked: (event) =>{
        
       },
      //  onPaginationChanged:(event) =>{
      //   this.gridOptions.api.paginationSetPageSize(Number(this.paginationPageSize));
      //  }
    };

    this.gridOrderDetailsOptions = <GridOptions>{
      columnDefs: this.columnDefs_OrderDetails,
      animateRows: true,
      headerHeight: 32,
      pagination:true,
      rowHeight: 50,
      groupHeaderHeight: 40,
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true
      },
      rowSelection: 'multiple',
       overlayNoRowsTemplate:
       `<span>Rows are loading...</span>`,
      onGridReady: (params) => {

        this.gridOrderDetailsOptions.api = params.api;
        // this.gridBdnReportOptions.api.paginationSetPageSize(10);
        // this.gridBdnReportOptions.paginationPageSize = 10;
        this.gridOrderDetailsOptions.columnApi = params.columnApi;
        this.gridOrderDetailsOptions.api.setRowData(this.BdnReportsData);
        this.rowCount = this.gridOrderDetailsOptions.api.getDisplayedRowCount();
        this.gridOrderDetailsOptions.api.setColumnDefs(this.columnDefs_OrderDetails);
      },
      onCellClicked: (params) => { this.coldefOnClick = params.colDef.field; },
      onColumnResized: function (params) {
      },
      onColumnVisible: function (params) {
      },
      onColumnPinned: function (params) {
      },
      onGridSizeChanged: function (params) {
        params.api.sizeColumnsToFit();
      },
      onRowClicked: (event) =>{
        
       },
      //  onPaginationChanged:(event) =>{
      //   this.gridOptions.api.paginationSetPageSize(Number(this.paginationPageSize));
      //  }
    };



    this.gridOptions1 = <GridOptions>{
      animateRows: true,
      headerHeight: 32,
      rowHeight: 50,
      groupHeaderHeight: 40,
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true
      },
      
      rowSelection: 'single',
      overlayLoadingTemplate:
      '<span class="ag-overlay-loading-center">Rows are loading...</span>',
       overlayNoRowsTemplate:
       `<span> No rows to Display</span>`,
      onGridReady: (params) => {

        this.gridOptions1.api = params.api;
        this.gridOptions1.columnApi = params.columnApi;
        this.gridOptions1.api.setColumnDefs(this.columnDefs_unmanageablevessels);
        this.gridOptions.api.sizeColumnsToFit();
        this.gridOptions1.api.setRowData(this.BdnReportsData);
        this.rowCount = this.gridOptions1.api.getDisplayedRowCount();
        this.gridOptions1.api.showLoadingOverlay();

      },
      onCellClicked: (params) => { 
        this.coldefOnClick = params.colDef.field;
      },
      onColumnResized: function (params) {
      },
      onColumnVisible: function (params) {
      },
      onColumnPinned: function (params) {
      },
      onGridSizeChanged: function (params) {
        params.api.sizeColumnsToFit();
      },
      onRowClicked: (event) =>{
        let req = { vesselView: 'standard-view', name: event.data.vesselName,  id: event.data.vesselId, vesselId: event.data.vesselId }
         this.localService.setVesselPopupData(req);
         
         if(this.coldefOnClick != 'vesselName'){
         this.showBPlan.emit(true);
         this.clickEvent.emit();
         }
       }
    };
    this.gridOptions2 = <GridOptions>{
      // columnDefs: this.columnDefs,
      //enableColResize: true,
      //enableSorting: true,
      animateRows: true,
      headerHeight: 32,
      rowHeight: 50,
      groupHeaderHeight: 40,
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true
      },
      
      rowSelection: 'single',
      onGridReady: (params) => {
        this.gridOptions2.api = params.api;
        this.gridOptions2.columnApi = params.columnApi;
        this.gridOptions2.api.setRowData(this.rowData3);
        this.rowCount = this.gridOptions2.api.getDisplayedRowCount();
        this.gridOptions2.api.setColumnDefs(this.columnDefs_outstandingrequest);
        params.api.sizeColumnsToFit();

      },
      onCellClicked: (params) => { this.clickEvent.emit(); },
      onColumnResized: function (params) {
      },
      onColumnVisible: function (params) {
      },
      onColumnPinned: function (params) {
      },
      onGridSizeChanged: function (params) {
        params.api.sizeColumnsToFit();
      }
    };
  }

  ngOnInit() {
     this.loadAllMyVessels();
     this.loadUnmanageableVessels();
  }
  
  private columnDefs_OrderDetails = [
    { headerName: 'Order Number', headerTooltip: 'Order Number', field: 'orderId', width: 100, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center']},
    { headerName: 'Order Date', headerTooltip: 'Order Date', field: 'orderDate', cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 140 },
    {
      headerName: 'Vessel Name', headerTooltip: 'Vessel Name', field: 'vesselName', width: 150,
      cellClass: function (params) {
        var classArray: string[] = ['aggridlink aggrid-vertical-center'];
        let newClass =
          params.data.severity === '3' ? 'aggrid-left-ribbon mediumred1' :
            (params.data.severity === '2' ? 'aggrid-left-ribbon mediumamber' :
              'aggrid-left-ribbon mediumblue1');
        classArray.push(newClass);
        return classArray.length > 0 ? classArray : null
      },
      cellRendererFramework: AGGridCellDataComponent, cellRendererParams: (params)=>{return  {type: 'vesselName' }}
    },
    { headerName: 'Port', headerTooltip: 'Port', field: 'portName', width: 100, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center']},
    { headerName: 'Delivery Date', headerTooltip: 'Delivery Date', field: 'deliveryDate', cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 140 },
    // { headerName: 'Fuel Grade', headerTooltip: 'Fuel Grade', field: 'fuelGrade', width: 100, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center']},
    {
      headerName: 'Fuel Grade', headerTooltip: 'Fuel Grade', field: 'fuelGrade', cellRendererFramework: AGGridCellDataComponent, cellRendererParams: { type: 'order-multiple-values' }, cellClass: [' aggrid-columgroup-splitter-right aggrid-vertical-center'],
      valueGetter: function (params) {
        return params.data.fuelGrade;
      }
    },
    { headerName: 'Quantity', headerTooltip: 'Quantity', field: 'confirmedQuantity', width: 100, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center']},
    { headerName: 'Price', headerTooltip: 'Price', field: 'price', width: 100, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center']},
    { headerName: 'Order Value', headerTooltip: 'Order Value', field: 'orderValue', width: 100, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center']},
    {
      headerName: 'Status', field: 'orderStatus', headerTooltip: 'Status', cellRendererFramework: AGGridCellRendererComponent, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'],
      cellRendererParams: function (params) {
        var classArray: string[] = [];
        classArray.push('aggrid-content-center');
        let newClass = params.value === 'Stemmed' ? 'custom-chip darkgreen' :
          params.value === 'Confirmed' ? 'custom-chip darkblue' :
          params.value === 'Invoiced' ? 'custom-chip darkgreen' :
          params.value === 'Delivered' ? 'custom-chip darkgreen' :
          params.value === 'Cancelled' ? 'custom-chip red' :
          params.value === 'PartiallyInvoiced' ? 'custom-chip darkgreen' :
          params.value === 'PartiallyDelivered' ? 'custom-chip darkgreen' :
            params.value === 'Inquired' ? 'custom-chip purple' :
              '';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null }
      }
    },

    { headerName: 'Type', headerTooltip: 'Type', field: 'agreementType', width: 100, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center']},
    { headerName: 'Dept', headerTooltip: 'Dept', field: 'department', width: 100, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center']},
    { headerName: 'Sub Dept', headerTooltip: 'Sub Dept', field: 'subDepartment', width: 100, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center']},
    { headerName: 'Service', headerTooltip: 'Service', field: 'serviceName', width: 100, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center']},
    { headerName: 'Top up Volume', headerTooltip: 'Top up Volume', field: 'topUpVol', width: 100, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center']},
    { headerName: 'SOA', headerTooltip: 'SOA', field: 'soa', width: 100, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center']}
  ]

  private columnDefs_BdnReport = [
    {
     headerName: '', 
     headerCheckboxSelection: true,
     headerCheckboxSelectionFilteredOnly: true,
    field: 'fileSelect', 
    width: 30,
    checkboxSelection: true,
    suppressMenu: true,
    

    editable:true,
    },
    { headerName: 'Order ID', headerTooltip: 'Order ID', field: 'orderId', width: 30},
    { headerName: 'Order Date', headerTooltip: 'Order Date', field: 'orderDate', cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 140 },
    { headerName: 'Delivery Date', headerTooltip: 'Delivery Date', field: 'deliveryDate', cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 140 },
    { headerName: 'Quantity', headerTooltip: 'Quantity', field: 'deliveredQuantity', width: 100, headerClass: ['aggrid-text-align-r'], cellClass: ' aggrid-vertical-right'},
    { headerName: 'File Name', headerTooltip: 'File Name', field: 'bdnFileName', 
    cellRendererFramework: AGGridDownloadFileComponent, 
    cellRendererParams:(params)=> {return{ type : 'Data-date',cellClass: ['custom-chip dark aggrid-space'] }},
    width: 100, cellClass: 'aggridlink aggrid-vertical-center'},
  ];

  onDateChange(event) {
    console.log('selected date  !!!!!!!!!!!!!!', event);
  this.getBdnReport(event.fromDate, event.toDate);
  }

  onBtExport() {
     
    console.log("sssssss", this.gridBdnReportOptions);
    this.getSelectedbdnreport = [];
    this.getSelectedbdnreport = this.gridBdnReportOptions.api.getSelectedRows();
    this.getSelectedbdnreport.forEach((item: any) => {
      if(item.bdnFileName !=null){
        this.downloadDocument(item);
      }
      
     });
   
  }

  onPageChange(page: number): void {
    // this.gridOrderDetailsOptions.api.page = page;
  }

  ExcelReportsdownload(val: any): void {
     
    if(val == 'bdnReports'){
      this.gridBdnReportOptions.api.exportDataAsExcel({
        onlySelected: false
      });
    }
    else
    {
      this.gridOrderDetailsOptions.api.exportDataAsExcel({
        onlySelected: false
      });

    }
    

  }

  downloadDocument(param: any): void {
    console.log("00000000000final0000000", param)
    const request = {
      Payload: { Id: param.bdnFileID}
    };
    this.mastersApi.downloadDocument(request).subscribe(
      response => {
        this._FileSaverService.save(response, param.bdnFileName);
      },
      () => {
        this.appErrorHandler.handleError(ModuleError.DocumentDownloadError);
      }
    );
}

  private columnDefs_myvessels = [
    {
      headerName: 'Vessel Name', headerTooltip: 'Vessel Name', field: 'vesselName', width: 150,
      cellClass: function (params) {
        var classArray: string[] = ['aggridlink aggrid-vertical-center'];
        let newClass =
          params.data.severity === '3' ? 'aggrid-left-ribbon mediumred1' :
            (params.data.severity === '2' ? 'aggrid-left-ribbon mediumamber' :
              'aggrid-left-ribbon mediumblue1');
        classArray.push(newClass);
        return classArray.length > 0 ? classArray : null
      },
      cellRendererFramework: AGGridCellDataComponent, cellRendererParams: (params)=>{return  {type: 'vesselName' }}
    },

    { headerName: 'Service ID', headerTooltip: 'Service ID', field: 'serviceId', width: 100, cellClass: ' aggrid-vertical-center',cellRendererFramework: AGGridCellRendererComponent},
    { headerName: 'Dept ID', headerTooltip: 'Dept ID', field: 'deptId', width: 100, cellClass: ' aggrid-vertical-center',cellRendererFramework: AGGridCellRendererComponent },
    { headerName: 'Ownership', headerTooltip: 'Ownership', field: 'ownership', width: 100, cellClass: 'aggrid-columgroup-splitter-right aggrid-vertical-center',cellRendererFramework: AGGridCellRendererComponent },
    { headerName: 'Destination', headerTooltip: 'Destination', field: 'destination', width: 130, cellClass: ' aggrid-vertical-center',cellRendererFramework: AGGridCellRendererComponent },
    { headerName: 'ETA', headerTooltip: 'ETA', field: 'destinationEta', width: 140,
      cellRendererFramework: AGGridCellDataComponent, cellRendererParams:(params)=> {return{ type : 'Data-date',cellClass: ['custom-chip dark aggrid-space'] }}, 
      headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'] 
    },
    { headerName: 'Next desitination', headerTooltip: 'Next destination', field: 'nextDestination', width: 150, cellClass: ' aggrid-vertical-center',cellRendererFramework: AGGridCellRendererComponent },
    { headerName: 'ETA', headerTooltip: 'ETA', field: 'nextDestinationEta', width: 140,
      cellRendererFramework: AGGridCellDataComponent, cellRendererParams:(params)=> {return{ type : 'Data-date',cellClass: ['custom-chip dark aggrid-space'] }}, 
      headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center aggrid-columgroup-splitter-right'] 
    },
    {
      headerName: 'HSFO', headerTooltip: 'HSFO', field: 'hsfo_current_stock', width: 100,
      headerClass: ['aggrid-text-align-c'],
      cellRendererFramework: AGGridCellRendererComponent,
      cellClass: ['inset-cell aggrid-content-center '],
      cellRendererParams: function (params) {
        var classArray: string[] = [];
        classArray.push(' aggrid-space');
        let newClass = params.value === '120 MT' ? 'bg-red p-lr-5 ' :
          params.value === 'New' ? 'custom-chip amber' :
            params.value === 'Inquired' ? 'custom-chip purple' :
              'inner-box p-lr-5';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null }
      }
    },
    {
      headerName: 'VLSFO', headerTooltip: 'VLSFO', field: 'vlsfo_current_stock', width: 100,
      headerClass: 'aggrid-text-align-c',
      cellClass: ['inset-cell aggrid-content-center'],
      cellRendererFramework: AGGridCellRendererComponent,
      cellRendererParams: function (params) {
        var classArray: string[] = [];
        classArray.push(' aggrid-space');
        let newClass = params.value === '120 MT' ? 'bg-yellow p-lr-5 ' :

          'inner-box p-lr-5';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null }
      }
    },
    {
      headerName: 'ULSFO', headerTooltip: 'ULSFO', field: 'ulsfo_current_stock', width: 100,
      headerClass: ['aggrid-text-align-c'],
      cellRendererFramework: AGGridCellRendererComponent,
      cellClass: ['inset-cell aggrid-content-center '],
      cellRendererParams: function (params) {
        var classArray: string[] = [];
        classArray.push(' aggrid-space');
        let newClass = params.value === '120 MT' ? 'bg-red p-lr-5 ' : 'inner-box p-lr-5';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null }
      }
    },
    {
      headerName: 'LSDIS', headerTooltip: 'LSDIS', field: 'lsdis_current_stock', width: 100,
      headerClass: ['aggrid-text-align-c'],
      cellRendererFramework: AGGridCellRendererComponent,
      cellClass: ['inset-cell aggrid-content-center '],
      cellRendererParams: function (params) {
        var classArray: string[] = [];
        classArray.push(' aggrid-space');
        let newClass = params.value === '120 MT' ? 'bg-yellow p-lr-5' : 'inner-box p-lr-5';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null }
      }
    },
    {
      headerName: 'HSDIS', headerTooltip: 'HSDIS', field: 'hsdis_current_stock', width: 100,
      headerClass: 'aggrid-text-align-c',
      cellClass: ['inset-cell aggrid-content-center  aggrid-columgroup-splitter-right'],
      cellRendererFramework: AGGridCellRendererComponent,
      cellRendererParams: function (params) {
        var classArray: string[] = [];
        classArray.push(' aggrid-space');
        let newClass = params.value === '120 MT' ? 'bg-yellow p-lr-5 ' :

          'inner-box p-lr-5';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null }
      }
    },
    { headerName: 'New Request', headerTooltip: 'New Request', field: 'newrequest', cellClass: 'aggridlink aggrid-vertical-center', width: 120,
      cellRendererFramework: AGGridCellDataComponent, 
      cellRendererParams: { type: 'newRequest', redirectUrl: `${this.shiptechUrl}/#/new-request` },
    }
  ];

  private columnDefs_unmanageablevessels = [
    {
      headerName: 'Vessel Name', headerTooltip: 'Vessel Name', field: 'vesselName', width: 100, filter: 'text',//cellRendererFramework: AGGridCellRendererComponent,
      cellClass: function (params) {
        var classArray: string[] = ['aggridlink aggrid-vertical-center aggrid-left-ribbon mediumred1'];
        return classArray.length > 0 ? classArray : null
    
      } ,
      cellRendererFramework: AGGridCellDataComponent, cellRendererParams: (params)=>{return  {type: 'vesselName' }}
    },

    { headerName: 'Service ID', headerTooltip: 'Service ID', field: 'serviceId', width: 100, cellClass: 'aggrid-vertical-center' },
    { headerName: 'Dept ID', headerTooltip: 'Dept ID', field: 'deptId', width: 100, cellClass: 'aggrid-vertical-center' },
    { headerName: 'Ownership', headerTooltip: 'Ownership', field: 'ownership', width: 100, cellClass: 'aggrid-columgroup-splitter-right aggrid-vertical-center' },
    { headerName: 'Data Source', headerTooltip: 'Data Source', field: 'dataSource', cellClass: 'aggrid-vertical-center', width: 120, },
    {
      headerName: 'Data Date', headerTooltip: 'Data Date', field: 'datadate',
      cellRendererFramework: AGGridCellDataComponent, cellRendererParams:(params)=> {return{ type : 'Data-date',cellClass: ['custom-chip dark aggrid-space'] }}, 
      headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center aggrid-columgroup-splitter-right'] 
    },
    { headerName: 'Details', headerTooltip: 'Details', field: 'detail', width: 350, cellClass: 'aggrid-vertical-center' },
    { headerName: 'No of Days Unmanageable', headerTooltip: 'No of Days Unmanageable', field: 'unmanagedDays', width: 150, cellClass: 'aggrid-vertical-center' },
  ];

  private columnDefs_outstandingrequest = [
    
    {
      headerName: 'Request ID', headerTooltip: 'Request ID', field: 'requestid', width: 120,
      cellClass: function (params) {
        var classArray: string[] = ['aggridlink aggrid-vertical-center'];
        let newClass = params.data.status === 'Stemmed' ? 'aggrid-left-ribbon darkgreen' :
          params.data.status === 'New' ? 'aggrid-left-ribbon amber' :
            params.data.status === 'Inquired' ? 'aggrid-left-ribbon purple' :
              'aggrid-left-ribbon dark';
        classArray.push(newClass);
        return classArray.length > 0 ? classArray : null
      }
    },
    { headerName: 'Service', field: 'service', headerTooltip: 'Service', width: 100, cellClass: 'aggrid-vertical-center' },
    { headerName: 'Vessel ID', field: 'VesselIMONO', headerTooltip: 'Vessel ID', width: 100, cellClass: 'aggrid-vertical-center' },
    { headerName: 'Vessel Name', headerTooltip: 'Vessel Name', field: 'VesselName', cellClass: 'aggridlink aggrid-vertical-center', width: 130 },
    {
      headerName: 'New Request', headerTooltip: 'New Request', field: 'newrequest', width: 130,
      headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center aggrid-columgroup-splitter-right aggridlink']
    },
    { headerName: 'Port', headerTooltip: 'Port', field: 'port', width: 100, cellClass: 'aggrid-vertical-center' },
    { headerName: 'ETA', headerTooltip: 'ETA', field: 'eta', cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 140 },
    { headerName: 'ETD', headerTooltip: 'ETD', field: 'etd', cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center aggrid-columgroup-splitter-right'], width: 140 },
    {
      headerName: 'Fuel Grade', headerTooltip: 'Fuel Grade', field: 'fuelgrade', cellRendererFramework: AGGridCellDataComponent, cellRendererParams: { type: 'multiple-values' }, cellClass: [' aggrid-columgroup-splitter-right aggrid-vertical-center'],
      valueGetter: function (params) {
        return params.data.fuelgrade;
      }
    },
    { headerName: 'Trader', field: 'trader', headerTooltip: 'Trader', width: 100, cellClass: 'aggrid-vertical-center' },
    { headerName: 'Operator', field: 'operator', headerTooltip: 'Operator', width: 100, cellClass: 'aggrid-vertical-center' },
    {
      headerName: 'Status', field: 'status', headerTooltip: 'Status', cellRendererFramework: AGGridCellRendererComponent, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'],
      cellRendererParams: function (params) {
        var classArray: string[] = [];
        classArray.push('aggrid-content-center');
        let newClass = params.value === 'Stemmed' ? 'custom-chip darkgreen' :
          params.value === 'New' ? 'custom-chip amber' :
            params.value === 'Inquired' ? 'custom-chip purple' :
              '';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null }
      }
    },
    { headerName: 'Request Type', headerTooltip: 'Request Type', field: 'retype', width: 100, cellClass: 'aggrid-vertical-center' },
  ];

  public rowData1 = [
    // {
    //   requestid: '12819ED', severity: '1', service: 'IA4', VesselName: 'Maersk Borneo', VesselIMONO: '90284727', newrequest: 'New Request', newreq: 'Physical', port: 'Seattle', eta: '10/10/2019 10:00', etd: '10/10/2019 10:00', fuelgrade: ['RMK850'], trader: 'Europe Trader', operator: 'Macheal Chris', status: 'Stemmed', serviceid: '271', deptid: 'MLAS', ownership: 'Chartered', destination: 'Marseile', nextdestination: 'Catania', hsfo: '220 MT', vlsfo: '320 MT', dogo: ' 450 MT', ulsfo: '200 MT', datasource: 'Pre Process', details: 'Fatal error generated by model', noofdays: '3 days', retype: 'Trader'
    // },  
 
  ];
  public rowData2 = [
    //{
    //  requestid: '12819ED', service: 'IA4', VesselName: 'Maersk Borneo', VesselIMONO: '90284727', newrequest: 'New Request', newreq: 'Physical', port: 'Seattle', eta: '10/10/2019 10:00', etd: '10/10/2019 10:00', fuelgrade: ['RMK850'], trader: 'Europe Trader', operator: 'Macheal Chris', status: 'Stemmed', serviceid: '271', deptid: 'MLAS', ownership: 'Chartered', destination: 'Marseile', nextdestination: 'Catania', hsfo: '120 MT', vlsfo: '320 MT', dogo: ' 450 MT', ulsfo: '200 MT', datasource: 'Pre Process', details: 'Fatal error generated by model', noofdays: '3 days', retype: 'Trader'
    //}

    ];
  public rowData3 = [
    {
      requestid: '12819ED', service: 'IA4', VesselName: 'Maersk Borneo', VesselIMONO: '90284727', newrequest: 'New Request', newreq: 'Physical', port: 'Seattle', eta: '10/10/2019 10:00', etd: '10/10/2019 10:00', fuelgrade: ['RMK850'], trader: 'Europe Trader', operator: 'Macheal Chris', status: 'Stemmed', serviceid: '271', deptid: 'MLAS', ownership: 'Chartered', destination: 'Marseile', nextdestination: 'Catania', hsfo: '120 MT', vlsfo: '320 MT', dogo: ' 450 MT', ulsfo: '200 MT', datasource: 'Pre Process', details: 'Fatal error generated by model', noofdays: '3 days', retype: 'Trader'
    },
    {
      requestid: '13587ED', service: '22D', VesselName: 'Maersk Beaufort', VesselIMONO: '9466013', newrequest: 'New Request', newreq: 'Physical', port: 'Ningbo', eta: '10/10/2019 10:00', etd: '10/10/2019 10:00', fuelgrade: ['RMK850', 'RMK5005'], trader: 'New York City', operator: 'No Operator', status: 'Inquired', serviceid: '271', deptid: 'MLAS', ownership: 'Chartered', destination: 'Marseile', nextdestination: 'Catania', hsfo: '468 MT', vlsfo: '120 MT', dogo: '120 MT', ulsfo: '200 MT', datasource: 'Pre Process', details: 'Fatal error generated by model', noofdays: '3 days', retype: 'Trader'
    },
    {
      requestid: '56900GA', service: '34R', VesselName: 'Maersk Brigit', VesselIMONO: '9465966', newrequest: 'New Request', newreq: 'Physical', port: 'Shanghai', eta: '10/10/2019 10:00', etd: '10/10/2019 10:00', fuelgrade: ['RMK850', 'RMK5005', 'RMK850', 'RMK850'], trader: 'East of Suez', operator: 'No Operator', status: 'New', serviceid: '271', deptid: 'MLAS', ownership: 'Chartered', destination: 'Marseile', nextdestination: 'Catania', hsfo: '468 MT', vlsfo: '320 MT', dogo: ' 450 MT', ulsfo: '200 MT', datasource: 'Pre Process', details: 'Fatal error generated by model', noofdays: '3 days', retype: 'BOPS'
    },
    {
      requestid: '12819ED', service: '1XT', VesselName: 'Maersk Belfast', VesselIMONO: '9465992', newrequest: 'New Request', newreq: 'Physical', port: 'Seattle', eta: '10/10/2019 10:00', etd: '10/10/2019 10:00', fuelgrade: ['RMK850'], trader: 'Europe Trader', operator: 'Macheal Chris', status: 'Stemmed', serviceid: '271', deptid: 'MLAS', ownership: 'Chartered', destination: 'Marseile', nextdestination: 'Catania', hsfo: '468 MT', vlsfo: '320 MT', dogo: ' 120 MT', ulsfo: '200 MT', datasource: 'Pre Process', details: 'Fatal error generated by model', noofdays: '3 days', retype: 'BOPS'
    },
    {
      requestid: '13587ED', service: '22D', VesselName: 'VS Remlin', VesselIMONO: '4354355', newrequest: 'New Request', newreq: 'Physical', port: 'Ningbo', eta: '10/10/2019 10:00', etd: '10/10/2019 10:00', fuelgrade: ['RMK850', 'RMK5005'], trader: 'New York City', operator: 'No Operator', status: 'Inquired', serviceid: '271', deptid: 'MLAS', ownership: 'Chartered', destination: 'Marseile', nextdestination: 'Catania', hsfo: '468 MT', vlsfo: '320 MT', dogo: ' 450 MT', ulsfo: '200 MT', datasource: 'Pre Process', details: 'Fatal error generated by model', noofdays: '3 days', retype: 'Trader'
    },
    {
      requestid: '56900GA', service: '90P', VesselName: 'VS Riesa', VesselIMONO: '23423423', newrequest: 'New Request', newreq: 'Physical', port: 'Shanghai', eta: '10/10/2019 10:00', etd: '10/10/2019 10:00', fuelgrade: ['RMK850', 'RMK5005', 'RMK850', 'RMK850',], trader: 'East of Suez', operator: 'No Operator', status: 'New', serviceid: '271', deptid: 'MLAS', ownership: 'Chartered', destination: 'Marseile', nextdestination: 'Catania', hsfo: '468 MT', vlsfo: '320 MT', dogo: ' 450 MT', ulsfo: '200 MT', datasource: 'Pre Process', details: 'Fatal error generated by model', noofdays: '3 days', retype: 'BOPS'
    },
    {
      requestid: '126678ED', service: '17T', VesselName: 'Great Immanuel', VesselIMONO: '3454354', newrequest: 'New Request', newreq: 'Physical', port: 'Houston', eta: '10/10/2019 10:00', etd: '10/10/2019 10:00', fuelgrade: ['DMA01'], trader: 'New York City', operator: 'Steve Thomas', status: '', serviceid: '271', deptid: 'MLAS', ownership: 'Chartered', destination: 'Marseile', nextdestination: 'Catania', hsfo: '468 MT', vlsfo: '320 MT', dogo: ' 450 MT', ulsfo: '200 MT', retype: 'Trader'
    },
    {
      requestid: '126678ED', service: '17T', VesselName: 'Sloman Themis', VesselIMONO: '78978978', newrequest: 'New Request', newreq: 'Physical', port: 'Houston', eta: '10/10/2019 10:00', etd: '10/10/2019 10:00', fuelgrade: ['DMA01'], trader: 'New York City', operator: 'Steve Thomas', status: '', serviceid: '271', deptid: 'MLAS', ownership: 'Chartered', destination: 'Marseile', nextdestination: 'Catania', hsfo: '468 MT', vlsfo: '320 MT', dogo: ' 450 MT', ulsfo: '200 MT', retype: 'Trader'
    }


  ];
  // changeVessel(event) {
  //   if (event) {
  //     let rows = this.rowData1.filter(item => item.VesselIMONO == event.VesselIMONO);
  //     if (rows.length > 0)
  //       this.gridOptions.api.setRowData(rows);
  //     else {
  //       this.gridOptions.api.setRowData(this.isValue == 1 ? this.rowData1 : this.isValue == 2 ? this.rowData2 : this.rowData3);
  //     }
  //   }
  //   else {
  //     this.gridOptions.api.setRowData(this.isValue == 1 ? this.rowData1 : this.isValue == 2 ? this.rowData2 : this.rowData3);
  //   }
  // }

  columnDefs = [
    {
      headerName: 'Request ID', headerTooltip: 'Request ID', 
      field: 'requestId', width: 100, headerClass: ['aggrid-text-align-c'],
      filter: 'text',
      cellRendererFramework: AGGridCellDataComponent, 
      cellRendererParams: { type: 'request-link', redirectUrl: `${this.shiptechUrl}/#/edit-request` },
      cellStyle: params => {
        let colorCode = params?.data?.requestStatus?.colorCode;
        if(colorCode?.code) {
          return {'box-shadow': `inset 4px 0px 0px -1px ${colorCode.code}`};
        }
        return null;
      },
      cellClass: function (params) {
        var classArray: string[] = ['aggrid-link', 'aggrid-content-c', 'aggrid-left-ribbon'];
        let status = params?.data?.requestStatus?.displayName;
        return classArray.length > 0 ? classArray : null
      }
    },
    { headerName: 'Service', field: 'serviceName', filter: 'text', headerTooltip: 'Service', headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 100 },
    { headerName: 'Vessel ID', field: 'vesselId', filter: 'text', headerTooltip: 'Vessel ID', headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 100 },
    { headerName: 'Vessel Name', field: 'vesselName', filter: 'text', headerTooltip: 'Vessel Name', 
      headerClass: ['aggrid-text-align-c'], 
      cellClass: ['aggrid-content-center'], width: 100,
      cellRendererFramework: AGGridCellDataComponent, 
      cellRendererParams: { type: 'vesselName', redirectUrl: `${this.shiptechUrl}/#/new-request` }
    },
    { 
      headerName: 'New Request', headerTooltip: 'New Request', field: 'newrequest', cellClass: 'aggridlink aggrid-vertical-center', width: 100,
      cellRendererFramework: AGGridCellDataComponent, 
      cellRendererParams: { type: 'newRequest', redirectUrl: `${this.shiptechUrl}/#/new-request` },
    },
    { headerName: 'Port', headerTooltip: 'Port', field: 'locationName', filter: 'text', width: 100, cellClass: ['aggrid-content-c aggrid-column-splitter-left'] },
    { headerName: 'ETA', headerTooltip: 'ETA', field: 'eta', filter: 'date', cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 140 },
    { headerName: 'ETD', headerTooltip: 'ETD', field: 'etd', filter: 'date', cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 140 },
    {
      headerName: 'Fuel Grade', headerTooltip: 'Fuel Grade', width: 160, field: 'productName', filter: 'text', cellRendererFramework: AGGridCellDataComponent, cellRendererParams: { type: 'multiple-values', gridTable: 'future-request' }, cellClass: ['aggrid-content-c aggrid-column-splitter-left'],
      valueGetter: function (params) {
        if(params?.data?.productName) {
          return [params.data.productName];
        } else {
          return []
        }
      }
    },
    { headerName: 'Trader', field: 'buyerName', filter: 'text', headerTooltip: 'Trader', width: 100, cellClass: ['aggrid-content-c aggrid-column-splitter-left'] },
    { headerName: 'Operator', field: 'operatorByName', filter: 'text', headerTooltip: 'Operator', width: 100, cellClass: ['aggrid-content-c'] },
    {
      headerName: 'Status', field: 'requestStatus.displayName', filter: 'text', 
      headerTooltip: 'Status', 
      cellRendererFramework: AGGridCellRendererComponent, headerClass: ['aggrid-text-align-c'], 
      cellClass: ['aggrid-content-center'],
      cellRendererParams: function (params) {
        var classArray: string[] = [];
        let cellStyle = {};
        let status = params?.data?.requestStatus?.displayName;
        classArray.push('aggrid-content-center');
        classArray.push('custom-chip');

        let colorCode = params?.data?.requestStatus?.colorCode;
        if(colorCode?.code) {
          cellStyle = {background: colorCode.code};
        }
        return { cellClass: classArray.length > 0 ? classArray : null, cellStyle: cellStyle }
      }
    },
    // { headerName: 'Request Type', headerTooltip: 'Request Type', field: 'requestTypeName', width: 110, cellClass: ['aggrid-content-c'] },
    { headerName: 'Created by', headerTooltip: 'Created by', field: 'createdByName', filter: 'text', width: 110, cellClass: ['aggrid-content-c'] },
  ];
  
  toggle1() {
    this.isValue = 1;
    this.gridOptions.api.setColumnDefs(this.columnDefs_myvessels);
    this.gridOptions.api.setRowData(this.rowData1);
    this.gridOptions.api.sizeColumnsToFit();
    this.vesselList = this.rowData1;
    this.clearSearch();
  }
  toggle2() {
    this.isValue = 2;
    this.gridOptions.api.setColumnDefs(this.columnDefs_unmanageablevessels);
    this.gridOptions.api.setRowData(this.rowData2);
    this.gridOptions.api.sizeColumnsToFit();
    this.vesselList = this.rowData2;
    this.clearSearch();
  }
  toggle3() {
    this.isValue = 3;
    // this.gridOptions.api.setRowData(this.rowData); 
    this.gridOptions.api.setColumnDefs(this.columnDefs_outstandingrequest);
    this.gridOptions.api.setRowData(this.rowData3);
    this.gridOptions.api.sizeColumnsToFit();
    this.vesselList = this.rowData3;
    this.clearSearch();
  }
  clearSearch() {
    this.searchComponent.selectedValue = "";
    this.searchComponent.searchVesselControl.setValue("");
    this.searchComponent.enableVesselList = true;
    this.searchComponent.filterList = [];
    this.searchComponent.displayClose = false;
    // this.searchComponent.option.forEach(element=>{
    //   element._element.nativeElement.classList.remove("selected")
    // })

  }

  public loadAllMyVessels(){
    let req = { VesselId : -1};
    this.vesselService.getVesselBasicInfo(req).subscribe((res)=>{
      if(res.payload.length > 0){
        this.rowData1 = res.payload;
        if(this.gridOptions.api && this.rowData1 !=null)
          this.gridOptions.api.setRowData(this.rowData1);
      }
      this.triggerUpdateEvent();
      this.setRowCount(this.gridOptions);
    })
  }

  gettabvalue(event){
     
    console.log("event.index",event.index)
    if(event.index == 0){
      this.Enabledbdnreports = true;
      this.getBdnReport(this.selectedFromDate, this.selectedToDate);
    }
    else{
      this.Enabledbdnreports = false;
      this.getOrderDetails(1, 25, this.selectedFromDate, this.selectedToDate);
    }
    

  }

  getReporttaborelse(event){
    if(event.index == 1){
      this.EnableReportDate = true;
      this.Enabledbdnreports = true;
      
      this.getBdnReport(this.selectedFromDate, this.selectedToDate);
    }
    else{

      this.EnableReportDate = false;
      
    }

  }
  public getOrderDetails(PageNo, PageSize, FromDelDate, ToDelDate){
    // let req = {"FromDelDate":"2020-01-01", "ToDelDate":"2020-01-10"}
    let req = { PageNo : 1, PageSize : 25, FromDelDate: FromDelDate,ToDelDate:ToDelDate};
    this.vesselService.getOrderDetails(req).subscribe((res)=>{
      this.OrderDetailsData = [];

      this.OrderDetailsData = res.payload;
      this.OrderDetailsData.forEach((item: any) => {
        item.deliveryDate = moment(item.deliveryDate).format('MM/DD/YYYY HH:mm');
        item.orderDate = moment(item.orderDate).format('MM/DD/YYYY HH:mm');
       });
      this.gridOrderDetailsOptions.api.setColumnDefs(this.columnDefs_OrderDetails);
    this.gridOrderDetailsOptions.api.setRowData(this.OrderDetailsData);
    this.gridOrderDetailsOptions.api.sizeColumnsToFit();
    this.rowCount = this.gridOrderDetailsOptions.api.getDisplayedRowCount();
     
    })
  }

  public getBdnReport(FromDelDate, ToDelDate){

    let req = { IsDefaultDate : 1,FromDelDate: FromDelDate,ToDelDate:ToDelDate};
    // let req = {"FromDelDate":"2020-01-01", "ToDelDate":"2020-01-10"}
    // {"Payload": {"IsDefaultDate":1,"ToDelDate":"2020-01-28", "FromDelDate":"2020-01-19"}}
    this.vesselService.getBdnReport(req).subscribe((res)=>{
      this.BdnReportsData = res.payload;
      this.BdnReportsData.forEach((item: any) => {
        item.deliveryDate = moment(item.deliveryDate).format('MM/DD/YYYY HH:mm');
        item.orderDate = moment(item.orderDate).format('MM/DD/YYYY HH:mm');
       });
      this.gridBdnReportOptions.api.setColumnDefs(this.columnDefs_BdnReport);
    this.gridBdnReportOptions.api.setRowData(this.BdnReportsData);
    // this.gridBdnReportOptions.api.paginationSetPageSize(10);
    // this.pagesize = 10;
    //     this.gridBdnReportOptions.paginationPageSize = 10;
    this.gridBdnReportOptions.api.sizeColumnsToFit();
    this.rowCount = this.gridBdnReportOptions.api.getDisplayedRowCount();
    // this.gridBdnReportOptions.api.paginationSetPageSize(Number(10));
     
    })
  }

  public loadUnmanageableVessels(){
    let requestPayload = ""
    this.localService.getUnmanagedVessels(requestPayload).subscribe((data: any)=>
    {
      this.rowData2 = data.payload;
      console.log(this.rowData2);
      this.vesselList=[];
      this.rowData2.forEach(rowData=>{
      this.vesselList.push(data =>{
        data.id = rowData.vesselId,
        data.imono = rowData.VesselIMONO,
        data.name = rowData.vesselName,
        data.displayName = rowData.VesselName
      })
    })
      this.triggerUpdateEvent();
    }
    );
    
  }

  public triggerUpdateEvent(){
    let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
      titleEle.click();
  }
  public setRowCount(gridOptions){
    this.rowCount = gridOptions.api.getDisplayedRowCount();
  }

  // public onPageChange(input){
  //   this.gridOptions.api.paginationGoToPage(parseInt(input));  
  //   this.currentPage = this.gridOptions.api.paginationGetCurrentPage();
  // }

  // public onPaginationChange(event){
  //   this.gridOptions.api.paginationSetPageSize(event.value);
    
  // }

  // public onPaginationChangedEvent(event){
  //   this.gridOptions.api.paginationSetPageSize(Number(this.paginationPageSize));
  // }

}
