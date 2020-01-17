import { ChangeDetectorRef, Inject, Injectable, Input } from "@angular/core";
import { BaseGridViewModel } from "@shiptech/core/ui/components/ag-grid/base.grid-view-model";
import { GridOptions, IServerSideGetRowsParams } from "ag-grid-community";
import { ITypedColDef, RowModelType, RowSelection } from "@shiptech/core/ui/components/ag-grid/type.definition";
import { AgColumnPreferencesService } from "@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service";
import { TenantFormattingService } from "@shiptech/core/services/formatting/tenant-formatting.service";
import { AppErrorHandler } from "@shiptech/core/error-handling/app-error-handler";
import { transformLocalToServeGridInfo } from "@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters";
import { AppError } from "@shiptech/core/error-handling/app-error";
import { IDocumentsItemDto } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto";
import { DocumentsListColumns, DocumentsListColumnServerKeys, DocumentsListColumnsLabels } from "./documents-list.columns";
import { Store } from "@ngxs/store";
import { LoggerFactory } from "@shiptech/core/logging/logger-factory.service";
import { DOCUMENTS_API_SERVICE } from "@shiptech/core/services/masters-api/documents-api.service";
import { IDocumentsApiService } from "@shiptech/core/services/masters-api/documents-api.service.interface";
import { ServerQueryFilter } from "@shiptech/core/grid/server-grid/server-query.filter";
import { IDisplayLookupDto } from "@shiptech/core/lookups/display-lookup-dto.interface";
import { AgCellTemplateComponent } from "@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component";
import { IQcReportsListItemDto } from "../../../../../../../feature/quantity-control/src/lib/services/api/dto/qc-reports-list-item.dto";
import { QcReportsListColumns } from "../../../../../../../feature/quantity-control/src/lib/views/qc-reports-list/view-model/qc-reports-list.columns";
import { StatusLookupEnum } from "@shiptech/core/lookups/known-lookups/status/status-lookup.enum";
import { IDocumentsUpdateIsVerifiedRequest } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto";
import { IDocumentsUpdateNotesRequest } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto";
import { takeUntil } from "rxjs/operators";
import { BooleanFilterParams } from "@shiptech/core/ui/components/ag-grid/ag-grid-utils";

function model(prop: keyof IDocumentsItemDto): keyof IDocumentsItemDto {
  return prop;
}

@Injectable()
export class DocumentsGridViewModel extends BaseGridViewModel {

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
    getRowNodeId: (data: IDocumentsItemDto) => data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: "agTextColumnFilter",
      filterParams: this.defaultColFilterParams,
      flex: 1
    }
  };

  deleteCol: ITypedColDef<IQcReportsListItemDto> = {
    colId: 'deleteCol',
    width: 50,
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
    cellRendererFramework: AgCellTemplateComponent
  };

  nameCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.name,
    colId: DocumentsListColumns.name,
    field: model("name"),
    cellRendererFramework: AgCellTemplateComponent,
    minWidth: 200,
    flex:2
  };

  sizeCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.size,
    colId: DocumentsListColumns.size,
    field: model("size"),
    minWidth: 80,
    flex:2
  };

  documentTypeCol: ITypedColDef<IDocumentsItemDto, IDisplayLookupDto> = {
    headerName: DocumentsListColumnsLabels.documentType,
    colId: DocumentsListColumns.documentType,
    field: model("documentType"),
    valueFormatter: params => params.value?.name,
    minWidth: 300,
    flex:2
  };

  fileTypeCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.fileType,
    colId: DocumentsListColumns.fileType,
    field: model("fileType"),
    minWidth: 130,
    flex:2
  };

  transactionTypeCol: ITypedColDef<IDocumentsItemDto, IDisplayLookupDto> = {
    headerName: DocumentsListColumnsLabels.transactionType,
    colId: DocumentsListColumns.transactionType,
    field: model("transactionType"),
    valueFormatter: params => params.value?.name,
    minWidth: 200,
    flex:2
  };

  referenceNoCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.referenceNo,
    colId: DocumentsListColumns.referenceNo,
    field: model("referenceNo"),
    minWidth: 130,
    flex:2
  };

  uploadedByCol: ITypedColDef<IDocumentsItemDto, IDisplayLookupDto> = {
    headerName: DocumentsListColumnsLabels.uploadedBy,
    colId: DocumentsListColumns.uploadedBy,
    field: model("uploadedBy"),
    valueFormatter: params => params.value?.name,
    minWidth: 300,
    flex:2
  };

  uploadedOnCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.uploadedOn,
    colId: DocumentsListColumns.uploadedOn,
    field: model("uploadedOn"),
    filter: "agDateColumnFilter",
    valueFormatter: params => this.format.date(params.value),
    minWidth: 180,
    flex:2
  };

  notesCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.notes,
    colId: DocumentsListColumns.notes,
    field: model("notes"),
    cellRendererFramework: AgCellTemplateComponent,
    minWidth: 150,
    flex:2
  };

  isVerifiedCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.isVerified,
    colId: DocumentsListColumns.isVerified,
    field: model("isVerified"),
    cellRendererFramework: AgCellTemplateComponent,
    filterParams: {
      ...this.defaultColFilterParams,
      ...BooleanFilterParams
    },
    minWidth: 90,
    flex:2
  };

  verifiedOnCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.verifiedOn,
    colId: DocumentsListColumns.verifiedOn,
    field: model("verifiedOn"),
    filter: "agDateColumnFilter",
    valueFormatter: params => this.format.date(params.value),
    minWidth: 150,
    flex:2
  };

  verifiedByCol: ITypedColDef<IDocumentsItemDto, IDisplayLookupDto> = {
    headerName: DocumentsListColumnsLabels.verifiedBy,
    colId: DocumentsListColumns.verifiedBy,
    field: model("verifiedBy"),
    valueFormatter: params => params.value?.name,
    minWidth: 200,
    flex:2
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: LoggerFactory,
    private format: TenantFormattingService,
    @Inject(DOCUMENTS_API_SERVICE) private documentsApi: IDocumentsApiService,
    private appErrorHandler: AppErrorHandler
  ) {
    super("documents-grid", columnPreferences, changeDetector, loggerFactory.createLogger(DocumentsGridViewModel.name));
    this.init(this.gridOptions);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.deleteCol,
      this.nameCol,
      this.sizeCol,
      this.documentTypeCol,
      this.fileTypeCol,
      this.transactionTypeCol,
      this.referenceNoCol,
      this.uploadedByCol,
      this.uploadedOnCol,
      this.notesCol,
      this.isVerifiedCol,
      this.verifiedOnCol,
      this.verifiedByCol
    ];
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    const filters: ServerQueryFilter[] = [
      {
        columnName: "TransactionTypeName",
        value: this.entityName
      },
      {
        columnName: "ReferenceNo",
        value: this.entityId.toString(10)
      }];
    this.documentsApi.getDocumentList({ ...transformLocalToServeGridInfo(this.gridApi, params, DocumentsListColumnServerKeys), filters })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      response => params.successCallback(response.payload, response.matchedCount),
      () => {
        this.appErrorHandler.handleError(AppError.LoadDocumentsFailed);
        params.failCallback();
      });
  }
}
