import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { GridOptions, IServerSideGetRowsParams } from '@ag-grid-community/core';
import {
  IAgGridCellClassRules,
  ITypedColDef,
  ITypedValueParams,
  RowModelType,
  RowSelection
} from '@shiptech/core/ui/components/ag-grid/type.definition';
import {
  QcSurveyHistoryListColumns,
  QcSurveyHistoryListColumnServerKeys,
  QcSurveyHistoryListColumnsLabels
} from './qc-survey-history-list.columns';
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
import { StatusLookupEnum } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { ReconStatusLookupEnum } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.enum';
import { BooleanFilterParams } from '@shiptech/core/ui/components/ag-grid/ag-grid-utils';
import { IQcReportState } from '../../../../../../store/report/qc-report.state.model';
import { combineLatest, Observable } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { IDeliveryTenantSettings } from '../../../../../../core/settings/delivery-tenant-settings';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { IQcReportsListItemDto } from '../../../../../../services/api/dto/qc-reports-list-item.dto';
import { ReconStatusLookup } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';

function model(
  prop: keyof IQcSurveyHistoryListItemDto
): keyof IQcSurveyHistoryListItemDto {
  return prop;
}

@Injectable()
export class QcSurveyHistoryListGridViewModel extends BaseGridViewModel {
  private get reportDetailsState(): IQcReportDetailsState {
    // Note: Always get a fresh reference to the state.
    return (<IAppState>this.store.snapshot()).quantityControl.report.details;
  }

  private get reportState(): IQcReportState {
    // Note: Always get a fresh reference to the state.
    return (<IAppState>this.store.snapshot()).quantityControl.report;
  }

  public defaultColFilterParams = {
    resetButton: true,
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
    suppressContextMenu: true,
    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: IQcSurveyHistoryListItemDto) =>
      data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  portCallId: ITypedColDef<IQcSurveyHistoryListItemDto, string> = {
    headerName: QcSurveyHistoryListColumnsLabels.portCallId,
    colId: QcSurveyHistoryListColumns.portCallId,
    field: model('portCallId'),
    cellRendererFramework: AgCellTemplateComponent,
    width: 200
  };

  portNameCol: ITypedColDef<IQcSurveyHistoryListItemDto, string> = {
    headerName: QcSurveyHistoryListColumnsLabels.portName,
    colId: QcSurveyHistoryListColumns.portName,
    field: model('portName'),
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.value;
      return a;
    },
    width: 106
  };

  vesselNameCol: ITypedColDef<IQcSurveyHistoryListItemDto, string> = {
    headerName: QcSurveyHistoryListColumnsLabels.vesselName,
    colId: QcSurveyHistoryListColumns.vesselName,
    field: model('vesselName'),
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.value;
      return a;
    },
    width: 129
  };

  surveyDateCol: ITypedColDef<IQcSurveyHistoryListItemDto, string> = {
    headerName: QcSurveyHistoryListColumnsLabels.surveyDate,
    colId: QcSurveyHistoryListColumns.surveyDate,
    field: model('surveyDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    width: 150
  };

  surveyStatusCol: ITypedColDef<
    IQcSurveyHistoryListItemDto,
    IStatusLookupDto
  > = {
    headerName: QcSurveyHistoryListColumnsLabels.surveyStatus,
    colId: QcSurveyHistoryListColumns.surveyStatus,
    field: model('surveyStatus'),
    valueFormatter: params => params.value?.displayName,
    cellStyle: params => ({
      backgroundColor:
        params.data?.surveyStatus?.name === StatusLookupEnum.New
          ? 'inherit'
          : params.data?.surveyStatus?.code,
      color:
        params.data?.surveyStatus?.name === StatusLookupEnum.New
          ? 'inherit'
          : '#fff'
    }),
    width: 85
  };

  qtyMatchedStatusCol: ITypedColDef<
    IQcSurveyHistoryListItemDto,
    IDisplayLookupDto
  > = {
    headerName: QcSurveyHistoryListColumnsLabels.qtyMatchedStatus,
    colId: QcSurveyHistoryListColumns.qtyMatchedStatus,
    field: model('qtyMatchedStatus'),
    valueFormatter: params => params.value?.displayName,
    cellStyle: params => ({
      backgroundColor: params.data?.qtyMatchedStatus?.code ?? 'inherit',
      color: !!params.data?.qtyMatchedStatus ? '#fff' : 'inherit'
    }),
    width: 96
  };

  logBookRobBeforeDeliveryCol: ITypedColDef<
    IQcSurveyHistoryListItemDto,
    number
  > = {
    headerName: QcSurveyHistoryListColumnsLabels.logBookRobBeforeDelivery,
    colId: QcSurveyHistoryListColumns.logBookRobBeforeDelivery,
    field: model('logBookRobBeforeDelivery'),
    width: 170,
    valueFormatter: params => this.format.quantity(params.value),
    filter: 'agNumberColumnFilter'
  };

  measuredRobBeforeDeliveryCol: ITypedColDef<
    IQcSurveyHistoryListItemDto,
    number
  > = {
    headerName: QcSurveyHistoryListColumnsLabels.measuredRobBeforeDelivery,
    colId: QcSurveyHistoryListColumns.measuredRobBeforeDelivery,
    field: model('measuredRobBeforeDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    width: 195
  };

  diffRobBeforeDeliveryCol: ITypedColDef<
    IQcSurveyHistoryListItemDto,
    number
  > = {
    headerName: QcSurveyHistoryListColumnsLabels.diffRobBeforeDelivery,
    colId: QcSurveyHistoryListColumns.diffRobBeforeDelivery,
    field: model('diffRobBeforeDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.getMatchStatusForRobBeforeDiffAndDeliveredDiff(
        params.data?.diffRobBeforeDelivery,
        this.robTolerance
      ),
    width: 140
  };

  qtyBeforeDeliveryUomCol: ITypedColDef<
    IQcSurveyHistoryListItemDto,
    IDisplayLookupDto
  > = {
    headerName: QcSurveyHistoryListColumnsLabels.qtyBeforeDeliveryUom,
    colId: QcSurveyHistoryListColumns.qtyBeforeDeliveryUom,
    field: model('qtyBeforeDeliveryUom'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.name,
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.value?.name;
      return a;
    }
  };

  bdnQuantityCol: ITypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.bdnQuantity,
    colId: QcSurveyHistoryListColumns.bdnQuantity,
    field: model('bdnQuantity'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredDeliveredQtyCol: ITypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.measuredDeliveredQty,
    colId: QcSurveyHistoryListColumns.measuredDeliveredQty,
    field: model('measuredDeliveredQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffDeliveredQtyCol: ITypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.diffDeliveredQty,
    colId: QcSurveyHistoryListColumns.diffDeliveredQty,
    field: model('diffDeliveredQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.getMatchStatusForRobBeforeDiffAndDeliveredDiff(
        params.data?.diffDeliveredQty,
        this.bdnTolerance
      )
  };

  qtyDeliveredUomCol: ITypedColDef<
    IQcSurveyHistoryListItemDto,
    IDisplayLookupDto
  > = {
    headerName: QcSurveyHistoryListColumnsLabels.qtyDeliveredUom,
    colId: QcSurveyHistoryListColumns.qtyDeliveredUom,
    field: model('qtyDeliveredUom'),
    filter: 'agNumberColumnFilter',
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.value?.name;
      return a;
    },
    valueFormatter: params => params.value?.name
  };

  logBookRobAfterDeliveryCol: ITypedColDef<
    IQcSurveyHistoryListItemDto,
    number
  > = {
    headerName: QcSurveyHistoryListColumnsLabels.logBookRobAfterDelivery,
    colId: QcSurveyHistoryListColumns.logBookRobAfterDelivery,
    field: model('logBookRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredRobAfterDeliveryCol: ITypedColDef<
    IQcSurveyHistoryListItemDto,
    number
  > = {
    headerName: QcSurveyHistoryListColumnsLabels.measuredRobAfterDelivery,
    colId: QcSurveyHistoryListColumns.measuredRobAfterDelivery,
    field: model('measuredRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffRobAfterDeliveryCol: ITypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.diffRobAfterDelivery,
    colId: QcSurveyHistoryListColumns.diffRobAfterDelivery,
    field: model('diffRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.getMatchStatusForRobAfterDiff(params.data?.diffRobAfterDelivery, 0)
  };

  qtyAfterDeliveryUomCol: ITypedColDef<
    IQcSurveyHistoryListItemDto,
    IDisplayLookupDto
  > = {
    headerName: QcSurveyHistoryListColumnsLabels.qtyAfterDeliveryUom,
    colId: QcSurveyHistoryListColumns.qtyAfterDeliveryUom,
    field: model('qtyAfterDeliveryUom'),
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.value?.name;
      return a;
    },
    valueFormatter: params => params.value?.name
  };

  logBookSludgeRobBeforeDischargeCol: ITypedColDef<
    IQcSurveyHistoryListItemDto,
    number
  > = {
    headerName:
      QcSurveyHistoryListColumnsLabels.logBookSludgeRobBeforeDischarge,
    colId: QcSurveyHistoryListColumns.logBookSludgeRobBeforeDischarge,
    field: model('logBookSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredSludgeRobBeforeDischargeCol: ITypedColDef<
    IQcSurveyHistoryListItemDto,
    number
  > = {
    headerName:
      QcSurveyHistoryListColumnsLabels.measuredSludgeRobBeforeDischarge,
    colId: QcSurveyHistoryListColumns.measuredSludgeRobBeforeDischarge,
    field: model('measuredSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffSludgeRobBeforeDischargeCol: ITypedColDef<
    IQcSurveyHistoryListItemDto,
    number
  > = {
    headerName: QcSurveyHistoryListColumnsLabels.diffSludgeRobBeforeDischarge,
    colId: QcSurveyHistoryListColumns.diffSludgeRobBeforeDischarge,
    field: model('diffSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.getMatchStatusForRobBeforeDiffAndDeliveredDiff(
        params.data?.diffSludgeRobBeforeDischarge,
        this.robTolerance
      )
  };

  sludgeDischargedQtyCol: ITypedColDef<IQcSurveyHistoryListItemDto, number> = {
    headerName: QcSurveyHistoryListColumnsLabels.sludgeDischargedQty,
    colId: QcSurveyHistoryListColumns.sludgeDischargedQty,
    field: model('sludgeDischargedQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  qtySludgeDischargedUomCol: ITypedColDef<
    IQcSurveyHistoryListItemDto,
    IDisplayLookupDto
  > = {
    headerName: QcSurveyHistoryListColumnsLabels.qtySludgeDischargedUom,
    colId: QcSurveyHistoryListColumns.qtySludgeDischargedUom,
    field: model('qtySludgeDischargedUom'),
    valueFormatter: params => params.value?.name,
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.value ? params.value?.name : '';
      return a;
    }
  };

  commentCol: ITypedColDef<IQcSurveyHistoryListItemDto, string> = {
    headerName: QcSurveyHistoryListColumnsLabels.comment,
    colId: QcSurveyHistoryListColumns.comment,
    field: model('comment'),
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.valueFormatted ?? params.value;
      return a;
    },
    tooltipValueGetter: params => params.valueFormatted ?? params.value
  };

  isVerifiedSludgeQtyCol: ITypedColDef<IQcSurveyHistoryListItemDto, string> = {
    headerName: QcSurveyHistoryListColumnsLabels.isVerifiedSludgeQty,
    colId: QcSurveyHistoryListColumns.isVerifiedSludgeQty,
    field: model('isVerifiedSludgeQty'),
    cellRendererFramework: AgCellTemplateComponent,
    filter: 'agNumberColumnFilter',
    filterParams: {
      ...this.defaultColFilterParams,
      ...BooleanFilterParams
    }
  };

  private readonly minToleranceLimit;
  private readonly maxToleranceLimit;
  private readonly robTolerance;
  private readonly bdnTolerance;

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    tenantSettings: TenantSettingsService,
    private format: TenantFormattingService,
    private store: Store,
    private reconStatusLookups: ReconStatusLookup,
    private quantityControlService: QcReportService
  ) {
    super(
      'qc-survey-history-grid',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(QcSurveyHistoryListGridViewModel.name)
    );
    this.init(this.gridOptions);

    const deliveryTenantSettings = tenantSettings.getModuleTenantSettings<
      IDeliveryTenantSettings
    >(TenantSettingsModuleName.Delivery);
    this.minToleranceLimit = deliveryTenantSettings.qcMinToleranceLimit;
    this.maxToleranceLimit = deliveryTenantSettings.qcMaxToleranceLimit;

    this.robTolerance = deliveryTenantSettings.robTolerance;
    this.bdnTolerance = deliveryTenantSettings.maxToleranceLimit;
    // Note: When portCall changes we need to reload the grid,
    combineLatest(
      this.gridReady$,
      this.selectReportDetails(state => state.portCall)
    )
      .pipe(
        filter(
          () =>
            !!this.selectReportDetailsSnapshot(s => s.surveyHistory?._hasLoaded)
        ),
        tap(() => this.gridApi.purgeServerSideCache()),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  getColumnsDefs(): ITypedColDef[] {
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

    this.quantityControlService
      .getSurveyHistoryList$(
        this.reportDetailsState.vessel.id,
        transformLocalToServeGridInfo(
          this.gridApi,
          params,
          QcSurveyHistoryListColumnServerKeys
        )
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => params.successCallback(response.items, response.totalCount),
        () => params.failCallback()
      );
  }

  private selectReportDetails<T>(
    select: (state: IQcReportDetailsState) => T
  ): Observable<T> {
    return this.store.select((appState: IAppState) =>
      select(appState?.quantityControl?.report?.details)
    );
  }

  private selectReportDetailsSnapshot<T>(
    select: (state: IQcReportDetailsState) => T
  ): T {
    return this.store.selectSnapshot((appState: IAppState) =>
      select(appState?.quantityControl?.report?.details)
    );
  }

  private toleranceStatus(
    field: (params: ITypedValueParams<IQcReportsListItemDto, number>) => number
  ): IAgGridCellClassRules<IQcReportsListItemDto, number> {
    return {
      'not-matched': params =>
        Math.abs(field(params)) >= this.maxToleranceLimit,
      'matched-withing-limit': params =>
        Math.abs(field(params)) > this.minToleranceLimit &&
        Math.abs(field(params)) < this.maxToleranceLimit
    };
  }

  private getMatchStatusForRobBeforeDiffAndDeliveredDiff(
    value: number,
    tolerance: number
  ): Partial<CSSStyleDeclaration> {
    if (value === null || value === undefined)
      return {
        backgroundColor: 'inherit',
        color: 'inherit'
      };

    let status = this.reconStatusLookups.matched;

    if (Math.abs(value) > tolerance)
      status = this.reconStatusLookups.notMatched;
    if (Math.abs(value) <= tolerance) status = this.reconStatusLookups.matched;

    return {
      backgroundColor: status.code,
      color: '#fff'
    };
  }

  public getMatchStatusForRobAfterDiff(
    value: number,
    tolerance: number
  ): Partial<CSSStyleDeclaration> {
    if (value === null || value === undefined)
      return {
        backgroundColor: 'inherit',
        color: 'inherit'
      };

    let status = this.reconStatusLookups.matched;

    if (Math.abs(value) != 0) status = this.reconStatusLookups.notMatched;

    if (Math.abs(value) == tolerance) status = this.reconStatusLookups.matched;

    return {
      backgroundColor: status.code,
      color: '#fff'
    };
  }
}
