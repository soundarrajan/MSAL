import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'shiptech-qc-audit-log',
  templateUrl: './qc-report-details-audit-log.component.html',
  styleUrls: ['./qc-report-details-audit-log.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QcReportDetailsAuditLogComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
