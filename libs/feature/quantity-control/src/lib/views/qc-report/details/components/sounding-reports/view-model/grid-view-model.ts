import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ColDef, GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { RowModelType } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { QcSoundingReportListColumns, QcSoundingReportListColumnsLabels } from './grid-columns';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { QcReportDetailsService } from '../../../../../../services/qc-report-details.service';
import { QcSoundingReportItemModel } from '../../../../../../services/models/qc-sounding-report-item.model';
import { getShiptechFormatPagination } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-paging';
import { getShiptechFormatSorts } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-sorts';
import { getShiptechFormatFilters } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { QcSoundingReportDetailsGridViewModel } from './details-grid-view-model';

function model(prop: keyof QcSoundingReportItemModel): string {
  return prop;
}

@Injectable()
export class QcSoundingReportListGridViewModel extends BaseGridViewModel {

  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 35,

    rowModelType: RowModelType.ServerSide,
    pagination: true,

    animateRows: true,

    deltaRowDataMode: false,
    suppressPaginationPanel: false,
    suppressColumnVirtualisation: true,
    rowDragManaged: true,
    suppressRowClickSelection: true,

    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: QcSoundingReportItemModel) => data.reportId.toString(),

    masterDetail: true,
    detailCellRendererParams: {
      detailGridOptions: this.detailsGridViewModel.gridOptions,
      getDetailRowData: params => this.detailsGridViewModel.detailServerSideGetRows(params)
    },

    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      width: 150
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
    private quantityControlService: QcReportDetailsService,
    private detailsGridViewModel: QcSoundingReportDetailsGridViewModel
  ) {
    super('qc-sounding-report-grid', columnPreferences, changeDetector, loggerFactory.createLogger(QcSoundingReportListGridViewModel.name));
    this.initOptions(this.gridOptions);
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

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.quantityControlService.getSoundingReportList({
      pagination: getShiptechFormatPagination(params),
      sortList: getShiptechFormatSorts(params),
      filters: getShiptechFormatFilters(params)
    }).subscribe(
      response => params.successCallback(response.items, response.totalItems),
      () => params.failCallback());
  }
}

