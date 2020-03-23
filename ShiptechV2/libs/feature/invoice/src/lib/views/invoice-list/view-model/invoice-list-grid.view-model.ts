import { ICompleteListItemDto } from '../../../services/api/dto/invoice-complete-list-item.dto';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
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
import { ModuleLoggerFactory } from '../../../../../../quantity-control/src/lib/core/logging/module-logger-factory';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { InvoiceCompleteService } from '../../../services/invoice-complete.service';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { takeUntil } from 'rxjs/operators';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { IInvoiceListItemDto } from '../../../services/api/dto/invoice-list-item.dto';
import { ModuleError } from '../../../core/error-handling/module-error';
import { DatabaseManipulation } from '@shiptech/core/legacy-cache/database-manipulation.service';
import { IScheduleDashboardLabelConfigurationDto } from '@shiptech/core/lookups/schedule-dashboard-label-configuration.dto.interface';
import { AgAsyncBackgroundFillComponent } from '@shiptech/core/ui/components/ag-grid/ag-async-background-fill/ag-async-background-fill.component';

function model(prop: keyof IInvoiceListItemDto): keyof IInvoiceListItemDto {
  return prop;
}

@Injectable()
export class InvoiceListGridViewModel extends BaseGridViewModel {
  public searchText: string;
  public exportUrl: string;
  public defaultColFilterParams = {
    resetButton: true,
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

  orderNoCol: ITypedColDef<IInvoiceListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.order,
    colId: InvoiceListColumns.order,
    field: model('order'),
    cellRendererFramework: AgCellTemplateComponent,
    width: 200
  };

  orderProductIdCol: ITypedColDef<IInvoiceListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.orderProductId,
    colId: InvoiceListColumns.orderProductId,
    field: model('orderProductId'),
    cellRendererFramework: AgCellTemplateComponent,
    filter: 'agNumberColumnFilter',
    width: 150
  };

  deliveryCol: ITypedColDef<IInvoiceListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.delivery,
    colId: InvoiceListColumns.delivery,
    field: model('delivery'),
    valueFormatter: params => params.value?.id.toString(),
    cellRendererFramework: AgCellTemplateComponent,
    width: 110
  };

  invoiceCol: ITypedColDef<IInvoiceListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.invoice,
    colId: InvoiceListColumns.invoice,
    field: model('invoice'),
    valueFormatter: params => params.value?.id.toString(),
    cellRendererFramework: AgCellTemplateComponent,
    width: 110
  };

  documentNoCol: ITypedColDef<IInvoiceListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.documentNo,
    colId: InvoiceListColumns.documentNo,
    field: model('documentNo'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  customStatusCol: ITypedColDef<IInvoiceListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.customStatus,
    colId: InvoiceListColumns.customStatus,
    field: model('customStatus'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  buyerCol: ITypedColDef<IInvoiceListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.buyer,
    colId: InvoiceListColumns.buyer,
    field: model('buyer'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  supplierCol: ITypedColDef<IInvoiceListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.supplier,
    colId: InvoiceListColumns.supplier,
    field: model('buyer'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  vesselCol: ITypedColDef<IInvoiceListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.vessel,
    colId: InvoiceListColumns.vessel,
    field: model('vessel'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  carrierCompanyCol: ITypedColDef<IInvoiceListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.carrierCompany,
    colId: InvoiceListColumns.carrierCompany,
    field: model('carrierCompany'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  paymentCompanyCol: ITypedColDef<IInvoiceListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.paymentCompany,
    colId: InvoiceListColumns.paymentCompany,
    field: model('paymentCompany'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  agreementTypeCol: ITypedColDef<IInvoiceListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.agreementType,
    colId: InvoiceListColumns.agreementType,
    field: model('agreementType'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  portCol: ITypedColDef<IInvoiceListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.port,
    colId: InvoiceListColumns.port,
    field: model('port'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  etaCol: ITypedColDef<IInvoiceListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.eta,
    colId: InvoiceListColumns.eta,
    field: model('eta'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  deliveryDateCol: ITypedColDef<IInvoiceListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.deliveryDate,
    colId: InvoiceListColumns.deliveryDate,
    field: model('deliveryDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  lineCol: ITypedColDef<IInvoiceListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.line,
    colId: InvoiceListColumns.line,
    field: model('line'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  productCol: ITypedColDef<IInvoiceListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.product,
    colId: InvoiceListColumns.product,
    field: model('product'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  invoiceQuantityCol: ITypedColDef<IInvoiceListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.invoiceQuantity,
    colId: InvoiceListColumns.invoiceQuantity,
    field: model('invoiceQuantity'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  priceCol: ITypedColDef<IInvoiceListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.price,
    colId: InvoiceListColumns.price,
    field: model('price'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  sumOfCostsCol: ITypedColDef<IInvoiceListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.sumOfCosts,
    colId: InvoiceListColumns.sumOfCosts,
    field: model('sumOfCosts'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  invoiceAmountCol: ITypedColDef<IInvoiceListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.invoiceAmount,
    colId: InvoiceListColumns.invoiceAmount,
    field: model('invoiceAmount'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  confirmedQuantityCol: ITypedColDef<IInvoiceListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.confirmedQuantity,
    colId: InvoiceListColumns.confirmedQuantity,
    field: model('confirmedQuantity'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  orderPriceCol: ITypedColDef<IInvoiceListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.orderPrice,
    colId: InvoiceListColumns.orderPrice,
    field: model('orderPrice'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  orderAmountCol: ITypedColDef<IInvoiceListItemDto, number> = {
    headerName: InvoiceListColumnsLabels.orderAmount,
    colId: InvoiceListColumns.orderAmount,
    field: model('orderAmount'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  invoiceStatusCol: ITypedColDef<
    IInvoiceListItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName: InvoiceListColumnsLabels.invoiceStatus,
    colId: InvoiceListColumns.invoiceStatus,
    field: model('invoiceStatus'),
    valueFormatter: params => params.value?.name,
    cellRendererFramework: AgAsyncBackgroundFillComponent,
    width: 110
  };

  dueDateCol: ITypedColDef<IInvoiceListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.dueDate,
    colId: InvoiceListColumns.dueDate,
    field: model('dueDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  workingDueDateCol: ITypedColDef<IInvoiceListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.workingDueDate,
    colId: InvoiceListColumns.workingDueDate,
    field: model('workingDueDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  approvedDateCol: ITypedColDef<IInvoiceListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.approvedDate,
    colId: InvoiceListColumns.approvedDate,
    field: model('approvedDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  paymentDateCol: ITypedColDef<IInvoiceListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.paymentDate,
    colId: InvoiceListColumns.paymentDate,
    field: model('paymentDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  backOfficeCommentsCol: ITypedColDef<IInvoiceListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.backOfficeComments,
    colId: InvoiceListColumns.backOfficeComments,
    field: model('backOfficeComments'),
    width: 110
  };

  receivedDateCol: ITypedColDef<IInvoiceListItemDto, string> = {
    headerName: InvoiceListColumnsLabels.receivedDate,
    colId: InvoiceListColumns.receivedDate,
    field: model('receivedDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  orderStatusCol: ITypedColDef<
    IInvoiceListItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName: InvoiceListColumnsLabels.orderStatus,
    colId: InvoiceListColumns.orderStatus,
    field: model('orderStatus'),
    valueFormatter: params => params.value?.name,
    cellRendererFramework: AgAsyncBackgroundFillComponent,
    width: 110
  };

  productTypeCol: ITypedColDef<IInvoiceListItemDto, ILookupDto> = {
    headerName: InvoiceListColumnsLabels.productType,
    colId: InvoiceListColumns.productType,
    field: model('productType'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  invoiceApprovalStatusCol: ITypedColDef<
    IInvoiceListItemDto,
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
    private appErrorHandler: AppErrorHandler,
    private databaseManipulation: DatabaseManipulation
  ) {
    super(
      'invoice-list-grid',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(InvoiceListGridViewModel.name)
    );
    this.init(this.gridOptions, true);
  }

  getColumnsDefs(): any[] {
    return [
      this.orderNoCol,
      this.orderProductIdCol,
      this.deliveryCol,
      this.invoiceCol,
      this.documentNoCol,
      this.customStatusCol,
      this.buyerCol,
      this.supplierCol,
      this.vesselCol,
      this.carrierCompanyCol,
      this.paymentCompanyCol,
      this.agreementTypeCol,
      this.portCol,
      this.etaCol,
      this.deliveryDateCol,
      this.lineCol,
      this.productCol,
      this.invoiceQuantityCol,
      this.priceCol,
      this.sumOfCostsCol,
      this.invoiceAmountCol,
      this.confirmedQuantityCol,
      this.orderPriceCol,
      this.orderAmountCol,
      this.invoiceStatusCol,
      this.dueDateCol,
      this.workingDueDateCol,
      this.approvedDateCol,
      this.paymentDateCol,
      this.backOfficeCommentsCol,
      this.receivedDateCol,
      this.orderStatusCol,
      this.productTypeCol,
      this.invoiceApprovalStatusCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public async getColorFromDashboard(
    columnId: number,
    transactionId: number
  ): Promise<void> {
    await this.databaseManipulation
      .getStatusColorFromDashboard(columnId, transactionId)
      .then((result: string) => result);
  }

  public getParameters(data: any): string {
    console.log(data);
    return 'red';
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.paramsServerSide = params;
    this.exportUrl = this.reportService.getInvoiceListExportUrl();
    this.reportService
      .getInvoiceList$(
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
          this.appErrorHandler.handleError(ModuleError.LoadInvoiceListFailed);
          params.failCallback();
        }
      );
  }
}
