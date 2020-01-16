import { ChangeDetectorRef, Inject, Injectable, Input } from "@angular/core";
import { BaseGridViewModel } from "@shiptech/core/ui/components/ag-grid/base.grid-view-model";
import { GridOptions, IServerSideGetRowsParams } from "ag-grid-community";
import { transformLocalToServeGridInfo } from "@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters";
import { AppError } from "@shiptech/core/error-handling/app-error";
import { AppErrorHandler } from "@shiptech/core/error-handling/app-error-handler";
import { EmailLogsListColumns, EmailLogsListColumnServerKeys, EmailLogsListColumnsLabels } from "./email-logs-list.columns";
import { AgColumnPreferencesService } from "@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service";
import { TenantFormattingService } from "@shiptech/core/services/formatting/tenant-formatting.service";
import { ITypedColDef, RowModelType, RowSelection } from "@shiptech/core/ui/components/ag-grid/type.definition";
import { IEmailLogsItemDto } from "@shiptech/core/services/masters-api/request-response-dtos/email-logs.dto";
import { IDisplayLookupDto } from "@shiptech/core/lookups/display-lookup-dto.interface";
import { AgCellTemplateComponent } from "@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component";
import { IEmailLogsApiService } from "@shiptech/core/services/masters-api/email-logs-api.service.interface";
import { EMAIL_LOGS_API_SERVICE } from "@shiptech/core/services/masters-api/email-logs-api.service";
import { ServerQueryFilter } from "@shiptech/core/grid/server-grid/server-query.filter";
import { LoggerFactory } from "@shiptech/core/logging/logger-factory.service";
import {StatusLookupEnum} from "@shiptech/core/lookups/known-lookups/status/status-lookup.enum";

function model(prop: keyof IEmailLogsItemDto): keyof IEmailLogsItemDto {
  return prop;
}

@Injectable()
export class EmailLogsGridViewModel extends BaseGridViewModel {

  private _entityId: number;
  private _entityName: string;

  get entityId(): number {
    return this._entityId;
  }

  get entityName(): string {
    return this._entityName;
  }

  @Input() set entityId(value: number) {
    this._entityId = value;
    if (this.isReady) {
      this.gridApi.purgeServerSideCache();
    }
  }

  @Input() set entityName(value: string) {
    this._entityName = value;
    if (this.isReady) {
      this.gridApi.purgeServerSideCache();
    }
  }

  private defaultColFilterParams = {
    clearButton: true,
    applyButton: true
  };

  fromCol: ITypedColDef<IEmailLogsItemDto, string> = {
    headerName: EmailLogsListColumnsLabels.from,
    colId: EmailLogsListColumns.from,
    field: model("from"),
    cellRendererFramework: AgCellTemplateComponent,
    minWidth: 400,
    flex: 2
  };

  statusCol: ITypedColDef<IEmailLogsItemDto, IDisplayLookupDto> = {
    headerName: EmailLogsListColumnsLabels.status,
    colId: EmailLogsListColumns.status,
    field: model("status"),
    valueFormatter: params => params.value?.name,
    cellClass: 'cell-background',
    cellStyle: params => ({
      backgroundColor: params.data?.status?.name === StatusLookupEnum.New ? 'inherit' : params.data?.status?.code,
      color: params.data?.status?.name === StatusLookupEnum.New ? 'inherit' : '#fff'
    }),
    minWidth: 200,
    flex: 2
  };

  toCol: ITypedColDef<IEmailLogsItemDto, string> = {
    headerName: EmailLogsListColumnsLabels.to,
    colId: EmailLogsListColumns.to,
    field: model("to"),
    minWidth: 400,
    flex: 2
  };

  subjectCol: ITypedColDef<IEmailLogsItemDto, string> = {
    headerName: EmailLogsListColumnsLabels.subject,
    colId: EmailLogsListColumns.subject,
    field: model("subject"),
    minWidth: 500,
    flex: 2
  };

  sendAtCol: ITypedColDef<IEmailLogsItemDto, string> = {
    headerName: EmailLogsListColumnsLabels.sentAt,
    colId: EmailLogsListColumns.sentAt,
    field: model("sentAt"),
    filter: "agDateColumnFilter",
    valueFormatter: params => this.format.date(params.value),
    minWidth: 180,
    flex: 2
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
      filterParams: this.defaultColFilterParams,
      flex: 1
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
    loggerFactory: LoggerFactory,
    @Inject(EMAIL_LOGS_API_SERVICE) private emailLogsApi: IEmailLogsApiService,
    private format: TenantFormattingService,
    private appErrorHandler: AppErrorHandler
  ) {
    super("email-logs-grid", columnPreferences, changeDetector, loggerFactory.createLogger(EmailLogsGridViewModel.name));
    this.init(this.gridOptions, false);
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    const filters: ServerQueryFilter[] = [
      {
        columnName: "TransactionIds",
        value: this.entityId.toString(10)
      },
      {
        columnName: "EmailTransactionTypeName",
        value: this.entityName
      }];

    this.emailLogsApi.getEmailLogs({ ...transformLocalToServeGridInfo(this.gridApi, params, EmailLogsListColumnServerKeys), filters }).subscribe(
      response => params.successCallback(response.payload, response.matchedCount),
      () => {
        this.appErrorHandler.handleError(AppError.LoadEmailLogsFailed);
        params.failCallback();
      });
  }

}
