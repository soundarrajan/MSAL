import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import {
  IColumnsMapping,
  KnownExportType
} from '@shiptech/core/ui/components/export/export-mapping';
import { ITypedColDef } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { EXPORT_API_SERVICE } from '@shiptech/core/ui/components/export/api/export-api.service';
import { IExportApiService } from '@shiptech/core/ui/components/export/api/export-api.service.interface';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'shiptech-export[exportModuleType][gridModel][serverKeys][gridId]',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportComponent implements OnInit, OnDestroy {
  @Input() hasEmailPreview: boolean = false;
  @Input() hasExportToExcel: boolean = true;
  @Input() hasExportToCsv: boolean = true;
  @Input() hasExportToPdf: boolean = true;
  @Input() hasExportToPrint: boolean = true;
  @Input() exportModuleType: string;
  @Input() private gridModel: BaseGridViewModel;
  @Input() private serverKeys: Record<string, string>;
  @Input() private gridId: string;

  private _destroy$ = new Subject();

  constructor(
    private tenantSettings: TenantSettingsService,
    @Inject(EXPORT_API_SERVICE) private exportApiService: IExportApiService,
    private _FileSaverService: FileSaverService
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

  exportTo(type: string): void {
    const serverParams = transformLocalToServeGridInfo(
      this.gridModel.gridApi,
      this.gridModel.paramsServerSide,
      this.serverKeys,
      this.gridModel.searchText
    );

    const requestToSend = {
      exportType: KnownExportType[type],
      SearchText: this.gridModel.searchText,
      Pagination: serverParams.pagination,
      columns: this.mapColumns(this.gridModel.getColumnsDefs()),
      timezone: this.tenantSettings.getGeneralTenantSettings().tenantFormats
        .timeZone.name,
      PageFilters: serverParams.pageFilters,
      SortList: serverParams.sortList
    };
    const url =
      'http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Invoice/api/invoice/export';
    this.exportApiService
      .exportDocument(url, requestToSend)
      .subscribe(result => {
        this._FileSaverService.save(result);
      });
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

  // openEmailPreview(): void {
  //   const gridApi = this.gridViewModel.gridOptions.api;
  //
  //   const selectedReports: TypedRowNode<IQcReportsListItemDto>[] =
  //     gridApi.getSelectedNodes() || [];
  //
  //   if (selectedReports.length !== 1) {
  //     this.toastr.warning('Please select one report.');
  //     return;
  //   }
  //
  //   this.reportService
  //     .previewEmail$(
  //       selectedReports[0].data.id,
  //       selectedReports[0].data.emailTransactionTypeId
  //     )
  //     .subscribe();
  // }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
