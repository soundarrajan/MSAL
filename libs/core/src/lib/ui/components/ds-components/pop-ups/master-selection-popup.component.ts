import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConfig } from '@shiptech/core/config/app-config';
import { EstAutoSearchType } from '@shiptech/core/enums/master-search-type';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { GridOptions, Optional } from "ag-grid-community";
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Component({
    selector: 'master-search-popup',
    template:
    `
    <div class="inventory-report-popup">
        <div class="header">
            <div class="title">{{data?.dialog_header}}</div>
            <div class="header-btn">
            <button class="blue-button h-25" style="cursor:pointer;" (click)="selectItem();">Select</button>
            <span class="seperator-line"></span>
            <span class="close" style="cursor:pointer;" [mat-dialog-close]="true"></span>
            </div>
    </div>
    <mat-dialog-content>
        <ag-grid-angular id="tradelistgrid" style="height: calc(100vh - 193px);"
            [gridOptions]="dialog_gridOptions"  
            class="ag-theme-material angular-v9">
        </ag-grid-angular> 
        <app-footer-v2 class="footer-popup" [id]="'inv-report-popup'"  [singleGrid]="true" [doublePagination]="true" [rowCount]="rowCount" [maxSize]="7"></app-footer-v2>  
    </mat-dialog-content>
  </div>
    `,
})
export class MasterSelectionDialog {
    public dialog_gridOptions: GridOptions;
    public rowCount: Number;
    _apiUrl;
    constructor(private http: HttpClient, private appConfig: AppConfig, public dialogRef: MatDialogRef<MasterSelectionDialog>, @Optional() @Inject(MAT_DIALOG_DATA) public data: ImasterSelectionPopData) {
        this._apiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;        
        if(data.selectionType == EstAutoSearchType.company){
            this.loadCompanyGridOption();
        }
    }

    ngOnInit() {
        
    }

    public companyColumnDefs = [
        { headerName: "ID", headerTooltip: "ID", field: "id", width: 50,cellClass: ["aggridtextalign-left"] },
        { headerName: "Company", headerTooltip: "Company", field: "name", width: 150,cellClass: ["aggridtextalign-left"] },
        { headerName: "Parent", headerTooltip: "Parent", field: "parent.name", width: 150, cellClass: ["aggridtextalign-left"] },
        { headerName: "Base Currency", headerTooltip: "Base Currency", field: "currency.name", type: 'numericColumn', valueFormatter: this.numberFormatter, width: 75, cellClass: ["aggridtextalign-left"] },
        { headerName: "Base UOM", headerTooltip: "Base UOM", field: "uom.name", width: 150, cellClass: ["aggridtextalign-right"] },
        { headerName: "Created By", headerTooltip: "Created By", field: "createdBy.name", width: 150,
            // cellClass: ["aggridtextalign-right aggridlink"],
            cellClass: ["hoverdisable hover-cell-menu-icon"] },
        { headerName: "Created On", headerTooltip: "Created On", field: "createdOn", width: 150, cellClass: ["aggridtextalign-right"] },
        { headerName: "Last Modified by", headerTooltip: "Last Modified by", field: "lastModifiedBy.name", width: 150, cellClass: ["aggridtextalign-left"] },
        { headerName: "LastModified on", headerTooltip: "LastModified on", field: "lastModifiedOn", width: 150, cellClass: ["aggridtextalign-left"] },
        { headerName: "Status", headerTooltip: "Status", field: "isDeleted", width: 150, cellClass: ["aggridtextalign-left"] },
        { headerName: "Company Code", headerTooltip: "Company Code", field: "code", width: 150, cellClass: ["aggridtextalign-left"] }
    ];

    public numberFormatter(params) {
        if (isNaN(params.value))
            return params.value;
        else
            return params.value?.toFixed(4);
    }

    private rowData = [
        // {
        //     id:'123',
        //     name:'test',
        //     parent:{name:'test'},
        //     currency:{name:'dolor'},
        //     uom:{name:'BLL'},
        //     createdBy:{name:'gokul'},
        //     createdOn:'12/12/12:10:20',
        //     lastModifiedBy:{name:'test'},
        //     lastModifiedOn:'12/12/12:00:20',
        //     isDeleted:false,
        //     code:'ANE-23'
        // }
        
    ];

    closeDialog() {
        this.dialogRef.close();
    }

    loadCompanyGridOption(){

        this.dialog_gridOptions = <GridOptions>{
            defaultColDef: {
                filter: true,
                sortable: true,
                resizable: true,
                headerCheckboxSelection: false,
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
                this.rowCount = this.dialog_gridOptions.api.getDisplayedRowCount();
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

        // Load Data
        let payload = {"Order":null,"PageFilters":{"Filters":[]},"SortList":{"SortList":[]},"Filters":[],"SearchText":null,"Pagination":{"Skip":0,"Take":25}};
        this.getCompanyList(payload).subscribe((data: any) => {
            this.rowData = data.payload;
            if(data.payload)
                this.dialog_gridOptions.api.setRowData(this.rowData);
            console.log(this.rowData);
        });
    }

  
  @ObservableException()
  getCompanyList(request: any): Observable<any> {
    const requestUrl = `${this._apiUrl}/${masterURLenums.companyListURL}`;
    return this.http.post(requestUrl, {'Payload': request}).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load the company list'))
    );
  }

  selectItem(){
    let selectedNodes = this.dialog_gridOptions.api.getSelectedNodes();
    // let selectedNodes = {
    //     id:'123',
    //     name:'test',
    //     parent:{name:'test'},
    //     currency:{name:'dolor'},
    //     uom:{name:'BLL'},
    //     createdBy:{name:'gokul'},
    //     createdOn:'12/12/12:10:20',
    //     lastModifiedBy:{name:'test'},
    //     lastModifiedOn:'12/12/12:00:20',
    //     isDeleted:false,
    //     code:'ANE-23'
    //     }
    console.log(selectedNodes[0]);
    this.dialogRef.close(selectedNodes[0]);
    
  }

}

export enum masterURLenums {
    companyListURL = 'api/masters/companies/list',
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