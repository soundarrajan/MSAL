import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BunkeringPlanService } from '../../services/bunkering-plan.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoDataComponent } from '../no-data-popup/no-data-popup.component';
import { LocalService } from '../../services/local-service.service';
import moment from 'moment';


@Component({
  selector: 'app-all-bunkering-plan',
  templateUrl: './all-bunkering-plan.component.html',
  styleUrls: ['./all-bunkering-plan.component.scss']
})
export class AllBunkeringPlanComponent implements OnInit {

  @Output() changeVessel = new EventEmitter();
  @Input('vesselData') vesselData;
  @Input('vesselList') vesselList;
  currentDate = new Date();
  defaultFromDate: Date = new Date(this.currentDate.setMonth((this.currentDate.getMonth())-1));
  selectedToDate: Date = new Date();
  
  isDateInvalid: boolean;
  planStatus = 'all';
  bunkerPlanLogDetail: any = [];
  requestPayload : any = {};

  public dialogRef: MatDialogRef<NoDataComponent>;
  public countArray = [];//Temp Variable to store the count of accordions to be displayed
  public planId: any;
  public bPlanType : any = 'A';
  public planIdDetails : any ={ planId : '777888', status: 'INP'};
  public allBunkerPlanIds : any;

  constructor(private localService: LocalService, private bunkerPlanService : BunkeringPlanService, public dialog: MatDialog) { }

  ngOnInit() {//Temp Variable to store the count of accordions to be displayed
    for (let i = 0; i < 20; i++) {
      this.countArray.push({ expanded: false });
    }
   // this.loadBunkeringPlanDetails();
   this.loadBunkerPlanHistory(this.vesselData);
  }
  
  public loadBunkeringPlanDetails(){
    let Id = '1'; //this.vesselData?.vesselId;
    let req = { shipId : Id ,  planStatus : 'A' }
    this.loadAllBunkeringPlan(req);
  }

  onFromToDateChange(event) {
    console.log('selected date', event);
    this.defaultFromDate = event.fromDate;
    this.selectedToDate = event.toDate;
    this.loadBunkerPlanHistory(this.vesselData);    
  }

  onStatusChange($event) {
    this.planStatus = $event.value;
    this.loadBunkerPlanHistory(this.vesselData);
  }

  changeVesselTrigger(event) {
    this.loadBunkerPlanHistory(event);
    this.changeVessel.emit(event);
  }
 
  public loadBunkerPlanHistory(event) {
    let vesselId = event.id? event.id: 348;
    this.requestPayload = {'FromLogDate': this.defaultFromDate,'ToLogDate': this.selectedToDate,'VesselId': vesselId,'IsDefaultDate':false, 'PlanStatus': this.planStatus};
    this.localService.getBunkerPlanLog(this.requestPayload).subscribe((data)=> {
      console.log('bunker plan Log',data);
      this.bunkerPlanLogDetail = (data?.payload && data?.payload.length)? data.payload: {};
    })
  }

  loadAllBunkeringPlan(request){
    this.bunkerPlanService.getBunkerPlanIdAndStatus(request).subscribe((data)=>{
      console.log('bunker plan Id and status details', data);
      this.allBunkerPlanIds = (data?.payload && data?.payload.length)? data.payload : '';
      if(this.allBunkerPlanIds == '' ){
        const dialogRef = this.dialog.open(NoDataComponent, {
          panelClass: ['confirmation-popup']
        });
      }
      else{
        this.allBunkerPlanIds.forEach(bplan => {
          bplan.planDate = moment(bplan?.planDate).format('DD/MM/YYYY');
          bplan.isPlanInvalid = bplan?.isPlanInvalid ==='N'? 'VALID' : 'INVALID';
        });
      }
     
    })
   
  }

}
import {
  Injector,
  Pipe,
  PipeTransform
} from '@angular/core';
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