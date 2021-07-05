import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GridOptions } from '@ag-grid-community/core';
import { Select, Selector } from "@ngxs/store";
import { SaveBunkeringPlanState } from "./../../store/bunker-plan/bunkering-plan.state";
import { ISaveVesselData } from "./../../store/shared-model/vessel-data-model";
import { Observable } from 'rxjs';
import { AGGridCellRendererComponent } from '../ag-grid/ag-grid-cell-renderer.component';
import { LocalService } from '../../services/local-service.service';
import {
  IAuditLogRequest,
  IAuditLogResponse
} from '@shiptech/core/services/admin-api/request-response-dtos/audit-log.dto';
import moment from 'moment';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent implements OnInit {

  @Select(SaveBunkeringPlanState.getVesselData) vesselData$: Observable<ISaveVesselData>;
  vesselRef: ISaveVesselData;
  public gridOptions: GridOptions;
  public colResizeDefault;
  public rowCount: Number;
  public date = new FormControl(new Date());

  currentDate = new Date();
  defaultFromDate: Date = new Date(this.currentDate.setMonth((this.currentDate.getMonth())-1));
  selectedToDate: Date = new Date();

  constructor(private localService: LocalService) {
    this.vesselData$.subscribe(data=> {
      this.vesselRef = data;
    });
    this.gridOptions = <GridOptions>{
      columnDefs: this.columnDefs,
      //enableColResize: true,
      //enableSorting: true,
      animateRows: true,
      headerHeight: 40,
      rowHeight:40,
      pagination: true,
      paginationPageSize: 25,
      groupHeaderHeight: 40,
      defaultColDef: {
        filter: true,
        sortable: true,
        suppressSizeToFit: false,
        resizable:true
      },
      rowSelection: 'single',
      onGridReady: (params) => {
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;
        this.gridOptions.api.setRowData(this.rowData);
        this.gridOptions.api.sizeColumnsToFit(); 
        this.rowCount = this.gridOptions.api.getDisplayedRowCount();

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
      onDisplayedColumnsChanged: function (params){
        params.api.sizeColumnsToFit();
      }
    };
  }

  ngOnInit() {
    
    this.loadAuditLog();   
  }

  public loadAuditLog(){
    let businessId = "1102"; //smart module or screen ID
    let planID = this.vesselRef?.planId;
      
    let requestPayload = {"Filters":[{ColumnName: "BusinessId", Value: businessId}, {ColumnName: "Transaction", Value: planID}],"Pagination":{"Take":25,"Skip":0},"PageFilters":{"Filters":[{"columnValue":"Date","ColumnType":"Date","isComputedColumn":false,"ConditionValue":">=","Values":[this.defaultFromDate],dateType: "server","FilterOperator":0},{"columnValue":"Date","ColumnType":"Date","isComputedColumn":false,"ConditionValue":"<=","Values":[this.selectedToDate],dateType: "server","FilterOperator":1}]},"SortList":{"SortList":[]}};
     this.localService.getAuditLog(requestPayload).subscribe((data: any) => {
     this.rowData = data.payload;
     this.rowData.forEach((item: any) => {
     item.date = moment(item.date).format('MM/DD/YYYY HH:mm');
    });
     console.log(this.rowData);
     let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
     titleEle.click();
    });
  }

  onFromToDateChange(event) {
    console.log('selected date', event);
    this.defaultFromDate = event.fromDate;
    this.selectedToDate = event.toDate;  
    this.loadAuditLog();
  }

  dateFormatter(params) {
    return moment(params.value).format('MM/DD/YYYY HH:mm');
  }

  public columnDefs = [
    { headerName: 'Entity Name', headerTooltip: 'Entity Name', field:'static', valueFormatter: params => { return'Bunker Plan'; }, width:160 ,cellClass:['font-bold aggrid-content-c']},
    { headerName: 'Event Type', field: 'transactionType', headerTooltip: 'Event Type',width:160,cellClass:['aggrid-content-c']  },
    { headerName: 'Field Name', field: 'fieldName', headerTooltip: 'Field Name',width:160,cellClass:['aggrid-content-c']   },
    { headerName: 'New Value', headerTooltip: 'New Value', field: 'newValue',cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'] },
    { headerName: 'Old Value', headerTooltip: 'Old Value', field: 'oldValue',cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'] },
    { headerName: 'User Name', headerTooltip: 'User Name', field: 'modifiedBy.name',cellClass:['aggrid-content-c'],width:160  },
    { headerName: 'Date', headerTooltip: 'Date', field: 'date',valueFormatter: params => {return moment(params.value).format('MM/DD/YYYY HH:mm');}, width:160,cellClass:['aggrid-content-c']  }
  ];

  public rowData = [];

  }
