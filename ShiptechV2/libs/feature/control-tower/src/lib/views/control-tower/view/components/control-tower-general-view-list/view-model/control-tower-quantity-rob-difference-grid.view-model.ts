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
import { AGGridCellRendererStatusComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-status/ag-grid-cell-status.component';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';
import { BooleanFilterParams } from '@shiptech/core/ui/components/ag-grid/ag-grid-utils';

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

  public differenceType: ILookupDto;

  public loadingFailed: boolean = false;

  public defaultColFilterParams = {
    buttons:['reset', 'apply'],
    precision: () => this.format.quantityPrecision
  };
  gridOptions: GridOptions = {
    // enableColResize: true,
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
      if (params.value) {
        const a = document.createElement('a');
        a.innerHTML = params.value?.portCallId;
        a.href = `/v2/quantity-control/report/${params.data.quantityControlReport.id}/details`;
        a.setAttribute('target', '_blank');
        return a;
      }
      return null;
    },
    tooltipValueGetter: params =>
      params.value ? params.value?.portCallId : '',
    cellClass: ['aggridlink'],
    width: 200
  };

  portCol: ITypedColDef<IControlTowerQuantityRobDifferenceItemDto, string> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.port,
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.port,
    colId: ControlTowerQuantityRobDifferenceListColumns.port,
    field: model('port'),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.port,
    tooltipValueGetter: params => (params.value ? params.value : ''),
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
    valueFormatter: params => params.value,
    tooltipValueGetter: params => (params.value ? params.value : ''),
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
    tooltipValueGetter: params =>
      params.value ? this.format.date(params.value) : '',
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
    valueFormatter: params => this.format.dateOnly(params.value),
    tooltipValueGetter: params =>
      params.value ? this.format.dateOnly(params.value) : '',
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
      if (params.data) {
        const a = document.createElement('span');
        a.innerHTML = params.value ? 'Yes' : 'No';
        return a;
      }
      return null;
    },
    tooltipValueGetter: params => {
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
      if (params.data) {
        const a = document.createElement('span');
        a.classList.add('vessel-to-watch');
        params.value ? a.classList.add('yes') : a.classList.add('no');
        a.innerHTML = params.value ? 'Yes' : 'No';
        return a;
      }
      return null;
    },
    tooltipValueGetter: params => {
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
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.productType?.name ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    tooltipValueGetter: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.productType?.name ?? '-'
        );
        return mergedValues.join(',');
      }
    },
    width: 150
  };

  logBookRobQtyBeforeDeliveryCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.logBookRobQtyBeforeDelivery,
    headerClass: ['aggrid-text-align-right'],
    headerTooltip:
      ControlTowerQuantityRobDifferenceListColumnsLabels.logBookRobQtyBeforeDelivery,
    colId:
      ControlTowerQuantityRobDifferenceListColumns.logBookRobQtyBeforeDelivery,
    field: model('logBookRobQtyBeforeDelivery'),
    dtoForExport:
      ControlTowerQuantityRobDifferenceListExportColumns.logBookRobQtyBeforeDelivery,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.logBookRobQtyBeforeDelivery) ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    filter: 'agNumberColumnFilter',
    tooltipValueGetter: params => {
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
    IControlTowerQuantityRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.measuredRobQtyBeforeDelivery,
    headerClass: ['aggrid-text-align-right'],
    headerTooltip:
      ControlTowerQuantityRobDifferenceListColumnsLabels.measuredRobQtyBeforeDelivery,
    colId:
      ControlTowerQuantityRobDifferenceListColumns.measuredRobQtyBeforeDelivery,
    dtoForExport:
      ControlTowerQuantityRobDifferenceListExportColumns.measuredRobQtyBeforeDelivery,
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
    tooltipValueGetter: params => {
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
    IControlTowerQuantityRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.differenceInRobQuantity,
    headerClass: ['aggrid-text-align-right'],
    headerTooltip:
      ControlTowerQuantityRobDifferenceListColumnsLabels.differenceInRobQuantity,
    colId: ControlTowerQuantityRobDifferenceListColumns.differenceInRobQuantity,
    field: model('differenceInRobQuantity'),
    autoHeight: true,
    wrapText: true,
    dtoForExport:
      ControlTowerQuantityRobDifferenceListExportColumns.differenceInRobQuantity,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => this.format.quantity(a.differenceInRobQuantity) ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    filter: 'agNumberColumnFilter',
    tooltipValueGetter: params => {
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
    IControlTowerQuantityRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.robUom,
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.robUom,
    colId: ControlTowerQuantityRobDifferenceListColumns.robUom,
    field: model('robUom'),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.robUom,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.robUom?.name ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    tooltipValueGetter: function(params) {
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
    IControlTowerQuantityRobDifferenceItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.progress,
    headerClass: ['aggrid-text-align-c'],
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.progress,
    colId: ControlTowerQuantityRobDifferenceListColumns.progress,
    field: model('progress'),
    dtoForExport: ControlTowerQuantityRobDifferenceListExportColumns.progress,
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
    tooltipValueGetter: params =>
      params.value ? params.value?.displayName : '',
    width: 150
  };

  actionsCol: ITypedColDef<IControlTowerQuantityRobDifferenceItemDto> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.actions,
    headerClass: ['aggrid-text-align-c'],
    headerTooltip: ControlTowerQuantityRobDifferenceListColumnsLabels.actions,
    colId: ControlTowerQuantityRobDifferenceListColumns.actions,
    cellClass: ['aggridtextalign-center'],
    cellRendererFramework: AGGridCellActionsComponent,
    cellRendererParams: { type: 'actions' },
    width: 110,
    sortable: false,
    filter: false
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
      'control-tower-quantity-rob-list-grid-9',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(
        ControlTowerQuantityRobDifferenceListGridViewModel.name
      )
    );
    this.legacyLookupsDatabase
      .getTableByName('robDifferenceType')
      .then(response => {
        this.differenceType = response.filter(obj => obj.name == 'Rob')[0];
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
      this.productTypeCol,
      this.logBookRobQtyBeforeDeliveryCol,
      this.measuredRobQtyBeforeDeliveryCol,
      this.differenceInRobQuantityCol,
      this.robUomCol,
      this.progressCol,
      this.actionsCol
    ];
  }

  public updateValues(ev, values): void {
    const rowNode = this.gridApi.getRowNode(ev.data.id.toString());
    if (values?.status) {
      const newStatus = _.cloneDeep(values.status);
      rowNode.setDataValue('progress', newStatus);
      this.getCountForDefultFilters();
    }
  }

  public filterGridNew(statusName: string): void {
    this.filterByStatus(statusName);
  }

  public filterGridMAS(statusName: string): void {
    this.filterByStatus(statusName);
  }

  public filterGridResolved(statusName: string): void {
    this.filterByStatus(statusName);
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
        name: 'Rob'
      },
      startDate: moment()
        .subtract(6, 'days')
        .format('YYYY-MM-DD'),
      endDate: `${moment().format('YYYY-MM-DD')}T23:59:59`
    };
    this.controlTowerService
      .getRobDifferenceFiltersCount(payload)
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
            ModuleError.LoadControlTowerQuantityRobDifferenceCountFailed
          );
        }
      );
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.getFiltersCount();
    this.checkStatusAvailable();
    this.checkFromAndToAvailable();
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
          params.successCallback(
            response.payload,
            response.payload[0]?.totalCount ?? 0
          );
        },
        () => {
          this.loadingFailed = true;
          this.appErrorHandler.handleError(
            ModuleError.LoadControlTowerQuantityRobDifferenceFailed
          );
          params.failCallback();
        }
      );
  }
}
