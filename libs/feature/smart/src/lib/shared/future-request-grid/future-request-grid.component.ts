import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngxs/store';
import { SaveBunkeringPlanState } from "./../../store/bunker-plan/bunkering-plan.state";
import { GridOptions } from '@ag-grid-community/core';
import {
  RowModelType,
  RowSelection
} from '@shiptech/core/ui/components/ag-grid/type.definition';
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
      rowModelType: RowModelType.ServerSide,
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
      rowSelection: RowSelection.Single,
      blockLoadDebounceMillis: 100, // #38555 - Fix for multiple server request onLoad
      onGridReady: (params) => {
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;
        // this.gridOptions.api.setDatasource(this.dataSource);
        this.gridOptions.api.setServerSideDatasource(this.dataSource);
        this.gridOptions.api.sizeColumnsToFit();
        // this.gridOptions.api.setRowData(this.rowData);
        // this.rowCount = this.gridOptions.api.getDisplayedRowCount();

        if(!this.ETAFromTo) {
          let currentDate = new Date();
          let todayDate = new Date();
          let pastDate = new Date(todayDate.setMonth(todayDate.getMonth() - 3));
          this.ETAFromTo = { fromDate: pastDate, toDate: currentDate }
        }
        var hardcodedFilter = {
          // country: {
          //   type: 'set',
          //   values: ['United States'],
          // },
          'requestStatus.displayName': { type: 'notEqual', filter: 'CANCELLED' }
          , 'eta': {
            dateFrom: moment(this.ETAFromTo?.fromDate).format("YYYY-MM-DD"),
            dateTo: moment(this.ETAFromTo?.toDate).format("YYYY-MM-DD"),
            type: 'inRange',
            filterType: 'date'
          }
          // date: { type: 'lessThan', dateFrom: '2010-01-01' },
        };
      
        this.gridOptions.api.setFilterModel(hardcodedFilter);
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

  onDateChange(event) {
    this.ETAFromTo = event;
    this.gridOptions.api.setServerSideDatasource(this.dataSource);
    this.gridOptions.api.sizeColumnsToFit();
  }
}
