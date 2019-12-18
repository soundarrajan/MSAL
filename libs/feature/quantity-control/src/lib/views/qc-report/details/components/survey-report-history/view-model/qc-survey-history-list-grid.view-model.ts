import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { RowModelType, RowSelection, TypedColDef } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { QcSurveyHistoryListColumns, QcSurveyHistoryListColumnServerKeys, QcSurveyHistoryListColumnsLabels } from './qc-survey-history-list.columns';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { QcReportService } from '../../../../../../services/qc-report.service';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { Store } from '@ngxs/store';
import { IQcReportDetailsState } from '../../../../../../store/report/details/qc-report-details.model';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IQcSurveyHistoryListItemDto } from '../../../../../../services/api/dto/qc-survey-history-list-item.dto';
import { SurveyStatusEnum } from '../../../../../../core/enums/survey-status.enum';
import { QuantityMatchStatusEnum } from '../../../../../../core/enums/quantity-match-status';
import { BooleanFilterParams } from '@shiptech/core/ui/components/ag-grid/ag-grid-utils';
import { IQcReportState } from '../../../../../../store/report/qc-report.state.model';
import { combineLatest, Observable } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

function model(prop: keyof IQcSurveyHistoryListItemDto): keyof IQcSurveyHistoryListItemDto {
  return prop;
}

@Injectable()
export class QcSurveyHistoryListGridViewModel extends BaseGridViewModel {

  private defaultColFilterParams = {
    clearButton: true,
    applyButton: true,
    precision: () => this.format.quantityPrecision
  };

  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 35,

    domLayout: 'autoHeight',
    rowModelType: RowModelType.ServerSide,
    pagination: true,
    animateRows: true,

    rowSelection: RowSelection.Multiple,
    suppressRowClickSelection: true,

    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: IQcSurveyHistoryListItemDto) => data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  portCallId: TypedColDef<IQcSurveyHistoryListItemDto, string> = {
    headerName: QcSurveyHistoryListColumnsLabels.portCallId,
    colId: QcSurveyHistoryListColumns.portCallId,
    field: model('portCallId'),
    cellRendererFramework: AgCellTemplateComponent
  };

  portNameCol: TypedColDef<IQcSurveyHistoryListItemDto, string> = {
    headerName: QcSurveyHistoryListColumnsLabels.portName,
    colId: QcSurveyHistoryListColumns.portName,
    field: model('portName'),
    width: 106
  };

  vesselNameCol: TypedColDef<IQcSurveyHistoryListItemDto, string> = {
    headerName: QcSurveyHistoryListColumnsLabels.vesselName,
    colId: QcSurveyHistoryListColumns.vesselName,
    field: model('vesselName'),
    width: 129
  };

  surveyDateCol: TypedColDef<IQcSurveyHistoryListItemDto, string> = {
    headerName: QcSurveyHistoryListColumnsLabels.surveyDate,
    colId: QcSurveyHistoryListColumns.surveyDate,
    field: model('surveyDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    width: 150
  };

  surveyStatusCol: TypedColDef<IQcSurveyHistoryListItemDto, IDisplayLookupDto> = {
    headerName: QcSurveyHistoryListColumnsLabels.surveyStatus,
    colId: QcSurveyHistoryListColumns.surveyStatus,
    field: model('surveyStatus'),
    valueFormatter: params => params.value?.displayName,
    cellClass: 'cell-background',
    cellClassRules: {
      'pending': params => params.data?.surveyStatus?.name === SurveyStatusEnum.Pending,
      'verified': params => params.data?.surveyStatus?.name === SurveyStatusEnum.Verified
    },
    width: 78
  };

  qtyMatchedStatusCol: TypedColDef<IQcSurveyHistoryListItemDto, IDisplayLookupDto> = {
    headerName: QcSurveyHistoryListColumnsLabels.qtyMatchedStatus,
    colId: QcSurveyHistoryListColumns.qtyMatchedStatus,
    field: model('qtyMatchedStatus'),
    valueFormatter: params => params.value?.displayName,
    cellClass: 'cell-background',
    cellClassRules: {
      'matched': params => params.data?.qtyMatchedStatus?.name === QuantityMatchStatusEnum.Matched,
      'matched-withing-limit': params => params.data?.qtyMatchedStatus?.name === QuantityMatchStatusEnum.WithinLimit,
      'not-matched': params => params.data?.qtyMatchedStatus?.name === QuantityMatchStatusEnum.NotMatched
    },
    width: 96
  };

  logBookRobBeforeDeliveryCol: TypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.logBookRobBeforeDelivery,
    colId: QcSurveyHistoryListColumns.logBookRobBeforeDelivery,
    field: model('logBookRobBeforeDelivery'),
    width: 153,
    valueFormatter: params => this.format.quantity(params.value),
    filter: 'agNumberColumnFilter'
  };

  measuredRobBeforeDeliveryCol: TypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.measuredRobBeforeDelivery,
    colId: QcSurveyHistoryListColumns.measuredRobBeforeDelivery,
    field: model('measuredRobBeforeDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    width: 181
  };

  diffRobBeforeDeliveryCol: TypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.diffRobBeforeDelivery,
    colId: QcSurveyHistoryListColumns.diffRobBeforeDelivery,
    field: model('diffRobBeforeDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellClass: 'cell-background',
    cellClassRules: {
      'not-matched': params => params.data?.diffRobBeforeDelivery < 0 // TODO: Wrong calculation, needs tolerance
    },
    width: 128
  };

  qtyBeforeDeliveryUomCol: TypedColDef<IQcSurveyHistoryListItemDto, IDisplayLookupDto> = {
    headerName: QcSurveyHistoryListColumnsLabels.qtyBeforeDeliveryUom,
    colId: QcSurveyHistoryListColumns.qtyBeforeDeliveryUom,
    field: model('qtyBeforeDeliveryUom'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.displayName
  };

  bdnQuantityCol: TypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.bdnQuantity,
    colId: QcSurveyHistoryListColumns.bdnQuantity,
    field: model('bdnQuantity'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredDeliveredQtyCol: TypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.measuredDeliveredQty,
    colId: QcSurveyHistoryListColumns.measuredDeliveredQty,
    field: model('measuredDeliveredQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffDeliveredQtyCol: TypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.diffDeliveredQty,
    colId: QcSurveyHistoryListColumns.diffDeliveredQty,
    field: model('diffDeliveredQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellClass: 'cell-background',
    cellClassRules: {
      'not-matched': params => params.data?.diffDeliveredQty < 0 // TODO: Wrong calculation, needs tolerance
    }
  };

  qtyDeliveredUomCol: TypedColDef<IQcSurveyHistoryListItemDto, IDisplayLookupDto> = {
    headerName: QcSurveyHistoryListColumnsLabels.qtyDeliveredUom,
    colId: QcSurveyHistoryListColumns.qtyDeliveredUom,
    field: model('qtyDeliveredUom'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.displayName
  };

  logBookRobAfterDeliveryCol: TypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.logBookRobAfterDelivery,
    colId: QcSurveyHistoryListColumns.logBookRobAfterDelivery,
    field: model('logBookRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredRobAfterDeliveryCol: TypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.measuredRobAfterDelivery,
    colId: QcSurveyHistoryListColumns.measuredRobAfterDelivery,
    field: model('measuredRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffRobAfterDeliveryCol: TypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.diffRobAfterDelivery,
    colId: QcSurveyHistoryListColumns.diffRobAfterDelivery,
    field: model('diffRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellClass: 'cell-background',
    cellClassRules: {
      'matched-withing-limit': params => params.data?.diffRobAfterDelivery < 0 // TODO: Wrong calculation, needs tolerance
    }
  };

  qtyAfterDeliveryUomCol: TypedColDef<IQcSurveyHistoryListItemDto, IDisplayLookupDto> = {
    headerName: QcSurveyHistoryListColumnsLabels.qtyAfterDeliveryUom,
    colId: QcSurveyHistoryListColumns.qtyAfterDeliveryUom,
    field: model('qtyAfterDeliveryUom'),
    valueFormatter: params => params.value?.displayName
  };

  logBookSludgeRobBeforeDischargeCol: TypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.logBookSludgeRobBeforeDischarge,
    colId: QcSurveyHistoryListColumns.logBookSludgeRobBeforeDischarge,
    field: model('logBookSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredSludgeRobBeforeDischargeCol: TypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.measuredSludgeRobBeforeDischarge,
    colId: QcSurveyHistoryListColumns.measuredSludgeRobBeforeDischarge,
    field: model('measuredSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffSludgeRobBeforeDischargeCol: TypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.diffSludgeRobBeforeDischarge,
    colId: QcSurveyHistoryListColumns.diffSludgeRobBeforeDischarge,
    field: model('diffSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellClass: 'cell-background',
    cellClassRules: {
      'matched-withing-limit': params => params.data?.diffSludgeRobBeforeDischarge < 0 // TODO: Wrong calculation, needs tolerance
    }
  };

  sludgeDischargedQtyCol: TypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.sludgeDischargedQty,
    colId: QcSurveyHistoryListColumns.sludgeDischargedQty,
    field: model('sludgeDischargedQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  qtySludgeDischargedUomCol: TypedColDef<IQcSurveyHistoryListItemDto, IDisplayLookupDto> = {
    headerName: QcSurveyHistoryListColumnsLabels.qtySludgeDischargedUom,
    colId: QcSurveyHistoryListColumns.qtySludgeDischargedUom,
    field: model('qtySludgeDischargedUom'),
    valueFormatter: params => params.value?.displayName
  };

  commentCol: TypedColDef<IQcSurveyHistoryListItemDto, string> = {
    headerName: QcSurveyHistoryListColumnsLabels.comment,
    colId: QcSurveyHistoryListColumns.comment,
    field: model('comment')
  };

  isVerifiedSludgeQtyCol: TypedColDef<IQcSurveyHistoryListItemDto, string> = {
    headerName: QcSurveyHistoryListColumnsLabels.isVerifiedSludgeQty,
    colId: QcSurveyHistoryListColumns.isVerifiedSludgeQty,
    field: model('isVerifiedSludgeQty'),
    filter: 'agNumberColumnFilter',
    filterParams: {
      ...this.defaultColFilterParams,
      ...BooleanFilterParams
    }
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private format: TenantFormattingService,
    private store: Store,
    private quantityControlService: QcReportService
  ) {
    super('qc-survey-history-grid', columnPreferences, changeDetector, loggerFactory.createLogger(QcSurveyHistoryListGridViewModel.name));
    this.initOptions(this.gridOptions);

    combineLatest(
      this.gridReady$,
      this.selectReportDetails(state => state.portCall) // Note: When portCall changes we need to reload the grid,
    ).pipe(
      tap(() => this.gridApi.purgeServerSideCache()),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  getColumnsDefs(): TypedColDef[] {
    return [
      this.portCallId,
      this.portNameCol,
      this.vesselNameCol,
      this.surveyDateCol,
      this.surveyStatusCol,
      this.qtyMatchedStatusCol,
      this.logBookRobBeforeDeliveryCol,
      this.measuredRobBeforeDeliveryCol,
      this.diffRobBeforeDeliveryCol,
      this.qtyBeforeDeliveryUomCol,
      this.bdnQuantityCol,
      this.measuredDeliveredQtyCol,
      this.diffDeliveredQtyCol,
      this.qtyDeliveredUomCol,
      this.logBookRobAfterDeliveryCol,
      this.measuredRobAfterDeliveryCol,
      this.diffRobAfterDeliveryCol,
      this.qtyAfterDeliveryUomCol,
      this.logBookSludgeRobBeforeDischargeCol,
      this.measuredSludgeRobBeforeDischargeCol,
      this.diffSludgeRobBeforeDischargeCol,
      this.sludgeDischargedQtyCol,
      this.qtySludgeDischargedUomCol,
      this.commentCol,
      this.isVerifiedSludgeQtyCol
    ];
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    if (!this.reportDetailsState.portCall) {
      params.successCallback([], 0);
      return;
    }

    if (this.reportDetailsState.isNew) {
      params.successCallback([], 0);
    }

    this.quantityControlService.getSurveyHistoryList$(
      this.reportDetailsState.vessel.id,
      transformLocalToServeGridInfo(params, QcSurveyHistoryListColumnServerKeys)
    ).subscribe(
      response => params.successCallback(response.items, response.totalItems),
      () => params.failCallback());
  }

  private get reportDetailsState(): IQcReportDetailsState {
    // Note: Always get a fresh reference to the state.
    return (<IAppState>this.store.snapshot()).quantityControl.report.details;
  }

  private get reportState(): IQcReportState {
    // Note: Always get a fresh reference to the state.
    return (<IAppState>this.store.snapshot()).quantityControl.report;
  }

  private selectReportDetails<T>(select: ((state: IQcReportDetailsState) => T)): Observable<T> {
    return this.store.select((appState: IAppState) => select(appState?.quantityControl?.report?.details));
  }
}
