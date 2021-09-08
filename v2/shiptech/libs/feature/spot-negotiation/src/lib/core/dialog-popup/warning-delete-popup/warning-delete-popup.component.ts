import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-warning-delete-popup',
  templateUrl: './warning-delete-popup.component.html',
  styleUrls: ['./warning-delete-popup.component.scss']
})
export class WarningDeletePopupComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<WarningDeletePopupComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { message: any; toastMsg: any }
  ) {}

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }

  proceed() {
    this.dialogRef.close();

    this.toastr.show(
      '<div class="image-placeholder"><span class="image"></span></div><div class="message">' +
        this.data.toastMsg +
        '</div>',
      '',
      {
        enableHtml: true,
        //closeButton: true,
        //disableTimeOut:true,
        toastClass: 'toast-alert toast-green', // toast-green, toast-amber, toast-red, toast-grey
        timeOut: 2000
      }
    );
  }
}
