import { BaseGridViewModel } from '../../../../../../../core/src/lib/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '../../../../../../../core/src/lib/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ModuleLoggerFactory } from '../../../core/logging/module-logger-factory';
import { ColDef, GridOptions } from 'ag-grid-community';
import { QuantityControlColumnsLabels } from './quantity-control.columns';
import { RowModelType, RowSelection } from '../../../../../../../core/src/lib/ui/components/ag-grid/type.definition';

@Injectable()
export class QualityControlGridViewModel extends BaseGridViewModel {

  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 56,
    rowHeight: 35,

    rowModelType: RowModelType.ClientSide,
    pagination: false,

    animateRows: true,

    deltaRowDataMode: true,
    suppressColumnVirtualisation: true,
    suppressMultiSort: true,
    rowSelection: RowSelection.Single,
    rowDragManaged: true,
    suppressRowClickSelection: true,

    enableServerSideFilter: false,
    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: () => Math.random().toString()
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
    colId: QuantityControlColumnsLabels.RequestName,
    field: 'requestName',
    headerName: 'Request ID',
    sortable: false,
    resizable: true,
    hide: false,
    lockPosition: false
  };
  requestGroupIdCol: ColDef = {
    colId: QuantityControlColumnsLabels.RequestGroupId,
    field: 'requestGroupId',
    headerName: 'Group ID',
    sortable: false,
    resizable: true,
    hide: false,
    lockPosition: false
  };
  requestDateCol: ColDef = {
    colId: QuantityControlColumnsLabels.RequestDate,
    field: 'requestDate',
    headerName: 'Date',
    sortable: false,
    resizable: true,
    hide: false,
    lockPosition: false
  };
  serviceNameCol: ColDef = {
    colId: QuantityControlColumnsLabels.ServiceName,
    field: 'serviceName',
    headerName: 'Service',
    sortable: false,
    resizable: true,
    hide: false,
    lockPosition: false
  };
  buyerNameCol: ColDef = {
    colId: QuantityControlColumnsLabels.BuyerName,
    field: 'buyerName',
    headerName: 'Buyer',
    sortable: false,
    resizable: true,
    hide: false,
    lockPosition: false
  };
  vesselNameCol: ColDef = {
    colId: QuantityControlColumnsLabels.VesselName,
    field: 'vesselName',
    headerName: 'Vessel',
    sortable: false,
    resizable: true,
    hide: false,
    lockPosition: false
  };
  imoCol: ColDef = {
    colId: QuantityControlColumnsLabels.Imo,
    field: 'imo',
    headerName: 'IMO',
    sortable: false,
    resizable: true,
    hide: false,
    lockPosition: false
  };
  etaCol: ColDef = {
    colId: QuantityControlColumnsLabels.Eta,
    field: 'eta',
    headerName: 'ETA',
    sortable: false,
    resizable: true,
    hide: false,
    lockPosition: false
  };
  locationNameCol: ColDef = {
    colId: QuantityControlColumnsLabels.LocationName,
    field: 'locationName',
    headerName: 'Location',
    sortable: false,
    resizable: true,
    hide: false,
    lockPosition: false
  };
  requestStatusCol: ColDef = {
    colId: QuantityControlColumnsLabels.RequestStatus,
    field: 'requestStatus',
    headerName: 'Request Status',
    sortable: false,
    resizable: true,
    hide: false,
    lockPosition: false
  };
  productNameCol: ColDef = {
    colId: QuantityControlColumnsLabels.ProductName,
    field: 'productName',
    headerName: 'Product',
    sortable: false,
    resizable: true,
    hide: false,
    lockPosition: false
  };
  productTypeCol: ColDef = {
    colId: QuantityControlColumnsLabels.ProductType,
    field: 'productType.name',
    headerName: 'Product Type',
    sortable: false,
    resizable: true,
    hide: false,
    lockPosition: false
  };
  productStatusCol: ColDef = {
    colId: QuantityControlColumnsLabels.ProductStatus,
    field: 'productStatus.displayName',
    headerName: 'Product Status',
    sortable: false,
    resizable: true,
    hide: false,
    lockPosition: false
  };
  agentNameCol: ColDef = {
    colId: QuantityControlColumnsLabels.AgentName,
    field: 'agentName',
    headerName: 'Agent Name',
    sortable: false,
    resizable: true,
    hide: true,
    lockPosition: false
  };
  createdOnCol: ColDef = {
    colId: QuantityControlColumnsLabels.CreatedOn,
    field: 'createdOn',
    headerName: 'Created On',
    sortable: false,
    resizable: true,
    hide: true,
    lockPosition: false
  };
  createdByNameCol: ColDef = {
    colId: QuantityControlColumnsLabels.CreatedByName,
    field: 'createdByName',
    headerName: 'Created By',
    sortable: false,
    resizable: true,
    hide: true,
    lockPosition: false
  };
  deliveryOptionNameCol: ColDef = {
    colId: QuantityControlColumnsLabels.DeliveryOptionName,
    field: 'deliveryOptionName',
    headerName: 'Delivery Option',
    sortable: false,
    resizable: true,
    hide: true,
    lockPosition: false
  };
  commentsCol: ColDef = {
    colId: QuantityControlColumnsLabels.Comments,
    field: 'comments',
    headerName: 'Comments',
    sortable: false,
    resizable: true,
    hide: true,
    lockPosition: false
  };
  lastModifiedOnCol: ColDef = {
    colId: QuantityControlColumnsLabels.LastModifiedOn,
    field: 'lastModifiedOn',
    headerName: 'Last Modified On',
    sortable: false,
    resizable: true,
    hide: true,
    lockPosition: false
  };
  lastModifiedByNameCol: ColDef = {
    colId: QuantityControlColumnsLabels.LastModifiedByName,
    field: 'lastModifiedByName',
    headerName: 'Last Modified By',
    sortable: false,
    resizable: true,
    hide: true,
    lockPosition: false
  };
  agreementTypeNameCol: ColDef = {
    colId: QuantityControlColumnsLabels.AgreementTypeName,
    field: 'agreementTypeName',
    headerName: 'Agreement Type',
    sortable: false,
    resizable: true,
    hide: true,
    lockPosition: false
  };
  etbCol: ColDef = {
    colId: QuantityControlColumnsLabels.Etb,
    field: 'etb',
    headerName: 'ETB',
    sortable: false,
    resizable: true,
    hide: true,
    lockPosition: false
  };
  etdCol: ColDef = {
    colId: QuantityControlColumnsLabels.Etd,
    field: 'etd',
    headerName: 'ETD',
    sortable: false,
    resizable: true,
    hide: true,
    lockPosition: false
  };
  maxQuantityCol: ColDef = {
    colId: QuantityControlColumnsLabels.MaxQuantity,
    field: 'maxQuantity',
    headerName: 'Maximum Quantity',
    sortable: false,
    resizable: true,
    hide: true,
    lockPosition: false
  };
  minQuantityCol: ColDef = {
    colId: QuantityControlColumnsLabels.MinQuantity,
    field: 'minQuantity',
    headerName: 'Minimum Quantity',
    sortable: false,
    resizable: true,
    hide: true,
    lockPosition: false
  };
  uomNameCol: ColDef = {
    colId: QuantityControlColumnsLabels.UomName,
    field: 'uomName',
    headerName: 'UOM',
    sortable: false,
    resizable: true,
    hide: true,
    lockPosition: false
  };
  robOnArrivalCol: ColDef = {
    colId: QuantityControlColumnsLabels.RobOnArrival,
    field: 'robOnArrival',
    headerName: 'Rob on Arrival',
    sortable: false,
    resizable: true,
    hide: true,
    lockPosition: false
  };
  roundVoyageConsumptionCol: ColDef = {
    colId: QuantityControlColumnsLabels.RoundVoyageConsumption,
    field: 'roundVoyageConsumption',
    headerName: 'Round Voyage Consumption',
    sortable: false,
    resizable: true,
    hide: true,
    lockPosition: false
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory
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
}
