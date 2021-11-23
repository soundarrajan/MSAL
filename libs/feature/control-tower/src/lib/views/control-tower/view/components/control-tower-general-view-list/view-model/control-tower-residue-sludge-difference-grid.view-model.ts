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
import { IControlTowerResidueSludgeDifferenceItemDto } from 'libs/feature/control-tower/src/lib/services/api/dto/control-tower-list-item.dto';
import {
  ControlTowerResidueSludgeDifferenceListColumns,
  ControlTowerResidueSludgeDifferenceListColumnServerKeys,
  ControlTowerResidueSludgeDifferenceListColumnsLabels,
  ControlTowerResidueSludgeDifferenceListExportColumns
} from '../list-columns/control-tower-residue-sludge-difference-list.columns';
import { BooleanFilterParams } from '@shiptech/core/ui/components/ag-grid/ag-grid-utils';

function model(
  prop: keyof IControlTowerResidueSludgeDifferenceItemDto
): keyof IControlTowerResidueSludgeDifferenceItemDto {
  return prop;
}

@Injectable()
export class ControlTowerResidueDifferenceListGridViewModel extends BaseGridViewModel {
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
    getRowNodeId: (data: IControlTowerResidueSludgeDifferenceItemDto) => {
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
    IControlTowerResidueSludgeDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerResidueSludgeDifferenceListColumnsLabels.portCall,
    headerTooltip:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.portCall,
    colId: ControlTowerResidueSludgeDifferenceListColumns.portCall,
    field: model('portCall'),
    dtoForExport: ControlTowerResidueSludgeDifferenceListExportColumns.portCall,
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

  portCol: ITypedColDef<IControlTowerResidueSludgeDifferenceItemDto, string> = {
    headerName: ControlTowerResidueSludgeDifferenceListColumnsLabels.port,
    headerTooltip: ControlTowerResidueSludgeDifferenceListColumnsLabels.port,
    colId: ControlTowerResidueSludgeDifferenceListColumns.port,
    field: model('port'),
    dtoForExport: ControlTowerResidueSludgeDifferenceListExportColumns.port,
    tooltip: params => (params.value ? params.value : ''),
    width: 150
  };

  vesselCol: ITypedColDef<
    IControlTowerResidueSludgeDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerResidueSludgeDifferenceListColumnsLabels.vessel,
    headerTooltip: ControlTowerResidueSludgeDifferenceListColumnsLabels.vessel,
    colId: ControlTowerResidueSludgeDifferenceListColumns.vessel,
    field: model('vessel'),
    dtoForExport: ControlTowerResidueSludgeDifferenceListExportColumns.vessel,
    valueFormatter: params => params.value,
    tooltip: params => (params.value ? params.value : ''),
    width: 150
  };

  etaCol: ITypedColDef<IControlTowerResidueSludgeDifferenceItemDto, string> = {
    headerName: ControlTowerResidueSludgeDifferenceListColumnsLabels.eta,
    headerTooltip: ControlTowerResidueSludgeDifferenceListColumnsLabels.eta,
    colId: ControlTowerResidueSludgeDifferenceListColumns.eta,
    field: model('eta'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    dtoForExport: ControlTowerResidueSludgeDifferenceListExportColumns.eta,
    tooltip: params => (params.value ? this.format.date(params.value) : ''),
    width: 150
  };

  surveyorDate: ITypedColDef<
    IControlTowerResidueSludgeDifferenceItemDto,
    string
  > = {
    headerName:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.surveyorDate,
    headerTooltip:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.surveyorDate,
    colId: ControlTowerResidueSludgeDifferenceListColumns.surveyorDate,
    field: model('surveyorDate'),
    dtoForExport:
      ControlTowerResidueSludgeDifferenceListExportColumns.surveyorDate,
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    tooltip: params => (params.value ? this.format.date(params.value) : ''),
    width: 150
  };

  emailToVesselCol: ITypedColDef<
    IControlTowerResidueSludgeDifferenceItemDto,
    boolean
  > = {
    headerName:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.emailToVessel,
    headerTooltip:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.emailToVessel,
    colId: ControlTowerResidueSludgeDifferenceListColumns.emailToVessel,
    field: model('emailToVessel'),
    dtoForExport:
      ControlTowerResidueSludgeDifferenceListExportColumns.emailToVessel,
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
    IControlTowerResidueSludgeDifferenceItemDto,
    boolean
  > = {
    headerName:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.vesselToWatch,
    headerTooltip:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.vesselToWatch,
    colId: ControlTowerResidueSludgeDifferenceListColumns.vesselToWatch,
    field: model('vesselToWatch'),
    dtoForExport:
      ControlTowerResidueSludgeDifferenceListExportColumns.vesselToWatch,
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
    IControlTowerResidueSludgeDifferenceItemDto,
    ILookupDto
  > = {
    headerName:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.sludgePercentage,
    headerTooltip:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.sludgePercentage,
    colId: ControlTowerResidueSludgeDifferenceListColumns.sludgePercentage,
    field: model('sludgePercentage'),
    valueFormatter: params => this.format.quantity(params.value),
    dtoForExport:
      ControlTowerResidueSludgeDifferenceListExportColumns.sludgePercentage,
    tooltip: params => (params.value ? this.format.quantity(params.value) : ''),
    filter: 'agNumberColumnFilter',
    width: 150
  };

  logBookRobQtyBeforeDeliveryCol: ITypedColDef<
    IControlTowerResidueSludgeDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.logBookRobQtyBeforeDelivery,
    headerTooltip:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.logBookRobQtyBeforeDelivery,
    colId:
      ControlTowerResidueSludgeDifferenceListColumns.logBookRobQtyBeforeDelivery,
    field: model('logBookRobQtyBeforeDelivery'),
    dtoForExport:
      ControlTowerResidueSludgeDifferenceListExportColumns.logBookRobQtyBeforeDelivery,
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
    IControlTowerResidueSludgeDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.measuredRobQtyBeforeDelivery,
    headerTooltip:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.measuredRobQtyBeforeDelivery,
    colId:
      ControlTowerResidueSludgeDifferenceListColumns.measuredRobQtyBeforeDelivery,
    dtoForExport:
      ControlTowerResidueSludgeDifferenceListExportColumns.measuredRobQtyBeforeDelivery,
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
    IControlTowerResidueSludgeDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.differenceInRobQuantity,
    headerTooltip:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.differenceInRobQuantity,
    colId:
      ControlTowerResidueSludgeDifferenceListColumns.differenceInRobQuantity,
    field: model('differenceInRobQuantity'),
    autoHeight: true,
    wrapText: true,
    dtoForExport:
      ControlTowerResidueSludgeDifferenceListExportColumns.differenceInRobQuantity,
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
    IControlTowerResidueSludgeDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerResidueSludgeDifferenceListColumnsLabels.robUom,
    headerTooltip: ControlTowerResidueSludgeDifferenceListColumnsLabels.robUom,
    colId: ControlTowerResidueSludgeDifferenceListColumns.robUom,
    field: model('robUom'),
    dtoForExport: ControlTowerResidueSludgeDifferenceListExportColumns.robUom,
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
    IControlTowerResidueSludgeDifferenceItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName: ControlTowerResidueSludgeDifferenceListColumnsLabels.progress,
    headerTooltip:
      ControlTowerResidueSludgeDifferenceListColumnsLabels.progress,
    colId: ControlTowerResidueSludgeDifferenceListColumns.progress,
    field: model('progress'),
    headerClass: 'aggrid-text-align-c',
    dtoForExport: ControlTowerResidueSludgeDifferenceListExportColumns.progress,
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

  actionsCol: ITypedColDef<IControlTowerResidueSludgeDifferenceItemDto> = {
    headerName: ControlTowerResidueSludgeDifferenceListColumnsLabels.actions,
    headerTooltip: ControlTowerResidueSludgeDifferenceListColumnsLabels.actions,
    colId: ControlTowerResidueSludgeDifferenceListColumns.actions,
    headerClass: ['aggrid-text-align-c'],
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
      'control-tower-residue-sludge-list-grid-5',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(
        ControlTowerResidueDifferenceListGridViewModel.name
      )
    );
    this.legacyLookupsDatabase
      .getTableByName('robDifferenceType')
      .then(response => {
        this.differenceType = response.filter(obj => obj.name == 'Sludge')[0];
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
    this.gridApi.purgeServerSideCache();
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
      if(this.groupedCounts) {
        return false;
      }
      let payload = {
        "differenceType" : {
          "name" : "Sludge"
          },
          "startDate": moment()
            .subtract(6, "days")
            .format('YYYY-MM-DD'),
          "endDate": moment().format('YYYY-MM-DD'),          
      };
      this.controlTowerService.getSludgeDifferenceFiltersCount(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => {
          this.noOfDefault = response.noOfLastSevenDays;
          this.noOfNew = response.noOfNew;
          this.noOfMarkedAsSeen = response.noOfMarkedAsSeen;
          this.noOfResolved = response.noOfResolved;
          this.groupedCounts = {
            noOfDefault : this.noOfDefault,
            noOfNew : this.noOfNew,
            noOfMarkedAsSeen : this.noOfMarkedAsSeen,
            noOfResolved : this.noOfResolved,
          }
          this.changeDetector.detectChanges();
        },
        () => {
          this.appErrorHandler.handleError(
            ModuleError.LoadControlTowerQuantityRobDifferenceFailed
          );
        }
      );    
  }


  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.getFiltersCount();
    this.checkStatusAvailable();
    this.checkFromAndToAvailable();
    this.paramsServerSide = params;
    this.exportUrl = this.controlTowerService.getControlTowerResidueSludgeDifferenceListExportUrl();
    this.controlTowerService
      .getControlTowerResidueSludgeDifferenceList$(
        transformLocalToServeGridInfo(
          this.gridApi,
          params,
          ControlTowerResidueSludgeDifferenceListColumnServerKeys,
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
            ModuleError.LoadControlTowerQuantityRobDifferenceFailed
          );
          params.failCallback();
        }
      );
  }
}
