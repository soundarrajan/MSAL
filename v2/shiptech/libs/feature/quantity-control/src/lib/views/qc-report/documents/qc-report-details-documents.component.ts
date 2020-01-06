import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'shiptech-qc-report-details-documents',
  templateUrl: './qc-report-details-documents.component.html',
  styleUrls: ['./qc-report-details-documents.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QcReportDetailsDocumentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
