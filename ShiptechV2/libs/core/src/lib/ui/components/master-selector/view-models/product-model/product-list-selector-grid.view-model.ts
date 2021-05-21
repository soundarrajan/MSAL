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
import { ProductListColumns, ProductListColumnServerKeys, ProductListColumnsLabels } from './product-list.columns';
import { IProductListDto } from '@shiptech/core/delivery-api/masters-list/masters-list-response';



function model(prop: keyof IProductListDto): keyof IProductListDto {
  return prop;
}

// TODO: to be read from entity types and remove this hardcoded id
const TRANSACTION_TYPE_ID: number = 46;

@Injectable()
export class ProductListSelectorGridViewModel extends BaseGridViewModel {
  get entityId(): number {
    return this._entityId;
  }

  get entityName(): string {
    return this._entityName;
  }

  get producTypeId(): number {
    return this._producTypeId;
  }

  @Input() set entityId(value: number) {
    this._entityId = value;
  }

  @Input() set entityName(value: string) {
    this._entityName = value;
  }

  @Input() set productTypeId(value: number) {
    this._producTypeId = value;
  }
  _entityName: string;
  _entityId: number;
  _producTypeId:number;

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

  idCol: ITypedColDef<IProductListDto, number> = {
    headerName: ProductListColumnsLabels.id,
    colId: ProductListColumns.id,
    field: model('id'),
    minWidth: 250,
    flex: 1
  };

  productNameCol: ITypedColDef<IProductListDto, string> = {
    headerName: ProductListColumnsLabels.name,
    colId: ProductListColumns.name,
    field: model('name'),
    minWidth: 250,
    flex: 2
  };

  codeCol: ITypedColDef<IProductListDto, string> = {
    headerName: ProductListColumnsLabels.code,
    colId: ProductListColumns.code,
    field: model('code'),
    minWidth: 250,
    flex: 1
  };

  displayNameCol: ITypedColDef<IProductListDto, string> = {
    headerName: ProductListColumnsLabels.displayName,
    colId: ProductListColumns.displayName,
    field: model('displayName'),
    minWidth: 250,
    flex: 1
  };

  parentNameCol: ITypedColDef<IProductListDto, IDisplayLookupDto> = {
    headerName: ProductListColumnsLabels.parent,
    colId: ProductListColumns.parent,
    field: model('parent'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  productTypeNameCol: ITypedColDef<IProductListDto, IDisplayLookupDto> = {
    headerName: ProductListColumnsLabels.productType,
    colId: ProductListColumns.productType,
    field: model('productType'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  specGroupNameCol: ITypedColDef<IProductListDto, IDisplayLookupDto> = {
    headerName: ProductListColumnsLabels.specGroup,
    colId: ProductListColumns.specGroup,
    field: model('specGroup'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  massUomNameCol: ITypedColDef<IProductListDto, IDisplayLookupDto> = {
    headerName: ProductListColumnsLabels.uomMass,
    colId: ProductListColumns.uomMass,
    field: model('uomMass'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  conversionFactorValueCol: ITypedColDef<IProductListDto, number> = {
    headerName: ProductListColumnsLabels.conversionFactorValue,
    colId: ProductListColumns.conversionFactorValue,
    field: model('conversionFactorValue'),
    minWidth: 250,
    flex: 2
  };

  volumeUomNameCol: ITypedColDef<IProductListDto, IDisplayLookupDto> = {
    headerName: ProductListColumnsLabels.uomVolume,
    colId: ProductListColumns.uomVolume,
    field: model('uomVolume'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  createdByCol: ITypedColDef<IProductListDto, IDisplayLookupDto> = {
    headerName: ProductListColumnsLabels.createdBy,
    colId: ProductListColumns.createdBy,
    field: model('createdBy'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  createdOnCol: ITypedColDef<IProductListDto, string> = {
    headerName: ProductListColumnsLabels.createdOn,
    colId: ProductListColumns.createdOn,
    field: model('createdOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    minWidth: 250,
    flex: 2
  };

  lastModifiedByCol: ITypedColDef<IProductListDto, IDisplayLookupDto> = {
    headerName: ProductListColumnsLabels.lastModifiedBy,
    colId: ProductListColumns.lastModifiedBy,
    field: model('lastModifiedBy'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  lastModifiedOnCol: ITypedColDef<IProductListDto, string> = {
    headerName: ProductListColumnsLabels.lastModifiedOn,
    colId: ProductListColumns.lastModifiedOn,
    field: model('lastModifiedOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    minWidth: 250,
    flex: 2
  };

  materialCol: ITypedColDef<IProductListDto, string> = {
    headerName: ProductListColumnsLabels.customNonMandatoryAttribute1,
    colId: ProductListColumns.customNonMandatoryAttribute1,
    field: model('customNonMandatoryAttribute1'),
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
      'product-list-selector-grid-8',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(ProductListSelectorGridViewModel.name)
    );
    this.init(this.gridOptions, true);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.selectCol,
      this.idCol,
      this.productNameCol,
      this.codeCol,
      this.displayNameCol,
      this.parentNameCol,
      this.productTypeNameCol,
      this.specGroupNameCol,
      this.massUomNameCol,
      this.conversionFactorValueCol,
      this.volumeUomNameCol,
      this.createdByCol,
      this.createdOnCol,
      this.lastModifiedByCol,
      this.lastModifiedOnCol,
      this.materialCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    let filters: ServerQueryFilter[] = [];
    if (this.producTypeId) {
      filters =  [
        {
          columnName: 'productTypeId',
          value: this.producTypeId.toString(),
        }
      ];
    }

    this.mastersListApiService
      .getProductList({
        ...transformLocalToServeGridInfo(
          this.gridApi,
          params,
          ProductListColumnServerKeys,
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
