import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateContractRequestPopupComponent } from '../contract-negotiation-popups/create-contract-request-popup/create-contract-request-popup.component';
import { Router } from "@angular/router";

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  public rfqSent:boolean = false;
  public isBuyer:boolean = true;
  constructor(public dialog: MatDialog,public router: Router) { }

  ngOnInit(): void {
    if (this.router.url.includes("buyer")){
      this.isBuyer = true;
    }else{
      this.isBuyer = false;
    }
  }

  createContractRequest(){
    const dialogRef = this.dialog.open(CreateContractRequestPopupComponent, {
      width: '1194px',
      minHeight: '90vh',
      maxHeight:'100vh',
      panelClass: ['additional-cost-popup', 'supplier-contact-popup'],
      data: {createReqPopup:true,rfqStatus: this.rfqSent}
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
