import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-operation-summary-withoutaddnew',
  templateUrl: './operation-summary-withoutaddnew.component.html',
  styleUrls: ['./operation-summary-withoutaddnew.component.scss']
})
export class OperationSummaryWithoutaddnewComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<OperationSummaryWithoutaddnewComponent>
  ) {}

  ngOnInit() {}
  closeDialog() {
    this.dialogRef.close();
  }
  tabledatas = [
    { Source: '123', SourceDoument: 'B/L ', Qty: '1000000', QtyUOM: 'BBL' },
    {
      Source: '234',
      SourceDoument: 'Gross Qty - B/L ',
      Qty: '1982000',
      QtyUOM: 'GAL'
    },
    {
      Source: 'Total',
      SourceDoument: 'Gross Qty - B/L ',
      Qty: '1982000',
      QtyUOM: 'GAL'
    },
    {
      Source: 'Gross',
      SourceDoument: 'Gross Qty - B/L ',
      Qty: '1982000',
      QtyUOM: 'GAL'
    }
  ];
}
