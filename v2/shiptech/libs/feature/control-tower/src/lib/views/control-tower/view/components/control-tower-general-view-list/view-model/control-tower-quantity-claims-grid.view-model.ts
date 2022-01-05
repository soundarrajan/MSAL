import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { GridOptions, IServerSideGetRowsParams } from '@ag-grid-community/core';
import {
  ITypedColDef,
  RowModelType,
  RowSelection
} from '@shiptech/core/ui/components/ag-grid/type.definition';

import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { takeUntil } from 'rxjs/operators';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';

import { DatabaseManipulation } from '@shiptech/core/legacy-cache/database-manipulation.service';
import { IScheduleDashboardLabelConfigurationDto } from '@shiptech/core/lookups/schedule-dashboard-label-configuration.dto.interface';
import { AgAsyncBackgroundFillComponent } from '@shiptech/core/ui/components/ag-grid/ag-async-background-fill/ag-async-background-fill.component';

import { ModuleLoggerFactory } from 'libs/feature/control-tower/src/lib/core/logging/module-logger-factory';
import { ModuleError } from 'libs/feature/control-tower/src/lib/core/error-handling/module-error';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-actions.component';

import { ControlTowerService } from 'libs/feature/control-tower/src/lib/services/control-tower.service';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { IControlTowerQuantityClaimsItemDto } from 'libs/feature/control-tower/src/lib/services/api/dto/control-tower-list-item.dto';
import {
  ControlTowerQuantityClaimsListColumns,
  ControlTowerQuantityClaimsListColumnServerKeys,
  ControlTowerQuantityClaimsListColumnsLabels,
  ControlTowerQuantityClaimsListExportColumns
} from '../list-columns/control-tower-quantity-claims-list.columns';
import { AGGridCellRendererStatusComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-status/ag-grid-cell-status.component';

function model(
  prop: keyof IControlTowerQuantityClaimsItemDto
): keyof IControlTowerQuantityClaimsItemDto {
  return prop;
}

@Injectable()
export class ControlTowerQuantityClaimsListGridViewModel extends BaseGridViewModel {
  public noOf15: number;
  public noOf714: number;
  public noOfNew: number;
  public noOfDefault: number;

  public exportUrl: string;

  public fromDate = new FormControl(
    moment()
      .subtract(6, 'months')
      .format('YYYY-MM-DD')
  );
  public toDate = new FormControl(moment().format('YYYY-MM-DD'));

  public toggleNewFilter: boolean = true;
  public toggle714DaysFilter: boolean = true;
  public toggleGreaterThan15DaysFilter: boolean = true;

  public loadingFailed: boolean = false;

  public defaultColFilterParams = {
    resetButton: true,
    applyButton: true,
    precision: () => this.format.quantityPrecision
  };
  gridOptions: GridOptions = {
    enableColResize: true,
    suppressRowClickSelection: true,
    animateRows: true,
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 35,

    rowModelType: RowModelType.ServerSide,
    pagination: true,

    rowSelection: RowSelection.Single,
    suppressContextMenu: true,

    multiSortKey: 'ctrl',

    singleClickEdit: true,
    getRowNodeId: (data: IControlTowerQuantityClaimsItemDto) =>
      data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  orderNoCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, ILookupDto> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.order,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.order,
    colId: ControlTowerQuantityClaimsListColumns.order,
    field: model('order'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.order,
    cellRenderer: params => {
      if (params.value) {
        const a = document.createElement('a');
        a.innerHTML = params.value?.id;
        a.href = `/#/edit-order/${params.value?.id}`;
        a.setAttribute('target', '_blank');
        return a;
      }
      return null;
    },
    cellClass: ['aggridlink'],
    tooltip: params => (params.value ? params.value?.id : ''),
    width: 150
  };

  labIdCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, ILookupDto> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.lab,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.lab,
    colId: ControlTowerQuantityClaimsListColumns.lab,
    field: model('lab'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.lab,
    cellRenderer: params => {
      if (params.value) {
        const a = document.createElement('a');
        a.innerHTML = params.value?.id;
        a.href = `/#/labs/labresult/edit/${params.value?.id}`;
        a.setAttribute('target', '_blank');
        return a;
      }
      return null;
    },
    cellClass: ['aggridlink'],
    tooltip: params => (params.value ? params.value?.id : ''),
    width: 150
  };

  claimNoCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, ILookupDto> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.id,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.id,
    colId: ControlTowerQuantityClaimsListColumns.id,
    field: model('id'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.id,
    cellRenderer: params => {
      if (params.value) {
        const a = document.createElement('a');
        a.innerHTML = params.value;
        a.href = `/#/claims/claim/edit/${params.value}`;
        a.setAttribute('target', '_blank');
        return a;
      }
      return null;
    },
    cellClass: ['aggridlink'],
    tooltip: params => (params.value ? params.value : ''),
    width: 150
  };

  portCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, string> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.port,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.port,
    colId: ControlTowerQuantityClaimsListColumns.port,
    field: model('port'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.port,
    tooltip: params => (params.value ? params.value : ''),
    width: 200
  };

  vesselCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, string> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.vessel,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.vessel,
    colId: ControlTowerQuantityClaimsListColumns.vessel,
    field: model('vessel'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.vessel,
    tooltip: params => (params.value ? params.value : ''),
    width: 200
  };

  etaCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, string> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.eta,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.eta,
    colId: ControlTowerQuantityClaimsListColumns.eta,
    field: model('eta'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.eta,
    tooltip: params => (params.value ? this.format.date(params.value) : ''),
    width: 200
  };

  productCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, string> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.product,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.product,
    colId: ControlTowerQuantityClaimsListColumns.product,
    field: model('product'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.product,
    tooltip: params => (params.value ? params.value : ''),
    width: 200
  };

  sellerCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, string> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.seller,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.seller,
    colId: ControlTowerQuantityClaimsListColumns.seller,
    field: model('seller'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.seller,
    tooltip: params => (params.value ? params.value : ''),
    width: 200
  };

  quantityShortageCol: ITypedColDef<
    IControlTowerQuantityClaimsItemDto,
    number
  > = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.quantityShortage,
    headerClass: ['aggrid-text-align-right'],
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.quantityShortage,
    colId: ControlTowerQuantityClaimsListColumns.quantityShortage,
    field: model('quantityShortage'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.quantityShortage,
    tooltip: params => (params.value ? this.format.quantity(params.value) : ''),
    width: 150
  };

  quantityUomCol: ITypedColDef<
    IControlTowerQuantityClaimsItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.quantityUom,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.quantityUom,
    colId: ControlTowerQuantityClaimsListColumns.quantityUom,
    field: model('quantityUom'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.quantityUom,
    valueFormatter: params => params.value?.name,
    tooltip: params => (params.value ? params.value?.name : ''),
    width: 150
  };

  estimatedSettlementAmountCol: ITypedColDef<
    IControlTowerQuantityClaimsItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityClaimsListColumnsLabels.estimatedSettlementAmount,
    headerClass: ['aggrid-text-align-right'],
    headerTooltip:
      ControlTowerQuantityClaimsListColumnsLabels.estimatedSettlementAmount,
    colId: ControlTowerQuantityClaimsListColumns.estimatedSettlementAmount,
    field: model('estimatedSettlementAmount'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.amount(params.value),
    dtoForExport:
      ControlTowerQuantityClaimsListExportColumns.estimatedSettlementAmount,
    tooltip: params => (params.value ? this.format.amount(params.value) : ''),
    width: 150
  };

  orderPriceCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, number> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.orderPrice,
    headerClass: ['aggrid-text-align-right'],
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.orderPrice,
    colId: ControlTowerQuantityClaimsListColumns.orderPrice,
    field: model('orderPrice'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.price(params.value),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.orderPrice,
    tooltip: params => (params.value ? this.format.price(params.value) : ''),
    width: 150
  };

  currencyCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, ILookupDto> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.currency,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.currency,
    colId: ControlTowerQuantityClaimsListColumns.currency,
    field: model('currency'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.currency,
    valueFormatter: params => params.value?.name,
    tooltip: params => (params.value ? params.value?.name : ''),
    width: 150
  };

  createdDateCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, string> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.createdDate,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.createdDate,
    colId: ControlTowerQuantityClaimsListColumns.createdDate,
    field: model('createdDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.dateUtc(params.value),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.createdDate,
    tooltip: params => (params.value ? this.format.dateUtc(params.value) : ''),
    width: 200
  };

  createdByCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, ILookupDto> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.createdBy,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.createdBy,
    colId: ControlTowerQuantityClaimsListColumns.createdBy,
    field: model('createdBy'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.createdBy,
    valueFormatter: params => params.value?.name,
    tooltip: params => (params.value ? params.value?.name : ''),
    width: 200
  };

  noResponseCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, number> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.noResponse,
    headerClass: ['aggrid-text-align-c'],
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.noResponse,
    colId: ControlTowerQuantityClaimsListColumns.noResponse,
    field: model('noResponse'),
    filter: 'agNumberColumnFilter',
    valueFormatter: function(params) {
      if (params.value < 7) {
        return 'New';
      } else if (params.value >= 7 && params.value <= 14) {
        return '7-14 Days';
      } else if (params.value > 14) {
        return '15+ Days';
      }
    },
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.noResponse,
    cellRendererParams: function(params) {
      var classArray: string[] = [];
      let newClass = '';
      if (params.value < 7) {
        newClass = 'medium-blue';
      } else if (params.value >= 7 && params.value <= 14) {
        newClass = 'medium-yellow';
      } else if (params.value > 14) {
        newClass = 'medium-red';
      }
      classArray.push(newClass);
      return {
        cellClass: classArray.length > 0 ? classArray : null,
        type: 'no-response'
      };
    },
    cellRendererFramework: AGGridCellRendererStatusComponent,
    tooltip: params => {
      if (params.value < 7) {
        return 'New';
      } else if (params.value >= 7 && params.value <= 14) {
        return '7-14 Days';
      } else if (params.value > 14) {
        return '15+ Days';
      }
    },
    width: 150
  };
  groupedCounts: {
    noOfNew: number;
    noOf15: number;
    noOf714: number;
    noOfDefault: number;
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private format: TenantFormattingService,
    private controlTowerService: ControlTowerService,
    private appErrorHandler: AppErrorHandler,
    private databaseManipulation: DatabaseManipulation
  ) {
    super(
      'control-tower-quantity-claims-list-grid-10',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(
        ControlTowerQuantityClaimsListGridViewModel.name
      )
    );
    this.init(this.gridOptions, true);
  }

  public systemFilterUpdate(value) {
    let currentFilter = value.filter(o => o.isActive);
    switch (currentFilter[0].id) {
      case 'new':
        this.filterGridNew(currentFilter[0].label);
        break;
      case 'marked-as-seen':
        this.filterGrid714Days(currentFilter[0].label);
        break;
      case 'resolved':
        this.filterGridGreaterThan15Days(currentFilter[0].label);
        break;
    }
  }

  getColumnsDefs(): any[] {
    return [
      this.orderNoCol,
      this.labIdCol,
      this.claimNoCol,
      this.portCol,
      this.vesselCol,
      this.etaCol,
      this.productCol,
      this.sellerCol,
      this.quantityShortageCol,
      this.quantityUomCol,
      this.estimatedSettlementAmountCol,
      this.orderPriceCol,
      this.currencyCol,
      this.createdDateCol,
      this.createdByCol,
      this.noResponseCol
    ];
  }

  public filterGridNew(statusName: string): void {
    if (this.toggleNewFilter) {
      this.filterByStatus(statusName);
    } else {
      this.filterByStatus('');
    }
  }

  public filterGrid714Days(statusName: string): void {
    if (this.toggle714DaysFilter) {
      this.filterByStatus(statusName);
    } else {
      this.filterByStatus('');
    }
  }

  public filterGridGreaterThan15Days(statusName: string): void {
    if (this.toggleGreaterThan15DaysFilter) {
      this.filterByStatus(statusName);
    } else {
      this.filterByStatus('');
    }
  }

  public filterByStatus(statusName: string): void {
    const grid = [];
    if (statusName == 'New') {
      grid['noResponse'] = {
        filterType: 'number',
        type: 'lessThan',
        filter: 7,
        filterTo: null
      };
    } else if (statusName == '7-14 Days') {
      grid['noResponse'] = {
        filterType: 'number',
        type: 'inRange',
        filter: 7,
        filterTo: 14
      };
    } else if (statusName == '15+ Days') {
      grid['noResponse'] = {
        filterType: 'number',
        type: 'greaterThan',
        filter: 15,
        filterTo: null
      };
    } else {
      grid['noResponse'] = null;
    }
    this.gridApi.setFilterModel(grid);
  }

  public checkStatusAvailable(): void {
    this.toggleNewFilter = true;
    this.toggle714DaysFilter = true;
    this.toggleGreaterThan15DaysFilter = true;
    const grid = this.gridApi.getFilterModel();
    for (let [key, value] of Object.entries(grid)) {
      if (key == 'noResponse') {
        if ((<any>value).type == 'lessThan') {
          if ((<any>value).filter === 7) {
            this.toggleNewFilter = !this.toggleNewFilter;
            this.toggle714DaysFilter = true;
            this.toggleGreaterThan15DaysFilter = true;
          }
        } else if ((<any>value).type == 'inRange') {
          if ((<any>value).filter === 7 && (<any>value).filterTo === 14) {
            this.toggle714DaysFilter = !this.toggle714DaysFilter;
            this.toggleNewFilter = true;
            this.toggleGreaterThan15DaysFilter = true;
          }
        } else if ((<any>value).type == 'greaterThan') {
          if ((<any>value).filter === 15) {
            this.toggleGreaterThan15DaysFilter = !this
              .toggleGreaterThan15DaysFilter;
            this.toggleNewFilter = true;
            this.toggle714DaysFilter = true;
          }
        }
      }
    }
  }

  public checkFromAndToAvailable(): void {
    const grid = this.gridApi.getFilterModel();
    for (let [key, value] of Object.entries(grid)) {
      if (key == 'createdDate') {
        if ((<any>value).type == 'inRange') {
          this.fromDate.setValue((<any>value).dateFrom);
          this.toDate.setValue((<any>value).dateTo);
        }
      }
    }
  }

  public filterByDate(from: string, to: string): void {
    const grid = this.gridApi.getFilterModel();
    grid['createdDate'] = {
      dateFrom: from,
      dateTo: to,
      type: 'inRange',
      filterType: 'date'
    };
    this.gridApi.setFilterModel(grid);
  }

  public getFiltersCount() {
    if (this.groupedCounts) {
      return false;
    }
    let payload = {
      startDate: moment()
        .subtract(6, 'months')
        .format('YYYY-MM-DD'),
      endDate: `${moment().format('YYYY-MM-DD')}T23:59:59`
    };
    this.controlTowerService
      .getQuantityClaimCounts(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => {
          this.noOfDefault = response.noOfLastSixMonths;
          this.noOf15 = response.noOf15;
          this.noOf714 = response.noOf714;
          this.noOfNew = response.noOfNew;
          this.groupedCounts = {
            noOfDefault: this.noOfDefault,
            noOfNew: this.noOfNew,
            noOf15: this.noOf15,
            noOf714: this.noOf714
          };
          this.changeDetector.detectChanges();
        },
        () => {
          this.appErrorHandler.handleError(
            ModuleError.LoadControlTowerQuantityClaimsCountFailed
          );
        }
      );
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.getFiltersCount();
    this.checkStatusAvailable();
    this.checkFromAndToAvailable();
    this.paramsServerSide = params;
    this.exportUrl = this.controlTowerService.getControlTowerQuantityClaimsListExportUrl();
    this.controlTowerService
      .getControlTowerQuantityClaimsList$(
        transformLocalToServeGridInfo(
          this.gridApi,
          params,
          ControlTowerQuantityClaimsListColumnServerKeys,
          this.searchText
        )
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => {
          params.successCallback(response.payload, response.matchedCount);
        },
        () => {
          this.loadingFailed = true;
          this.appErrorHandler.handleError(
            ModuleError.LoadControlTowerQuantityClaimsFailed
          );
          params.failCallback();
        }
      );
  }
}
