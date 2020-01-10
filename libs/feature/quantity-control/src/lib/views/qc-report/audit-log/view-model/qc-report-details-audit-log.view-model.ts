import {BaseGridViewModel} from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import {ChangeDetectorRef, Injectable} from '@angular/core';
import {GridOptions, IServerSideGetRowsParams} from 'ag-grid-community';
import {ITypedColDef, RowModelType, RowSelection} from '@shiptech/core/ui/components/ag-grid/type.definition';
import {AgColumnPreferencesService} from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import {transformLocalToServeGridInfo} from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import {IDisplayLookupDto} from '@shiptech/core/lookups/display-lookup-dto.interface';
import {AppErrorHandler} from '@shiptech/core/error-handling/app-error-handler';
import {AppError} from '@shiptech/core/error-handling/app-error';
import {TenantFormattingService} from '@shiptech/core/services/formatting/tenant-formatting.service';
import {TenantSettingsModuleName} from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import {TenantSettingsService} from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import {IQcReportDetailsAuditLogItemDto} from "@shiptech/core/services/admin-api/dtos/audit-log.dto";
import {QcReportDetailsAuditLogColumns, QcReportDetailsAuditLogColumnServerKeys, QcReportDetailsAuditLogColumnsLabels} from "./qc-report-details-audit-log.columns";
import {ModuleLoggerFactory} from "../../../../core/logging/module-logger-factory";
import {QcReportService} from "../../../../services/qc-report.service";
import {IDeliveryTenantSettings} from "../../../../core/settings/delivery-tenant-settings";
import {IAppState} from "@shiptech/core/store/states/app.state.interface";
import {Store} from "@ngxs/store";
import {ServerQueryFilter} from "@shiptech/core/grid/server-grid/server-query.filter";

@Injectable()
export class QcReportDetailsAuditLogGridViewModel extends BaseGridViewModel {

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

    rowSelection: RowSelection.Single,
    suppressRowClickSelection: true,

    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: IQcReportDetailsAuditLogItemDto) => data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  date: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.date,
    colId: QcReportDetailsAuditLogColumns.date,
    field: "date",
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    width: 170
  };

  modulePathUrl: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.modulePathUrl,
    colId: QcReportDetailsAuditLogColumns.modulePathUrl,
    field: "modulePathUrl",
    width: 170
  };

  businessName: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.businessName,
    colId: QcReportDetailsAuditLogColumns.businessName,
    field: "businessName",
    width: 170
  };

  transactionType: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.transactionType,
    colId: QcReportDetailsAuditLogColumns.transactionType,
    field: "transactionType",
    width: 170
  };

  fieldName: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.fieldName,
    colId: QcReportDetailsAuditLogColumns.fieldName,
    field: "fieldName",
    width: 210
  };

  oldValue: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.oldValue,
    colId: QcReportDetailsAuditLogColumns.oldValue,
    field: "oldValue",
    width: 170
  };

  newValue: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.newValue,
    colId: QcReportDetailsAuditLogColumns.newValue,
    field: "newValue",
    width: 170
  };

  modifiedBy: ITypedColDef<IQcReportDetailsAuditLogItemDto, IDisplayLookupDto> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.modifiedBy,
    colId: QcReportDetailsAuditLogColumns.modifiedBy,
    field: "modifiedBy",
    valueFormatter: params => params.value?.name,
    width: 340
  };

  clientIpAddress: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.clientIpAddress,
    colId: QcReportDetailsAuditLogColumns.clientIpAddress,
    field: "clientIpAddress",
    width: 130
  };

  userAction: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.userAction,
    colId: QcReportDetailsAuditLogColumns.userAction,
    field: "userAction",
    width: 170
  };

  private readonly minToleranceLimit;
  private readonly maxToleranceLimit;

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    tenantSettings: TenantSettingsService,
    private format: TenantFormattingService,
    private reportService: QcReportService,
    private appErrorHandler: AppErrorHandler,
    private store: Store
  ) {
    super('quantity-control-report-details-audit-grid', columnPreferences, changeDetector, loggerFactory.createLogger(QcReportDetailsAuditLogGridViewModel.name));
    this.init(this.gridOptions, false);

    const deliveryTenantSettings = tenantSettings.getModuleTenantSettings<IDeliveryTenantSettings>(TenantSettingsModuleName.Delivery);
    this.minToleranceLimit = deliveryTenantSettings.minToleranceLimit;
    this.maxToleranceLimit = deliveryTenantSettings.maxToleranceLimit;
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.date,
      this.modulePathUrl,
      this.businessName,
      this.transactionType,
      this.fieldName,
      this.oldValue,
      this.newValue,
      this.modifiedBy,
      this.clientIpAddress,
      this.userAction
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    const entityTransactionType = (<IAppState>this.store.snapshot()).quantityControl.report.details.entityTransactionType;
    const reportId = (<IAppState>this.store.snapshot()).quantityControl.report.details.id;
    const filters: ServerQueryFilter[] = [
      {
        ColumnName: "BusinessId",
        Value: reportId.toString(10)
      },
      {
        ColumnName: "Transaction",
        Value: entityTransactionType.name
      }];
    this.reportService.getAuditLogList$(transformLocalToServeGridInfo(params, QcReportDetailsAuditLogColumnServerKeys, this.searchText, filters)).subscribe(
      response => params.successCallback(response.payload, response.matchedCount),
      () => {
        this.appErrorHandler.handleError(AppError.FailedToLoadMastersData('audit'));
        params.failCallback();
      });
  }
}
