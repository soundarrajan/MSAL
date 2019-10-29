import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ColDef, ColGroupDef, GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { RowModelType, RowSelection } from '@shiptech/core/ui/components/ag-grid/type.definition';
import {
  ProductDetailsColGroups,
  ProductDetailsColGroupsLabels,
  ProductDetailsColumns,
  ProductDetailsProps
} from './product-details.columns';
import { ModuleLoggerFactory } from '../../../../../core/logging/module-logger-factory';
import { PortCallDetailsService } from '../../../../../services/port-call-details.service';
import {
  IPortCallDeliveredQty,
  IPortCallProductDto,
  IPortCallRob
} from '../../../../../services/api/dto/port-call.dto';
import { nameof } from '@shiptech/core/utils/type-definitions';

@Injectable()
export class ProductDetailsGridViewModel extends BaseGridViewModel {

  public searchText: string;
  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 35,

    rowModelType: RowModelType.ClientSide,
    pagination: true,

    animateRows: true,

    deltaRowDataMode: false,
    suppressPaginationPanel: false,
    suppressColumnVirtualisation: true,
    rowSelection: RowSelection.Multiple,
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

  productTypeNameCol: ColDef = {
    headerName: ProductDetailsColumns.ProductTypeName,
    colId: ProductDetailsColumns.ProductTypeName,
    field: this.modelProps.productTypeName,
    width: 50,
    hide: false,
    suppressToolPanel: true
  };

  logBookBeforeDeliveryCol: ColDef = {
    headerName: ProductDetailsColumns.LogBookRobBeforeDelivery,
    colId: ProductDetailsColumns.LogBookRobBeforeDelivery,
    field: this.getPathToModel<IPortCallRob>('robBeforeDelivery', 'logBookROB'),
    width: 50,
    hide: false,
    suppressToolPanel: true
  };

  measuredRobBeforeDeliveryCol: ColDef = {
    headerName: ProductDetailsColumns.MeasuredRobBeforeDelivery,
    colId: ProductDetailsColumns.MeasuredRobBeforeDelivery,
    field: this.getPathToModel<IPortCallRob>('robBeforeDelivery', 'measuredROB'),
    width: 50,
    hide: false,
    suppressToolPanel: true
  };

  differenceRobBeforeDeliveryCol: ColDef = {
    headerName: ProductDetailsColumns.MeasuredRobBeforeDelivery,
    colId: ProductDetailsColumns.MeasuredRobBeforeDelivery,
    width: 50,
    hide: false,
    suppressToolPanel: true
  };


  bdnDeliveredQuantityCol: ColDef = {
    headerName: ProductDetailsColumns.BdnQty,
    colId: ProductDetailsColumns.BdnQty,
    field: this.getPathToModel<IPortCallDeliveredQty>('deliveredQty', 'bdnQty'),
    width: 50,
    hide: false,
    suppressToolPanel: true
  };

  measuredDeliveredQuantityCol: ColDef = {
    headerName: ProductDetailsColumns.MessuredDeliveredQty,
    colId: ProductDetailsColumns.MessuredDeliveredQty,
    field: this.getPathToModel<IPortCallDeliveredQty>('deliveredQty', 'messuredDeliveredQty'),
    width: 50,
    hide: false,
    suppressToolPanel: true
  };

  differenceDeliveredQuantityCol: ColDef = {
    headerName: ProductDetailsColumns.DeliveredQuantityDiffernce,
    colId: ProductDetailsColumns.DeliveredQuantityDiffernce,
    width: 50,
    hide: false,
    suppressToolPanel: true
  };


  logBookAfterDeliveryCol: ColDef = {
    headerName: ProductDetailsColumns.LogBookRobAfterDelivery,
    colId: ProductDetailsColumns.LogBookRobAfterDelivery,
    field: this.getPathToModel<IPortCallRob>('robAfterDelivery', 'logBookROB'),
    width: 50,
    hide: false,
    suppressToolPanel: true
  };

  measuredRobAfterDeliveryCol: ColDef = {
    headerName: ProductDetailsColumns.MeasuredRobAfterDelivery,
    colId: ProductDetailsColumns.MeasuredRobAfterDelivery,
    field: this.getPathToModel<IPortCallRob>('robAfterDelivery', 'measuredROB'),
    width: 50,
    hide: false,
    suppressToolPanel: true
  };

  differenceRobAfterDeliveryCol: ColDef = {
    headerName: ProductDetailsColumns.RobAfterDeliveryDifference,
    colId: ProductDetailsColumns.RobAfterDeliveryDifference,
    width: 50,
    hide: false,
    suppressToolPanel: true
  };


  productsColGroup: ColGroupDef = {
    groupId: ProductDetailsColGroups.Products,
    headerTooltip: ProductDetailsColGroupsLabels.Products,
    headerName: ProductDetailsColGroupsLabels.Products,
    marryChildren: true,
    children: [this.productTypeNameCol]
  };

  robBeforeDeliveryColGroup: ColGroupDef = {
    groupId: ProductDetailsColGroups.RobBeforeDelivery,
    headerTooltip: ProductDetailsColGroupsLabels.RobBeforeDelivery,
    headerName: ProductDetailsColGroupsLabels.RobBeforeDelivery,
    marryChildren: true,
    children: [this.logBookBeforeDeliveryCol, this.measuredRobBeforeDeliveryCol, this.differenceRobBeforeDeliveryCol]
  };

  deliveredQuantityColGroup: ColGroupDef = {
    groupId: ProductDetailsColGroups.DeliveredQuantity,
    headerTooltip: ProductDetailsColGroupsLabels.DeliveredQuantity,
    headerName: ProductDetailsColGroupsLabels.DeliveredQuantity,
    marryChildren: true,
    children: [this.bdnDeliveredQuantityCol, this.measuredDeliveredQuantityCol, this.differenceDeliveredQuantityCol]
  };

  robAfterDeliveryColGroup: ColGroupDef = {
    groupId: ProductDetailsColGroups.RobAfterDelivery,
    headerTooltip: ProductDetailsColGroupsLabels.RobAfterDelivery,
    headerName: ProductDetailsColGroupsLabels.RobAfterDelivery,
    marryChildren: true,
    children: [this.logBookAfterDeliveryCol, this.measuredRobAfterDeliveryCol, this.differenceRobAfterDeliveryCol]
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private quantityControlService: PortCallDetailsService,
    private modelProps: ProductDetailsProps
  ) {
    super('quantity-control-grid', columnPreferences, changeDetector, loggerFactory.createLogger(ProductDetailsGridViewModel.name));
    this.initOptions(this.gridOptions);
  }

  getColumnsDefs(): ColDef[] {
    return [this.productsColGroup, this.robBeforeDeliveryColGroup, this.deliveredQuantityColGroup, this.robAfterDeliveryColGroup];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();

    this.getPathToModel<IPortCallRob>('deliveredQty', 'measuredROB');
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    // this.quantityControlService.getPortCalls({
    //   pagination: getShiptechFormatPagination(params),
    //   sorts: getShiptechFormatSorts(params),
    //   filters: getShiptechFormatFilters(params),
    //   searchText: this.searchText
    // }).subscribe(
    //   response => {
    //     console.log('RESPONSE', response);
    //     params.successCallback(response.items, 100);
    //   },
    //   () => params.failCallback());
  }

  // TODO: Must be refactored
  getPathToModel<T = any>(propertyName: keyof IPortCallProductDto, childPropertyName?: keyof T): string {
    return `${nameof<IPortCallProductDto>(propertyName)}.${nameof<T>(childPropertyName)}`;
  }

}
