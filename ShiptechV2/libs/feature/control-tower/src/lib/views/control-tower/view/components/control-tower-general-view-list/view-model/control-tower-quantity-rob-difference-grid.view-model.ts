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
        a.href = `/quantity-control/report/${params.data.quantityControlReport.id}/details`;
        a.setAttribute('target', '_blank');
        return a;
      }
      return null;
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
      if (params.data) {
        const a = document.createElement('span');
        a.innerHTML = params.value ? 'Yes' : 'No';
        return a;
      }
      return null;
    },
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
      if (params.data) {
        const a = document.createElement('span');
        a.innerHTML = params.value ? 'Yes' : 'No';
        return a;
      }
      return null;
    },
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
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.productType?.name ?? '-'
        );
        return mergedValues.join('<br>');
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
    width: 150
  };

  measuredRobQtyBeforeDeliveryCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.measuredRobQtyBeforeDelivery,
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
    width: 150
  };

  differenceInRobQuantityCol: ITypedColDef<
    IControlTowerQuantityRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.differenceInRobQuantity,
    headerTooltip:
      ControlTowerQuantityRobDifferenceListColumnsLabels.differenceInRobQuantity,
    colId: ControlTowerQuantityRobDifferenceListColumns.differenceInRobQuantity,
    field: model('differenceInRobQuantity'),
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
    private databaseManipulation: DatabaseManipulation,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private toastr: ToastrService
  ) {
    super(
      'control-tower-quantity-rob-list-grid-5',
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
    if (values) {
      let payloadData = {
        differenceType: this.differenceType,
        quantityControlReport: {
          id: ev.data.quantityControlReport.id
        },
        status: values.data.status,
        comments: values.data.comments
      };

      this.controlTowerService
        .saveQuantityResiduePopUp(payloadData, payloadData => {
          console.log('asd');
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: any) => {
          if (typeof response == 'string') {
            this.toastr.error(response);
          } else {
            this.gridApi.purgeServerSideCache();
          }
        });
    }
    return;
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
          if ((<any>value).filter === 'New') {
            this.toggleNewFilter = !this.toggleNewFilter;
            this.toggleMASFilter = true;
            this.toggleResolvedFilter = true;
          } else if ((<any>value).filter === 'MarkedAsSeen') {
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
}
