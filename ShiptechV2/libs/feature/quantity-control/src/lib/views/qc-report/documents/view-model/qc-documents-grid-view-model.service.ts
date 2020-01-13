import { ChangeDetectorRef, Injectable } from "@angular/core";
import { BaseGridViewModel } from "@shiptech/core/ui/components/ag-grid/base.grid-view-model";
import { GridOptions, IServerSideGetRowsParams } from "ag-grid-community";
import { ITypedColDef, RowModelType, RowSelection } from "@shiptech/core/ui/components/ag-grid/type.definition";
import { AgColumnPreferencesService } from "@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service";
import { ModuleLoggerFactory } from "../../../../core/logging/module-logger-factory";
import { TenantSettingsService } from "@shiptech/core/services/tenant-settings/tenant-settings.service";
import { TenantFormattingService } from "@shiptech/core/services/formatting/tenant-formatting.service";
import { QcReportService } from "../../../../services/qc-report.service";
import { AppErrorHandler } from "@shiptech/core/error-handling/app-error-handler";
import { transformLocalToServeGridInfo } from "@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters";
import { AppError } from "@shiptech/core/error-handling/app-error";
import { IDocumentsItemDto } from "@shiptech/core/services/masters-api/request-response-dtos/document.dto";
import { QcDocumentsListColumns, QcDocumentsListColumnServerKeys, QcDocumentsListColumnsLabels } from "./qc-documents-list.columns";
import { IAppState } from "@shiptech/core/store/states/app.state.interface";
import { Store } from "@ngxs/store";

function model(prop: keyof IDocumentsItemDto): keyof IDocumentsItemDto {
  return prop;
}

@Injectable()
export class QcDocumentsListGridViewModel extends BaseGridViewModel {

  private defaultColFilterParams = {
    clearButton: true,
    applyButton: true
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

    multiSortKey: "ctrl",

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: IDocumentsItemDto) => data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: "agTextColumnFilter",
      filterParams: this.defaultColFilterParams
    }
  };

  nameCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: QcDocumentsListColumnsLabels.name,
    colId: QcDocumentsListColumns.name,
    field: model("name"),
    width: 106
  };

  sizeCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: QcDocumentsListColumnsLabels.size,
    colId: QcDocumentsListColumns.size,
    field: model("size"),
    width: 129
  };

  fileTypeCol: ITypedColDef<IDocumentsItemDto, string> = {
    headerName: QcDocumentsListColumnsLabels.fileType,
    colId: QcDocumentsListColumns.fileType,
    field: model("fileType"),
    width: 150
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    tenantSettings: TenantSettingsService,
    private format: TenantFormattingService,
    private quantityControlService: QcReportService,
    private appErrorHandler: AppErrorHandler,
    private store: Store
  ) {
    super("quantity-control-documents-grid", columnPreferences, changeDetector, loggerFactory.createLogger(QcDocumentsListGridViewModel.name));
    this.init(this.gridOptions);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.nameCol,
      this.sizeCol,
      this.fileTypeCol
    ];
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    const emailTransactionTypeId = (<IAppState>this.store.snapshot()).quantityControl.report.details.emailTransactionTypeId;
    const reportId = (<IAppState>this.store.snapshot()).quantityControl.report.details.id;

    this.quantityControlService.getDocumentsList$(transformLocalToServeGridInfo(params, QcDocumentsListColumnServerKeys), emailTransactionTypeId, reportId).subscribe(
      response => params.successCallback(response.payload, response.matchedCount),
      () => {
        this.appErrorHandler.handleError(AppError.FailedToLoadMastersData("emails"));
        params.failCallback();
      });
  }
}
