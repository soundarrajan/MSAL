import { Component, OnInit, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import { BunkeringPlanService } from '../../services/bunkering-plan.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { LocalService } from '../../services/local-service.service';
import { Select, Selector } from "@ngxs/store";
import { SaveBunkeringPlanState } from "./../../store/bunker-plan/bunkering-plan.state";
import { ISaveVesselData } from "./../../store/shared-model/vessel-data-model";
import { Observable, Subscription } from 'rxjs';
import moment from 'moment';


@Component({
  selector: 'app-all-bunkering-plan',
  templateUrl: './all-bunkering-plan.component.html',
  styleUrls: ['./all-bunkering-plan.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AllBunkeringPlanComponent implements OnInit {

  @Select(SaveBunkeringPlanState.getVesselData) vesselData$: Observable<ISaveVesselData>;
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
  inputModel = '';

  public countArray = [];//Temp Variable to store the count of accordions to be displayed
  public planId: any;
  public shipId: any;
  public bPlanType : any = 'A';
  public allBunkerPlanIds : any;
  subscription: Subscription;
  constructor(private localService: LocalService, private bunkerPlanService : BunkeringPlanService, public dialog: MatDialog) {}
  
  ngOnInit() {//Temp Variable to store the count of accordions to be displayed
    for (let i = 0; i < 20; i++) {
      this.countArray.push({ expanded: false });
    }
    this.subscription = this.vesselData$.subscribe(data=> {
      if(data?.vesselId) {
        this.vesselData = data?.vesselRef;
      }
    });
   this.loadBunkerPlanHistory(this.vesselData);
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
    let vesselObjFormat = Object.assign({}, event);
    delete Object.assign(vesselObjFormat, {['vesselId']: vesselObjFormat['id'] })['id'];
    this.vesselData = vesselObjFormat;
    this.changeVessel.emit(event);
  }
 
  public loadBunkerPlanHistory(event) {
    let vesselId = event.id? event.id: this.vesselData.vesselId;
    this.requestPayload = {'FromLogDate': this.defaultFromDate,'ToLogDate': this.selectedToDate,'VesselId': vesselId,'IsDefaultDate':false, 'PlanStatus': this.planStatus};
    this.localService.getBunkerPlanLog(this.requestPayload).subscribe((data)=> {
      console.log('bunker plan Log',data);
      this.bunkerPlanLogDetail = (data?.payload && data?.payload.length)? data.payload: {};
      let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
      titleEle.click();
    })
  }
  showViewAlert(isCellClicked) {
    if(isCellClicked?.type == "cellClicked") {
      console.log(isCellClicked);
      var overlay = document.querySelector('.cdk-overlay-container');
      overlay.classList.remove('removeOverlay');
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        panelClass: 'confirmation-popup-operator',// confirmation-popup',
        data: {message : 'A new Plan exists for this vessel. Cannot update an old Plan', source: 'vesselHardWarning'}
      });
    }
  }
  ngOnDestroy() {
    //unsubscribe to avoid memory leakage
    this.subscription.unsubscribe();
  }
}