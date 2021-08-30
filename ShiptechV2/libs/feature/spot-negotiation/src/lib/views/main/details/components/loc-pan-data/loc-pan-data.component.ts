import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { TenantFormattingService } from '../../../../../../../../../core/src/lib/services/formatting/tenant-formatting.service';
import { ApplicablecostpopupComponent } from '../spot-negotiation-popups/applicablecostpopup/applicablecostpopup.component';

@Component({
  selector: 'app-loc-pan-data',
  templateUrl: './loc-pan-data.component.html',
  styleUrls: ['./loc-pan-data.component.css']
})
export class LocPanDataComponent implements OnInit {
  showselectedETA: boolean = false;
  ETASelectDate = new FormControl(new Date());
  selectedETATime: any;
  ETASelectTime: any = '12:12';
  ETAdatetime = new FormControl(new Date());

  @Input() reqLocation: any;

  title: string;
  deliveryFrom: string;
  deliveryTo: string;
  terminal: string;

  constructor(
    public dialog: MatDialog,
    private format: TenantFormattingService
  ) {}

  ngOnInit(): void {
    this.title = this.reqLocation.locationName;
    this.deliveryFrom = this.reqLocation.deliveryFrom;
    this.deliveryTo = this.reqLocation.deliveryTo;
    this.terminal = this.reqLocation.terminal;
  }

  formatDate(date?: any) {
    if (date) {
      let currentFormat = this.format.dateFormat;
      let hasDayOfWeek;
      if (currentFormat.startsWith('DDD ')) {
        hasDayOfWeek = true;
        currentFormat = currentFormat.split('DDD ')[1];
      }
      currentFormat = currentFormat.replace(/d/g, 'D');
      currentFormat = currentFormat.replace(/y/g, 'Y');
      let elem = moment(date, 'YYYY-MM-DDTHH:mm:ss');
      let formattedDate = moment(elem).format(currentFormat);
      if (hasDayOfWeek) {
        formattedDate = `${moment(date).format('ddd')} ${formattedDate}`;
      }
      return formattedDate;
    }
  }

  additionalcostpopup() {
    const dialogRef = this.dialog.open(ApplicablecostpopupComponent, {
      width: '1170px',
      height: '211px',
      panelClass: 'additional-cost-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ETAMenuClosed(event) {
    //alert("");
    this.showselectedETA = true;
    //this.ETASelect = this.selectedETATime;
    //alert(this.ETASelectTime);
    this.ETASelectDate = this.selectedETATime.date;
    this.ETASelectTime = this.selectedETATime.time;
  }

  ETASelected() {
    //alert("");
    // this.showselectedETA = true;
    // //this.ETASelect = this.selectedETATime;
    // //alert(this.ETASelectTime);
    // this.ETASelectDate=this.selectedETATime.date;
    // this.ETASelectTime=this.selectedETATime.time;
  }

  doSomething(date: any): void {
    console.log('Picked date: ', date);
    this.selectedETATime = date;
  }
}
