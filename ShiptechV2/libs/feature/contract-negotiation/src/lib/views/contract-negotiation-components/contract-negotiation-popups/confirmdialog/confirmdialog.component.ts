import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmdialog',
  templateUrl: './confirmdialogpopup.component.html',
  styleUrls: ['./confirmdialog.component.scss']
})
export class ConfirmdialogComponent implements OnInit {
  message: string;
  title?: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmdialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.message = this.data?.message;
    this.title = (this.data.title)?this.data.title:'Warning';
  }

  close() {
    this.dialogRef.close();
  }
  
}

  