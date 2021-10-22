import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { GridOptions, IServerSideGetRowsParams } from '@ag-grid-community/core';
import {
  ITypedColDef,
  RowModelType,
  RowSelection
} from '@shiptech/core/ui/components/ag-grid/type.definition';

import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { takeUntil } from 'rxjs/operators';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';

import { DatabaseManipulation } from '@shiptech/core/legacy-cache/database-manipulation.service';
import { IScheduleDashboardLabelConfigurationDto } from '@shiptech/core/lookups/schedule-dashboard-label-configuration.dto.interface';
import { AgAsyncBackgroundFillComponent } from '@shiptech/core/ui/components/ag-grid/ag-async-background-fill/ag-async-background-fill.component';

import { ModuleLoggerFactory } from 'libs/feature/control-tower/src/lib/core/logging/module-logger-factory';
import { ControlTowerService } from 'libs/feature/control-tower/src/lib/services/control-tower.service';
import { ModuleError } from 'libs/feature/control-tower/src/lib/core/error-handling/module-error';
import { IControlTowerQuantitySupplyRobDifferenceItemDto } from 'libs/feature/control-tower/src/lib/services/api/dto/control-tower-list-item.dto';
import {
  ControlTowerQuantitySupplyDifferenceListColumns,
  ControlTowerQuantitySupplyDifferenceListColumnServerKeys,
  ControlTowerQuantitySupplyDifferenceListColumnsLabels
} from '../list-columns/control-tower-quantity-supply-difference-list.columns';

function model(
  prop: keyof IControlTowerQuantitySupplyRobDifferenceItemDto
): keyof IControlTowerQuantitySupplyRobDifferenceItemDto {
  return prop;
}

@Injectable()
export class ControlTowerQuantitySupplyDifferenceListGridViewModel extends BaseGridViewModel {
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
    getRowNodeId: (data: IControlTowerQuantitySupplyRobDifferenceItemDto) =>
      data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  orderNoCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.order,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.order,
    field: model('order'),
    cellRendererFramework: AgCellTemplateComponent,
    width: 200
  };

  orderProductIdCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.orderProductId,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.orderProductId,
    field: model('orderProductId'),
    cellRendererFramework: AgCellTemplateComponent,
    filter: 'agNumberColumnFilter',
    width: 150
  };

  deliveryCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.delivery,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.delivery,
    field: model('delivery'),
    valueFormatter: params => params.value?.id.toString(),
    cellRendererFramework: AgCellTemplateComponent,
    width: 110
  };

  invoiceCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.invoice,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.invoice,
    field: model('invoice'),
    valueFormatter: params => params.value?.id.toString(),
    cellRendererFramework: AgCellTemplateComponent,
    width: 110
  };

  documentNoCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.documentNo,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.documentNo,
    field: model('documentNo'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  customStatusCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.customStatus,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.customStatus,
    field: model('customStatus'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  buyerCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.buyer,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.buyer,
    field: model('buyer'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  supplierCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.supplier,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.supplier,
    field: model('buyer'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  vesselCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.vessel,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.vessel,
    field: model('vessel'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  carrierCompanyCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.carrierCompany,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.carrierCompany,
    field: model('carrierCompany'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  paymentCompanyCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.paymentCompany,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.paymentCompany,
    field: model('paymentCompany'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  agreementTypeCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.agreementType,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.agreementType,
    field: model('agreementType'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  portCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.port,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.port,
    field: model('port'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  etaCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    string
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.eta,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.eta,
    field: model('eta'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  deliveryDateCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    string
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.deliveryDate,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.deliveryDate,
    field: model('deliveryDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  lineCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.line,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.line,
    field: model('line'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  productCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.product,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.product,
    field: model('product'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  invoiceQuantityCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.invoiceQuantity,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.invoiceQuantity,
    field: model('invoiceQuantity'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  priceCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    number
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.price,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.price,
    field: model('price'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  sumOfCostsCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.sumOfCosts,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.sumOfCosts,
    field: model('sumOfCosts'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  invoiceAmountCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.invoiceAmount,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.invoiceAmount,
    field: model('invoiceAmount'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  confirmedQuantityCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.confirmedQuantity,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.confirmedQuantity,
    field: model('confirmedQuantity'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  orderPriceCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.orderPrice,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.orderPrice,
    field: model('orderPrice'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  orderAmountCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.orderAmount,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.orderAmount,
    field: model('orderAmount'),
    filter: 'agNumberColumnFilter',
    width: 110
  };

  invoiceStatusCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.invoiceStatus,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.invoiceStatus,
    field: model('invoiceStatus'),
    valueFormatter: params => params.value?.name,
    cellRendererFramework: AgAsyncBackgroundFillComponent,
    width: 110
  };

  dueDateCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    string
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.dueDate,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.dueDate,
    field: model('dueDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  workingDueDateCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    string
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.workingDueDate,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.workingDueDate,
    field: model('workingDueDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  approvedDateCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    string
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.approvedDate,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.approvedDate,
    field: model('approvedDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  paymentDateCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    string
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.paymentDate,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.paymentDate,
    field: model('paymentDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  backOfficeCommentsCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    string
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.backOfficeComments,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.backOfficeComments,
    field: model('backOfficeComments'),
    width: 110
  };

  receivedDateCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    string
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.receivedDate,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.receivedDate,
    field: model('receivedDate'),
    valueFormatter: params => this.format.date(params.value),
    width: 110
  };

  orderStatusCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.orderStatus,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.orderStatus,
    field: model('orderStatus'),
    valueFormatter: params => params.value?.name,
    cellRendererFramework: AgAsyncBackgroundFillComponent,
    width: 110
  };

  productTypeCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    ILookupDto
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.productType,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.productType,
    field: model('productType'),
    valueFormatter: params => params.value?.name,
    width: 110
  };

  invoiceApprovalStatusCol: ITypedColDef<
    IControlTowerQuantitySupplyRobDifferenceItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.invoiceApprovalStatus,
    colId:
      ControlTowerQuantitySupplyDifferenceListColumns.invoiceApprovalStatus,
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
    private controlTowerService: ControlTowerService,
    private appErrorHandler: AppErrorHandler,
    private databaseManipulation: DatabaseManipulation
  ) {
    super(
      'invoice-list-grid',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(
        ControlTowerQuantitySupplyDifferenceListGridViewModel.name
      )
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

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.paramsServerSide = params;
    this.exportUrl = this.controlTowerService.getControlTowerQuantitySupplyDifferenceListExportUrl();
    this.controlTowerService
      .getControlTowerQuantitySupplyDifferenceList$(
        transformLocalToServeGridInfo(
          this.gridApi,
          params,
          ControlTowerQuantitySupplyDifferenceListColumnServerKeys,
          this.searchText
        )
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response =>
          params.successCallback(response.payload, response.matchedCount),
        () => {
          this.appErrorHandler.handleError(
            ModuleError.LoadControlTowerQuantitySupplyDifferenceFailed
          );
          params.failCallback();
        }
      );
  }
}
