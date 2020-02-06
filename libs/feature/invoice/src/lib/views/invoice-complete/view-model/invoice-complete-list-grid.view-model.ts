import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { ITypedColDef, RowModelType, RowSelection } from '@shiptech/core/ui/components/ag-grid/type.definition';
import {
  CompleteListColumnServerKeys,
  CompleteListColumnsLabels,
  InvoiceCompleteListColumns
} from './invoice-complete-list.columns';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { AppError } from '@shiptech/core/error-handling/app-error';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { ReconStatusLookup } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import { takeUntil } from 'rxjs/operators';
import { StatusLookup } from '@shiptech/core/lookups/known-lookups/status/status-lookup.service';
import { ICompleteListItemDto } from '../../../services/api/dto/invoice-complete-list-item.dto';
import { InvoiceCompleteService } from '../../../services/invoice-complete.service';
import { ModuleLoggerFactory } from 'libs/feature/quantity-control/src/lib/core/logging/module-logger-factory';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';

function model(prop: keyof ICompleteListItemDto): keyof ICompleteListItemDto {
  return prop;
}

@Injectable()
export class CompleteListGridViewModel extends BaseGridViewModel {

  private defaultColFilterParams = {
    clearButton: true,
    applyButton: true,
    precision: () => this.format.quantityPrecision
  };

  public searchText: string;
  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 40,

    rowModelType: RowModelType.ServerSide,
    pagination: true,
    animateRows: true,

    rowSelection: RowSelection.Multiple,
    suppressRowClickSelection: true,
    suppressContextMenu: true,

    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: ICompleteListItemDto) => data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  orderNoCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.order,
    colId: InvoiceCompleteListColumns.order,
    field: model('order'),
    cellRendererFramework: AgCellTemplateComponent,
    width: 200
  };

  orderProductIdCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.orderProductId,
    colId: InvoiceCompleteListColumns.orderProductId,
    field: model('orderProductId'),
    cellRendererFramework: AgCellTemplateComponent,
    width: 150
  };

  deliveryCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.delivery,
    colId: InvoiceCompleteListColumns.delivery,
    field: model('delivery'),
    valueFormatter: params => params.value?.id.toString(),
    cellRendererFramework: AgCellTemplateComponent,
    width: 110
  };

  invoiceCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.invoice,
    colId: InvoiceCompleteListColumns.invoice,
    field: model('invoice'),
    valueFormatter: params => params.value?.id.toString(),
    cellRendererFramework: AgCellTemplateComponent,
    width: 110
  };

  sellerInvoiceNoCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.sellerInvoiceNo,
    colId: InvoiceCompleteListColumns.sellerInvoiceNo,
    field: model('sellerInvoiceNo'),
    cellRendererFramework: AgCellTemplateComponent,
    width: 110
  };

  documentNoCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.documentNo,
    colId: InvoiceCompleteListColumns.documentNo,
    field: model('documentNo'),
    width: 110
  };

  customStatusCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.customStatus,
    colId: InvoiceCompleteListColumns.customStatus,
    field: model('customStatus'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  orderProductStatusCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.orderProductStatus,
    colId: InvoiceCompleteListColumns.orderProductStatus,
    field: model('orderProductStatus'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  buyerCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.buyer,
    colId: InvoiceCompleteListColumns.buyer,
    field: model('buyer'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  supplierCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.supplier,
    colId: InvoiceCompleteListColumns.supplier,
    field: model('buyer'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  orderPhysicalSupplierCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.orderPhysicalSupplier,
    colId: InvoiceCompleteListColumns.orderPhysicalSupplier,
    field: model('orderPhysicalSupplier'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  vesselCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.vessel,
    colId: InvoiceCompleteListColumns.vessel,
    field: model('vessel'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  vesselCodeCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.vesselCode,
    colId: InvoiceCompleteListColumns.vesselCode,
    field: model('vessel'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  carrierCompanyCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.carrierCompany,
    colId: InvoiceCompleteListColumns.carrierCompany,
    field: model('carrierCompany'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  paymentCompanyCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.paymentCompany,
    colId: InvoiceCompleteListColumns.paymentCompany,
    field: model('paymentCompany'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  portCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.port,
    colId: InvoiceCompleteListColumns.port,
    field: model('port'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  etaCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: CompleteListColumnsLabels.eta,
    colId: InvoiceCompleteListColumns.eta,
    field: model('eta'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  deliveryDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: CompleteListColumnsLabels.deliveryDate,
    colId: InvoiceCompleteListColumns.deliveryDate,
    field: model('deliveryDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  lineCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.line,
    colId: InvoiceCompleteListColumns.line,
    field: model('line'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  agreementTypeCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.agreementType,
    colId: InvoiceCompleteListColumns.agreementType,
    field: model('agreementType'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  productCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.product,
    colId: InvoiceCompleteListColumns.product,
    field: model('product'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  invoiceQuantityCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.invoiceQuantity,
    colId: InvoiceCompleteListColumns.invoiceQuantity,
    field: model('invoiceQuantity'),
    width: 110
  };

  priceCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.price,
    colId: InvoiceCompleteListColumns.price,
    field: model('price'),
    width: 110
  };

  invoiceProductAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.invoiceProductAmount,
    colId: InvoiceCompleteListColumns.invoiceProductAmount,
    field: model('invoiceProductAmount'),
    width: 110
  };

  sumOfCostsCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.sumOfCosts,
    colId: InvoiceCompleteListColumns.sumOfCosts,
    field: model('sumOfCosts'),
    width: 110
  };

  invoiceAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.invoiceAmount,
    colId: InvoiceCompleteListColumns.invoiceAmount,
    field: model('invoiceAmount'),
    width: 110
  };

  invoiceCurrencyCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.invoiceCurrency,
    colId: InvoiceCompleteListColumns.invoiceCurrency,
    field: model('invoiceCurrency'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  orderProductCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.orderProduct,
    colId: InvoiceCompleteListColumns.orderProduct,
    field: model('orderProduct'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  confirmedQuantityCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.confirmedQuantity,
    colId: InvoiceCompleteListColumns.confirmedQuantity,
    field: model('confirmedQuantity'),
    width: 110
  };

  finalQuantityAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.finalQuantityAmount,
    colId: InvoiceCompleteListColumns.finalQuantityAmount,
    field: model('finalQuantityAmount'),
    width: 110
  };

  orderPriceCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.orderPrice,
    colId: InvoiceCompleteListColumns.orderPrice,
    field: model('orderPrice'),
    width: 110
  };

  orderPriceCurrencyCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.orderPriceCurrency,
    colId: InvoiceCompleteListColumns.orderPriceCurrency,
    field: model('orderPriceCurrency'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  invoiceProductAmountInOrderCurrencyCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.invoiceProductAmountInOrderCurrency,
    colId: InvoiceCompleteListColumns.invoiceProductAmountInOrderCurrency,
    field: model('invoiceProductAmountInOrderCurrency'),
    width: 110
  };

  convertedCurrencyCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.convertedCurrency,
    colId: InvoiceCompleteListColumns.convertedCurrency,
    field: model('convertedCurrency'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  orderCostCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.orderCost,
    colId: InvoiceCompleteListColumns.orderCost,
    field: model('orderCost'),
    width: 110
  };

  orderProductAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.orderProductAmount,
    colId: InvoiceCompleteListColumns.orderProductAmount,
    field: model('orderProductAmount'),
    width: 110
  };

  totalOrderProductAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.totalOrderProductAmount,
    colId: InvoiceCompleteListColumns.totalOrderProductAmount,
    field: model('totalOrderProductAmount'),
    width: 110
  };

  orderAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.orderAmount,
    colId: InvoiceCompleteListColumns.orderAmount,
    field: model('orderAmount'),
    width: 110
  };

  orderCurrencyCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.orderCurrency,
    colId: InvoiceCompleteListColumns.orderCurrency,
    field: model('orderCurrency'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  dueDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: CompleteListColumnsLabels.dueDate,
    colId: InvoiceCompleteListColumns.dueDate,
    field: model('dueDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  workingDueDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: CompleteListColumnsLabels.workingDueDate,
    colId: InvoiceCompleteListColumns.workingDueDate,
    field: model('workingDueDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  approvedDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: CompleteListColumnsLabels.approvedDate,
    colId: InvoiceCompleteListColumns.approvedDate,
    field: model('approvedDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  accountNumberCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.accountNumber,
    colId: InvoiceCompleteListColumns.accountNumber,
    field: model('accountNumber'),
    width: 110
  };

  paymentDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: CompleteListColumnsLabels.paymentDate,
    colId: InvoiceCompleteListColumns.paymentDate,
    field: model('paymentDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  backOfficeCommentsCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: CompleteListColumnsLabels.backOfficeComments,
    colId: InvoiceCompleteListColumns.backOfficeComments,
    field: model('backOfficeComments'),
    width: 110
  };

  claimNoCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.claimNo,
    colId: InvoiceCompleteListColumns.claimNo,
    field: model('claimNo'),
    width: 110
  };

  claimDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: CompleteListColumnsLabels.claimDate,
    colId: InvoiceCompleteListColumns.claimDate,
    field: model('claimDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  claimStatusCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.claimStatus,
    colId: InvoiceCompleteListColumns.claimStatus,
    field: model('claimStatus'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  actualSettlementDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: CompleteListColumnsLabels.actualSettlementDate,
    colId: InvoiceCompleteListColumns.actualSettlementDate,
    field: model('actualSettlementDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  debunkerAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.debunkerAmount,
    colId: InvoiceCompleteListColumns.debunkerAmount,
    field: model('debunkerAmount'),
    width: 110
  };

  resaleAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.resaleAmount,
    colId: InvoiceCompleteListColumns.resaleAmount,
    field: model('resaleAmount'),
    width: 110
  };

  invoiceTypeCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.invoiceType,
    colId: InvoiceCompleteListColumns.invoiceType,
    field: model('invoiceType'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  receivedDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: CompleteListColumnsLabels.receivedDate,
    colId: InvoiceCompleteListColumns.receivedDate,
    field: model('receivedDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  sellerDueDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: CompleteListColumnsLabels.sellerDueDate,
    colId: InvoiceCompleteListColumns.sellerDueDate,
    field: model('sellerDueDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  orderStatusCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.orderStatus,
    colId: InvoiceCompleteListColumns.orderStatus,
    field: model('orderStatus'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  contractIdCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: CompleteListColumnsLabels.contractId,
    colId: InvoiceCompleteListColumns.contractId,
    field: model('contractId'),
    width: 110
  };

  productTypeCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.productType,
    colId: InvoiceCompleteListColumns.productType,
    field: model('productType'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  fuelPriceItemDescriptionCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: CompleteListColumnsLabels.fuelPriceItemDescription,
    colId: InvoiceCompleteListColumns.fuelPriceItemDescription,
    field: model('fuelPriceItemDescription'),
    width: 110
  };

  invoiceApprovalStatusCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: CompleteListColumnsLabels.invoiceApprovalStatus,
    colId: InvoiceCompleteListColumns.invoiceApprovalStatus,
    field: model('invoiceApprovalStatus'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private format: TenantFormattingService,
    private reconStatusLookups: ReconStatusLookup,
    private reportService: InvoiceCompleteService,
    private appErrorHandler: AppErrorHandler,
    private statusLookup: StatusLookup
  ) {
    super('invoice-complete-list-grid', columnPreferences, changeDetector, loggerFactory.createLogger(CompleteListGridViewModel.name));
    this.init(this.gridOptions, true);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.orderNoCol,
      this.orderProductIdCol,
      this.deliveryCol,
      this.invoiceCol,
      this.sellerInvoiceNoCol,
      this.documentNoCol,
      this.customStatusCol,
      this.orderProductStatusCol,
      this.buyerCol,
      this.supplierCol,
      this.orderPhysicalSupplierCol,
      this.vesselCol,
      this.vesselCodeCol,
      this.carrierCompanyCol,
      this.paymentCompanyCol,
      this.portCol,
      this.etaCol,
      this.deliveryDateCol,
      this.lineCol,
      this.agreementTypeCol,
      this.productCol,
      this.invoiceQuantityCol,
      this.priceCol,
      this.invoiceProductAmountCol,
      this.sumOfCostsCol,
      this.invoiceAmountCol,
      this.invoiceCurrencyCol,
      this.orderProductCol,
      this.confirmedQuantityCol,
      this.finalQuantityAmountCol,
      this.orderPriceCol,
      this.orderPriceCurrencyCol,
      this.invoiceProductAmountInOrderCurrencyCol,
      this.convertedCurrencyCol,
      this.orderCostCol,
      this.orderProductAmountCol,
      this.totalOrderProductAmountCol,
      this.orderAmountCol,
      this.orderCurrencyCol,
      this.dueDateCol,
      this.workingDueDateCol,
      this.approvedDateCol,
      this.accountNumberCol,
      this.paymentDateCol,
      this.backOfficeCommentsCol,
      this.claimNoCol,
      this.claimDateCol,
      this.claimStatusCol,
      this.actualSettlementDateCol,
      this.debunkerAmountCol,
      this.resaleAmountCol,
      this.invoiceTypeCol,
      this.receivedDateCol,
      this.sellerDueDateCol,
      this.orderStatusCol,
      this.contractIdCol,
      this.productTypeCol,
      this.fuelPriceItemDescriptionCol,
      this.invoiceApprovalStatusCol,
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.reportService.getReportsList$(transformLocalToServeGridInfo(this.gridApi, params, CompleteListColumnServerKeys, this.searchText))
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => params.successCallback(response.payload, response.matchedCount),
        () => {
          this.appErrorHandler.handleError(AppError.FailedToLoadMastersData('completed'));
          params.failCallback();
        });
  }

}
