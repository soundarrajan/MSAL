import { Component, OnInit, Output, EventEmitter, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { LocalService } from '../../services/local-service.service';
import { BunkeringPlanService } from '../../services/bunkering-plan.service';
import { CommentsComponent } from '../comments/comments.component';
import { BunkeringPlanComponent } from '../bunkering-plan/bunkering-plan.component';
import { WarningComponent } from '../warning/warning.component';
import { AppConfig } from '@shiptech/core/config/app-config';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Store } from '@ngxs/store';
import { SaveCurrentROBAction, UpdateCurrentROBAction } from '../../store/bunker-plan/bunkering-plan.action';
import { SaveCurrentROBState } from '../../store/bunker-plan/bunkering-plan.state';
import { NoDataComponent } from '../no-data-popup/no-data-popup.component';
import moment  from 'moment';
import { RootLogger } from '@shiptech/core/logging/logger-factory.service';
import { AGGridCellDataComponent } from '../ag-grid/ag-grid-celldata.component';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-vessel-info',
  templateUrl: './vessel-info.component.html',
  styleUrls: ['./vessel-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VesselInfoComponent implements OnInit {

  @ViewChild(CommentsComponent) child;
  @ViewChild(BunkeringPlanComponent) currentBplan;
  @ViewChild(AGGridCellDataComponent) agGridCellData:AGGridCellDataComponent;
  @Input('vesselData') vesselData;
  @Input('vesselList') vesselList;
  @Input('selectedUserRole') selectedUserRole ;
  @Output() changeVessel = new EventEmitter();
  @Output() onDefaultViewChange = new EventEmitter();
  @Output() dontSendPlanReminder = new EventEmitter();
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
  public shiptechRequestUrl :string = 'shiptechUrl/#/new-request/{{voyage_detail_id}}';
  public voyageDetailId: any;
  public selectedPort: any = [];
  public loadBplan : boolean = false;
  public changeCurrentROBObj$  = new Subject();
  public import_gsis : number = 0;
  public scrubberReady : any;
  public changeSelectedUser : boolean = false;
 

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private localService: LocalService, public dialog: MatDialog, private bunkerPlanService : BunkeringPlanService,private appConfig: AppConfig, 
              private store: Store) {
    iconRegistry.addSvgIcon(
      'info-icon',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/customicons/info_amber.svg'));
   }

  ngOnInit() {
    console.log('Vessel Data ',this.vesselData)
    this.loadBunkerPlanHeader(this.vesselData);  
    this.loadBunkerPlanDetails(this.vesselData);
     
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
          let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
          titleEle.click();
          this.saveCurrentROB(this.ROBArbitrageData);
          
        })
      })
  }

  saveCurrentROB(ROBArbitrageData){
    let currentROBObj = {'3.5 QTY': null, '0.5 QTY': null, 'ULSFO': null, 'LSDIS': null, 'HSDIS': null };
    currentROBObj['3.5 QTY'] = ROBArbitrageData?.hsfoCurrentStock;
    currentROBObj['0.5 QTY'] = ROBArbitrageData?.hsfO05CurrentStock;
    currentROBObj.ULSFO = ROBArbitrageData?.ulsfoCurrentStock;
    currentROBObj.LSDIS = ROBArbitrageData?.lsdisCurrentStock;
    currentROBObj.HSDIS = ROBArbitrageData?.hsdisCurrentStock;
    this.store.dispatch(new SaveCurrentROBAction(currentROBObj))
    
  }
  ROBOnChange(event,value, column) {
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
    this.store.dispatch(new UpdateCurrentROBAction(value,column));
    console.log('Current ROB',this.store.selectSnapshot(SaveCurrentROBState.saveCurrentROB))
    event.stopPropagation();
    this.agGridCellData.updateSOA(value);
    this.bunkerPlanService.setchangeCurrentROBObj(true);
    /* This service only for Test purpose only. 
    need to build request payload by using column, value based on BE update*/
    // this.localService.updateROBArbitrageChanges({id:this.vesselData?.vesselId}).subscribe((data)=> {
    //   console.log('bunker plan header',data);
    //   this.ROBArbitrageData = (data?.payload && data?.payload.length)? data.payload[0]: {};
    // })
  }

  public loadBunkerPlanDetails(event){
     let Id = event.id? event.id: 348;
     let req = { shipId : Id ,  planStatus   : 'C' }
     this.loadCurrentBunkeringPlan(req);
     req = { shipId : Id ,  planStatus : 'P' }
     this.loadPrevBunkeringPlan(req);   
  }

  //Get Plan Id and Status Details for Current Bunkering Plan
  loadCurrentBunkeringPlan(request){
    this.loadBplan =false;
    this.bunkerPlanService.getBunkerPlanIdAndStatus(request).subscribe((data)=>{
      console.log('bunker plan Id and status details', data);
      this.currPlanIdDetails = (data.payload && data.payload.length)? data.payload[0] : {};
      this.planId = this.currPlanIdDetails?.planId;
      this.statusCurrBPlan = this.currPlanIdDetails?.isPlanInvalid === 'N' ? true:false;
      this.statusCurr = this.currPlanIdDetails?.isPlanInvalid === 'Y' ? 'INVALID' : 'VALID';
      this.planDate = moment(this.currPlanIdDetails?.planDate).format('DD/MM/YYYY');
      this.loadBplan = true;
      this.scrubberReady = this.currPlanIdDetails?.isScrubberReady === 'Y' ? 'HSFO':'VLSFO';
    })
  }

  //Get Plan Id and Status Details for Previous Bunkering Plan
  loadPrevBunkeringPlan(request){
    this.loadBplan =false;
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
      this.loadBplan = true;
    })
  
  }

  changeVesselTrigger(event) {
    this.loadBunkerPlanHeader(event);
    this.loadBunkerPlanDetails(event);
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
    //event.stopPropagation();
    this.expandBplan = !this.expandBplan;
    
  }
  togglePrevBPlan(event) {
    event.stopPropagation();
    this.expandPrevBPlan = !this.expandPrevBPlan;
    
  }
  changedUser(){
    this.changeSelectedUser = !this.changeSelectedUser;
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
    this.currentBplan.toggleSave();
  }

  sendCurrentBPlan(event){
    let req = {
      action:"",
      ship_id: this.vesselData?.vesselId,
      send_plan: 1
    }
    this.bunkerPlanService.saveBunkeringPlanDetails(req).subscribe((data)=> {
      console.log('Save status',data);
      if(data?.isSuccess == true){
        const dialogRef = this.dialog.open(NoDataComponent, {
          width: '350px',
          panelClass: 'confirmation-popup',
          data: {message : 'Plan will send to vessel in a short while.'}
        });
      }
    })
  }
  setImportGSIS(){
    this.import_gsis = this.import_gsis == 0? 1:0 ;
    let req = {
      action:"",
      ship_id: this.vesselData?.vesselId,
      generate_new_plan:1,
      import_gsis:this.import_gsis,
    }
    this.bunkerPlanService.saveBunkeringPlanDetails(req).subscribe((data)=> {
      if(data?.payload[0]?.import_in_progress == 1){
        const dialogRef = this.dialog.open(NoDataComponent, {
          width: '350px',
          panelClass: 'confirmation-popup',
          data: {message : 'Please wait, GSIS import is under process'}
        })
        this.import_gsis= 1;
      }
      else
      this.import_gsis = this.import_gsis == 0? 1:0 ;
    })
    
  }
  generateCurrentBPlan(event){
    let req = {
      action:"",
      ship_id: this.vesselData?.vesselId,
      generate_new_plan:1,
      import_gsis:this.import_gsis,
    }
    this.bunkerPlanService.saveBunkeringPlanDetails(req).subscribe((data)=> {
      console.log('Save status',data);
      if(data?.isSuccess == true && data?.payload[0]?.gen_in_progress == 0){
        const dialogRef = this.dialog.open(NoDataComponent, {
          width: '350px',
          panelClass: 'confirmation-popup',
          data: {message : 'Please wait, a new plan is getting generated for vessel ', ship_id: req.ship_id}
        });
        
      }
      else if (data?.isSuccess == true && data?.payload[0]?.gen_in_progress == 1){
        const dialogRef = this.dialog.open(NoDataComponent, {
          width: '350px',
          panelClass: 'gsis-popup',
          data: {message : 'Already a request to generate a new plan for this vessel is under process. Please wait'}
        });
      }
    })
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
          _this.shiptechRequestUrl.replace('shiptechUrl',_this.appConfig.v1.API.BASE_HEADER_FOR_NOTIFICATIONS)
          _this.shiptechRequestUrl.replace('{{voyage_detail_id}}', voyageId);
          window.open(_this.shiptechRequestUrl, "_blank");
        }
    });
    window.open(_this.appConfig.v1.API.BASE_HEADER_FOR_NOTIFICATIONS, "_blank");
  }
  


}
