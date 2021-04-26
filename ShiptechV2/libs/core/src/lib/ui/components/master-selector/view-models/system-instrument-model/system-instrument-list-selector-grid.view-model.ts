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
import { BdnInformationApiService } from '@shiptech/core/delivery-api/bdn-information/bdn-information-api.service';
import { IOrderListDto } from '@shiptech/core/delivery-api/request-reponse-dtos/order-list.dtos';
import { MastersListApiService } from '@shiptech/core/delivery-api/masters-list/masters-list-api.service';
import { IPhysicalSupplierListDto, IProductListDto, ISystemInstrumentListDto } from '@shiptech/core/delivery-api/masters-list/masters-list-response';
import { SystemInstrumentListColumns, SystemInstrumentListColumnServerKeys, SystemInstrumentListColumnsLabels } from './system-instrument-list.columns';



function model(prop: keyof ISystemInstrumentListDto): keyof ISystemInstrumentListDto {
  return prop;
}

// TODO: to be read from entity types and remove this hardcoded id
const TRANSACTION_TYPE_ID: number = 46;

@Injectable()
export class SystemInstrumentListSelectorGridViewModel extends BaseGridViewModel {
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
    resetButton: true,
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

  idCol: ITypedColDef<ISystemInstrumentListDto, number> = {
    headerName: SystemInstrumentListColumnsLabels.id,
    colId: SystemInstrumentListColumns.id,
    field: model('id'),
    minWidth: 250,
    flex: 1
  };


  nameCol: ITypedColDef<ISystemInstrumentListDto, string> = {
    headerName: SystemInstrumentListColumnsLabels.name,
    colId: SystemInstrumentListColumns.name,
    field: model('name'),
    minWidth: 250,
    flex: 2
  };

  codeCol: ITypedColDef<ISystemInstrumentListDto, string> = {
    headerName: SystemInstrumentListColumnsLabels.code,
    colId: SystemInstrumentListColumns.code,
    field: model('code'),
    minWidth: 250,
    flex: 2
  };

  marketInstumentCol: ITypedColDef<ISystemInstrumentListDto, IDisplayLookupDto> = {
    headerName: SystemInstrumentListColumnsLabels.marketInstrument,
    colId: SystemInstrumentListColumns.marketInstrument,
    field: model('marketInstrument'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  createdByCol: ITypedColDef<ISystemInstrumentListDto, IDisplayLookupDto> = {
    headerName: SystemInstrumentListColumnsLabels.createdBy,
    colId: SystemInstrumentListColumns.createdBy,
    field: model('createdBy'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  createdOnCol: ITypedColDef<ISystemInstrumentListDto, string> = {
    headerName: SystemInstrumentListColumnsLabels.createdOn,
    colId: SystemInstrumentListColumns.createdOn,
    field: model('createdOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    minWidth: 250,
    flex: 2
  };

  lastModifiedByCol: ITypedColDef<ISystemInstrumentListDto, IDisplayLookupDto> = {
    headerName: SystemInstrumentListColumnsLabels.lastModifiedBy,
    colId: SystemInstrumentListColumns.lastModifiedBy,
    field: model('lastModifiedBy'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  lastModifiedOnCol: ITypedColDef<ISystemInstrumentListDto, string> = {
    headerName: SystemInstrumentListColumnsLabels.lastModifiedOn,
    colId: SystemInstrumentListColumns.lastModifiedOn,
    field: model('lastModifiedOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    minWidth: 250,
    flex: 2
  };

  isDeletedCol: ITypedColDef<ISystemInstrumentListDto, boolean> = {
    headerName: SystemInstrumentListColumnsLabels.isDeleted,
    colId: SystemInstrumentListColumns.isDeleted,
    field: model('isDeleted'),
    cellRenderer: params => {
      var a = document.createElement('span');
      a.innerHTML = params.value ? 'Inactive' : 'Active';
      !params.value ? a.classList.add('success') : a.classList.add('denger');
      return a;
    },
    cellClass: 'cell-background',
    width: 150
  };


  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: LoggerFactory,
    private format: TenantFormattingService,
    private appErrorHandler: AppErrorHandler,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private mastersListApiService: MastersListApiService
  ) {
    super(
      'system-instrument-list-selector-grid-5',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(SystemInstrumentListSelectorGridViewModel.name)
    );
    this.init(this.gridOptions, true);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.selectCol,
      this.idCol,
      this.nameCol,
      this.codeCol,
      this.marketInstumentCol,
      this.createdByCol,
      this.createdOnCol,
      this.lastModifiedByCol,
      this.lastModifiedOnCol,
      this.isDeletedCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    const filters: ServerQueryFilter[] = [];
    this.mastersListApiService
      .getSystemInstumentList({
        ...transformLocalToServeGridInfo(
          this.gridApi,
          params,
          SystemInstrumentListColumnServerKeys,
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
