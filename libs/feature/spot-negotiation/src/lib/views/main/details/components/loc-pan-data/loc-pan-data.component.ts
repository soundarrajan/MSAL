import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import _ from 'lodash';
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
  ETBdatetime = new FormControl(new Date());
  ETDdatetime = new FormControl(new Date());

  @Input() reqLocation: any;
  @Output() costChanged = new EventEmitter();

  title: string;
  deliveryFrom: string;
  deliveryTo: string;
  terminal: string;
  currentRequestSmallInfo: any;
  locationsRows: any;

  constructor(
    public dialog: MatDialog,
    private format: TenantFormattingService,
    public store: Store
  ) {}

  ngOnInit(): void {
    if (this.reqLocation.eta) {
      this.ETAdatetime = new FormControl(new Date(this.reqLocation.eta));
      this.ETBdatetime = new FormControl(new Date(this.reqLocation.etb));
      this.ETDdatetime = new FormControl(new Date(this.reqLocation.etd));
    }
    this.title = this.reqLocation.locationName;
    this.deliveryFrom = this.reqLocation.deliveryFrom;
    this.deliveryTo = this.reqLocation.deliveryTo;
    this.terminal = this.reqLocation.terminalName;
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
    this.store.subscribe(({ spotNegotiation, ...props }) => {
      this.locationsRows = spotNegotiation.locationsRows;
    });

    let currentLocationId = this.reqLocation.id;

    let filterLocationRows = _.filter(this.locationsRows);
    console.log(filterLocationRows);
    const dialogRef = this.dialog.open(ApplicablecostpopupComponent, {
      width: '1170px',
      height: 'auto',
      panelClass: 'additional-cost-popup',
      data: {
        reqLocation: this.reqLocation,
        sellers: filterLocationRows
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.costChanged.emit(filterLocationRows);
      }
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
