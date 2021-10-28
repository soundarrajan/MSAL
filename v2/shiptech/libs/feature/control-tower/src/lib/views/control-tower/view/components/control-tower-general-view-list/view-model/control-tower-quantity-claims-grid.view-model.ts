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

function model(
  prop: keyof IControlTowerQuantityClaimsItemDto
): keyof IControlTowerQuantityClaimsItemDto {
  return prop;
}

@Injectable()
export class ControlTowerQuantityClaimsListGridViewModel extends BaseGridViewModel {
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
    getRowNodeId: (data: IControlTowerQuantityClaimsItemDto) =>
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

  orderNoCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, ILookupDto> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.order,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.order,
    colId: ControlTowerQuantityClaimsListColumns.order,
    field: model('order'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.order,
    cellRendererFramework: AgCellTemplateComponent,
    width: 150
  };

  labIdCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, ILookupDto> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.lab,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.lab,
    colId: ControlTowerQuantityClaimsListColumns.lab,
    field: model('lab'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.lab,
    cellRendererFramework: AgCellTemplateComponent,
    width: 150
  };

  claimNoCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, ILookupDto> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.id,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.id,
    colId: ControlTowerQuantityClaimsListColumns.id,
    field: model('id'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.id,
    cellRendererFramework: AgCellTemplateComponent,
    width: 150
  };

  portCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, string> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.port,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.port,
    colId: ControlTowerQuantityClaimsListColumns.port,
    field: model('port'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.port,
    width: 200
  };

  vesselCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, string> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.vessel,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.vessel,
    colId: ControlTowerQuantityClaimsListColumns.vessel,
    field: model('vessel'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.vessel,
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
    width: 200
  };

  productCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, string> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.product,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.product,
    colId: ControlTowerQuantityClaimsListColumns.product,
    field: model('product'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.product,
    width: 200
  };

  sellerCol: ITypedColDef<IControlTowerQuantityClaimsItemDto, string> = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.seller,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.seller,
    colId: ControlTowerQuantityClaimsListColumns.seller,
    field: model('seller'),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.seller,
    width: 200
  };

  quantityShortageCol: ITypedColDef<
    IControlTowerQuantityClaimsItemDto,
    number
  > = {
    headerName: ControlTowerQuantityClaimsListColumnsLabels.quantityShortage,
    headerTooltip: ControlTowerQuantityClaimsListColumnsLabels.quantityShortage,
    colId: ControlTowerQuantityClaimsListColumns.quantityShortage,
    field: model('quantityShortage'),
    valueFormatter: params => this.format.quantity(params.value),
    dtoForExport: ControlTowerQuantityClaimsListExportColumns.quantityShortage,
    width: 200
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
      'control-tower-quantity-claims-3',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(
        ControlTowerQuantityClaimsListGridViewModel.name
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
      this.quantityShortageCol
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
          this.appErrorHandler.handleError(
            ModuleError.LoadControlTowerQuantityClaimsFailed
          );
          params.failCallback();
        }
      );
  }
}
