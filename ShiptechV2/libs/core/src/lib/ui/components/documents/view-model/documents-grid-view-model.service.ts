import { ChangeDetectorRef, Inject, Injectable } from "@angular/core";
import { BaseGridViewModel } from "@shiptech/core/ui/components/ag-grid/base.grid-view-model";
import { GridOptions, IServerSideGetRowsParams } from "ag-grid-community";
import { ITypedColDef, RowModelType, RowSelection } from "@shiptech/core/ui/components/ag-grid/type.definition";
import { AgColumnPreferencesService } from "@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service";
import { TenantFormattingService } from "@shiptech/core/services/formatting/tenant-formatting.service";
import { AppErrorHandler } from "@shiptech/core/error-handling/app-error-handler";
import { transformLocalToServeGridInfo } from "@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters";
import { AppError } from "@shiptech/core/error-handling/app-error";
import { IDocumentsItemDto } from "@shiptech/core/services/masters-api/request-response-dtos/document.dto";
import { DocumentsListColumns, DocumentsListColumnServerKeys, DocumentsListColumnsLabels } from "./documents-list.columns";
import { Store } from "@ngxs/store";
import { LoggerFactory } from "@shiptech/core/logging/logger-factory.service";
import { DOCUMENTS_MASTERS_API_SERVICE } from "@shiptech/core/services/masters-api/documents-api.service";
import { IDocumentsApiService } from "@shiptech/core/services/masters-api/documents-api.service.interface";
import { ServerQueryFilter } from "@shiptech/core/grid/server-grid/server-query.filter";
import { IDisplayLookupDto } from "@shiptech/core/lookups/display-lookup-dto.interface";

function model(prop: keyof IDocumentsItemDto): keyof IDocumentsItemDto {
  return prop;
}

@Injectable()
export class DocumentsGridViewModel extends BaseGridViewModel {

  entityId: number;
  entityName: string;

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
      filterParams: this.defaultColFilterParams
    }
  };

  nameCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.name,
    colId: DocumentsListColumns.name,
    field: model("name"),
    width: 106
  };

  sizeCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.size,
    colId: DocumentsListColumns.size,
    field: model("size"),
    width: 129
  };

  documentTypeCol: ITypedColDef<IDocumentsItemDto, IDisplayLookupDto> = {
    headerName: DocumentsListColumnsLabels.documentType,
    colId: DocumentsListColumns.documentType,
    field: model("documentType"),
    valueFormatter: params => params.value.name,
    width: 150
  };

  fileTypeCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.fileType,
    colId: DocumentsListColumns.fileType,
    field: model("fileType"),
    width: 150
  };

  transactionTypeCol: ITypedColDef<IDocumentsItemDto, IDisplayLookupDto> = {
    headerName: DocumentsListColumnsLabels.transactionType,
    colId: DocumentsListColumns.transactionType,
    field: model("transactionType"),
    valueFormatter: params => params.value?.name,
    width: 150
  };

  referenceNoCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.referenceNo,
    colId: DocumentsListColumns.referenceNo,
    field: model("referenceNo"),
    width: 150
  };

  uploadedByCol: ITypedColDef<IDocumentsItemDto, IDisplayLookupDto> = {
    headerName: DocumentsListColumnsLabels.uploadedBy,
    colId: DocumentsListColumns.uploadedBy,
    field: model("uploadedBy"),
    valueFormatter: params => params.value?.name,
    width: 150
  };

  uploadedOnCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.uploadedOn,
    colId: DocumentsListColumns.uploadedOn,
    field: model("uploadedOn"),
    filter: "agDateColumnFilter",
    valueFormatter: params => this.format.date(params.value),
    width: 150
  };

  notesCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.notes,
    colId: DocumentsListColumns.notes,
    field: model("notes"),
    width: 150
  };

  isVerifiedCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.isVerified,
    colId: DocumentsListColumns.isVerified,
    field: model("isVerified"),
    width: 150
  };

  verifiedOnCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: DocumentsListColumnsLabels.verifiedOn,
    colId: DocumentsListColumns.verifiedOn,
    field: model("verifiedOn"),
    filter: "agDateColumnFilter",
    valueFormatter: params => this.format.date(params.value),
    width: 150
  };

  verifiedByCol: ITypedColDef<IDocumentsItemDto, IDisplayLookupDto> = {
    headerName: DocumentsListColumnsLabels.verifiedBy,
    colId: DocumentsListColumns.verifiedBy,
    field: model("verifiedBy"),
    valueFormatter: params => params.value?.name,
    width: 150
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: LoggerFactory,
    private format: TenantFormattingService,
    @Inject(DOCUMENTS_MASTERS_API_SERVICE) private mastersApi: IDocumentsApiService,
    private appErrorHandler: AppErrorHandler,
    private store: Store
  ) {
    super("documents-grid", columnPreferences, changeDetector, loggerFactory.createLogger(DocumentsGridViewModel.name));
    this.init(this.gridOptions);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
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
        columnName: "TransactionTypeId",
        value: this.entityName
      },
      {
        columnName: "ReferenceNo",
        value: this.entityId.toString(10)
      }];
    this.mastersApi.getDocumentList({ ...transformLocalToServeGridInfo(this.gridApi, params, DocumentsListColumnServerKeys), filters }).subscribe(
      response => params.successCallback(response.payload, response.matchedCount),
      () => {
        this.appErrorHandler.handleError(AppError.FailedToLoadMastersData("emails"));
        params.failCallback();
      });
  }
}
