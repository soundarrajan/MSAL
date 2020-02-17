import { IVesselMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/vessel';
import { ChangeDetectorRef, Inject, Injectable, Input } from '@angular/core';
import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { GridOptions, IServerSideGetRowsParams } from '@ag-grid-community/core';
import {
  ITypedColDef,
  RowModelType,
  RowSelection
} from '@shiptech/core/ui/components/ag-grid/type.definition';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { LoggerFactory } from '@shiptech/core/logging/logger-factory.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import {
  VesselMasterListColumns,
  VesselMasterListColumnsLabels
} from '@shiptech/core/ui/components/master-selector/view-models/vessel-model/vessel-master-list.columns';
import { takeUntil } from 'rxjs/operators';
import { IDocumentsMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-master.dto';
import {
  DocumentsMasterListColumns,
  DocumentsMasterListColumnServerKeys,
  DocumentsMasterListColumnsLabels
} from '@shiptech/core/ui/components/master-selector/view-models/documents-model/documents-master-list.columns';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { DOCUMENTS_API_SERVICE } from '@shiptech/core/services/masters-api/documents-api.service';
import { IDocumentsApiService } from '@shiptech/core/services/masters-api/documents-api.service.interface';
import { ModuleError } from '@shiptech/core/ui/components/documents/error-handling/module-error';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { ServerQueryFilter } from '@shiptech/core/grid/server-grid/server-query.filter';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';

function model(prop: keyof IDocumentsMasterDto): keyof IDocumentsMasterDto {
  return prop;
}

// TODO: to be read from entity types and remove this hardcoded id
const TRANSACTION_TYPE_ID: number = 46;

@Injectable()
export class DocumentsMasterSelectorGridViewModel extends BaseGridViewModel {
  get entityId(): number {
    return this._entityId;
  }

  get entityName(): string {
    return this._entityName;
  }

  @Input() set entityId(value: number) {
    this._entityId = value;
  }

  @Input() set entityName(value: string) {
    this._entityName = value;
  }
  _entityName: string;
  _entityId: number;

  public searchText: string;
  public defaultColFilterParams = {
    clearButton: true,
    applyButton: true,
    precision: () => this.format.quantityPrecision
  };
  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 40,
    suppressContextMenu: true,

    rowModelType: RowModelType.ServerSide,
    pagination: true,
    animateRows: true,
    rowSelection: RowSelection.Single,
    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: any) =>
      data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  selectCol: ITypedColDef = {
    colId: 'selection',
    width: 50,
    checkboxSelection: true,
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
    cellClass: 'cell-border-green'
  };

  idCol: ITypedColDef<IDocumentsMasterDto, number> = {
    headerName: DocumentsMasterListColumnsLabels.id,
    colId: DocumentsMasterListColumns.id,
    field: model('id'),
    minWidth: 100,
    flex: 1
  };

  documentNameCol: ITypedColDef<IDocumentsMasterDto, string> = {
    headerName: DocumentsMasterListColumnsLabels.documentTypeName,
    colId: DocumentsMasterListColumns.documentTypeName,
    field: model('name'),
    minWidth: 250,
    flex: 2
  };

  documentDisplayNameCol: ITypedColDef<IDocumentsMasterDto, string> = {
    headerName: DocumentsMasterListColumnsLabels.documentTypeDisplayName,
    colId: DocumentsMasterListColumns.documentTypeDisplayName,
    field: model('displayName'),
    minWidth: 175,
    flex: 2
  };

  createdByCol: ITypedColDef<IDocumentsMasterDto, IDisplayLookupDto> = {
    headerName: DocumentsMasterListColumnsLabels.createdBy,
    colId: DocumentsMasterListColumns.createdBy,
    field: model('createdBy'),
    valueFormatter: params => params.value?.name,
    minWidth: 200,
    flex: 2
  };

  createdOnCol: ITypedColDef<IDocumentsMasterDto, string> = {
    headerName: DocumentsMasterListColumnsLabels.createdOn,
    colId: DocumentsMasterListColumns.createdOn,
    field: model('createdOn'),
    minWidth: 175,
    flex: 2
  };

  lastModifiedByCol: ITypedColDef<IDocumentsMasterDto, IDisplayLookupDto> = {
    headerName: DocumentsMasterListColumnsLabels.lastModifiedBy,
    colId: DocumentsMasterListColumns.lastModifiedBy,
    field: model('lastModifiedBy'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  lastModifiedOnCol: ITypedColDef<IDocumentsMasterDto, string> = {
    headerName: DocumentsMasterListColumnsLabels.lastModifiedOn,
    colId: DocumentsMasterListColumns.lastModifiedOn,
    field: model('lastModifiedOn'),
    minWidth: 175,
    flex: 2
  };

  statusCol: ITypedColDef<IVesselMasterDto, boolean> = {
    headerName: VesselMasterListColumnsLabels.status,
    colId: VesselMasterListColumns.status,
    field: model('isDeleted'),
    valueFormatter: params => (params.data?.isDeleted ? 'INACTIVE' : 'ACTIVE'), // TODO hardcoded values
    cellClass: 'cell-background',
    cellClassRules: {
      active: params => params.data?.isDeleted ?? false,
      inactive: params => !(params.data?.isDeleted ?? false)
    },
    minWidth: 100,
    flex: 1
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: LoggerFactory,
    private format: TenantFormattingService,
    private appErrorHandler: AppErrorHandler,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    @Inject(DOCUMENTS_API_SERVICE) private mastersApi: IDocumentsApiService
  ) {
    super(
      'documents-master-selector-grid',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(DocumentsMasterSelectorGridViewModel.name)
    );
    this.init(this.gridOptions, true);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.selectCol,
      this.idCol,
      this.documentNameCol,
      this.documentDisplayNameCol,
      this.createdByCol,
      this.createdOnCol,
      this.lastModifiedByCol,
      this.lastModifiedOnCol,
      this.statusCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    const filters: ServerQueryFilter[] = [
      /*{
        columnName: "TransactionTypeId",
        value: TRANSACTION_TYPE_ID.toString(10)
      },*/
      {
        columnName: 'ReferenceNo',
        value: this.entityId.toString(10)
      }
    ];
    this.mastersApi
      .getDocumentsMaster({
        ...transformLocalToServeGridInfo(
          this.gridApi,
          params,
          DocumentsMasterListColumnServerKeys,
          this.searchText
        ),
        filters
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response =>
          params.successCallback(response.payload, response.matchedCount),
        () => {
          this.appErrorHandler.handleError(ModuleError.DocumentsTypeLoadError);
          params.failCallback();
        }
      );
  }
}
