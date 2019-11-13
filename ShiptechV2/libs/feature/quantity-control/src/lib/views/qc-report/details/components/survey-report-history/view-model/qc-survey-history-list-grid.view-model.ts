import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ColDef, GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { RowModelType } from '@shiptech/core/ui/components/ag-grid/type.definition';
import {
  QcSurveyHistoryListColumns,
  QcSurveyHistoryListColumnsLabels,
  QcSurveyHistoryListItemProps
} from './qc-survey-history-list.columns';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { SurveyStatusEnum } from '../../../../../../core/enums/survey-status.enum';
import { QcSurveyHistoryListItemModel } from '../../../../../../services/models/qc-survey-history-list-item.model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { QcReportDetailsService } from '../../../../../../services/qc-report-details.service';
import { getShiptechFormatPagination } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-paging';
import { getShiptechFormatSorts } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-sorts';
import { getShiptechFormatFilters } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { Store } from '@ngxs/store';
import { IQcReportDetailsState } from '../../../../../../store/report-view/details/qc-report-details.model';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';

@Injectable()
export class QcSurveyHistoryListGridViewModel extends BaseGridViewModel {

  public searchText: string;
  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 35,

    rowModelType: RowModelType.ServerSide,
    pagination: true,
    animateRows: true,

    deltaRowDataMode: false,
    suppressPaginationPanel: false,
    suppressColumnVirtualisation: false,

    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      minWidth: 150
    }
  };

  callIdCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.callId,
    colId: QcSurveyHistoryListColumns.callId,
    field: this.modelProps.id,
    hide: false,
    width:100,
    suppressToolPanel: true,
    cellRendererFramework: AgCellTemplateComponent
  };

  portCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.port,
    colId: QcSurveyHistoryListColumns.port,
    field: this.modelProps.port
  };

  surveyDateCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.surveyDate,
    colId: QcSurveyHistoryListColumns.surveyDate,
    field: this.modelProps.surveyDate,
  };

  surveyStatusCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.surveyStatus,
    colId: QcSurveyHistoryListColumns.surveyStatus,
    field: this.modelProps.surveyStatus,
    cellClassRules: {
      'cell-background pending': params => ((<QcSurveyHistoryListItemModel>params.data) || {} as QcSurveyHistoryListItemModel).surveyStatus === SurveyStatusEnum.Pending,
      'cell-background verified': params => ((<QcSurveyHistoryListItemModel>params.data) || {} as QcSurveyHistoryListItemModel).surveyStatus === SurveyStatusEnum.Verified
    }
  };

  matchedQuantityCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.matchedQuantity,
    colId: QcSurveyHistoryListColumns.matchedQuantity,
    field: this.modelProps.matchedQuantity
  };

  logBookRobBeforeDeliveryCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.logBookRobBeforeDelivery,
    colId: QcSurveyHistoryListColumns.logBookRobBeforeDelivery,
    field: this.modelProps.logBookRobBeforeDelivery
  };

  measuredRobBeforeDeliveryCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.measuredRobBeforeDelivery,
    colId: QcSurveyHistoryListColumns.measuredRobBeforeDelivery,
    field: this.modelProps.measuredRobBeforeDelivery
  };

  robBeforeDeliveryCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.robBeforeDelivery,
    colId: QcSurveyHistoryListColumns.robBeforeDelivery,
    field: this.modelProps.robBeforeDelivery,
    cellClassRules: {
      'cell-background red': params => ((<QcSurveyHistoryListItemModel>params.data) || {} as QcSurveyHistoryListItemModel).robBeforeDelivery < 0
    }
  };

  bdnQuantityCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.bdnQuantity,
    colId: QcSurveyHistoryListColumns.bdnQuantity,
    field: this.modelProps.bdnQuantity
  };

  measuredDeliveredQuantityCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.measuredDeliveredQuantity,
    colId: QcSurveyHistoryListColumns.measuredDeliveredQuantity,
    field: this.modelProps.measuredDeliveredQuantity
  };

  deliveredQuantityCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.deliveredQuantity,
    colId: QcSurveyHistoryListColumns.deliveredQuantity,
    field: this.modelProps.deliveredQuantity,
    cellClassRules: {
      'cell-background red': params => ((<QcSurveyHistoryListItemModel>params.data) || {} as QcSurveyHistoryListItemModel).deliveredQuantity < 0
    }
  };

  logBookRobAfterDeliveryCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.logBookRobAfterDelivery,
    colId: QcSurveyHistoryListColumns.logBookRobAfterDelivery,
    field: this.modelProps.logBookRobAfterDelivery
  };

  measuredRobAfterDeliveryCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.measuredRobAfterDelivery,
    colId: QcSurveyHistoryListColumns.measuredRobAfterDelivery,
    field: this.modelProps.measuredRobAfterDelivery
  };

  robAfterDeliveryCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.robAfterDelivery,
    colId: QcSurveyHistoryListColumns.robAfterDelivery,
    field: this.modelProps.robAfterDelivery
  };

  logBookSludgeBeforeDischargeCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.logBookSludgeBeforeDischarge,
    colId: QcSurveyHistoryListColumns.logBookSludgeBeforeDischarge,
    field: this.modelProps.logBookSludgeBeforeDischarge
  };

  measuredSludgeRobBeforeDischargeCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.measuredSludgeRobBeforeDischarge,
    colId: QcSurveyHistoryListColumns.measuredSludgeRobBeforeDischarge,
    field: this.modelProps.measuredSludgeRobBeforeDischarge
  };

  sludgeDischargedQuantityCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.sludgeDischargedQuantity,
    colId: QcSurveyHistoryListColumns.sludgeDischargedQuantity,
    field: this.modelProps.sludgeDischargedQuantity
  };

  commentCol: ColDef = {
    headerName: QcSurveyHistoryListColumnsLabels.comment,
    colId: QcSurveyHistoryListColumns.comment,
    field: this.modelProps.comment
  };


  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private store: Store,
    private quantityControlService: QcReportDetailsService,
    private modelProps: QcSurveyHistoryListItemProps
  ) {
    super('qc-survey-history-grid', columnPreferences, changeDetector, loggerFactory.createLogger(QcSurveyHistoryListGridViewModel.name));
    this.initOptions(this.gridOptions);
  }

  getColumnsDefs(): ColDef[] {
    return [
      this.callIdCol,
      this.portCol,
      this.surveyDateCol,
      this.surveyStatusCol,
      this.matchedQuantityCol,
      this.logBookRobBeforeDeliveryCol,
      this.measuredRobBeforeDeliveryCol,
      this.robBeforeDeliveryCol,
      this.bdnQuantityCol,
      this.measuredDeliveredQuantityCol,
      this.deliveredQuantityCol,
      this.logBookRobAfterDeliveryCol,
      this.measuredRobAfterDeliveryCol,
      this.robAfterDeliveryCol,
      this.logBookSludgeBeforeDischargeCol,
      this.measuredSludgeRobBeforeDischargeCol,
      this.sludgeDischargedQuantityCol,
      this.commentCol
    ];
  }

  //TODO: ADD loading overlay
  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.quantityControlService.getSurveyHistoryList(this.reportDetailsState.portCallId, {
      pagination: getShiptechFormatPagination(params),
      sortList: getShiptechFormatSorts(params),
      filters: getShiptechFormatFilters(params),
      searchText: this.searchText
    }).subscribe(
      response => params.successCallback(response.items, response.totalItems),
      () => params.failCallback());
  }

  private get reportDetailsState(): IQcReportDetailsState {
    // Note: Always get a fresh reference to the state.
    return (<IAppState>this.store.snapshot()).quantityControl.report.details;
  }
}
