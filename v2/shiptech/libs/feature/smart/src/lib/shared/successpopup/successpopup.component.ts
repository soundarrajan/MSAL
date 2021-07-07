import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-successpopup',
  templateUrl: './successpopup.component.html',
  styleUrls: ['./successpopup.component.scss']
})
export class SuccesspopupComponent implements OnInit {

  public message : string;
  public id : any;
  constructor(public dialogRef: MatDialogRef<SuccesspopupComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    //dialogRef.disableClose = true;
    this.message = data?.message;
    if(this.data?.id)
    this.id = data?.id;
  }
  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close();
  }
}
