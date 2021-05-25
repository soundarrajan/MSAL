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
import { OrderListColumns, OrderListColumnServerKeys, OrderListColumnsLabels } from './order-list.columns';
import { IOrderListDto } from '@shiptech/core/delivery-api/request-reponse-dtos/order-list.dtos';
import { IServerGridPageFilters } from '@shiptech/core/grid/server-grid/server-grid-request-response';



function model(prop: keyof IOrderListDto): keyof IOrderListDto {
  return prop;
}

// TODO: to be read from entity types and remove this hardcoded id
const TRANSACTION_TYPE_ID: number = 46;

@Injectable()
export class OrderListSelectorGridViewModel extends BaseGridViewModel {
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
    cellClass: 'cell-border-green checkboxCenter'
  };

  orderNumberCol: ITypedColDef<IOrderListDto, IDisplayLookupDto> = {
    headerName: OrderListColumnsLabels.order,
    colId: OrderListColumns.order,
    field: model('order'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 1
  };

  orderDateCol: ITypedColDef<IOrderListDto, string> = {
    headerName: OrderListColumnsLabels.orderDate,
    colId: OrderListColumns.orderDate,
    field: model('orderDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    minWidth: 250,
    flex: 2
  };

  productNameCol: ITypedColDef<IOrderListDto, IDisplayLookupDto> = {
    headerName: OrderListColumnsLabels.product,
    colId: OrderListColumns.product,
    field: model('product'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  
  confirmedQuantityCol: ITypedColDef<IOrderListDto, string> = {
    headerName: OrderListColumnsLabels.confirmedQuantity,
    colId: OrderListColumns.confirmedQuantity,
    field: model('confirmedQuantity'),
    minWidth: 250,
    flex: 2,
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  vesselNameCol: ITypedColDef<IOrderListDto, IDisplayLookupDto> = {
    headerName: OrderListColumnsLabels.vessel,
    colId: OrderListColumns.vessel,
    field: model('vessel'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  locationNameCol: ITypedColDef<IOrderListDto, IDisplayLookupDto> = {
    headerName: OrderListColumnsLabels.location,
    colId: OrderListColumns.location,
    field: model('location'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  etaCol: ITypedColDef<IOrderListDto, string> = {
    headerName: OrderListColumnsLabels.eta,
    colId: OrderListColumns.eta,
    field: model('eta'),
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
    @Inject(DOCUMENTS_API_SERVICE) private mastersApi: IDocumentsApiService,
    private bdnInformationApiService: BdnInformationApiService
  ) {
    super(
      'order-list-selector-grid-10',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(OrderListSelectorGridViewModel.name)
    );
    this.init(this.gridOptions, true);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.selectCol,
      this.orderNumberCol,
      this.orderDateCol,
      this.productNameCol,
      this.confirmedQuantityCol,
      this.vesselNameCol,
      this.locationNameCol,
      this.etaCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    const pageFilters =  {
      "Filters": [
        {
            "columnValue": "OrderStatus_DisplayName",
            "ColumnType": "Text",
            "isComputedColumn": false,
            "ConditionValue": "=",
            "Values": [
                "Confirmed"
            ],
            "FilterOperator": 0
        },
        {
            "columnValue": "OrderStatus_DisplayName",
            "ColumnType": "Text",
            "isComputedColumn": false,
            "ConditionValue": "=",
            "Values": [
                "PartiallyDelivered"
            ],
            "FilterOperator": 2
        }
      ]
   };
    this.bdnInformationApiService
      .getOrderList({
        ...transformLocalToServeGridInfo(
          this.gridApi,
          params,
          OrderListColumnServerKeys,
          this.searchText
        ),
        pageFilters
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
