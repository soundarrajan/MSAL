import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngxs/store";
import { IAppState } from "@shiptech/core/store/states/app.state.interface";
import { Subject } from "rxjs";
import { EmailLogsEntities } from "@shiptech/core/enums/email-logs-entities.enum";

@Component({
  selector: "shiptech-qc-report-details-email-logs",
  templateUrl: "./qc-report-details-email-logs.component.html",
  styleUrls: ["./qc-report-details-email-logs.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QcReportDetailsEmailLogsComponent implements OnInit, OnDestroy {

  reportId: number;
  entityName = EmailLogsEntities.Report;
  private _destroy$ = new Subject();

  constructor(private store: Store) {
    this.reportId = (<IAppState>this.store.snapshot()).quantityControl.report.details.id;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

    this._destroy$.next();
    this._destroy$.complete();
  }
}
