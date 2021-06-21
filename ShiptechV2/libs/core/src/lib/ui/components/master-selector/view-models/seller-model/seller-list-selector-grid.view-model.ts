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
import { IPhysicalSupplierListDto, IProductListDto } from '@shiptech/core/delivery-api/masters-list/masters-list-response';
import { PhysicalSupplierListColumns, PhysicalSupplierListColumnServerKeys, PhysicalSupplierListColumnsLabels } from './seller-list.columns';



function model(prop: keyof IPhysicalSupplierListDto): keyof IPhysicalSupplierListDto {
  return prop;
}

// TODO: to be read from entity types and remove this hardcoded id
const TRANSACTION_TYPE_ID: number = 46;

@Injectable()
export class SellerListSelectorGridViewModel extends BaseGridViewModel {
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

  idCol: ITypedColDef<IPhysicalSupplierListDto, number> = {
    headerName: PhysicalSupplierListColumnsLabels.id,
    colId: PhysicalSupplierListColumns.id,
    field: model('id'),
    minWidth: 250,
    flex: 1
  };

  physicalSupplierNameCol: ITypedColDef<IPhysicalSupplierListDto, string> = {
    headerName: PhysicalSupplierListColumnsLabels.name,
    colId: PhysicalSupplierListColumns.name,
    field: model('name'),
    minWidth: 250,
    flex: 2
  };

  displayNameCol: ITypedColDef<IPhysicalSupplierListDto, string> = {
    headerName: PhysicalSupplierListColumnsLabels.displayName,
    colId: PhysicalSupplierListColumns.displayName,
    field: model('displayName'),
    minWidth: 250,
    flex: 2
  };
  
  defaultPaymentTermCol: ITypedColDef<IPhysicalSupplierListDto, IDisplayLookupDto> = {
    headerName: PhysicalSupplierListColumnsLabels.defaultPaymentTerm,
    colId: PhysicalSupplierListColumns.defaultPaymentTerm,
    field: model('defaultPaymentTerm'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  parentCol: ITypedColDef<IPhysicalSupplierListDto, IDisplayLookupDto> = {
    headerName: PhysicalSupplierListColumnsLabels.parent,
    colId: PhysicalSupplierListColumns.parent,
    field: model('parent'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  isDeletedCol: ITypedColDef<IPhysicalSupplierListDto, boolean> = {
    headerName: PhysicalSupplierListColumnsLabels.isDeleted,
    colId: PhysicalSupplierListColumns.isDeleted,
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

  reasonCol: ITypedColDef<IPhysicalSupplierListDto, string> = {
    headerName: PhysicalSupplierListColumnsLabels.reason,
    colId: PhysicalSupplierListColumns.reason,
    field: model('reason'),
    minWidth: 250,
    flex: 2
  };

  statusCol: ITypedColDef<IPhysicalSupplierListDto, IDisplayLookupDto> = {
    headerName: PhysicalSupplierListColumnsLabels.status,
    colId: PhysicalSupplierListColumns.status,
    field: model('status'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  commentsCol: ITypedColDef<IPhysicalSupplierListDto, string> = {
    headerName: PhysicalSupplierListColumnsLabels.comments,
    colId: PhysicalSupplierListColumns.comments,
    field: model('comments'),
    minWidth: 250,
    flex: 2
  };

  defaultIncotermCol: ITypedColDef<IPhysicalSupplierListDto, IDisplayLookupDto> = {
    headerName: PhysicalSupplierListColumnsLabels.defaultIncoterm,
    colId: PhysicalSupplierListColumns.defaultIncoterm,
    field: model('defaultIncoterm'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  supplierCol: ITypedColDef<IPhysicalSupplierListDto, boolean> = {
    headerName: PhysicalSupplierListColumnsLabels.supplier,
    colId: PhysicalSupplierListColumns.supplier,
    field: model('supplier'),
    valueFormatter: params => (params.value ? 'Yes' : 'No') // TODO hardcoded values
  };

  sellerCol: ITypedColDef<IPhysicalSupplierListDto, boolean> = {
    headerName: PhysicalSupplierListColumnsLabels.seller,
    colId: PhysicalSupplierListColumns.seller,
    field: model('seller'),
    valueFormatter: params => (params.value ? 'Yes' : 'No') // TODO hardcoded values
  };

  brokerCol: ITypedColDef<IPhysicalSupplierListDto, boolean> = {
    headerName: PhysicalSupplierListColumnsLabels.broker,
    colId: PhysicalSupplierListColumns.broker,
    field: model('broker'),
    valueFormatter: params => (params.value ? 'Yes' : 'No') // TODO hardcoded values
  };

  customerCol: ITypedColDef<IPhysicalSupplierListDto, boolean> = {
    headerName: PhysicalSupplierListColumnsLabels.customer,
    colId: PhysicalSupplierListColumns.customer,
    field: model('customer'),
    valueFormatter: params => (params.value ? 'Yes' : 'No') // TODO hardcoded values
  };

  agentCol: ITypedColDef<IPhysicalSupplierListDto, boolean> = {
    headerName: PhysicalSupplierListColumnsLabels.agent,
    colId: PhysicalSupplierListColumns.agent,
    field: model('agent'),
    valueFormatter: params => (params.value ? 'Yes' : 'No') // TODO hardcoded values
  };

  surveyorCol: ITypedColDef<IPhysicalSupplierListDto, boolean> = {
    headerName: PhysicalSupplierListColumnsLabels.surveyor,
    colId: PhysicalSupplierListColumns.surveyor,
    field: model('surveyor'),
    valueFormatter: params => (params.value ? 'Yes' : 'No') // TODO hardcoded values
  };
  
  bargeCol: ITypedColDef<IPhysicalSupplierListDto, boolean> = {
    headerName: PhysicalSupplierListColumnsLabels.barge,
    colId: PhysicalSupplierListColumns.barge,
    field: model('barge'),
    valueFormatter: params => (params.value ? 'Yes' : 'No') // TODO hardcoded values
  };

  labCol: ITypedColDef<IPhysicalSupplierListDto, boolean> = {
    headerName: PhysicalSupplierListColumnsLabels.lab,
    colId: PhysicalSupplierListColumns.lab,
    field: model('lab'),
    valueFormatter: params => (params.value ? 'Yes' : 'No') // TODO hardcoded values
  };

  plannerCol: ITypedColDef<IPhysicalSupplierListDto, boolean> = {
    headerName: PhysicalSupplierListColumnsLabels.planner,
    colId: PhysicalSupplierListColumns.planner,
    field: model('planner'),
    valueFormatter: params => (params.value ? 'Yes' : 'No') // TODO hardcoded values
  };

  internalCol: ITypedColDef<IPhysicalSupplierListDto, boolean> = {
    headerName: PhysicalSupplierListColumnsLabels.internal,
    colId: PhysicalSupplierListColumns.internal,
    field: model('internal'),
    valueFormatter: params => (params.value ? 'Yes' : 'No') // TODO hardcoded value
  };

  sludgeCol: ITypedColDef<IPhysicalSupplierListDto, boolean> = {
    headerName: PhysicalSupplierListColumnsLabels.sludge,
    colId: PhysicalSupplierListColumns.sludge,
    field: model('sludge'),
    valueFormatter: params => (params.value ? 'Yes' : 'No') // TODO hardcoded values
  };

  countryCol: ITypedColDef<IPhysicalSupplierListDto, string> = {
    headerName: PhysicalSupplierListColumnsLabels.country,
    colId: PhysicalSupplierListColumns.country,
    field: model('country'),
    minWidth: 250,
    flex: 2
  };

  createdByCol: ITypedColDef<IPhysicalSupplierListDto, IDisplayLookupDto> = {
    headerName: PhysicalSupplierListColumnsLabels.createdBy,
    colId: PhysicalSupplierListColumns.createdBy,
    field: model('createdBy'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  createdOnCol: ITypedColDef<IPhysicalSupplierListDto, string> = {
    headerName: PhysicalSupplierListColumnsLabels.createdOn,
    colId: PhysicalSupplierListColumns.createdOn,
    field: model('createdOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    minWidth: 250,
    flex: 2
  };

  lastModifiedByCol: ITypedColDef<IPhysicalSupplierListDto, IDisplayLookupDto> = {
    headerName: PhysicalSupplierListColumnsLabels.lastModifiedBy,
    colId: PhysicalSupplierListColumns.lastModifiedBy,
    field: model('lastModifiedBy'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  lastModifiedOnCol: ITypedColDef<IPhysicalSupplierListDto, string> = {
    headerName: PhysicalSupplierListColumnsLabels.lastModifiedOn,
    colId: PhysicalSupplierListColumns.lastModifiedOn,
    field: model('lastModifiedOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    minWidth: 250,
    flex: 2
  };

  hasNoMoreChildrenCol: ITypedColDef<IPhysicalSupplierListDto, boolean> = {
    headerName: PhysicalSupplierListColumnsLabels.hasNoMoreChildren,
    colId: PhysicalSupplierListColumns.hasNoMoreChildren,
    field: model('hasNoMoreChildren'),
    valueFormatter: params => (params.value ? 'Yes' : 'No'), // TODO hardcoded values
    cellClass: 'cell-background',
    cellClassRules: {
      bad: params => !(params.data?.hasNoMoreChildren ?? false)
    }
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
      'seller-list-selector-grid-8',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(SellerListSelectorGridViewModel.name)
    );
    this.init(this.gridOptions, true);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.selectCol,
      this.idCol,
      this.physicalSupplierNameCol,
      this.displayNameCol,
      this.defaultPaymentTermCol,
      this.isDeletedCol,
      this.reasonCol,
      this.statusCol,
      this.commentsCol,
      this.defaultIncotermCol,
      this.supplierCol,
      this.sellerCol,
      this.brokerCol,
      this.customerCol,
      this.agentCol,
      this.surveyorCol,
      this.bargeCol,
      this.labCol,
      this.plannerCol,
      this.internalCol,
      this.sludgeCol,
      this.countryCol,
      this.createdByCol,
      this.createdOnCol,
      this.lastModifiedByCol,
      this.lastModifiedOnCol,
      this.hasNoMoreChildrenCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
      const filters: ServerQueryFilter[] = [
        {
          columnName: 'CounterpartyTypes',
          value: '2,11'
        }];
    this.mastersListApiService
      .getSellerList({
        ...transformLocalToServeGridInfo(
          this.gridApi,
          params,
          PhysicalSupplierListColumnServerKeys,
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
