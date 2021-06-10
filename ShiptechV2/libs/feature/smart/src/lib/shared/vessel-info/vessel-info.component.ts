import { Component, OnInit, AfterViewInit, Output, EventEmitter, ViewChild, Input, ViewEncapsulation, ViewChildren } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { SaveBunkeringPlanState } from "./../../store/bunker-plan/bunkering-plan.state";
import { ISaveVesselData } from "./../../store/shared-model/vessel-data-model";
import { LocalService } from '../../services/local-service.service';
import { BunkeringPlanService } from '../../services/bunkering-plan.service';
import { saveVesselDataAction } from "./../../store/bunker-plan/bunkering-plan.action";
import { CommentsComponent } from '../comments/comments.component';

import { BunkeringPlanCommentsService } from "../../services/bunkering-plan-comments.service";

import { BunkeringPlanComponent } from '../bunkering-plan/bunkering-plan.component';
import { WarningComponent } from '../warning/warning.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { SaveCurrentROBAction, UpdateCurrentROBAction, GeneratePlanAction, SaveScrubberReadyAction, ImportGsisAction, GeneratePlanProgressAction, SendPlanAction, 
         ImportGsisProgressAction, newVesselPlanAvailableAction } from './../../store/bunker-plan/bunkering-plan.action';
import { SaveCurrentROBState,GeneratePlanState } from '../../store/bunker-plan/bunkering-plan.state';
import { WarningoperatorpopupComponent } from '../warningoperatorpopup/warningoperatorpopup.component';
import moment  from 'moment';
import { Subject, Subscription, Observable } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-vessel-info',
  templateUrl: './vessel-info.component.html',
  styleUrls: ['./vessel-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VesselInfoComponent implements OnInit {

  @Select(SaveBunkeringPlanState.getVesselData) vesselData$: Observable<ISaveVesselData>;
  vesselRef: ISaveVesselData;
  @ViewChild(CommentsComponent) child: CommentsComponent;
  // @ViewChildren(CommentsComponent) children: CommentsComponent;
  @ViewChild(BunkeringPlanComponent) currentBplan;
  @Input('vesselData') public vesselData;
  @Input('vesselList') vesselList;
  @Input('selectedUserRole') selectedUserRole ;
  @Input() changeRole : Observable<void>;
  @Output() changeVessel = new EventEmitter();
  @Output() onDefaultViewChange = new EventEmitter();
  @Output() dontSendPlanReminder = new EventEmitter();
  private eventsSubscription : Subscription
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
  public statusCurr : any = '';
  public statusPrev : any = '';
  public shiptechRequestUrl :string = 'shiptechUrl/#/new-request/{{voyage_detail_id}}';
  public voyageDetailId: any;
  public selectedPort: any = [];
  public loadBplan : boolean = false;
  public changeCurrentROBObj$  = new Subject();
  public import_gsis : number = 0;
  public scrubberReady : any;
  public IsVesselhasNewPlan: boolean = false;
  public totalCommentCount: any = 0;
  BunkerPlanCommentList: any = [];
  RequestCommentList: any = [];
  public isChecked : boolean = false;
  public scrubberDate : any;
  currentROBChange: Subject<void> = new Subject<void>();
  subscription: Subscription;
 

  constructor(private store: Store, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private localService: LocalService, public dialog: MatDialog, private bunkerPlanService : BunkeringPlanService, public BPService: BunkeringPlanCommentsService) {
    iconRegistry.addSvgIcon(
      'info-icon',
      sanitizer.bypassSecurityTrustResourceUrl('./assets/customicons/info_amber.svg'));
      //Subscribe only once after getting different object model after 800ms
      this.subscription = this.vesselData$
      .pipe(
        debounceTime(800), 
        distinctUntilChanged()
      )
      .subscribe(data=> {
        this.vesselRef = data;
        // loadBunkerPlanComments fn callback to get BP comment count 
        if(this.vesselRef?.vesselId) {
          this.loadBunkerPlanComments();
          if(this.vesselData) {
            this.vesselData = Object.assign({vesselId : this.vesselRef?.vesselId, vesselRef:this.vesselRef});
            this.loadROBArbitrage();
          }
        }
      });
   }

  ngOnInit() {
    console.log('Vessel Data ',this.vesselData)
    this.eventsSubscription = this.changeRole.subscribe(()=> this.currentBplan.triggerRefreshGrid(this.selectedUserRole));
    this.loadBunkerPlanHeader(this.vesselData);  
    let vesseldata = this.store.selectSnapshot(SaveBunkeringPlanState.getVesselData)
    this.loadBunkerPlanDetails(vesseldata.vesselRef);   
    //trigger unsubscribe to avoid memory leakage
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  validateOnlyInt(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
    
  loadBunkerPlanComments() {
    let payload = { "shipId": this.vesselRef?.vesselId,"BunkerPlanNotes": [ ] }
    
    this.BPService.getBunkerPlanComments(payload).subscribe((response)=> {
      this.BunkerPlanCommentList = response?.payload;
      this.loadRequestComments();
    })   
  }
  loadRequestComments() {
    let payload = this.vesselRef?.vesselId;
    this.BPService.getRequestComments(payload).subscribe((response)=> {
      console.log('Request Comments count...', response?.payload);
      this.RequestCommentList = response?.payload;
      this.totalCommentCount = (this.BunkerPlanCommentList?.length? this.BunkerPlanCommentList?.length: 0)
      +(this.RequestCommentList?.length? this.RequestCommentList?.length: 0);
      let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
      titleEle.click();
      
    })
  }
  public loadBunkerPlanHeader(event) {
    let vesselId = event.id? event.id: 348;
    this.localService.getBunkerPlanHeader(vesselId).subscribe((data)=> {
      console.log('bunker plan header',data);
      this.bunkerPlanHeaderDetail = (data?.payload && data?.payload.length)? data.payload[0]: {};
      this.vesselData = this.bunkerPlanHeaderDetail;
      this.scrubberDate = this.bunkerPlanHeaderDetail?.scrubberDate;
      this.scrubberDate = (this.scrubberDate!='null' && this.scrubberDate.indexOf('2050')==-1)? this.scrubberDate: false;
      
      //handle scrubberDate formate : Convert "MMM D YYYY hh:mm" to "dd/mm/yyyy"
      // var arr = this.scrubberDate.split(' ');
      // var month = "";
      // var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      // var i = 0;
      // for (i; i < months.length; i++) {
      //     if (months[i] == arr[0]) {
      //         break;
      //     }
      // }
      // i++;
      // if (i >= 10) month = months[arr[0]]+1;
      // else month = "0" + i;
      // if(arr[2] < 10)
      // arr[2] = "0" + arr[2];
      // var formatddate = arr[2] + '/' + month + '/' + arr[3];
      // this.scrubberDate = formatddate;

      // this.loadROBArbitrage();
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
    let currentROBObj = {'3.5 QTY': null, '0.5 QTY': null, 'ULSFO': null, 'LSDIS': null, 'HSDIS': null, 'hsfoTankCapacity': null, 'ulsfoTankCapacity': null, 'lsdisTankCapacity': null, 'hsdisTankCapacity': null };
    currentROBObj['3.5 QTY'] = ROBArbitrageData?.hsfoCurrentStock;
    currentROBObj['0.5 QTY'] = ROBArbitrageData?.hsfO05CurrentStock;
    currentROBObj.ULSFO = ROBArbitrageData?.ulsfoCurrentStock;
    currentROBObj.LSDIS = ROBArbitrageData?.lsdisCurrentStock;
    currentROBObj.HSDIS = ROBArbitrageData?.hsdisCurrentStock;
    currentROBObj.hsfoTankCapacity = ROBArbitrageData?.hsfoTankCapacity;
    currentROBObj.ulsfoTankCapacity = ROBArbitrageData?.ulsfoTankCapacity;
    currentROBObj.lsdisTankCapacity = ROBArbitrageData?.lsdisTankCapacity;
    currentROBObj.hsdisTankCapacity = ROBArbitrageData?.hsdisTankCapacity;
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
    this.currentROBChange.next(column);
    event.stopPropagation();
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
      if(this.planId != null){
        this.statusCurrBPlan = this.currPlanIdDetails?.isPlanInvalid === 'N' ? true:false;
        this.statusCurr = this.currPlanIdDetails?.isPlanInvalid === 'Y' ? 'INVALID' : 'VALID';
        this.planDate = moment(this.currPlanIdDetails?.planDate).format('DD/MM/YYYY');
      }
      else {
        this.statusCurrBPlan = false;
        this.statusCurr = '';
        this.planDate = '';
      }
      
      this.loadBplan = true;
      // store vesselid and planid for shared ref
      this.store.dispatch(new saveVesselDataAction({'vesselId': request.shipId, 'planId': this.planId}));
      //to store HSFO header value
      this.scrubberReady = this.currPlanIdDetails?.isScrubberReady === 'Y' ? 'HSFO':'VLSFO';
      this.store.dispatch(new SaveScrubberReadyAction(this.scrubberReady));
      //to store isNewVesselPlanAvailable variable for shared ref
      this.store.dispatch(new newVesselPlanAvailableAction(this.currPlanIdDetails?.isNewVesselPlanAvailable));
    })
  }

  //Get Plan Id and Status Details for Previous Bunkering Plan
  loadPrevBunkeringPlan(request){
    this.loadBplan =false;
    this.bunkerPlanService.getBunkerPlanIdAndStatus(request).subscribe((data)=>{
      console.log('bunker plan Id and status details', data);
      this.prevPlanIdDetails = (data.payload && data.payload.length)? data.payload[0] : {};
      this.prevPlanId = this.prevPlanIdDetails?.planId;
      if(this.prevPlanId != null){
          if(this.currPlanIdDetails?.isPlanInvalid === 'Y'){
              this.statusPrevBPlan = this.prevPlanIdDetails?.isPlanInvalid === 'N' ? true:false ;
          }
          else{
              this.statusPrevBPlan = false;
          }
        this.statusPrev = this.prevPlanIdDetails?.isPlanInvalid === 'Y' ? 'INVALID' : 'VALID';
        this.prevPlanDate = moment(this.prevPlanIdDetails?.planDate).format('DD/MM/YYYY');
      }
      else{
        this.statusPrevBPlan = false;
        this.statusPrev = '';
        this.prevPlanDate = '';
      }
      this.loadBplan = true;
    })
  
  }

  changeVesselTrigger(event) {
    this.loadBunkerPlanHeader(event);
    this.loadBunkerPlanDetails(event);
    this.checkVesselHasNewPlan(event);
    this.store.dispatch(new GeneratePlanAction(0));
    this.store.dispatch(new ImportGsisAction(0));
    this.store.dispatch(new SendPlanAction(0));
  }
  TotalCommentCount(count: any) {
    this.totalCommentCount = count;
  }
  
  checkVesselHasNewPlan(event) {
    let vesselId = event?.id;
    this.localService.checkVesselHasNewPlan(vesselId).subscribe((data)=> {
      console.log('vessel has new plan',data);
      data = (data.payload?.length)? (data.payload)[0]: data.payload; 
      if(data.planCount>0) {
        this.IsVesselhasNewPlan = true;
      } else {
        this.IsVesselhasNewPlan = false;
      }
      this.changeVessel.emit({...event, IsVesselhasNewPlan: this.IsVesselhasNewPlan});
    })
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
    this.currentBplan.toggleSave();
  }

  sendCurrentBPlan(event){
    let req = {
      action:"",
      ship_id: this.vesselData?.vesselId,
      send_plan: 1
    }
    this.store.dispatch(new SendPlanAction(req.send_plan) )
    this.bunkerPlanService.saveBunkeringPlanDetails(req).subscribe((data)=> {
      console.log('Save status',data);
      if(data?.isSuccess == true){
        const dialogRef = this.dialog.open(WarningoperatorpopupComponent, {
          width: '350px',
          panelClass: 'confirmation-popup-operator',
          data: {message : 'Plan will send to vessel in a short while.'}
        });
      }
    })
    event.stopPropagation();
  }
  setImportGSIS(event){
    this.import_gsis = this.isChecked == false ? 1:0 ;
    this.store.dispatch(new ImportGsisAction(this.import_gsis))
    if(this.import_gsis == 1){
      let req = {
        action:"",
        ship_id: this.vesselData?.vesselId,
        generate_new_plan:this.store.selectSnapshot(GeneratePlanState.getGeneratePlan),
        import_gsis:this.import_gsis,
      } 
      this.bunkerPlanService.saveBunkeringPlanDetails(req).subscribe((data)=> {
        console.log('Import GSIS status',data);
      })
    }
    event.stopPropagation();
  }
  generateCurrentBPlan(event){
    let req = {
      action:"",
      ship_id: this.vesselData?.vesselId,
      generate_new_plan:1,
      import_gsis:this.import_gsis,
    }
    this.store.dispatch(new GeneratePlanAction(req.generate_new_plan));
    this.bunkerPlanService.saveBunkeringPlanDetails(req).subscribe((data)=> {
      console.log('Save status',data);
      this.checkVesselHasNewPlan(this.vesselData?.vesselRef);
      if(data?.isSuccess == true ){
      //if(data?.isSuccess == true && data?.payload[0]?.gen_in_progress == 0 && data?.payload[0]?.import_in_progress == 0){
        const dialogRef = this.dialog.open(WarningoperatorpopupComponent, {
          width: '350px',
          panelClass: 'confirmation-popup-operator',
          data: {message : 'Please wait, a new plan is getting generated for vessel ', id: req.ship_id}
        });
        this.store.dispatch(new GeneratePlanProgressAction(data.payload[0].gen_in_progress));
        this.store.dispatch(new ImportGsisProgressAction(data.payload[0].import_in_progress));
      }
      else if (data?.isSuccess == true && data?.payload[0]?.gen_in_progress == 1 && data?.payload[0]?.import_in_progress == 0){
        const dialogRef = this.dialog.open(WarningoperatorpopupComponent, {
          width: '350px',
          panelClass: 'confirmation-popup-operator',
          data: {message : 'Already a request to generate a new plan for this vessel is under process. Please wait'}
        });
        this.store.dispatch(new GeneratePlanAction(0));
        this.store.dispatch(new GeneratePlanProgressAction(data.payload[0].gen_in_progress));
        this.store.dispatch(new ImportGsisProgressAction(data.payload[0].import_in_progress));
      }
      else if(data.payload && data?.payload[0]?.import_in_progress == 1){
        const dialogRef = this.dialog.open(WarningoperatorpopupComponent, {
          width: '350px',
          panelClass: 'confirmation-popup-operator',
          data: {message : 'Please wait, GSIS import is under process'}
        })
        this.store.dispatch(new GeneratePlanAction(0));
        this.store.dispatch(new ImportGsisProgressAction(data.payload[0].import_in_progress));
      }
    })
    event.stopPropagation();
  }
  getVoyageDetail(selectedPort) {
    this.selectedPort = selectedPort;
  }
  createRequest() {
    let _this = this;
    console.log('selectedPort', this.selectedPort);
    let baseOrigin = new URL(window.location.href).origin;
    if(this.selectedPort.length > 1){
      this.selectedPort.forEach((port, index) => {
          _this.shiptechRequestUrl = `${baseOrigin}/#/new-request/${port.voyage_detail_id}`
          window.open(_this.shiptechRequestUrl, "_blank");

    });
    }
    else if(this.selectedPort.length == 1){
      let voyage_id = this.selectedPort[0].voyage_detail_id;
      let url = `${baseOrigin}/#/new-request/${voyage_id}` ;
      window.open(url, "_blank");
    }      
  }

  ngOnDestroy() {
    //unsubscribe to avoid memory leakage
    this.subscription.unsubscribe();
  }
  


}
