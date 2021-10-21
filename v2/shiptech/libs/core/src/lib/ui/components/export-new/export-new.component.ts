import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import {
  IColumnsMapping,
  KnownExportType,
  KnownExportTypeLookupEnum
} from '@shiptech/core/ui/components/export/export-mapping';
import {
  ITypedColDef,
  TypedRowNode
} from '@shiptech/core/ui/components/ag-grid/type.definition';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { EXPORT_API_SERVICE } from '@shiptech/core/ui/components/export/api/export-api.service';
import { IExportApiService } from '@shiptech/core/ui/components/export/api/export-api.service.interface';
import { FileSaverService } from 'ngx-filesaver';
import { ModuleError } from '@shiptech/core/ui/components/export/error-handling/module-error';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { AppError } from '@shiptech/core/error-handling/app-error';
import { IQcReportsListItemDto } from '../../../../../../feature/quantity-control/src/lib/services/api/dto/qc-reports-list-item.dto';
import { ToastrService } from 'ngx-toastr';
import { QcReportService } from '../../../../../../feature/quantity-control/src/lib/services/qc-report.service';
import { Column } from '@ag-grid-enterprise/all-modules';
import jstz from 'jstz';

@Component({
  selector: 'shiptech-export-new[gridModel][serverKeys][gridId]',
  templateUrl: './export-new.component.html',
  styleUrls: ['./export-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportNewComponent implements OnInit, OnDestroy {
  exportType = KnownExportType;
  @Input() hasEmailPreview: boolean = false;
  @Input() hasExportToExcel: boolean = true;
  @Input() hasExportToCsv: boolean = true;
  @Input() hasExportToPdf: boolean = true;
  @Input() hasExportToPrint: boolean = true;
  @Input() private gridModel: BaseGridViewModel;
  @Input() private serverKeys: Record<string, string>;
  @Input() private gridId: string;
  private reportService: QcReportService;

  private _destroy$ = new Subject();

  constructor(
    private tenantSettings: TenantSettingsService,
    @Inject(EXPORT_API_SERVICE) private exportApiService: IExportApiService,
    private _FileSaverService: FileSaverService,
    private appErrorHandler: AppErrorHandler,
    private toastr: ToastrService,
    private injector: Injector
  ) {}

  mapColumns(gridColumns: ITypedColDef[]): IColumnsMapping[] {
    const arr = [];
    gridColumns.filter((item: ITypedColDef) => {
      arr.push({
        dtoPath: item.field,
        label: item.headerName
      });
    });
    return arr;
  }

  getModuleError(type: string): AppError {
    switch (type) {
      case KnownExportType.exportToExcel: {
        return ModuleError.ExportAsExcelFailed;
      }
      case KnownExportType.exportToCsv: {
        return ModuleError.ExportAsCsvFailed;
      }
      case KnownExportType.exportToPdf: {
        return ModuleError.ExportAsPdfFailed;
      }
      default:
        return ModuleError.ExportGeneralFailed;
    }
  }

  mapVisibleColumns(gridColumns: ITypedColDef[]): IColumnsMapping[] {
    const arr = [];
    gridColumns.filter((item: ITypedColDef) => {
      if (
        this.gridModel.gridColumnApi.getColumn(item.field) &&
        this.gridModel.gridColumnApi.getColumn(item.field).isVisible()
      ) {
        arr.push({
          dtoPath: item.dtoForExport ? item.dtoForExport : item.field,
          label: item.headerName
        });
      }
    });
    return arr;
  }

  exportTo(type: string): void {
    const serverParams = transformLocalToServeGridInfo(
      this.gridModel.gridApi,
      this.gridModel.paramsServerSide,
      this.serverKeys,
      this.gridModel.searchText
    );

    const timezone = jstz.determine();
    const dOffset = new Date().getTimezoneOffset();

    const requestToSend = {
      exportType: KnownExportTypeLookupEnum[type].type,
      SearchText: this.gridModel.searchText,
      Pagination: serverParams.pagination,
      columns: this.mapVisibleColumns(this.gridModel.getColumnsDefs()),
      dateTimeOffset: dOffset,
      timezone: timezone.name(),
      PageFilters: serverParams.pageFilters,
      SortList: serverParams.sortList
    };
    this.exportApiService
      .exportDocument(this.gridModel.exportUrl, requestToSend)
      .subscribe(
        result => {
          this._FileSaverService.save(result);
        },
        () => {
          this.appErrorHandler.handleError(this.getModuleError(type));
        }
      );
  }

  print(): void {
    document.getElementById(this.gridId).style.width = '';
    document.getElementById(this.gridId).style.height = '';
    this.gridModel.gridApi.setDomLayout('print');
    setTimeout(() => {
      window.print();
      document.getElementById(this.gridId).style.height =
        'calc( 100vh - 352px )';
      this.gridModel.gridApi.setDomLayout(null);
    }, 1000);
  }

  openEmailPreview(): void {
    const gridApi = this.gridModel.gridOptions.api;

    const selectedReports: TypedRowNode<IQcReportsListItemDto>[] =
      gridApi.getSelectedNodes() || [];

    if (selectedReports.length !== 1) {
      this.toastr.warning('Please select one report.');
      return;
    }

    // a condition could be put below in order to inject the neccesary service - for now only QC List has this functionality
    this.reportService = this.injector.get(QcReportService);
    this.reportService
      .previewEmail$(
        selectedReports[0].data.id,
        selectedReports[0].data.emailTransactionTypeId
      )
      .subscribe();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
