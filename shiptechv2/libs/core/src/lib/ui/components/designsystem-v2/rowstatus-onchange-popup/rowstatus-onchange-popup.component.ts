import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Optional } from 'ag-grid-community';

@Component({
  selector: 'app-rowstatus-onchange-popup',
  templateUrl: './rowstatus-onchange-popup.component.html',
  styleUrls: ['./rowstatus-onchange-popup.component.css']
})
export class RowstatusOnchangePopupComponent implements OnInit {
  public switchTheme: boolean = true;
  public status;
  public New = 'New';
  constructor(
    public dialogRef: MatDialogRef<RowstatusOnchangePopupComponent>,
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
