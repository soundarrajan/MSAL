import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { GridOptions } from '@ag-grid-community/core';
import { AGGridCellRendererComponent } from '../ag-grid/ag-grid-cell-renderer.component';
import { AGGridCellDataComponent } from '../ag-grid/ag-grid-celldata.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { FormGroup, FormControl } from '@angular/forms';
import { SearchVesselComponent } from '../search-vessel/search-vessel.component';
import { LocalService } from '../../services/local-service.service';
import { VesselDetailsComponent } from '../vessel-details/vessel-details.component';
import { VesselPopupService } from '../../services/vessel-popup.service';
import moment from 'moment';
import { ApiCall } from '@shiptech/core/utils/decorators/api-call.decorator';
@Component({
  selector: 'app-smart-operator',
  templateUrl: './smart-operator.component.html',
  styleUrls: ['./smart-operator.component.scss']
})
export class SmartOperatorComponent implements OnInit {
  isValue: number = 3 ;
  public gridOptions: GridOptions;
  public gridOptions1: GridOptions;
  public gridOptions2: GridOptions;
  public colResizeDefault;
  public rowCount: Number;
  rowData: any[];
  public date = new FormControl(new Date());
  public vesselList = [];
  @Output() showTableViewEmit = new EventEmitter();
  @Output() clickEvent = new EventEmitter();
  @ViewChild(SearchVesselComponent) searchComponent;
  @Output() showBPlan = new EventEmitter();
  @ViewChild(VesselDetailsComponent) vesselDetail;
  public changeVessel;
  public coldefOnClick:any;
    public shiptechUrl : string = '';
  
  constructor(private localService: LocalService,private vesselService : VesselPopupService,
    iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'data-picker',
      sanitizer.bypassSecurityTrustResourceUrl('../assets/customicons/datepicker.svg'));
    
    this.shiptechUrl =  new URL(window.location.href).origin;

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
       }
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
        this.gridOptions1.api.setRowData(this.rowData2);
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

    { headerName: 'Service ID', headerTooltip: 'Service ID', field: 'serviceId', width: 100, cellClass: ' aggrid-vertical-center' },
    { headerName: 'Dept ID', headerTooltip: 'Dept ID', field: 'deptId', width: 100, cellClass: ' aggrid-vertical-center' },
    { headerName: 'Ownership', headerTooltip: 'Ownership', field: 'ownership', width: 100, cellClass: 'aggrid-columgroup-splitter-right aggrid-vertical-center' },
    { headerName: 'Destination', headerTooltip: 'Destination', field: 'destination', width: 130, cellClass: ' aggrid-vertical-center' },
    { headerName: 'ETA', headerTooltip: 'ETA', field: 'destinationEta', width: 140,
      cellRendererFramework: AGGridCellDataComponent, cellRendererParams:(params)=> {return{ type : 'Data-date',cellClass: ['custom-chip dark aggrid-space'] }}, 
      headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'] 
    },
    { headerName: 'Next desitination', headerTooltip: 'Next destination', field: 'nextDestination', width: 150, cellClass: ' aggrid-vertical-center' },
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
      cellRendererParams: { type: 'newRequest', redirectUrl: `${this.shiptechUrl}/#/edit-request` },
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
        if(this.rowData1 != null)
          this.gridOptions.api.setRowData(this.rowData1);
      
      }
      let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
      titleEle.click();
      this.rowCount = this.gridOptions.api.getDisplayedRowCount();
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
      let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
      titleEle.click();
    }
    );
    
  }

  
}
