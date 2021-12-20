import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'shiptech-invoice-type-selection',
  templateUrl: './invoice-type-selection.component.html',
  styleUrls: ['./invoice-type-selection.component.css']
})
export class InvoiceTypeSelectionComponent implements OnInit {
  invoiceType: string;
  invoiceList: any;
  canCreateFinalOrProvisionalInvoiceFlag: boolean;
  constructor(
    public dialogRef: MatDialogRef<InvoiceTypeSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public receiveData: any
  ) {}

  ngOnInit(): void {
    this.invoiceList = this.receiveData.lists;
    this.canCreateFinalOrProvisionalInvoiceFlag = this.receiveData.canCreateFinalOrProvisionalInvoiceFlag;
  }

  closeDialog() {
    this.dialogRef.close('close');
  }
  closeSelectedDialog() {
    this.dialogRef.close(this.invoiceType);
  }
}
