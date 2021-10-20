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
import { AGGridCellRendererAsyncStatusComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-async-status/ag-grid-cell-async-status.component';
import {
  ControlTowerQuantityRobDifferenceListColumns,
  ControlTowerQuantityRobDifferenceListColumnServerKeys,
  ControlTowerQuantityRobDifferenceListColumnsLabels,
  ControlTowerQuantityRobDifferenceListExportColumns
} from './control-tower-quantity-rob-difference-list.columns';
import { ControlTowerService } from 'libs/feature/control-tower/src/lib/services/control-tower.service';
import { IControlTowerQuantityRobDifferenceItemDto } from 'libs/feature/control-tower/src/lib/services/api/dto/control-tower-list-item.dto';
import { FormControl } from '@angular/forms';
import moment from 'moment';

function model(
  prop: keyof IControlTowerQuantityRobDifferenceItemDto
): keyof IControlTowerQuantityRobDifferenceItemDto {
  return prop;
}

@Injectable()
export class ControlTowerQuantityRobDifferenceListGridViewModel extends BaseGridViewModel {
  public searchText: string;
  public exportUrl: string;
  public numberOfNewProgress: number;
  public newFilterSelected: boolean = false;
  public fromDate = new FormControl(
    moment()
      .subtract(7, 'months')
      .format('YYYY-MM-DD')
  );
  public toDate = new FormControl(moment().format('YYYY-MM-DD'));

  public toggleNewFilter: boolean = true;
  public toggleMASFilter: boolean = true;
  public toggleResolvedFilter: boolean = true;

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
    getRowNodeId: (data: IControlTowerQuantityRobDifferenceItemDto) =>
      data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  portCallCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.order,
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.order,
    colId: ControlTowerQuantityRobDifferenceListColumns.order,
    field: model('order'),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.order,
    cellRendererFramework: AgCellTemplateComponent,
    width: 200
  };

  portCol: ITypedColDef<IControlTowerQuantityRobDifferenceItemDto, string> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.port,
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.port,
    colId: ControlTowerQuantityRobDifferenceListColumns.port,
    field: model('port'),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.port,
    width: 150
  };

  vesselCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.vessel,
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.vessel,
    colId: ControlTowerQuantityRobDifferenceListColumns.vessel,
    field: model('vessel'),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.vessel,
    valueFormatter: params => params.value?.name,
    width: 150
  };

  etaCol: ITypedColDef<IControlTowerQuantityRobDifferenceItemDto, string> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.deliveryDate,
    headerTooltip:
      ControlTowerQuantityRobDifferenceListColumnsLabels.deliveryDate,
    colId: ControlTowerQuantityRobDifferenceListColumns.deliveryDate,
    field: model('deliveryDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    dtoForExport:
      ControlTowerQuantityRobDifferenceListExportColumns.deliveryDate,
    width: 150
  };

  surveyDate: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    string
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.createdOn,
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.createdOn,
    colId: ControlTowerQuantityRobDifferenceListColumns.createdOn,
    field: model('createdOn'),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.createdOn,
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    width: 150
  };

  emailToVesselCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    boolean
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.claimsRaised,
    headerTooltip:
      ControlTowerQuantityRobDifferenceListColumnsLabels.claimsRaised,
    colId: ControlTowerQuantityRobDifferenceListColumns.claimsRaised,
    field: model('claimsRaised'),
    dtoForExport:
      ControlTowerQuantityRobDifferenceListExportColumns.claimsRaised,
    cellRenderer: params => {
      const a = document.createElement('span');
      a.innerHTML = params.value ? 'Yes' : 'No';
      // eslint-disable-next-line no-unused-expressions
      params.value ? a.classList.add('success') : a.classList.add('denger');
      return a;
    },
    cellClass: 'cell-background',
    width: 150
  };

  vesselToWatchCall: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    boolean
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.isDeleted,
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.isDeleted,
    colId: ControlTowerQuantityRobDifferenceListColumns.isDeleted,
    field: model('isDeleted'),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.isDeleted,
    cellRenderer: params => {
      const a = document.createElement('span');
      a.innerHTML = params.value ? 'Yes' : 'No';
      // eslint-disable-next-line no-unused-expressions
      !params.value ? a.classList.add('success') : a.classList.add('denger');
      return a;
    },
    cellClass: 'cell-background',
    width: 150
  };

  productTypeCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.productType,
    headerTooltip:
      ControlTowerQuantityRobDifferenceListColumnsLabels.productType,
    colId: ControlTowerQuantityRobDifferenceListColumns.productType,
    field: model('productType'),
    dtoForExport:
      ControlTowerQuantityRobDifferenceListExportColumns.productType,
    valueFormatter: params => params.value?.name,
    width: 150
  };

  logBookROBCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    number
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.id,
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.id,
    colId: ControlTowerQuantityRobDifferenceListColumns.id,
    field: model('id'),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.id,
    filter: 'agNumberColumnFilter',
    width: 150
  };

  measuredROBCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.deliveryProductId,
    headerTooltip:
      ControlTowerQuantityRobDifferenceListColumnsLabels.deliveryProductId,
    colId: ControlTowerQuantityRobDifferenceListColumns.deliveryProductId,
    dtoForExport:
      ControlTowerQuantityRobDifferenceListExportColumns.deliveryProductId,
    field: model('deliveryProductId'),
    filter: 'agNumberColumnFilter',
    width: 150
  };

  differenceInQtyCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    number
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.totalCount,
    headerTooltip:
      ControlTowerQuantityRobDifferenceListColumnsLabels.totalCount,
    colId: ControlTowerQuantityRobDifferenceListColumns.totalCount,
    field: model('totalCount'),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.totalCount,
    filter: 'agNumberColumnFilter',
    width: 150
  };

  qtyUomCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.buyer,
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.buyer,
    colId: ControlTowerQuantityRobDifferenceListColumns.buyer,
    field: model('buyer'),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.buyer,
    valueFormatter: params => params.value?.name,
    width: 150
  };

  progressCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.status,
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.status,
    colId: ControlTowerQuantityRobDifferenceListColumns.status,
    field: model('status'),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.status,
    valueFormatter: params => params.value?.name,
    cellRendererFramework: AGGridCellRendererAsyncStatusComponent,
    width: 150
  };

  actionsCol: ITypedColDef<IControlTowerQuantityRobDifferenceItemDto> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.actions,
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.actions,
    colId: ControlTowerQuantityRobDifferenceListColumns.actions,
    headerClass: ['aggrid-text-align-c'],
    cellClass: ['aggridtextalign-center'],
    cellRendererFramework: AGGridCellActionsComponent,
    cellRendererParams: { type: 'actions' },
    resizable: false,
    suppressMovable: true,
    width: 110
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
      'v2-list-grid-8',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(
        ControlTowerQuantityRobDifferenceListGridViewModel.name
      )
    );
    this.init(this.gridOptions, true);
  }

  getColumnsDefs(): any[] {
    return [
      this.portCallCol,
      this.portCol,
      this.vesselCol,
      this.etaCol,
      this.surveyDate,
      this.emailToVesselCol,
      this.vesselToWatchCall,
      this.productTypeCol,
      this.logBookROBCol,
      this.measuredROBCol,
      this.differenceInQtyCol,
      this.qtyUomCol,
      this.progressCol,
      this.actionsCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public updateValues(ev, values): void {
    console.log(ev);
    console.log(values);
    // this.gridApi.purgeServerSideCache();
    const rowNode = this.gridApi.getRowNode(ev.data.id.toString());
    const newStatus = {
      transactionTypeId: 6,
      id: 1,
      name: 'New',
      internalName: null,
      displayName: 'New',
      code: null,
      collectionName: null,
      customNonMandatoryAttribute1: null,
      isDeleted: false,
      modulePathUrl: null,
      clientIpAddress: null,
      userAction: null
    };
    rowNode.setDataValue('status', newStatus);
  }

  public filterGridNew(statusName: string): void {
    if (this.toggleNewFilter) {
      this.filterByStatus(statusName);
    } else {
      this.filterByStatus('');
    }
  }

  public filterGridMAS(statusName: string): void {
    if (this.toggleMASFilter) {
      this.filterByStatus(statusName);
    } else {
      this.filterByStatus('');
    }
  }

  public filterGridResolved(statusName: string): void {
    if (this.toggleResolvedFilter) {
      this.filterByStatus(statusName);
    } else {
      this.filterByStatus('');
    }
  }

  public filterByStatus(statusName: string): void {
    const grid = this.gridApi.getFilterModel();
    grid['status'] = {
      filterType: 'text',
      type: 'equals',
      filter: statusName
    };
    this.gridApi.setFilterModel(grid);
  }

  public checkStatusAvailable(): void {
    this.toggleNewFilter = true;
    this.toggleMASFilter = true;
    this.toggleResolvedFilter = true;
    const grid = this.gridApi.getFilterModel();
    for (let [key, value] of Object.entries(grid)) {
      if (key == 'status') {
        if ((<any>value).type == 'equals') {
          if ((<any>value).filter.toLowerCase() === 'new') {
            this.toggleNewFilter = !this.toggleNewFilter;
            this.toggleMASFilter = true;
            this.toggleResolvedFilter = true;
          } else if ((<any>value).filter.toLowerCase() === 'verified') {
            this.toggleMASFilter = !this.toggleMASFilter;
            this.toggleNewFilter = true;
            this.toggleResolvedFilter = true;
          } else if ((<any>value).filter.toLowerCase() === 'in spec') {
            this.toggleResolvedFilter = !this.toggleResolvedFilter;
            this.toggleNewFilter = true;
            this.toggleMASFilter = true;
          }
        }
      }
    }
  }

  public filterByDate(from: string, to: string): void {
    const grid = this.gridApi.getFilterModel();
    grid['createdOn'] = {
      dateFrom: from,
      dateTo: to,
      type: 'inRange',
      filterType: 'date'
    };
    this.gridApi.setFilterModel(grid);
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.checkStatusAvailable();
    this.paramsServerSide = params;
    this.exportUrl = this.controlTowerService.getControlTowerQuantityRobDifferenceListExportUrl();
    this.controlTowerService
      .getControlTowerQuantityRobDifferenceList$(
        transformLocalToServeGridInfo(
          this.gridApi,
          params,
          ControlTowerQuantityRobDifferenceListColumnServerKeys,
          this.searchText
        )
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => {
          this.numberOfNewProgress = response.matchedCount;
          params.successCallback(response.payload, response.matchedCount);
        },
        () => {
          this.appErrorHandler.handleError(
            ModuleError.LoadControlTowerQuantityRobDifferenceFailed
          );
          params.failCallback();
        }
      );
  }
}
