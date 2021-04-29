import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BunkeringPlanService } from '../../services/bunkering-plan.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoDataComponent } from '../no-data-popup/no-data-popup.component';
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

  public dialogRef: MatDialogRef<NoDataComponent>;
  public countArray = [];//Temp Variable to store the count of accordions to be displayed
  public planId: any;
  public bPlanType : any = 'A';
  public planIdDetails : any ={ planId : '777888', status: 'INP'};
  public allBunkerPlanIds : any;

  constructor(private bunkerPlanService : BunkeringPlanService, public dialog: MatDialog) { }

  ngOnInit() {//Temp Variable to store the count of accordions to be displayed
    for (let i = 0; i < 20; i++) {
      this.countArray.push({ expanded: false });
    }
    this.loadBunkeringPlanDetails();
  }
  
  public loadBunkeringPlanDetails(){
    let Id = '02M'; //this.vesselData?.vesselId;
    let req = { shipId : Id ,  planStatus : 'A' }
    this.loadAllBunkeringPlan(req);
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