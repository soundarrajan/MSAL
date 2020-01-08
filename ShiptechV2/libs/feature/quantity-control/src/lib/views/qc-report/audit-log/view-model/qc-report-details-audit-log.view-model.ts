import {BaseGridViewModel} from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import {ChangeDetectorRef, Injectable} from '@angular/core';
import {GridOptions, IServerSideGetRowsParams} from 'ag-grid-community';
import {ITypedColDef, RowModelType, RowSelection} from '@shiptech/core/ui/components/ag-grid/type.definition';
import {AgCellTemplateComponent} from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import {AgColumnPreferencesService} from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import {transformLocalToServeGridInfo} from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import {IDisplayLookupDto} from '@shiptech/core/lookups/display-lookup-dto.interface';
import {AppErrorHandler} from '@shiptech/core/error-handling/app-error-handler';
import {AppError} from '@shiptech/core/error-handling/app-error';
import {TenantFormattingService} from '@shiptech/core/services/formatting/tenant-formatting.service';
import {TenantSettingsModuleName} from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import {TenantSettingsService} from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import {IQcReportDetailsAuditLogItemDto} from "../../../../services/api/dto/qc-report-details-audit-log.dto";
import {
  QcReportDetailsAuditLogColumns, QcReportDetailsAuditLogColumnServerKeys,
  QcReportDetailsAuditLogColumnsLabels
} from "./qc-report-details-audit-log.columns";
import {ModuleLoggerFactory} from "../../../../core/logging/module-logger-factory";
import {QcReportService} from "../../../../services/qc-report.service";
import {IDeliveryTenantSettings} from "../../../../core/settings/delivery-tenant-settings";

function model(prop: keyof IQcReportDetailsAuditLogItemDto): keyof IQcReportDetailsAuditLogItemDto {
  return prop;
}

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
    cellRendererFramework: AgCellTemplateComponent
  };

  modulePathUrl: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.modulePathUrl,
    colId: QcReportDetailsAuditLogColumns.modulePathUrl,
    field: "modulePathUrl",
    cellRendererFramework: AgCellTemplateComponent
  };

  businessName: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.businessName,
    colId: QcReportDetailsAuditLogColumns.businessName,
    field: "businessName",
    cellRendererFramework: AgCellTemplateComponent
  };

  transactionType: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.transactionType,
    colId: QcReportDetailsAuditLogColumns.transactionType,
    field: "transactionType",
    cellRendererFramework: AgCellTemplateComponent
  };

  fieldName: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.fieldName,
    colId: QcReportDetailsAuditLogColumns.fieldName,
    field: "fieldName",
    cellRendererFramework: AgCellTemplateComponent
  };

  oldValue: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.oldValue,
    colId: QcReportDetailsAuditLogColumns.oldValue,
    field: "oldValue",
    cellRendererFramework: AgCellTemplateComponent
  };

  newValue: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.newValue,
    colId: QcReportDetailsAuditLogColumns.newValue,
    field: "newValue",
    cellRendererFramework: AgCellTemplateComponent
  };

  modifiedBy: ITypedColDef<IQcReportDetailsAuditLogItemDto, IDisplayLookupDto> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.modifiedBy,
    colId: QcReportDetailsAuditLogColumns.modifiedBy,
    field: "modifiedBy",
    cellRendererFramework: AgCellTemplateComponent
  };

  clientIpAddress: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.clientIpAddress,
    colId: QcReportDetailsAuditLogColumns.clientIpAddress,
    field: "clientIpAddress",
    cellRendererFramework: AgCellTemplateComponent
  };

  userAction: ITypedColDef<IQcReportDetailsAuditLogItemDto, string> = {
    headerName: QcReportDetailsAuditLogColumnsLabels.userAction,
    colId: QcReportDetailsAuditLogColumns.userAction,
    field: "userAction",
    cellRendererFramework: AgCellTemplateComponent
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
    private appErrorHandler: AppErrorHandler
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
    this.reportService.getReportsList$(transformLocalToServeGridInfo(params, QcReportDetailsAuditLogColumnServerKeys, this.searchText)).subscribe(
      response => params.successCallback(response.items, response.totalCount),
      () => {
        this.appErrorHandler.handleError(AppError.FailedToLoadMastersData('vessel'));
        params.failCallback();
      });
  }
}
