import { ChangeDetectorRef, Injectable } from "@angular/core";
import { BaseGridViewModel } from "@shiptech/core/ui/components/ag-grid/base.grid-view-model";
import { GridOptions, IServerSideGetRowsParams } from "ag-grid-community";
import { ITypedColDef, RowModelType, RowSelection } from "@shiptech/core/ui/components/ag-grid/type.definition";
import { SurveyStatusEnum } from "../../../../core/enums/survey-status.enum";
import { AgCellTemplateComponent } from "@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component";
import { AgColumnPreferencesService } from "@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service";
import { ModuleLoggerFactory } from "../../../../core/logging/module-logger-factory";
import { TenantSettingsService } from "@shiptech/core/services/tenant-settings/tenant-settings.service";
import { TenantFormattingService } from "@shiptech/core/services/formatting/tenant-formatting.service";
import { QcReportService } from "../../../../services/qc-report.service";
import { AppErrorHandler } from "@shiptech/core/error-handling/app-error-handler";
import { IDeliveryTenantSettings } from "../../../../core/settings/delivery-tenant-settings";
import { TenantSettingsModuleName } from "@shiptech/core/store/states/tenant/tenant-settings.interface";
import { transformLocalToServeGridInfo } from "@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters";
import { AppError } from "@shiptech/core/error-handling/app-error";
import { IQcDocumentsItemDto } from "../../../../services/api/dto/qc-document.dto";
import {
  QcDocumentsListColumns,
  QcDocumentsListColumnServerKeys,
  QcDocumentsListColumnsLabels
} from "./qc-documents.columns";

function model(prop: keyof IQcDocumentsItemDto): keyof IQcDocumentsItemDto {
  return prop;
}

@Injectable()
export class QcDocumentsListGridViewModel extends BaseGridViewModel {

  private defaultColFilterParams = {
    clearButton: true,
    applyButton: true,
    precision: () => this.format.quantityPrecision
  };

  public searchText: string;
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

    multiSortKey: "ctrl",

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: IQcDocumentsItemDto) => data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: "agTextColumnFilter",
      filterParams: this.defaultColFilterParams
    }
  };

  selectCol: ITypedColDef<IQcDocumentsItemDto> = {
    colId: QcDocumentsListColumns.selection,
    width: 50,
    checkboxSelection: params => params.data?.surveyStatus?.name === SurveyStatusEnum.New || params.data?.surveyStatus?.name === SurveyStatusEnum.Pending,
    editable: false,
    filter: false,
    sortable: false,
    suppressMenu: true,
    resizable: false,
    suppressAutoSize: true,
    suppressSizeToFit: true,
    suppressMovable: true,
    suppressNavigable: true,
    suppressColumnsToolPanel: true,
    suppressFiltersToolPanel: true,
    suppressCellFlash: true,
    suppressPaste: true,
    lockPosition: true,
    lockVisible: true,
    cellClass: "cell-border-green"
  };

  portCallId: ITypedColDef<IQcDocumentsItemDto, string> = {
    headerName: QcDocumentsListColumnsLabels.portCallId,
    colId: QcDocumentsListColumns.portCallId,
    field: model("portCallId"),
    cellRendererFramework: AgCellTemplateComponent
  };

  portNameCol: ITypedColDef<IQcDocumentsItemDto, string> = {
    headerName: QcDocumentsListColumnsLabels.portName,
    colId: QcDocumentsListColumns.portName,
    field: model("portName"),
    width: 106
  };

  vesselNameCol: ITypedColDef<IQcDocumentsItemDto, string> = {
    headerName: QcDocumentsListColumnsLabels.vesselName,
    colId: QcDocumentsListColumns.vesselName,
    field: model("vesselName"),
    width: 129
  };

  surveyDateCol: ITypedColDef<IQcDocumentsItemDto, string> = {
    headerName: QcDocumentsListColumnsLabels.surveyDate,
    colId: QcDocumentsListColumns.surveyDate,
    field: model("surveyDate"),
    filter: "agDateColumnFilter",
    valueFormatter: params => this.format.date(params.value),
    width: 150
  };

  private readonly minToleranceLimit;
  private readonly maxToleranceLimit;

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    tenantSettings: TenantSettingsService,
    private format: TenantFormattingService,
    private reportService: QcReportService,
    private appErrorHandler: AppErrorHandler
  ) {
    super("quantity-control-grid", columnPreferences, changeDetector, loggerFactory.createLogger(QcDocumentsListGridViewModel.name));
    this.init(this.gridOptions, true);

    const deliveryTenantSettings = tenantSettings.getModuleTenantSettings<IDeliveryTenantSettings>(TenantSettingsModuleName.Delivery);
    this.minToleranceLimit = deliveryTenantSettings.minToleranceLimit;
    this.maxToleranceLimit = deliveryTenantSettings.maxToleranceLimit;
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.selectCol,
      this.portCallId,
      this.portNameCol,
      this.vesselNameCol,
      this.surveyDateCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.reportService.getReportsList$(transformLocalToServeGridInfo(params, QcDocumentsListColumnServerKeys, this.searchText)).subscribe(
      response => params.successCallback(response.items, response.totalCount),
      () => {
        this.appErrorHandler.handleError(AppError.FailedToLoadMastersData("vessel"));
        params.failCallback();
      });
  }
}
