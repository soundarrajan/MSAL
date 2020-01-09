import { ChangeDetectorRef, Injectable } from "@angular/core";
import { BaseGridViewModel } from "@shiptech/core/ui/components/ag-grid/base.grid-view-model";
import { GridOptions, IServerSideGetRowsParams } from "ag-grid-community";
import { transformLocalToServeGridInfo } from "@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters";
import { AppError } from "@shiptech/core/error-handling/app-error";
import { QcReportService } from "../../../../services/qc-report.service";
import { AppErrorHandler } from "@shiptech/core/error-handling/app-error-handler";
import { QcEmailLogsColumns, QcEmailLogsColumnServerKeys, QcEmailLogsColumnsLabels } from "./qc-email-logs.columns";
import { AgColumnPreferencesService } from "@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service";
import { ModuleLoggerFactory } from "../../../../core/logging/module-logger-factory";
import { TenantSettingsService } from "@shiptech/core/services/tenant-settings/tenant-settings.service";
import { TenantFormattingService } from "@shiptech/core/services/formatting/tenant-formatting.service";
import { IDeliveryTenantSettings } from "../../../../core/settings/delivery-tenant-settings";
import { TenantSettingsModuleName } from "@shiptech/core/store/states/tenant/tenant-settings.interface";
import { ITypedColDef, RowModelType, RowSelection } from "@shiptech/core/ui/components/ag-grid/type.definition";
import { IQcEmailLogsItemDto } from "../../../../services/api/dto/qc-emails-list-item.dto";
import { IDisplayLookupDto } from "@shiptech/core/lookups/display-lookup-dto.interface";
import { GridApi } from "ag-grid-community/dist/lib/gridApi";

function model(prop: keyof IQcEmailLogsItemDto): keyof IQcEmailLogsItemDto {
  return prop;
}

@Injectable()
export class QcEmailLogsGridViewModel extends BaseGridViewModel {

  public searchText: string;
  private readonly minToleranceLimit;
  private readonly maxToleranceLimit;

  fromCol: ITypedColDef<IQcEmailLogsItemDto, string> = {
    headerName: QcEmailLogsColumnsLabels.from,
    colId: QcEmailLogsColumns.from,
    field: model("from"),
    width: 306
  };

  statusCol: ITypedColDef<IQcEmailLogsItemDto, IDisplayLookupDto> = {
    headerName: QcEmailLogsColumnsLabels.status,
    colId: QcEmailLogsColumns.status,
    field: model("status"),
    valueFormatter: params => params.value?.name,
    width: 206
  };

  toCol: ITypedColDef<IQcEmailLogsItemDto, string> = {
    headerName: QcEmailLogsColumnsLabels.to,
    colId: QcEmailLogsColumns.to,
    field: model("to"),
    width: 306
  };

  subjectCol: ITypedColDef<IQcEmailLogsItemDto, string> = {
    headerName: QcEmailLogsColumnsLabels.subject,
    colId: QcEmailLogsColumns.subject,
    field: model("subject"),
    width: 306
  };

  sendAtCol: ITypedColDef<IQcEmailLogsItemDto, string> = {
    headerName: QcEmailLogsColumnsLabels.sentAt,
    colId: QcEmailLogsColumns.sentAt,
    field: model("sentAt"),
    valueFormatter: params => this.format.date(params.value),
    width: 206
  };

  private defaultColFilterParams = {
    clearButton: true,
    applyButton: true,
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

    multiSortKey: "ctrl",

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: IQcEmailLogsItemDto) => data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: "agTextColumnFilter",
      filterParams: this.defaultColFilterParams
    }
  };

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.fromCol,
      this.statusCol,
      this.toCol,
      this.subjectCol,
      this.sendAtCol
    ];
  };


  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    tenantSettings: TenantSettingsService,
    private format: TenantFormattingService,
    private quantityControlService: QcReportService,
    private appErrorHandler: AppErrorHandler
  ) {
    super("quantity-control-email-logs-grid", columnPreferences, changeDetector, loggerFactory.createLogger(QcEmailLogsGridViewModel.name));
    this.init(this.gridOptions, false);

    const deliveryTenantSettings = tenantSettings.getModuleTenantSettings<IDeliveryTenantSettings>(TenantSettingsModuleName.Delivery);
    this.minToleranceLimit = deliveryTenantSettings.minToleranceLimit;
    this.maxToleranceLimit = deliveryTenantSettings.maxToleranceLimit;

  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.quantityControlService.getEmailLogs$(transformLocalToServeGridInfo(params, QcEmailLogsColumnServerKeys, this.searchText)).subscribe(
      response => params.successCallback(response.payload, response.matchedCount),
      () => {
        this.appErrorHandler.handleError(AppError.FailedToLoadMastersData("emails"));
        params.failCallback();
      });
  }

}
