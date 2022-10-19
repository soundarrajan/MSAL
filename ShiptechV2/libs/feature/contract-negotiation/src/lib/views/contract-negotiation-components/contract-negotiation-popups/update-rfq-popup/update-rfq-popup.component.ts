import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from '../../../../services/local-service.service';

@Component({
  selector: 'app-update-rfq-popup',
  templateUrl: './update-rfq-popup.component.html',
  styleUrls: ['./update-rfq-popup.component.scss']
})
export class UpdateRfqPopupComponent implements OnInit {

  constructor(
    private localService: LocalService,
    public router: Router,
    public dialogRef: MatDialogRef<UpdateRfqPopupComponent>,private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: {message:any,toastMsg:any}) { }

  ngOnInit() {
  }

  close(){
    this.dialogRef.close('close');
  }

  proceed(){
    this.dialogRef.close('close');
    this.localService.updateSendRFQStatus(true);
    this.toastr.show('<div class="image-placeholder"><span class="image"></span></div><div class="message">'+this.data.toastMsg+'</div>',
    '' , {
             enableHtml: true,
             toastClass: "toast-alert toast-green", // toast-green, toast-amber, toast-red, toast-grey
             timeOut: 2000
         });
  }

}