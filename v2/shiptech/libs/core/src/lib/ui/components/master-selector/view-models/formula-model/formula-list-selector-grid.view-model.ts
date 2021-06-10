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
  IFormulaListDto,
  IPhysicalSupplierListDto,
  IProductListDto
} from '@shiptech/core/delivery-api/masters-list/masters-list-response';
import {
  FormulaListColumns,
  FormulaListColumnServerKeys,
  FormulaListColumnsLabels
} from './formula-list.columns';

function model(prop: keyof IFormulaListDto): keyof IFormulaListDto {
  return prop;
}

// TODO: to be read from entity types and remove this hardcoded id
const TRANSACTION_TYPE_ID: number = 46;

@Injectable()
export class FormulaListSelectorGridViewModel extends BaseGridViewModel {
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

  idCol: ITypedColDef<IFormulaListDto, number> = {
    headerName: FormulaListColumnsLabels.id,
    colId: FormulaListColumns.id,
    field: model('id'),
    minWidth: 250,
    flex: 1
  };

  formulaNameCol: ITypedColDef<IFormulaListDto, string> = {
    headerName: FormulaListColumnsLabels.name,
    colId: FormulaListColumns.name,
    field: model('name'),
    minWidth: 250,
    flex: 2
  };

  createdByCol: ITypedColDef<IFormulaListDto, IDisplayLookupDto> = {
    headerName: FormulaListColumnsLabels.createdBy,
    colId: FormulaListColumns.createdBy,
    field: model('createdBy'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  createdOnCol: ITypedColDef<IFormulaListDto, string> = {
    headerName: FormulaListColumnsLabels.createdOn,
    colId: FormulaListColumns.createdOn,
    field: model('createdOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    minWidth: 250,
    flex: 2
  };

  lastModifiedByCol: ITypedColDef<IFormulaListDto, IDisplayLookupDto> = {
    headerName: FormulaListColumnsLabels.lastModifiedBy,
    colId: FormulaListColumns.lastModifiedBy,
    field: model('lastModifiedBy'),
    valueFormatter: params => params.value?.name,
    minWidth: 250,
    flex: 2
  };

  lastModifiedOnCol: ITypedColDef<IFormulaListDto, string> = {
    headerName: FormulaListColumnsLabels.lastModifiedOn,
    colId: FormulaListColumns.lastModifiedOn,
    field: model('lastModifiedOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    minWidth: 250,
    flex: 2
  };

  isDeletedCol: ITypedColDef<IFormulaListDto, boolean> = {
    headerName: FormulaListColumnsLabels.isDeleted,
    colId: FormulaListColumns.isDeleted,
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
      'formula-list-selector-grid-3',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(FormulaListSelectorGridViewModel.name)
    );
    this.init(this.gridOptions, true);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.selectCol,
      this.idCol,
      this.formulaNameCol,
      this.createdByCol,
      this.createdOnCol,
      this.lastModifiedByCol,
      this.lastModifiedOnCol,
      this.isDeletedCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value.trim();
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    const filters: ServerQueryFilter[] = [
      {
        columnName: 'ContractId',
        value: this._entityId ? this._entityId.toString() : null
      }
    ];
    this.mastersListApiService
      .getFormulaList({
        ...transformLocalToServeGridInfo(
          this.gridApi,
          params,
          FormulaListColumnServerKeys,
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
