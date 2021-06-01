import { Component, OnInit, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import { BunkeringPlanService } from '../../services/bunkering-plan.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoDataComponent } from '../no-data-popup/no-data-popup.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { LocalService } from '../../services/local-service.service';
import moment from 'moment';


@Component({
  selector: 'app-all-bunkering-plan',
  templateUrl: './all-bunkering-plan.component.html',
  styleUrls: ['./all-bunkering-plan.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  inputModel = '';

  public dialogRef: MatDialogRef<NoDataComponent>;
  public countArray = [];//Temp Variable to store the count of accordions to be displayed
  public planId: any;
  public shipId: any;
  public bPlanType : any = 'A';
  public planIdDetails : any ={ planId : '777888', status: 'INP'};
  public allBunkerPlanIds : any;
  constructor(private localService: LocalService, private bunkerPlanService : BunkeringPlanService, public dialog: MatDialog) { }

  ngOnInit() {//Temp Variable to store the count of accordions to be displayed
    for (let i = 0; i < 20; i++) {
      this.countArray.push({ expanded: false });
    }
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
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        panelClass: 'confirmation-popup',
        data: {message : 'A new Plan exists for this vessel. Cannot update an old Plan', source: 'vesselHardWarning'}
      });
    }
  }
}