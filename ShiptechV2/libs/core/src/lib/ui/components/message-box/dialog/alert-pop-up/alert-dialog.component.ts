import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirmation-pop-up',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {
  title: string = 'Alert';
  message: string = 'This is an alert pop up?';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AlertDialogComponent>) {}

  ngOnInit(): void {
    if (this.data) {
      this.title = this.data.title;
      this.message = this.data.message;
    }
  }

  closePopUp(): any {
    this.dialogRef.close();
  }
}
