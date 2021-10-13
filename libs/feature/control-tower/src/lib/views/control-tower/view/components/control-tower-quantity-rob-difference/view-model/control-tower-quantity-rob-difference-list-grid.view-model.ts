import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { GridOptions, IServerSideGetRowsParams } from '@ag-grid-community/core';
import {
  ITypedColDef,
  RowModelType,
  RowSelection,
  TypedRowNode
} from '@shiptech/core/ui/components/ag-grid/type.definition';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { StatusLookupEnum } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { ReconStatusLookupEnum } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.enum';
import { BooleanFilterParams } from '@shiptech/core/ui/components/ag-grid/ag-grid-utils';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { AppError } from '@shiptech/core/error-handling/app-error';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { ReconStatusLookup } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import { IReconStatusLookupDto } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.interface';
import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';
import { takeUntil } from 'rxjs/operators';
import { AgCheckBoxRendererComponent } from '@shiptech/core/ui/components/ag-grid/ag-check-box-renderer/ag-check-box-renderer.component';
import { AgCheckBoxHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-check-box-header/ag-check-box-header.component';
import { StatusLookup } from '@shiptech/core/lookups/known-lookups/status/status-lookup.service';

import { AgOpenPopUpComponent } from '@shiptech/core/ui/components/ag-grid/ag-open-pop-up/ag-open-pop-up.component';
import {
  IControlTowerListItemDto,
  IToleranceUomDto
} from 'libs/feature/control-tower/src/lib/services/api/dto/control-tower-list-item.dto';
import { ModuleLoggerFactory } from 'libs/feature/control-tower/src/lib/core/logging/module-logger-factory';
import { QcReportService } from 'libs/feature/control-tower/src/lib/services/qc-report.service';
import {
  ControlTowerQuantityRobDifferenceListColumns,
  ControlTowerQuantityRobDifferenceListColumnServerKeys,
  ControlTowerQuantityRobDifferenceListColumnsLabels
} from './control-tower-quantity-rob-difference-list.columns';

function model(
  prop: keyof IControlTowerListItemDto
): keyof IControlTowerListItemDto {
  return prop;
}

@Injectable()
export class ControlTowerQuantityRobDifferenceListGridViewModel extends BaseGridViewModel {
  public paramsServerSide: IServerSideGetRowsParams;
  public searchText: string;
  public exportUrl: string;
  public defaultColFilterParams = {
    applyButton: true,
    resetButton: true,
    precision: () => this.format.quantityPrecision
  };
  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 40,

    rowModelType: RowModelType.ServerSide,
    pagination: true,
    animateRows: true,

    rowSelection: RowSelection.Multiple,
    suppressRowClickSelection: true,
    suppressContextMenu: true,

    multiSortKey: 'ctrl',

    isRowSelectable: (params: TypedRowNode<IControlTowerListItemDto>) =>
      params.data?.surveyStatus?.name !== StatusLookupEnum.Verified,
    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: IControlTowerListItemDto) =>
      data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  selectCol: ITypedColDef<IControlTowerListItemDto> = {
    colId: ControlTowerQuantityRobDifferenceListColumns.selection,
    width: 50,
    ...AgCheckBoxHeaderComponent.withParams({}),
    ...AgCheckBoxRendererComponent.withParams<IControlTowerListItemDto>({
      isVisible: params =>
        params.data?.surveyStatus?.name !== StatusLookupEnum.Verified
    }),
    editable: false,
    filter: false,
    sortable: false,
    suppressMenu: true,
    resizable: false,
    suppressAutoSize: true,
    suppressSizeToFit: true,
    suppressMovable: true,
    suppressNavigable: true,
    suppressColumnsToolPanel: false,
    suppressFiltersToolPanel: true,
    suppressCellFlash: true,
    suppressPaste: true,
    lockPosition: true,
    lockVisible: true,
    cellClass: 'cell-border-green'
  };

  openPopUp: ITypedColDef<IControlTowerListItemDto> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.actions,
    colId: ControlTowerQuantityRobDifferenceListColumns.actions,
    cellRendererFramework: AgOpenPopUpComponent,
    cellRendererParams: {
      cellClass: ['open-pop-up'],
      type: 'open-pop-up-link'
    },
    width: 110
  };

  portCallId: ITypedColDef<IControlTowerListItemDto, string> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.portCallId,
    colId: ControlTowerQuantityRobDifferenceListColumns.portCallId,
    field: model('portCallId'),
    cellRendererFramework: AgCellTemplateComponent,
    width: 200
  };

  portNameCol: ITypedColDef<IControlTowerListItemDto, string> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.portName,
    colId: ControlTowerQuantityRobDifferenceListColumns.portName,
    field: model('portName'),
    cellRenderer: params => {
      const a = document.createElement('div');
      a.innerHTML = params.value;
      return a;
    },
    width: 106
  };

  vesselNameCol: ITypedColDef<IControlTowerListItemDto, string> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.vesselName,
    colId: ControlTowerQuantityRobDifferenceListColumns.vesselName,
    field: model('vesselName'),
    cellRenderer: params => {
      const a = document.createElement('div');
      a.innerHTML = params.value;
      return a;
    },
    width: 129
  };

  surveyDateCol: ITypedColDef<IControlTowerListItemDto, string> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.surveyDate,
    colId: ControlTowerQuantityRobDifferenceListColumns.surveyDate,
    field: model('surveyDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    width: 150
  };

  surveyStatusCol: ITypedColDef<IControlTowerListItemDto, IStatusLookupDto> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.surveyStatus,
    colId: ControlTowerQuantityRobDifferenceListColumns.surveyStatus,
    field: model('surveyStatus'),
    valueFormatter: params => params.value?.displayName,
    cellStyle: params => ({
      backgroundColor: this.statusLookup.getStatus(params.data?.surveyStatus)
        ?.code,
      color: this.statusLookup.getStatus(params.data?.surveyStatus)?.id
        ? '#fff'
        : '#333'
    }),
    width: 85
  };

  qtyMatchedStatusCol: ITypedColDef<
    IControlTowerListItemDto,
    IReconStatusLookupDto
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.qtyMatchedStatus,
    colId: ControlTowerQuantityRobDifferenceListColumns.qtyMatchedStatus,
    field: model('qtyMatchedStatus'),
    valueFormatter: params => params.value?.displayName,
    cellStyle: params => ({
      backgroundColor: params.data?.qtyMatchedStatus?.code ?? 'inherit',
      color: !!params.data?.qtyMatchedStatus ? '#fff' : 'inherit'
    }),
    width: 96
  };

  logBookRobBeforeDeliveryCol: ITypedColDef<
    IControlTowerListItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.logBookRobBeforeDelivery,
    colId:
      ControlTowerQuantityRobDifferenceListColumns.logBookRobBeforeDelivery,
    field: model('logBookRobBeforeDelivery'),
    width: 170,
    valueFormatter: params => this.format.quantity(params.value),
    filter: 'agNumberColumnFilter'
  };

  measuredRobBeforeDeliveryCol: ITypedColDef<
    IControlTowerListItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.measuredRobBeforeDelivery,
    colId:
      ControlTowerQuantityRobDifferenceListColumns.measuredRobBeforeDelivery,
    field: model('measuredRobBeforeDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    width: 195
  };

  diffRobBeforeDeliveryCol: ITypedColDef<IControlTowerListItemDto, number> = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.diffRobBeforeDelivery,
    colId: ControlTowerQuantityRobDifferenceListColumns.diffRobBeforeDelivery,
    field: model('diffRobBeforeDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.toleranceMatchStyle(
        params.data?.diffRobBeforeDelivery,
        params.data?.qtyBeforeDeliveryUom
      ),
    width: 140
  };

  qtyBeforeDeliveryUomCol: ITypedColDef<
    IControlTowerListItemDto,
    IToleranceUomDto
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.qtyBeforeDeliveryUom,
    colId: ControlTowerQuantityRobDifferenceListColumns.qtyBeforeDeliveryUom,
    field: model('qtyBeforeDeliveryUom'),
    cellRenderer: params => {
      const a = document.createElement('div');
      a.innerHTML = params.value?.name;
      return a;
    },
    valueFormatter: params => params.value?.name
  };

  bdnQuantityCol: ITypedColDef<IControlTowerListItemDto, number> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.bdnQuantity,
    colId: ControlTowerQuantityRobDifferenceListColumns.bdnQuantity,
    field: model('bdnQuantity'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredDeliveredQtyCol: ITypedColDef<IControlTowerListItemDto, number> = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.measuredDeliveredQty,
    colId: ControlTowerQuantityRobDifferenceListColumns.measuredDeliveredQty,
    field: model('measuredDeliveredQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffDeliveredQtyCol: ITypedColDef<IControlTowerListItemDto, number> = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.diffDeliveredQty,
    colId: ControlTowerQuantityRobDifferenceListColumns.diffDeliveredQty,
    field: model('diffDeliveredQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.toleranceMatchStyle(
        params.data?.diffDeliveredQty,
        params.data?.qtyDeliveredUom
      )
  };

  qtyDeliveredUomCol: ITypedColDef<
    IControlTowerListItemDto,
    IToleranceUomDto
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.qtyDeliveredUom,
    colId: ControlTowerQuantityRobDifferenceListColumns.qtyDeliveredUom,
    field: model('qtyDeliveredUom'),
    cellRenderer: params => {
      const a = document.createElement('div');
      a.innerHTML = params.value?.name;
      return a;
    },
    valueFormatter: params => params.value?.name
  };

  logBookRobAfterDeliveryCol: ITypedColDef<IControlTowerListItemDto, number> = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.logBookRobAfterDelivery,
    colId: ControlTowerQuantityRobDifferenceListColumns.logBookRobAfterDelivery,
    field: model('logBookRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredRobAfterDeliveryCol: ITypedColDef<
    IControlTowerListItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.measuredRobAfterDelivery,
    colId:
      ControlTowerQuantityRobDifferenceListColumns.measuredRobAfterDelivery,
    field: model('measuredRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffRobAfterDeliveryCol: ITypedColDef<IControlTowerListItemDto, number> = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.diffRobAfterDelivery,
    colId: ControlTowerQuantityRobDifferenceListColumns.diffRobAfterDelivery,
    field: model('diffRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.toleranceMatchStyle(
        params.data?.diffRobAfterDelivery,
        params?.data?.qtyAfterDeliveryUom
      )
  };

  qtyAfterDeliveryUomCol: ITypedColDef<
    IControlTowerListItemDto,
    IToleranceUomDto
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.qtyAfterDeliveryUom,
    colId: ControlTowerQuantityRobDifferenceListColumns.qtyAfterDeliveryUom,
    field: model('qtyAfterDeliveryUom'),
    cellRenderer: params => {
      const a = document.createElement('div');
      a.innerHTML = params.value?.name;
      return a;
    },
    valueFormatter: params => params.value?.name
  };

  logBookSludgeRobBeforeDischargeCol: ITypedColDef<
    IControlTowerListItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.logBookSludgeRobBeforeDischarge,
    colId:
      ControlTowerQuantityRobDifferenceListColumns.logBookSludgeRobBeforeDischarge,
    field: model('logBookSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredSludgeRobBeforeDischargeCol: ITypedColDef<
    IControlTowerListItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.measuredSludgeRobBeforeDischarge,
    colId:
      ControlTowerQuantityRobDifferenceListColumns.measuredSludgeRobBeforeDischarge,
    field: model('measuredSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffSludgeRobBeforeDischargeCol: ITypedColDef<
    IControlTowerListItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.diffSludgeRobBeforeDischarge,
    colId:
      ControlTowerQuantityRobDifferenceListColumns.diffSludgeRobBeforeDischarge,
    field: model('diffSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.toleranceMatchStyleSecond(
        params.data?.diffSludgeRobBeforeDischarge,
        params?.data?.qtySludgeDischargedUom
      )
  };

  sludgeDischargedQtyCol: ITypedColDef<IControlTowerListItemDto, number> = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.sludgeDischargedQty,
    colId: ControlTowerQuantityRobDifferenceListColumns.sludgeDischargedQty,
    field: model('sludgeDischargedQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  qtySludgeDischargedUomCol: ITypedColDef<
    IControlTowerListItemDto,
    IToleranceUomDto
  > = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.qtySludgeDischargedUom,
    colId: ControlTowerQuantityRobDifferenceListColumns.qtySludgeDischargedUom,
    field: model('qtySludgeDischargedUom'),
    cellRenderer: params => {
      const a = document.createElement('div');
      a.innerHTML = params.value?.name;
      return a;
    },
    valueFormatter: params => params.value?.name
  };

  commentCol: ITypedColDef<IControlTowerListItemDto, string> = {
    headerName: ControlTowerQuantityRobDifferenceListColumnsLabels.comment,
    colId: ControlTowerQuantityRobDifferenceListColumns.comment,
    field: model('comment'),
    cellRenderer: params => {
      const a = document.createElement('div');
      a.innerHTML = params.valueFormatted ?? params.value;
      return a;
    },
    tooltipValueGetter: params => params.valueFormatted ?? params.value
  };

  isVerifiedSludgeQtyCol: ITypedColDef<IControlTowerListItemDto, string> = {
    headerName:
      ControlTowerQuantityRobDifferenceListColumnsLabels.isVerifiedSludgeQty,
    colId: ControlTowerQuantityRobDifferenceListColumns.isVerifiedSludgeQty,
    field: model('isVerifiedSludgeQty'),
    cellRendererFramework: AgCellTemplateComponent,
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
    private reconStatusLookups: ReconStatusLookup,
    private reportService: QcReportService,
    private appErrorHandler: AppErrorHandler,
    private statusLookup: StatusLookup
  ) {
    super(
      'control-tower-quantity-rob-grid',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(
        ControlTowerQuantityRobDifferenceListGridViewModel.name
      )
    );
    this.init(this.gridOptions, true);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.selectCol,
      this.openPopUp,
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

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public filterByStatus(): void {
    let grid = this.gridApi.getFilterModel();
    grid['vesselName'] = {
      filterType: 'text',
      type: 'contains',
      filter: 'CMA'
    };
    this.gridApi.setFilterModel(grid);
    let grid1 = this.gridApi.getFilterModel();
    // this.gridApi.purgeServerSideCache();
  }

  public checkIfStatusExist() {}

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    let values = transformLocalToServeGridInfo(
      this.gridApi,
      params,
      ControlTowerQuantityRobDifferenceListColumnServerKeys,
      this.searchText
    );
    this.paramsServerSide = params;
    this.exportUrl = this.reportService.getQcReportListExportUrl();
    this.reportService
      .getReportsList$(
        transformLocalToServeGridInfo(
          this.gridApi,
          params,
          ControlTowerQuantityRobDifferenceListColumnServerKeys,
          this.searchText
        )
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => params.successCallback(response.items, response.totalCount),
        () => {
          this.appErrorHandler.handleError(
            AppError.FailedToLoadMastersData('vessel')
          );
          params.failCallback();
        }
      );
  }

  private toleranceMatchStyle(
    value: number,
    toleranceUom: IToleranceUomDto
  ): Partial<CSSStyleDeclaration> {
    if (
      value === null ||
      value === undefined ||
      toleranceUom === null ||
      toleranceUom === undefined
    )
      return {
        backgroundColor: 'inherit',
        color: 'inherit'
      };

    let status = this.reconStatusLookups.matched;

    if (Math.abs(value) >= toleranceUom.maxTolerance)
      status = this.reconStatusLookups.notMatched;

    if (
      Math.abs(value) > toleranceUom.minTolerance &&
      Math.abs(value) < toleranceUom.maxTolerance
    )
      status = this.reconStatusLookups.withinLimit;

    return {
      backgroundColor:
        status.name === ReconStatusLookupEnum.Matched ? 'inherit' : status.code,
      color: status.name === ReconStatusLookupEnum.Matched ? 'inherit' : '#fff'
    };
  }

  private toleranceMatchStyleSecond(
    value: number,
    toleranceUom: IToleranceUomDto
  ): Partial<CSSStyleDeclaration> {
    if (
      value === null ||
      value === undefined ||
      toleranceUom === null ||
      toleranceUom === undefined
    )
      return {
        backgroundColor: 'inherit',
        color: 'inherit'
      };

    let status = this.reconStatusLookups.matched;

    if (Math.abs(value) >= toleranceUom.maxTolerance)
      status = this.reconStatusLookups.notMatched;

    if (
      Math.abs(value) > toleranceUom.minTolerance &&
      Math.abs(value) < toleranceUom.maxTolerance
    )
      status = this.reconStatusLookups.withinLimit;

    return {
      backgroundColor:
        status.name === ReconStatusLookupEnum.Matched ? 'inherit' : status.code,
      color: status.name === ReconStatusLookupEnum.Matched ? 'inherit' : '#fff'
    };
  }
}
