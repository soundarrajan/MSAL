import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { GridOptions } from 'ag-grid-community';
import { AGGridCellLinkRenderer } from '../../../core/ag-grid-renderers/ag-grid-cell-link-renderer.component';
import { AGGridMultiDataRendererComponent } from '../../../core/ag-grid-renderers/ag-grid-multi-data-renderer.component';
import { ContractNegotiationService } from '../../../services/contract-negotiation.service';
import { LocalService } from '../../../services/local-service.service';
import { FilterListComponent } from '../filter-components/filter-list/filter-list.component';

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
  public newPresetsDialog: MatDialogRef<any>;
  public presetActiveIndex = 0;

  @ViewChild('createPreset', { static: false })
  createPresetTemplate: TemplateRef<any>;

  @ViewChild('presetscom') presetComponent: FilterListComponent;

  public filterList = {
    filters: <any>[
      {
        name: 'Default',
        count: '-',
        defaultFilter: true,
        selected: true,
        pinned: true,
        position: 0
      }
    ],
    enableMoreFilters: true,
    multiSelect: false
  }

  public gridpageNavModel = {
    pageSizeOptions: [25, 50, 75],
    pageSize: 25,
    page: 1,
    totalItems: 0
  }

  public preferenceNameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
    Validators.pattern('^([?=_0-9a-zA-Z ]+)')
  ]);

  public defaultColFilterParams = {
    buttons: ['reset', 'apply'],
    precision: () => this.format.quantityPrecision
  };

  ngOnInit(): void {
    this.localService.setTheme(this.theme);
    this.loadPreference();
  }

  mainPage(id) {
    this.router.navigate([`contract-negotiation/requests/${id}`]);
  }

  constructor(public dialog: MatDialog, public router: Router, private localService: LocalService, private contractService: ContractNegotiationService, private format: TenantFormattingService, public matDialog: MatDialog, private chRef: ChangeDetectorRef) {
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
      onFilterChanged: (params) => {
        this.gridpageNavModel.page = 1;
        this.gridpageNavModel.totalItems = this.gridOptions.api.getDisplayedRowCount();
      },
      frameworkComponents: {
        cellLinkRenderer: AGGridCellLinkRenderer
      }
    }

  }

  private columnDef_aggrid = [
    {
      headerName: 'Request ID', headerTooltip: 'Request ID', field: 'id', width: 100, cellClass: ['aggridlink'], cellStyle: { 'padding-left': '15px' },
      cellRenderer: "cellLinkRenderer", cellRendererParams: { onClick: this.mainPage.bind(this) }
    },
    {
      headerName: 'Created Date', headerTooltip: 'Created Date', field: 'createdOn', width: 120, cellStyle: { 'padding-left': '15px' }, filter: 'agDateColumnFilter', valueFormatter: params => this.format.date(params.value), filterParams: { comparator: dateCompare }
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
      headerName: 'Start Date', headerTooltip: 'Start Date', field: 'startDate', width: 120, filter: 'agDateColumnFilter', valueFormatter: params => this.format.date(params.value), filterParams: { comparator: dateCompare }
    },
    {
      headerName: 'End Date', headerTooltip: 'End Date', field: 'endDate', width: 120, cellClass: ['thick-right-border'], filter: 'agDateColumnFilter', valueFormatter: params => this.format.date(params.value), filterParams: { comparator: dateCompare }
    },
    {
      headerName: 'Location', headerTooltip: 'Location', field: 'locations', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data border-left'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'locationName', type: 'chip-bg', cellClass: 'chip-rectangle' },
      valueGetter: function (params) {
        const locations = params.data.locations.map((el) => el.locationName);
        return locations.toString();
      },
    },
    {
      headerName: 'Product', headerTooltip: 'Product', field: 'productName', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data thick-right-border border-right'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'productName', type: 'chip-bg', cellClass: 'chip-rectangle' },
      valueGetter: function (params) {
        const products = params.data.locations.map((el) => el.products.map((p) => p.productName));
        return products.toString();
      },
    },
    {
      headerName: 'Offers', headerTooltip: 'Offers', field: 'offers', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'offers', type: 'text' },
      valueGetter: function (params) {
        const offers = params.data.locations.map((el) => el.products.map((p) => p.offers));
        return offers.toString();
      },
    },
    {
      headerName: 'Awaiting app.', headerTooltip: 'Awaiting app.', field: 'awaitingApproval', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'awaitingApproval', cellClass: 'chip-circle await' },
      valueGetter: function (params) {
        const awaitingApproval = params.data.locations.map((el) => el.products.map((p) => p.awaitingApproval));
        return awaitingApproval.toString();
      },
    },
    {
      headerName: 'Approved', headerTooltip: 'Approved', field: 'approved', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'approved', cellClass: 'chip-circle approve' },
      valueGetter: function (params) {
        const approved = params.data.locations.map((el) => el.products.map((p) => p.approved));
        return approved.toString();
      },
    },

    {
      headerName: 'Rejected', headerTooltip: 'Rejected', field: 'rejected', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'rejected', cellClass: 'chip-circle reject' },
      valueGetter: function (params) {
        const rejected = params.data.locations.map((el) => el.products.map((p) => p.rejected));
        return rejected.toString();
      },
    },
    {
      headerName: 'Contract Created', headerTooltip: 'Contract Created', field: 'contracted', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'contracted', cellClass: 'chip-circle create' },
      valueGetter: function (params) {
        const contracted = params.data.locations.map((el) => el.products.map((p) => p.contracted));
        return contracted.toString();
      },
    },

  ];

  getGridData() {
    this.contractService.getContractRequestList()
      .subscribe(res => {
        this.rowData_aggrid1 = res;
        this.gridOptions.api.setRowData(this.rowData_aggrid1);
        this.filterList.filters[0].count = this.gridOptions.api.getDisplayedRowCount();
        this.gridpageNavModel.totalItems = this.gridOptions.api.getDisplayedRowCount();
        this.filterList.filters.find(i => i.selected ? this.activeFilterPreset(i) : null);
        this.chRef.detectChanges();
      });
  }

  loadPreference() {
    //PreferenceCount is total records bz switched to client side model 
    // this.contractService.getPreferenceCount()
    //   .subscribe(response => {
    //     if (this.filterList.filters.length > 0) {
    //       this.filterList.filters[0].count = response['default'];
    //       this.chRef.detectChanges();
    //     }
    //   })

    this.contractService.getUserFilterPresets()
      .subscribe(res => {
        if (res && res.value) {
          this.filterList.filters = res.value;
          this.presetComponent.refreshData(this.filterList.filters);
          this.chRef.detectChanges();
        }
      })

    this.contractService.getColumnpreference()
      .subscribe(res => {
        if (res)
          this.gridOptions.columnApi.setColumnState(res);
      })
  }

  onResize(event) {
    this.gridOptions.api.sizeColumnsToFit();
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

  openSaveAsPresetDialog(): void {
    this.newPresetsDialog = this.matDialog.open(this.createPresetTemplate, {
      width: '400px',
      disableClose: false,
      closeOnNavigation: true
    });
  }

  createNewFilter() {
    const matches = this.filterList.filters.find(i => i.name.toLowerCase() == this.preferenceNameFormControl.value.toLowerCase());
    if (!matches) {
      const newFilter = {
        id: this.preferenceNameFormControl.value + Math.random(),
        name: this.preferenceNameFormControl.value,
        filterModels: { "contract-requestlist-filter-presets": this.gridOptions.api.getFilterModel() },
        pinned: true,
        selected: true
      }
      this.filterList.filters.map(i => i['selected'] = false);
      this.filterList.filters.push(newFilter);
      this.filterList.filters.map(i => i['count'] = null);
      this.presetComponent.refreshData(this.filterList.filters);
      this.chRef.detectChanges();
      this.contractService.updateUserFilterPresets(this.filterList.filters)
        .subscribe(res => {
          this.updateColumnPreference();
          this.newPresetsDialog.close();
        });
    }
    else {
      alert("Name already exists")
    }
  }

  updateFilter(evt?) {
    if (evt) {
      this.filterList.filters = evt;
      this.filterList.filters.find(i => i.selected ? this.activeFilterPreset(i) : null);
      if (this.filterList.filters) {
        this.contractService.updateUserFilterPresets(this.filterList.filters)
          .subscribe(res => {
            this.updateColumnPreference();
          });
      }
    }
    else if (this.filterList.filters) {
      this.filterList.filters.find(i => i.selected ?
        i['filterModels'] = { "contract-requestlist-filter-presets": this.gridOptions.api.getFilterModel() } : null);
      this.contractService.updateUserFilterPresets(this.filterList.filters)
        .subscribe(res => {
          this.updateColumnPreference();
        });
    }
  }

  activeFilterPreset(evt) {
    if (evt.filterModels) {
      this.gridOptions.api.setFilterModel(evt.filterModels['contract-requestlist-filter-presets']);
      evt.count = this.gridOptions.api.getDisplayedRowCount();
    }
    else
      this.gridOptions.api.setFilterModel(null)
  }

  updateColumnPreference() {
    const payload = {
      gridName: "contract-request-list-grid",
      columnState: this.gridOptions.columnApi.getColumnState(),
    }
    this.contractService.updateColumnpreference(payload)
      .subscribe(res => {
        if (res)
          this.gridOptions.columnApi.setColumnState(res);
      })
  }

  showfilterDesc() {
    document.querySelector<HTMLElement>("app-ag-filter-display").hidden = false;
  }

}

function dateCompare(filterLocalDateAtMidnight, cellValue) {
  const dateAsString = cellValue;

  if (dateAsString == null) {
    return 0;
  }

  const onlydateAsString = dateAsString.split("T")[0];
  const dateParts = onlydateAsString.split('-');
  const year = Number(dateParts[0]);
  const month = Number(dateParts[1]) - 1;
  const day = Number(dateParts[2]);
  const cellDate = new Date(year, month, day);
  if (cellDate < filterLocalDateAtMidnight) {
    return -1;
  } else if (cellDate > filterLocalDateAtMidnight) {
    return 1;
  }
  return 0;
}