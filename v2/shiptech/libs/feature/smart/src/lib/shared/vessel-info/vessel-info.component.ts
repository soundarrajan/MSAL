import { Component, OnInit, Output, EventEmitter, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { LocalService } from '../../services/local-service.service';
import { BunkeringPlanService } from '../../services/bunkering-plan.service';
import { CommentsComponent } from '../comments/comments.component';
import { BunkeringPlanComponent } from '../bunkering-plan/bunkering-plan.component';
import { WarningComponent } from '../warning/warning.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import moment  from 'moment';


@Component({
  selector: 'app-vessel-info',
  templateUrl: './vessel-info.component.html',
  styleUrls: ['./vessel-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VesselInfoComponent implements OnInit {

  @ViewChild(CommentsComponent) child;
  @ViewChild(BunkeringPlanComponent) currentBplan;
  @Input('vesselData') vesselData;
  @Input('vesselList') vesselList;
  @Input('selectedUserRole') selectedUserRole ;
  @Output() changeVessel = new EventEmitter();
  @Output() onDefaultViewChange = new EventEmitter();
  @Output() dontSendPlanReminder = new EventEmitter();
  @Output() currentBPlanSave = new EventEmitter();
  currentROBObj = {'3.5 QTY': null, '0.5 QTY': null, 'ULSFO': null, 'LSDIS': null, 'HSDIS': null, }
  public enableCreateReq: boolean = false;
  public expandBplan: boolean = false;
  public expandComments: boolean = false;
  public expandPrevBPlan: boolean = false;
  public bunkerPlanHeaderDetail: any = {};
  public ROBArbitrageData: any;
  public step = 0;
  public dialogRef: MatDialogRef<WarningComponent>;
  public planId : any ;
  public prevPlanId : any ;
  public planDate : any;
  public prevPlanDate : any ;
  public currPlanIdDetails : any ;
  public prevPlanIdDetails : any ;
  public bPlanType : any = {curr : 'C', prev : 'P'};
  public statusCurrBPlan : boolean;
  public statusPrevBPlan : boolean;
  public statusCurr : any;
  public statusPrev : any;
  public shiptechRequestUrl :string = 'https://bvt.shiptech.com/#/new-request/{{voyage_detail_id}}';
  public voyageDetailId: any;
  public selectedPort: any = [];

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private localService: LocalService, public dialog: MatDialog, private bunkerPlanService : BunkeringPlanService) {
    iconRegistry.addSvgIcon(
      'info-icon',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/customicons/info_amber.svg'));
   }

  ngOnInit() {
    console.log('Vessel Data ',this.vesselData)
    this.loadBunkerPlanHeader(this.vesselData);  
    this.loadBunkerPlanDetails();
     
  }
  
  public loadBunkerPlanHeader(event) {
    let vesselId = event.id? event.id: 348;
    this.localService.getBunkerPlanHeader(vesselId).subscribe((data)=> {
      console.log('bunker plan header',data);
      this.bunkerPlanHeaderDetail = (data?.payload && data?.payload.length)? data.payload[0]: {};
      this.vesselData = this.bunkerPlanHeaderDetail;
      this.loadROBArbitrage();
      let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
          titleEle.click();
    })
  }

  public loadROBArbitrage() {
    let vesselId = this.vesselData?.vesselId;
    let requestPayload = {'shipId': vesselId, 'planStatus':'C'}
    
      this.localService.getBunkerPlanId(requestPayload).subscribe((data)=> {
        console.log('bunker plan id res',data);
        let bunkerPlanId = (data?.payload && data?.payload.length)? (data.payload)[0].planId: null;
        this.localService.loadROBArbitrage(bunkerPlanId).subscribe((data)=> {
          this.ROBArbitrageData = (data?.payload && data?.payload.length)? data.payload[0]: {};
        })
      })
  }

  ROBOnChange(value, column) {
    console.log(column, value); 
    switch (column) {
      case '3.5 QTY':
        this.currentROBObj['3.5 QTY'] = value;

        break;
        case '0.5 QTY':
        this.currentROBObj['0.5 QTY'] = value;
        
        break;
        case 'ULSFO':
        this.currentROBObj.ULSFO = value;
        
        break;
        case 'LSDIS':
        this.currentROBObj.LSDIS = value;
        
        break;
        case 'HSDIS':
        this.currentROBObj.HSDIS = value;
        
        break;
    
      default:
        break;
    }
    /* This service only for Test purpose only. 
    need to build request payload by using column, value based on BE update*/
    // this.localService.updateROBArbitrageChanges({id:this.vesselData?.vesselId}).subscribe((data)=> {
    //   console.log('bunker plan header',data);
    //   this.ROBArbitrageData = (data?.payload && data?.payload.length)? data.payload[0]: {};
    // })
  }
  SaveCurrntROB() { 
    /* This service only for Test purpose only. 
    need to build request payload by using column, value based on BE update*/
    let payload = this.currentROBObj;
    this.localService.updateROBArbitrageChanges(payload).subscribe((data)=> {
      console.log('bunker plan header',data);
      this.ROBArbitrageData = (data?.payload && data?.payload.length)? data.payload[0]: {};
    })
  }

  public loadBunkerPlanDetails(){
     let Id = 1;//this.vesselData?.vesselId;
     let req = { shipId : Id ,  planStatus   : 'C' }
     this.loadCurrentBunkeringPlan(req);
     req = { shipId : Id ,  planStatus : 'P' }
     this.loadPrevBunkeringPlan(req);   
  }

  //Get Plan Id and Status Details for Current Bunkering Plan
  loadCurrentBunkeringPlan(request){
    this.bunkerPlanService.getBunkerPlanIdAndStatus(request).subscribe((data)=>{
      console.log('bunker plan Id and status details', data);
      this.currPlanIdDetails = (data.payload && data.payload.length)? data.payload[0] : {};
      this.planId = this.currPlanIdDetails?.planId;
      this.statusCurrBPlan = this.currPlanIdDetails?.isPlanInvalid === 'N' ? true:false;
      this.statusCurr = this.currPlanIdDetails?.isPlanInvalid === 'Y' ? 'INVALID' : 'VALID';
      this.planDate = moment(this.currPlanIdDetails?.planDate).format('DD/MM/YYYY');
    })
  }

  //Get Plan Id and Status Details for Previous Bunkering Plan
  loadPrevBunkeringPlan(request){
    this.bunkerPlanService.getBunkerPlanIdAndStatus(request).subscribe((data)=>{
      console.log('bunker plan Id and status details', data);
      this.prevPlanIdDetails = (data.payload && data.payload.length)? data.payload[0] : {};
      this.prevPlanId = this.prevPlanIdDetails?.planId;
      if(this.currPlanIdDetails?.isPlanInvalid === 'Y')
          this.statusPrevBPlan = this.prevPlanIdDetails?.isPlanInvalid === 'N' ? true:false ;
      else
          this.statusPrevBPlan = false;
      this.statusPrev = this.currPlanIdDetails?.isPlanInvalid === 'Y' ? 'INVALID' : 'VALID';
      this.prevPlanDate = moment(this.prevPlanIdDetails?.planDate).format('DD/MM/YYYY');
    })
  
  }

  changeVesselTrigger(event) {
    this.loadBunkerPlanHeader(event);
    this.changeVessel.emit(event);
  }

  saveDefaultView(event) {
    this.onDefaultViewChange.emit(event);
  }  

  TriggerdontSendPlanReminder(event) {
    this.dontSendPlanReminder.emit(event);
  }  
    
  public toggleCreateReq(event) {
    this.enableCreateReq = event;
  }
  toggleComments(event) {
    event.stopPropagation();
    this.expandComments = !this.expandComments;
    this.child.toggleExpanded();
  }
  toggleBPlan(event) {
    event.stopPropagation();
    this.expandBplan = !this.expandBplan;
  }
  togglePrevBPlan(event) {
    event.stopPropagation();
    this.expandPrevBPlan = !this.expandPrevBPlan;
  }

  toggleAccordion(accord) {

  }
  togglecurrentBPlan(accord) {
    if (!this.currentBplan.gridChanged) {
      accord.expanded = false;
      this.expandBplan = false;
    }
    else {
      accord.expanded = true;
      const dialogRef = this.dialog.open(WarningComponent, {
        panelClass: ['confirmation-popup']

      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if (result == false) {
          this.currentBplan.gridChanged = false;
          this.localService.setBunkerPlanState(false);
          accord.expanded = false;
          this.expandBplan = false;
        }
        else
          accord.expanded = true;
      })
    }
  }

  saveCurrentBPlan(event) {
    this.currentBplan.gridChanged = false;
    this.localService.setBunkerPlanState(false);
    event.stopPropagation();
    this.currentBPlanSave.emit();
  }

  getVoyageDetail(selectedPort) {
    this.selectedPort = selectedPort;
  }
  createRequest() {
    let _this = this;
    console.log('selectedPort', this.selectedPort);
    this.selectedPort.forEach((port, index) => {
        if(port.voyage_detail_id) {
          let voyageId = (port.voyage_detail_id).toString();
          let requestUrl = _this.shiptechRequestUrl.replace('{{voyage_detail_id}}', voyageId);
          window.open(requestUrl, `win ${index}`);
        }
    });
  }


}
