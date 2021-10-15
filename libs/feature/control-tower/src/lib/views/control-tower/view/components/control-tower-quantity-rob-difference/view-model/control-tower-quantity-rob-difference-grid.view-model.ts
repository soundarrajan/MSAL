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
  ControlTowerQuantityRobDifferenceListColumnsLabels
} from './control-tower-quantity-rob-difference-list.columns';
import { ControlTowerService } from 'libs/feature/control-tower/src/lib/services/control-tower.service';
import { IControlTowerQuantityRobDifferenceItemDto } from 'libs/feature/control-tower/src/lib/services/api/dto/control-tower-list-item.dto';

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
    colId: ControlTowerQuantityRobDifferenceListColumns.order,
    field: model('order'),
    cellRendererFramework: AgCellTemplateComponent,
    width: 200,
    headerTooltip: 'Order No.'
  };

  portCol: ITypedColDef<IControlTowerQuantityRobDifferenceItemDto, string> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.port,
    colId: ControlTowerQuantityRobDifferenceListColumns.port,
    field: model('port'),
    width: 150
  };

  vesselCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.vessel,
    colId: ControlTowerQuantityRobDifferenceListColumns.vessel,
    field: model('vessel'),
    valueFormatter: params => params.value?.name,
    width: 150
  };

  etaCol: ITypedColDef<IControlTowerQuantityRobDifferenceItemDto, string> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.deliveryDate,
    colId: ControlTowerQuantityRobDifferenceListColumns.deliveryDate,
    field: model('deliveryDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    width: 150
  };

  surveyDate: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    string
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.createdOn,
    colId: ControlTowerQuantityRobDifferenceListColumns.createdOn,
    field: model('createdOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    width: 150
  };

  emailToVesselCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    boolean
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.claimsRaised,
    colId: ControlTowerQuantityRobDifferenceListColumnsLabels.claimsRaised,
    field: model('claimsRaised'),
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
    colId: ControlTowerQuantityRobDifferenceListColumnsLabels.isDeleted,
    field: model('isDeleted'),
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
    colId: ControlTowerQuantityRobDifferenceListColumns.productType,
    field: model('productType'),
    valueFormatter: params => params.value?.name,
    width: 150
  };

  logBookROBCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    number
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.id,
    colId: ControlTowerQuantityRobDifferenceListColumns.id,
    field: model('id'),
    filter: 'agNumberColumnFilter',
    width: 150
  };

  measuredROBCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.deliveryProductId,
    colId: ControlTowerQuantityRobDifferenceListColumns.deliveryProductId,
    field: model('deliveryProductId'),
    filter: 'agNumberColumnFilter',
    width: 150
  };

  differenceInQtyCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    number
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.totalCount,
    colId: ControlTowerQuantityRobDifferenceListColumns.totalCount,
    field: model('totalCount'),
    filter: 'agNumberColumnFilter',
    width: 150
  };

  qtyUomCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.buyer,
    colId: ControlTowerQuantityRobDifferenceListColumns.buyer,
    field: model('buyer'),
    valueFormatter: params => params.value?.name,
    width: 150
  };

  progressCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.status,
    colId: ControlTowerQuantityRobDifferenceListColumns.status,
    field: model('status'),
    valueFormatter: params => params.value?.name,
    cellRendererFramework: AGGridCellRendererAsyncStatusComponent,
    width: 150
  };

  actionsCol: ITypedColDef<IControlTowerQuantityRobDifferenceItemDto> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.actions,
    colId: ControlTowerQuantityRobDifferenceListColumns.actions,
    headerClass: ['aggrid-text-align-c'],
    cellClass: ['aggridtextalign-center'],
    headerTooltip: 'Actions',
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

  // public updateValues(ev, values): void {
  //   console.log(ev);
  //   console.log(values);
  //   // this.gridApi.purgeServerSideCache();
  //   const rowNode = this.gridApi.getRowNode(ev.data.id.toString());
  //   const newPrice = Math.floor(Math.random() * 100000);
  //   const newStatus = {
  //     transactionTypeId: 5,
  //     id: 27,
  //     name: 'Discrepancy',
  //     internalName: null,
  //     displayName: 'Discrepancy',
  //     collectionName: null,
  //     customNonMandatoryAttribute1: null,
  //     isDeleted: false,
  //     modulePathUrl: null,
  //     clientIpAddress: null,
  //     userAction: null
  //   };
  //   rowNode.setDataValue('invoiceAmount', newPrice);
  //   rowNode.setDataValue('invoiceStatus', newStatus);
  // }

  public async getColorFromDashboard(
    columnId: number,
    transactionId: number
  ): Promise<void> {
    await this.databaseManipulation
      .getStatusColorFromDashboard(columnId, transactionId)
      .then((result: string) => result);
  }

  public getParameters(data: any): string {
    console.log(data);
    return 'red';
  }

  public filterByStatus(): void {
    const grid = this.gridApi.getFilterModel();
    grid['vesselName'] = {
      filterType: 'text',
      type: 'contains',
      filter: 'malta'
    };
    this.gridApi.setFilterModel(grid);
    const grid1 = this.gridApi.getFilterModel();
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    if (!(<any>window).numberOfCalls) {
      (<any>window).numberOfCalls += 1;
      return;
    }
    const values = transformLocalToServeGridInfo(
      this.gridApi,
      params,
      ControlTowerQuantityRobDifferenceListColumnServerKeys,
      this.searchText
    );
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
