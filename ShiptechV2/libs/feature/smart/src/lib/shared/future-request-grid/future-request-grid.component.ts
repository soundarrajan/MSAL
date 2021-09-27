import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngxs/store';
import { SaveBunkeringPlanState } from "./../../store/bunker-plan/bunkering-plan.state";
import { GridOptions } from '@ag-grid-community/core';
import { AGGridCellRendererComponent } from '../ag-grid/ag-grid-cell-renderer.component';
import { AGGridCellDataComponent } from '../ag-grid/ag-grid-celldata.component';
import { FormControl } from '@angular/forms';
import { LocalService } from '../../services/local-service.service';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'shiptech-future-request-grid',
  templateUrl: './future-request-grid.component.html',
  styleUrls: ['./future-request-grid.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class FutureRequestGridComponent implements OnInit {

  @Input('columnDefs') columnDefs;
  @Input('filterByVessel') filterByVessel?: any;
  public baseOrigin: string = '';
  public gridOptions: GridOptions;
  public colResizeDefault;
  public rowCount: Number;
  public date = new FormControl(new Date());
  currentDate = new Date();
  selectedFromDate: Date = new Date(this.currentDate.setMonth((this.currentDate.getMonth())-1));
  selectedToDate: Date = new Date();
  ETAFromTo: any;

  public RequestDetails : any = [];
  rowData: any[];
  columnFilter: any = [];
  TotalCount: number;
  scheduleDashboardLabelConfiguration: any;
  constructor(protected store: Store, private route: ActivatedRoute, private localService: LocalService) {
    this.baseOrigin = new URL(window.location.href).origin;
    
  }

  ngOnInit() {
    this.initGridConfig();
    //Get color code config data from route resolve
    this.route.data.subscribe(data => {
      console.log(data);
      this.scheduleDashboardLabelConfiguration = data.scheduleDashboardLabelConfiguration;
      
    });
  }
  initGridConfig() {
    this.gridOptions = <GridOptions>{
      columnDefs: this.columnDefs,
      debug: true,
      // datasource: this.dataSource,
      pagination: true,
      cacheBlockSize: 25, // you can have your custom page size
      paginationPageSize: 25, //pagesize
      enableServerSideFilter: true,
      enableServerSideSorting: true,
      rowModelType: 'serverSide',
      // serverSideDatasource: this.dataSource,
      //enableColResize: true,
      //enableSorting: true,
      animateRows: true,
      headerHeight: 38,
      rowHeight: 50,
      groupHeaderHeight: 40,
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true
      },
      rowSelection: 'single',
      onGridReady: (params) => {
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;
        // this.gridOptions.api.setDatasource(this.dataSource);
        this.loadOutstandRequestData();
        this.gridOptions.api.setServerSideDatasource(this.dataSource);
        this.gridOptions.api.sizeColumnsToFit();


        // this.gridOptions.api.setRowData(this.rowData);
        // this.rowCount = this.gridOptions.api.getDisplayedRowCount();

        var hardcodedFilter = {
          // country: {
          //   type: 'set',
          //   values: ['United States'],
          // },
          'requestStatus.displayName': { type: 'notEqual', filter: 'CANCELLED' }
          // date: { type: 'lessThan', dateFrom: '2010-01-01' },
        };
      
        this.gridOptions.api.setFilterModel(hardcodedFilter);
        // setTimeout(() => {
        //   let filterComponent = this.gridOptions.api.getFilterInstance("requestStatus.displayName");
        //   filterComponent.setModel({
        //     type: "notEqual",
        //     filter: "Cancelled"
        //   });
        //   this.gridOptions.api.onFilterChanged();
        // },150);
      },
      onColumnResized: function (params) {
        // if (params.columnApi.getAllDisplayedColumns().length <= 10 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
        //   params.api.sizeColumnsToFit();
        // }
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
  createNewRequest() {
    window.open(`${this.baseOrigin}/#/new-request/`, '_blank');
  }

  mapColumnValue(columnName) {
    switch (columnName) {
      case "requestId":
        return "requestId";
        
      case "serviceName":
        return "ServiceName";
        
      case "port":
      case "locationName":
        return "LocationName";

      case "eta":
        return "Eta";
        
      case "etd":
        return "Etd";

      case "productName":
        return "ProductName";

      case "buyerName":
        return "BuyerName";

      case "operatorByName":
        return "OperatorByName";

      case "requestStatus.displayName":
        return "RequestStatus_DisplayName";

      case "createdByName":
        return "CreatedByName";
    
      default:
        return columnName
    }
  }

  mapConditionType(key) {
    switch (key) {
      case "contains":
        return 'LIKE';
        
      case "notContains":
        return 'NOT LIKE';
        
      case "equals":
        return '=';

      case "notEqual":
        return '!=';
        
      case "startsWith":
        return 'LIKE1';

      case "endsWith":
        return 'LIKE2';
    
      case "greaterThan":
        return '>=';
    
      case "lessThan":
        return '<=';
    
      case "inRange":
        return 'between';
    
      default:
        return 'IS NOT NULL'
    }
  }
  dateConditionFormat(filterValue) {
    return new Promise((resolve) => {
    let fromDate, toDate;
        let DateArr = [];
        if(filterValue?.dateFrom) {
          fromDate = new Date(filterValue?.dateFrom).toISOString();
          fromDate = fromDate.substring(0, 16);
          DateArr.push(fromDate);
        } 
        if(filterValue?.dateTo) {
          toDate = new Date(filterValue?.dateTo).toISOString();
          toDate = toDate.substring(0, 16);
          DateArr.push(toDate);
        }
        resolve(DateArr);
      })
  }

  async mapFilterValue(filterType, filterValue) {
    // check whether column type date or text
    if(filterType=='date') {
      // if(!(filterValue?.operator)) {
        // let DateArr =  await this.dateConditionFormat(filterValue);
        let fromDate, toDate;
        let DateArr = [];
        if(filterValue?.dateFrom) {
            fromDate = new Date((filterValue?.dateFrom).split(' ')[0]).toISOString();
            fromDate = fromDate.substring(0, 16);
            fromDate = fromDate.split("T")[0]+"T00:00";
            DateArr.push(fromDate);
          } 
          if(filterValue?.dateTo) {
            toDate = new Date((filterValue?.dateTo).split(' ')[0]).toISOString();
            toDate = toDate.substring(0, 16);
            toDate = toDate.split("T")[0]+"T00:00";
            DateArr.push(toDate);
          }
            return DateArr;
          // }
    } else {
      return [filterValue?.filter];
    }
  }

  formatNestFilter(filterModel) {
    return new Promise((resolve)=> {
        let conditionFilterArr = {};
        let filterModelArr = Object.keys(filterModel)
        filterModelArr.forEach((filterValue, index)=> {
          if(filterModel[filterValue]?.operator) {
            let conditionArr = Object.keys(filterModel[filterValue]).filter(condKey=>condKey.indexOf('condition')>-1)
            conditionArr.forEach( async (key, idx)=> {
              filterModel[filterValue][key]['operator'] = filterModel[filterValue]?.operator;
              conditionFilterArr[filterValue+('~~~'+idx+1)]=(filterModel[filterValue][key]);
            })
          } else {
            conditionFilterArr[filterValue]=(filterModel[filterValue]);
          }
        // conditionArr.forEach( async (key, index)=> {
        //   let conditionFilter =  await this.dateConditionFormat(filterValue[key]);
          // conditionFilterArr.push(conditionFilter);
          if(filterModelArr.length == index+1) {
            return resolve(conditionFilterArr);
          }
        // })
      })
    })
  }

  generateFilterModel(params) {
      const columnCondSchema = {
        "columnValue": "",
        "ColumnType": "",
        "isComputedColumn": false,
        "ConditionValue": "",
        "Values": [],
        "FilterOperator": 0
      }
      let requestPayload = {
        "Payload": {
          "Order": null,
          "PageFilters": {
            "Filters": this.columnFilter
          },
          "SortList": {
            "SortList": [
              {
                "columnValue": "eta",
                "sortIndex": 0,
                "sortParameter": 2
              }
            ]
          },
          "Filters": [],
          "SearchText": null,
          "Pagination": {
            "Skip": (params?.request?.startRow)? params.request?.startRow: 0,
            "Take": 25
          }
        }
      }
    return new Promise(async (resolve)=> {
      // get fresh vesselref from store
      const vesselRef = this.store.selectSnapshot(SaveBunkeringPlanState.getVesselData);
      let vesselFilterProp = []
      if(vesselRef && vesselRef.vesselId) {
        vesselFilterProp.push(vesselRef.vesselId)
      }
      // generate filter model based on grid filter
      let filterModel = params?.request?.filterModel;
      let columnFilterByVessel = {
        "columnValue": "vesselId",
        "ColumnType": "Text",
        "isComputedColumn": false,
        "ConditionValue": "=",
        "Values": vesselFilterProp,
        "FilterOperator": 0
      };
      if(typeof filterModel == 'object' && Object.keys(filterModel).length>0) {
        this.columnFilter = [];
        if(this.ETAFromTo) {
          this.loadOutstandRequestData(this.ETAFromTo);
        } else if(Object.keys(filterModel).indexOf("eta")==-1){
          //set Eta From, To date as 1 month from current date by default
          let currentDate = new Date();
          let todayDate = new Date();
          let futureDate = new Date(todayDate.setMonth(todayDate.getMonth() + 1));
          this.loadOutstandRequestData({fromDate: currentDate, toDate: futureDate});
        }
        this.columnFilter = this.columnFilter.filter(EtaItem=>EtaItem.columnValue=="Eta")
       filterModel = await this.formatNestFilter(filterModel);

        let filterModelArr = Object.keys(filterModel)

        filterModelArr.forEach(async (filterKey, index) => {
          console.log(filterKey);
          let filterType = (filterModel[filterKey]?.filterType);
          let columnFormat = Object.assign({}, columnCondSchema);
          columnFormat.columnValue = await this.mapColumnValue(filterKey.split('~~~')[0]);
          columnFormat.ColumnType = filterType.charAt(0).toUpperCase()+filterType.substring(1);
          columnFormat.ConditionValue = await this.mapConditionType(filterModel[filterKey]?.type);
          columnFormat.Values = await this.mapFilterValue(filterType, filterModel[filterKey]);
          let isColumnMultiFilter = this.columnFilter.filter(filterItem=>filterItem.columnValue == columnFormat.columnValue);
          if(isColumnMultiFilter.length) {
            let filterLastIndex = this.columnFilter.map(filterItem=>filterItem.columnValue).lastIndexOf(columnFormat.columnValue);
            let opertorMode = filterModel[filterKey]?.operator;
            if(filterLastIndex!=-1) {
              this.columnFilter[filterLastIndex].FilterOperator = opertorMode == "AND"? 1: (opertorMode == "OR"? 2: 0);
            } else {
              columnFormat.FilterOperator = opertorMode == "AND"? 1: (opertorMode == "OR"? 2: 0);
            }
          }
          this.columnFilter.push(columnFormat);
          if(filterModelArr.length == index+1) {
            requestPayload.Payload.PageFilters.Filters = this.columnFilter;
            if(vesselRef && vesselRef.vesselId && this.filterByVessel) {
              requestPayload.Payload.PageFilters.Filters.push(columnFilterByVessel);
            }
            resolve(requestPayload);
          }
        })
      } else {
        if(vesselRef && vesselRef.vesselId && this.filterByVessel) {
          requestPayload.Payload.PageFilters.Filters.push(columnFilterByVessel);
        }
        resolve(requestPayload);
      }
      

      
      // return resolve(requestPayload);
    })

  }
  generateSortModel(params, requestPayload) {
      const columnSortSchema = {
        "columnValue": "requestid",
        "sortIndex": 1,
        "isComputedColumn": false,
        "sortParameter": 1,
        "col": "requestname"
      }
      return new Promise(async (resolve)=> {
      // generate sort model based on grid filter
      let columnSortReq = [];
      let sortModel = params?.request?.sortModel;
      if(sortModel.length>0) {
        sortModel.forEach(async (sortCol, index) => {
          let columnName = await this.mapColumnValue(sortCol.colId);
          let sortColModel = Object.assign({}, columnSortSchema);
          sortColModel.col = columnName.toLowerCase();
          sortColModel.columnValue = columnName.toLowerCase();
          sortColModel.sortIndex = index+1;
          sortColModel.sortParameter = (sortCol?.sort=="asc")? 1: 2;
          columnSortReq.push(sortColModel);
          if(sortModel.length == index+1) {
            requestPayload.Payload.SortList.SortList = columnSortReq;
            resolve(requestPayload);
          }
        });
      } else {
        resolve(requestPayload);
      }
    })

  }

  dataSource: any = {
    getRows: async (params: any) => {
      let requestPayload = await this.generateFilterModel(params);
          requestPayload = await this.generateSortModel(params, requestPayload);

      this.localService.getOutstandRequestData(requestPayload, this.scheduleDashboardLabelConfiguration).subscribe(response => {
          params.successCallback(
            response.payload, response.matchedCount
          );
        })
    }
  }
  loadOutstandRequestData(param?:any) {
    let currentDate = new Date();
    let prevMonthDate = (new Date(currentDate.setMonth(currentDate.getMonth() - 1))).toISOString();
    prevMonthDate = prevMonthDate.substring(0, 16);
    // let fromDate = new Date().toISOString();
    let fromDate:any = moment(new Date()).format("YYYY-MM-DD");
    let toDate = null;
        // fromDate = fromDate.substring(0, 16);
        // fromDate = fromDate.split("T")[0]+"T00:00";
        fromDate = fromDate+"T00:00";
        if(param) {
          // fromDate = param.fromDate.toISOString();
          // fromDate = fromDate.substring(0, 16);
          // fromDate = fromDate.split("T")[0]+"T00:00";
          fromDate = moment(param.fromDate).format("YYYY-MM-DD");
          fromDate = fromDate+"T00:00";

      let condFromDate = new Date(param.fromDate);
      let condToDate = new Date(param.toDate);
      if(param?.toDate && condFromDate<=condToDate) {
        toDate = moment(param.toDate).format("YYYY-MM-DD");
        // toDate = toDate.substring(0, 16);
        toDate = toDate+"T00:00";
        
      let isExist = this.columnFilter.findIndex((item)=> item.columnValue=='Eta' && item.ConditionValue== "<=");
      if(isExist>-1) this.columnFilter.splice(isExist,1);

        this.columnFilter.push({
          "columnValue": "Eta",
          "ColumnType": "Date",
          "isComputedColumn": false,
          "ConditionValue": "<=",
          "Values": [
            toDate
          ],
          "FilterOperator": 0
        })
      }
    }
    
    let isExist = this.columnFilter.findIndex((item)=> item.columnValue=='Eta' && item.ConditionValue== ">=");
    if(isExist>-1) this.columnFilter.splice(isExist,1);

    this.columnFilter.push({
      "columnValue": "Eta",
      "ColumnType": "Date",
      "isComputedColumn": false,
      "ConditionValue": ">=",
      "Values": [
        fromDate
      ],
      "FilterOperator": 1
    });

    // filter cancel request on load
    this.columnFilter.push({      
      "columnValue": "RequestStatus_DisplayName",
      "ColumnType": "Text",
      "isComputedColumn": false,
      "ConditionValue": "!=",
      "Values": [
        "CANCELLED"
      ],
      "FilterOperator": 0
    });
    // this.columnFilter.push({        
    //   "columnValue": "RequestDate",
    //   "ColumnType": "Date",
    //   "isComputedColumn": false,
    //   "ConditionValue": ">=",
    //   "Values": [
    //     prevMonthDate  
    //   ],
    //   "FilterOperator": 1
    // })
 
  }

  onDateChange(event) {
    console.log('selected date', event);
    this.ETAFromTo = event;
    this.gridOptions.api.setServerSideDatasource(this.dataSource);
    this.gridOptions.api.sizeColumnsToFit();
  }

  // displayCancelRow(event) {
  //   console.log(event);
  //   if(event.checked) {
  //     let isExist = this.columnFilter.findIndex((item)=> item.columnValue=='Status'); // Need to change Status to proper column value
  //     if(isExist>-1) this.columnFilter.splice(isExist, 1);
  //     this.columnFilter.push({
  //       "columnValue": "Status", // Need to change Status to proper column value
  //       "ColumnType": "String",
  //       "isComputedColumn": false,
  //       "ConditionValue": "=",
  //       "Values": [
  //         "Cancelled"
  //       ],
  //       "FilterOperator": 0
  //     })
  // } else {
  //   this.columnFilter = this.columnFilter.filter((item)=> item.columnValue!='Status');
  // }
  
  // this.loadOutstandRequestData();
  // this.gridOptions.api.setDatasource(this.dataSource);
// }

  // private columnDefs = [
  //   {
  //     headerName: 'Request ID', headerTooltip: 'Request ID', 
  //     field: 'requestId', width: 100, headerClass: ['aggrid-text-align-c'],
  //     filter: 'text',
  //     cellRendererFramework: AGGridCellDataComponent, 
  //     cellRendererParams: { type: 'request-link', redirectUrl: `${this.baseOrigin}/#/edit-request` },
  //     cellStyle: params => {
  //       let colorCode = params?.data?.requestStatus?.colorCode;
  //       if(colorCode?.code) {
  //         return {'box-shadow': `inset 4px 0px 0px -1px ${colorCode.code}`};
  //       }
  //       return null;
  //     },
  //     cellClass: function (params) {
  //       var classArray: string[] = ['aggrid-link', 'aggrid-content-c', 'aggrid-left-ribbon'];
  //       let status = params?.data?.requestStatus?.displayName;
  //       // let newClass = status === 'Stemmed' ? 'aggrid-left-ribbon lightgreen' :
  //       // status === 'Validated' ? 'aggrid-left-ribbon amber' :
  //       // status === 'PartiallyInquired' ? 'aggrid-left-ribbon mediumpurple' :
  //       // status === 'Inquired' ? 'aggrid-left-ribbon mediumpurple' :
  //       // status === 'PartiallyQuoted' ? 'aggrid-left-ribbon mediumpurple' :
  //       // status === 'Quoted' ? 'aggrid-left-ribbon mediumpurple' :
  //       // status === 'Amended' ? 'aggrid-left-ribbon mediumpurple' :
  //       // status === 'PartiallyStemmed' ? 'aggrid-left-ribbon mediumpurple' :
  //       // status === 'Cancelled' ? 'aggrid-left-ribbon dark' :
  //             // 'aggrid-left-ribbon dark';
  //       // classArray.push(newClass);
  //       return classArray.length > 0 ? classArray : null
  //     }
  //   },
  //   { headerName: 'Service', field: 'serviceName', filter: 'text', headerTooltip: 'Service', headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 100 },
  //   { headerName: 'Port', headerTooltip: 'Port', field: 'locationName', filter: 'text', width: 100, cellClass: ['aggrid-content-c aggrid-column-splitter-left'] },
  //   { headerName: 'ETA', headerTooltip: 'ETA', field: 'eta', filter: 'date', cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 140 },
  //   { headerName: 'ETD', headerTooltip: 'ETD', field: 'etd', filter: 'date', cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 140 },
  //   {
  //     headerName: 'Fuel Grade', headerTooltip: 'Fuel Grade', width: 160, field: 'productName', filter: 'text', cellRendererFramework: AGGridCellDataComponent, cellRendererParams: { type: 'multiple-values', gridTable: 'future-request' }, cellClass: ['aggrid-content-c aggrid-column-splitter-left'],
  //     valueGetter: function (params) {
  //       if(params?.data?.productName) {
  //         return [params.data.productName];
  //       } else {
  //         return []
  //       }
  //     }
  //   },
  //   { headerName: 'Trader', field: 'buyerName', filter: 'text', headerTooltip: 'Trader', width: 100, cellClass: ['aggrid-content-c aggrid-column-splitter-left'] },
  //   { headerName: 'Operator', field: 'operatorByName', filter: 'text', headerTooltip: 'Operator', width: 100, cellClass: ['aggrid-content-c'] },
  //   {
  //     headerName: 'Status', field: 'requestStatus.displayName', filter: 'text', 
  //     headerTooltip: 'Status', 
  //     cellRendererFramework: AGGridCellRendererComponent, headerClass: ['aggrid-text-align-c'], 
  //     // cellStyle: params => {
  //     //   let colorCode = params?.data?.requestStatus?.colorCode;
  //     //   if(colorCode.code) {
  //     //     return {background: colorCode.code};
  //     //   }
  //     //   return null;
  //     // },
  //     cellClass: ['aggrid-content-center'],
  //     cellRendererParams: function (params) {
  //       var classArray: string[] = [];
  //       let cellStyle = {};
  //       let status = params?.data?.requestStatus?.displayName;
  //       classArray.push('aggrid-content-center');
  //       classArray.push('custom-chip');

  //       let colorCode = params?.data?.requestStatus?.colorCode;
  //       if(colorCode?.code) {
  //         cellStyle = {background: colorCode.code};
  //       }
  //       // let newClass = status === 'Stemmed' ? 'custom-chip lightgreen' :
  //       //   status === 'Validated' ? 'custom-chip amber' :
  //       //     status === 'PartiallyInquired' ? 'custom-chip mediumpurple' :
  //       //     status === 'Inquired' ? 'custom-chip mediumpurple' :
  //       //     status === 'PartiallyQuoted' ? 'custom-chip mediumpurple' :
  //       //     status === 'Quoted' ? 'custom-chip mediumpurple' :
  //       //     status === 'Amended' ? 'custom-chip mediumpurple' :
  //       //     status === 'PartiallyStemmed' ? 'custom-chip mediumpurple' :
  //       //     status === 'Cancelled' ? 'custom-chip mediumpurple' :
  //       //       '';
  //       // classArray.push(newClass);
  //       return { cellClass: classArray.length > 0 ? classArray : null, cellStyle: cellStyle }
  //     }
  //   },
  //   // { headerName: 'Request Type', headerTooltip: 'Request Type', field: 'retype', width: 110, cellClass: ['aggrid-content-c'] },
  //   { headerName: 'Created by', headerTooltip: 'Created by', field: 'createdByName', filter: 'text', width: 110, cellClass: ['aggrid-content-c'] },
  // ];

}
