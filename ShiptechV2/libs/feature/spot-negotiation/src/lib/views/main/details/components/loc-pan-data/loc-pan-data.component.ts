import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApplicablecostpopupComponent } from '../spot-negotiation-popups/applicablecostpopup/applicablecostpopup.component';

@Component({
  selector: 'app-loc-pan-data',
  templateUrl: './loc-pan-data.component.html',
  styleUrls: ['./loc-pan-data.component.css']
})
export class LocPanDataComponent implements OnInit {
  location1 = 'location1';
  showselectedETA: boolean = false;
  ETASelectDate = new FormControl(new Date());
  selectedETATime: any;
  ETASelectTime: any = '12:12';
  ETAdatetime = new FormControl(new Date());
  @Input() title: string;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

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
