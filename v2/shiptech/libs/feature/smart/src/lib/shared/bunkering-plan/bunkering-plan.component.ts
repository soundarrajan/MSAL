import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { GridOptions } from '@ag-grid-community/core';
import { AGGridCellDataComponent } from '../ag-grid/ag-grid-celldata.component';
import { AgGridInputCellEditor } from '../ag-grid/ag-grid-input-cell-editor';
import { AGGridCellRendererComponent } from '../ag-grid/ag-grid-cell-renderer.component';
import { Store } from '@ngxs/store';
import { BunkeringPlanColmGroupLabels, BunkeringPlanColumnsLabels } from './view-model/bunkering-plan.column';
import { LocalService } from '../../services/local-service.service';
import { BunkeringPlanService } from '../../services/bunkering-plan.service';
import { SaveBunkeringPlanAction,AddCurrentBunkeringPlanAction,UpdateCurrentROBAction,UpdateBplanTypeAction, UpdateCurrentBunkeringPlanAction } from '../../store/bunker-plan/bunkering-plan.action';
import { SaveBunkeringPlanState,AddCurrentBunkeringPlanState,SaveCurrentROBState, UpdateBplanTypeState} from '../../store/bunker-plan/bunkering-plan.state';
import { NoDataComponent } from '../no-data-popup/no-data-popup.component';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { Observable,Subscription } from 'rxjs';

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
  public vesselData: any;
  public latestPlanId: any;
  public editableCell : boolean;
  public type : any;
  public dialogRef: MatDialogRef<NoDataComponent>;
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
  @Input('bPlanType') 
  public set bPlanType(v : any){
    this.type = v;
    this.store.dispatch(new UpdateBplanTypeAction(this.type));
  };
  @Input('selectedUserRole')selectedUserRole;
  @Input() changeROB : Observable<void>;
  private eventSub : Subscription;
  // @Select(UserProfileState.username) username$: Observable<string>;
  // private _username$: BehaviorSubject<string>;
  constructor(private bplanService: BunkeringPlanService, private localService: LocalService, private store: Store,
              public dialog: MatDialog) 
    {   
      
    // this._username$ = new BehaviorSubject<string>('');
    // this.username$.subscribe(onchange:{this._username$ in })
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
      overlayNoRowsTemplate:
      `<span>Plan details not available</span>`,
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
      }
    };
  }
  
  ngOnInit() {
    this.editableCell = (this.type == 'C'&& this.selectedUserRole?.id === 1) ? true : false;
    if(this.store.selectSnapshot(UpdateBplanTypeState.getBplanType) == 'C')
    this.eventSub = this.changeROB.subscribe((column)=> this.calculateSOA(column));
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
            return {type: 'checkbox', cellClass: this.type == 'C'?['aggrid-white-checkbox'] :['custom-check-box readonly aggrid-left-ribbon  aggrid-content-center'], context: { componentParent: this } }
          }
        },
        {
          headerName: BunkeringPlanColumnsLabels.PortCode, headerTooltip: BunkeringPlanColumnsLabels.PortCode, field: 'port_id', width: 96, cellRendererFramework: AGGridCellDataComponent,
         cellClassRules: {
            'light-cell': function (params) {
              return params?.data?.is_last_port == 'Y';
            }
          },cellRendererParams: (params) =>{
           return { type: this.type == 'C'?'port' : 'port-readOnly', context: { componentParent: this } } 
          },
          cellClass: ['dark-cell aggrid-content-center'], headerClass: [' aggrid-colum-splitter-left aggrid-text-align-c']
        },
        {
          headerName:  this.store.selectSnapshot(SaveBunkeringPlanState.getHsfoHeaderData),
          headerTooltip: BunkeringPlanColmGroupLabels.Hsfo,
          marryChildren: true,
          resizable: false,
          headerClass: ['aggrid-columgroup-splitter-left aggrid-text-align-c '],
          children: [
            {
              headerName: BunkeringPlanColumnsLabels.HsfoMaxLift, field: 'hsfo_max_lift', headerTooltip: BunkeringPlanColumnsLabels.HsfoMaxLift, width: 50,
              cellClass: (params)=>{
                let cellClass = '';
                if (this.type == 'C') 
                  cellClass = 'aggrid-green-editable-cell editable';                   
                else 
                  cellClass = 'aggrid-green-editable-cell ag-cell'; 
                return cellClass

              },
              headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: (params) => {             
                return { type: this.editableCell? 'edit':'edit-disabled', context: { componentParent: this } }
              },
              cellRendererFramework: AGGridCellDataComponent,
              editable : (params) => {return this.editableCell},
              cellEditorFramework : AgGridInputCellEditor,  
              cellEditorParams : (params) =>{return {type: 'edit',context: { componentParent: this }}}
            },
            { headerName: BunkeringPlanColumnsLabels.HsfoEstdSoa, headerTooltip: BunkeringPlanColumnsLabels.HsfoEstdSoa, field: 'hsfo_soa', width: 50,
              cellClass: ['aggrid-content-right '], headerClass: ['aggrid-colum-splitter-left'] , 
              cellRendererFramework : AGGridCellDataComponent,
              cellRendererParams : (params) =>{return {type: 'soa-hsfo',context: { componentParent: this }}} 
            },
            {
              headerName: BunkeringPlanColumnsLabels.HsfoEstdCons, headerTooltip: BunkeringPlanColumnsLabels.HsfoEstdCons, field: 'hsfo_estimated_consumption', width: 50,
              cellClass: (params)=>{
                if (this.type == 'C') 
                  return 'aggrid-green-editable-cell editable'; 
                else 
                  return 'aggrid-green-editable-cell ag-cell' 
              },
              headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: (params) => {             
                return { type: this.editableCell? 'edit':'edit-disabled', context: { componentParent: this } }
              },
              cellRendererFramework: AGGridCellDataComponent,
              editable : (params) => {return this.editableCell},
              cellEditorFramework : AgGridInputCellEditor,  
              cellEditorParams : (params) =>{return {type: 'edit',context: { componentParent: this }}}
            },
            {
              headerName: BunkeringPlanColumnsLabels.HsfoConfPlanLift, headerTooltip: BunkeringPlanColumnsLabels.HsfoConfPlanLift, field: 'hsfo_estimated_lift', width: 50, 
              cellRendererFramework: AGGridCellDataComponent, 
              cellClass: 'pd-1 aggrid-content-right', 
              headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: function (params) {return { type: 'link' }}
            },
            {
              headerName: BunkeringPlanColumnsLabels.HsfoSafePort, headerTooltip: BunkeringPlanColumnsLabels.HsfoSafePort, field: 'hsfo_safe_port', width: 50, 
              cellClass: (params)=>{
                if (this.type == 'C') 
                  return 'aggrid-green-editable-cell editable'; 
                else 
                  return 'aggrid-green-editable-cell ag-cell' 
              },
              headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: (params) => { return { type: this.editableCell? 'edit':'edit-disabled', context: { componentParent: this } }},
              cellRendererFramework: AGGridCellDataComponent,
              editable : (params) => {return this.editableCell},
              cellEditorFramework : AgGridInputCellEditor,  
              cellEditorParams : (params) =>{return {type: 'edit',context: { componentParent: this }}},              
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
              headerName: BunkeringPlanColumnsLabels.EcaEstdCons, headerTooltip: BunkeringPlanColumnsLabels.EcaEstdCons, field: 'eca_estimated_consumption', width: 50, 
              cellClass: (params)=>{
                if (this.type == 'C') 
                  return 'aggrid-green-editable-cell editable'; 
                else 
                  return 'aggrid-green-editable-cell ag-cell' 
              },
              headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: (params) => {             
                return { type: this.editableCell? 'edit':'edit-disabled', context: { componentParent: this } }
              },
              cellRendererFramework: AGGridCellDataComponent,
              editable : (params) => {return this.editableCell},
              cellEditorFramework : AgGridInputCellEditor,  
              cellEditorParams : (params) =>{return {type: 'edit',context: { componentParent: this }}}
            },
            {
              headerName: BunkeringPlanColumnsLabels.EcaSafePort, headerTooltip: BunkeringPlanColumnsLabels.EcaSafePort, field: 'eca_safe_port', width: 50, 
              cellClass: (params)=>{
                if (this.type == 'C') 
                  return 'aggrid-green-editable-cell editable'; 
                else 
                  return 'aggrid-green-editable-cell ag-cell' 
              },
              headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: (params) => { return { type: this.editableCell? 'edit':'edit-disabled', context: { componentParent: this } }},
              cellRendererFramework: AGGridCellDataComponent,
              editable : (params) => {return this.editableCell},
              cellEditorFramework : AgGridInputCellEditor,  
              cellEditorParams : (params) =>{return {type: 'edit',context: { componentParent: this }}},    
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
              headerName: BunkeringPlanColumnsLabels.UlsfoMaxLift, field: 'ulsfo_max_lift', headerTooltip: BunkeringPlanColumnsLabels.UlsfoMaxLift, width: 50,
              cellClass: (params)=>{
                if (this.type == 'C') 
                  return 'aggrid-green-editable-cell editable'; 
                else 
                  return 'aggrid-green-editable-cell ag-cell' 
              },
              headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: (params) => {             
                return { type: this.editableCell? 'edit':'edit-disabled', context: { componentParent: this } }
              },
              cellRendererFramework: AGGridCellDataComponent,
              editable : (params) => {return this.editableCell},
              cellEditorFramework : AgGridInputCellEditor,  
              cellEditorParams : (params) =>{return {type: 'edit',context: { componentParent: this }}}
            },
            { headerName: BunkeringPlanColumnsLabels.UlsfoEstdSoa, headerTooltip: BunkeringPlanColumnsLabels.UlsfoEstdSoa, field: 'ulsfo_soa', width: 40, 
              headerClass: ['aggrid-colum-splitter-left'], cellClass: ['aggrid-content-right'] 
            },
            {
              headerName: BunkeringPlanColumnsLabels.UlsfoConfPlanLift, headerTooltip: BunkeringPlanColumnsLabels.UlsfoConfPlanLift, field: 'ulsfo_estimated_lift', width: 45, 
              headerClass: ['aggrid-columgroup-splitter aggrid-colum-splitter-left'], 
              cellRendererFramework: AGGridCellDataComponent, 
              cellClass: ['aggrid-columgroup-splitter pd-1 aggrid-content-right'],
              cellRendererParams: (params) => { return { type: 'link'}}
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
              headerName: BunkeringPlanColumnsLabels.LsdisMaxLift, field: 'lsdis_max_lift', headerTooltip: BunkeringPlanColumnsLabels.LsdisMaxLift, width: 50, 
              cellClass: (params)=>{
                if (this.type == 'C') 
                  return 'aggrid-green-editable-cell editable'; 
                else 
                  return 'aggrid-green-editable-cell ag-cell' 
              },
              headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: (params) => {             
                return { type: this.editableCell? 'edit':'edit-disabled', context: { componentParent: this } }
              },
              cellRendererFramework: AGGridCellDataComponent,
              editable : (params) => {return this.editableCell},
              cellEditorFramework : AgGridInputCellEditor,  
              cellEditorParams : (params) =>{return {type: 'edit',context: { componentParent: this }}}
            },
            { headerName: BunkeringPlanColumnsLabels.LsdisEstdSoa, headerTooltip: BunkeringPlanColumnsLabels.LsdisEstdSoa, field: 'lsdis_soa', width: 50, headerClass: ['aggrid-colum-splitter-left'], 
              cellClass: ['aggrid-content-right'] },
            {
              headerName: BunkeringPlanColumnsLabels.LsdisEstdCons, headerTooltip: BunkeringPlanColumnsLabels.LsdisEstdCons, field: 'lsdis_estimated_consumption', width: 50,
              cellClass: (params)=>{
                if (this.type == 'C') 
                  return 'aggrid-green-editable-cell editable'; 
                else 
                  return 'aggrid-green-editable-cell ag-cell' 
              },
              headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: (params) => {             
                return { type: this.editableCell? 'edit':'edit-disabled', context: { componentParent: this } }
              },
              cellRendererFramework: AGGridCellDataComponent,
              editable : (params) => {return this.editableCell},
              cellEditorFramework : AgGridInputCellEditor,  
              cellEditorParams : (params) =>{return {type: 'edit',context: { componentParent: this }}}
            },
            {
              headerName: BunkeringPlanColumnsLabels.LsdisConfPlanLift, headerTooltip: BunkeringPlanColumnsLabels.LsdisConfPlanLift, field: 'lsdis_estimated_lift', width: 45, 
              cellRendererFramework: AGGridCellDataComponent, 
              cellClass: 'pd-1 aggrid-content-right', 
              headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: (params)=> { return { type: 'link' } }
            },
            { headerName: BunkeringPlanColumnsLabels.LsdisSafePort, headerTooltip: BunkeringPlanColumnsLabels.LsdisSafePort, field: 'lsdis_safe_port', width: 40, 
              headerClass: ['aggrid-columgroup-splitter aggrid-colum-splitter-left'],
              cellClass: ['aggrid-blue-cell aggrid-columgroup-splitter  aggrid-content-right'] ,
              editable : true,
              valueFormatter: (params)=> {return params.value == 0? '':params.value ;},
              cellEditorFramework : AgGridInputCellEditor,  
              cellEditorParams : (params) =>{return {type: 'edit',context: { componentParent: this }, cellClass: 'aggrid-blue-editable-cell aggrid-columgroup-splitter  aggrid-content-right'}}
            },
          ]
        },
      ]
    },
    {
      headerClass: ['cell-border-bottom'],
      children: [
        { headerName: BunkeringPlanColumnsLabels.TotalMinSod, headerTooltip: BunkeringPlanColumnsLabels.TotalMinSod, field: 'min_sod', width: 55, cellRendererFramework: AGGridCellDataComponent, cellClass:params=>{if (this.type == 'C') return 'aggrid-blue-editable-cell editable'; else return 'aggrid-blue-editable-cell ag-cell' } , cellRendererParams: params=>{ return {type: this.type == 'C' ?'edit-with-popup':'disable-with-popup', cellClass: 'aggrid-cell-color white', context: { componentParent: this } }}},
        { headerName: BunkeringPlanColumnsLabels.MinHsfoSod, headerTooltip: BunkeringPlanColumnsLabels.MinHsfoSod, field: 'hsfo_min_sod', width: 55, cellRendererFramework: AGGridCellDataComponent, cellRendererParams: params=>{ return {type: this.type == 'C' ?'edit-with-popup':'disable-with-popup', cellClass: 'aggrid-cell-color white', context: { componentParent: this } }}, cellClass:params=>{if (this.type == 'C') return 'aggrid-blue-editable-cell editable'; else return 'aggrid-blue-editable-cell ag-cell' } , headerClass: ['aggrid-colum-splitter-left'] },
        { headerName: BunkeringPlanColumnsLabels.MinEcaBunkerSod, headerTooltip:  BunkeringPlanColumnsLabels.MinEcaBunkerSod, field: 'eca_min_sod', width: 55, cellRendererFramework: AGGridCellDataComponent,cellRendererParams: params=>{ return {type: this.type == 'C' ?'edit-with-popup':'disable-with-popup', cellClass: 'aggrid-cell-color white', context: { componentParent: this } }}, cellClass:params=>{if (this.type == 'C') return 'aggrid-blue-editable-cell editable'; else return 'aggrid-blue-editable-cell ag-cell' } , headerClass: ['aggrid-colum-splitter-left'] },
        { headerName: BunkeringPlanColumnsLabels.TotalMaxSod, headerTooltip:  BunkeringPlanColumnsLabels.TotalMaxSod, field: 'max_sod', width: 55, cellRendererFramework: AGGridCellDataComponent,cellRendererParams: params=>{ return {type: this.type == 'C' ?'edit-with-popup':'disable-with-popup', cellClass: 'aggrid-cell-color white', context: { componentParent: this } }}, cellClass:params=>{if (this.type == 'C') return 'aggrid-blue-editable-cell editable'; else return 'aggrid-blue-editable-cell ag-cell' } , headerClass: ['aggrid-colum-splitter-left'] },
        { headerName: BunkeringPlanColumnsLabels.HsdisConfReqLift, headerTooltip: BunkeringPlanColumnsLabels.HsdisConfReqLift, field: 'hsdis_estimated_lift', width: 50, 
          headerClass: ['aggrid-colum-splitter-left'],
          cellClass:['aggrid-content-right'] ,
          cellRendererParams: (params) =>{ return { type: 'link'} },
          cellRendererFramework: AGGridCellDataComponent
        },
        { headerName: BunkeringPlanColumnsLabels.BusinessAddress, field: 'business_address', headerTooltip: BunkeringPlanColumnsLabels.BusinessAddress, width: 60,
          cellRendererParams: { cellClass: ['text-ellipsis editable'] }, 
          headerClass: ['aggrid-colum-splitter-left'],
          editable : true,
          cellEditorFramework : AgGridInputCellEditor,  
          cellEditorParams : (params) =>{return {type: 'edit-business-address',context: { componentParent: this }, cellClass: 'text-ellipsis editable'}} 
        },

        {
          headerName: BunkeringPlanColumnsLabels.MinSoa, headerTooltip: BunkeringPlanColumnsLabels.MinSoa, field: "is_min_soa",
          resizable: false,
          width: 40,
          cellClass: 'checkbox-center aggrid-content-center',
          cellRendererFramework: AGGridCellDataComponent, 
          cellRendererParams: (params)=>{ return { type: this.type == 'C' ? 'checkbox-with-popup': 'checkbox-disabled' , cellClass: ['aggrid-dark-checkbox'], context: { componentParent: this } }}, 
          headerClass: ['aggrid-colum-splitter-left']
        }
      ]
    }

  ];

  public loadBunkeringPlanDetails(){
      let req = { shipId : this.vesselData?.vesselId, planId : this.latestPlanId }
      this.bplanService.getBunkeringPlanDetails(req).subscribe((data)=> {
        console.log('bunker plan details',data);
        this.rowData = this.latestPlanId == null ?[]:(data.payload && data.payload.length)? data.payload: [];
        this.bPlanData = this.rowData;   
        this.latestPlanId = '';
        this.loadBplan.emit(false);
        let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
        titleEle.click();
        if(this.type == 'C'){
          this.addBplanToStoreForCalculations(this.bPlanData);
          this.addBplanToStoreForSaveFunction(this.bPlanData);
        }
        
      })
      
  }

  addBplanToStoreForCalculations(params){
    let data = [];
    params.forEach(bPlan =>{  
      data.push({
        // business_address: bPlan.business_address,
        // clientIpAddress: bPlan.clientIpAddress,
        detail_no: bPlan.detail_no,
        eca_estimated_consumption: bPlan.eca_estimated_consumption,
        // eca_min_sod: bPlan.eca_min_sod,
        // eca_reserve: bPlan.eca_reserve,
        // eca_safe_port: bPlan.eca_safe_port,
        // eca_sod_comment: bPlan.eca_sod_comment,
        // gsis_id: bPlan.gsis_id,
        // hsdis_estimated_lift: bPlan.hsdis_estimated_lift,
        hsfo05_stock: bPlan.hsfo05_stock,
        // hsfo_est_consumption_color: bPlan.hsfo_est_consumption_color,
        hsfo_estimated_consumption: bPlan.hsfo_estimated_consumption,
        // hsfo_estimated_lift: bPlan.hsfo_estimated_lift,
        // hsfo_max_lift: bPlan.hsfo_max_lift,
        // hsfo_max_lift_color: bPlan.hsfo_max_lift_color,
        // hsfo_min_sod: bPlan.hsfo_min_sod,
        // hsfo_reserve: bPlan.hsfo_reserve,
        // hsfo_safe_port: bPlan.hsfo_safe_port,
        hsfo_soa: bPlan.hsfo_soa,
        // hsfo_sod_comment: bPlan.hsfo_sod_comment,
        // is_end_of_service: bPlan.is_end_of_service,
        // is_min_soa: bPlan.is_min_soa,
        // is_new_port: bPlan.is_new_port,
        // location_id: bPlan.location_id,
        // location_name: bPlan.location_name,
        lsdis_as_eca: bPlan.lsdis_as_eca,
        // lsdis_est_consumption_color: bPlan.lsdis_est_consumption_color,
        lsdis_estimated_consumption: bPlan.lsdis_estimated_consumption,
        // lsdis_estimated_lift: bPlan.lsdis_estimated_lift,
        // lsdis_max_lift: bPlan.lsdis_max_lift,
        // lsdis_max_lift_color: bPlan.lsdis_max_lift_color,
        // lsdis_reserve: bPlan.lsdis_reserve,
        // lsdis_safe_port: bPlan.lsdis_safe_port,
        lsdis_soa: bPlan.lsdis_soa,
        // max_sod: bPlan.max_sod,
        // max_sod_comment: bPlan.max_sod_comment,
        // min_soa_comment: bPlan.min_soa_comment,
        // min_sod: bPlan.min_sod,
        // min_sod_comment: bPlan.min_sod_comment,
        // modulePathUrl: bPlan.modulePathUrl,
        // mpo_ulsfo_estimated_lift: bPlan.mpo_ulsfo_estimated_lift,
        // mpo_ulsfo_soa: bPlan.mpo_ulsfo_soa,
        // op_updated_columns: bPlan.op_updated_columns,
        // operator_ack: bPlan.operator_ack,
        // order_id_hsdis: bPlan.order_id_hsdis,
        // order_id_hsfo: bPlan.order_id_hsfo,
        // order_id_lsdis: bPlan.order_id_lsdis,
        // order_id_ulsfo: bPlan.order_id_ulsfo,
        // plan_id: bPlan.plan_id,
        // port_id: bPlan.port_id,
        // redelivery_port: bPlan.redelivery_port,
        // request_id_hsdis: bPlan.request_id_hsdis,
        // request_id_hsfo: bPlan.request_id_hsfo,
        // request_id_lsdis: bPlan.request_id_lsdis,
        // request_id_ulsfo: bPlan.request_id_ulsfo,
        // service_code: bPlan.service_code,
        // ulsfo_est_consumption_color: bPlan.ulsfo_est_consumption_color,
        ulsfo_estimated_lift: bPlan.ulsfo_estimated_lift,
        // ulsfo_max_lift: bPlan.ulsfo_max_lift,
        // ulsfo_max_lift_color: bPlan.ulsfo_max_lift_color,
        ulsfo_soa: bPlan.ulsfo_soa,
        // userAction: bPlan.userAction,
        // vessel_ack: bPlan.vessel_ack,
        // voyage_detail_id: bPlan.voyage_detail_id
      }) ;

    })
    this.store.dispatch(new AddCurrentBunkeringPlanAction(data));
  }
  addBplanToStoreForSaveFunction(params){
    let data = [];
    params.forEach(bPlan =>{  
      data.push({
          plan_id: bPlan.plan_id,
          detail_no: bPlan.detail_no,
          port_id: bPlan.port_id,
          service_code: bPlan.service_code,
          operator_ack: bPlan.operator_ack,
          hsfo_max_lift: bPlan.hsfo_max_lift,
          hsfo_estimated_consumption: bPlan.hsfo_estimated_consumption,
          hsfo_safe_port: bPlan.hsfo_safe_port,
          eca_estimated_consumption: bPlan.eca_estimated_consumption,
          eca_safe_port: bPlan.eca_safe_port,
          ulsfo_max_lift: bPlan.ulsfo_max_lift,
          lsdis_max_lift: bPlan.lsdis_max_lift,
          lsdis_estimated_consumption: bPlan.lsdis_estimated_consumption,
          lsdis_safe_port: bPlan.lsdis_safe_port,
          hsfo_min_sod: bPlan.hsfo_min_sod,
          eca_min_sod: bPlan.eca_min_sod,
          min_sod: bPlan.min_sod,
          max_sod: bPlan.max_sod,
          hsdis_estimated_lift: bPlan.hsdis_estimated_lift,
          business_address: bPlan.business_address,
          is_min_soa: bPlan.is_min_soa,
          min_soa_comment: bPlan.min_soa_comment,
          min_sod_comment: bPlan.min_sod_comment,
          hsfo_sod_comment: bPlan.hsfo_sod_comment,
          eca_sod_comment: bPlan.eca_sod_comment,
          max_sod_comment: bPlan.max_sod_comment
      }) ;

    })
    this.store.dispatch(new SaveBunkeringPlanAction(data));

  }
  portClicked(params) {
    if(params?.event?.checked) {
      let selectedport = (params.param && params.param.data)? params.param.data: {};
      this.selectedPort.push(selectedport);
      this.voyage_detail.emit(this.selectedPort);
    }
    else{
      this.selectedPort.forEach((value,index)=>{
        if(params?.param?.data?.detail_no)
          if(value.detail_no == params.param.data.detail_no) this.selectedPort.splice(index,1);
    });
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
    this.getRecalculatedHsfoCurrentStock();
    let currentROBObj = this.store.selectSnapshot(SaveCurrentROBState.saveCurrentROB);
    let dataFromStore = this.store.selectSnapshot(SaveBunkeringPlanState.getSaveBunkeringPlanData);
    console.log('data from store', dataFromStore);

    
    let req = {
       action : "save",
       user_id : "default@inatech.com",//this.username$ ,
       ship_id: this.vesselData?.vesselId,
       plan_id: this.latestPlanId,
       hsfo_current_stock: currentROBObj['3.5 QTY'] ? currentROBObj['3.5 QTY']: 0,
       vlsfo_current_stock: currentROBObj['0.5 QTY']? currentROBObj['0.5 QTY']: 0,
       ulsfo_current_stock: currentROBObj?.ULSFO,
       lsdis_current_stock: currentROBObj?.LSDIS,
       hsdis_current_stock: currentROBObj?.HSDIS,
       plan_details: dataFromStore,
       is_vessel_role_played: this.selectedUserRole == 1 ? 1 : 0, 
       generate_new_plan: 1,
       import_gsis: 1,
       send_plan: 1, 
    }
    console.log('Request', req);
    let isHardValidated = this.checkBunkerPlanValidations(dataFromStore);
    if(isHardValidated === 0){
      this.bplanService.saveBunkeringPlanDetails(req).subscribe((data)=> {
        console.log('Save status',data);
        if(data?.isSuccess == true){
          const dialogRef = this.dialog.open(NoDataComponent, {
            width: '350px',
            panelClass: 'confirmation-popup',
            data : {message: 'Plan Details updated successfully'}
          });
        }
      })
    }
    
  }

  getRecalculatedHsfoCurrentStock(){
    let currentROBObj = this.store.selectSnapshot(SaveCurrentROBState.saveCurrentROB)
    let hsfo05_stock = this.store.selectSnapshot(AddCurrentBunkeringPlanState.getCBPhsfo05_stock);
    if(currentROBObj['3.5 QTY'] > hsfo05_stock){
      let hsfo = currentROBObj['3.5 QTY'];
      let newHsfo = hsfo - hsfo05_stock;
      this.store.dispatch(new UpdateCurrentROBAction(newHsfo,'3.5 QTY'));
    }  
    else if(currentROBObj['3.5 QTY'] == null){
      let newHsfo = 0;
      this.store.dispatch(new UpdateCurrentROBAction(newHsfo,'3.5 QTY'));
    }
        
    if(currentROBObj['0.5 QTY'] > hsfo05_stock){
      let vlsfo = currentROBObj['0.5 QTY'];
      let newVlsfo = vlsfo - hsfo05_stock;
      this.store.dispatch(new UpdateCurrentROBAction(newVlsfo,'0.5 QTY'));
    }
    else if(currentROBObj['0.5 QTY'] == null){
      let newVlsfo = 0;
      this.store.dispatch(new UpdateCurrentROBAction(newVlsfo,'0.5 QTY'));
    }    
  }

  checkBunkerPlanValidations(data){
    let isHardValidation = 0;
    let currentROBObj = this.store.selectSnapshot(SaveCurrentROBState.saveCurrentROB)
    //business address validation
    let isValidBusinessAddress = data.findIndex(data => data?.business_address=='' && data?.operator_ack == 1) == -1? 'Y':'N'
    if(isValidBusinessAddress == 'N'){
      let id = data.findIndex(data => data?.business_address=='' && data?.operator_ack == 1)
      let port_id = data[id].port_id;
      const dialogRef = this.dialog.open(NoDataComponent, {
        width: '350px',
        panelClass: 'confirmation-popup',
        data : {message: 'Please select/enter a valid Business Address for port',id: port_id}
      });
      isHardValidation = 1;
      return isHardValidation;
    }
    // min ECA bunker SOD validation : ECA Min SOD + HSFO Min SOD > Total Max SOD
    // let isValidMinEcaSod = data.findIndex(params => (params?.eca_min_sod + params?.hsfo_min_sod) > params?.max_sod) == -1 ? 'Y':'N';
    // if(isValidMinEcaSod == 'N'){
    //   let id = data.findIndex(params => (params?.eca_min_sod + params?.hsfo_min_sod) > params?.max_sod);
    //   let port_id = data[id].port_id;
    //   const dialogRef = this.dialog.open(NoDataComponent, {
    //     width: '350px',
    //     panelClass: 'confirmation-popup',
    //     data : {message: 'The sum min ECA bunker SOD and minimum HSFO SOD cannot exceed the Total Max SOD for port',id: port_id}
    //   });
    //   isHardValidation = 1;
    //   return isHardValidation;
    // }
    //ECA est cons. validation : ECA Est consumption < LSDIS Est consumption
    let isValidEcaEstCons = data.findIndex(data => data?.eca_estimated_consumption < data?.lsdis_estimated_consumption) == -1 ? 'Y':'N';
    if(isValidEcaEstCons == 'N'){
      let id = data.findIndex(data => data?.eca_estimated_consumption < data?.lsdis_estimated_consumption)
      let port_id = data[id].port_id;
      const dialogRef = this.dialog.open(NoDataComponent, {
        width: '350px',
        panelClass: 'confirmation-popup',
        data : {message: 'The ECA Estimated Consumption should not be smaller than LSDIS Estimated Consumption for port ', id: port_id}
      });
      isHardValidation = 1;
      return isHardValidation;
    }
    // max SOD validation : Total max SOD< Total min SOD 
    let isValidMaxSod = data.findIndex(data => data?.max_sod < data?.min_sod) == -1 ? 'Y':'N';
    if(isValidMaxSod == 'N'){
      let id = data.findIndex(data => data?.max_sod < data?.min_sod)
      let port_id = data[id].port_id;
      const dialogRef = this.dialog.open(NoDataComponent, {
        width: '350px',
        panelClass: 'confirmation-popup',
        data : {message: 'The Total Max SOD cannot be smaller than Total min SOD for port',id: port_id }
      });
      isHardValidation = 1;
      return isHardValidation;
    }
    // HSFO SOD validation : HSFO SOD > HSFO tank capacity
    let isValidHsfoSod = data.findIndex(data => data?.hsfo_min_sod > currentROBObj?.hsfoTankCapacity) == -1 ? 'Y':'N';
    if(isValidHsfoSod =='N'){
      let id = data.findIndex(data => data?.hsfo_min_sod > currentROBObj?.hsfoTankCapacity)
      let port_id = data[id].port_id;
      const dialogRef = this.dialog.open(NoDataComponent, {
        width: '350px',
        panelClass: 'confirmation-popup',
        data : {message: `The minimum HSFO SOD cannot exceed the Total HSFO tank capacity (${currentROBObj.hsfoTankCapacity}) for port `, id: port_id}
      });
      isHardValidation = 1;
      return isHardValidation;
    }
    //ECA min SOD validation : ECA Min SOD > Vessel ECA tank capacity(ULSFO Tank Capacity + LSDIS Tank Capacity)
    let isValidEcaMinSod = data.findIndex(data => (data?.eca_min_sod > (currentROBObj?.lsdisTankCapacity + currentROBObj?.ulsfoTankCapacity))) == -1 ? 'Y':'N';
    if(isValidEcaMinSod == 'N'){
      let id = data.findIndex(data => data?.eca_min_sod > (currentROBObj?.lsdisTankCapacity + currentROBObj?.ulsfoTankCapacity))
      let port_id = data[id].port_id;
      let capacity = currentROBObj?.lsdisTankCapacity + currentROBObj?.ulsfoTankCapacity;
      const dialogRef = this.dialog.open(NoDataComponent, {
        width: '350px',
        panelClass: 'confirmation-popup',
        data : {message: `The minimum ECA bunker SOD cannot exceed the Total ULSFO and LSDIS tank capacity of ${capacity} for port `, id: port_id}
      });
      isHardValidation = 1;
      return isHardValidation;
    }
    //Stock validation : When Stock > Tank Capacity
    //1. Current HSFO Qty > HSFO Tank Capacity
    let isValidHsfoStock = (currentROBObj['3.5 QTY'] + currentROBObj['0.5 QTY']) > currentROBObj?.hsfoTankCapacity ? 'N':'Y';
    if(isValidHsfoStock == 'N'){
      const dialogRef = this.dialog.open(NoDataComponent, {
        width: '350px',
        panelClass: 'confirmation-popup',
        data : {message: `Current HSFO Qty should be less than HSFO Tank Capacity ${currentROBObj.hsfoTankCapacity} `}
      });
      isHardValidation = 1;
      return isHardValidation;
    }
    //2. Current ULSFO Qty > ULSFO Tank Capacity
    let isValidUlsfoStock = currentROBObj.ULSFO > currentROBObj?.ulsfoTankCapacity ? 'N':'Y';
    if(isValidUlsfoStock == 'N'){
      const dialogRef = this.dialog.open(NoDataComponent, {
        width: '350px',
        panelClass: 'confirmation-popup',
        data : {message: `Current ULSFO Qty should be less than ULSFO Tank Capacity ${currentROBObj.ulsfoTankCapacity} `}
      });
      isHardValidation = 1;
      return isHardValidation;
    }
    //3. Current LSDIS Qty > LSDIS Tank Capacity
    let isValidLsdisStock = currentROBObj.LSDIS > currentROBObj?.lsdisTankCapacity ? 'N':'Y';
    if(isValidLsdisStock == 'N'){
      const dialogRef = this.dialog.open(NoDataComponent, {
        width: '350px',
        panelClass: 'confirmation-popup',
        data : {message: `Current LSDIS Qty should be less than LSDIS Tank Capacity ${currentROBObj.lsdisTankCapacity} `}
      });
      isHardValidation = 1;
      return isHardValidation;
    }
    //4. Current HSDIS Qty > HSDIS Tank Capacity
    let isValidHsdisStock = currentROBObj.HSDIS > currentROBObj?.hsdisTankCapacity ? 'N':'Y';
    if(isValidHsdisStock == 'N'){
      const dialogRef = this.dialog.open(NoDataComponent, {
        width: '350px',
        panelClass: 'confirmation-popup',
        data : {message: `Current HSDIS Qty should be less than HSDIS Tank Capacity ${currentROBObj.hsdisTankCapacity} `}
      });
      isHardValidation = 1;
      return isHardValidation;
    }

    return isHardValidation;
  }

  triggerRefreshGrid(role){
    if(role?.id == 1 && this.type == 'C')
      this.editableCell = true;
    else
      this.editableCell = false;
      
     
      this.selectedUserRole = role?.id;
      var event = {force : true}
      if(this.type == 'C')
        this.gridOptions.api.refreshCells(event);
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

  calculateSOA(column){
    if(this.store.selectSnapshot(UpdateBplanTypeState.getBplanType) == 'C'){
      let currentROB = this.store.selectSnapshot(SaveCurrentROBState.saveCurrentROB);
      let rowData2 = this.rowData;
      let robValue = currentROB[column];
      switch(column){
        case 'LSDIS' :{
                        let currentRobLsdis = currentROB.LSDIS == null? 0 : currentROB.LSDIS;
                        for( let i = 0; i < rowData2.length ; i++){
                          //For Port 0
                          if(i==0){
                            let lsdisAsEca = rowData2[i].lsdis_as_eca;
                            rowData2[i].lsdis_soa = currentRobLsdis - rowData2[i].lsdis_estimated_consumption - lsdisAsEca;
                          }
                          //For Port 1 to N 
                          else{
                            let lsdisAsEca = rowData2[i].lsdis_as_eca;
                            rowData2[i].lsdis_soa = rowData2[i-1].lsdis_soa - rowData2[i].lsdis_estimated_consumption - lsdisAsEca + rowData2[i-1].lsdis_estimated_lift;

                          }
                          // this.store.dispatch(new UpdateCurrentBunkeringPlanAction(rowData2[i].lsdis_soa,'lsdis_soa',rowData2[i].detail_no));
                        }
                        if(this.gridOptions.api)
                          this.gridOptions.api.setRowData(rowData2);
                        break;
                      }
        case 'ULSFO' :{
                        let currentRobUslfo = currentROB.ULSFO == null ? 0 :currentROB.ULSFO;
                        for( let i = 0; i < rowData2.length ; i++){
                          //For Port 0
                          if(i==0){
                            let lsdisAsEca = rowData2[i].lsdis_as_eca;
                            rowData2[i].ulsfo_soa = currentRobUslfo - (rowData2[i].eca_estimated_consumption - rowData2[i].lsdis_estimated_consumption) + lsdisAsEca 
                          }
                          //For Port 1 to N 
                          else{
                            let lsdisAsEca = rowData2[i].lsdis_as_eca;
                            rowData2[i].ulsfo_soa = rowData2[i-1].ulsfo_soa - (rowData2[i-1].eca_estimated_consumption - rowData2[i].lsdis_estimated_consumption) + lsdisAsEca + rowData2[i-1].ulsfo_estimated_lift ;
                          }
                          // this.store.dispatch(new UpdateCurrentBunkeringPlanAction(rowData2[i].ulsfo_soa,'ulsfo_soa',rowData2[i].detail_no));
                        }
                        if(this.gridOptions.api)
                          this.gridOptions.api.setRowData(rowData2);
                        break;
                      }
        case '0.5 QTY':
        case '3.5 QTY': { 
                          let currentRobHsfo = currentROB['3.5 QTY'] == null ? 0 :currentROB['3.5 QTY'];
                          let currentRobVlsfo = currentROB['0.5 QTY'] == null ? 0 :currentROB['0.5 QTY'];                       
                          for (let i = 0 ; i < rowData2.length ; i++ ){
                            //For Port 0
                            if(i == 0){
                              let estdConsHsfoPort_0 = rowData2[i].hsfo_estimated_consumption == null ? 0 : rowData2[i].hsfo_estimated_consumption;
                              let soaHsfoPort_0 = currentRobHsfo + currentRobVlsfo - estdConsHsfoPort_0;
                              rowData2[i].hsfo_soa = soaHsfoPort_0;
                            }
                            //For Port 1 to N 
                            else{
                              rowData2[i].hsfo_soa = rowData2[i-1].hsfo_estimated_lift + rowData2[i-1].hsfo_soa - rowData2[i].hsfo_estimated_consumption;
                            } 
                            // this.store.dispatch(new UpdateCurrentBunkeringPlanAction(rowData2[i].hsfo_soa,'hsfo_soa',rowData2[i].detail_no))
                          }
                          if(this.gridOptions.api)
                            this.gridOptions.api.setRowData(rowData2);
                          break;
                        }
      }
    }
  }
    
}