import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warning',
  templateUrl: './no-data-popup.component.html',
  styleUrls: ['./no-data-popup.component.scss']
})
export class NoDataComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NoDataComponent>) {
    //dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
