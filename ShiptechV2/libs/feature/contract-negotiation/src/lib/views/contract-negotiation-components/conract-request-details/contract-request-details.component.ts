import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { FilterPreferenceModel, FilterPreferenceViewModel } from '@shiptech/core/services/user-settings/filter-preference.interface';
import { GridOptions } from 'ag-grid-community';
import { AGGridCellLinkRenderer } from '../../../core/ag-grid-renderers/ag-grid-cell-link-renderer.component';
import { AGGridMultiDataRendererComponent } from '../../../core/ag-grid-renderers/ag-grid-multi-data-renderer.component';
import { ContractNegotiationService } from '../../../services/contract-negotiation.service';
import { LocalService } from '../../../services/local-service.service';

@Component({
  selector: 'app-contract-request-details',
  templateUrl: './contract-request-details.component.html',
  styleUrls: ['./contract-request-details.component.scss']
})
export class ContractRequestDetailsComponent implements OnInit {
  public switchTheme: boolean = true;
  public theme = false;
  public gridOptions: GridOptions;
  public newScreen: boolean = true;
  public gridId: any;
  public rowData_aggrid1 = [];
  public filterPresets = [];
  public newPresetsDialog: MatDialogRef<any>;

  public gridpageNavModel = {
    pageSizeOptions: [5, 50, 75],
    pageSize: 5,
    page: 1,
    totalItems: 0
  }
  public preferenceNameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
    Validators.pattern('^([?=_0-9a-zA-Z ]+)')
  ]);

  @ViewChild('createPreset', { static: false })
  createPresetTemplate: TemplateRef<any>;

  public defaultColFilterParams = {
    buttons: ['reset', 'apply'],
    precision: () => this.format.quantityPrecision
  };
  ngOnInit(): void {
    this.localService.setTheme(this.theme);
    this.loadPreferenceCount();
  }
  ngOnChanges() {
    // this.getGridData();
  }
  mainPage(id) {
    this.router.navigate([`contract-negotiation/requests/${id}`]);
  }

  filterList = {
    filters: [
      {
        name: 'Default',
        count: '9',
        defaultFilter: true,
        selected: true,
        pinned: true,
        position: 0
      }
      // {
      //   name: 'All',
      //   count: '12',
      //   defaultFilter: false,
      //   selected: false,
      //   pinned: true,
      //   position: 1
      // }
    ],
    enableMoreFilters: true,
    multiSelect: false
  }


  onPageChange(data: any) {
    this.gridpageNavModel.pageSize = data.pageSize;
    this.gridOptions.api.paginationSetPageSize(Number(this.gridpageNavModel.pageSize));
    this.gridpageNavModel.page = 1;
    this.gridOptions.api.paginationGoToPage(this.gridpageNavModel.page - 1);
  }

  gotoPage(evt) {
    this.gridpageNavModel.page = Number(evt.page)
    this.gridOptions.api.paginationSetPageSize(Number(this.gridpageNavModel.pageSize));
    this.gridOptions.api.paginationGoToPage(this.gridpageNavModel.page - 1);

  }

  onPaginationChanged(any) {
    console.log('onPaginationPageLoaded');
  }

  constructor(public dialog: MatDialog, public router: Router, private localService: LocalService, private contractService: ContractNegotiationService, private format: TenantFormattingService, public matDialog: MatDialog) {
    this.gridOptions = <GridOptions>{
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: this.defaultColFilterParams
      },
      columnDefs: this.columnDef_aggrid,
      suppressCellSelection: true,
      suppressPaginationPanel: true,
      pagination: true,
      paginationPageSize: this.gridpageNavModel.pageSize,
      headerHeight: 30,
      // rowHeight: 35,
      animateRows: true,
      onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
      },
      rowSelection: 'single',
      onGridReady: (params) => {
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;
        this.gridOptions.api.sizeColumnsToFit();
        params.api.sizeColumnsToFit();
        this.getGridData();
      },
      getRowHeight(params) {
        let c = 0;
        c = params.data.locations.reduce((sum, value) => {
          return (sum + value.products.length);
        }, 0)
        let m = params.data.locations.reduce((sum, value) => {
          return (sum + (value.products.length > 1 ? value.products.length : 0));
        }, 0)
        if (c > 0)
          return ((c * 35) - (m * 7));
        else
          return (35);
      },
      onColumnResized: function (params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
          //params.api.sizeColumnsToFit();
        }
      },
      onColumnVisible: function (params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8) {
          params.api.sizeColumnsToFit();

        }
      },
      frameworkComponents: {
        cellLinkRenderer: AGGridCellLinkRenderer
      }
    }

  }

  getGridData() {
    this.contractService.getContractRequestList()
      .subscribe(res => {
        this.rowData_aggrid1 = res;
        this.gridOptions.api.setRowData(this.rowData_aggrid1)
        this.gridpageNavModel.totalItems = this.gridOptions.api.getDisplayedRowCount();
      });
  }

  private columnDef_aggrid = [
    {
      headerName: 'Request ID', headerTooltip: 'Request ID', field: 'id', width: 100, cellClass: ['aggridlink'], cellStyle: { 'padding-left': '15px' },
      cellRenderer: "cellLinkRenderer", cellRendererParams: { onClick: this.mainPage.bind(this) }
    },
    {
      headerName: 'Created Date', headerTooltip: 'Created Date', field: 'createdOn', width: 120, cellStyle: { 'padding-left': '15px' }, filter: 'agDateColumnFilter', valueFormatter: params => this.format.date(params.value)
    },
    {
      headerName: 'Status', headerTooltip: 'Status', field: 'status', width: 80,
      cellRenderer: function (params) {
        return `<div class="status-circle"><span class="circle ` + params.value + `"></span>` + params.value + `</div>`;
      }
    },
    {
      headerName: 'Buyer', headerTooltip: 'Buyer', field: 'buyer', width: 120
    },
    {
      headerName: 'Start Date', headerTooltip: 'Start Date', field: 'startDate', width: 120, filter: 'agDateColumnFilter', valueFormatter: params => this.format.date(params.value)
    },
    {
      headerName: 'End Date', headerTooltip: 'End Date', field: 'endDate', width: 120, cellClass: ['thick-right-border'], filter: 'agDateColumnFilter', valueFormatter: params => this.format.date(params.value)
    },
    {
      headerName: 'Location', headerTooltip: 'Location', field: 'locations', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data border-left'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'locationName', type: 'chip-bg', cellClass: 'chip-rectangle' },
      valueGetter: function (params) {
        return params.data.locations;
      }
    },
    {
      headerName: 'Product', headerTooltip: 'Product', field: 'productName', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data thick-right-border border-right'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'productName', type: 'chip-bg', cellClass: 'chip-rectangle' },
      valueGetter: function (params) {
        return params.data.locations;
      }
    },
    {
      headerName: 'Offers', headerTooltip: 'Offers', field: 'offers', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'offers', type: 'text' },
      valueGetter: function (params) {
        return params.data.locations;
      }
    },
    {
      headerName: 'Awaiting app.', headerTooltip: 'Awaiting app.', field: 'awaitingApproval', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'awaitingApproval', cellClass: 'chip-circle await' },
      valueGetter: function (params) {
        return params.data.locations;
      }
    },
    {
      headerName: 'Approved', headerTooltip: 'Approved', field: 'approved', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'approved', cellClass: 'chip-circle approve' },
      valueGetter: function (params) {
        return params.data.locations;
      }
    },

    {
      headerName: 'Rejected', headerTooltip: 'Rejected', field: 'rejected', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'rejected', cellClass: 'chip-circle reject' },
      valueGetter: function (params) {
        return params.data.locations;
      }
    },
    {
      headerName: 'Contract Created', headerTooltip: 'Contract Created', field: 'contracted', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'contracted', cellClass: 'chip-circle create' },
      valueGetter: function (params) {
        return params.data.locations;
      }
    },

  ];

  onResize(event) {
    this.gridOptions.api.sizeColumnsToFit();
  }

  public openSaveAsPresetDialog(): void {
    this.newPresetsDialog = this.matDialog.open(this.createPresetTemplate, {
      width: '400px',
      disableClose: false,
      closeOnNavigation: true
    });
  }

  loadPreferenceCount() {
    this.contractService.getPreferenceCount()
      .subscribe(response => {
        this.filterList.filters[0].count = response['default'];
        // this.filterList.filters[1].count = response['all'];
      })

    this.contractService.getUserFilterPresets()
      .subscribe(res => {
        console.log(res);
        this.filterPresets = [];
      })

    // this.
  }

  createNewFilter() {
    let matches = this.filterPresets.find(i => i.name.toLowerCase() != this.preferenceNameFormControl.value.toLowerCase());
    if (!matches) {
      const newFilter = new FilterPreferenceViewModel({
        id: this.preferenceNameFormControl.value + Math.random(),
        name: this.preferenceNameFormControl.value,
        filterModels: { "contract-requestlist-filter-presets": this.gridOptions.api.getFilterModel() },
        isPinned: true,
        isActive: true
      })
      this.filterPresets.push(newFilter);
      this.contractService.updateUserFilterPresets(this.filterPresets)
        .subscribe(res => {
          this.newPresetsDialog.close();
        });
    }
    else {
      alert("Name already exists")
    }
  }

  getfilterPresets() {
    this.contractService.getUserFilterPresets()
      .subscribe(res => {
        console.log(res)
      });
  }

  setColumPreference() {

  }

}
