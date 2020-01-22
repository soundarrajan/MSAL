import {ChangeDetectorRef, Inject, Injectable, Input} from "@angular/core";
import {BaseGridViewModel} from "@shiptech/core/ui/components/ag-grid/base.grid-view-model";
import {GridOptions, IServerSideGetRowsParams} from "ag-grid-community";
import {transformLocalToServeGridInfo} from "@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters";
import {AppError} from "@shiptech/core/error-handling/app-error";
import {AppErrorHandler} from "@shiptech/core/error-handling/app-error-handler";
import {EmailLogsListColumns, EmailLogsListColumnServerKeys, EmailLogsListColumnsLabels} from "./email-logs-list.columns";
import {AgColumnPreferencesService} from "@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service";
import {TenantFormattingService} from "@shiptech/core/services/formatting/tenant-formatting.service";
import {ITypedColDef, RowModelType, RowSelection} from "@shiptech/core/ui/components/ag-grid/type.definition";
import {IEmailLogsItemDto} from "@shiptech/core/services/masters-api/request-response-dtos/email-logs.dto";
import {IDisplayLookupDto} from "@shiptech/core/lookups/display-lookup-dto.interface";
import {AgCellTemplateComponent} from "@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component";
import {IEmailLogsApiService} from "@shiptech/core/services/masters-api/email-logs-api.service.interface";
import {EMAIL_LOGS_API_SERVICE} from "@shiptech/core/services/masters-api/email-logs-api.service";
import {ServerQueryFilter} from "@shiptech/core/grid/server-grid/server-query.filter";
import {LoggerFactory} from "@shiptech/core/logging/logger-factory.service";
import {takeUntil} from "rxjs/operators";
import {EmailStatusLookup} from "@shiptech/core/lookups/known-lookups/email-status/email-status-lookup.service";
import { ModuleError } from "@shiptech/core/ui/components/email-log/error-handling/module-error";

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

  editCol: ITypedColDef<IEmailLogsItemDto> = {
    colId: 'editCol',
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
    cellClass: 'text-align-center',
    cellRendererFramework: AgCellTemplateComponent,
    width: 20
  };

  fromCol: ITypedColDef<IEmailLogsItemDto, string> = {
    headerName: EmailLogsListColumnsLabels.from,
    colId: EmailLogsListColumns.from,
    field: model("from"),
    minWidth: 250,
    flex: 2
  };

  statusCol: ITypedColDef<IEmailLogsItemDto, IDisplayLookupDto> = {
    headerName: EmailLogsListColumnsLabels.status,
    colId: EmailLogsListColumns.status,
    field: model("status"),
    valueFormatter: params => params.value?.name,
    cellClass: 'cell-background',
    cellStyle: params => ({
      backgroundColor: this.emailStatusLookpup.toEmailStatus(params.data?.status?.name).code ? this.emailStatusLookpup.toEmailStatus(params.data?.status?.name).code : '#fff',
      color: this.emailStatusLookpup.toEmailStatus(params.data?.status?.name).code ? '#fff' : '#333'
    }),
    minWidth: 100,
    flex: 2
  };

  toCol: ITypedColDef<IEmailLogsItemDto, string> = {
    headerName: EmailLogsListColumnsLabels.to,
    colId: EmailLogsListColumns.to,
    field: model("to"),
    minWidth: 250,
    flex: 2
  };

  subjectCol: ITypedColDef<IEmailLogsItemDto, string> = {
    headerName: EmailLogsListColumnsLabels.subject,
    colId: EmailLogsListColumns.subject,
    field: model("subject"),
    minWidth: 400,
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
      filterParams: this.defaultColFilterParams
    }
  };

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.editCol,
      this.toCol,
      this.fromCol,
      this.statusCol,
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
    private appErrorHandler: AppErrorHandler,
    private emailStatusLookpup: EmailStatusLookup
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
        columnName: "EmailTransactionTypesName",
        value: this.entityName
      }];

    this.emailLogsApi.getEmailLogs({...transformLocalToServeGridInfo(this.gridApi, params, EmailLogsListColumnServerKeys), filters})
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => params.successCallback(response.payload, response.matchedCount),
        () => {
          this.appErrorHandler.handleError(ModuleError.LoadEmailLogsFailed);
          params.failCallback();
        });
  }
}
