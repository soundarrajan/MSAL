
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { LocalService } from '../../../../services/local-service.service';
import { CreateContractRequestPopupComponent } from '../create-contract-request-popup/create-contract-request-popup.component';

@Component({
  selector: 'app-send-rfq-popup',
  templateUrl: './send-rfq-popup.component.html',
  styleUrls: ['./send-rfq-popup.component.scss']
})

export class SendRfqPopupComponent implements OnInit {

  showOpenNego:any;
  constructor(
    private localService: LocalService,
    public router: Router,
    public dialogRef: MatDialogRef<SendRfqPopupComponent>,private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: {message:any,toastMsg:any,createReqPopup:boolean}) { }

  ngOnInit() {
  }

  close(){
    if(this.showOpenNego){
      this.dialogRef.close('close');
    }
    this.showOpenNego = true;
    //this.dialogRef.close();
  }

  proceed(){
    this.dialogRef.close('close');
    console.log(this.data)
    if(!this.data.createReqPopup)
    this.localService.updateSendRFQStatus(true);
    this.toastr.show('<div class="image-placeholder"><span class="image"></span></div><div class="message">'+this.data.toastMsg+'</div>',
    '' , {
             enableHtml: true,
             //closeButton: true,
             //disableTimeOut:true,
             toastClass: "toast-alert toast-green", // toast-green, toast-amber, toast-red, toast-grey
             timeOut: 2000
         });
  }

  mainPage() {
    this.dialogRef.close('close');
    if (this.router.url.includes("buyer"))
      this.router.navigate(['shiptech/contractnegotiation/buyer/details', 12323]);
    else if (this.router.url.includes("approver")) {
      this.router.navigate(['shiptech/contractnegotiation/approver/details', 12323]);
    }
  }

}

