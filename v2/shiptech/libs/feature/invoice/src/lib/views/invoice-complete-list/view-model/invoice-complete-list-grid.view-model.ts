import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { GridOptions, IServerSideGetRowsParams } from '@ag-grid-community/core';
import {
  ITypedColDef,
  RowModelType,
  RowSelection
} from '@shiptech/core/ui/components/ag-grid/type.definition';
import {
  InvoiceListColumns,
  InvoiceListColumnServerKeys,
  InvoiceListColumnsLabels
} from '../../view-model/invoice-list.columns';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { takeUntil } from 'rxjs/operators';
import { ICompleteListItemDto } from '../../../services/api/dto/invoice-complete-list-item.dto';
import { InvoiceCompleteService } from '../../../services/invoice-complete.service';
import { ModuleLoggerFactory } from 'libs/feature/quantity-control/src/lib/core/logging/module-logger-factory';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';
import { ModuleError } from '../../../core/error-handling/module-error';
import { AgAsyncBackgroundFillComponent } from '@shiptech/core/ui/components/ag-grid/ag-async-background-fill/ag-async-background-fill.component';
import { IScheduleDashboardLabelConfigurationDto } from '@shiptech/core/lookups/schedule-dashboard-label-configuration.dto.interface';

function model(prop: keyof ICompleteListItemDto): keyof ICompleteListItemDto {
  return prop;
}

@Injectable()
export class CompleteListGridViewModel extends BaseGridViewModel {
  public searchText: string;
  public paramsServerSide: IServerSideGetRowsParams;
  public exportUrl: string;
  public defaultColFilterParams = {
    clearButton: true,
    applyButton: true,
    precision: () => this.format.quantityPrecision
  };
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
    getRowNodeId: (data: ICompleteListItemDto) =>
      data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  orderNoCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.order,
    colId: InvoiceListColumns.order,
    field: model('order'),
    cellRendererFramework: AgCellTemplateComponent,
    width: 200
  };

  orderProductIdCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.orderProductId,
    colId: InvoiceListColumns.orderProductId,
    field: model('orderProductId'),
    cellRendererFramework: AgCellTemplateComponent,
    width: 150,
    filter: 'agNumberColumnFilter'
  };

  deliveryCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.delivery,
    colId: InvoiceListColumns.delivery,
    field: model('delivery'),
    valueFormatter: params => params.value?.id.toString(),
    cellRendererFramework: AgCellTemplateComponent,
    width: 110
  };

  invoiceCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.invoice,
    colId: InvoiceListColumns.invoice,
    field: model('invoice'),
    valueFormatter: params => params.value?.id.toString(),
    cellRendererFramework: AgCellTemplateComponent,
    width: 110
  };

  sellerInvoiceNoCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.sellerInvoiceNo,
    colId: InvoiceListColumns.sellerInvoiceNo,
    field: model('sellerInvoiceNo'),
    cellRendererFramework: AgCellTemplateComponent,
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  documentNoCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.documentNo,
    colId: InvoiceListColumns.documentNo,
    field: model('documentNo'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  customStatusCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.customStatus,
    colId: InvoiceListColumns.customStatus,
    field: model('customStatus'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  orderProductStatusCol: ITypedColDef<
    ICompleteListItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName: InvoiceListColumnsLabels.orderProductStatus,
    colId: InvoiceListColumns.orderProductStatus,
    field: model('orderProductStatus'),
    valueFormatter: params => params.value?.name,
    cellRendererFramework: AgAsyncBackgroundFillComponent,
    width: 110
  };

  buyerCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.buyer,
    colId: InvoiceListColumns.buyer,
    field: model('buyer'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  supplierCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.supplier,
    colId: InvoiceListColumns.supplier,
    field: model('buyer'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  orderPhysicalSupplierCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.orderPhysicalSupplier,
    colId: InvoiceListColumns.orderPhysicalSupplier,
    field: model('orderPhysicalSupplier'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  invoicePhysicalSupplierCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.invoicePhysicalSupplier,
    colId: InvoiceListColumns.invoicePhysicalSupplier,
    field: model('invoicePhysicalSupplier'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  vesselCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.vessel,
    colId: InvoiceListColumns.vessel,
    field: model('vessel'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  vesselCodeCol: ITypedColDef<ICompleteListItemDto, IStatusLookupDto> = {
    headerName: InvoiceListColumnsLabels.vesselCode,
    colId: InvoiceListColumns.vesselCode,
    field: model('vessel'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  carrierCompanyCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.carrierCompany,
    colId: InvoiceListColumns.carrierCompany,
    field: model('carrierCompany'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  paymentCompanyCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.paymentCompany,
    colId: InvoiceListColumns.paymentCompany,
    field: model('paymentCompany'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  portCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.port,
    colId: InvoiceListColumns.port,
    field: model('port'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  etaCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.eta,
    colId: InvoiceListColumns.eta,
    field: model('eta'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  deliveryDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.deliveryDate,
    colId: InvoiceListColumns.deliveryDate,
    field: model('deliveryDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  lineCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.line,
    colId: InvoiceListColumns.line,
    field: model('line'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  agreementTypeCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.agreementType,
    colId: InvoiceListColumns.agreementType,
    field: model('agreementType'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  productCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.product,
    colId: InvoiceListColumns.product,
    field: model('product'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  invoiceQuantityCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.invoiceQuantity,
    colId: InvoiceListColumns.invoiceQuantity,
    field: model('invoiceQuantity'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  priceCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.price,
    colId: InvoiceListColumns.price,
    field: model('price'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  invoiceProductAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.invoiceProductAmount,
    colId: InvoiceListColumns.invoiceProductAmount,
    field: model('invoiceProductAmount'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  sumOfCostsCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.sumOfCosts,
    colId: InvoiceListColumns.sumOfCosts,
    field: model('sumOfCosts'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  invoiceAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.invoiceAmount,
    colId: InvoiceListColumns.invoiceAmount,
    field: model('invoiceAmount'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  invoiceCurrencyCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.invoiceCurrency,
    colId: InvoiceListColumns.invoiceCurrency,
    field: model('invoiceCurrency'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  orderProductCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.orderProduct,
    colId: InvoiceListColumns.orderProduct,
    field: model('orderProduct'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  confirmedQuantityCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.confirmedQuantity,
    colId: InvoiceListColumns.confirmedQuantity,
    field: model('confirmedQuantity'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  finalQuantityAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.finalQuantityAmount,
    colId: InvoiceListColumns.finalQuantityAmount,
    field: model('finalQuantityAmount'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  orderPriceCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.orderPrice,
    colId: InvoiceListColumns.orderPrice,
    field: model('orderPrice'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  orderPriceCurrencyCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.orderPriceCurrency,
    colId: InvoiceListColumns.orderPriceCurrency,
    field: model('orderPriceCurrency'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  invoiceProductAmountInOrderCurrencyCol: ITypedColDef<
    ICompleteListItemDto,
    number
  > = {
    headerName: InvoiceListColumnsLabels.invoiceProductAmountInOrderCurrency,
    colId: InvoiceListColumns.invoiceProductAmountInOrderCurrency,
    field: model('invoiceProductAmountInOrderCurrency'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  convertedCurrencyCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.convertedCurrency,
    colId: InvoiceListColumns.convertedCurrency,
    field: model('convertedCurrency'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  orderCostCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.orderCost,
    colId: InvoiceListColumns.orderCost,
    field: model('orderCost'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  orderProductAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.orderProductAmount,
    colId: InvoiceListColumns.orderProductAmount,
    field: model('orderProductAmount'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  totalOrderProductAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.totalOrderProductAmount,
    colId: InvoiceListColumns.totalOrderProductAmount,
    field: model('totalOrderProductAmount'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  orderAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.orderAmount,
    colId: InvoiceListColumns.orderAmount,
    field: model('orderAmount'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  orderCurrencyCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.orderCurrency,
    colId: InvoiceListColumns.orderCurrency,
    field: model('orderCurrency'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  dueDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.dueDate,
    colId: InvoiceListColumns.dueDate,
    field: model('dueDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  workingDueDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.workingDueDate,
    colId: InvoiceListColumns.workingDueDate,
    field: model('workingDueDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  approvedDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.approvedDate,
    colId: InvoiceListColumns.approvedDate,
    field: model('approvedDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  accountNumberCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.accountNumber,
    colId: InvoiceListColumns.accountNumber,
    field: model('accountNumber'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  paymentDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.paymentDate,
    colId: InvoiceListColumns.paymentDate,
    field: model('paymentDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  backOfficeCommentsCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.backOfficeComments,
    colId: InvoiceListColumns.backOfficeComments,
    field: model('backOfficeComments'),
    width: 110
  };

  claimNoCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.claimNo,
    colId: InvoiceListColumns.claimNo,
    field: model('claimNo'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  claimDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.claimDate,
    colId: InvoiceListColumns.claimDate,
    field: model('claimDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  claimStatusCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.claimStatus,
    colId: InvoiceListColumns.claimStatus,
    field: model('claimStatus'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  actualSettlementDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.actualSettlementDate,
    colId: InvoiceListColumns.actualSettlementDate,
    field: model('actualSettlementDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  debunkerAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.debunkerAmount,
    colId: InvoiceListColumns.debunkerAmount,
    field: model('debunkerAmount'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  resaleAmountCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.resaleAmount,
    colId: InvoiceListColumns.resaleAmount,
    field: model('resaleAmount'),
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  invoiceTypeCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.invoiceType,
    colId: InvoiceListColumns.invoiceType,
    field: model('invoiceType'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  receivedDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.receivedDate,
    colId: InvoiceListColumns.receivedDate,
    field: model('receivedDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  sellerDueDateCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.sellerDueDate,
    colId: InvoiceListColumns.sellerDueDate,
    field: model('sellerDueDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  orderStatusCol: ITypedColDef<
    ICompleteListItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName: InvoiceListColumnsLabels.orderStatus,
    colId: InvoiceListColumns.orderStatus,
    field: model('orderStatus'),
    valueFormatter: params => params.value?.name,
    cellRendererFramework: AgAsyncBackgroundFillComponent,
    width: 110
  };

  invoiceStatusCol: ITypedColDef<
    ICompleteListItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName: InvoiceListColumnsLabels.invoiceStatus,
    colId: InvoiceListColumns.invoiceStatus,
    field: model('invoiceStatus'),
    valueFormatter: params => params.value?.name,
    cellRendererFramework: AgAsyncBackgroundFillComponent,
    width: 110
  };

  contractIdCol: ITypedColDef<ICompleteListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.contractId,
    colId: InvoiceListColumns.contractId,
    field: model('contractId'),
    cellRendererFramework: AgCellTemplateComponent,
    width: 110,
    filter: 'agNumberColumnFilter'
  };

  productTypeCol: ITypedColDef<ICompleteListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.productType,
    colId: InvoiceListColumns.productType,
    field: model('productType'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  fuelPriceItemDescriptionCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.fuelPriceItemDescription,
    colId: InvoiceListColumns.fuelPriceItemDescription,
    field: model('fuelPriceItemDescription'),
    width: 110
  };

  invoiceApprovalStatusCol: ITypedColDef<
    ICompleteListItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName: InvoiceListColumnsLabels.invoiceApprovalStatus,
    colId: InvoiceListColumns.invoiceApprovalStatus,
    field: model('invoiceApprovalStatus'),
    valueFormatter: params => params.value?.name,
    cellRendererFramework: AgAsyncBackgroundFillComponent,
    width: 110
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private format: TenantFormattingService,
    private reportService: InvoiceCompleteService,
    private appErrorHandler: AppErrorHandler
  ) {
    super(
      'invoice-complete-list-list-grid',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(CompleteListGridViewModel.name)
    );
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
      this.invoicePhysicalSupplierCol,
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
      this.invoiceApprovalStatusCol,
      this.contractIdCol,
      this.productTypeCol,
      this.fuelPriceItemDescriptionCol,
      this.invoiceStatusCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.paramsServerSide = params;
    this.exportUrl = this.reportService.getCompleteViewListExportUrl();
    this.reportService
      .getReportsList$(
        transformLocalToServeGridInfo(
          this.gridApi,
          params,
          InvoiceListColumnServerKeys,
          this.searchText
        )
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response =>
          params.successCallback(response.payload, response.matchedCount),
        () => {
          this.appErrorHandler.handleError(
            ModuleError.LoadInvoiceCompleteViewListFailed
          );
          params.failCallback();
        }
      );
  }
}
