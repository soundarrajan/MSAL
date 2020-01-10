import { ChangeDetectorRef, Injectable } from "@angular/core";
import { BaseGridViewModel } from "@shiptech/core/ui/components/ag-grid/base.grid-view-model";
import { GridOptions, IServerSideGetRowsParams } from "ag-grid-community";
import { transformLocalToServeGridInfo } from "@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters";
import { AppError } from "@shiptech/core/error-handling/app-error";
import { QcReportService } from "../../../../services/qc-report.service";
import { AppErrorHandler } from "@shiptech/core/error-handling/app-error-handler";
import { QcEmailLogsListColumns, QcEmailLogsListColumnServerKeys, QcEmailLogsListColumnsLabels } from "./qc-email-logs-list.columns";
import { AgColumnPreferencesService } from "@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service";
import { ModuleLoggerFactory } from "../../../../core/logging/module-logger-factory";
import { TenantSettingsService } from "@shiptech/core/services/tenant-settings/tenant-settings.service";
import { TenantFormattingService } from "@shiptech/core/services/formatting/tenant-formatting.service";
import { IDeliveryTenantSettings } from "../../../../core/settings/delivery-tenant-settings";
import { TenantSettingsModuleName } from "@shiptech/core/store/states/tenant/tenant-settings.interface";
import {
  AgGridKnownFilterTypes,
  ITypedColDef,
  RowModelType,
  RowSelection
} from "@shiptech/core/ui/components/ag-grid/type.definition";
import { IEmailLogsItemDto } from "@shiptech/core/services/masters-api/request-response-dtos/email-logs.dto";
import { IDisplayLookupDto } from "@shiptech/core/lookups/display-lookup-dto.interface";
import { GridApi } from "ag-grid-community/dist/lib/gridApi";
import {
  ServerGridConditionFilterEnum,
  ShiptechGridFilterOperators
} from "@shiptech/core/grid/server-grid/server-grid-condition-filter.enum";
import { nameof } from "@shiptech/core/utils/type-definitions";
import { ServerQueryFilter } from "@shiptech/core/grid/server-grid/server-query.filter";
import { IAppState } from "@shiptech/core/store/states/app.state.interface";
import { Store } from "@ngxs/store";
import { AgCellTemplateComponent } from "@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component";
import { BooleanFilterParams } from "@shiptech/core/ui/components/ag-grid/ag-grid-utils";

function model(prop: keyof IEmailLogsItemDto): keyof IEmailLogsItemDto {
  return prop;
}

@Injectable()
export class QcEmailLogsGridViewModel extends BaseGridViewModel {

  private defaultColFilterParams = {
    clearButton: true,
    applyButton: true
  };

  fromCol: ITypedColDef<IEmailLogsItemDto, string> = {
    headerName: QcEmailLogsListColumnsLabels.from,
    colId: QcEmailLogsListColumns.from,
    field: model("from"),
    cellRendererFramework: AgCellTemplateComponent,
    width: 306
  };

  statusCol: ITypedColDef<IEmailLogsItemDto, IDisplayLookupDto> = {
    headerName: QcEmailLogsListColumnsLabels.status,
    colId: QcEmailLogsListColumns.status,
    field: model("status"),
    valueFormatter: params => params.value?.name,
    width: 206
  };

  toCol: ITypedColDef<IEmailLogsItemDto, string> = {
    headerName: QcEmailLogsListColumnsLabels.to,
    colId: QcEmailLogsListColumns.to,
    field: model("to"),
    width: 306
  };

  subjectCol: ITypedColDef<IEmailLogsItemDto, string> = {
    headerName: QcEmailLogsListColumnsLabels.subject,
    colId: QcEmailLogsListColumns.subject,
    field: model("subject"),
    width: 306
  };

  sendAtCol: ITypedColDef<IEmailLogsItemDto, string> = {
    headerName: QcEmailLogsListColumnsLabels.sentAt,
    colId: QcEmailLogsListColumns.sentAt,
    field: model("sentAt"),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    width: 206
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
    getRowNodeId: (data: IEmailLogsItemDto) => data?.id?.toString() ?? Math.random().toString(),
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
    private appErrorHandler: AppErrorHandler,
    private store: Store
  ) {
    super("quantity-control-email-logs-grid", columnPreferences, changeDetector, loggerFactory.createLogger(QcEmailLogsGridViewModel.name));
    this.init(this.gridOptions, false);
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    const emailTransactionTypeId =  (<IAppState>this.store.snapshot()).quantityControl.report.details.emailTransactionTypeId;
    const reportId =  (<IAppState>this.store.snapshot()).quantityControl.report.details.id;

    this.quantityControlService.getEmailLogs$(transformLocalToServeGridInfo(params, QcEmailLogsListColumnServerKeys), emailTransactionTypeId, reportId).subscribe(
      response => params.successCallback(response.payload, response.matchedCount),
      () => {
        this.appErrorHandler.handleError(AppError.FailedToLoadMastersData("emails"));
        params.failCallback();
      });
  }

}
