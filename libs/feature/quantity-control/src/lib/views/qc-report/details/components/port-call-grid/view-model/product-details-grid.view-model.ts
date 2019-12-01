import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ColGroupDef, GridOptions } from 'ag-grid-community';
import { RowModelType, RowSelection, TypedColDef } from '@shiptech/core/ui/components/ag-grid/type.definition';
import {
  ProductDetailsColGroupsEnum,
  ProductDetailsColGroupsLabels,
  ProductDetailsColumns,
  ProductDetailsColumnsLabels
} from './product-details.columns';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { QcReportService } from '../../../../../../services/qc-report.service';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { AgColumnGroupHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component';
import { ProductTypeListItemViewModel } from './product-type-list-item.view-model';
import { Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import {
  SwitchUomForDeliveredQuantityAction,
  SwitchUomForRobAfterDelivery,
  SwitchUomForRobBeforeDeliveryAction
} from '../../../../../../store/report/details/actions/qc-uom.actions';
import { IQcReportDetailsState } from '../../../../../../store/report/details/qc-report-details.model';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { roundDecimals } from '@shiptech/core/utils/math';

function model(prop: keyof ProductTypeListItemViewModel): keyof ProductTypeListItemViewModel {
  return prop;
}

@Injectable()
export class ProductDetailsGridViewModel extends BaseGridViewModel {

  private readonly quantityPrecision;

  gridOptions: GridOptions = {
    groupHeaderHeight: 40,
    headerHeight: 40,
    rowHeight: 35,
    rowModelType: RowModelType.ClientSide,
    pagination: false,
    animateRows: true,
    deltaRowDataMode: true,
    suppressPaginationPanel: false,
    suppressColumnVirtualisation: true,
    rowSelection: RowSelection.Multiple,
    rowDragManaged: true,
    suppressRowClickSelection: true,
    multiSortKey: 'ctrl',
    getRowNodeId: (data: ProductTypeListItemViewModel) => data?.id?.toString(),
    enableBrowserTooltips: true,
    singleClickEdit: true,
    defaultColDef: {
      sortable: true,
      filter: false,
      suppressColumnsToolPanel: true,
      suppressFiltersToolPanel: true
    }
  };

  productTypeCol: TypedColDef<ProductTypeListItemViewModel, IDisplayLookupDto> = {
    headerName: ProductDetailsColumnsLabels.ProductTypeName,
    colId: ProductDetailsColumns.ProductTypeName,
    field: model('productType'),
    valueFormatter: params => params.value?.displayName ?? params.value?.name
  };

  logBookBeforeDeliveryCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.LogBookRobBeforeDelivery,
    colId: ProductDetailsColumns.LogBookRobBeforeDelivery,
    field: model('robBeforeDeliveryLogBookROB'),
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    cellRendererFramework: AgCellTemplateComponent
  };

  measuredRobBeforeDeliveryCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.MeasuredRobBeforeDelivery,
    colId: ProductDetailsColumns.MeasuredRobBeforeDelivery,
    field: model('robBeforeDeliveryMeasuredROB'),
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    cellRendererFramework: AgCellTemplateComponent
  };

  differenceRobBeforeDeliveryCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.RobBeforeDeliveryDifference,
    colId: ProductDetailsColumns.RobBeforeDeliveryDifference,
    cellRendererFramework: AgCellTemplateComponent,
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    valueGetter: params => this.getDifference(params.data.robBeforeDeliveryLogBookROB, params.data.robBeforeDeliveryMeasuredROB),
    cellClassRules: {
      'cell-background red': params => params.value < 0,
      'cell-background orange': params => params.value > 0 && params.value < 100
    }
  };


  bdnDeliveredQuantityCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.BdnQty,
    colId: ProductDetailsColumns.BdnQty,
    field: model('deliveredQuantityBdnQty'),
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    cellRendererFramework: AgCellTemplateComponent
  };

  measuredDeliveredQuantityCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.MessuredDeliveredQty,
    colId: ProductDetailsColumns.MessuredDeliveredQty,
    field: model('measuredDeliveredQty'),
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    cellRendererFramework: AgCellTemplateComponent
  };

  differenceDeliveredQuantityCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.DeliveredQuantityDiffernce,
    colId: ProductDetailsColumns.DeliveredQuantityDiffernce,
    cellRendererFramework: AgCellTemplateComponent,
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    valueGetter: params => this.getDifference(params.data.deliveredQuantityBdnQty, params.data.measuredDeliveredQty),
    cellClassRules: {
      'cell-background red': params => params.value < 0,
      'cell-background orange': params => params.value > 0 && params.value < 100
    }
  };


  logBookAfterDeliveryCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.LogBookRobAfterDelivery,
    colId: ProductDetailsColumns.LogBookRobAfterDelivery,
    field: model('robAfterDeliveryLogBookROB'),
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    cellRendererFramework: AgCellTemplateComponent
  };

  measuredRobAfterDeliveryCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.MeasuredRobAfterDelivery,
    colId: ProductDetailsColumns.MeasuredRobAfterDelivery,
    field: model('robAfterDeliveryMeasuredROB'),
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    cellRendererFramework: AgCellTemplateComponent
  };

  differenceRobAfterDeliveryCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.RobAfterDeliveryDifference,
    colId: ProductDetailsColumns.RobAfterDeliveryDifference,
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    cellRendererFramework: AgCellTemplateComponent,
    valueGetter: params => this.getDifference(params.data.robAfterDeliveryLogBookROB, params.data.robAfterDeliveryMeasuredROB),
    cellClassRules: {
      'cell-background red': params => params.value < 0,
      'cell-background orange': params => params.value > 0 && params.value < 100
    }
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
    children: [this.productTypeCol]
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

  robUomBeforeDelivery$: Observable<IDisplayLookupDto>;
  robUomAfterDelivery$: Observable<IDisplayLookupDto>;
  deliveredQtyUom$: Observable<IDisplayLookupDto>;

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    tenantSettings: TenantSettingsService,
    private quantityControlService: QcReportService,
    private store: Store) {
    super('quantity-control-product-details-grid', columnPreferences, changeDetector, loggerFactory.createLogger(ProductDetailsGridViewModel.name));
    this.initOptions(this.gridOptions);

    const generalTenantSettings = tenantSettings.getGeneralTenantSettings();
    this.quantityPrecision = generalTenantSettings.defaultValues.quantityPrecision;

    this.robUomBeforeDelivery$ = this.selectReportDetails(state => state.robBeforeDeliveryUom);
    this.robUomAfterDelivery$ = this.selectReportDetails(state => state.robAfterDeliveryUom);
    this.deliveredQtyUom$ = this.selectReportDetails(state => state.deliveredQtyUom);
  }

  protected get reportDetailsState(): IQcReportDetailsState {
    // Note: Always get a fresh reference to the state.
    return (<IAppState>this.store.snapshot()).quantityControl.report.details;
  }

  private selectReportDetails<T>(select: ((state: IQcReportDetailsState) => T)): Observable<T> {
    return this.store.select((appState: IAppState) => select(appState?.quantityControl?.report?.details));
  }

  getColumnsDefs(): TypedColDef[] {
    return [this.productsColGroup, this.robBeforeDeliveryColGroup, this.deliveredQuantityColGroup, this.robAfterDeliveryColGroup];
  }

  getDifference(left: number, right: number): number {
    if (left === null || left === undefined || right === null || right === undefined)
      return undefined;

    return left - right;
  }

  getSelectedUomValue$(groupId: ProductDetailsColGroupsEnum): Observable<IDisplayLookupDto> {
    switch (groupId) {
      case ProductDetailsColGroupsEnum.RobBeforeDelivery: {
        return this.robUomBeforeDelivery$;
      }
      case ProductDetailsColGroupsEnum.RobAfterDelivery: {
        return this.robUomAfterDelivery$;
      }
      case ProductDetailsColGroupsEnum.DeliveredQuantity: {
        return this.deliveredQtyUom$;
      }
      default: {
        return throwError('Invalid groupId');
      }
    }
  }

  switchSelectedUom(groupId: ProductDetailsColGroupsEnum, value: IDisplayLookupDto): void {
    switch (groupId) {
      case ProductDetailsColGroupsEnum.RobBeforeDelivery: {
        this.store.dispatch(new SwitchUomForRobBeforeDeliveryAction(value));
        break;
      }

      case ProductDetailsColGroupsEnum.RobAfterDelivery: {
        this.store.dispatch(new SwitchUomForRobAfterDelivery(value));
        break;
      }

      case ProductDetailsColGroupsEnum.DeliveredQuantity: {
        this.store.dispatch(new SwitchUomForDeliveredQuantityAction(value));
        break;
      }

      default: {
        throwError('Invalid groupId');
        break;
      }
    }
  }
}
