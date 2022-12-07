import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'shiptech-remove-counterparty-popup',
  templateUrl: './remove-counterparty-popup.component.html',
  styleUrls: ['./remove-counterparty-popup.component.scss']
})
export class RemoveCounterpartyPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RemoveCounterpartyPopupComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  clickNo(){
    this.dialogRef.close();
  }
  clickYes(){
    this.dialogRef.close({data:true});
  }
}
