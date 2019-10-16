import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ModuleLoggerFactory } from '../../../core/logging/module-logger-factory';
import { ColDef, GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { PortCallsListGridColumnsLabels } from './port-calls-list.columns';
import { RowModelType, RowSelection } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { ProcurementService } from '../../../services/procurement.service';
import { getShiptechFormatFilters } from '../../../core/mappers/shiptech-grid-filters';
import { getShiptechFormatSorts } from '../../../core/mappers/shiptech-grid-sorts';
import { AgTemplateRendererComponent } from '@shiptech/core/ui/components/ag-grid/ag-template-renderer/ag-template-renderer.component';
import { getShiptechFormatPagination } from '../../../core/mappers/shiptech-grid-paging';

@Injectable()
export class PortCallsListGridViewModel extends BaseGridViewModel {

  public searchText: string;
  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 35,

    rowModelType: RowModelType.ServerSide,
    pagination: true,

    animateRows: true,

    deltaRowDataMode: false,
    suppressPaginationPanel: false,
    suppressColumnVirtualisation: true,
    rowSelection: RowSelection.Single,
    rowDragManaged: true,
    suppressRowClickSelection: true,

    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: () => Math.random().toString(),
    defaultColDef: {
      sortable: true,
      filter: 'agTextColumnFilter',
      width: 150
    }
  };

  selectCol: ColDef = {
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
    suppressToolPanel: true,
    suppressCellFlash: true,
    suppressPaste: true,
    lockPosition: true,
    lockVisible: true,
    cellClass: 'cell-border-green'
  };

  editCol: ColDef = {
    colId: 'Edit',
    width: 50,
    hide: false,
    resizable: false,
    suppressToolPanel: true,
    cellRendererFramework: AgTemplateRendererComponent
  };
  actionCol: ColDef = {
    colId: 'Edit',
    width: 100,
    hide: false,
    lockPosition: true,
    suppressMovable: true,
    suppressNavigable: true,
    suppressMenu: true,
    suppressAutoSize: true,
    suppressSizeToFit: true,
    suppressToolPanel: true,
    sortable: false,
    filter: false,
    resizable: false,
    cellRendererFramework: AgTemplateRendererComponent
  };
  requestNameCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.RequestName,
    field: 'requestName',
    colId: 'Request ID',
    resizable: true,
    hide: false,
    lockPosition: false,
    cellRendererFramework: AgTemplateRendererComponent
  };
  requestGroupIdCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.RequestGroupId,
    field: 'requestGroupId',
    colId: 'Group ID',
    resizable: true,
    hide: false,
    lockPosition: false,
    cellRendererFramework: AgTemplateRendererComponent
  };
  requestDateCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.RequestDate,
    field: 'requestDate',
    filter: 'agDateColumnFilter',
    colId: 'Date',
    resizable: true,
    hide: false,
    lockPosition: false,
    cellRendererFramework: AgTemplateRendererComponent
  };
  serviceNameCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.ServiceName,
    field: 'serviceName',
    colId: 'Service',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  buyerNameCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.BuyerName,
    field: 'buyerName',
    colId: 'Buyer',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  vesselNameCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.VesselName,
    field: 'vesselName',
    colId: 'vesselname',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  imoCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.Imo,
    field: 'imo',
    colId: 'IMO',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  etaCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.Eta,
    field: 'eta',
    colId: 'ETA',
    filter: 'agDateColumnFilter',
    resizable: true,
    hide: false,
    lockPosition: false,
    cellRendererFramework: AgTemplateRendererComponent
  };
  locationNameCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.LocationName,
    field: 'locationName',
    colId: 'Location',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  requestStatusCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.RequestStatus,
    field: 'requestStatus.name',
    colId: 'Request Status',
    resizable: true,
    hide: false,
    lockPosition: false,
    cellRendererFramework: AgTemplateRendererComponent
  };
  productNameCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.ProductName,
    field: 'productName',
    colId: 'Product',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  productTypeCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.ProductType,
    field: 'productType.name',
    colId: 'Product Type',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  productStatusCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.ProductStatus,
    field: 'productStatus.displayName',
    colId: 'Product Status',
    resizable: true,
    hide: false,
    lockPosition: false,
    cellRendererFramework: AgTemplateRendererComponent
  };
  agentNameCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.AgentName,
    field: 'agentName',
    colId: 'Agent Name',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  createdOnCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.CreatedOn,
    field: 'createdOn',
    colId: 'Created On',
    filter: 'agDateColumnFilter',
    resizable: true,
    hide: true,
    lockPosition: false,
    cellRendererFramework: AgTemplateRendererComponent
  };
  createdByNameCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.CreatedByName,
    field: 'createdByName',
    colId: 'Created By',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  deliveryOptionNameCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.DeliveryOptionName,
    field: 'deliveryOptionName',
    colId: 'Delivery Option',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  commentsCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.Comments,
    field: 'comments',
    colId: 'Comments',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  lastModifiedOnCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.LastModifiedOn,
    field: 'lastModifiedOn',
    colId: 'Last Modified On',
    filter: 'agDateColumnFilter',
    resizable: true,
    hide: true,
    lockPosition: false,
    cellRendererFramework: AgTemplateRendererComponent
  };
  lastModifiedByNameCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.LastModifiedByName,
    field: 'lastModifiedByName',
    colId: 'Last Modified By',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  agreementTypeNameCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.AgreementTypeName,
    field: 'agreementTypeName',
    colId: 'Agreement Type',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  etbCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.Etb,
    field: 'etb',
    colId: 'ETB',
    resizable: true,
    hide: true,
    lockPosition: false,
    cellRendererFramework: AgTemplateRendererComponent
  };
  etdCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.Etd,
    field: 'etd',
    colId: 'ETD',
    resizable: true,
    hide: true,
    lockPosition: false,
    cellRendererFramework: AgTemplateRendererComponent
  };
  maxQuantityCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.MaxQuantity,
    field: 'maxQuantity',
    colId: 'Maximum Quantity',
    filter: 'agNumberColumnFilter',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  minQuantityCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.MinQuantity,
    field: 'minQuantity',
    colId: 'Minimum Quantity',
    filter: 'agNumberColumnFilter',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  uomNameCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.UomName,
    field: 'uomName',
    colId: 'UOM',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  robOnArrivalCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.RobOnArrival,
    field: 'robOnArrival',
    colId: 'Rob on Arrival',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  roundVoyageConsumptionCol: ColDef = {
    headerName: PortCallsListGridColumnsLabels.RoundVoyageConsumption,
    field: 'roundVoyageConsumption',
    colId: 'Round Voyage Consumption',
    resizable: true,
    hide: true,
    lockPosition: false
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private procurementService: ProcurementService
  ) {
    super('quantity-control-grid', columnPreferences, changeDetector, loggerFactory.createLogger(PortCallsListGridViewModel.name));
    this.initOptions(this.gridOptions);
  }

  getColumnsDefs(): ColDef[] {
    return [
      this.selectCol,
      this.editCol,
      this.requestNameCol,
      this.requestGroupIdCol,
      this.requestDateCol,
      this.serviceNameCol,
      this.buyerNameCol,
      this.vesselNameCol,
      this.imoCol,
      this.etaCol,
      this.locationNameCol,
      this.requestStatusCol,
      this.productNameCol,
      this.productTypeCol,
      this.productStatusCol,
      this.agentNameCol,
      this.createdOnCol,
      this.createdByNameCol,
      this.deliveryOptionNameCol,
      this.commentsCol,
      this.lastModifiedOnCol,
      this.lastModifiedByNameCol,
      this.agreementTypeNameCol,
      this.etbCol,
      this.etdCol,
      this.maxQuantityCol,
      this.minQuantityCol,
      this.uomNameCol,
      this.robOnArrivalCol,
      this.roundVoyageConsumptionCol,
      this.actionCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.procurementService.getAllProcurementRequests({
      pagination: getShiptechFormatPagination(params),
      sorts: getShiptechFormatSorts(params),
      filters: getShiptechFormatFilters(params),
      searchText: this.searchText
    }).subscribe(
      response => params.successCallback(response.payload, response.matchedCount),
      () => params.failCallback());
  }
}
