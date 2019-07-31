import { BaseGridViewModel } from '../../../../../../../core/src/lib/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '../../../../../../../core/src/lib/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ModuleLoggerFactory } from '../../../core/logging/module-logger-factory';
import { ColDef, GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { ProcurementRequestColumnsLabels } from './quantity-control.columns';
import { RowModelType, RowSelection } from '../../../../../../../core/src/lib/ui/components/ag-grid/type.definition';
import { ProcurementService } from '../../../services/procurement.service';
import { ShiptechSortsModel, ShiptechSortParamtersEnum } from '../../../services/models/procurement-requests.dto';

@Injectable()
export class QualityControlGridViewModel extends BaseGridViewModel {

  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 56,
    rowHeight: 35,

    rowModelType: RowModelType.ServerSide,
    pagination: true,

    animateRows: true,

    deltaRowDataMode: true,
    suppressPaginationPanel: false,
    suppressColumnVirtualisation: true,
    rowSelection: RowSelection.Single,
    rowDragManaged: true,
    suppressRowClickSelection: true,

    enableServerSideFilter: true,
    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: () => Math.random().toString(),
    defaultColDef: {
      sortable: true
    }
  };

  selectCol: ColDef = {
    width: 75,
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
    rowDrag: true,
    cellClass: 'cell-border-green'
  };
  requestNameCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.RequestName,
    field: 'requestName',
    colId: 'Request ID',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  requestGroupIdCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.RequestGroupId,
    field: 'requestGroupId',
    colId: 'Group ID',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  requestDateCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.RequestDate,
    field: 'requestDate',
    colId: 'Date',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  serviceNameCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.ServiceName,
    field: 'serviceName',
    colId: 'Service',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  buyerNameCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.BuyerName,
    field: 'buyerName',
    colId: 'Buyer',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  vesselNameCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.VesselName,
    field: 'vesselName',
    colId: 'vesselname',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  imoCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.Imo,
    field: 'imo',
    colId: 'IMO',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  etaCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.Eta,
    field: 'eta',
    colId: 'ETA',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  locationNameCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.LocationName,
    field: 'locationName',
    colId: 'Location',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  requestStatusCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.RequestStatus,
    field: 'requestStatus',
    colId: 'Request Status',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  productNameCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.ProductName,
    field: 'productName',
    colId: 'Product',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  productTypeCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.ProductType,
    field: 'productType.name',
    colId: 'Product Type',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  productStatusCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.ProductStatus,
    field: 'productStatus.displayName',
    colId: 'Product Status',
    resizable: true,
    hide: false,
    lockPosition: false
  };
  agentNameCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.AgentName,
    field: 'agentName',
    colId: 'Agent Name',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  createdOnCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.CreatedOn,
    field: 'createdOn',
    colId: 'Created On',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  createdByNameCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.CreatedByName,
    field: 'createdByName',
    colId: 'Created By',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  deliveryOptionNameCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.DeliveryOptionName,
    field: 'deliveryOptionName',
    colId: 'Delivery Option',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  commentsCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.Comments,
    field: 'comments',
    colId: 'Comments',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  lastModifiedOnCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.LastModifiedOn,
    field: 'lastModifiedOn',
    colId: 'Last Modified On',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  lastModifiedByNameCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.LastModifiedByName,
    field: 'lastModifiedByName',
    colId: 'Last Modified By',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  agreementTypeNameCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.AgreementTypeName,
    field: 'agreementTypeName',
    colId: 'Agreement Type',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  etbCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.Etb,
    field: 'etb',
    colId: 'ETB',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  etdCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.Etd,
    field: 'etd',
    colId: 'ETD',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  maxQuantityCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.MaxQuantity,
    field: 'maxQuantity',
    colId: 'Maximum Quantity',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  minQuantityCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.MinQuantity,
    field: 'minQuantity',
    colId: 'Minimum Quantity',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  uomNameCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.UomName,
    field: 'uomName',
    colId: 'UOM',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  robOnArrivalCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.RobOnArrival,
    field: 'robOnArrival',
    colId: 'Rob on Arrival',
    resizable: true,
    hide: true,
    lockPosition: false
  };
  roundVoyageConsumptionCol: ColDef = {
    headerName: ProcurementRequestColumnsLabels.RoundVoyageConsumption,
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
    super('quality-control-grid', columnPreferences, changeDetector, loggerFactory.createLogger(QualityControlGridViewModel.name));
    this.initOptions(this.gridOptions);
  }

  getColumnsDefs(): ColDef[] {
    return [
      this.selectCol,
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
      this.roundVoyageConsumptionCol
    ];
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    const currentSorts = this.gridApi.getSortModel();
    const pagination = {
      take: params.request.endRow - params.request.startRow,
      skip: params.request.startRow
    }

    const sorts: ShiptechSortsModel[] = currentSorts.map((s, i) => ({
      columnValue: this.gridApi.getColumnDef(s.colId).field.toLowerCase(),
      isComputedColumn: false,
      sortIndex: i,
      sortParameter: ShiptechSortParamtersEnum[s.sort]
    }));

    this.procurementService.getAllProcurementRequests({pagination, SortList: { SortList: sorts}})
      .subscribe(
        response => params.successCallback(response.payload, response.matchedCount),
        () => params.failCallback());
  }
}
