import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AgGridDatetimePickerToggleComponent } from '../../../../../core/ag-grid/ag-grid-datetimePicker-Toggle';
// import { SpotnegoConfirmorderComponent } from '../spot-negotiation-popups/spotnego-confirmorder/spotnego-confirmorder.component';
// import { SpotnegoSendRfqComponent } from '../spot-negotiation-popups/spotnego-send-rfq/spotnego-send-rfq.component';

@Component({
  selector: 'app-spot-negotiation-home',
  templateUrl: './spot-negotiation-home.component.html',
  styleUrls: ['./spot-negotiation-home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpotNegotiationHomeComponent implements OnInit {
  navigationItems: any[];
  today = new FormControl(new Date());
  navBar: any;
  @ViewChild(AgGridDatetimePickerToggleComponent) child:AgGridDatetimePickerToggleComponent;

  constructor(private route: ActivatedRoute
    , public dialog: MatDialog
    , private toaster: ToastrService
    , private chRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.navBar = data.navBar;
    });
  }

  confirmorderpopup(){
    // const dialogRef = this.dialog.open(SpotnegoConfirmorderComponent, {
    //   width: '1045px',
    //   height: '555px',
    //   panelClass: 'additional-cost-popup'
    // });

    // dialogRef.afterClosed().subscribe(result => {
    // });

  }

  sendRFQpopup(){
    // const dialogRef = this.dialog.open(SpotnegoSendRfqComponent, {
    //   width: '600px',
    //   height: '220px',
    //   panelClass: 'additional-cost-popup'
    // });

    // dialogRef.afterClosed().subscribe(result => {
    // });

  }

  dateTimePicker(e){
    //alert("");
    e.stopPropagation();
    this.child.pickerOpen();
  }

  displaySuccessMsg(){
    this.toaster.show('<div class="message cust-msg">Successfully Duplicated to:</div><div class="requests"><span class="circle internal"></span><span class="label">Req 12322 - Afif</span><span class="circle external"></span><span class="label">Req 12323 - Al Mashrab</span></div>',
    '' , {
             enableHtml: true,
             toastClass: "toast-alert cust-alert toast-darkGrey",
             timeOut: 2000
         });
  }

}
