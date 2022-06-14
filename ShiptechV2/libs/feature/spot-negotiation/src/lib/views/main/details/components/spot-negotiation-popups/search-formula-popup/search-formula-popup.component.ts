import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
@Component({
  selector: 'app-search-formula-popup',
  templateUrl: './search-formula-popup.component.html',
  styleUrls: ['./search-formula-popup.component.css']
})

export class SearchFormulaPopupComponent implements OnInit {

  public dialog_gridOptions: GridOptions;
  public rowCount: Number;
  public formulaSelected:boolean = false;
  public formulaValue:string = "";
  gridId : number;
  page : number;
  pageSize : number;
  totalItems : number;
  sessionData: any;
  rowData : any = [];
  public hoverRowDetails =
      [
          { label: "Day Opening Balance", value: "5000 MT" },
          { label: "In", value: "3000 MT" },
          { label: "Out", value: "-5000 MT" },
          { label: "Transfer Out", value: "-2000 MT" },
          { label: "Transfer In", value: "0 MT" },
          { label: "Gain", value: "20 MT" },
          { label: "Loss", value: "0 MT" },
          { label: "Adj In", value: "0 MT" },
          { label: "Adj Out", value: "0 MT" },
          { label: "Day Closing Balance", value: "1020 MT" }
      ];
public overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center" style="color:white;border-radius:20px; border: 2px solid #5C5C5B; background: #5C5C5B ;">Loading Rows...</span>';
public overlayNoRowsTemplate = '<span>No rows to show</span>';
  selectedformula: any;
  selectedRow: any;
  
  constructor(
      public dialogRef: MatDialogRef<SearchFormulaPopupComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      )
      {
      this.sessionData = JSON.parse(sessionStorage.getItem('formula'));
      this.dialog_gridOptions = <GridOptions>{
          defaultColDef: {
              filter: true,
              sortable: true,
              resizable: true
          },
          columnDefs: this.columnDefs,
          suppressRowClickSelection: true,
          suppressHorizontalScroll: true,
          scrollbarWidth: 0,
          headerHeight: 30,
          rowHeight: 30,
          rowSelection: 'single',
          onGridReady: params => {
              // this.dialog_gridOptions.api = params.api;
              // this.dialog_gridOptions.columnApi = params.columnApi;
              this.dialog_gridOptions.api.sizeColumnsToFit();
          },
          getRowStyle: function (params) {
              if (params.node.rowPinned) {
                  return { 'font-weight': '500', 'font-size': '20px' };
              }
          },
          onColumnResized: function (params) {
              if (params.columnApi.getAllDisplayedColumns().length <= 5 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
                  params.api.sizeColumnsToFit();
                  //suppressHorizontalScroll = false;
              }
          }
      };
  }

  public cellClassRules = {
    'bg-inactive-grid': params => params.value == 'Inactive',
    'bg-active-grid': params => params.value == 'Active',
  };

  public columnDefs = [
        {
            headerName: '',
            field: 'check',
            filter: true,
            suppressMenu: true,
            width: 35,
            checkboxSelection: true,
            resizable: false,
            suppressMovable: true,
            headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
            cellClass: 'p-1 checkbox-center ag-checkbox-v2',
        },
        {
          headerName: "ID",
          headerTooltip: "ID",
          field: "id",
          width: 150,
          
        },
        {
            headerName: "Formula Description",
            headerTooltip: "Formula Description",
            field: "name",
            minWidth: 150
            
        },
        {
            headerName: "Created By",
            headerTooltip: "Created By",
            field: "createdBy.name",
            minWidth: 150
           
        },
        {
            headerName: "Created On",
            headerTooltip: "Created On",
            field: "createdOn",
            minWidth: 150
            
        },
        {
            headerName: "Last Modified By",
            headerTooltip: "Last Modified By",
            field: "lastModifiedBy.name",
            minWidth: 150
            
        },
        {
            headerName: "Last Modified On",
            headerTooltip: "Last Modified On",
            field: "lastModifiedOn",
            minWidth: 150
            
        },
        { 
            headerName: 'Active', 
            headerTooltip: 'Active', 
            valueGetter: params => {
              return params.data.isDeleted == false? 'Active': 'Inactive' ;
          },
          suppressMenu: true,minWidth: 150,
           cellClass: ['aggridtextalign-center'],
           cellClassRules: this.cellClassRules
        },
        
  ];

  public numberFormatter(params) {
      if (isNaN(params.value))
          return params.value;
      else
          return params.value.toFixed(4);
  }

  onSelectionChanged(ev){
    //alert("");
    this.formulaSelected=true;
    var selectedRows = this.dialog_gridOptions.api.getSelectedRows();
    this.formulaValue = selectedRows[0].description;
  }

  proceed() {
    this.selectedformula = this.toBeAddedFormula();
    if (this.selectedformula.length === 0) return;

      this.dialogRef.close({data: this.selectedformula});
  }

  toBeAddedFormula(){
    this.selectedRow = this.dialog_gridOptions.api.getSelectedRows();
    return this.selectedRow;
  }


  
  ngOnInit() {
    this.getContractFormula();
  }

  

  getContractFormula(){
     var requiredData = this.sessionData.payload.slice(0,25);
          this.page = 1;
          this.pageSize = 25;
          this.totalItems = this.sessionData.matchedCount;
          this.rowData = requiredData;
  }

  onPageChange(page: number){
    var start = page * this.pageSize - this.pageSize;
    var end = this.pageSize * page; 
    this.page = page;
    var requiredData = this.sessionData.payload.slice(start,end);
    this.rowData = requiredData;
  }

  
  onPageSizeChange(pageSize: number){
    this.page = 1;
    this.pageSize = pageSize;
    var requiredData = this.sessionData.payload.slice(0,pageSize);
    this.rowData = requiredData;
  }

  searchFormula(userInput: any){
    if(userInput.length === 0){
      this.page = 1;
      this.totalItems = this.sessionData.matchedCount;
      this.rowData = this.sessionData.payload.slice(0,this.pageSize)
      return;
    }
    let requestInput=userInput.trim();
    var filterData = this.sessionData.payload.filter(x=>
        x.name.includes(requestInput)
    )
    this.totalItems = filterData.length;
    this.page = 1;
    this.rowData = filterData.slice(0, this.pageSize);
    console.log(filterData);
    
  }

  

  onformulaChange(value){
    // this.searchingRequest = value;
    if (value.length === 0) {
      //this.totalItems = this.totalItems;
      this.dialog_gridOptions.api.setRowData(this.rowData);
    } else {
      return;
    }
  }

}



// payload(searchText : any, skip :number, take :number )
  // {
  //   const payload = {
  //     PageFilters: {
  //       Filters: []
  //     },
  //     Filters: [
  //       {
  //         ColumnName: 'ContractId',
  //         Value: null
  //       }
  //     ],
  //     SearchText: searchText,
  //     Pagination: {
  //       Skip: skip,
  //       Take: take
  //     }
  //   };
  //   return payload;
  // }
  
  // getContractFormula(){
  //   const response =  this.spotNegotiationService.getContractFormulaList(this.payload(null,0,25));
  //   response.subscribe((data : any)=>{
  //      console.log(data);
  //      var currentPage = this.dialog_gridOptions.api.paginationGetCurrentPage();
  //         this.page = currentPage + 1;
  //         this.pageSize = 25;
  //         this.totalItems = data.matchedCount;
  //         this.rowData = data.payload
  //      this.dialog_gridOptions.api.setRowData(this.rowData);
  //   });
  // }





// onPageSizeChange(pageSize: number) {
  //   this.pageSize = pageSize;
  //   this.dialog_gridOptions.api.showLoadingOverlay();
  //   var currentPage = this.dialog_gridOptions.api.paginationGetCurrentPage();
  //   this.page = currentPage + 1;
  //   const response = this.spotNegotiationService.getContractFormulaList(this.payload(null,0,this.pageSize));
  //   response.subscribe((res: any) => {
  //     this.dialog_gridOptions.api?.hideOverlay();
  //     if (res.payload) {
  //       this.dialog_gridOptions.api.setRowData(res.payload);
  //     } else {
  //       this.dialog_gridOptions.api.showNoRowsOverlay();
  //     }
  //   });
  // }

  // searchFormula(userInput: any){
  //   let requestInput=userInput.trim();
  //   this.dialog_gridOptions.api.showLoadingOverlay();
  //   const response = this.spotNegotiationService.getContractFormulaList(this.payload(requestInput.toLowerCase(), 0, this.pageSize));
  //   response.subscribe((res: any) => {
  //     this.totalItems = res.matchedCount;
  //     this.dialog_gridOptions.api?.hideOverlay();
  //     if (res.payload) {
  //       var currentPage = this.dialog_gridOptions.api.paginationGetCurrentPage();
  //       this.page = currentPage + 1;
  //       this.dialog_gridOptions.api.setRowData(res.payload);
  //     } else {
  //       this.dialog_gridOptions.api.showNoRowsOverlay();
  //     }
  //   });
  // }

  // onPageChange(page: number) {
  //   var endRowData = page * this.pageSize;
  //   this.dialog_gridOptions.api.showLoadingOverlay();
  //   this.page = page;
  //   const response = this.spotNegotiationService.getContractFormulaList(this.payload(null,endRowData - this.pageSize,this.pageSize));
  //   response.subscribe((res: any) => {
  //     this.dialog_gridOptions.api?.hideOverlay();
  //     this.dialog_gridOptions.api.setRowData(res.payload);
  //   });
  // }


