import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {QcReportDetailsAuditLogGridViewModel} from "./view-model/qc-report-details-audit-log.view-model";
import {Subject} from "rxjs";

@Component({
  selector: 'shiptech-qc-audit-log',
  templateUrl: './qc-report-details-audit-log.component.html',
  styleUrls: ['./qc-report-details-audit-log.component.css'],
  providers: [QcReportDetailsAuditLogGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QcReportDetailsAuditLogComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject();

  constructor(public gridViewModel: QcReportDetailsAuditLogGridViewModel) {
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
