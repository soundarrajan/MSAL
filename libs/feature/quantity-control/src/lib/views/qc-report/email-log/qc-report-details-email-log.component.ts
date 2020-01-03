import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'shiptech-qc-report-details-email-log',
  templateUrl: './qc-report-details-email-log.component.html',
  styleUrls: ['./qc-report-details-email-log.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QcReportDetailsEmailLogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
