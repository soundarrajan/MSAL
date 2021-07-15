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
import {
  IPaybleToListDto,
  IProductListDto
} from '@shiptech/core/delivery-api/masters-list/masters-list-response';
import {
  PaybleToListColumns,
  PaybleToListColumnServerKeys,
  PaybleToListColumnsLabels
} from './payble-to-list.columns';

function model(prop: keyof IPaybleToListDto): keyof IPaybleToListDto {
  return prop;
}

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent;
}

// TODO: to be read from entity types and remove this hardcoded id
const TRANSACTION_TYPE_ID: number = 46;

@Injectable()
export class PaybleToListSelectorGridViewModel extends BaseGridViewModel {
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

  idCol: ITypedColDef<IPaybleToListDto, number> = {
    headerName: PaybleToListColumnsLabels.id,
    colId: PaybleToListColumns.id,
    field: model('id'),
    minWidth: 250,
    flex: 1
  };

  physicalSupplierNameCol: ITypedColDef<IPaybleToListDto, string> = {
    headerName: PaybleToListColumnsLabels.name,
    colId: PaybleToListColumns.name,
    field: model('name'),
    valueFormatter: params => this.format.htmlDecode(params.value),
    minWidth: 250,
    flex: 2
  };

  parentCol: ITypedColDef<IPaybleToListDto, IDisplayLookupDto> = {
    headerName: PaybleToListColumnsLabels.parent,
    colId: PaybleToListColumns.parent,
    field: model('parent'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  isDeletedCol: ITypedColDef<IPaybleToListDto, boolean> = {
    headerName: PaybleToListColumnsLabels.isDeleted,
    colId: PaybleToListColumns.isDeleted,
    field: model('isDeleted'),
    cellRenderer: params => {
      var a = document.createElement('span');
      a.innerHTML = params.value ? 'Yes' : 'No';
      !params.value ? a.classList.add('success') : a.classList.add('denger');
      return a;
    },
    cellClass: 'cell-background',
    width: 150
  };

  createdByCol: ITypedColDef<IPaybleToListDto, IDisplayLookupDto> = {
    headerName: PaybleToListColumnsLabels.createdBy,
    colId: PaybleToListColumns.createdBy,
    field: model('createdBy'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  createdOnCol: ITypedColDef<IPaybleToListDto, string> = {
    headerName: PaybleToListColumnsLabels.createdOn,
    colId: PaybleToListColumns.createdOn,
    field: model('createdOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    minWidth: 250,
    flex: 2
  };

  lastModifiedByCol: ITypedColDef<IPaybleToListDto, IDisplayLookupDto> = {
    headerName: PaybleToListColumnsLabels.lastModifiedBy,
    colId: PaybleToListColumns.lastModifiedBy,
    field: model('lastModifiedBy'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  lastModifiedOnCol: ITypedColDef<IPaybleToListDto, string> = {
    headerName: PaybleToListColumnsLabels.lastModifiedOn,
    colId: PaybleToListColumns.lastModifiedOn,
    field: model('lastModifiedOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    minWidth: 250,
    flex: 2
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
      'payble-to-list-selector-grid-0',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(PaybleToListSelectorGridViewModel.name)
    );
    this.init(this.gridOptions, true);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.selectCol,
      // this.idCol,
      this.physicalSupplierNameCol,
      this.isDeletedCol,
      this.createdByCol,
      this.createdOnCol,
      this.lastModifiedByCol,
      this.lastModifiedOnCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value.trim();
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    const filters: ServerQueryFilter[] = [
      {
        columnName: 'CounterpartyTypes',
        value: '2, 11'
      }
    ];
    this.mastersListApiService
      .getPhysicalSupplierList({
        ...transformLocalToServeGridInfo(
          this.gridApi,
          params,
          PaybleToListColumnServerKeys,
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
