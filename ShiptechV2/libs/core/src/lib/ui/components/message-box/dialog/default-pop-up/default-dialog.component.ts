import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirmation-pop-up',
  templateUrl: './default-dialog.component.html',
  styleUrls: ['./default-dialog.component.scss']
})
export class DefaultDialogComponent implements OnInit {
  title: string = 'Default';
  message: string = 'This is an pop up?';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DefaultDialogComponent>) {}

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
