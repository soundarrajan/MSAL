import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subject } from 'rxjs';

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
  @Input() gridApi: any;
  private _destroy$ = new Subject();

  constructor() {}

  exportTo(type: number): void {
    // console.log(JSON.parse(localStorage.getItem('exportData')));
    console.log(this.gridApi);
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
