import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'shiptech-invoice-type-selection',
  templateUrl: './invoice-type-selection.component.html',
  styleUrls: ['./invoice-type-selection.component.css']
})
export class InvoiceTypeSelectionComponent implements OnInit {
  invoiceType:string;
  invoiceList:any;
  constructor(public dialogRef: MatDialogRef<InvoiceTypeSelectionComponent>,@Inject(MAT_DIALOG_DATA) public receiveData: any) {  }

  ngOnInit(): void {
    this.invoiceList =[
      {value:1,name:"Provisional Invoice"},
      {value:2,name:"Final Invoice"},
      {value:3,name:"Credit Note"},
      {value:4,name:"Debit Note"},
      {value:5,name:"Pre-claim credit note"},
      {value:1,name:"Pre-claim debit note"},
    ];
  }
 
 closeDialog(){
  this.dialogRef.close('close');
 }
}
