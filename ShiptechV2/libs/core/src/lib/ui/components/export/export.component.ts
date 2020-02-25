import {
  ChangeDetectionStrategy,
  Component,
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

@Component({
  selector: 'shiptech-export',
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
  @Input() gridColumns: any;
  @Input() gridModel: BaseGridViewModel;

  private _destroy$ = new Subject();

  constructor(private tenantSettings: TenantSettingsService) {}

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
      this.gridColumns,
      this.gridModel.searchText
    );

    const requestToSend = {
      exportType: KnownExportType[type],
      SearchText: this.gridModel.searchText,
      Pagination: serverParams.pagination,
      columns: this.mapColumns(this.gridColumns),
      dateTimeOffset: -120,
      timezone: this.tenantSettings.getGeneralTenantSettings().tenantFormats
        .timeZone.name,
      PageFilters: serverParams.pageFilters,
      SortList: serverParams.sortList
    };
  }

  print(): void {
    window.print();
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
