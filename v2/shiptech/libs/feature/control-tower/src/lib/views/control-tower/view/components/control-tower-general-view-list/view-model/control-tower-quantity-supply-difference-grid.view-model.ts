import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import {
  GridOptions,
  IServerSideGetRowsParams,
  RowNode
} from '@ag-grid-community/core';
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
import { IControlTowerQuantitySupplyDifferenceItemDto } from 'libs/feature/control-tower/src/lib/services/api/dto/control-tower-list-item.dto';
import { FormControl } from '@angular/forms';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { Output, EventEmitter } from '@angular/core';
import moment from 'moment';

import {
  ControlTowerQuantitySupplyDifferenceListColumns,
  ControlTowerQuantitySupplyDifferenceListColumnServerKeys,
  ControlTowerQuantitySupplyDifferenceListColumnsLabels,
  ControlTowerQuantitySupplyDifferenceListExportColumns
} from '../list-columns/control-tower-quantity-supply-difference-list.columns';

import {
  ControlTowerProgressColors,
  IControlTowerRowPopup
} from '../control-tower-general-enums';
import { MatDialog } from '@angular/material/dialog';
import { __values } from 'tslib';
import { ToastrService } from 'ngx-toastr';
import { AGGridCellRendererStatusComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-status/ag-grid-cell-status.component';
import { BooleanFilterParams } from '@shiptech/core/ui/components/ag-grid/ag-grid-utils';
import _ from 'lodash';

function model(
  prop: keyof IControlTowerQuantitySupplyDifferenceItemDto
): keyof IControlTowerQuantitySupplyDifferenceItemDto {
  return prop;
}

@Injectable()
export class ControlTowerQuantitySupplyDifferenceListGridViewModel extends BaseGridViewModel {
  public searchText: string;
  public differenceType: ILookupDto;
  public exportUrl: string;
  public newFilterSelected: boolean = false;
  public fromDate = new FormControl(
    moment()
      .subtract(6, 'days')
      .format('YYYY-MM-DD')
  );
  public toDate = new FormControl(moment().format('YYYY-MM-DD'));

  public toggleNewFilter: boolean = true;
  public toggleMASFilter: boolean = true;
  public toggleResolvedFilter: boolean = true;
  public noOfNew: number;
  public noOfMarkedAsSeen: number;
  public noOfResolved: number;
  public noOfDefault: any;
  public groupedCounts: {
    noOfNew: number;
    noOfMarkedAsSeen: number;
    noOfResolved: number;
    noOfDefault: number;
  };

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
    getRowNodeId: (data: IControlTowerQuantitySupplyDifferenceItemDto) => {
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
    IControlTowerQuantitySupplyDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.portCall,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.portCall,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.portCall,
    field: model('portCall'),
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.portCall,
    cellRenderer: params => {
      if (params.value) {
        const a = document.createElement('a');
        a.innerHTML = params.value?.portCallId;
        a.href = `/v2/quantity-control/report/${params.data.quantityControlReport.id}/details`;
        a.setAttribute('target', '_blank');
        return a;
      }
      return null;
    },
    tooltip: params => (params.value ? params.value?.portCallId : ''),
    width: 200
  };

  portCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    string
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.port,
    headerTooltip: ControlTowerQuantitySupplyDifferenceListColumnsLabels.port,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.port,
    field: model('port'),
    dtoForExport: ControlTowerQuantitySupplyDifferenceListExportColumns.port,
    tooltip: params => (params.value ? params.value : ''),
    width: 150
  };

  vesselCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.vessel,
    headerTooltip: ControlTowerQuantitySupplyDifferenceListColumnsLabels.vessel,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.vessel,
    field: model('vessel'),
    dtoForExport: ControlTowerQuantitySupplyDifferenceListExportColumns.vessel,
    valueFormatter: params => params.value?.name,
    tooltip: params => (params.value ? params.value : ''),
    width: 150
  };

  etaCol: ITypedColDef<IControlTowerQuantitySupplyDifferenceItemDto, string> = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.eta,
    headerTooltip: ControlTowerQuantitySupplyDifferenceListColumnsLabels.eta,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.eta,
    field: model('eta'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    dtoForExport: ControlTowerQuantitySupplyDifferenceListExportColumns.eta,
    tooltip: params => (params.value ? this.format.date(params.value) : ''),
    width: 150
  };

  surveyorDate: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    string
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.surveyorDate,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.surveyorDate,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.surveyorDate,
    field: model('surveyorDate'),
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.surveyorDate,
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.dateOnly(params.value),
    tooltip: params => (params.value ? this.format.dateOnly(params.value) : ''),
    width: 150
  };

  emailToVesselCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    boolean
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.emailToVessel,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.emailToVessel,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.emailToVessel,
    field: model('emailToVessel'),
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.emailToVessel,
    cellRenderer: params => {
      const a = document.createElement('span');
      a.innerHTML = params.value ? 'Yes' : 'No';
      return a;
    },
    cellClass: 'cell-background',
    tooltip: params => {
      if (params.data) {
        return params.value ? 'Yes' : 'No';
      }
    },
    width: 150,
    filter: 'agNumberColumnFilter',
    filterParams: {
      ...this.defaultColFilterParams,
      ...BooleanFilterParams
    }
  };

  vesselToWatchCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    boolean
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.vesselToWatch,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.vesselToWatch,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.vesselToWatch,
    field: model('vesselToWatch'),
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.vesselToWatch,
    cellRenderer: params => {
      const a = document.createElement('span');
      a.innerHTML = params.value ? 'Yes' : 'No';
      return a;
    },
    cellClass: 'cell-background',
    tooltip: params => {
      if (params.data) {
        return params.value ? 'Yes' : 'No';
      }
    },
    width: 150,
    filter: 'agNumberColumnFilter',
    filterParams: {
      ...this.defaultColFilterParams,
      ...BooleanFilterParams
    }
  };

  productTypeCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    ILookupDto
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.productType,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.productType,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.productType,
    field: model('productType'),
    autoHeight: true,
    wrapText: true,
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.productType,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.productType?.name ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    tooltip: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.productType?.name ?? '-'
        );
        return mergedValues.join(',');
      }
    },
    width: 150
  };

  bdnQuantityCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.bdnQuantity,
    headerClass: ['aggrid-text-align-right'],
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.bdnQuantity,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.bdnQuantity,
    field: model('bdnQuantity'),
    autoHeight: true,
    wrapText: true,
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.bdnQuantity,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.bdnQuantity) ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    filter: 'agNumberColumnFilter',
    tooltip: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.bdnQuantity) ?? '-'
        );
        return mergedValues.join(',');
      }
    },
    width: 150
  };

  measuredDeliveredQty: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.measuredDeliveredQty,
    headerClass: ['aggrid-text-align-right'],
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.measuredDeliveredQty,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.measuredDeliveredQty,
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.measuredDeliveredQty,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.measuredDeliveredQuantity) ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    field: model('measuredDeliveredQty'),
    autoHeight: true,
    wrapText: true,
    filter: 'agNumberColumnFilter',
    tooltip: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.measuredDeliveredQuantity) ?? '-'
        );
        return mergedValues.join(',');
      }
    },
    width: 150
  };

  differenceInQtyCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.differenceInQty,
    headerClass: ['aggrid-text-align-right'],
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.differenceInQty,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.differenceInQty,
    field: model('differenceInQty'),
    autoHeight: true,
    wrapText: true,
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.differenceInQty,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.differenceInSupplyQuantity) ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    filter: 'agNumberColumnFilter',
    tooltip: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.differenceInSupplyQuantity) ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    width: 150
  };
  sumOfOrderQtyCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.sumOfOrderQtyCol,
    headerClass: ['aggrid-text-align-right'],
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.sumOfOrderQtyCol,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.sumOfOrderQtyCol,
    field: model('sumOfOrderQtyCol'),
    autoHeight: true,
    wrapText: true,
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.sumOfOrderQtyCol,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.sumOfOrderQuantity) ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    filter: 'agNumberColumnFilter',
    tooltip: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.sumOfOrderQuantity) ?? '-'
        );
        return mergedValues.join(',');
      }
    },
    width: 150
  };

  qtyUomCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.qtyUom,
    headerTooltip: ControlTowerQuantitySupplyDifferenceListColumnsLabels.qtyUom,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.qtyUom,
    field: model('qtyUom'),
    autoHeight: true,
    wrapText: true,
    dtoForExport: ControlTowerQuantitySupplyDifferenceListExportColumns.qtyUom,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.supplyUom?.name ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    tooltip: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.supplyUom?.name ?? '-'
        );
        return mergedValues.join(',');
      }
    },
    width: 150
  };

  progressCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.progress,
    headerClass: ['aggrid-text-align-c'],
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.progress,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.progress,
    field: model('progress'),
    autoHeight: true,
    wrapText: true,
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.progress,
    valueFormatter: params => params.value?.displayName,
    cellRendererParams: function(params) {
      if (params.value) {
        var classArray: string[] = [];
        let newClass = '';
        switch (params?.value.displayName) {
          case 'New':
            newClass = 'medium-blue';
            break;
          case 'Marked as Seen':
            newClass = 'medium-yellow';
            break;
          case 'Resolved':
            newClass = 'light-green';
            break;
        }
        classArray.push(newClass);
        return {
          cellClass: classArray.length > 0 ? classArray : null,
          type: 'progress'
        };
      }
    },
    cellRendererFramework: AGGridCellRendererStatusComponent,
    tooltip: params => (params.value ? params.value?.displayName : ''),
    width: 150
  };

  actionsCol: ITypedColDef<IControlTowerQuantitySupplyDifferenceItemDto> = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.actions,
    headerClass: ['aggrid-text-align-c'],
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.actions,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.actions,
    cellClass: ['aggridtextalign-center'],
    cellRendererFramework: AGGridCellActionsComponent,
    cellRendererParams: { type: 'actions' },
    width: 110,
    sortable: false,
    filter: false
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    public dialog: MatDialog,
    private format: TenantFormattingService,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private controlTowerService: ControlTowerService,
    private appErrorHandler: AppErrorHandler,
    private databaseManipulation: DatabaseManipulation,
    private toastr: ToastrService
  ) {
    super(
      'control-tower-quantity-supply-list-grid-5',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(
        ControlTowerQuantitySupplyDifferenceListGridViewModel.name
      )
    );
    this.init(this.gridOptions, true);
    this.legacyLookupsDatabase
      .getTableByName('robDifferenceType')
      .then(response => {
        this.differenceType = response.filter(obj => obj.name == 'Supply')[0];
      });
  }

  public systemFilterUpdate(value) {
    let currentFilter = value.filter(o => o.isActive);
    switch (currentFilter[0].id) {
      case 'new':
        this.filterGridNew(currentFilter[0].label);
        break;
      case 'marked-as-seen':
        this.filterGridMAS(currentFilter[0].label);
        break;
      case 'resolved':
        this.filterGridResolved(currentFilter[0].label);
        break;
    }
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

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public updateValues(ev, values): void {
    console.log(values);
    const rowNode = this.gridApi.getRowNode(ev.data.id.toString());
    if (values?.status) {
      const newStatus = _.cloneDeep(values.status);
      rowNode.setDataValue('progress', newStatus);
      this.getCountForDefultFilters();
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
    const grid = [];
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
          if ((<any>value).filter === 'New') {
            this.toggleNewFilter = !this.toggleNewFilter;
            this.toggleMASFilter = true;
            this.toggleResolvedFilter = true;
          } else if ((<any>value).filter === 'Marked As Seen') {
            this.toggleMASFilter = !this.toggleMASFilter;
            this.toggleNewFilter = true;
            this.toggleResolvedFilter = true;
          } else if ((<any>value).filter === 'Resolved') {
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

  public checkFromAndToAvailable(): void {
    const grid = this.gridApi.getFilterModel();
    for (let [key, value] of Object.entries(grid)) {
      if (key == 'surveyorDate') {
        if ((<any>value).type == 'inRange') {
          this.fromDate.setValue((<any>value).dateFrom);
          this.toDate.setValue((<any>value).dateTo);
        }
      }
    }
  }

  public getFiltersCount() {
    if (this.groupedCounts) {
      return false;
    }
    this.getCountForDefultFilters();
  }

  public getCountForDefultFilters() {
    let payload = {
      differenceType: {
        name: 'Supply'
      },
      startDate: moment()
        .subtract(6, 'days')
        .format('YYYY-MM-DD'),
      endDate: `${moment().format('YYYY-MM-DD')}T23:59:59`
    };
    this.controlTowerService
      .getSupplyDifferenceFiltersCount(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => {
          this.noOfDefault = response.noOfLastSevenDays;
          this.noOfNew = response.noOfNew;
          this.noOfMarkedAsSeen = response.noOfMarkedAsSeen;
          this.noOfResolved = response.noOfResolved;
          this.groupedCounts = {
            noOfDefault: this.noOfDefault,
            noOfNew: this.noOfNew,
            noOfMarkedAsSeen: this.noOfMarkedAsSeen,
            noOfResolved: this.noOfResolved
          };
          this.changeDetector.detectChanges();
        },
        () => {
          this.appErrorHandler.handleError(
            ModuleError.LoadControlTowerQuantitySupplyDifferenceCountFailed
          );
        }
      );
  }

  @Output() emitCountValues = new EventEmitter();
  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.getFiltersCount();
    this.checkStatusAvailable();
    this.checkFromAndToAvailable();
    this.paramsServerSide = params;
    this.exportUrl = this.controlTowerService.getControlTowerQuantitySupplyDifferenceListExportUrl();
    this.controlTowerService
      .getControlTowerQuantitySupplyDifferenceList$(
        transformLocalToServeGridInfo(
          this.gridApi,
          params,
          ControlTowerQuantitySupplyDifferenceListColumnServerKeys,
          this.searchText
        )
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => {
          params.successCallback(
            response.payload,
            response.payload[0]?.totalCount ?? 0
          );
        },
        () => {
          this.appErrorHandler.handleError(
            ModuleError.LoadControlTowerQuantitySupplyDifferenceFailed
          );
          params.failCallback();
        }
      );
  }

  computeProgressCellColor(value: ILookupDto) {
    let bgColor = 'none';
    switch (value.name) {
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
    return `<a class="btn-25" style="background-color:${bgColor}; color:#fff">${value.name}</a>`;
  }

  savePopupChanges = (ev, result) => {
    if (result) {
      let payloadData = {
        differenceType: this.differenceType,
        quantityControlReport: {
          id: ev.data.quantityControlReport.id
        },
        status: result.data.status,
        comments: result.data.comments
      };

      this.controlTowerService
        .saveQuantityResiduePopUp(payloadData, payloadData => {
          console.log('asd');
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  };
}
