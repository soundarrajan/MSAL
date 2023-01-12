import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { CommonService } from '@shiptech/core/services/common/common-service.service';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';

interface gridRow {
  productId: number;
  productName: string
  parent: string;
  productType: string;
  createdBy: string;
  createdOn: string;
  lastModifiedBy: string;
  lastModifiedOn: string;
}

@Component({
  selector: 'search-products-popup',
  templateUrl: './search-products-popup.component.html',
  styleUrls: ['./search-products-popup.component.scss']
})

export class SearchProductsPopupComponent implements OnInit {
  public dialog_gridOptions: GridOptions;
  public counterpartyListRowCount: number = this.spotNegotiationService
    .counterpartyTotalCount;
  public LocationId: number;
  public selectedRows: any = [];
  public selectedId: any = false;
  public params: any;
  searchingProduct: string = null;
  selectedProduct: any;
  public count: number = 0;
  public count2: number = 0;
  public counterpartyList: any;
  public counterpartyListLength;
  public overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center" style="color:white;border-radius:20px; border: 2px solid #5C5C5B; background: #5C5C5B ;">Loading Rows...</span>';
  public overlayNoRowsTemplate = '<span>No rows to show</span>';
  requestOptions: any;
  public page: number;
  public pageSize: number = 20;
  public totalItems: number;
  public gridId: any = "searchProduct";
  public apiRequest = {
    "Order": null,
    "PageFilters": {
        "Filters": []
    },
    "SortList": {
        "SortList": []
    },
    "Filters": [],
    "SearchText": null,
    "Pagination": {
        "Skip": 0,
        "Take": this.pageSize
    }
  }
  public rowData: gridRow[];
  
  constructor(
    public format: TenantFormattingService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<SearchProductsPopupComponent>,
    private spotNegotiationService: SpotNegotiationService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedId = (data.dataId) ? data.dataId : false;
    this.dialog_gridOptions = <GridOptions>{
      defaultColDef: {
        resizable: true
      },
      columnDefs: this.columnDefs,
      suppressRowClickSelection: true,
      headerHeight: 30,
      rowHeight: 30,
      rowSelection: 'single',

      onGridReady: params => {
        this.dialog_gridOptions.api = params.api;
        this.dialog_gridOptions.columnApi = params.columnApi;
        this.dialog_gridOptions.api?.sizeColumnsToFit();
        this.commonService.getProductsList(this.apiRequest).subscribe(data => {
          this.totalItems = data.matchedCount;
          this.rowData = this.prepareRowData(data.payload);
          this.dialog_gridOptions.api?.setRowData(this.rowData);
        });
      },
      getRowStyle: function(params) {
        if (params.node.rowPinned) {
          return { 'font-weight': '500', 'font-size': '20px' };
        }
      },
      onColumnResized: function(params) {
        if (
          params.columnApi.getAllDisplayedColumns().length <= 5 &&
          params.type === 'columnResized' &&
          params.finished === true &&
          params.source === 'uiColumnDragged'
        ) {
          params.api.sizeColumnsToFit();
        }
      }
    };
  }

  prepareRowData(payload): gridRow[]{
    let rowData: gridRow[] = [];
    if(payload.length > 0){
      payload.forEach( prod => {
        let eachRowData: gridRow = {
          productId: prod.id,
          productName: prod.name,
          parent: prod.parent?.name,
          productType: prod.productType?.name,
          createdBy: prod.createdBy?.name,
          createdOn: prod.createdOn,
          lastModifiedBy: prod.lastModifiedBy?.name,
          lastModifiedOn: prod.lastModifiedOn,
        };
        rowData.push(eachRowData);
      })
    }
    return rowData;
  }

  onPageChangeForProduct(page: number) {
    var endRowData = page * this.pageSize;
    this.dialog_gridOptions.api.showLoadingOverlay();
    this.page = page;
    this.apiRequest.Pagination = { Skip: endRowData - this.pageSize, Take: this.pageSize };
    this.commonService.getProductsList(this.apiRequest).subscribe(data => {
      this.dialog_gridOptions.api?.hideOverlay();
      this.rowData = this.prepareRowData(data.payload);
      this.dialog_gridOptions.api.setRowData(this.rowData);
    });
  }

  onPageSizeChangeForProduct(pageSize: number) {
    this.pageSize = pageSize;
    this.dialog_gridOptions.api.showLoadingOverlay();
    var currentPage = this.dialog_gridOptions.api.paginationGetCurrentPage();
    this.page = currentPage + 1;
    this.apiRequest.Pagination = { Skip: 0, Take: this.pageSize };
    this.commonService.getProductsList(this.apiRequest).subscribe(data => {
      this.dialog_gridOptions.api?.hideOverlay();
      if (data.payload) {
        this.rowData = this.prepareRowData(data.payload);
        this.dialog_gridOptions.api.setRowData(this.rowData);
      } else {
        this.dialog_gridOptions.api.showNoRowsOverlay();
      }
    });
  }

  onProductChange(value) {
    this.searchingProduct = value;
    if (this.searchingProduct.length === 0) {
      this.totalItems = this.rowData.length;
      this.dialog_gridOptions.api.setRowData(this.rowData);
    }
  }

  SearchProduct(userInput: string): void {
    let inputValue = userInput.trim();
    this.dialog_gridOptions.api.showLoadingOverlay();
    this.apiRequest.SearchText = inputValue.toLowerCase();
    this.apiRequest.Pagination = { Skip: 0, Take: this.pageSize };
    this.commonService.getProductsList(this.apiRequest).subscribe(data => {
      this.totalItems = data.matchedCount;
      this.dialog_gridOptions.api?.hideOverlay();
      if (data.payload) {
        var currentPage = this.dialog_gridOptions.api.paginationGetCurrentPage();
        this.page = currentPage + 1;
        this.rowData = this.prepareRowData(data.payload);
        this.dialog_gridOptions.api.setRowData(this.rowData);
      } else {
        this.dialog_gridOptions.api.showNoRowsOverlay();
      }
    });
  }

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
      cellClass: 'p-1 checkbox-center ag-checkbox-v2'
    },
    {
      headerName: 'Product Name',
      headerTooltip: 'Product Name',
      field: 'productName',
      width: 175,
      cellClass: ['aggridtextalign-left'],
      valueFormatter: params => this.format.htmlDecode(params.value)
    },
    {
      headerName: 'Parent',
      headerTooltip: 'Parent',
      field: 'parent',
      width: 175,
      cellClass: ['aggridtextalign-left'],
      valueFormatter: params => this.format.htmlDecode(params.value)
    },
    {
      headerName: 'Product Type',
      headerTooltip: 'Product Type',
      field: 'productType',
      width: 175,
      cellClass: ['aggridtextalign-left'],
      valueFormatter: params => this.format.htmlDecode(params.value)
    },
    {
      headerName: 'Created By',
      headerTooltip: 'Created By',
      field: 'createdBy',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Created On',
      headerTooltip: 'Created On',
      field: 'createdOn',
      cellClass: ['aggridtextalign-center'],
      valueFormatter: params => this.format.dateUtc(params.value)
    },
    {
      headerName: 'Last Modified By',
      headerTooltip: 'Last Modified By',
      field: 'lastModifiedBy',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Last Modified On',
      headerTooltip: 'Last Modified On',
      field: 'lastModifiedOn',
      cellClass: ['aggridtextalign-center'],
      valueFormatter: params => this.format.dateUtc(params.value)
    }
  ];

  public numberFormatter(params) {
    if (isNaN(params.value)) return params.value;
    else return params.value.toFixed(4);
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onRowSelected(node) {
    this.selectedId = node.data.productId;
  }

  AddProduct() {
    if(this.dialog_gridOptions.api.getSelectedRows().length == 0){
      this.toastr.error('Please select one row');
      return false;
    }
    this.dialogRef.close({data:this.dialog_gridOptions.api.getSelectedRows()[0]});
  }
}
