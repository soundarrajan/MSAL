import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { EmailLogsEntities } from "@shiptech/core/enums/email-logs-entities.enum";
import { KnownQuantityControlRoutes } from "../../../known-quantity-control.routes";
import { ActivatedRoute } from "@angular/router";

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

  constructor(route: ActivatedRoute) {
    this.reportId = route.snapshot.params[KnownQuantityControlRoutes.ReportIdParam];
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

    this._destroy$.next();
    this._destroy$.complete();
  }
}
