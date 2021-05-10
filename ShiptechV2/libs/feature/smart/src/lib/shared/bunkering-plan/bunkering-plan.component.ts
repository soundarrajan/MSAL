import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { GridOptions } from '@ag-grid-community/core';
import { AGGridCellDataComponent } from '../ag-grid/ag-grid-celldata.component';
// import { AgGridInputCellEditor } from '../ag-grid/ag-grid-input-cell-editor';
import { AGGridCellRendererComponent } from '../ag-grid/ag-grid-cell-renderer.component';
import { Store } from '@ngxs/store';
import { BunkeringPlanColmGroupLabels, BunkeringPlanColumnsLabels } from './view-model/bunkering-plan.column';
import { LocalService } from '../../services/local-service.service';
import { BunkeringPlanService } from '../../services/bunkering-plan.service';
import { LoadBunkeringPlanDetailsAction } from '../../store/bunker-plan/bunkering-plan.action';

@Component({
  selector: 'app-bunkering-plan',
  templateUrl: './bunkering-plan.component.html',
  styleUrls: ['./bunkering-plan.component.scss']
})
export class BunkeringPlanComponent implements OnInit {

  public gridOptions: GridOptions;
  public colResizeDefault;
  public rowCount: Number;
  public gridSaved: boolean;
  public gridChanged: boolean = false;
  public rowData ;
  public bPlanData: any;
  public selectedPort: any = [];
  vesselData: any;
  latestPlanId: any;
  @Output() enableCreateReq = new EventEmitter();
  @Output() voyage_detail = new EventEmitter();
  @Output() loadBplan = new EventEmitter();
  @Input("isExpanded") isExpanded: boolean;
    @Input('planId') 
  public set planId(v : string) {
    if (v == null)
    this.latestPlanId = '';
    else
    this.latestPlanId = v;
  };
  @Input('vesselRef') 
  public set vesselRef(v : string) {
    this.vesselData = v;
    this.loadBunkeringPlanDetails();
  };
  @Input('bPlanType') bPlanType;
  @Input('selectedUserRole')selectedUserRole;
  @Input('currentROBObj') currentROBObj;
  constructor(private bplanService: BunkeringPlanService, private localService: LocalService, private store: Store) {
       
    this.gridOptions = <GridOptions>{
      columnDefs: this.columnDefs,
      enableColResize: false,
      enableSorting: false,
      animateRows: false,
      headerHeight: 50,
      rowHeight: 30,
      groupHeaderHeight: 20,
      enableCellChangeFlash: true,
      defaultColDef: {
        filter: false,
        sortable: false,
        resizable: false,
        suppressMenu: true,
      },
      rowSelection: 'single',
      overlayLoadingTemplate:
    '<span class="ag-overlay-loading-center">Rows are loading...</span>',
    
      onGridReady: (params) => {
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;
        this.gridOptions.api.setRowData(this.rowData);
        this.gridOptions.api.sizeColumnsToFit();
        this.rowCount = this.gridOptions.api.getDisplayedRowCount();
        this.gridOptions.api.showLoadingOverlay();
        
      },
      onCellValueChanged: ($event) => {
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
      refreshGrid: ($event) =>{
        this.gridOptions.api.refreshInMemoryRowModel();
      }
    };
  }
  
  ngOnInit() {
  }
  
  columnDefs = [
    {
      headerClass: ['cell-border-bottom '],
      pinned: 'left',
      children: [
        {
          headerName: BunkeringPlanColumnsLabels.OperAck, headerTooltip: BunkeringPlanColumnsLabels.OperAck, field: "operator_ack",
          resizable: false,
          width: 45,
          cellClassRules: {
            'lightgreen': function (params) {
              return params.value == 0?true:false;
            }
          },
          cellClass: ['custom-check-box aggrid-content-center aggrid-left-ribbon '],
          headerClass: ['aggrid-text-align-c '],
          cellRendererFramework: AGGridCellDataComponent,
          cellRendererParams: (params)=>{
            return {type: 'checkbox', cellClass: this.bPlanType == 'C'?['aggrid-white-checkbox'] :['custom-check-box readonly aggrid-left-ribbon  aggrid-content-center'], context: { componentParent: this } }
          }
        },
        {
          headerName: BunkeringPlanColumnsLabels.PortCode, headerTooltip: BunkeringPlanColumnsLabels.PortCode, field: 'port_id', width: 96, cellRendererFramework: AGGridCellDataComponent,
         cellClassRules: {
            'aggrid-cell-color light-cell': function (params) {
              return params.rowIndex == params.api?.rowModel?.rowsToDisplay?.length -1 ;
            }
          },cellRendererParams: (params) =>{
           return { type: this.bPlanType == 'C'?'port' : 'port-readOnly', context: { componentParent: this } } 
          },
          cellClass: ['dark-cell aggrid-content-center'], headerClass: [' aggrid-colum-splitter-left aggrid-text-align-c']
        },
        {
          headerName: BunkeringPlanColmGroupLabels.Hsfo,
          headerTooltip: BunkeringPlanColmGroupLabels.Hsfo,
          marryChildren: true,
          resizable: false,
          headerClass: ['aggrid-columgroup-splitter-left aggrid-text-align-c '],
          children: [
            {
              headerName: BunkeringPlanColumnsLabels.HsfoMaxLift, field: 'hsfo_max_lift', headerTooltip: BunkeringPlanColumnsLabels.HsfoMaxLift, width: 50, cellRendererFramework: AGGridCellDataComponent, cellClass: params=>{if (this.bPlanType == 'C'&& this.selectedUserRole?.id === 1) return 'aggrid-green-editable-cell editable'; else return 'aggrid-green-editable-cell ag-cell' }, headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: (params) => {
                var classArray: string[] = [];
                let newClass;
                if(params.data?.hsfo_max_lift_color === 'G')
                  newClass = 'aggrid-cell-color darkgreen';
                else if(params.data?.hsfo_max_lift_color === 'M')
                  newClass = 'aggrid-cell-color magenta';
                else
                  newClass = 'aggrid-cell-color brown';

                classArray.push(newClass);
                return { type: this.bPlanType == 'C'&& this.selectedUserRole?.id === 1? 'edit':'edit-disabled', context: { componentParent: this },cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            { headerName: BunkeringPlanColumnsLabels.HsfoEstdSoa, headerTooltip: BunkeringPlanColumnsLabels.HsfoEstdSoa, field: 'hsfo_current_stock', width: 50,
              valueFormatter: function soaFormatter (params){

                return params.value;
              },
              cellRendererParams: { type: 'edit-soa', context: { componentParent: this } },  cellClass: ['aggrid-content-right '], headerClass: ['aggrid-colum-splitter-left'] 
            },
            {
              headerName: BunkeringPlanColumnsLabels.HsfoEstdCons, headerTooltip: BunkeringPlanColumnsLabels.HsfoEstdCons, field: 'hsfo_estimated_consumption', width: 50, cellRendererFramework: AGGridCellDataComponent, headerClass: ['aggrid-colum-splitter-left'], cellClass: params=>{if (this.bPlanType == 'C'&& this.selectedUserRole?.id === 1) return 'aggrid-green-editable-cell editable'; else return 'aggrid-green-editable-cell ag-cell' },
              cellRendererParams: (params) => {
                var classArray: string[] = [];
                let newClass;
                if(params.data?.hsfo_est_consumption_color === 'G')
                  newClass = 'aggrid-cell-color darkgreen';
                else if(params.data?.hsfo_est_consumption_color === 'M')
                  newClass = 'aggrid-cell-color magenta';
                else
                  newClass = 'aggrid-cell-color brown';

                classArray.push(newClass);
                return { type: this.bPlanType == 'C'&& this.selectedUserRole?.id === 1? 'edit-cons':'edit-disabled', context: { componentParent: this }, cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            {
              headerName: BunkeringPlanColumnsLabels.HsfoConfPlanLift, headerTooltip: BunkeringPlanColumnsLabels.HsfoConfPlanLift, field: 'hsfo_estimated_lift', width: 50, cellRendererFramework: AGGridCellDataComponent, cellClass: 'pd-1 aggrid-content-right', headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: function (params) {
                var classArray: string[] = ['pd-6'];
                let newClass;
                if(params.data?.order_id_hsfo && !params.data?.request_id_hsfo){
                  newClass = 'aggrid-link-bplan aggrid-red-cell'
                  classArray.push(newClass);
                }
                else if(params.data?.request_id_hsfo && !params.data?.order_id_hsfo){
                  newClass = 'aggrid-link-bplan aggrid-blue-cell';
                  classArray.push(newClass);
                }
                  
                return { type: 'link', cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            {
              headerName: BunkeringPlanColumnsLabels.HsfoSafePort, headerTooltip: BunkeringPlanColumnsLabels.HsfoSafePort, field: 'hsfo_safe_port', width: 50, cellClass: params=>{if (this.bPlanType == 'C'&& this.selectedUserRole?.id === 1) return 'aggrid-columgroup-splitter aggrid-green-editable-cell editable'; else return 'aggrid-green-editable-cell ag-cell' }, headerClass: ['aggrid-columgroup-splitter aggrid-colum-splitter-left'],
              cellRendererFramework: AGGridCellDataComponent,
              // editable:true,
              // cellEditorFramework: AgGridInputCellEditor,
              valueFormatter : (params)=> { 
                if (params.value === 0) return '';
              },
              cellRendererParams: (params) => {
                var classArray: string[] = [];
                let newClass = 'aggrid-cell-color lightgreen'
                classArray.push(newClass);
                return { type: this.bPlanType == 'C'&& this.selectedUserRole?.id === 1? 'edit-safe-port':'edit-disabled-safe-port', context: { componentParent: this }, cellClass: classArray.length > 0 ? classArray : null }
              }
            },
          ]
        },
      ]
    },
    {
      headerName: BunkeringPlanColmGroupLabels.EcaCompliant,
      headerClass: ['aggrid-grey-cell column-splitter whiteText'],
      children: [
        {
          headerName: BunkeringPlanColmGroupLabels.Eca,
          headerTooltip: BunkeringPlanColmGroupLabels.Eca,
          marryChildren: true,
          resizable: false,
          headerClass: ['aggrid-columgroup-splitter'],
          children: [
            {
              headerName: BunkeringPlanColumnsLabels.EcaEstdCons, headerTooltip: BunkeringPlanColumnsLabels.EcaEstdCons, field: 'eca_estimated_consumption', width: 50, cellClass: params=>{if (this.bPlanType == 'C'&& this.selectedUserRole?.id === 1) return 'aggrid-green-editable-cell editable'; else return 'aggrid-green-editable-cell ag-cell' }, cellRendererFramework: AGGridCellDataComponent,
              cellRendererParams: (params) => {
                var classArray: string[] = [];
                let newClass;
                if(params.data?.ulsfo_est_consumption_color === 'G')
                  newClass = 'aggrid-cell-color darkgreen';
                else if(params.data?.ulsfo_est_consumption_color === 'M')
                  newClass = 'aggrid-cell-color magenta';
                else
                  newClass = 'aggrid-cell-color brown';

                classArray.push(newClass);
                return { type: this.bPlanType == 'C'&& this.selectedUserRole?.id === 1? 'edit':'edit-disabled', context: { componentParent: this }, cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            {
              headerName: BunkeringPlanColumnsLabels.EcaSafePort, headerTooltip: BunkeringPlanColumnsLabels.EcaSafePort, field: 'eca_safe_port', width: 50, headerClass: ['aggrid-columgroup-splitter aggrid-colum-splitter-left'], cellClass:params=>{if (this.bPlanType == 'C'&& this.selectedUserRole?.id === 1) return 'splitter-dual  aggrid-green-editable-cell editable'; else return 'aggrid-green-editable-cell ag-cell' }, cellRendererFramework: AGGridCellDataComponent,
              valueFormatter : (params)=> { if (params.value === 0) return '';},
              cellRendererParams: (params) => {
                var classArray: string[] = [];
                let newClass = 'aggrid-cell-color lightgreen'
                classArray.push(newClass);
                return { type: this.bPlanType == 'C'&& this.selectedUserRole?.id === 1? 'edit-safe-port':'edit-disabled-safe-port', context: { componentParent: this }, cellClass: classArray.length > 0 ? classArray : null }
              }
            }
          ]
        },
        {
          headerName: BunkeringPlanColmGroupLabels.Ulsfo,
          headerTooltip: BunkeringPlanColmGroupLabels.Ulsfo,
          marryChildren: true,
          resizable: false,
          headerClass: ['aggrid-columgroup-splitter'],
          children: [
            {
              headerName: BunkeringPlanColumnsLabels.UlsfoMaxLift, field: 'ulsfo_max_lift', headerTooltip: BunkeringPlanColumnsLabels.UlsfoMaxLift, width: 50,cellClass: params=>{if (this.bPlanType == 'C'&& this.selectedUserRole?.id === 1) return 'aggrid-green-editable-cell editable'; else return 'aggrid-green-editable-cell ag-cell' }, cellRendererFramework: AGGridCellDataComponent,
              cellRendererParams: (params) => {
                var classArray: string[] = [];
                let newClass;
                if(params.data?.ulsfo_max_lift_color === 'G')
                  newClass = 'aggrid-cell-color darkgreen';
                else if(params.data?.ulsfo_max_lift_color === 'M')
                  newClass = 'aggrid-cell-color magenta';
                else
                  newClass = 'aggrid-cell-color brown';

                classArray.push(newClass);
                return { type: this.bPlanType == 'C'&& this.selectedUserRole?.id === 1? 'edit':'edit-disabled', context: { componentParent: this }, cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            { headerName: BunkeringPlanColumnsLabels.UlsfoEstdSoa, headerTooltip: BunkeringPlanColumnsLabels.UlsfoEstdSoa, field: 'ulsfo_current_stock', width: 40, headerClass: ['aggrid-colum-splitter-left'], 
              cellClass: ['aggrid-content-right'] },
            {
              headerName: BunkeringPlanColumnsLabels.UlsfoConfPlanLift, headerTooltip: BunkeringPlanColumnsLabels.UlsfoConfPlanLift, field: 'ulsfo_estimated_lift', width: 45, headerClass: ['aggrid-columgroup-splitter aggrid-colum-splitter-left'], cellRendererFramework: AGGridCellDataComponent, cellClass: ['aggrid-columgroup-splitter pd-1 aggrid-content-right'],
              cellRendererParams: function (params) {
                var classArray: string[] = ['pd-6'];
                let newClass;
                if(params.data?.order_id_ulsfo && !params.data?.request_id_ulsfo){
                  newClass = 'aggrid-link-bplan aggrid-red-cell'
                  classArray.push(newClass);
                }
                else if(params.data?.request_id_ulsfo && !params.data?.order_id_ulsfo){
                  newClass = 'aggrid-link-bplan aggrid-blue-cell';
                  classArray.push(newClass);
                }
                return { type: 'link', cellClass: classArray.length > 0 ? classArray : null }
              }
            }
          ]
        },
        {
          headerName: BunkeringPlanColmGroupLabels.Lsdis,
          headerTooltip: BunkeringPlanColmGroupLabels.Lsdis,
          marryChildren: true,
          resizable: false,
          headerClass: ['aggrid-columgroup-splitter '],
          children: [
            {
              headerName: BunkeringPlanColumnsLabels.LsdisMaxLift, field: 'lsdis_max_lift', headerTooltip: BunkeringPlanColumnsLabels.LsdisMaxLift, width: 50, cellClass: params=>{if (this.bPlanType == 'C'&& this.selectedUserRole?.id === 1) return 'aggrid-green-editable-cell editable'; else return 'aggrid-green-editable-cell ag-cell' }, cellRendererFramework: AGGridCellDataComponent,
              cellRendererParams: (params) => {
                var classArray: string[] = [];
                let newClass;
                if(params.data?.lsdis_max_lift_color === 'G')
                  newClass = 'aggrid-cell-color darkgreen';
                else if(params.data?.lsdis_max_lift_color === 'M')
                  newClass = 'aggrid-cell-color magenta';
                else
                  newClass = 'aggrid-cell-color brown';

                classArray.push(newClass);
                return { type: this.bPlanType == 'C'&& this.selectedUserRole?.id === 1? 'edit':'edit-disabled', context: { componentParent: this }, cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            { headerName: BunkeringPlanColumnsLabels.LsdisEstdSoa, headerTooltip: BunkeringPlanColumnsLabels.LsdisEstdSoa, field: 'lsdis_current_stock', width: 50, headerClass: ['aggrid-colum-splitter-left'], 
              cellClass: ['aggrid-content-right'] },
            {
              headerName: BunkeringPlanColumnsLabels.LsdisEstdCons, headerTooltip: BunkeringPlanColumnsLabels.LsdisEstdCons, field: 'lsdis_estimated_consumption', width: 50,cellClass: params=>{if (this.bPlanType == 'C' && this.selectedUserRole?.id === 1) return 'aggrid-green-editable-cell editable'; else return 'aggrid-green-editable-cell ag-cell' }, cellRendererFramework: AGGridCellDataComponent, headerClass: ['aggrid-colum-splitter-left aggrid-colum-splitter-left'],
              cellRendererParams: (params) => {
                var classArray: string[] = [];
                let newClass;
                if(params.data?.lsdis_est_consumption_color === 'G')
                  newClass = 'aggrid-cell-color darkgreen';
                else if(params.data?.lsdis_est_consumption_color === 'M')
                  newClass = 'aggrid-cell-color magenta';
                else
                  newClass = 'aggrid-cell-color brown';

                classArray.push(newClass);
                return { type: this.bPlanType == 'C'&& this.selectedUserRole?.id === 1? 'edit':'edit-disabled', context: { componentParent: this }, cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            {
              headerName: BunkeringPlanColumnsLabels.LsdisConfPlanLift, headerTooltip: BunkeringPlanColumnsLabels.LsdisConfPlanLift, field: 'lsdis_estimated_lift', width: 45, cellRendererFramework: AGGridCellDataComponent, cellClass: 'pd-1 aggrid-content-right', headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: function (params) {
                var classArray: string[] = ['pd-6'];
                let newClass;
                if(params.data?.order_id_lsdis && !params.data?.request_id_lsdis){
                  newClass = 'aggrid-link-bplan aggrid-red-cell'
                  classArray.push(newClass);
                }
                else if(params.data?.request_id_lsdis && !params.data?.order_id_lsdis){
                  newClass = 'aggrid-link-bplan aggrid-blue-cell';
                  classArray.push(newClass);
                }
                return { type: 'link', cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            { headerName: BunkeringPlanColumnsLabels.LsdisSafePort, headerTooltip: BunkeringPlanColumnsLabels.LsdisSafePort, field: 'lsdis_safe_port', width: 40, headerClass: ['aggrid-columgroup-splitter aggrid-colum-splitter-left'],
            valueFormatter : (params)=> { if (params.value === 0) return '';},cellClass: ['aggrid-blue-cell aggrid-columgroup-splitter  aggrid-content-right'] },
          ]
        },
      ]
    },
    {
      headerClass: ['cell-border-bottom'],
      children: [
        { headerName: BunkeringPlanColumnsLabels.TotalMinSod, headerTooltip: BunkeringPlanColumnsLabels.TotalMinSod, field: 'min_sod', width: 55, cellRendererFramework: AGGridCellDataComponent, cellClass:params=>{if (this.bPlanType == 'C') return 'aggrid-blue-editable-cell editable'; else return 'aggrid-blue-editable-cell ag-cell' } , cellRendererParams: { type: 'edit-with-popup', cellClass: 'aggrid-cell-color white', context: { componentParent: this } } },
        { headerName: BunkeringPlanColumnsLabels.MinHsfoSod, headerTooltip: BunkeringPlanColumnsLabels.MinHsfoSod, field: 'hsfo_min_sod', width: 55, cellRendererFramework: AGGridCellDataComponent, cellRendererParams: { type: 'edit-with-popup', cellClass: 'aggrid-cell-color white', context: { componentParent: this } }, cellClass:params=>{if (this.bPlanType == 'C') return 'aggrid-blue-editable-cell editable'; else return 'aggrid-blue-editable-cell ag-cell' } , headerClass: ['aggrid-colum-splitter-left'] },
        { headerName: BunkeringPlanColumnsLabels.MinEcaBunkerSod, headerTooltip:  BunkeringPlanColumnsLabels.MinEcaBunkerSod, field: 'eca_min_sod', width: 55, cellRendererFramework: AGGridCellDataComponent,cellRendererParams: { type: 'edit-with-popup', cellClass: 'aggrid-cell-color white', context: { componentParent: this } }, cellClass:params=>{if (this.bPlanType == 'C') return 'aggrid-blue-editable-cell editable'; else return 'aggrid-blue-editable-cell ag-cell' } , headerClass: ['aggrid-colum-splitter-left'] },
        { headerName: BunkeringPlanColumnsLabels.TotalMaxSod, headerTooltip:  BunkeringPlanColumnsLabels.TotalMaxSod, field: 'max_sod', width: 55, cellRendererFramework: AGGridCellDataComponent,cellRendererParams: { type: 'edit-with-popup', cellClass: 'aggrid-cell-color white', context: { componentParent: this } }, cellClass:params=>{if (this.bPlanType == 'C') return 'aggrid-blue-editable-cell editable'; else return 'aggrid-blue-editable-cell ag-cell' } , headerClass: ['aggrid-colum-splitter-left'] },
        { headerName: BunkeringPlanColumnsLabels.HsdisConfReqLift, headerTooltip: BunkeringPlanColumnsLabels.HsdisConfReqLift, field: 'hsdis_estimated_lift', width: 50, headerClass: ['aggrid-colum-splitter-left'],
          cellClass:['aggrid-content-right'] ,
          cellRendererParams: function (params) {
            var classArray: string[] = ['pd-6'];
            let newClass;
            if(params.data?.order_id_hsdis && !params.data?.request_id_hsdis){
              newClass = 'aggrid-link-bplan aggrid-red-cell'
              classArray.push(newClass);
            }
            else if(params.data?.request_id_hsdis && !params.data?.order_id_hsdis){
              newClass = 'aggrid-link-bplan aggrid-blue-cell';
              classArray.push(newClass);
            }
            return { type: 'link', cellClass: classArray.length > 0 ? classArray : null }
          }
        },
        { headerName: BunkeringPlanColumnsLabels.BusinessAddress, field: 'business_address', headerTooltip: BunkeringPlanColumnsLabels.BusinessAddress, width: 60,cellRendererFramework: AGGridCellRendererComponent,cellRendererParams: { cellClass: ['text-ellipsis editable'] }, headerClass: ['aggrid-colum-splitter-left'] },

        {
          headerName: BunkeringPlanColumnsLabels.MinSoa, headerTooltip: BunkeringPlanColumnsLabels.MinSoa, field: "isMinSoa",
          resizable: false,
          width: 40,
          cellClass: 'checkbox-center aggrid-content-center',
          cellRendererFramework: AGGridCellDataComponent, cellRendererParams: (params)=>{ return { type: this.bPlanType == 'C' ? 'checkbox-with-popup': 'checkbox-with-popup' , cellClass: ['aggrid-dark-checkbox'], context: { componentParent: this } }}, headerClass: ['aggrid-colum-splitter-left']
        }
      ]
    }

  ];

  public loadBunkeringPlanDetails(){
      let req = { shipId : this.vesselData?.vesselId, planId : this.latestPlanId}
      this.bplanService.getBunkeringPlanDetails(req).subscribe((data)=> {
        console.log('bunker plan details',data);
        this.rowData = this.latestPlanId == null ?[]:(data.payload && data.payload.length)? data.payload: [];
        this.bPlanData = this.rowData;   
        this.latestPlanId = '';
        this.loadBplan.emit(false);
        let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
        titleEle.click();
      })
  }
  portClicked(params) {
    if(params?.event?.checked) {
      let selectedport = (params.param && params.param.data)? params.param.data: {};
      this.selectedPort.push(selectedport);
      this.voyage_detail.emit(this.selectedPort);
    }
    if ((this.rowData.filter(element => element.createReqFlag == true)).length > 0)
      this.enableCreateReq.emit(true);
    else
      this.enableCreateReq.emit(false);
  }
  toggleOperAck() {
    this.triggerChangeEvent();
    this.gridOptions.api.refreshCells();
    this.gridChanged = true;
    this.localService.setBunkerPlanState(this.gridChanged);
  }

  toggleSave() {
    this.gridSaved = true;
    this.gridChanged = false;
    this.localService.setBunkerPlanState(this.gridChanged);
  }

  triggerChangeEvent() {
    this.gridChanged = true;
    this.localService.setBunkerPlanState(this.gridChanged);
  }
  consUpdatedEvent(params,value){
    let hsfoSoaElement = document.getElementsByClassName('soa');
    let data = params.data;
    if(data.rowIndex == 0)
    data.hsfo_current_stock = 1000 - value;
    let index = params.node.rowIndex;
    // this.gridOptions.api.applyTransaction({
    //   update: [data]
    // })
  }
  refreshGrid($event){
    var params = {
      force: true,
      // suppressFlash: isSuppressFlashSelected(),
    };
    this.gridOptions.api.refreshCells(params);
  }
}