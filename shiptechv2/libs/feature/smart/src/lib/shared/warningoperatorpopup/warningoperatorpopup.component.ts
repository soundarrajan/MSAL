import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warningoperatorpopup',
  templateUrl: './warningoperatorpopup.component.html',
  styleUrls: ['./warningoperatorpopup.component.scss']
})
export class WarningoperatorpopupComponent implements OnInit {

  public message : string;
  public id : any;
  public okayButton : boolean = false;
  public showActionBtn:boolean = true;
  constructor(public dialogRef: MatDialogRef<WarningoperatorpopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    //dialogRef.disableClose = true;
    this.message = data?.message;
    if(this.data?.id)
    this.id = data?.id;
    this.showActionBtn = (this.data?.hideActionbtn)? false: true;
    if(this.data?.okayButton)
    this.okayButton = this.data?.okayButton;
  }

  ngOnInit(): void {
  }

}
