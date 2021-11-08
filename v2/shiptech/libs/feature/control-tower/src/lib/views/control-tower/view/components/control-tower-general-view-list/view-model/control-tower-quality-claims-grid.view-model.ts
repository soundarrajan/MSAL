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
import { IControlTowerQualityClaimsItemDto } from 'libs/feature/control-tower/src/lib/services/api/dto/control-tower-list-item.dto';
import {
    ControlTowerQualityClaimsListColumns,
    ControlTowerQualityClaimsListColumnsLabels,
    ControlTowerQualityClaimsListColumnServerKeys,
    ControlTowerQualityClaimsListExportColumns
} from '../list-columns/control-tower-quality-claims-list.columns';
import { AGGridCellRendererStatusComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-status/ag-grid-cell-status.component';

function model(
  prop: keyof IControlTowerQualityClaimsItemDto
): keyof IControlTowerQualityClaimsItemDto {
  return prop;
}

@Injectable()
export class ControlTowerQualityClaimsListGridViewModel extends BaseGridViewModel {
  public noOf15: number;
  public noOf714: number;
  public noOfNew: number;

  public searchText: string;
  public exportUrl: string;
  public newFilterSelected: boolean = false;
  public fromDate = new FormControl(
    moment()
      .subtract(7, 'months')
      .format('YYYY-MM-DD')
  );
  public toDate = new FormControl(moment().format('YYYY-MM-DD'));

  public toggleNewFilter: boolean = true;
  public toggle714DaysFilter: boolean = true;
  public toggleGreaterThan15DaysFilter: boolean = true;

  public defaultColFilterParams = {
    resetButton: true,
    applyButton: true,
    precision: () => this.format.quantityPrecision
  };
  gridOptions: GridOptions = {
    enableColResize: true,
    suppressRowClickSelection: true,
    // suppressCellSelection: true,
    animateRows: true,
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 40,

    rowModelType: RowModelType.ServerSide,
    pagination: true,

    rowSelection: RowSelection.Single,
    suppressContextMenu: true,

    multiSortKey: 'ctrl',

    //enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: IControlTowerQualityClaimsItemDto) =>
      data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    },
    onGridReady: params => {
      params.api.sizeColumnsToFit();
    }
  };

  orderNoCol: ITypedColDef<IControlTowerQualityClaimsItemDto, ILookupDto> = {
    headerName: ControlTowerQualityClaimsListColumnsLabels.order,
    headerTooltip: ControlTowerQualityClaimsListColumnsLabels.order,
    colId: ControlTowerQualityClaimsListColumns.order,
    field: model('order'),
    dtoForExport: ControlTowerQualityClaimsListExportColumns.order,
    cellRendererFramework: AgCellTemplateComponent,
    width: 150
  };

  labIdCol: ITypedColDef<IControlTowerQualityClaimsItemDto, ILookupDto> = {
    headerName: ControlTowerQualityClaimsListColumnsLabels.lab,
    headerTooltip: ControlTowerQualityClaimsListColumnsLabels.lab,
    colId: ControlTowerQualityClaimsListColumns.lab,
    field: model('lab'),
    dtoForExport: ControlTowerQualityClaimsListExportColumns.lab,
    cellRendererFramework: AgCellTemplateComponent,
    width: 150
  };

  claimNoCol: ITypedColDef<IControlTowerQualityClaimsItemDto, ILookupDto> = {
    headerName: ControlTowerQualityClaimsListColumnsLabels.id,
    headerTooltip: ControlTowerQualityClaimsListColumnsLabels.id,
    colId: ControlTowerQualityClaimsListColumns.id,
    field: model('id'),
    dtoForExport: ControlTowerQualityClaimsListExportColumns.id,
    cellRendererFramework: AgCellTemplateComponent,
    width: 150
  };

  portCol: ITypedColDef<IControlTowerQualityClaimsItemDto, string> = {
    headerName: ControlTowerQualityClaimsListColumnsLabels.port,
    headerTooltip: ControlTowerQualityClaimsListColumnsLabels.port,
    colId: ControlTowerQualityClaimsListColumns.port,
    field: model('port'),
    dtoForExport: ControlTowerQualityClaimsListExportColumns.port,
    width: 200
  };

  vesselCol: ITypedColDef<IControlTowerQualityClaimsItemDto, string> = {
    headerName: ControlTowerQualityClaimsListColumnsLabels.vessel,
    headerTooltip: ControlTowerQualityClaimsListColumnsLabels.vessel,
    colId: ControlTowerQualityClaimsListColumns.vessel,
    field: model('vessel'),
    dtoForExport: ControlTowerQualityClaimsListExportColumns.vessel,
    width: 200
  };

  etaCol: ITypedColDef<IControlTowerQualityClaimsItemDto, string> = {
    headerName: ControlTowerQualityClaimsListColumnsLabels.eta,
    headerTooltip: ControlTowerQualityClaimsListColumnsLabels.eta,
    colId: ControlTowerQualityClaimsListColumns.eta,
    field: model('eta'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.dateUtc(params.value),
    dtoForExport: ControlTowerQualityClaimsListExportColumns.eta,
    width: 200
  };

  productCol: ITypedColDef<IControlTowerQualityClaimsItemDto, string> = {
    headerName: ControlTowerQualityClaimsListColumnsLabels.product,
    headerTooltip: ControlTowerQualityClaimsListColumnsLabels.product,
    colId: ControlTowerQualityClaimsListColumns.product,
    field: model('product'),
    dtoForExport: ControlTowerQualityClaimsListExportColumns.product,
    width: 200
  };

  sellerCol: ITypedColDef<IControlTowerQualityClaimsItemDto, string> = {
    headerName: ControlTowerQualityClaimsListColumnsLabels.seller,
    headerTooltip: ControlTowerQualityClaimsListColumnsLabels.seller,
    colId: ControlTowerQualityClaimsListColumns.seller,
    field: model('seller'),
    dtoForExport: ControlTowerQualityClaimsListExportColumns.seller,
    width: 200
  };

  claimSubTypeCol: ITypedColDef<
    IControlTowerQualityClaimsItemDto,
    number
  > = {
    headerName: ControlTowerQualityClaimsListColumnsLabels.claimSubType,
    headerTooltip: ControlTowerQualityClaimsListColumnsLabels.claimSubType,
    colId: ControlTowerQualityClaimsListColumns.claimSubType,
    field: model('claimSubType'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    dtoForExport: ControlTowerQualityClaimsListExportColumns.claimSubType,
    width: 150
  };

  estimatedSettlementAmountCol: ITypedColDef<
    IControlTowerQualityClaimsItemDto,
    number
  > = {
    headerName:
      ControlTowerQualityClaimsListColumnsLabels.estimatedSettlementAmount,
    headerTooltip:
      ControlTowerQualityClaimsListColumnsLabels.estimatedSettlementAmount,
    colId: ControlTowerQualityClaimsListColumns.estimatedSettlementAmount,
    field: model('estimatedSettlementAmount'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.amount(params.value),
    dtoForExport:
      ControlTowerQualityClaimsListExportColumns.estimatedSettlementAmount,
    width: 150
  };

  createdDateCol: ITypedColDef<IControlTowerQualityClaimsItemDto, string> = {
    headerName: ControlTowerQualityClaimsListColumnsLabels.createdDate,
    headerTooltip: ControlTowerQualityClaimsListColumnsLabels.createdDate,
    colId: ControlTowerQualityClaimsListColumns.createdDate,
    field: model('createdDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    dtoForExport: ControlTowerQualityClaimsListExportColumns.createdDate,
    width: 200
  };

  createdByCol: ITypedColDef<IControlTowerQualityClaimsItemDto, ILookupDto> = {
    headerName: ControlTowerQualityClaimsListColumnsLabels.createdBy,
    headerTooltip: ControlTowerQualityClaimsListColumnsLabels.createdBy,
    colId: ControlTowerQualityClaimsListColumns.createdBy,
    field: model('createdBy'),
    dtoForExport: ControlTowerQualityClaimsListExportColumns.createdBy,
    valueFormatter: params => params.value?.name,
    width: 200
  };

  noResponseCol: ITypedColDef<IControlTowerQualityClaimsItemDto, number> = {
    headerName: ControlTowerQualityClaimsListColumnsLabels.noResponse,
    headerTooltip: ControlTowerQualityClaimsListColumnsLabels.noResponse,
    colId: ControlTowerQualityClaimsListColumns.noResponse,
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
    dtoForExport: ControlTowerQualityClaimsListExportColumns.noResponse,
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
    width: 150
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
      'control-tower-quality-claims-list-grid-7',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(
        ControlTowerQualityClaimsListGridViewModel.name
      )
    );
    this.init(this.gridOptions, true);
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
      this.claimSubTypeCol,
      this.estimatedSettlementAmountCol,
      this.createdDateCol,
      this.createdByCol,
      this.noResponseCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
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
    const grid = this.gridApi.getFilterModel();
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
      if (key == 'status') {
        if ((<any>value).type == 'equals') {
          if ((<any>value).filter.toLowerCase() === 'new') {
            this.toggleNewFilter = !this.toggleNewFilter;
            this.toggle714DaysFilter = true;
            this.toggleGreaterThan15DaysFilter = true;
          } else if ((<any>value).filter.toLowerCase() === 'verified') {
            this.toggle714DaysFilter = !this.toggle714DaysFilter;
            this.toggleNewFilter = true;
            this.toggleGreaterThan15DaysFilter = true;
          } else if ((<any>value).filter.toLowerCase() === 'in spec') {
            this.toggleGreaterThan15DaysFilter = !this
              .toggleGreaterThan15DaysFilter;
            this.toggleNewFilter = true;
            this.toggle714DaysFilter = true;
          }
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

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    const grid1 = this.gridApi.getSortModel();
    // this.gridApi.setSortModel([
    //   {
    //     colId: 'createdDate',
    //     sort: 'asc'
    //   }
    // ]);
    console.log(grid1);
    this.checkStatusAvailable();
    this.paramsServerSide = params;
    this.exportUrl = this.controlTowerService.getControlTowerQuantityClaimsListExportUrl();
    this.controlTowerService
      .getControlTowerQualityClaimsList$(
        transformLocalToServeGridInfo(
          this.gridApi,
          params,
          ControlTowerQualityClaimsListColumnServerKeys,
          this.searchText
        )
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => {
          this.noOf15 = response.payload.noOf15;
          this.noOf714 = response.payload.noOf714;
          this.noOfNew = response.payload.noOfNew;
          params.successCallback(response.payload.items, response.matchedCount);
        },
        () => {
          this.appErrorHandler.handleError(
            ModuleError.LoadControlTowerQuantityClaimsFailed
          );
          params.failCallback();
        }
      );
  }
}
