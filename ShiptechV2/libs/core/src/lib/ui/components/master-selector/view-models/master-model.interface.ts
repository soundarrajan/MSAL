import { ReplaySubject, Subject } from 'rxjs';
import { GridOptions } from '@ag-grid-community/core';
import { DocumentsMasterSelectorGridViewModel } from '@shiptech/core/ui/components/master-selector/view-models/documents-model/documents-master-selector-grid.view-model';
import { VesselMasterSelectorGridViewModel } from '@shiptech/core/ui/components/master-selector/view-models/vessel-model/vessel-master-selector-grid.view-model';
import { VesselPortCallsMasterSelectorGridViewModel } from '@shiptech/core/ui/components/master-selector/view-models/vessel-port-calls-model/vessel-port-calls-master-selector-grid.view-model';
import { IPageSizeOption } from '@shiptech/core/ui/components/page-size-selector/page-size-selector.component';
import { OrderListSelectorGridViewModel } from './order-model/order-list-selector-grid.view-model';
import { ProductListSelectorGridViewModel } from './product-model/product-list-selector-grid.view-model';
import { PhysicalSupplierListSelectorGridViewModel } from './physical-supplier-model/physical-supplier-list-selector-grid.view-model';
import { SellerListSelectorGridViewModel } from './seller-model/seller-list-selector-grid.view-model';
import { CompanyListSelectorGridViewModel } from './company-model/company-list-selector-grid.view-model';
import { SystemInstrumentListSelectorGridViewModel } from './system-instrument-model/system-instrument-list-selector-grid.view-model';
import { CurrencyListSelectorGridViewModel } from './currency-model/currency-list-selector-grid.view-model';
import { FormulaListSelectorGridViewModel } from './formula-model/formula-list-selector-grid.view-model';

export interface IMasterModelInterface {
  entityId?: number;
  entityName?: string;
  vesselId?: number;
  selectorType?: string;
  page: number;
  isLoading: boolean;
  pageSize: number;
  isReady: boolean;
  isServerSide: boolean;
  totalPages: number;
  destroy$: Subject<any>;
  gridReady$: ReplaySubject<any>;
  totalItems: number;
  gridOptions: GridOptions;
  pageSizeOption?: IPageSizeOption;
  DocumentsMasterSelectorGridViewModel?: DocumentsMasterSelectorGridViewModel;
  VesselMasterSelectorGridViewModel?: VesselMasterSelectorGridViewModel;
  OrderListSelectorGridViewModel?: OrderListSelectorGridViewModel;
  ProductListSelectorGridViewModel?: ProductListSelectorGridViewModel;
  PhysicalSupplierListSelectorGridViewModel?: PhysicalSupplierListSelectorGridViewModel;
  SellerListSelectorGridViewModel?: SellerListSelectorGridViewModel;
  CompanyListSelectorGridViewModel?: CompanyListSelectorGridViewModel;
  VesselPortCallsMasterSelectorGridViewModel?: VesselPortCallsMasterSelectorGridViewModel;
  SystemInstrumentListSelectorGridViewModel?: SystemInstrumentListSelectorGridViewModel,
  CurrencyListSelectorGridViewModel?: CurrencyListSelectorGridViewModel;
  FormulaListSelectorGridViewModel?: FormulaListSelectorGridViewModel;
  markServerSideDataSourceReady(): void;
  onSearch(event: string): void;
}
