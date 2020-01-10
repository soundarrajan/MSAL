import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { QcDocumentsListGridViewModel } from "./view-model/qc-documents.grid.view-model";

@Component({
  selector: "shiptech-qc-report-details-documents",
  templateUrl: "./qc-report-details-documents.component.html",
  styleUrls: ["./qc-report-details-documents.component.css"],
  providers: [QcDocumentsListGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QcReportDetailsDocumentsComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();

  constructor(public gridViewModel: QcDocumentsListGridViewModel) {
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
