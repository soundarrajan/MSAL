import { Component, OnInit, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import { LocalService } from '../../services/local-service.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import moment, { Moment, MomentFormatSpecification, MomentInput } from 'moment';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-bunkering-plan',
  templateUrl: './bunkering-plan.component.html',
  styleUrls: ['./bunkering-plan.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BunkeringPlanComponent implements OnInit {

  @Output() changeVessel = new EventEmitter();
  @Input('vesselData') vesselData;
  @Input('vesselList') vesselList;
  currentDate = new Date();
  defaultFromDate: Date = new Date(this.currentDate.setMonth((this.currentDate.getMonth())-3));
  selectedToDate: Date = new Date();
  
  isDateInvalid: boolean;
  fromLogDate : any;
  toLogDate : any;
  selectedStatus : any;
  planStatus = 'all';
  bunkerPlanLogDetail: any = [];
  requestPayload : any = {};

  public countArray = [];//Temp Variable to store the count of accordions to be displayed

  constructor(private localService: LocalService) { }
  private toastr: ToastrService;

  ngOnInit() {//Temp Variable to store the count of accordions to be displayed
    for (let i = 0; i < 20; i++) {
      this.countArray.push({ expanded: false });
    }
    
    let lastMonthDate = moment().subtract(1, 'months');
    this.fromLogDate = this.formatDateForBe(lastMonthDate);
    this.toLogDate = this.formatDateForBe(new Date());
  
    this.loadBunkerPlanHistory(this.vesselData);
  }

  onFromToDateChange(event) {
    console.log('selected date', event);
    
  }

  onDateChange($event, field) {
    if ($event.value) {
      let beValue = `${moment($event.value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
      if (field == 'fromLogDate') {
        this.isDateInvalid = false;
      } 
      this.fromLogDate = $event.value;
      this.loadBunkerPlanHistory(this.vesselData);
      console.log(beValue);
    } else {
      if (field == 'fromLogDate') {
        this.isDateInvalid = true;
      } 
      this.toastr.error('Please enter the correct format');
    }
  }

  onDateChange_to($event, field) {
    if ($event.value) {
      let beValue = `${moment($event.value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
      if (field == 'toLogDate') {
        this.isDateInvalid = false;
      } 
      this.toLogDate = $event.value;
      this.loadBunkerPlanHistory(this.vesselData);
      console.log(beValue);
    } else {
      if (field == 'toLogDate') {
        this.isDateInvalid = true;
      } 
      this.toastr.error('Please enter the correct format');
    }
  }

  onStatusChange($event) {
    this.planStatus = $event.value;
    this.loadBunkerPlanHistory(this.vesselData);
  }
​

  formatDateForBe(value) {
    if (value) {
      let beValue = `${moment(value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
      return `${moment(value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
    } else {
      return null;
    }
  }
 
  public loadBunkerPlanHistory(event) {
    let vesselId = event.id? event.id: 348;
    let pStatus = this.planStatus;
    this.requestPayload = {'FromLogDate': this.fromLogDate,'ToLogDate': this.toLogDate,'VesselId': 348,'IsDefaultDate':false, 'PlanStatus': 'all' };
    this.localService.getBunkerPlanLog(this.requestPayload).subscribe((data)=> {
      console.log('bunker plan Log',data);
      this.bunkerPlanLogDetail = (data?.payload && data?.payload.length)? data.payload: {};
    })
  }

}
import {
  Injector,
  Pipe,
  PipeTransform
} from '@angular/core';
import { last } from 'rxjs/operators';
@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  public constructor(private readonly injector: Injector) {
  }

  transform(value: Array<any>): any {
    if ((value.filter(e => e.expanded == true)).length == 0)
      return value.filter(e => e.expanded == false);
    else
      return value.filter(e => e.expanded == true);
  }
}