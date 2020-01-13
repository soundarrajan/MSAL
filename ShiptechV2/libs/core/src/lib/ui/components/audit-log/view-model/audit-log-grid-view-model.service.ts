import { BaseGridViewModel } from "@shiptech/core/ui/components/ag-grid/base.grid-view-model";
import { ChangeDetectorRef, Injectable } from "@angular/core";
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

@Injectable()
export class AuditLogGridViewModel extends BaseGridViewModel {

  entityTransactionType: string;
  businessId: number;

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

    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: IAuditLogItemDto) => data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  date: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.date,
    colId: AuditLogListColumns.date,
    field: "date",
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    width: 170
  };

  modulePathUrl: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.modulePathUrl,
    colId: AuditLogListColumns.modulePathUrl,
    field: "modulePathUrl",
    width: 170
  };

  businessName: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.businessName,
    colId: AuditLogListColumns.businessName,
    field: "businessName",
    width: 170
  };

  transactionType: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.transactionType,
    colId: AuditLogListColumns.transactionType,
    field: "transactionType",
    width: 130
  };

  fieldName: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.fieldName,
    colId: AuditLogListColumns.fieldName,
    field: "fieldName",
    width: 220
  };

  oldValue: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.oldValue,
    colId: AuditLogListColumns.oldValue,
    field: "oldValue",
    width: 170
  };

  newValue: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.newValue,
    colId: AuditLogListColumns.newValue,
    field: "newValue",
    width: 170
  };

  modifiedBy: ITypedColDef<IAuditLogItemDto, IDisplayLookupDto> = {
    headerName: AuditLogColumnsLabels.modifiedBy,
    colId: AuditLogListColumns.modifiedBy,
    field: "modifiedBy",
    valueFormatter: params => params.value?.name,
    width: 360
  };

  clientIpAddress: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.clientIpAddress,
    colId: AuditLogListColumns.clientIpAddress,
    field: "clientIpAddress",
    width: 130
  };

  userAction: ITypedColDef<IAuditLogItemDto, string> = {
    headerName: AuditLogColumnsLabels.userAction,
    colId: AuditLogListColumns.userAction,
    field: "userAction",
    width: 170
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: LoggerFactory,
    private format: TenantFormattingService,
    private adminApi: IAuditLogApiService,
    private appErrorHandler: AppErrorHandler
  ) {
    super('audit-log-grid', columnPreferences, changeDetector, loggerFactory.createLogger(AuditLogGridViewModel.name));
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
        value: this.businessId.toString(10)
      },
      {
        columnName: "Transaction",
        value: this.entityTransactionType
      }];

    this.adminApi.getAuditLog({...transformLocalToServeGridInfo(params, AuditLogColumnServerKeys), filters}).subscribe(
      response => params.successCallback(response.payload, response.matchedCount),
      () => {
        this.appErrorHandler.handleError(AppError.FailedToLoadMastersData('audit'));
        params.failCallback();
      });
  }
}
