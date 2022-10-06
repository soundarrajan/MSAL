import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<WarningComponent>) {
    //dialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}
