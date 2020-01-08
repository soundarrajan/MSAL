import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {QcReportsListGridViewModel} from "../../qc-reports-list/view-model/qc-reports-list-grid.view-model";

@Component({
  selector: 'shiptech-qc-audit-log',
  templateUrl: './qc-report-details-audit-log.component.html',
  styleUrls: ['./qc-report-details-audit-log.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QcReportDetailsAuditLogComponent implements OnInit {

  constructor(public gridViewModel: QcReportsListGridViewModel) {
  }

  ngOnInit(): void {
  }
}
