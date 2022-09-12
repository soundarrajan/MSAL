import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warning',
  templateUrl: './no-data-popup.component.html',
  styleUrls: ['./no-data-popup.component.scss']
})
export class NoDataComponent implements OnInit {
  public message : string;
  public id : any;
  constructor(public dialogRef: MatDialogRef<NoDataComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    //dialogRef.disableClose = true;
    this.message = data?.message;
    if(this.data?.id)
    this.id = data?.id;
  }

  ngOnInit() { 
  }

  close() {
    this.dialogRef.close();
  }
}
