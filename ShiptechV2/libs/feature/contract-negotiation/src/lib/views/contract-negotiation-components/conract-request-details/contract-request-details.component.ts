import { I } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { EmptyFilterName, ToastPosition } from '@shiptech/core/ui/components/filter-preferences/filter-preferences-messages';
import { GridOptions, ITextFilterParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
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
  public showFilterDescSwitch = true;
  public displayFilterDesc = false;
  public currentSelectedFilter;

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
    Validators.pattern('^([?=_0-9a-zA-Z ]+)'),
    Validators.pattern(/^\S*$/)
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

  constructor(public dialog: MatDialog, public router: Router, private localService: LocalService, private contractService: ContractNegotiationService,
    private format: TenantFormattingService, public matDialog: MatDialog, private chRef: ChangeDetectorRef, private toastr: ToastrService) {
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
      animateRows: false,
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
        this.chRef.detectChanges();
        this.gridOptions.api.redrawRows();
        // this.gridOptions.api.resetRowHeights();
        this.gridpageNavModel.page = 1;
        this.gridpageNavModel.totalItems = this.gridOptions.api.getDisplayedRowCount();
        if (this.gridOptions.api.getDisplayedRowCount() === 0) {
          this.gridOptions.api.showNoRowsOverlay();
        } else {
          this.gridOptions.api.hideOverlay();
        }
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
      headerName: 'Request date', headerTooltip: 'Created Date', field: 'createdOn', width: 160, cellStyle: { 'padding-left': '15px' }, filter: 'agDateColumnFilter', valueFormatter: params => this.format.showUtcToLocalDate(params.value), filterParams: { comparator: dateCompare }
    },
    {
      headerName: 'Status', headerTooltip: 'Status', field: 'status', width: 90,
      cellRenderer: function (params) {
        return `<div class="status-circle"><span class="circle ` + params.value + `"></span>` + params.value + `</div>`;
      }
    },
    {
      headerName: 'Buyer', headerTooltip: 'Buyer', field: 'buyer', width: 120,
    },
    {
      headerName: 'Start Date', headerTooltip: 'Start Date', field: 'startDate', width: 160, filter: 'agDateColumnFilter', valueFormatter: params => this.format.showUtcToLocalDateOnly(params.value), filterParams: { comparator: dateCompare }
    },
    {
      headerName: 'End Date', headerTooltip: 'End Date', field: 'endDate', width: 160, cellClass: ['thick-right-border'], filter: 'agDateColumnFilter', valueFormatter: params => this.format.showUtcToLocalDateOnly(params.value), filterParams: { comparator: dateCompare }
    },
    {
      headerName: 'Location', headerTooltip: 'Location', field: 'locations', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data border-left'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      autoHeight: true,
      cellRendererParams: { label: 'locationName', type: 'chip-bg', cellClass: 'chip-rectangle' },
      valueGetter: function (params) {
        const locations = params.data.locations.map((el) => el.locationName);
        let product_sText = params.api.getFilterInstance('productName').getModel()?.filter;
        let product_fType = params.api.getFilterInstance('productName').getModel()?.type;
        if (product_sText && product_fType == 'contains') {
          let pro_filtered_location = [];
          pro_filtered_location = params.data['locations'].map((element) => {
            return { ...element, products: element.products.filter((subElement) => subElement.productName.toUpperCase().indexOf(product_sText.toUpperCase()) != -1) }
          })
          let pro_filtered = pro_filtered_location.filter(element => element.products.length > 0);
          return pro_filtered.map((el) => el.locationName).toString();
        }
        return locations.toString();
      },
      suppressCellFlash: true
    },
    {
      headerName: 'Product', headerTooltip: 'Product', field: 'productName', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data thick-right-border border-right'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      autoHeight: true,
      cellRendererParams: { label: 'productName', type: 'chip-bg', cellClass: 'chip-rectangle' },
      valueGetter: function (params) {
        const products = params.data.locations.map((el) => el.products.map((p) => p.productName));
        return products.toString();
      },
    },
    {
      headerName: 'Offers', headerTooltip: 'Offers', field: 'offers', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 90,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'offers', type: 'text' }, sortable: false, menuTabs: ['generalMenuTab', 'columnsMenuTab'],
      valueGetter: function (params) {
        const offers = params.data.locations.map((el) => el.products.map((p) => p.offers));
        return offers.toString();
      },
    },
    {
      headerName: 'Awaiting app.', headerTooltip: 'Awaiting app.', field: 'awaitingApproval', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 100,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'awaitingApproval', cellClass: 'chip-circle await' }, sortable: false, menuTabs: ['generalMenuTab', 'columnsMenuTab'],
      valueGetter: function (params) {
        const awaitingApproval = params.data.locations.map((el) => el.products.map((p) => p.awaitingApproval));
        return awaitingApproval.toString();
      },
    },
    {
      headerName: 'Approved', headerTooltip: 'Approved', field: 'approved', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 100,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'approved', cellClass: 'chip-circle approve' }, sortable: false, menuTabs: ['generalMenuTab', 'columnsMenuTab'],
      valueGetter: function (params) {
        const approved = params.data.locations.map((el) => el.products.map((p) => p.approved));
        return approved.toString();
      },
    },

    {
      headerName: 'Rejected', headerTooltip: 'Rejected', field: 'rejected', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 100,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'rejected', cellClass: 'chip-circle reject' }, sortable: false, menuTabs: ['generalMenuTab', 'columnsMenuTab'],
      valueGetter: function (params) {
        const rejected = params.data.locations.map((el) => el.products.map((p) => p.rejected));
        return rejected.toString();
      },
    },
    {
      headerName: 'Contract Created', headerTooltip: 'Contract Created', field: 'contracted', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 100,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'contracted', cellClass: 'chip-circle create' }, sortable: false, menuTabs: ['generalMenuTab', 'columnsMenuTab'],
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
        this.filterList.filters.find(i => i.selected ? this.activeFilterPreset(i) : null);//default selected filter
        let found = this.filterList.filters.find(element => element.selected);
        if (found == undefined && this.filterList.filters.length > 0) {
          this.filterList.filters[0].selected = true;
          this.activeFilterPreset(this.filterList.filters[0]);
        }
        const sort = [{ colId: "id", sort: "desc" }];// default sort id
        this.gridOptions.api.setSortModel(sort);
        this.chRef.detectChanges();
      });
  }

  loadPreference() {
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
          this.gridOptions.columnApi.setColumnState(res.value.columnState);
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
    this.preferenceNameFormControl.setErrors({ "duplicate": null });
    this.newPresetsDialog = this.matDialog.open(this.createPresetTemplate, {
      width: '400px',
      disableClose: false,
      closeOnNavigation: true
    });
  }

  createNewFilter() {
    if (this.preferenceNameFormControl.value.trim() != "") {
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
        this.contractService.updateUserFilterPresets(this.filterList.filters)
          .subscribe(res => {
            this.toastr.success(`Grid Preference - '${newFilter.name}' has been saved successfully`);
            this.newPresetsDialog.close();
            this.chRef.detectChanges();
            this.preferenceNameFormControl.setValue("");
            this.preferenceNameFormControl.markAsUntouched();
          });
      }
      else {
        this.preferenceNameFormControl.setErrors({ "duplicate": "name already exists" });
      }
    }
    else {
      this.toastr.info(EmptyFilterName, '', ToastPosition);
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
      this.filterList.filters.find(i => i.selected && !i.defaultFilter ?
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
      // evt.count = this.gridOptions.api.getDisplayedRowCount();
      this.gridpageNavModel.totalItems = this.gridOptions.api.getDisplayedRowCount();
    }
    else
      this.gridOptions.api.setFilterModel(null);

    this.currentSelectedFilter = evt;
    if ((evt.defaultFilter && evt.name == 'Default') || !evt.filterModels || Object.keys(evt.filterModels['contract-requestlist-filter-presets']).length === 0) {
      document.querySelector<HTMLElement>("app-ag-filter-display").hidden = true;
      this.displayFilterDesc = false;
    }
    else if (this.showFilterDescSwitch && evt.filterModels)
      this.showFilterDesc();

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
        this.toastr.success("Preference was succesfully updated");
      })
  }

  showFilterDesc() {
    this.showFilterDescSwitch = true;
    if (this.currentSelectedFilter['name'] != 'Default') {
      document.querySelector<HTMLElement>("app-ag-filter-display").hidden = false;
      this.displayFilterDesc = true;
    }
  }

  exportData(evt) {
    if (evt == 'excel')
      this.gridOptions.api.exportDataAsExcel({ fileName: 'contract-negotiation' })
    else
      this.print()
  }

  print(): void {
    const eGridDiv = document.querySelector<HTMLElement>('ag-grid-angular')! as any;
    eGridDiv.style.width = '';
    eGridDiv.style.height = '';
    this.gridOptions.api.setDomLayout('print');
    setTimeout(() => {
      window.print();
      document.querySelector<HTMLElement>('ag-grid-angular').style.height =
        'calc( 100vh - 220px )';
      this.gridOptions.api.setDomLayout(null);
    }, 1000);
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