import { BaseGridViewModel } from "@shiptech/core/ui/components/ag-grid/base.grid-view-model";
import { ChangeDetectorRef, Inject, Injectable } from "@angular/core";
import { GridOptions, IServerSideGetRowsParams } from "ag-grid-community";
import { ITypedColDef, RowModelType, RowSelection } from "@shiptech/core/ui/components/ag-grid/type.definition";
import { AgColumnPreferencesService } from "@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service";
import { transformLocalToServeGridInfo } from "@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters";
import { IDisplayLookupDto } from "@shiptech/core/lookups/display-lookup-dto.interface";
import { AppErrorHandler } from "@shiptech/core/error-handling/app-error-handler";
import { AppError } from "@shiptech/core/error-handling/app-error";
import { TenantFormattingService } from "@shiptech/core/services/formatting/tenant-formatting.service";
import { IAuditLogItemDto } from "@shiptech/core/services/admin-api/request-response-dtos/audit-log.dto";
import { AuditLogColumnServerKeys, AuditLogColumnsLabels, AuditLogListColumns } from "./audit-log-list.columns";
import { LoggerFactory } from "@shiptech/core/logging/logger-factory.service";
import { ServerQueryFilter } from "@shiptech/core/grid/server-grid/server-query.filter";
import { IAuditLogApiService } from "@shiptech/core/services/admin-api/audit-log-api.service.interface";
import { AUDIT_LOG_ADMIN_API_SERVICE } from "@shiptech/core/services/admin-api/audit-log-api.service";

function model(prop: keyof IAuditLogItemDto): keyof IAuditLogItemDto {
  return prop;
}

@Injectable()
export class AuditLogGridViewModel extends BaseGridViewModel {

  entityName: string;
  entityId: number;

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

    rowSelection: RowSelection.Single,
    suppressRowClickSelection: true,

    multiSortKey: "ctrl",

    enableBrowserTooltips: true,
    getRowNodeId: (data: IAuditLogItemDto) => data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: "agTextColumnFilter",
      filterParams: this.defaultColFilterParams
    }
  };

  date: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.date,
    colId: AuditLogListColumns.date,
    field: model("date"),
    filter: "agDateColumnFilter",
    valueFormatter: params => this.format.date(params.value),
    width: 180
  };

  modulePathUrl: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.modulePathUrl,
    colId: AuditLogListColumns.modulePathUrl,
    field: model("modulePathUrl"),
    hide: true,
    width: 170
  };

  businessName: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.businessName,
    colId: AuditLogListColumns.businessName,
    field: model("businessName"),
    hide: true,
    width: 170
  };

  transactionType: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.transactionType,
    colId: AuditLogListColumns.transactionType,
    field: model("transactionType"),
    width: 200
  };

  fieldName: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.fieldName,
    colId: AuditLogListColumns.fieldName,
    field: model("fieldName"),
    width: 400
  };

  oldValue: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.oldValue,
    colId: AuditLogListColumns.oldValue,
    field: model("oldValue"),
    width: 200
  };

  newValue: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.newValue,
    colId: AuditLogListColumns.newValue,
    field: model("newValue"),
    width: 200
  };

  modifiedBy: ITypedColDef<IAuditLogItemDto, IDisplayLookupDto> = {
    headerName: AuditLogColumnsLabels.modifiedBy,
    colId: AuditLogListColumns.modifiedBy,
    field: model("modifiedBy"),
    valueFormatter: params => params.value?.name,
    width: 500
  };

  clientIpAddress: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.clientIpAddress,
    colId: AuditLogListColumns.clientIpAddress,
    field: model("clientIpAddress"),
    hide: true,
    width: 130
  };

  userAction: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.userAction,
    colId: AuditLogListColumns.userAction,
    field: model("userAction"),
    hide: true,
    width: 170
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: LoggerFactory,
    private format: TenantFormattingService,
    @Inject(AUDIT_LOG_ADMIN_API_SERVICE) private adminApi: IAuditLogApiService,
    private appErrorHandler: AppErrorHandler
  ) {
    super("audit-log-grid", columnPreferences, changeDetector, loggerFactory.createLogger(AuditLogGridViewModel.name));
    this.init(this.gridOptions);

  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.date,
      this.modulePathUrl,
      this.businessName,
      this.transactionType,
      this.fieldName,
      this.oldValue,
      this.newValue,
      this.modifiedBy,
      this.clientIpAddress,
      this.userAction
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    const filters: ServerQueryFilter[] = [
      {
        columnName: "BusinessId",
        value: this.entityId.toString(10)
      },
      {
        columnName: "Transaction",
        value: this.entityName
      }];

    this.adminApi.getAuditLog({ ...transformLocalToServeGridInfo(this.gridApi, params, AuditLogColumnServerKeys), filters }).subscribe(
      response => params.successCallback(response.payload, response.matchedCount),
      () => {
        this.appErrorHandler.handleError(AppError.FailedToLoadMastersData("audit"));
        params.failCallback();
      });
  }
}
