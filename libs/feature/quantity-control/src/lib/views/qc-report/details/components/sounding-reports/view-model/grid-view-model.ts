import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import {
  QcSoundingReportDetailsColumns,
  QcSoundingReportDetailsColumnsLabels,
  QcSoundingReportListColumns,
  QcSoundingReportListColumnsLabels
} from './grid-column-constants';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { QcReportService } from '../../../../../../services/qc-report.service';
import { catchError, first, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EMPTY$ } from '@shiptech/core/utils/rxjs-operators';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import {
  IQcSoundingReportDetailsItemDto,
  IQcSoundingReportItemDto
} from '../../../../../../services/api/dto/qc-report-sounding.dto';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import moment from 'moment';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import { TypedColDef } from '@shiptech/core/ui/components/ag-grid/type.definition';

function model(prop: keyof IQcSoundingReportItemDto): keyof IQcSoundingReportItemDto {
  return prop;
}

function detailsModel(prop: keyof IQcSoundingReportDetailsItemDto): keyof IQcSoundingReportDetailsItemDto {
  return prop;
}

@Injectable()
export class QcSoundingReportListGridViewModel extends BaseGridViewModel {

  detailsReportIdCol: TypedColDef<IQcSoundingReportDetailsItemDto, string> = {
    headerName: QcSoundingReportDetailsColumnsLabels.reportId,
    colId: QcSoundingReportDetailsColumns.reportId,
    field: detailsModel('id')
  };

  tankIdCol: TypedColDef<IQcSoundingReportDetailsItemDto, string> = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankId,
    colId: QcSoundingReportDetailsColumns.tankId,
    field: detailsModel('tankId')
  };

  tankNameCol: TypedColDef<IQcSoundingReportDetailsItemDto, string> = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankName,
    colId: QcSoundingReportDetailsColumns.tankName,
    field: detailsModel('tankName')
  };

  fuelDescriptionCol: TypedColDef<IQcSoundingReportDetailsItemDto, string> = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelDescription,
    colId: QcSoundingReportDetailsColumns.fuelDescription,
    field: detailsModel('fuelDescriptor')
  };

  fuelVolumeCol: TypedColDef<IQcSoundingReportDetailsItemDto, number> = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelVolume,
    colId: QcSoundingReportDetailsColumns.fuelVolume,
    field: detailsModel('fuelVolume'),
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    filter: 'agNumberColumnFilter'
  };

  tankCapacityCol: TypedColDef<IQcSoundingReportDetailsItemDto, number> = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankCapacity,
    colId: QcSoundingReportDetailsColumns.tankCapacity,
    field: detailsModel('tankCapacity'),
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    filter: 'agNumberColumnFilter'
  };

  fuelTempCol: TypedColDef<IQcSoundingReportDetailsItemDto, number> = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelTemp,
    colId: QcSoundingReportDetailsColumns.fuelTemp,
    field: detailsModel('fuelTemperature'),
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    filter: 'agNumberColumnFilter'
  };

  tankUnpumpableVolumeCol: TypedColDef<IQcSoundingReportDetailsItemDto, number> = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankUnpumpableVolume,
    colId: QcSoundingReportDetailsColumns.tankUnpumpableVolume,
    field: detailsModel('tankUnpumpableVolume'),
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    filter: 'agNumberColumnFilter'
  };

  fuelMassCol: TypedColDef<IQcSoundingReportDetailsItemDto, number> = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelMass,
    colId: QcSoundingReportDetailsColumns.fuelMass,
    field: detailsModel('fuelMass'),
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    filter: 'agNumberColumnFilter'
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
      resizable: true,
      filter: 'agTextColumnFilter'
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
      resizable: true,
      filter: 'agTextColumnFilter'
    }
  };

  vesselNameCol: TypedColDef<IQcSoundingReportItemDto, string> = {
    headerName: QcSoundingReportListColumnsLabels.vesselName,
    colId: QcSoundingReportListColumns.vesselName,
    field: model('vesselName'),
    cellRenderer: 'agGroupCellRenderer'
  };

  vesselCodeCol: TypedColDef<IQcSoundingReportItemDto, string> = {
    headerName: QcSoundingReportListColumnsLabels.vesselCode,
    colId: QcSoundingReportListColumns.vesselCode,
    field: model('vesselCode')
  };

  imoNoCol: TypedColDef<IQcSoundingReportItemDto, string> = {
    headerName: QcSoundingReportListColumnsLabels.imoNo,
    colId: QcSoundingReportListColumns.imoNo,
    field: model('imoNo')
  };

  reportIdCol: TypedColDef<IQcSoundingReportItemDto, string> = {
    headerName: QcSoundingReportListColumnsLabels.reportId,
    colId: QcSoundingReportListColumns.reportId,
    field: model('reportId')
  };

  voyageReferenceCol: TypedColDef<IQcSoundingReportItemDto, string> = {
    headerName: QcSoundingReportListColumnsLabels.voyageReference,
    colId: QcSoundingReportListColumns.voyageReference,
    field: model('voyageReference')
  };

  soundedOnCol: TypedColDef<IQcSoundingReportItemDto, Date | string> = {
    headerName: QcSoundingReportListColumnsLabels.soundedOn,
    colId: QcSoundingReportListColumns.soundedOn,
    field: model('soundedOn'),
    valueFormatter: params => params.value ? moment(params.value).format(dateTimeAdapter.fromDotNet(this.dateFormat)) : undefined
  };

  soundingReasonCol: TypedColDef<IQcSoundingReportItemDto, string> = {
    headerName: QcSoundingReportListColumnsLabels.soundingReason,
    colId: QcSoundingReportListColumns.soundingReason,
    field: model('soundingReason')
  };

  computedRobHsfoCol: TypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.computedRobHsfo,
    colId: QcSoundingReportListColumns.computedRobHsfo,
    field: model('computedRobHsfo')
  };

  measuredRobHsfoCol: TypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.measuredRobHsfo,
    colId: QcSoundingReportListColumns.measuredRobHsfo,
    field: model('measuredRobHsfo')
  };

  robHsfoDiffCol: TypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.robHsfoDiff,
    colId: QcSoundingReportListColumns.robHsfoDiff,
    field: model('robHsfoDiff')
  };

  computedRobLsfoCol: TypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.computedRobLsfo,
    colId: QcSoundingReportListColumns.computedRobLsfo,
    field: model('computedRobLsfo')
  };

  measuredRobLsfoCol: TypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.measuredRobLsfo,
    colId: QcSoundingReportListColumns.measuredRobLsfo,
    field: model('measuredRobLsfo')
  };

  robLsfoDiffCol: TypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.robLsfoDiff,
    colId: QcSoundingReportListColumns.robLsfoDiff,
    field: model('robLsfoDiff')
  };

  computedRobDogoCol: TypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.computedRobDogo,
    colId: QcSoundingReportListColumns.computedRobDogo,
    field: model('computedRobDogo')
  };

  measuredRobDogoCol: TypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.measuredRobDogo,
    colId: QcSoundingReportListColumns.measuredRobDogo,
    field: model('measuredRobDogo')
  };

  robDogoDiffCol: TypedColDef<IQcSoundingReportItemDto, number> = {
    headerName: QcSoundingReportListColumnsLabels.robDogoDiff,
    colId: QcSoundingReportListColumns.robDogoDiff,
    field: model('robDogoDiff')
  };

  private readonly dateFormat: string;
  private readonly quantityPrecision: number;

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    tenantSettings: TenantSettingsService,
    private appErrorHandler: AppErrorHandler,
    private quantityControlService: QcReportService
  ) {
    super('qc-sounding-report-grid', columnPreferences, changeDetector, loggerFactory.createLogger(QcSoundingReportListGridViewModel.name));
    this.initOptions(this.gridOptions);

    const generalTenantSettings = tenantSettings.getGeneralTenantSettings();

    this.dateFormat = generalTenantSettings.tenantFormats.dateFormat.name;
    this.quantityPrecision = generalTenantSettings.defaultValues.quantityPrecision;

    // Note: Do note use async pipe to load data directly in template because angular ag-grid first sets rowData to undefined, which shows no-rows and then triggers loading the data.
    // Note: This would show a glimpse of NoRowsOverlay before actually loading data.
    this.gridReady$
      .pipe(
        first(),
        tap(() => this.gridApi.showLoadingOverlay()),
        // Note: No need for pagination or server-side filtering, everything is loaded in memory.
        switchMap(() => this.quantityControlService.getSoundingReportList({})),
        catchError(() => {
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
        }),
        takeUntil(this.destroy$)
      ).subscribe();
  }

  getColumnsDefs(): TypedColDef[] {
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
    this.quantityControlService.getSoundingReportListItemDetails((<IQcSoundingReportItemDto>params.data).id, {}).subscribe(
      response => params.successCallback(response.items, response.totalItems),
      error => {
        this.appErrorHandler.handleError(error);
      });
  }
}

