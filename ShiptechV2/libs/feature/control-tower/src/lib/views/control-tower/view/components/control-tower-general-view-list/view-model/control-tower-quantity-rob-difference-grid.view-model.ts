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
import {
  IControlTowerQuantityRobDifferenceItemDto,
  IPortCallLookupDto
} from 'libs/feature/control-tower/src/lib/services/api/dto/control-tower-list-item.dto';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import {
  ControlTowerQuantityRobDifferenceListColumns,
  ControlTowerQuantityRobDifferenceListColumnServerKeys,
  ControlTowerQuantityRobDifferenceListColumnsLabels,
  ControlTowerQuantityRobDifferenceListExportColumns
} from '../list-columns/control-tower-quantity-rob-difference-list.columns';
import { ControlTowerProgressColors } from '../control-tower-general-enums';

function model(
  prop: keyof IControlTowerQuantityRobDifferenceItemDto
): keyof IControlTowerQuantityRobDifferenceItemDto {
  return prop;
}

@Injectable()
export class ControlTowerQuantityRobDifferenceListGridViewModel extends BaseGridViewModel {
  public searchText: string;
  public exportUrl: string;
  public newFilterSelected: boolean = false;
  public fromDate = new FormControl(
    moment()
      .subtract(1, 'year')
      .format('YYYY-MM-DD')
  );
  public toDate = new FormControl(moment().format('YYYY-MM-DD'));

  public toggleNewFilter: boolean = true;
  public toggleMASFilter: boolean = true;
  public toggleResolvedFilter: boolean = true;
  public noOfNew: number;
  public noOfMarkedAsSeen: number;
  public noOfResolved: number;

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
    rowHeight: 40,
    rowModelType: RowModelType.ServerSide,
    pagination: true,
    rowSelection: RowSelection.Single,
    suppressContextMenu: true,
    multiSortKey: 'ctrl',
    singleClickEdit: true,
    getRowNodeId: (data: IControlTowerQuantityRobDifferenceItemDto) => {
      return data?.id?.toString() ?? Math.random().toString();
    },
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

  portCallCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.portCall,
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.portCall,
    colId: ControlTowerQuantityRobDifferenceListColumns.portCall,
    field: model('portCall'),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.portCall,
    cellRenderer: params => {
      const a = document.createElement('a');
      a.innerHTML = params.value.portCallId;
      a.href = `/quantity-control/report/${params.data.quantityControlReport.id}/details`;
      a.setAttribute('target', '_blank');
      return a;
    },
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
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.eta,
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.eta,
    colId: ControlTowerQuantityRobDifferenceListColumns.eta,
    field: model('eta'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.eta,
    width: 150
  };

  surveyorDate: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    string
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.surveyorDate,
    headerTooltip:
      ControlTowerQuantityRobDifferenceListColumnsLabels.surveyorDate,
    colId: ControlTowerQuantityRobDifferenceListColumns.surveyorDate,
    field: model('surveyorDate'),
    dtoForExport:
      ControlTowerQuantityRobDifferenceListExportColumns.surveyorDate,
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    width: 150
  };

  emailToVesselCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    boolean
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.emailToVessel,
    headerTooltip:
      ControlTowerQuantityRobDifferenceListColumnsLabels.emailToVessel,
    colId: ControlTowerQuantityRobDifferenceListColumns.emailToVessel,
    field: model('emailToVessel'),
    dtoForExport:
      ControlTowerQuantityRobDifferenceListExportColumns.emailToVessel,
    cellRenderer: params => {
      const a = document.createElement('span');
      a.innerHTML = params.value ? 'Yes' : 'No';
      params.value ? a.classList.add('success') : a.classList.add('denger');
      return a;
    },
    cellClass: 'cell-background',
    width: 150
  };

  vesselToWatchCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    boolean
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.vesselToWatch,
    headerTooltip:
      ControlTowerQuantityRobDifferenceListColumnsLabels.vesselToWatch,
    colId: ControlTowerQuantityRobDifferenceListColumns.vesselToWatch,
    field: model('vesselToWatch'),
    dtoForExport:
      ControlTowerQuantityRobDifferenceListExportColumns.vesselToWatch,
    cellRenderer: params => {
      const a = document.createElement('span');
      a.innerHTML = params.value ? 'Yes' : 'No';
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
    cellRenderer: params => {
      let mergedValues = params.data.quantityReportDetails.map(
        a => a.productType?.name ?? '-'
      );
      return mergedValues.join('<br>');
    },
    width: 150
  };

  bdnQuantityCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    number
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.bdnQuantity,
    headerTooltip:
      ControlTowerQuantityRobDifferenceListColumnsLabels.bdnQuantity,
    colId: ControlTowerQuantityRobDifferenceListColumns.bdnQuantity,
    field: model('id'),
    dtoForExport:
      ControlTowerQuantityRobDifferenceListExportColumns.bdnQuantity,
    cellRenderer: params => {
      let mergedValues = params.data.quantityReportDetails.map(
        a => a.bdnQuantity ?? '-'
      );
      return mergedValues.join('<br>');
    },
    filter: 'agNumberColumnFilter',
    width: 150
  };

  measuredDeliveredQty: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.measuredDeliveredQty,
    headerTooltip:
      ControlTowerQuantityRobDifferenceListColumnsLabels.measuredDeliveredQty,
    colId: ControlTowerQuantityRobDifferenceListColumns.measuredDeliveredQty,
    dtoForExport:
      ControlTowerQuantityRobDifferenceListExportColumns.measuredDeliveredQty,
    cellRenderer: params => {
      let mergedValues = params.data.quantityReportDetails.map(
        a => a.measuredDeliveredQuantity ?? '-'
      );
      return mergedValues.join('<br>');
    },
    field: model('measuredDeliveredQty'),
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
    cellRenderer: params => {
      let mergedValues = params.data.quantityReportDetails.map(
        a => a.differenceInSupplyQuantity ?? '-'
      );
      return mergedValues.join('<br>');
    },
    filter: 'agNumberColumnFilter',
    width: 150
  };
  sumOfOrderQtyCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.sumOfOrderQtyCol,
    headerTooltip:
      ControlTowerQuantityRobDifferenceListColumnsLabels.sumOfOrderQtyCol,
    colId: ControlTowerQuantityRobDifferenceListColumns.sumOfOrderQtyCol,
    field: model('sumOfOrderQtyCol'),
    dtoForExport:
      ControlTowerQuantityRobDifferenceListExportColumns.sumOfOrderQtyCol,
    cellRenderer: params => {
      let mergedValues = params.data.quantityReportDetails.map(
        a => a.sumOfOrderQuantity ?? '-'
      );
      return mergedValues.join('<br>');
    },
    filter: 'agNumberColumnFilter',
    width: 150
  };

  qtyUomCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.qtyUom,
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.qtyUom,
    colId: ControlTowerQuantityRobDifferenceListColumns.qtyUom,
    field: model('qtyUom'),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.qtyUom,
    cellRenderer: params => {
      let mergedValues = params.data.quantityReportDetails.map(
        a => a.supplyUom?.name ?? '-'
      );
      return mergedValues.join('<br>');
    },
    width: 150
  };

  progressCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.progress,
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.progress,
    colId: ControlTowerQuantityRobDifferenceListColumns.progress,
    field: model('progress'),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.progress,
    cellRenderer: params => {
      return this.computeProgressCellColor(params.value);
    },
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
      'control-tower-quantity-rob-list-grid-5',
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
      this.surveyorDate,
      this.emailToVesselCol,
      this.vesselToWatchCol,
      this.productTypeCol,
      this.bdnQuantityCol,
      this.measuredDeliveredQty,
      this.differenceInQtyCol,
      this.sumOfOrderQtyCol,
      this.qtyUomCol,
      this.progressCol,
      this.actionsCol
    ];
  }

  public updateValues(ev, values): void {
    console.log(values);
    // this.gridApi.purgeServerSideCache();
    let rowNode: any = 0;
    if (ev.data.id) {
      rowNode = this.gridApi.getRowNode(ev.data.id.toString());
    }
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
    if (rowNode) {
      rowNode.setDataValue('status', newStatus);
    }
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
    grid['progress'] = {
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
      if (key == 'progress') {
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
    grid['surveyorDate'] = {
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
          this.noOfNew = response.payload.noOfNew;
          this.noOfMarkedAsSeen = response.payload.noOfMarkedAsSeen;
          this.noOfResolved = response.payload.noOfResolved;
          params.successCallback(
            response.payload.items,
            response.payload.items[0]?.totalCount ?? 0
          );
        },
        () => {
          this.appErrorHandler.handleError(
            ModuleError.LoadControlTowerQuantityRobDifferenceFailed
          );
          params.failCallback();
        }
      );
  }

  computeProgressCellColor(value: ILookupDto) {
    let bgColor = 'none';
    switch (value?.name) {
      case 'New':
        bgColor = ControlTowerProgressColors.new;
        break;
      case 'Marked as Seen':
        bgColor = ControlTowerProgressColors.markedAsSeen;
        break;
      case 'Resolved':
        bgColor = ControlTowerProgressColors.resolved;
        break;
    }
    return `<a class="btn-25" style="background-color:${bgColor}; color:#fff">${value?.name}</a>`;
  }
}
