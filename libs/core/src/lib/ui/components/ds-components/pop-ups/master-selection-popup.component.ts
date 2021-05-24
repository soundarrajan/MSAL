import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy,ChangeDetectorRef, Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConfig } from '@shiptech/core/config/app-config';
import { EstAutoSearchType } from '@shiptech/core/enums/master-search-type';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { GridOptions, Optional } from "ag-grid-community";
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import moment from 'moment';

@Component({
    selector: 'master-search-popup',
    template:
    `
    <div class="inventory-report-popup">
        <div class="header">
            <div class="title">{{data?.dialog_header}}</div>
            <div class="header-btn">
            <input type="text" placeholder="Search" [(ngModel)]="searchedValue" class="search-box" style="height:30px">
            <button class="searchButton" type="submit" (click)="onSearch()">
            <i class="fa fa-search"></i>
            </button>
            <button class="blue-button h-25" style="cursor:pointer;" (click)="clearSearch()">Clear</button>
            <button class="blue-button h-25" style="cursor:pointer;" (click)="selectItem();">Select</button>
            <span class="seperator-line"></span>
            <span class="close" style="cursor:pointer;" (click)="closeDialog()"></span>
            </div>
        </div>
        <mat-dialog-content>

            <ag-grid-angular id="tradelistgrid" style="height: calc(100vh - 193px);"
                [gridOptions]="dialog_gridOptions"  
                (filterModified)="onFilterModified($event)"
                (filterChanged)="onFilterChanged($event)"
                class="ag-theme-material">
            </ag-grid-angular> 
            <div class="w-100 px-3 py-4  m-r-5 m-b-7" style="background: white;">
                <div class="popupFooter row mt-2" style="font-weight: 500;color: #828282;">
                    <div class="col-md-5">
                        Showing {{((page - 1) * size) + 1}}
                        to {{page * size > rowCount ?  rowCount : page * size }} of {{rowCount}} entries
                    </div>
                    <div class="col-md-7" style="display: flex;justify-content: flex-end">    
                        <div style="float:right;width: 315px;position:relative;top:4px;margin-left:20px;">
                            <span class="f-s-10" style="float:left;font-weight: 500;color: #828282;font-size:14px;">Show</span>
                            <mat-select disableOptionCentering [(ngModel)]="size" name="pagesize" (selectionChange)="pageSizeChanged($event)" style="float:left;width:50px;margin: -2px 5px 0 5px">
                                    <mat-option *ngFor="let list of pageSizeOptions" [value]="list">{{list}}</mat-option>
                                </mat-select>
                            <span class="f-s-10" style="float:left;font-weight: 500;color: #828282;font-size:14px;margin-right:15px;">rows</span>
                            <span class="f-s-10" style="float:left;font-weight: 500;color: #828282;font-size:14px;">Go to Page</span>
                            <input type="text" style="width:36px;height:28px;margin:-5px 5px 0 5px" [(ngModel)]="inputpage" name="eneteredPage"/>
                            <div class="goButton" (click)="pageNumberChanges(inputpage)">Go</div>      
                        </div>
                    </div>
            </div>

            </div>    
        </mat-dialog-content>
  </div>
    `
})
export class MasterSelectionDialog implements OnInit{
    public dialog_gridOptions: GridOptions;
    public rowCount: number = 1;
    public page: number = 1;
    public inputpage: number = 1;
    public size: number = 25;
    pageSizeOptions = [25,50,75,100]
    public searchedValue: string = '';
    columnFilterModel = {};
  columnFilterModelArr = [];
    _apiUrl;
    constructor(private http: HttpClient, private appConfig: AppConfig, public dialogRef: MatDialogRef<MasterSelectionDialog>, 
        @Optional() @Inject(MAT_DIALOG_DATA) public data: ImasterSelectionPopData,private changeDetectorRef: ChangeDetectorRef,
        private format: TenantFormattingService) {
        this._apiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS; 
        // this.loadSelectedTypes(data.selectionType);
        if(data.selectionType == EstAutoSearchType.company || data.selectionType == EstAutoSearchType.carrier){
            this.loadCompanyGridOption();
        }else if(data.selectionType == EstAutoSearchType.paymentTerms){
            this.loadPaymentTermsGridOption();
        }else if(data.selectionType == EstAutoSearchType.payableTo){
            this.loadPayableToGridOption();
        }else if (data.selectionType == EstAutoSearchType.customer){
            this.loadCustomerGridOption();
        }
    }

    ngOnInit() {
        
    }

    public companyColumnDefs = [];

    public numberFormatter(params) {
        if (isNaN(params.value))
            return params.value;
        else
            return params.value?.toFixed(4);
    }

    private rowData = [];

    closeDialog() {
        this.dialogRef.close('close');
    }
    clearSearch(){
        this.searchedValue = '';
        this.onSearch();
    }
    onSearch(){
        this.loadSelectedTypes(this.data.selectionType)
    }
    pageSizeChanged(event){
        this.page = this.inputpage = 1;
        this.loadSelectedTypes(this.data.selectionType); 
        this.changeDetectorRef.detectChanges();
        console.log("event",event)
    }
    
    pageNumberChanges(event){
        let calcPage= event ? +event : 1;
        const count = this.size < 1 ? 1 : Math.ceil(this.rowCount / this.size);
        let total = Math.max(count || 0, 1);
        // if(( this.rowCount > this.size && (this.rowCount/this.size > calcPage))){
        if(total >= calcPage){
            this.page = calcPage;
            this.loadSelectedTypes(this.data.selectionType); 
            this.changeDetectorRef.detectChanges();            
        }else{
            this.page = this.inputpage = 1;
            this.changeDetectorRef.detectChanges();
        }
        
    }
    loadSelectedTypes(selectionType){
        this.rowData = [];
        if(selectionType == EstAutoSearchType.company || selectionType == EstAutoSearchType.carrier){
            let payload = {"Order":null,"PageFilters":{"Filters":this.columnFilterModelArr},"SortList":{"SortList":[]},"Filters":[],"SearchText":this.searchedValue,"Pagination":{"Skip":(this.page -1)*this.size,"Take":this.size}};
            this.getCompanyList(payload).subscribe((data: any) => {
                this.rowData = data.payload;
                if(data.payload){
                    this.rowCount = data.matchedCount;
                    this.dialog_gridOptions.api.setRowData(this.rowData);
                }
            });
        }else if(selectionType == EstAutoSearchType.paymentTerms){
            let payload = {"Order":null,"PageFilters":{"Filters":this.columnFilterModelArr},"SortList":{"SortList":[]},"Filters":[],"SearchText":this.searchedValue,"Pagination":{"Skip":(this.page -1)*this.size,"Take":this.size}};
            this.getPaymentTermList(payload).subscribe((data: any) => {
                this.rowData = data.payload;
                if(data.payload){
                    this.rowCount = data.matchedCount;
                    this.dialog_gridOptions.api.setRowData(this.rowData);
                }
            });
        }else if(selectionType == EstAutoSearchType.payableTo){
            let payload = {"Order":null,"PageFilters":{"Filters":this.columnFilterModelArr},"SortList":{"SortList":[]},"Filters":[{"ColumnName":"CounterpartyTypes","Value":"2, 11"}],"SearchText":this.searchedValue,"Pagination":{"Skip":(this.page -1)*this.size,"Take":this.size}};
            this.getPayableToList(payload).subscribe((data: any) => {
                this.rowData = data.payload;
                if(data.payload){
                    this.rowCount = data.matchedCount;
                    this.dialog_gridOptions.api.setRowData(this.rowData);
                }
            });
        }else if(selectionType == EstAutoSearchType.customer){
            let payload = {
                Order: null,
                PageFilters: { Filters: this.columnFilterModelArr },
                SortList: { SortList: [] },
                Filters: [{ ColumnName: 'CounterpartyTypes', Value: '4' }],
                SearchText: this.searchedValue,
                Pagination: { Skip:(this.page -1)*this.size,"Take":this.size}
            };
              this.getCustomerList(payload).subscribe((data: any) => {
                this.rowData = data.payload;
                if (data.payload)
                {
                    this.rowCount = data.matchedCount;
                    this.dialog_gridOptions.api.setRowData(this.rowData);
                } 
              });
        }
    }
    loadCustomerGridOption(){
        this.companyColumnDefs = [
            {
              headerName: 'ID',
              headerTooltip: 'ID',
              field: 'id',
              width: 50,
              cellClass: ['aggridtextalign-left']
            },
            {
              headerName: 'Name',
              headerTooltip: 'Customer name',
              field: 'name',
              width: 150,
              cellClass: ['aggridtextalign-left']
            },
            {
              headerName: 'Parent',
              headerTooltip: 'Parent',
              field: 'parent.name',
              width: 150,
              cellClass: ['aggridtextalign-left']
            },
            {
              headerName: 'Created By',
              headerTooltip: 'Created By',
              field: 'createdBy.name',
              width: 150,
              // cellClass: ["aggridtextalign-right aggridlink"],
              cellClass: ['hoverdisable hover-cell-menu-icon']
            },
            {
              headerName: 'Created On',
              headerTooltip: 'Created On',
              field: 'createdOn',
              width: 150,
              cellClass: ['aggridtextalign-right'],
              valueFormatter: params => params.value ? moment(params.value).format(this.format.dateFormat.replace('DDD', 'ddd').replace('dd/', 'DD/')): ''
            },
            {
              headerName: 'Last Modified by',
              headerTooltip: 'Last Modified by',
              field: 'lastModifiedBy.name',
              width: 150,
              cellClass: ['aggridtextalign-left']
            },
            {
              headerName: 'LastModified on',
              headerTooltip: 'LastModified on',
              field: 'lastModifiedOn',
              width: 150,
              cellClass: ['aggridtextalign-left'],
              valueFormatter: params => params.value ? moment(params.value).format(this.format.dateFormat.replace('DDD', 'ddd').replace('dd/', 'DD/')): ''
            },
            {
              headerName: 'Status',
              headerTooltip: 'Status',
              field: 'isDeleted',
              width: 150,
              cellClass: ['aggridtextalign-left']
            }
          ];
          this.gridOptionAll();
        
    }
    loadCompanyGridOption(){
        this.companyColumnDefs = [
            { headerName: "ID", headerTooltip: "ID", field: "id", width: 50,cellClass: ["aggridtextalign-left"] },
            { headerName: "Company", headerTooltip: "Company", field: "name", width: 150,cellClass: ["aggridtextalign-left"] },
            { headerName: "Parent", headerTooltip: "Parent", field: "parent.name", width: 150, cellClass: ["aggridtextalign-left"] },
            { headerName: "Base Currency", headerTooltip: "Base Currency", field: "currency.name", type: 'numericColumn', valueFormatter: this.numberFormatter, width: 75, cellClass: ["aggridtextalign-left"] },
            { headerName: "Base UOM", headerTooltip: "Base UOM", field: "uom.name", width: 150, cellClass: ["aggridtextalign-right"] },
            { headerName: "Created By", headerTooltip: "Created By", field: "createdBy.name", width: 150,
                // cellClass: ["aggridtextalign-right aggridlink"],
                cellClass: ["hoverdisable hover-cell-menu-icon"] },
            { headerName: "Created On", headerTooltip: "Created On", field: "createdOn", width: 150, cellClass: ["aggridtextalign-right"],valueFormatter: params => params.value ? moment(params.value).format(this.format.dateFormat.replace('DDD', 'ddd').replace('dd/', 'DD/')): ''  },
            { headerName: "Last Modified by", headerTooltip: "Last Modified by", field: "lastModifiedBy.name", width: 150, cellClass: ["aggridtextalign-left"] },
            { headerName: "LastModified on", headerTooltip: "LastModified on", field: "lastModifiedOn", width: 150, cellClass: ["aggridtextalign-left"],valueFormatter: params => params.value ? moment(params.value).format(this.format.dateFormat.replace('DDD', 'ddd').replace('dd/', 'DD/')): ''  },
            { headerName: "Status", headerTooltip: "Status", field: "isDeleted", width: 150, cellClass: ["aggridtextalign-left"] },
            { headerName: "Company Code", headerTooltip: "Company Code", field: "code", width: 150, cellClass: ["aggridtextalign-left"] }
        ];
        this.gridOptionAll();
    }
    loadPayableToGridOption(){
        this.companyColumnDefs = [
            { headerName: "ID", headerTooltip: "ID", field: "id", width: 50,cellClass: ["aggridtextalign-left"] },
            { headerName: "Counterparty", headerTooltip: "Counterparty", field: "name", width: 150,cellClass: ["aggridtextalign-left"] },
            { headerName: "Parent", headerTooltip: "Parent", field: "parent.name", width: 150, cellClass: ["aggridtextalign-left"] },
            { headerName: "Not Active", headerTooltip: "Not Active", field: "isDeleted", width: 150, cellClass: ["aggridtextalign-left"] },
             { headerName: "Created By", headerTooltip: "Created By", field: "createdBy.name", width: 150,
                // cellClass: ["aggridtextalign-right aggridlink"],
                cellClass: ["hoverdisable hover-cell-menu-icon"] },
            { headerName: "Created On", headerTooltip: "Created On", field: "createdOn", width: 150, cellClass: ["aggridtextalign-right"],valueFormatter: params => params.value ? moment(params.value).format(this.format.dateFormat.replace('DDD', 'ddd').replace('dd/', 'DD/')): ''  },
            { headerName: "Last Modified by", headerTooltip: "Last Modified by", field: "lastModifiedBy.name", width: 150, cellClass: ["aggridtextalign-left"] },
            { headerName: "LastModified on", headerTooltip: "LastModified on", field: "lastModifiedOn", width: 150, cellClass: ["aggridtextalign-left"],valueFormatter: params => params.value ? moment(params.value).format(this.format.dateFormat.replace('DDD', 'ddd').replace('dd/', 'DD/')): ''  }
        ];
        this.gridOptionAll();
    }
    loadPaymentTermsGridOption(){
        this.companyColumnDefs = [
            { headerName: "ID", headerTooltip: "ID", field: "id", width: 50,cellClass: ["aggridtextalign-left"] },
            { headerName: "Payment term name", headerTooltip: "Payment term name", field: "name", width: 150,cellClass: ["aggridtextalign-left"] },
            { headerName: "Created By", headerTooltip: "Created By", field: "createdBy.name", width: 150,
                // cellClass: ["aggridtextalign-right aggridlink"],
                cellClass: ["hoverdisable hover-cell-menu-icon"] },
            { headerName: "Created On", headerTooltip: "Created On", field: "createdOn", width: 150, cellClass: ["aggridtextalign-right"],valueFormatter: params => params.value ? moment(params.value).format(this.format.dateFormat.replace('DDD', 'ddd').replace('dd/', 'DD/')): ''  },
            { headerName: "Last Modified by", headerTooltip: "Last Modified by", field: "lastModifiedBy.name", width: 150, cellClass: ["aggridtextalign-left"] },
            { headerName: "LastModified on", headerTooltip: "LastModified on", field: "lastModifiedOn", width: 150, cellClass: ["aggridtextalign-left"],valueFormatter: params => params.value ? moment(params.value).format(this.format.dateFormat.replace('DDD', 'ddd').replace('dd/', 'DD/')): ''  },
            { headerName: "Status", headerTooltip: "Status", field: "isDeleted", width: 150, cellClass: ["aggridtextalign-left"] }
        ];
         this.gridOptionAll();
        
    }
    onFilterModified(event){
        this.columnFilterModel = event.api.getFilterModel();
        // console.log('this.columnFilterModel',this.columnFilterModel)
    }
    onFilterChanged(event){
        this.columnFilterModel = event.api.getFilterModel();
        let filterModel = event.api.getFilterModel();
        const columnCondSchema = {
            "columnValue": "",
            "ColumnType": "",
            "isComputedColumn": false,
            "ConditionValue": "",
            "Values": [],
            "FilterOperator": 0
          };
      if(typeof filterModel == 'object' && Object.keys(filterModel).length>0) {
        
        let filterModelArr = Object.keys(filterModel)
        this.columnFilterModelArr = [];
        filterModelArr.forEach(async (filterKey, index) => {
          console.log(filterKey);
          let filterType = (filterModel[filterKey]?.filterType);
          let columnFormat = Object.assign({}, columnCondSchema);
          columnFormat.columnValue = await this.mapColumnValue(filterKey.split('~~~')[0]);
          columnFormat.ColumnType = filterType.charAt(0).toUpperCase()+filterType.substring(1);
          columnFormat.ConditionValue = await this.mapConditionType(filterModel[filterKey]?.type);
          columnFormat.Values = await this.mapFilterValue(filterType, filterModel[filterKey]);
          this.columnFilterModelArr.push(columnFormat);
          if(filterModelArr.length == index+1) {
           this.loadSelectedTypes(this.data.selectionType); 
          }        
        })
        
      }
    }
    async mapFilterValue(filterType, filterValue) {
        // check whether column type date or text
        if(filterType=='date') {
          if(!(filterValue?.operator)) {
            // let DateArr =  await this.dateConditionFormat(filterValue);
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
                return DateArr;
              }
        } else {
          return [filterValue?.filter];
        }
      }
    mapColumnValue(columnName) {
        return columnName;        
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
  gridOptionAll(){
    this.dialog_gridOptions = <GridOptions>{
        defaultColDef: {
            filter: 'agTextColumnFilter',
            sortable: true,
            resizable: true,
            headerCheckboxSelection: false,
            filterParams:{
                resetButton: true,
                applyButton: true,
                suppressAndOrCondition: true
            },
            checkboxSelection: isFirstColumn
        },
        columnDefs: this.companyColumnDefs,
        suppressRowClickSelection: true,
        headerHeight: 30,
        rowHeight: 30,
        rowSelection:'single',
        // groupIncludeTotalFooter: true,
        onGridReady: params => {
            this.dialog_gridOptions.api = params.api;
            this.dialog_gridOptions.columnApi = params.columnApi;
            this.dialog_gridOptions.api.sizeColumnsToFit();
            this.dialog_gridOptions.api.setRowData(this.rowData);
            // this.rowCount = this.dialog_gridOptions.api.getDisplayedRowCount();
        },
        getRowStyle: function (params) {
            if (params.node.rowPinned) {
                return { 'font-weight': '500', 'font-size': '20px' };
            }
        },
        onColumnResized: function (params) {
            if (params.columnApi.getAllDisplayedColumns().length <= 5 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
                params.api.sizeColumnsToFit();
            }
        }
    };
    this.loadSelectedTypes(this.data.selectionType);
  }
  @ObservableException()
  getCompanyList(request: any): Observable<any> {
    const requestUrl = `${this._apiUrl}/${masterURLenums.companyListURL}`;
    return this.http.post(requestUrl, {'Payload': request}).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load the company list'))
    );
  }

  @ObservableException()
  getPaymentTermList(request: any): Observable<any> {
    const requestUrl = `${this._apiUrl}/${masterURLenums.paymentTermListURL}`;
    return this.http.post(requestUrl, {'Payload': request}).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load the company list'))
    );
  }

  @ObservableException()
  getPayableToList(request: any): Observable<any> {
    const requestUrl = `${this._apiUrl}/${masterURLenums.payableToURL}`;
    return this.http.post(requestUrl, {'Payload': request}).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load the company list'))
    );
  }
  @ObservableException()
  getCustomerList(request: any): Observable<any> {
    const requestUrl = `${this._apiUrl}/${masterURLenums.customerListURL}`;
    return this.http.post(requestUrl, { Payload: request }).pipe(
      map((body: any) => body),
      catchError((e) => of('Error, could not load the customer list'))
    );
  }
  selectItem(){
    let selectedNodes = this.dialog_gridOptions.api.getSelectedNodes();
    if(selectedNodes.length){
        this.dialogRef.close(selectedNodes[0]);
    }else{
        this.dialogRef.close('close')
    }
    
  }

}

export enum masterURLenums {
    companyListURL = 'api/masters/companies/list',
    paymentTermListURL = 'api/masters/paymentterm/list',
    customerListURL = 'api/masters/counterparties/listByTypes',
    payableToURL = 'api/masters/counterparties/listByTypes',
    mock = 'Mock',
    mixed = 'Mixed'
}

export interface ImasterSelectionPopData{
    selectionType?: EstAutoSearchType;
    dialog_gridOptions?:GridOptions;
    dialog_header?:string
} 

function isFirstColumn(params) {
    var displayedColumns = params.columnApi.getAllDisplayedColumns();
    var thisIsFirstColumn = displayedColumns[0] === params.column;
    return thisIsFirstColumn;
  }