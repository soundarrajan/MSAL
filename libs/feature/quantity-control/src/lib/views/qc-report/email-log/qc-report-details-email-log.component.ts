import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { QcEmailLogsGridViewModel } from "./view-model/qc-email-logs-grid-view-model.service";
import { Subject } from "rxjs";

@Component({
  selector: "shiptech-qc-report-details-email-log",
  templateUrl: "./qc-report-details-email-log.component.html",
  styleUrls: ["./qc-report-details-email-log.component.css"],
  providers: [QcEmailLogsGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QcReportDetailsEmailLogComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();

  constructor(public gridViewModel: QcEmailLogsGridViewModel) {
  }

  ngOnInit(): void {
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
