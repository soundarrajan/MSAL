import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ColGroupDef, GridOptions } from 'ag-grid-community';
import { RowSelection, TypedColDef } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { ProductDetailsColGroupsEnum, ProductDetailsColGroupsLabels, ProductDetailsColumns, ProductDetailsColumnsLabels } from './product-details.columns';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { QcReportService } from '../../../../../../services/qc-report.service';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { AgColumnGroupHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component';
import { ProductTypeListItemViewModel } from './product-type-list-item.view-model';
import { Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { SwitchUomForDeliveredQuantityAction, SwitchUomForRobAfterDelivery, SwitchUomForRobBeforeDeliveryAction } from '../../../../../../store/report/details/actions/qc-uom.actions';
import { IQcReportDetailsState } from '../../../../../../store/report/details/qc-report-details.model';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { IDeliveryTenantSettings } from '../../../../../../core/settings/delivery-tenant-settings';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { QuantityMatchStatusEnum } from '../../../../../../core/enums/quantity-match-status';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

function model(prop: keyof ProductTypeListItemViewModel): keyof ProductTypeListItemViewModel {
  return prop;
}

@Injectable()
export class ProductDetailsGridViewModel extends BaseGridViewModel {

  private readonly minToleranceLimit;
  private readonly maxToleranceLimit;

  gridOptions: GridOptions = {
    groupHeaderHeight: 25,
    headerHeight: 40,
    rowHeight: 35,
    pagination: false,
    animateRows: true,
    domLayout: 'autoHeight',
    deltaRowDataMode: true,
    suppressPaginationPanel: false,
    rowSelection: RowSelection.Multiple,
    rowDragManaged: true,
    suppressRowClickSelection: true,
    multiSortKey: 'ctrl',
    getRowNodeId: (data: ProductTypeListItemViewModel) => data?.productType?.id?.toString(),
    enableBrowserTooltips: true,

    defaultColDef: {
      editable: false,
      sortable: false,
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
    valueFormatter: params => this.format.quantity(params.value),
    cellRendererFramework: AgCellTemplateComponent
  };

  measuredRobBeforeDeliveryCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.MeasuredRobBeforeDelivery,
    colId: ProductDetailsColumns.MeasuredRobBeforeDelivery,
    field: model('robBeforeDeliveryMeasuredROB'),
    valueFormatter: params => this.format.quantity(params.value),
    cellRendererFramework: AgCellTemplateComponent
  };

  differenceRobBeforeDeliveryCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.RobBeforeDeliveryDifference,
    colId: ProductDetailsColumns.RobBeforeDeliveryDifference,
    field: model('robBeforeDiff'),
    valueFormatter: params => this.format.quantity(params.value),
    cellClass: 'cell-background',
    cellClassRules: {
      'not-matched': params => params.data?.robBeforeDiffStatus?.name === QuantityMatchStatusEnum.NotMatched,
      'matched-withing-limit': params => params.data?.robBeforeDiffStatus?.name === QuantityMatchStatusEnum.WithinLimit
    }
  };

  bdnDeliveredQuantityCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.BdnQty,
    colId: ProductDetailsColumns.BdnQty,
    field: model('deliveredQuantityBdnQty'),
    valueFormatter: params => this.format.quantity(params.value),
    cellRendererFramework: AgCellTemplateComponent
  };

  measuredDeliveredQuantityCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.MessuredDeliveredQty,
    colId: ProductDetailsColumns.MessuredDeliveredQty,
    field: model('measuredDeliveredQty'),
    valueFormatter: params => this.format.quantity(params.value),
    cellRendererFramework: AgCellTemplateComponent
  };

  differenceDeliveredQuantityCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.DeliveredQuantityDiffernce,
    colId: ProductDetailsColumns.DeliveredQuantityDiffernce,
    field: model('deliveredDiff'),
    cellClass: 'cell-background',
    cellClassRules: {
      'not-matched': params => params.data?.deliveredDiffStatus?.name === QuantityMatchStatusEnum.NotMatched,
      'matched-withing-limit': params => params.data?.deliveredDiffStatus?.name === QuantityMatchStatusEnum.WithinLimit
    }
  };

  logBookAfterDeliveryCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.LogBookRobAfterDelivery,
    colId: ProductDetailsColumns.LogBookRobAfterDelivery,
    field: model('robAfterDeliveryLogBookROB'),
    valueFormatter: params => this.format.quantity(params.value),
    cellRendererFramework: AgCellTemplateComponent
  };

  measuredRobAfterDeliveryCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.MeasuredRobAfterDelivery,
    colId: ProductDetailsColumns.MeasuredRobAfterDelivery,
    field: model('robAfterDeliveryMeasuredROB'),
    valueFormatter: params => this.format.quantity(params.value),
    cellRendererFramework: AgCellTemplateComponent
  };

  differenceRobAfterDeliveryCol: TypedColDef<ProductTypeListItemViewModel, number> = {
    headerName: ProductDetailsColumnsLabels.RobAfterDeliveryDifference,
    colId: ProductDetailsColumns.RobAfterDeliveryDifference,
    field: model('robAfterDiff'),
    valueFormatter: params => this.format.quantity(params.value),
    cellClass: 'cell-background',
    cellClassRules: {
      'not-matched': params => params.data?.robAfterDiffStatus?.name === QuantityMatchStatusEnum.NotMatched,
      'matched-withing-limit': params => params.data?.robAfterDiffStatus?.name === QuantityMatchStatusEnum.WithinLimit
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
    public format: TenantFormattingService,
    private quantityControlService: QcReportService,
    private store: Store) {
    super('quantity-control-product-details-grid', columnPreferences, changeDetector, loggerFactory.createLogger(ProductDetailsGridViewModel.name));
    this.initOptions(this.gridOptions);

    const deliveryTenantSettings = tenantSettings.getModuleTenantSettings<IDeliveryTenantSettings>(TenantSettingsModuleName.Delivery);
    this.minToleranceLimit = deliveryTenantSettings.minToleranceLimit;
    this.maxToleranceLimit = deliveryTenantSettings.maxToleranceLimit;

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
