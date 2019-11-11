import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ColDef, ColGroupDef, GridOptions, IServerSideGetRowsParams, ValueGetterParams } from 'ag-grid-community';
import { RowModelType, RowSelection } from '@shiptech/core/ui/components/ag-grid/type.definition';
import {
  ProductDetailsColGroupsEnum,
  ProductDetailsColGroupsLabels,
  ProductDetailsColumns,
  ProductDetailsColumnsLabels,
  ProductDetailsProps
} from './product-details.columns';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { QcReportDetailsService } from '../../../../../../services/qc-report-details.service';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { BaseWithValueColDefParams } from 'ag-grid-community/dist/lib/entities/colDef';
import { AgColumnGroupHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component';
import { ProductTypeListItemViewModel } from './product-type-list-item.view-model';
import { Decimal } from 'decimal.js';
import { Select, Store } from '@ngxs/store';
import { QcReportState } from '../../../../../../store/report-view/qc-report.state';
import { Observable, throwError } from 'rxjs';
import { IQcUomState, QcUomStateModel } from '../../../../../../store/report-view/models/uom.state';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import {
  SwitchUomForDeliveredQuantityAction,
  SwitchUomForRobAfterDelivery,
  SwitchUomForRobBeforeDeliveryAction
} from '../../../../../../store/report-view/details/actions/qc-uom.actions';
import { IQcReportDetailsState } from '../../../../../../store/report-view/details/qc-report-details.model';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';

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

    deltaRowDataMode: true,
    suppressPaginationPanel: false,
    suppressColumnVirtualisation: true,
    rowSelection: RowSelection.Multiple,
    rowDragManaged: true,
    suppressRowClickSelection: true,

    multiSortKey: 'ctrl',
    getRowNodeId: (data: ProductTypeListItemViewModel) => data.productTypeId.toString(),

    enableBrowserTooltips: true,
    singleClickEdit: true,
    defaultColDef: {
      sortable: true,
      filter: 'agTextColumnFilter'
    }
  };

  productTypeNameCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.ProductTypeName,
    colId: ProductDetailsColumns.ProductTypeName,
    field: this.modelProps.productTypeName,
    hide: false,
    suppressToolPanel: true
  };

  logBookBeforeDeliveryCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.LogBookRobBeforeDelivery,
    colId: ProductDetailsColumns.LogBookRobBeforeDelivery,
    field: this.modelProps.robBeforeDeliveryLogBookROB,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgCellTemplateComponent,
    valueGetter: this.relativeValueGetter(() => this.reportDetailsState.robBeforeDeliveryUom.conversionRate)
  };

  measuredRobBeforeDeliveryCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.MeasuredRobBeforeDelivery,
    colId: ProductDetailsColumns.MeasuredRobBeforeDelivery,
    field: this.modelProps.robBeforeDeliveryMeasuredROB,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgCellTemplateComponent,
    valueGetter: this.relativeValueGetter(() => this.reportDetailsState.robBeforeDeliveryUom.conversionRate)
  };

  differenceRobBeforeDeliveryCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.RobBeforeDeliveryDifference,
    colId: ProductDetailsColumns.RobBeforeDeliveryDifference,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgCellTemplateComponent,
    valueGetter: params => {
      const productType = (<ProductTypeListItemViewModel>params.data);
      return this.getDifference(productType.robBeforeDeliveryLogBookROB, productType.robBeforeDeliveryMeasuredROB) * this.reportDetailsState.robBeforeDeliveryUom.conversionRate;
    },
    cellClassRules: this.getToleranceClassRules()
  };


  bdnDeliveredQuantityCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.BdnQty,
    colId: ProductDetailsColumns.BdnQty,
    field: this.modelProps.deliveredQuantityBdnQty,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgCellTemplateComponent,
    valueGetter: this.relativeValueGetter(() => this.reportDetailsState.deliveredQtyUom.conversionRate)
  };

  measuredDeliveredQuantityCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.MessuredDeliveredQty,
    colId: ProductDetailsColumns.MessuredDeliveredQty,
    field: this.modelProps.deliveredQuantityMessuredDeliveredQuantity,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgCellTemplateComponent,
    valueGetter: this.relativeValueGetter(() => this.reportDetailsState.deliveredQtyUom.conversionRate)
  };

  differenceDeliveredQuantityCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.DeliveredQuantityDiffernce,
    colId: ProductDetailsColumns.DeliveredQuantityDiffernce,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgCellTemplateComponent,
    valueGetter: params => {
      const productType = (<ProductTypeListItemViewModel>params.data);
      return this.getDifference(productType.deliveredQuantityBdnQty, productType.deliveredQuantityMessuredDeliveredQuantity) * this.reportDetailsState.deliveredQtyUom.conversionRate;
    },
    cellClassRules: this.getToleranceClassRules()
  };


  logBookAfterDeliveryCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.LogBookRobAfterDelivery,
    colId: ProductDetailsColumns.LogBookRobAfterDelivery,
    field: this.modelProps.robAfterDeliveryLogBookROB,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgCellTemplateComponent,
    valueGetter: this.relativeValueGetter(() => this.reportDetailsState.robAfterDeliveryUom.conversionRate)
  };

  measuredRobAfterDeliveryCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.MeasuredRobAfterDelivery,
    colId: ProductDetailsColumns.MeasuredRobAfterDelivery,
    field: this.modelProps.robAfterDeliveryMeasuredROB,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgCellTemplateComponent,
    valueGetter: this.relativeValueGetter(() => this.reportDetailsState.robAfterDeliveryUom.conversionRate)
  };

  differenceRobAfterDeliveryCol: ColDef = {
    headerName: ProductDetailsColumnsLabels.RobAfterDeliveryDifference,
    colId: ProductDetailsColumns.RobAfterDeliveryDifference,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgCellTemplateComponent,
    valueGetter: params => {
      const productType = (<ProductTypeListItemViewModel>params.data);
      return this.getDifference(productType.robAfterDeliveryLogBookROB, productType.robAfterDeliveryMeasuredROB) * this.reportDetailsState.robAfterDeliveryUom.conversionRate;
    },
    cellClassRules: this.getToleranceClassRules()
  };
  robAfterDeliveryColGroup: ColGroupDef = {
    groupId: ProductDetailsColGroupsEnum.RobAfterDelivery,
    headerTooltip: ProductDetailsColGroupsLabels.RobAfterDelivery,
    headerName: ProductDetailsColGroupsLabels.RobAfterDelivery,
    headerGroupComponentFramework: AgColumnGroupHeaderComponent,
    marryChildren: true,
    children: [this.logBookAfterDeliveryCol, this.measuredRobAfterDeliveryCol, this.differenceRobAfterDeliveryCol]
  };


  productsColGroup: ColGroupDef = {
    groupId: ProductDetailsColGroupsEnum.Products,
    headerTooltip: ProductDetailsColGroupsLabels.Products,
    headerName: ProductDetailsColGroupsLabels.Products,
    marryChildren: true,
    children: [this.productTypeNameCol]
  };
  robBeforeDeliveryColGroup: ColGroupDef = {
    groupId: ProductDetailsColGroupsEnum.RobBeforeDelivery,
    headerTooltip: ProductDetailsColGroupsLabels.RobBeforeDelivery,
    headerName: ProductDetailsColGroupsLabels.RobBeforeDelivery,
    headerGroupComponentFramework: AgColumnGroupHeaderComponent,
    marryChildren: true,
    children: [this.logBookBeforeDeliveryCol, this.measuredRobBeforeDeliveryCol, this.differenceRobBeforeDeliveryCol]
  };
  deliveredQuantityColGroup: ColGroupDef = {
    groupId: ProductDetailsColGroupsEnum.DeliveredQuantity,
    headerTooltip: ProductDetailsColGroupsLabels.DeliveredQuantity,
    headerName: ProductDetailsColGroupsLabels.DeliveredQuantity,
    headerGroupComponentFramework: AgColumnGroupHeaderComponent,
    marryChildren: true,
    children: [this.bdnDeliveredQuantityCol, this.measuredDeliveredQuantityCol, this.differenceDeliveredQuantityCol]
  };

  @Select(QcReportState.getReportDetailsRobUomBeforeDelivery) private robUomBeforeDelivery$: Observable<IQcUomState>;
  @Select(QcReportState.getReportDetailsRobUomAfterDelivery) private robUomAfterDelivery$: Observable<IQcUomState>;
  @Select(QcReportState.getReportDetailsDeliveredQtyUom) private deliveredQtyUom$: Observable<IQcUomState>;

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private quantityControlService: QcReportDetailsService,
    private modelProps: ProductDetailsProps,
    private store: Store
  ) {
    super('quantity-control-product-details-grid', columnPreferences, changeDetector, loggerFactory.createLogger(ProductDetailsGridViewModel.name));
    this.initOptions(this.gridOptions);
  }

  protected get reportDetailsState(): IQcReportDetailsState {
    // Note: Always get a fresh reference to the state.
    return (<IAppState>this.store.snapshot()).quantityControl.report.details;
  }

  getColumnsDefs(): ColDef[] {
    return [this.productsColGroup, this.robBeforeDeliveryColGroup, this.deliveredQuantityColGroup, this.robAfterDeliveryColGroup];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
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

  getToleranceClassRules(): { [cssClassName: string]: (Function | string) } {
    // TODO: Add real tolerance logic
    return {
      'cell-background red': (params: BaseWithValueColDefParams) => params.value < 0,
      'cell-background orange': (params: BaseWithValueColDefParams) => params.value > 0 && params.value < 100
    };
  }

  relativeValueGetter(conversionRateCb: () => number): ((params: ValueGetterParams) => any) | string {
    return (params: ValueGetterParams) => {
      return params.data[params.colDef.field] / conversionRateCb();
    };
  }

  getDifference(minuend: number, suptrahend: number): number {
    return new Decimal(minuend).sub(new Decimal(suptrahend)).toNumber();
  }

  getSelectedUomValue(groupId: ProductDetailsColGroupsEnum): Observable<IQcUomState> {
    switch (groupId) {
      case ProductDetailsColGroupsEnum.RobBeforeDelivery: {
        return this.robUomBeforeDelivery$;
        break;
      }

      case ProductDetailsColGroupsEnum.RobAfterDelivery: {
        return this.robUomAfterDelivery$;
        break;
      }

      case ProductDetailsColGroupsEnum.DeliveredQuantity: {
        return this.deliveredQtyUom$;
        break;
      }

      default: {
        throwError('Invalid groupId');
        break;
      }
    }
  }

  switchSelectedUom(groupId: ProductDetailsColGroupsEnum, value: ILookupDto): void {
    switch (groupId) {
      case ProductDetailsColGroupsEnum.RobBeforeDelivery: {
        this.store.dispatch(new SwitchUomForRobBeforeDeliveryAction(new QcUomStateModel(value)));
        break;
      }

      case ProductDetailsColGroupsEnum.RobAfterDelivery: {
        this.store.dispatch(new SwitchUomForRobAfterDelivery(new QcUomStateModel(value)));
        break;
      }

      case ProductDetailsColGroupsEnum.DeliveredQuantity: {
        this.store.dispatch(new SwitchUomForDeliveredQuantityAction(new QcUomStateModel(value)));
        break;
      }

      default: {
        throwError('Invalid groupId');
        break;
      }
    }

    // TODO: Move this into an state listener for siwtchUom actions
    this.gridApi.redrawRows();
  }

}
