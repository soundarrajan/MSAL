import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid-community';
import {
  QcSoundingReportDetailsColumns,
  QcSoundingReportDetailsColumnsLabels,
  QcSoundingReportListColumns,
  QcSoundingReportListColumnsLabels
} from './grid-column-constants';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { QcReportDetailsService } from '../../../../../../services/qc-report-details.service';
import { QcSoundingReportItemModel } from '../../../../../../services/models/qc-sounding-report-item.model';
import { QcSoundingReportDetailsItemModel } from '../../../../../../services/models/qc-sounding-report-details-item.model';
import { catchError, first, map, switchMap, tap } from 'rxjs/operators';
import { EMPTY$ } from '@shiptech/core/utils/rxjs-operators';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { IQcSoundingReportItemDto } from '../../../../../../services/api/dto/qc-report-sounding.dto';

function model(prop: keyof QcSoundingReportItemModel): string {
  return prop;
}

function detailsModel(prop: keyof QcSoundingReportDetailsItemModel): string {
  return prop;
}

@Injectable()
export class QcSoundingReportListGridViewModel extends BaseGridViewModel {

  detailsReportIdCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.reportId,
    colId: QcSoundingReportDetailsColumns.reportId,
    field: detailsModel('reportId')
  };

  tankIdCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankId,
    colId: QcSoundingReportDetailsColumns.tankId,
    field: detailsModel('tankId')
  };

  tankNameCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankName,
    colId: QcSoundingReportDetailsColumns.tankName,
    field: detailsModel('tankName')
  };

  fuelDescriptionCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelDescription,
    colId: QcSoundingReportDetailsColumns.fuelDescription,
    field: detailsModel('fuelDescription')
  };

  fuelVolumeCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelVolume,
    colId: QcSoundingReportDetailsColumns.fuelVolume,
    field: detailsModel('fuelVolume')
  };

  tankCapacityCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankCapacity,
    colId: QcSoundingReportDetailsColumns.tankCapacity,
    field: detailsModel('tankCapacity')
  };

  fuelTempCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelTemp,
    colId: QcSoundingReportDetailsColumns.fuelTemp,
    field: detailsModel('fuelTemp')
  };

  tankUnpumpableVolumeCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankUnpumpableVolume,
    colId: QcSoundingReportDetailsColumns.tankUnpumpableVolume,
    field: detailsModel('tankUnpumpableVolume')
  };

  fuelMassCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelMass,
    colId: QcSoundingReportDetailsColumns.fuelMass,
    field: detailsModel('fuelMass')
  };

  detailsGridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 35,
    pagination: false,
    animateRows: true,
    multiSortKey: 'ctrl',
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
      resizable: true
    }
  };

  gridOptions: GridOptions = {
    pagination: false,
    suppressPaginationPanel: true,

    domLayout: 'autoHeight',
    animateRows: true,
    multiSortKey: 'ctrl',

    masterDetail: true,
    keepDetailRows: true,
    keepDetailRowsCount: 100,
    detailCellRendererParams: {
      detailGridOptions: this.detailsGridOptions,
      getDetailRowData: params => this.detailServerSideGetRows(params)
    },

    defaultColDef: {
      sortable: true,
      resizable: true
    }
  };

  vesselNameCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.vesselName,
    colId: QcSoundingReportListColumns.vesselName,
    field: model('vesselName'),
    cellRenderer: 'agGroupCellRenderer'
  };

  vesselCodeCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.vesselCode,
    colId: QcSoundingReportListColumns.vesselCode,
    field: model('vesselCode')
  };

  imoNoCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.imoNo,
    colId: QcSoundingReportListColumns.imoNo,
    field: model('imoNo')
  };

  reportIdCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.reportId,
    colId: QcSoundingReportListColumns.reportId,
    field: model('reportId')
  };

  voyageReferenceCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.voyageReference,
    colId: QcSoundingReportListColumns.voyageReference,
    field: model('voyageReference')
  };

  soundedOnCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.soundedOn,
    colId: QcSoundingReportListColumns.soundedOn,
    field: model('soundedOn')
  };

  soundingReasonCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.soundingReason,
    colId: QcSoundingReportListColumns.soundingReason,
    field: model('soundingReason')
  };

  computedRobHsfoCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.computedRobHsfo,
    colId: QcSoundingReportListColumns.computedRobHsfo,
    field: model('computedRobHsfo')
  };

  measuredRobHsfoCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.measuredRobHsfo,
    colId: QcSoundingReportListColumns.measuredRobHsfo,
    field: model('measuredRobHsfo')
  };

  robHsfoDiffCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.robHsfoDiff,
    colId: QcSoundingReportListColumns.robHsfoDiff,
    field: model('robHsfoDiff')
  };

  computedRobLsfoCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.computedRobLsfo,
    colId: QcSoundingReportListColumns.computedRobLsfo,
    field: model('computedRobLsfo')
  };

  measuredRobLsfoCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.measuredRobLsfo,
    colId: QcSoundingReportListColumns.measuredRobLsfo,
    field: model('measuredRobLsfo')
  };

  robLsfoDiffCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.robLsfoDiff,
    colId: QcSoundingReportListColumns.robLsfoDiff,
    field: model('robLsfoDiff')
  };

  computedRobDogoCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.computedRobDogo,
    colId: QcSoundingReportListColumns.computedRobDogo,
    field: model('computedRobDogo')
  };

  measuredRobDogoCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.measuredRobDogo,
    colId: QcSoundingReportListColumns.measuredRobDogo,
    field: model('measuredRobDogo')
  };

  robDogoDiffCol: ColDef = {
    headerName: QcSoundingReportListColumnsLabels.robDogoDiff,
    colId: QcSoundingReportListColumns.robDogoDiff,
    field: model('robDogoDiff')
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private appErrorHandler: AppErrorHandler,
    private quantityControlService: QcReportDetailsService
  ) {
    super('qc-sounding-report-grid', columnPreferences, changeDetector, loggerFactory.createLogger(QcSoundingReportListGridViewModel.name));
    this.initOptions(this.gridOptions);

    // Note: Do note use async pipe to load data directly in template because angular ag-grid first sets rowData to undefined, which shows no-rows and then triggers loading the data.
    // Note: This would show a glimpse of NoRowsOverlay before actually loading data.
    this.gridReady$
      .pipe(
        first(),
        tap(() => this.gridApi.showLoadingOverlay()),
        // Note: No need for pagination or server-side filtering, everything is loaded in memory.
        switchMap(() => this.quantityControlService.getSoundingReportList({})),
        catchError(error => {
          this.gridApi.hideOverlay();
          return EMPTY$;
        }),
        map(response => response.items),
        tap(items => {
          if (!items || !items.length) {
            this.gridApi.showNoRowsOverlay();
          } else {
            this.gridApi.setRowData(items);
            this.gridApi.hideOverlay();
          }
        })
      ).subscribe();
  }

  getColumnsDefs(): ColDef[] {
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
    this.quantityControlService.getSoundingReportListItemDetails((<IQcSoundingReportItemDto>params.data).soundingReportId, {}).subscribe(
      response => params.successCallback(response.items, response.totalItems),
      error => {
        this.appErrorHandler.handleError(error);
      });
  }
}

