import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngxs/store";
import { IAppState } from "@shiptech/core/store/states/app.state.interface";
import { Subject } from "rxjs";

@Component({
  selector: "shiptech-qc-report-details-email-logs",
  templateUrl: "./qc-report-details-audit-logs.component.html",
  styleUrls: ["./qc-report-details-audit-logs.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QcReportDetailsAuditLogsComponent implements OnInit, OnDestroy {

  businessId: number;
  entityTransactionType: string;
  private _destroy$ = new Subject();

  constructor(private store: Store) {
    this.entityTransactionType = (<IAppState>this.store.snapshot()).quantityControl.report.details.entityTransactionType.displayName;
    this.businessId = (<IAppState>this.store.snapshot()).quantityControl.report.details.id;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

    this._destroy$.next();
    this._destroy$.complete();
  }
}
