import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ColDef, ColGroupDef, GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { RowModelType, RowSelection } from '@shiptech/core/ui/components/ag-grid/type.definition';
import {
  ProductDetailsColGroups,
  ProductDetailsColGroupsLabels,
  ProductDetailsColumns,
  ProductDetailsColumnsLabels,
  ProductDetailsProps
} from './product-details.columns';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { QcReportDetailsService } from '../../../../../../services/qc-report-details.service';
import {
  IQcReportDetailsDeliveredQty,
  IQcReportDetailsProductTypeDto,
  IQcReportDetailsRob
} from '../../../../../../services/api/dto/qc-report-details.dto';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { AgTemplateRendererComponent } from '@shiptech/core/ui/components/ag-grid/ag-template-renderer/ag-template-renderer.component';
import { BaseWithValueColDefParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { AgColumnGroupHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component';
import { ProductTypeListItemViewModel } from './product-type-list-item.view-model';
import { Decimal } from 'decimal.js';

@Injectable()
export class ProductDetailsGridViewModel extends BaseGridViewModel {

  public searchText: string;
  gridOptions: GridOptions = {
    groupHeaderHeight: 40,
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
    headerName: ProductDetailsColumnsLabels.ProductTypeName,
    colId: ProductDetailsColumns.ProductTypeName,
    field: this.modelProps.productTypeName,
    width: 50,
    hide: false,
    suppressToolPanel: true
  };

  logBookBeforeDeliveryCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.LogBookRobBeforeDelivery,
    colId: ProductDetailsColumns.LogBookRobBeforeDelivery,
    field: this.getPathToModel<IQcReportDetailsRob>('robBeforeDelivery', 'logBookROB'),
    width: 50,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgTemplateRendererComponent
  };

  measuredRobBeforeDeliveryCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.MeasuredRobBeforeDelivery,
    colId: ProductDetailsColumns.MeasuredRobBeforeDelivery,
    field: this.getPathToModel<IQcReportDetailsRob>('robBeforeDelivery', 'measuredROB'),
    width: 50,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgTemplateRendererComponent
  };

  differenceRobBeforeDeliveryCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.RobBeforeDeliveryDifference,
    colId: ProductDetailsColumns.RobBeforeDeliveryDifference,
    width: 50,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgTemplateRendererComponent,
    valueGetter: params => {
      const productType = (<ProductTypeListItemViewModel>params.data);
      return this.getDifference(productType.robBeforeDelivery.logBookROB, productType.robBeforeDelivery.measuredROB);
    },
    cellClassRules: this.getToleranceClassRules()
  };


  bdnDeliveredQuantityCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.BdnQty,
    colId: ProductDetailsColumns.BdnQty,
    field: this.getPathToModel<IQcReportDetailsDeliveredQty>('deliveredQty', 'bdnQty'),
    width: 50,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgTemplateRendererComponent
  };

  measuredDeliveredQuantityCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.MessuredDeliveredQty,
    colId: ProductDetailsColumns.MessuredDeliveredQty,
    field: this.getPathToModel<IQcReportDetailsDeliveredQty>('deliveredQty', 'messuredDeliveredQty'),
    width: 50,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgTemplateRendererComponent
  };

  differenceDeliveredQuantityCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.DeliveredQuantityDiffernce,
    colId: ProductDetailsColumns.DeliveredQuantityDiffernce,
    width: 50,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgTemplateRendererComponent,
    valueGetter: params => {
      const productType = (<ProductTypeListItemViewModel>params.data);
      return this.getDifference(productType.deliveredQty.bdnQty, productType.deliveredQty.messuredDeliveredQty);
    },
    cellClassRules: this.getToleranceClassRules()
  };


  logBookAfterDeliveryCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.LogBookRobAfterDelivery,
    colId: ProductDetailsColumns.LogBookRobAfterDelivery,
    field: this.getPathToModel<IQcReportDetailsRob>('robAfterDelivery', 'logBookROB'),
    width: 50,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgTemplateRendererComponent
  };

  measuredRobAfterDeliveryCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.MeasuredRobAfterDelivery,
    colId: ProductDetailsColumns.MeasuredRobAfterDelivery,
    field: this.getPathToModel<IQcReportDetailsRob>('robAfterDelivery', 'measuredROB'),
    width: 50,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgTemplateRendererComponent
  };

  differenceRobAfterDeliveryCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.RobAfterDeliveryDifference,
    colId: ProductDetailsColumns.RobAfterDeliveryDifference,
    width: 50,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgTemplateRendererComponent,
    valueGetter: params => {
      const productType = (<ProductTypeListItemViewModel>params.data);
      return this.getDifference(productType.robAfterDelivery.logBookROB, productType.robAfterDelivery.measuredROB);
    },
    cellClassRules: this.getToleranceClassRules()
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
    headerGroupComponentFramework: AgColumnGroupHeaderComponent,
    marryChildren: true,
    children: [this.logBookBeforeDeliveryCol, this.measuredRobBeforeDeliveryCol, this.differenceRobBeforeDeliveryCol]
  };

  deliveredQuantityColGroup: ColGroupDef = {
    groupId: ProductDetailsColGroups.DeliveredQuantity,
    headerTooltip: ProductDetailsColGroupsLabels.DeliveredQuantity,
    headerName: ProductDetailsColGroupsLabels.DeliveredQuantity,
    headerGroupComponentFramework: AgColumnGroupHeaderComponent,
    marryChildren: true,
    children: [this.bdnDeliveredQuantityCol, this.measuredDeliveredQuantityCol, this.differenceDeliveredQuantityCol]
  };

  robAfterDeliveryColGroup: ColGroupDef = {
    groupId: ProductDetailsColGroups.RobAfterDelivery,
    headerTooltip: ProductDetailsColGroupsLabels.RobAfterDelivery,
    headerName: ProductDetailsColGroupsLabels.RobAfterDelivery,
    headerGroupComponentFramework: AgColumnGroupHeaderComponent,
    marryChildren: true,
    children: [this.logBookAfterDeliveryCol, this.measuredRobAfterDeliveryCol, this.differenceRobAfterDeliveryCol]
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private quantityControlService: QcReportDetailsService,
    private modelProps: ProductDetailsProps
  ) {
    super('quantity-control-product-details-grid', columnPreferences, changeDetector, loggerFactory.createLogger(ProductDetailsGridViewModel.name));
    this.initOptions(this.gridOptions);
  }

  getColumnsDefs(): ColDef[] {
    return [this.productsColGroup, this.robBeforeDeliveryColGroup, this.deliveredQuantityColGroup, this.robAfterDeliveryColGroup];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();

    this.getPathToModel<IQcReportDetailsRob>('deliveredQty', 'measuredROB');
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
  getPathToModel<T = any>(propertyName: keyof IQcReportDetailsProductTypeDto, childPropertyName?: keyof T): string {
    return `${nameof<IQcReportDetailsProductTypeDto>(propertyName)}.${nameof<T>(childPropertyName)}`;
  }

  getToleranceClassRules(): { [cssClassName: string]: (Function | string) } {
    // TODO: Add real tolerance logic
    return {
      'cell-background red': (params: BaseWithValueColDefParams) => params.value < 0,
      'cell-background orange': (params: BaseWithValueColDefParams) => params.value > 0 && params.value < 100
    };
  }

  getDifference(minuend: number, suptrahend: number): number {
    return new Decimal(minuend).sub(new Decimal(suptrahend)).toNumber();
  }
}
