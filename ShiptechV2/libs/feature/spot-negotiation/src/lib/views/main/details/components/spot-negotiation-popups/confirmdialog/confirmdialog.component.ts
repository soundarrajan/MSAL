import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import _ from 'lodash';
@Component({
  selector: 'app-confirmdialog',
  templateUrl: './confirmdialogpopup.component.html',
  styleUrls: ['./confirmdialog.component.scss']
})
export class ConfirmdialogComponent implements OnInit {
    message: string;
  sourceRef?: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmdialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {

  }

  ngOnInit() {
    this.message = this.data?.message;
    this.sourceRef = this.data?.source;
  }

  close() {
    this.dialogRef.close();
  }
    
  }
  
  