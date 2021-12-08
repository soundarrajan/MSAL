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

import { ControlTowerProgressColors } from '../control-tower-general-enums';
import { AGGridCellRendererStatusComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-status/ag-grid-cell-status.component';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';

import { BooleanFilterParams } from '@shiptech/core/ui/components/ag-grid/ag-grid-utils';
import { IControlTowerResidueEGCSDifferenceItemDto } from 'libs/feature/control-tower/src/lib/services/api/dto/control-tower-list-item.dto';
import {
  ControlTowerResidueEGCSDifferenceListColumns,
  ControlTowerResidueEGCSDifferenceListColumnServerKeys,
  ControlTowerResidueEGCSDifferenceListColumnsLabels,
  ControlTowerResidueEGCSDifferenceListExportColumns
} from '../list-columns/control-tower-residue-egcs-difference-list.columns';

function model(
  prop: keyof IControlTowerResidueEGCSDifferenceItemDto
): keyof IControlTowerResidueEGCSDifferenceItemDto {
  return prop;
}

@Injectable()
export class ControlTowerResidueEGCSDifferenceListGridViewModel extends BaseGridViewModel {
  public searchText: string;
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
  public noOfDefault: number;

  public differenceType: ILookupDto;

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

    getRowNodeId: (data: IControlTowerResidueEGCSDifferenceItemDto) => {
      return data?.id?.toString() ?? Math.random().toString();
    },
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  portCallCol: ITypedColDef<
    IControlTowerResidueEGCSDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerResidueEGCSDifferenceListColumnsLabels.portCall,
    headerTooltip: ControlTowerResidueEGCSDifferenceListColumnsLabels.portCall,
    colId: ControlTowerResidueEGCSDifferenceListColumns.portCall,
    field: model('portCall'),
    dtoForExport: ControlTowerResidueEGCSDifferenceListExportColumns.portCall,
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

  portCol: ITypedColDef<IControlTowerResidueEGCSDifferenceItemDto, string> = {
    headerName: ControlTowerResidueEGCSDifferenceListColumnsLabels.port,
    headerTooltip: ControlTowerResidueEGCSDifferenceListColumnsLabels.port,
    colId: ControlTowerResidueEGCSDifferenceListColumns.port,
    field: model('port'),
    dtoForExport: ControlTowerResidueEGCSDifferenceListExportColumns.port,
    tooltip: params => (params.value ? params.value : ''),
    width: 150
  };

  vesselCol: ITypedColDef<
    IControlTowerResidueEGCSDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerResidueEGCSDifferenceListColumnsLabels.vessel,
    headerTooltip: ControlTowerResidueEGCSDifferenceListColumnsLabels.vessel,
    colId: ControlTowerResidueEGCSDifferenceListColumns.vessel,
    field: model('vessel'),
    dtoForExport: ControlTowerResidueEGCSDifferenceListExportColumns.vessel,
    valueFormatter: params => params.value,
    tooltip: params => (params.value ? params.value : ''),
    width: 150
  };

  etaCol: ITypedColDef<IControlTowerResidueEGCSDifferenceItemDto, string> = {
    headerName: ControlTowerResidueEGCSDifferenceListColumnsLabels.eta,
    headerTooltip: ControlTowerResidueEGCSDifferenceListColumnsLabels.eta,
    colId: ControlTowerResidueEGCSDifferenceListColumns.eta,
    field: model('eta'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    dtoForExport: ControlTowerResidueEGCSDifferenceListExportColumns.eta,
    tooltip: params => (params.value ? this.format.date(params.value) : ''),
    width: 150
  };

  surveyorDate: ITypedColDef<
    IControlTowerResidueEGCSDifferenceItemDto,
    string
  > = {
    headerName: ControlTowerResidueEGCSDifferenceListColumnsLabels.surveyorDate,
    headerTooltip:
      ControlTowerResidueEGCSDifferenceListColumnsLabels.surveyorDate,
    colId: ControlTowerResidueEGCSDifferenceListColumns.surveyorDate,
    field: model('surveyorDate'),
    dtoForExport:
      ControlTowerResidueEGCSDifferenceListExportColumns.surveyorDate,
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.dateOnly(params.value),
    tooltip: params => (params.value ? this.format.dateOnly(params.value) : ''),
    width: 150
  };

  emailToVesselCol: ITypedColDef<
    IControlTowerResidueEGCSDifferenceItemDto,
    boolean
  > = {
    headerName:
      ControlTowerResidueEGCSDifferenceListColumnsLabels.emailToVessel,
    headerTooltip:
      ControlTowerResidueEGCSDifferenceListColumnsLabels.emailToVessel,
    colId: ControlTowerResidueEGCSDifferenceListColumns.emailToVessel,
    field: model('emailToVessel'),
    dtoForExport:
      ControlTowerResidueEGCSDifferenceListExportColumns.emailToVessel,
    cellRenderer: params => {
      if (params.data) {
        const a = document.createElement('span');
        a.innerHTML = params.value ? 'Yes' : 'No';
        return a;
      }
      return null;
    },
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
    IControlTowerResidueEGCSDifferenceItemDto,
    boolean
  > = {
    headerName:
      ControlTowerResidueEGCSDifferenceListColumnsLabels.vesselToWatch,
    headerTooltip:
      ControlTowerResidueEGCSDifferenceListColumnsLabels.vesselToWatch,
    colId: ControlTowerResidueEGCSDifferenceListColumns.vesselToWatch,
    field: model('vesselToWatch'),
    dtoForExport:
      ControlTowerResidueEGCSDifferenceListExportColumns.vesselToWatch,
    cellRenderer: params => {
      if (params.data) {
        const a = document.createElement('span');
        a.innerHTML = params.value ? 'Yes' : 'No';
        return a;
      }
      return null;
    },
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

  sludgePercentageCol: ITypedColDef<
    IControlTowerResidueEGCSDifferenceItemDto,
    ILookupDto
  > = {
    headerName:
      ControlTowerResidueEGCSDifferenceListColumnsLabels.sludgePercentage,
    headerClass: ['aggrid-text-align-right'],
    headerTooltip:
      ControlTowerResidueEGCSDifferenceListColumnsLabels.sludgePercentage,
    colId: ControlTowerResidueEGCSDifferenceListColumns.sludgePercentage,
    field: model('sludgePercentage'),
    valueFormatter: params => this.format.quantity(params.value),
    dtoForExport:
      ControlTowerResidueEGCSDifferenceListExportColumns.sludgePercentage,
    tooltip: params => (params.value ? this.format.quantity(params.value) : ''),
    filter: 'agNumberColumnFilter',
    width: 150
  };

  logBookRobQtyBeforeDeliveryCol: ITypedColDef<
    IControlTowerResidueEGCSDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerResidueEGCSDifferenceListColumnsLabels.logBookRobQtyBeforeDelivery,
    headerClass: ['aggrid-text-align-right'],
    headerTooltip:
      ControlTowerResidueEGCSDifferenceListColumnsLabels.logBookRobQtyBeforeDelivery,
    colId:
      ControlTowerResidueEGCSDifferenceListColumns.logBookRobQtyBeforeDelivery,
    field: model('logBookRobQtyBeforeDelivery'),
    dtoForExport:
      ControlTowerResidueEGCSDifferenceListExportColumns.logBookRobQtyBeforeDelivery,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.logBookRobQtyBeforeDelivery) ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    filter: 'agNumberColumnFilter',
    tooltip: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.logBookRobQtyBeforeDelivery) ?? '-'
        );
        return mergedValues.join(',');
      }
    },
    width: 150
  };

  measuredRobQtyBeforeDeliveryCol: ITypedColDef<
    IControlTowerResidueEGCSDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerResidueEGCSDifferenceListColumnsLabels.measuredRobQtyBeforeDelivery,
    headerClass: ['aggrid-text-align-right'],
    headerTooltip:
      ControlTowerResidueEGCSDifferenceListColumnsLabels.measuredRobQtyBeforeDelivery,
    colId:
      ControlTowerResidueEGCSDifferenceListColumns.measuredRobQtyBeforeDelivery,
    dtoForExport:
      ControlTowerResidueEGCSDifferenceListExportColumns.measuredRobQtyBeforeDelivery,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.measuredRobQtyBeforeDelivery) ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    field: model('measuredRobQtyBeforeDelivery'),
    filter: 'agNumberColumnFilter',
    tooltip: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.measuredRobQtyBeforeDelivery) ?? '-'
        );
        return mergedValues.join(',');
      }
    },
    width: 150
  };

  differenceInRobQuantityCol: ITypedColDef<
    IControlTowerResidueEGCSDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerResidueEGCSDifferenceListColumnsLabels.differenceInRobQuantity,
    headerClass: ['aggrid-text-align-right'],
    headerTooltip:
      ControlTowerResidueEGCSDifferenceListColumnsLabels.differenceInRobQuantity,
    colId: ControlTowerResidueEGCSDifferenceListColumns.differenceInRobQuantity,
    field: model('differenceInRobQuantity'),
    autoHeight: true,
    wrapText: true,
    dtoForExport:
      ControlTowerResidueEGCSDifferenceListExportColumns.differenceInRobQuantity,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.differenceInRobQuantity) ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    filter: 'agNumberColumnFilter',
    tooltip: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.differenceInRobQuantity) ?? '-'
        );
        return mergedValues.join(',');
      }
    },
    width: 150
  };

  robUomCol: ITypedColDef<
    IControlTowerResidueEGCSDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerResidueEGCSDifferenceListColumnsLabels.robUom,
    headerTooltip: ControlTowerResidueEGCSDifferenceListColumnsLabels.robUom,
    colId: ControlTowerResidueEGCSDifferenceListColumns.robUom,
    field: model('robUom'),
    dtoForExport: ControlTowerResidueEGCSDifferenceListExportColumns.robUom,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.robUom?.name ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    tooltip: function(params) {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.robUom?.name ?? '-'
        );
        return mergedValues.join(',');
      }
    },
    width: 150
  };

  progressCol: ITypedColDef<
    IControlTowerResidueEGCSDifferenceItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName: ControlTowerResidueEGCSDifferenceListColumnsLabels.progress,
    headerClass: ['aggrid-text-align-c'],
    headerTooltip: ControlTowerResidueEGCSDifferenceListColumnsLabels.progress,
    colId: ControlTowerResidueEGCSDifferenceListColumns.progress,
    field: model('progress'),
    dtoForExport: ControlTowerResidueEGCSDifferenceListExportColumns.progress,
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

  actionsCol: ITypedColDef<IControlTowerResidueEGCSDifferenceItemDto> = {
    headerName: ControlTowerResidueEGCSDifferenceListColumnsLabels.actions,
    headerClass: ['aggrid-text-align-c'],
    headerTooltip: ControlTowerResidueEGCSDifferenceListColumnsLabels.actions,
    colId: ControlTowerResidueEGCSDifferenceListColumns.actions,
    cellClass: ['aggridtextalign-center'],
    cellRendererFramework: AGGridCellActionsComponent,
    cellRendererParams: { type: 'actions' },
    sortable: false,
    filter: false,
    width: 110
  };
  groupedCounts: {
    noOfNew: number;
    noOfMarkedAsSeen: number;
    noOfResolved: number;
    noOfDefault: number;
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private format: TenantFormattingService,
    private controlTowerService: ControlTowerService,
    private appErrorHandler: AppErrorHandler,
    private databaseManipulation: DatabaseManipulation,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private toastr: ToastrService
  ) {
    super(
      'control-tower-residue-egcs-list-grid-1',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(
        ControlTowerResidueEGCSDifferenceListGridViewModel.name
      )
    );
    this.legacyLookupsDatabase
      .getTableByName('robDifferenceType')
      .then(response => {
        this.differenceType = response.filter(obj => obj.name == 'Egcs')[0];
      });

    this.init(this.gridOptions, true);
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
      this.sludgePercentageCol,
      this.logBookRobQtyBeforeDeliveryCol,
      this.measuredRobQtyBeforeDeliveryCol,
      this.differenceInRobQuantityCol,
      this.robUomCol,
      this.progressCol,
      this.actionsCol
    ];
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
        name: 'Egcs'
      },
      startDate: moment()
        .subtract(6, 'days')
        .format('YYYY-MM-DD'),
      endDate: `${moment().format('YYYY-MM-DD')}T23:59:59`
    };
    this.controlTowerService
      .getEGCSDifferenceFiltersCount(payload)
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
            ModuleError.LoadControlTowerResidueEGCSDifferenceCountFailed
          );
        }
      );
  }

  setDefaultSorting(sortModel, colId) {
    let findElemIndex = _.findIndex(sortModel, function(option: any) {
      return option.colId == colId;
    });
    if (findElemIndex == -1) {
      let newSortModel = [
        {
          colId: colId,
          sort: 'desc'
        }
      ].concat(sortModel);

      console.log(newSortModel);
      return newSortModel;
    } else {
      return sortModel;
    }
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.getFiltersCount();
    this.checkStatusAvailable();
    this.checkFromAndToAvailable();
    this.paramsServerSide = params;
    params.request.sortModel = this.setDefaultSorting(
      params.request.sortModel,
      'differenceInRobQuantity'
    );
    this.exportUrl = this.controlTowerService.getControlTowerResidueEGCSDifferenceListExportUrl();
    this.controlTowerService
      .getControlTowerResidueEGCSDifferenceList$(
        transformLocalToServeGridInfo(
          this.gridApi,
          params,
          ControlTowerResidueEGCSDifferenceListColumnServerKeys,
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
            ModuleError.LoadControlTowerResidueEGCSDifferenceFailed
          );
          params.failCallback();
        }
      );
  }
}
