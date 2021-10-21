import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rowstatus-onchange-quantityrobdiff-popup',
  templateUrl: './rowstatus-onchange-quantityrobdiff-popup.component.html',
  styleUrls: ['./rowstatus-onchange-quantityrobdiff-popup.component.css']
})
export class RowstatusOnchangeQuantityrobdiffPopupComponent implements OnInit {
  public switchTheme: boolean = true;
  public status;
  public New = 'New';
  constructor(
    public dialogRef: MatDialogRef<
      RowstatusOnchangeQuantityrobdiffPopupComponent
    >,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.status = 'New';
  }
  changeStatus(status) {
    //alert(status);
    this.status = status;
  }
  statusChanged() {
    this.dialogRef.close({ data: this.status });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
