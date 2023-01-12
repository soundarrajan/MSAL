import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { GridOptions } from 'ag-grid-community';
import { CommonService } from '@shiptech/core/services/common/common-service.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';

interface gridRow {
  id: number;
  name: string
  code: string;
  voyageId: string;
  eta: string;
  etb: string;
  etd: string;
  portCallId: string;
  isBunkerablePort: string;
}

@Component({
  selector: 'search-location-popup',
  templateUrl: './search-location-popup.component.html',
  styleUrls: ['./search-location-popup.component.scss']
})

export class SearchLocationPopupComponent implements OnInit {
  public dialog_gridOptions: GridOptions;
  public LocationId: number;
  public selectedRows: any = [];
  public params: any;
  public searchingLocation: string = null;
  public selectedLocation: any;
  public count: number = 0;
  public count2: number = 0;
  public counterpartyList: any;
  public counterpartyListLength;
  public overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center" style="color:white;border-radius:20px; border: 2px solid #5C5C5B; background: #5C5C5B ;">Loading Rows...</span>';
  public overlayNoRowsTemplate = '<span>No rows to show</span>';
  public requestOptions: any;
  public page: number;
  public pageSize: number = 20;
  public totalItems: number;
  public gridId: any = "searchLocation";
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
    private store: Store,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<SearchLocationPopupComponent>,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
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
        this.commonService.getLocationsList(this.apiRequest).subscribe(data => {
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
      payload.forEach( loc => {
        let eachRowData: gridRow = {
          id: loc.locationId,
          name: loc.name,
          code: loc.locationCode,
          voyageId: loc.voyageId,
          eta: loc.eta,
          etb: loc.etb,
          etd: loc.etd,
          portCallId: loc.portCallId,
          isBunkerablePort: loc.isBunkerablePort,
        };
        rowData.push(eachRowData);
      })
    }
    return rowData;
  }

  onPageChangeForLocation(page: number) {
    var endRowData = page * this.pageSize;
    this.dialog_gridOptions.api.showLoadingOverlay();
    this.page = page;
    this.apiRequest.Pagination = { Skip: endRowData - this.pageSize, Take: this.pageSize };
    this.commonService.getLocationsList(this.apiRequest).subscribe(data => {
      this.dialog_gridOptions.api?.hideOverlay();
      this.rowData = this.prepareRowData(data.payload);
      this.dialog_gridOptions.api.setRowData(this.rowData);
    });
  }

  onPageSizeChangeForLocation(pageSize: number) {
    this.pageSize = pageSize;
    this.dialog_gridOptions.api.showLoadingOverlay();
    var currentPage = this.dialog_gridOptions.api.paginationGetCurrentPage();
    this.page = currentPage + 1;
    this.apiRequest.Pagination = { Skip: 0, Take: this.pageSize };
    this.commonService.getLocationsList(this.apiRequest).subscribe(data => {
      this.dialog_gridOptions.api?.hideOverlay();
      if (data.payload) {
        this.rowData = this.prepareRowData(data.payload);
      this.dialog_gridOptions.api.setRowData(this.rowData);
      } else {
        this.dialog_gridOptions.api.showNoRowsOverlay();
      }
    });
  }

  onLocationChange(value) {
    this.searchingLocation = value;
    if (this.searchingLocation.length === 0) {
      this.totalItems = this.rowData.length;
      this.dialog_gridOptions.api.setRowData(this.rowData);
    }
  }

  SearchLocation(userInput: string): void {
    let inputValue = userInput.trim();
    this.dialog_gridOptions.api.showLoadingOverlay();
    this.apiRequest.SearchText = inputValue.toLowerCase();
    this.apiRequest.Pagination = { Skip: 0, Take: this.pageSize };
    this.commonService.getLocationsList(this.apiRequest).subscribe(data => {
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
      headerName: 'Location',
      headerTooltip: 'Location',
      field: 'name',
      width: 175,
      cellClass: ['aggridtextalign-left'],
      valueFormatter: params => this.format.htmlDecode(params.value)
    },
    {
      headerName: 'Location Code',
      headerTooltip: 'Location Code',
      field: 'code',
      width: 175,
      cellClass: ['aggridtextalign-left'],
      valueFormatter: params => this.format.htmlDecode(params.value)
    },
    {
      headerName: 'Voyage Id',
      headerTooltip: 'Voyage Id',
      field: 'voyageId',
      width: 175,
      cellClass: ['aggridtextalign-left'],
      valueFormatter: params => this.format.htmlDecode(params.value)
    },
    {
      headerName: 'ETA',
      headerTooltip: 'ETA',
      field: 'eta',
      cellClass: ['aggridtextalign-center'],
      valueFormatter: params => this.format.dateUtc(params.value)
    },
    {
      headerName: 'ETB',
      headerTooltip: 'ETB',
      field: 'etb',
      cellClass: ['aggridtextalign-center'],
      valueFormatter: params => this.format.dateUtc(params.value)
    },
    {
      headerName: 'ETD',
      headerTooltip: 'ETD',
      field: 'etd',
      cellClass: ['aggridtextalign-center'],
      valueFormatter: params => this.format.dateUtc(params.value)
    },
    {
      headerName: 'Port Call ID',
      headerTooltip: 'Port Call ID',
      field: 'portCallId',
      cellClass: ['aggridtextalign-center'],
      valueFormatter: params => this.format.htmlDecode(params.value)
    },
    {
      headerName: 'Bunkerable Port',
      headerTooltip: 'Bunkerable Port',
      field: 'isBunkerablePort',
      valueFormatter: params => (params.value ? 'Yes' : 'No'),
      cellClass: ['status-cell-background', 'aggridtextalign-center'],
      cellClassRules: {
        active: params => params.value ?? false,
        inactive: params => !(params.value ?? false)
      }
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

  AddLocation() {
    if(this.dialog_gridOptions.api.getSelectedRows().length == 0){
      this.toastr.error('Please select one row');
      return false;
    }
    this.dialogRef.close({data:this.dialog_gridOptions.api.getSelectedRows()[0]});
  }
}