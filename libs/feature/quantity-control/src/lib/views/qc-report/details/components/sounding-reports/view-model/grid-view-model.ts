import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { GridOptions } from '@ag-grid-community/core';
import { QcSoundingReportDetailsColumns, QcSoundingReportDetailsColumnsLabels, QcSoundingReportListColumns, QcSoundingReportListColumnsLabels } from './grid-column-constants';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { QcReportService } from '../../../../../../services/qc-report.service';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EMPTY$ } from '@shiptech/core/utils/rxjs-operators';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { IQcSoundingReportDetailsItemDto, IQcSoundingReportItemDto } from '../../../../../../services/api/dto/qc-report-sounding.dto';
import { ITypedColDef } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { IQcReportDetailsState } from '../../../../../../store/report/details/qc-report-details.model';
import { combineLatest, Observable, of } from 'rxjs';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';
import { Store } from '@ngxs/store';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { IGetSoundingReportListResponse } from '../../../../../../services/api/request-response/sounding-reports.request-response';

function model(prop: keyof IQcSoundingReportItemDto): keyof IQcSoundingReportItemDto {
  return prop;
}

function detailsModel(prop: keyof IQcSoundingReportDetailsItemDto): keyof IQcSoundingReportDetailsItemDto {
  return prop;
}

@Injectable()
export class QcSoundingReportListGridViewModel extends BaseGridViewModel {

  private defaultColFilterParams = {
    clearButton: true,
    applyButton: true,
    precision: () => this.format.quantityPrecision
  };

  detailsReportIdCol: ITypedColDef<IQcSoundingReportDetailsItemDto, string> = {
    headerName: QcSoundingReportDetailsColumnsLabels.reportId,
    colId: QcSoundingReportDetailsColumns.reportId,
    field: detailsModel('reportId')
  };

  tankIdCol: ITypedColDef<IQcSoundingReportDetailsItemDto, string> = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankId,
    colId: QcSoundingReportDetailsColumns.tankId,
    field: detailsModel('tankId')
  };

  tankNameCol: ITypedColDef<IQcSoundingReportDetailsItemDto, string> = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankName,
    colId: QcSoundingReportDetailsColumns.tankName,
    field: detailsModel('tankName')
  };

  fuelDescriptionCol: ITypedColDef<IQcSoundingReportDetailsItemDto, string> = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelDescription,
    colId: QcSoundingReportDetailsColumns.fuelDescription,
    field: detailsModel('fuelDescriptor')
  };

  fuelVolumeCol: ITypedColDef<IQcSoundingReportDetailsItemDto, number> = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelVolume,
    colId: QcSoundingReportDetailsColumns.fuelVolume,
    field: detailsModel('fuelVolume'),
    valueFormatter: params => this.format.quantity(params.value),
    filter: 'agNumberColumnFilter'
  };

  tankCapacityCol: ITypedColDef<IQcSoundingReportDetailsItemDto, number> = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankCapacity,
    colId: QcSoundingReportDetailsColumns.tankCapacity,
    field: detailsModel('tankCapacity'),
    valueFormatter: params => this.format.quantity(params.value),
    filter: 'agNumberColumnFilter'
  };

  fuelTempCol: ITypedColDef<IQcSoundingReportDetailsItemDto, number> = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelTemp,
    colId: QcSoundingReportDetailsColumns.fuelTemp,
    field: detailsModel('fuelTemperature'),
    valueFormatter: params => this.format.quantity(params.value),
    filter: 'agNumberColumnFilter'
  };

  tankUnpumpableVolumeCol: ITypedColDef<IQcSoundingReportDetailsItemDto, number> = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankUnpumpableVolume,
    colId: QcSoundingReportDetailsColumns.tankUnpumpableVolume,
    field: detailsModel('tankUnpumpableVolume'),
    valueFormatter: params => this.format.quantity(params.value),
    filter: 'agNumberColumnFilter'
  };

  fuelMassCol: ITypedColDef<IQcSoundingReportDetailsItemDto, number> = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelMass,
    colId: QcSoundingReportDetailsColumns.fuelMass,
    field: detailsModel('fuelMass'),
    valueFormatter: params => this.format.quantity(params.value),
    filter: 'agNumberColumnFilter'
  };

  detailsGridOptions: GridOptions = {
    groupHeaderHeight: 40,
    headerHeight: 25,
    rowHeight: 21,
    pagination: false,
    animateRows: true,
    multiSortKey: 'ctrl',
    domLayout: 'autoHeight',
    suppressContextMenu: true,
    columnDefs: [
      this.detailsReportIdCol,
      this.tankIdCol,
      this.tankNameCol,
      this.fuelDescriptionCol,
      this.fuelVolumeCol,
      this.tankCapacityCol,
      this.fuelTempCol,
      this.tankUnpumpableVolumeCol,
      this.fuelMassCol
    ],
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  gridOptions: GridOptions = {
    groupHeaderHeight: 40,
    headerHeight: 25,
    rowHeight: 21,
    pagination: false,
    suppressPaginationPanel: true,

    domLayout: 'autoHeight',
    animateRows: true,
    multiSortKey: 'ctrl',

    masterDetail: true,
    keepDetailRows: true,
    keepDetailRowsCount: 100,
    suppressContextMenu: true,

    detailCellRendererParams: {
      detailGridOptions: this.detailsGridOptions,
      getDetailRowData: params => this.detailServerSideGetRows(params)
    },

    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  vesselNameCol: ITypedColDef<IQcSoundingReportItemDto, string> = {
    headerName: QcSoundingReportListColumnsLabels.vesselName,
    colId: QcSoundingReportListColumns.vesselName,
    field: model('vesselName'),
    cellRenderer: 'agGroupCellRenderer'
  };

  vesselCodeCol: ITypedColDef<IQcSoundingReportItemDto, string> = {
    headerName: QcSoundingReportListColumnsLabels.vesselCode,
    colId: QcSoundingReportListColumns.vesselCode,
    field: model('vesselCode')
  };

  imoNoCol: ITypedColDef<IQcSoundingReportItemDto, string> = {
    headerName: QcSoundingReportListColumnsLabels.imoNo,
    colId: QcSoundingReportListColumns.imoNo,
    field: model('imoNo')
  };

  reportIdCol: ITypedColDef<IQcSoundingReportItemDto, string> = {
    headerName: QcSoundingReportListColumnsLabels.reportId,
    colId: QcSoundingReportListColumns.reportId,
    field: model('reportId')
  };

  voyageReferenceCol: ITypedColDef<IQcSoundingReportItemDto, string> = {
    headerName: QcSoundingReportListColumnsLabels.voyageReference,
    colId: QcSoundingReportListColumns.voyageReference,
    field: model('voyageReference')
  };

  soundedOnCol: ITypedColDef<IQcSoundingReportItemDto, string> = {
    headerName: QcSoundingReportListColumnsLabels.soundedOn,
    colId: QcSoundingReportListColumns.soundedOn,
    field: model('soundedOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value)
  };

  soundingReasonCol: ITypedColDef<IQcSoundingReportItemDto, string> = {
    headerName: QcSoundingReportListColumnsLabels.soundingReason,
    colId: QcSoundingReportListColumns.soundingReason,
    field: model('soundingReason')
  };

  computedRobHsfoCol: ITypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.computedRobHsfo,
    colId: QcSoundingReportListColumns.computedRobHsfo,
    field: model('computedRobHsfo')
  };

  measuredRobHsfoCol: ITypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.measuredRobHsfo,
    colId: QcSoundingReportListColumns.measuredRobHsfo,
    field: model('measuredRobHsfo')
  };

  robHsfoDiffCol: ITypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.robHsfoDiff,
    colId: QcSoundingReportListColumns.robHsfoDiff,
    field: model('robHsfoDiff')
  };

  computedRobLsfoCol: ITypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.computedRobLsfo,
    colId: QcSoundingReportListColumns.computedRobLsfo,
    field: model('computedRobLsfo')
  };

  measuredRobLsfoCol: ITypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.measuredRobLsfo,
    colId: QcSoundingReportListColumns.measuredRobLsfo,
    field: model('measuredRobLsfo')
  };

  robLsfoDiffCol: ITypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.robLsfoDiff,
    colId: QcSoundingReportListColumns.robLsfoDiff,
    field: model('robLsfoDiff')
  };

  computedRobDogoCol: ITypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.computedRobDogo,
    colId: QcSoundingReportListColumns.computedRobDogo,
    field: model('computedRobDogo')
  };

  measuredRobDogoCol: ITypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.measuredRobDogo,
    colId: QcSoundingReportListColumns.measuredRobDogo,
    field: model('measuredRobDogo')
  };

  robDogoDiffCol: ITypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.robDogoDiff,
    colId: QcSoundingReportListColumns.robDogoDiff,
    field: model('robDogoDiff')
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private format: TenantFormattingService,
    private appErrorHandler: AppErrorHandler,
    private reportService: QcReportService,
    private store: Store
  ) {
    super('qc-sounding-report-grid', columnPreferences, changeDetector, loggerFactory.createLogger(QcSoundingReportListGridViewModel.name));
    this.init(this.gridOptions);

    // Note: Do note use async pipe to load data directly in template because angular ag-grid first sets rowData to undefined, which shows no-rows and then triggers loading the data.
    // Note: This would show a glimpse of NoRowsOverlay before actually loading data.
    combineLatest(
      this.gridReady$,
      this.selectReportDetails(state => state.portCall) // Note: When portCall changes we need to reload the grid,
    )
      .pipe(
        tap(() => this.gridApi.showLoadingOverlay()),
        // Note: No need for pagination or server-side filtering, everything is loaded in memory.
        switchMap(([_, portCallId]) => {
          if (!portCallId)
            return of(<IGetSoundingReportListResponse>{
              items: [],
              totalCount: 0
            });

          return this.reportService.getSoundingReportList$({});
        }),
        catchError(() => {
          this.gridApi.hideOverlay();
          return EMPTY$;
        }),
        map(response => response.items),
        tap(items => {
          this.gridApi.setRowData(items);

          if (!items || !items.length) {
            this.gridApi.showNoRowsOverlay();
          } else {
            this.gridApi.hideOverlay();
          }
        }),
        takeUntil(this.destroy$)
      ).subscribe();
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.vesselNameCol,
      this.vesselCodeCol,
      this.imoNoCol,
      this.reportIdCol,
      this.voyageReferenceCol,
      this.soundedOnCol,
      this.soundingReasonCol,
      this.computedRobHsfoCol,
      this.measuredRobHsfoCol,
      this.robHsfoDiffCol,
      this.computedRobLsfoCol,
      this.measuredRobLsfoCol,
      this.robLsfoDiffCol,
      this.computedRobDogoCol,
      this.measuredRobDogoCol,
      this.robDogoDiffCol
    ];
  }

  protected detailServerSideGetRows(params: any): void {
    this.reportService.getSoundingReportListItemDetails$((<IQcSoundingReportItemDto>params.data).id, {}).subscribe(
      response => params.successCallback(response.items, response.totalCount),
      error => {
        this.appErrorHandler.handleError(error);
      });
  }

  private selectReportDetails<T>(select: ((state: IQcReportDetailsState) => T)): Observable<T> {
    return this.store.select((appState: IAppState) => select(appState?.quantityControl?.report?.details));
  }

  protected get reportDetailsState(): IQcReportDetailsState {
    // Note: Always get a fresh reference to the state.
    return (<IAppState>this.store.snapshot()).quantityControl.report.details;
  }
}

