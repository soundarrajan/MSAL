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
  CompanyListColumns,
  CompanyListColumnServerKeys,
  CompanyListColumnsLabels
} from './company-list.columns';
import { ICompanyListDto } from '@shiptech/core/delivery-api/masters-list/masters-list-response';

function model(prop: keyof ICompanyListDto): keyof ICompanyListDto {
  return prop;
}

// TODO: to be read from entity types and remove this hardcoded id
const TRANSACTION_TYPE_ID: number = 46;

@Injectable()
export class CompanyListSelectorGridViewModel extends BaseGridViewModel {
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

  idCol: ITypedColDef<ICompanyListDto, IDisplayLookupDto> = {
    headerName: CompanyListColumnsLabels.id,
    colId: CompanyListColumns.id,
    field: model('id'),
    valueFormatter: params => params.value?.id,
    minWidth: 250,
    flex: 1
  };

  nameCol: ITypedColDef<ICompanyListDto, IDisplayLookupDto> = {
    headerName: CompanyListColumnsLabels.name,
    colId: CompanyListColumns.name,
    field: model('name'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 1
  };

  displayNameCol: ITypedColDef<ICompanyListDto, IDisplayLookupDto> = {
    headerName: CompanyListColumnsLabels.displayName,
    colId: CompanyListColumns.displayName,
    field: model('displayName'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 1
  };

  parentCol: ITypedColDef<ICompanyListDto, IDisplayLookupDto> = {
    headerName: CompanyListColumnsLabels.parent,
    colId: CompanyListColumnsLabels.parent,
    field: model('parent'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  currencyCol: ITypedColDef<ICompanyListDto, IDisplayLookupDto> = {
    headerName: CompanyListColumnsLabels.currency,
    colId: CompanyListColumnsLabels.currency,
    field: model('currency'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  uomCol: ITypedColDef<ICompanyListDto, IDisplayLookupDto> = {
    headerName: CompanyListColumnsLabels.uom,
    colId: CompanyListColumnsLabels.uom,
    field: model('uom'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  paymentCompanyCol: ITypedColDef<ICompanyListDto, boolean> = {
    headerName: CompanyListColumnsLabels.paymentCompany,
    colId: CompanyListColumnsLabels.paymentCompany,
    field: model('paymentCompany'),
    cellRenderer: params => {
      var a = document.createElement('span');
      a.innerHTML = params.value ? 'Yes' : 'No';
      params.value ? a.classList.add('success') : a.classList.add('denger');
      return a;
    },
    cellClass: 'cell-background',
    width: 150
  };

  operatingCompanyCol: ITypedColDef<ICompanyListDto, boolean> = {
    headerName: CompanyListColumnsLabels.operatingCompany,
    colId: CompanyListColumnsLabels.operatingCompany,
    field: model('operatingCompany'),
    cellRenderer: params => {
      var a = document.createElement('span');
      a.innerHTML = params.value ? 'Yes' : 'No';
      params.value ? a.classList.add('success') : a.classList.add('denger');
      return a;
    },
    cellClass: 'cell-background',
    width: 150
  };

  timeZoneCol: ITypedColDef<ICompanyListDto, IDisplayLookupDto> = {
    headerName: CompanyListColumnsLabels.timeZone,
    colId: CompanyListColumnsLabels.timeZone,
    field: model('timeZone'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  countryCol: ITypedColDef<ICompanyListDto, IDisplayLookupDto> = {
    headerName: CompanyListColumnsLabels.country,
    colId: CompanyListColumnsLabels.country,
    field: model('country'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  createdByCol: ITypedColDef<ICompanyListDto, IDisplayLookupDto> = {
    headerName: CompanyListColumnsLabels.createdBy,
    colId: CompanyListColumnsLabels.createdBy,
    field: model('createdBy'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  createdOnCol: ITypedColDef<ICompanyListDto, string> = {
    headerName: CompanyListColumnsLabels.createdOn,
    colId: CompanyListColumnsLabels.createdOn,
    field: model('createdOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    minWidth: 250,
    flex: 2
  };

  lastModifiedByCol: ITypedColDef<ICompanyListDto, IDisplayLookupDto> = {
    headerName: CompanyListColumnsLabels.lastModifiedBy,
    colId: CompanyListColumnsLabels.lastModifiedBy,
    field: model('lastModifiedBy'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  lastModifiedOnCol: ITypedColDef<ICompanyListDto, string> = {
    headerName: CompanyListColumnsLabels.lastModifiedOn,
    colId: CompanyListColumnsLabels.lastModifiedOn,
    field: model('lastModifiedOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    minWidth: 250,
    flex: 2
  };

  codeCol: ITypedColDef<ICompanyListDto, IDisplayLookupDto> = {
    headerName: CompanyListColumnsLabels.code,
    colId: CompanyListColumns.code,
    field: model('code'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 1
  };

  hasNoMoreChildrenCol: ITypedColDef<ICompanyListDto, boolean> = {
    headerName: CompanyListColumnsLabels.hasNoMoreChildren,
    colId: CompanyListColumnsLabels.hasNoMoreChildren,
    field: model('hasNoMoreChildren'),
    cellRenderer: params => {
      var a = document.createElement('span');
      a.innerHTML = params.value ? 'Yes' : 'No';
      params.value ? a.classList.add('success') : a.classList.add('denger');
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
    @Inject(DOCUMENTS_API_SERVICE) private mastersApi: IDocumentsApiService,
    private mastersListApiService: MastersListApiService
  ) {
    super(
      'company-list-selector-grid-5',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(CompanyListSelectorGridViewModel.name)
    );
    this.init(this.gridOptions, true);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.selectCol,
      // this.idCol,
      this.nameCol,
      this.displayNameCol,
      this.parentCol,
      this.paymentCompanyCol,
      this.operatingCompanyCol,
      this.currencyCol,
      this.uomCol,
      this.timeZoneCol,
      this.countryCol,
      this.createdByCol,
      this.createdOnCol,
      this.lastModifiedByCol,
      this.lastModifiedOnCol,
      this.codeCol,
      this.hasNoMoreChildrenCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value.trim();
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    const filters: ServerQueryFilter[] = [];
    this.mastersListApiService
      .getCompanyList({
        ...transformLocalToServeGridInfo(
          this.gridApi,
          params,
          CompanyListColumnServerKeys,
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
