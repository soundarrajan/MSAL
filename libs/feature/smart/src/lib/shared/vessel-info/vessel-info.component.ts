import {
  Component,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  ViewChild,
  Input,
  ViewEncapsulation,
  ViewChildren
} from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { SaveBunkeringPlanState } from './../../store/bunker-plan/bunkering-plan.state';
import { ISaveVesselData } from './../../store/shared-model/vessel-data-model';
import { LocalService } from '../../services/local-service.service';
import { BunkeringPlanService } from '../../services/bunkering-plan.service';
import { saveVesselDataAction } from './../../store/bunker-plan/bunkering-plan.action';
import { CommentsComponent } from '../comments/comments.component';
import { VesselPopupService } from '../../services/vessel-popup.service';
import { BunkeringPlanCommentsService } from '../../services/bunkering-plan-comments.service';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { BunkeringPlanComponent } from '../bunkering-plan/bunkering-plan.component';
import { WarningComponent } from '../warning/warning.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import {
  SaveCurrentROBAction,
  UpdateCurrentROBAction,
  GeneratePlanAction,
  SaveScrubberReadyAction,
  ImportGsisAction,
  GeneratePlanProgressAction,
  SendPlanAction,
  ImportGsisProgressAction,
  newVesselPlanAvailableAction
} from './../../store/bunker-plan/bunkering-plan.action';
import {
  SaveCurrentROBState,
  GeneratePlanState
} from '../../store/bunker-plan/bunkering-plan.state';
import { WarningoperatorpopupComponent } from '../warningoperatorpopup/warningoperatorpopup.component';
import { SuccesspopupComponent } from '../successpopup/successpopup.component';
import moment from 'moment';
import { Subject, Subscription, forkJoin, Observable, timer } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

@Component({
  selector: 'app-vessel-info',
  templateUrl: './vessel-info.component.html',
  styleUrls: ['./vessel-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VesselInfoComponent implements OnInit {
  @Select(SaveBunkeringPlanState.getVesselData) vesselData$: Observable<
    ISaveVesselData
  >;
  vesselRef: ISaveVesselData;
  @ViewChild(CommentsComponent) child: CommentsComponent;
  // @ViewChildren(CommentsComponent) children: CommentsComponent;
  @ViewChild(BunkeringPlanComponent) currentBplan;
  @Input('vesselData') public vesselData;
  @Input('vesselList') vesselList;
  @Input('selectedUserRole') selectedUserRole;
  @Input() changeRole: Observable<void>;
  @Output() changeVessel = new EventEmitter();
  @Output() onDefaultViewChange = new EventEmitter();
  @Output() dontSendPlanReminder = new EventEmitter();
  private eventsSubscription: Subscription;
  currentROBObj = {
    '3.5 QTY': null,
    '0.5 QTY': null,
    ULSFO: null,
    LSDIS: null,
    HSDIS: null
  };
  changeUserRole: Subject<void> = new Subject<void>();
  public enableCreateReq: boolean = false;
  public expandBplan: boolean = false;
  public expandComments: boolean = false;
  public expandPrevBPlan: boolean = false;
  public bunkerPlanHeaderDetail: any = {};
  public ROBArbitrageData: any;
  public step = 0;
  public dialogRef: MatDialogRef<WarningComponent>;
  public planId: any;
  public prevPlanId: any;
  public planDate: any;
  public prevPlanDate: any;
  public currPlanIdDetails: any;
  public prevPlanIdDetails: any;
  public bPlanType: any = { curr: 'C', prev: 'P' };
  public statusCurrBPlan: boolean;
  public statusPrevBPlan: boolean;
  public statusCurr: any = '';
  public statusPrev: any = '';
  public shiptechRequestUrl: string =
    'shiptechUrl/#/new-request/{{voyage_detail_id}}';
  public voyageDetailId: any;
  public selectedPort: any = [];
  public loadBplan: boolean = false;
  public changeCurrentROBObj$ = new Subject();
  public import_gsis: number = 0;
  public scrubberReady: any;
  public IsVesselhasNewPlan: boolean = false;
  public totalCommentCount: any = 0;
  BunkerPlanCommentList: any = [];
  RequestCommentList: any = [];
  public isChecked: boolean = false;
  public scrubberDate: any;
  currentROBChange: Subject<void> = new Subject<void>();
  subscription: Subscription;
  public isLatestPlanInvalid: boolean = false;
  viewcurrentROBandArbitragedetails: boolean = false;
  viewcomments: boolean = false;
  viewcurrentBunkeringPlan: boolean = false;
  viewpreviousBunkeringPlan: boolean = false;
  myDefaultView: boolean = false;
  sendPlanReminder: boolean = false;
  disableCurrentBPlan: boolean = true;
  checkAutoPlanGenInProgress: boolean = false;
  BPlanGenTrigger = [];
  observableRef$;
  public hsfoRobClasses: any;
  public hsfo05RobClasses: any;
  public ulsfoRobClasses: any;
  public lsdisRobClasses: any;
  public hsdisRobClasses: any;
  offset:number;
  continueCheckingPlans: any;
  public hideFlag = 0 ;
  unsubscribeSignal: Subject<void> = new Subject();

  constructor(
    private store: Store,
    iconRegistry: MatIconRegistry,
    public vesselService: VesselPopupService,
    sanitizer: DomSanitizer,
    private localService: LocalService,
    public dialog: MatDialog,
    private bunkerPlanService: BunkeringPlanService,
    public BPService: BunkeringPlanCommentsService,
    private format: TenantFormattingService,
  ) {
    iconRegistry.addSvgIcon(
      'info-icon',
      sanitizer.bypassSecurityTrustResourceUrl(
        './assets/customicons/info_amber.svg'
      )
    );
    //Subscribe only once after getting different object model after 500ms
    this.subscription = this.vesselData$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(data => {
        this.vesselRef = data;
        // loadBunkerPlanComments fn callback to get BP comment count
        if (this.vesselRef?.vesselId) {
          this.loadBunkerPlanComments();
          if (this.vesselData) {
            this.vesselData = Object.assign({
              vesselId: this.vesselRef?.vesselId,
              vesselRef: this.vesselRef
            });
            this.loadROBArbitrage();
          }
        }
      });
    //Check if auto-plan generation is in progress on Initial Load of Plan
    this.checkAutoPlanGenInProgress = true;
    this.VesselHasNewPlanJob();

    this.localService.reCallVesselPlanReport$.subscribe(() => {
      this.hideFlag = 0;
      //this.VesselHasNewPlanJob();
    });
    this.localService.callSendValidBPlan$.subscribe(() => {
      this.sendValidBPlan();
    })
  }

  ngOnInit() {
    this.getDefaultView();
    this.offset = (new Date().getTimezoneOffset());
    // console.log('Vessel Data11111111111111 ',this.vesselData)
    this.eventsSubscription = this.changeRole
    .pipe(
      takeUntil(this.unsubscribeSignal.asObservable())
    )
    .subscribe(()=> this.currentBplan? this.currentBplan.triggerRefreshGrid(this.selectedUserRole):'');
    
    let vesseldata = this.store.selectSnapshot(SaveBunkeringPlanState.getVesselData)
    this.checkVesselHasNewPlan(vesseldata.vesselRef); 
   // this.getDefaultView();
    this.loadBunkerPlanHeader(vesseldata.vesselRef);  
    this.loadBunkerPlanDetails(vesseldata.vesselRef);   
    //trigger unsubscribe to avoid memory leakage
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  getDefaultView() {
    this.vesselService.myDefaultViewPayload = [];
    this.vesselService.APImyDefaultView = [];
    let req = { UserId: this.store.selectSnapshot(UserProfileState.userId) };
    this.vesselService.getmyDefaultview(req)
    .pipe(
      takeUntil(this.unsubscribeSignal.asObservable())
    )
    .subscribe(res => {
      // debugger;
      if (res.payload.length > 0) {
        this.vesselService.myDefaultViewPayload = res.payload[0];
      } else {
        if (this.vesselService.myDefaultViewPayload.length == 0) {
          this.vesselService.myDefaultViewPayload.userId = this.store.selectSnapshot(
            UserProfileState.userId
          );
          this.vesselService.myDefaultViewPayload.port = 0;
          this.vesselService.myDefaultViewPayload.vessel = 0;
          this.vesselService.myDefaultViewPayload.defaultView = 0;
          this.vesselService.myDefaultViewPayload.bunkerPlan = 0;
          this.vesselService.myDefaultViewPayload.portRemarks = 0;
          this.vesselService.myDefaultViewPayload.productAvailability = 0;
          this.vesselService.myDefaultViewPayload.bopsPrice = 0;
          this.vesselService.myDefaultViewPayload.portsAgents = 0;
          this.vesselService.myDefaultViewPayload.otherDetails = 0;
          this.vesselService.myDefaultViewPayload.vesselAlerts = 0;
          this.vesselService.myDefaultViewPayload.futureRequest = 0;
          this.vesselService.myDefaultViewPayload.vesselRedelivery = 0;
          this.vesselService.myDefaultViewPayload.vesselSchedule = 0;
          this.vesselService.myDefaultViewPayload.currentROBandArbitragedetails = 0;
          this.vesselService.myDefaultViewPayload.comments = 0;
          this.vesselService.myDefaultViewPayload.currentBunkeringPlan = 0;
          this.vesselService.myDefaultViewPayload.previousBunkeringPlan = 0;
        }
      }
      if (this.vesselService.myDefaultViewPayload) {
        if (this.vesselService.myDefaultViewPayload.bunkerPlan == 1) {
          this.vesselService.myDefaultViewPayload.defaultView = 1;
          this.vesselService.defaultView = true;

          if (
            this.vesselService.myDefaultViewPayload
              .currentROBandArbitragedetails == 1
          ) {
            this.vesselService.currentROBandArbitragedetails = true;
          }

          if (this.vesselService.myDefaultViewPayload.comments == 1) {
            this.vesselService.comments = true;
          }
          if (
            this.vesselService.myDefaultViewPayload.currentBunkeringPlan == 1
          ) {
            this.vesselService.currentBunkeringPlan = true;
          }
          if (
            this.vesselService.myDefaultViewPayload.previousBunkeringPlan == 1
          ) {
            this.vesselService.previousBunkeringPlan = true;
          }
        }
        this.vesselService.myDefaultViewPayload.vessel = 0;
        this.vesselService.myDefaultViewPayload.port = 0;
        this.vesselService.myDefaultViewPayload.bunkerPlan = 1;
      }
    });
  }

  validateOnlyInt(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Restrict enter on keypress
    if (charCode == 13) {
      event.preventDefault();
      return false;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  CheckDefaultView(event) {
    if (event) {
      this.vesselService.defaultView = true;
      this.vesselService.myDefaultViewPayload.defaultView = 1;
      if (this.vesselService.comments) {
        this.vesselService.myDefaultViewPayload.comments = 1;
      } else {
        this.vesselService.myDefaultViewPayload.comments = 0;
      }
      if (this.vesselService.currentROBandArbitragedetails) {
        this.vesselService.myDefaultViewPayload.currentROBandArbitragedetails = 1;
      } else {
        this.vesselService.myDefaultViewPayload.currentROBandArbitragedetails = 0;
      }
      if (this.vesselService.currentBunkeringPlan) {
        this.vesselService.myDefaultViewPayload.currentBunkeringPlan = 1;
      } else {
        this.vesselService.myDefaultViewPayload.currentBunkeringPlan = 0;
      }
      if (this.vesselService.previousBunkeringPlan) {
        this.vesselService.myDefaultViewPayload.previousBunkeringPlan = 1;
      } else {
        this.vesselService.myDefaultViewPayload.previousBunkeringPlan = 0;
      }
    } else {
      this.vesselService.defaultView = false;
      this.vesselService.myDefaultViewPayload.defaultView = 0;
      this.vesselService.comments = false;
      this.vesselService.currentROBandArbitragedetails = false;
      this.vesselService.currentBunkeringPlan = false;
      this.vesselService.previousBunkeringPlan = false;
      this.vesselService.myDefaultViewPayload.comments = 0;
      this.vesselService.myDefaultViewPayload.currentROBandArbitragedetails = 0;
      this.vesselService.myDefaultViewPayload.currentBunkeringPlan = 0;
      this.vesselService.myDefaultViewPayload.previousBunkeringPlan = 0;
    }
    this.vesselService.myDefaultViewPayload.vessel = 0;
    this.vesselService.myDefaultViewPayload.bunkerPlan = 1;
    this.vesselService.myDefaultViewPayload.port = 0;
  }

  public changeDefault(expandRef?: any) {
    switch (expandRef) {
      case 'commentsClose':
        this.vesselService.comments = false;
        this.vesselService.myDefaultViewPayload.comments = 0;
        break;
      case 'commentsOpen':
        this.vesselService.comments = true;
        if (this.vesselService.defaultView) {
          this.vesselService.myDefaultViewPayload.comments = 1;
        }
        break;
      case 'currentROBandArbitragedetailsClose':
        this.vesselService.currentROBandArbitragedetails = false;
        this.vesselService.myDefaultViewPayload.currentROBandArbitragedetails = 0;
        break;
      case 'currentROBandArbitragedetailsOpen':
        this.vesselService.currentROBandArbitragedetails = true;
        if (this.vesselService.defaultView) {
          this.vesselService.myDefaultViewPayload.currentROBandArbitragedetails = 1;
        }
        break;
      case 'currentBunkeringPlanOpen':
        this.vesselService.currentBunkeringPlan = true;
        this.statusCurrBPlan = true;
        if (this.vesselService.defaultView) {
          this.vesselService.myDefaultViewPayload.currentBunkeringPlan = 1;
        }
        this.loadROBArbitrage();
        break;
      case 'currentBunkeringPlanClose':
        this.vesselService.currentBunkeringPlan = false;
        this.statusCurrBPlan = false;
        this.vesselService.myDefaultViewPayload.currentBunkeringPlan = 0;
        break;
      case 'previousBunkeringPlanClose':
        this.vesselService.previousBunkeringPlan = false;
        this.vesselService.myDefaultViewPayload.previousBunkeringPlan = 0;
        break;
      case 'previousBunkeringPlanOpen':
        this.vesselService.previousBunkeringPlan = true;
        if (this.vesselService.defaultView) {
          this.vesselService.myDefaultViewPayload.previousBunkeringPlan = 1;
        }
        break;
    }
  }

  loadBunkerPlanComments() {
    // let payload = { "shipId": this.vesselRef?.vesselId,"BunkerPlanNotes": [ ] }
    let payload = this.vesselRef?.vesselId;
    // this.BPService.getBunkerPlanComments(payload).subscribe((response)=> {
    //   this.BunkerPlanCommentList = response?.payload;
    //   this.loadRequestComments();
    // })

    // forkjoin http calls to show count of BunkerPlanComment, RequestComment at same time
    let BunkerPlanComment = this.BPService.getBunkerPlanComments(payload);
    let RequestComment = this.BPService.getRequestComments(payload);
    forkJoin([BunkerPlanComment, RequestComment])
    .pipe(
      takeUntil(this.unsubscribeSignal.asObservable())
    )
    .subscribe(responseList => {
      this.BunkerPlanCommentList = responseList[0]?.payload;
      this.RequestCommentList = responseList[1]?.payload;

      this.totalCommentCount =
        (this.BunkerPlanCommentList?.length
          ? this.BunkerPlanCommentList.length
          : 0) +
        (this.RequestCommentList?.length ? this.RequestCommentList.length : 0);
      this.triggerTitleToBind();
    });
  }
  
  public loadBunkerPlanHeader(event) {
    let vesselId = event.id? event.id: 348; 
    this.localService.getBunkerPlanHeader(vesselId)
    .pipe(
      takeUntil(this.unsubscribeSignal.asObservable())
    )
    .subscribe((data)=> {
      this.bunkerPlanHeaderDetail = (data?.payload && data?.payload.length)? data.payload[0]: {};
      this.bunkerPlanHeaderDetail['lastPlanReceivedDate'] =this.format.dateOnly(this.bunkerPlanHeaderDetail['lastPlanReceivedDate']);
      this.bunkerPlanHeaderDetail['lastPlanSentDate'] =this.format.dateOnly(this.bunkerPlanHeaderDetail['lastPlanSentDate']);
      this.vesselData = this.bunkerPlanHeaderDetail;
      this.scrubberDate = this.bunkerPlanHeaderDetail?.scrubberDate;
      this.scrubberDate =
        this.scrubberDate != 'null' && this.scrubberDate.indexOf('2050') == -1
          ? this.scrubberDate
          : false;
      this.sendPlanReminder = this.bunkerPlanHeaderDetail?.dockPortFlag;

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
      let titleEle = document.getElementsByClassName(
        'page-title'
      )[0] as HTMLElement;
      titleEle.click();
    });
  }

  public loadROBArbitrage() {
    let vesselId = this.vesselData?.vesselId;
    let requestPayload = { shipId: vesselId, planStatus: 'C' };

    this.localService.getBunkerPlanId(requestPayload)
    .pipe(
      takeUntil(this.unsubscribeSignal.asObservable())
    )
    .subscribe(data => {
      let bunkerPlanId =
        data?.payload && data?.payload.length ? data.payload[0].planId : null;
      this.localService.loadROBArbitrage(bunkerPlanId)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable())
      )
      .subscribe(data => {
        this.ROBArbitrageData =
          data?.payload && data?.payload.length ? data.payload[0] : {};
        /* ROB Color classes - Start */
        this.hsfoRobClasses = this.getCurrentROBClasses('hsfoRobColor');
        this.hsfo05RobClasses = this.getCurrentROBClasses('vlsfoRobColor');
        this.ulsfoRobClasses = this.getCurrentROBClasses('ulsfoRobColor');
        this.lsdisRobClasses = this.getCurrentROBClasses('lsdisRobColor');
        this.hsdisRobClasses = this.getCurrentROBClasses('hsdisRobColor');
        /* ROB Color classes - End */
        let titleEle = document.getElementsByClassName(
          'page-title'
        )[0] as HTMLElement;
        titleEle.click();
        this.saveCurrentROB(this.ROBArbitrageData);
      });
    });
  }

  getCurrentROBClasses(productTypeColorKey) {
    return {
      'smart-operator': true,
      green:
        this.ROBArbitrageData &&
        this.ROBArbitrageData[productTypeColorKey] == 'G',
      brown:
        this.ROBArbitrageData &&
        this.ROBArbitrageData[productTypeColorKey] == 'B',
      magenta:
        this.ROBArbitrageData &&
        this.ROBArbitrageData[productTypeColorKey] == 'M'
    };
  }

  triggerTitleToBind() {
    let titleEle = document.getElementsByClassName(
      'page-title'
    )[0] as HTMLElement;
    titleEle.click();
  }

  saveCurrentROB(ROBArbitrageData) {
    let currentROBObj = {
      '3.5 QTY': null,
      '0.5 QTY': null,
      ULSFO: null,
      LSDIS: null,
      HSDIS: null,
      hsfoTankCapacity: null,
      ulsfoTankCapacity: null,
      lsdisTankCapacity: null,
      hsdisTankCapacity: null,
      upulsfo: null,
      uplsdis: null
    };
    currentROBObj['3.5 QTY'] = ROBArbitrageData?.hsfoCurrentStock;
    currentROBObj['0.5 QTY'] = ROBArbitrageData?.hsfO05CurrentStock;
    currentROBObj.ULSFO = ROBArbitrageData?.ulsfoCurrentStock;
    currentROBObj.LSDIS = ROBArbitrageData?.lsdisCurrentStock;
    currentROBObj.HSDIS = ROBArbitrageData?.hsdisCurrentStock;
    currentROBObj.hsfoTankCapacity = ROBArbitrageData?.hsfoTankCapacity;
    currentROBObj.ulsfoTankCapacity = ROBArbitrageData?.ulsfoTankCapacity;
    currentROBObj.lsdisTankCapacity = ROBArbitrageData?.lsdisTankCapacity;
    currentROBObj.hsdisTankCapacity = ROBArbitrageData?.hsdisTankCapacity;
    currentROBObj.upulsfo = ROBArbitrageData?.upulsfo;
    currentROBObj.uplsdis = ROBArbitrageData?.uplsdis;

    this.store.dispatch(new SaveCurrentROBAction(currentROBObj));
  }
  ROBOnChange(event, value, column) {
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
    this.localService.setBunkerPlanState(true);
    this.store.dispatch(new UpdateCurrentROBAction(value, column));

    this.currentROBChange.next(column);
    event.stopPropagation();
    /* This service only for Test purpose only. 
    need to build request payload by using column, value based on BE update*/
    // this.localService.updateROBArbitrageChanges({id:this.vesselData?.vesselId}).subscribe((data)=> {
    //   this.ROBArbitrageData = (data?.payload && data?.payload.length)? data.payload[0]: {};
    // })
  }

  public loadBunkerPlanDetails(event) {
    let Id = event.id ? event.id : 348;
    this.planId = '', this.prevPlanId = '';
    let req = { shipId: Id, planStatus: 'C' };
    this.loadCurrentBunkeringPlan(req);
    req = { shipId: Id, planStatus: 'P' };
    this.loadPrevBunkeringPlan(req);
  }

  //Get Plan Id and Status Details for Current Bunkering Plan
  loadCurrentBunkeringPlan(request) {
    this.loadBplan = false;
    this.statusCurrBPlan = false;
    this.bunkerPlanService.getBunkerPlanIdAndStatus(request)
    .pipe(
      takeUntil(this.unsubscribeSignal.asObservable())
    )
    .subscribe(data => {
      this.currPlanIdDetails =
        data.payload && data.payload.length ? data.payload[0] : {};
      this.planId = this.currPlanIdDetails?.planId
        ? this.currPlanIdDetails?.planId.toString().trim()
        : '';
      if (this.planId) {
        this.statusCurrBPlan =
          this.currPlanIdDetails?.isPlanInvalid === 'N' ? true : false;
        this.statusCurr =
          this.currPlanIdDetails?.isPlanInvalid === 'Y' ? 'InValid' : 'Valid';
        this.planDate = moment(this.currPlanIdDetails?.planDate).format(
          'DD/MM/YYYY'
        );
        this.isLatestPlanInvalid =
          this.currPlanIdDetails.isLatestPlanInvalid === 'Y' ? true : false;
      } else {
        this.statusCurrBPlan = false;
        this.statusCurr = '';
        this.planDate = '';
        this.isLatestPlanInvalid = false;
      }

      this.loadBplan = true;
      // store vesselid and planid for shared ref
      this.store.dispatch(
        new saveVesselDataAction({
          vesselId: request.shipId,
          planId: this.planId
        })
      );
      //to store HSFO header value
      this.scrubberReady =
        this.currPlanIdDetails?.isScrubberReady === 'Y' ? 'HSFO' : 'VLSFO';
      this.store.dispatch(new SaveScrubberReadyAction(this.scrubberReady));
      //to store isNewVesselPlanAvailable variable for shared ref
      this.store.dispatch(
        new newVesselPlanAvailableAction(
          this.currPlanIdDetails?.isNewVesselPlanAvailable
        )
      );
    });
  }

  //Get Plan Id and Status Details for Previous Bunkering Plan
  loadPrevBunkeringPlan(request) {
    this.loadBplan = false;
    this.statusPrevBPlan = false;
    this.bunkerPlanService.getBunkerPlanIdAndStatus(request)
    .pipe(
      takeUntil(this.unsubscribeSignal.asObservable())
    )
    .subscribe(data => {
      this.prevPlanIdDetails =
        data.payload && data.payload.length ? data.payload[0] : {};
      this.prevPlanId = this.prevPlanIdDetails?.planId
        ? this.prevPlanIdDetails?.planId.toString().trim()
        : '';
      if (this.prevPlanId) {
        if (this.currPlanIdDetails?.isPlanInvalid === 'Y') {
          this.statusPrevBPlan =
            this.prevPlanIdDetails?.isPlanInvalid === 'N' ? true : false;
        } else {
          this.statusPrevBPlan = false;
        }
        this.statusPrev =
          this.prevPlanIdDetails?.isPlanInvalid === 'Y' ? 'InValid' : 'Valid';
        this.prevPlanDate = moment(this.prevPlanIdDetails?.planDate).format(
          'DD/MM/YYYY'
        );
      } else {
        this.statusPrevBPlan = false;
        this.statusPrev = '';
        this.prevPlanDate = '';
      }
      this.loadBplan = true;
    });
  }

  changeVesselTrigger(event) {
    this.loadBunkerPlanHeader(event);
    this.loadBunkerPlanDetails(event);
    this.checkVesselHasNewPlan(event);
    this.store.dispatch(new GeneratePlanAction(0));
    this.isChecked = false;
    this.store.dispatch(new ImportGsisAction(0));
    this.store.dispatch(new SendPlanAction(0));
    this.sendPlanReminder = false;
    this.localService.changeDefaultUserRole();
    //Check if auto-plan generation is in progress on vessel change in lookup
    this.checkAutoPlanGenInProgress = true;
    //Trigger gen plan status auto update on vessel change after clear mem leakage
    this.observableRef$.unsubscribe();
    setTimeout(() => {
      this.VesselHasNewPlanJob();
    }, 500);
  }
  TotalCommentCount(count: any) {
    this.totalCommentCount = count;
  }

  checkVesselHasNewPlan(event) {
    let vesselId = event?.id;
    this.localService.checkVesselHasNewPlan(vesselId).subscribe(data => {
      data = data.payload?.length ? data.payload[0] : data.payload;
      if (data.planCount > 0) {
        this.IsVesselhasNewPlan = true;
      } else {
        this.IsVesselhasNewPlan = false;
      }
      this.changeVessel.emit({
        ...event,
        IsVesselhasNewPlan: this.IsVesselhasNewPlan
      });
    });
  }

  saveDefaultView(event) {
    this.onDefaultViewChange.emit(event);
  }

  TriggerdontSendPlanReminder(event) {
    this.dontSendPlanReminder.emit(event);
    this.localService.setdontSendPlanReminder(event.checked);
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
  toggleAccordion(accord) {}
  togglecurrentBPlan(accord) {
    if (!this.currentBplan.gridChanged) {
      accord.expanded = false;
      this.expandBplan = false;
    } else {
      accord.expanded = true;
      const dialogRef = this.dialog.open(WarningComponent, {
        panelClass: ['confirmation-popup']
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == false) {
          this.currentBplan.gridChanged = false;
          this.localService.setBunkerPlanState(false);
          accord.expanded = false;
          this.expandBplan = false;
        } else accord.expanded = true;
      });
    }
  }

  saveCurrentBPlan(event) {
    this.currentBplan.gridChanged = false;
    this.localService.setBunkerPlanState(false);
    event.stopPropagation();
    this.currentBplan.toggleSave();
  }

  // A method that will be triggered via event emitter of bunkering-plan.component ORCA,
  bunkerPlanSaved() {
    if (this.currentBplan.sodCommentsUpdated) {
      this.currentBplan.sodCommentsUpdated = false;
      this.loadComments();
    }
    let storeVesselData = this.store.selectSnapshot(
      SaveBunkeringPlanState.getVesselData
    );
    if (storeVesselData.userRole == 'Vessel') {
      this.loadROBArbitrage();
    }
  }

  loadComments() {
    this.child.loadComments();
  }


  sendCurrentBPlan(event){
    if(this.isLatestPlanInvalid == true){
      let messageText = `The latest plan is unmanageable and cannot be sent. Therefore, the latest valid plan ${ this.planId } will be sent.  Please Confirm.`;
      const dialogRef = this.dialog.open(SuccesspopupComponent, {
        width: '435px', 
        height:'240px', 
        panelClass: ['success-popup-panel'],
        data: { message: messageText, cancelBtnFlag : true }
      });
    }else{
     this.sendValidBPlan();
    }
    event.stopPropagation();
  }

  sendValidBPlan(){
    let req = {
      action: '',
      ship_id: this.vesselData?.vesselId,
      send_plan: 1
    };
    this.store.dispatch(new SendPlanAction(req.send_plan));
    this.bunkerPlanService.saveBunkeringPlanDetails(req).subscribe(data => {
      if (data?.isSuccess == true) {
        const dialogRef = this.dialog.open(SuccesspopupComponent, {
          panelClass: ['success-popup-panel', 'bg-transparent'],
          data: { message: 'Plan will send to vessel in a short while.' }
        });
      }
    });
  }
  setImportGSIS(event) {
    this.import_gsis = this.isChecked ? 1 : 0;
    this.store.dispatch(new ImportGsisAction(this.import_gsis));
    event.stopPropagation();
  }
  generateCurrentBPlan(event) {
    this.import_gsis = this.isChecked ? 1 : 0;
    let req = {
      action: '',
      user_id: this.store.selectSnapshot(UserProfileState.username), //"default@inatech.com",
      ship_id: this.vesselData?.vesselId,
      generate_new_plan: 1,
      import_gsis: this.import_gsis
    };
    this.disableCurrentBPlan = true;
    this.BPlanGenTrigger.push(this.vesselData?.vesselId);
    this.store.dispatch(new GeneratePlanAction(req.generate_new_plan));
    this.bunkerPlanService.saveBunkeringPlanDetails(req).subscribe(data => {
    if(data.payload[0].auto_gen_possible_time != "" && data.payload[0].gen_in_progress == true){
      this.disableCurrentBPlan = false;
      const dialogRef = this.dialog.open(WarningoperatorpopupComponent, {
        width: '350px',
        panelClass: ['confirmation-popup-operator', 'bg-transparent'],
        data: {
          message: 'General Plan generation is currently running and therefore manual plan generation is disabled. Manual plan generation will be enabled again '+ data.payload[0].auto_gen_possible_time + ' UTC time',
          okayButton: true
        }
      });
      return;
    }
     
      this.checkVesselHasNewPlan(this.vesselData?.vesselRef);
      // if(data?.isSuccess == true ){
      if (
        data?.isSuccess == true &&
        data?.payload[0]?.gen_in_progress == false &&
        data?.payload[0]?.import_in_progress == false
      ) {
        /* As per new requirement discussion, "import_in_progress, gen_in_progress" will be 0
         ** only on gen plan completion. So we don't need to handle this dialog for this plan completed case
         */
        this.disableCurrentBPlan = false;
        this.isChecked = false;
        // const dialogRef = this.dialog.open(SuccesspopupComponent, {
        //   panelClass: ['success-popup-panel'],
        //   data: {message : 'Please wait, a new plan is getting generated for vessel ', id: req.ship_id}
        // });
        // this.store.dispatch(new GeneratePlanProgressAction(data.payload[0].gen_in_progress));
        // this.store.dispatch(new ImportGsisProgressAction(data.payload[0].import_in_progress));
      } else if (
        data?.isSuccess == true &&
        data?.payload[0]?.gen_in_progress == true &&
        data?.payload[0]?.import_in_progress == false
      ) {
        const dialogRef = this.dialog.open(WarningoperatorpopupComponent, {
          width: '350px',
          panelClass: ['confirmation-popup-operator', 'bg-transparent'],
          data: {
            message: 'Please wait, a new plan is getting generated for vessel ',
            id: this.vesselData?.vesselRef?.vesselRef?.vesselCode,
            okayButton: true
          }
          // data: {message : 'Already a request to generate a new plan for this vessel is under process. Please wait'}
        });
        this.store.dispatch(new GeneratePlanAction(0));
        this.store.dispatch(
          new GeneratePlanProgressAction(data.payload[0].gen_in_progress)
        );
        this.store.dispatch(
          new ImportGsisProgressAction(data.payload[0].import_in_progress)
        );
      } else if (data.payload && data?.payload[0]?.import_in_progress == true) {
        const dialogRef = this.dialog.open(WarningoperatorpopupComponent, {
          width: '350px',
          panelClass: ['confirmation-popup-operator', 'bg-transparent'],
          data: {
            message: 'Please wait, GSIS import is under process',
            okayButton: true
          }
        });
        this.store.dispatch(new GeneratePlanAction(0));
        this.store.dispatch(
          new ImportGsisProgressAction(data.payload[0].import_in_progress)
        );
      }
    });
    event.stopPropagation();
  }
  getVoyageDetail(selectedPort) {
    this.selectedPort = selectedPort;
  }
  createRequest() {
    let _this = this;
    let baseOrigin = new URL(window.location.href).origin;
    if (this.selectedPort.length > 1) {
      this.selectedPort.forEach((port, index) => {
        _this.shiptechRequestUrl = `${baseOrigin}/#/new-request/${port.voyage_detail_id}`;
        window.open(_this.shiptechRequestUrl, '_blank');
      });
    } else if (this.selectedPort.length == 1) {
      let voyage_id = this.selectedPort[0].voyage_detail_id;
      let url = `${baseOrigin}/#/new-request/${voyage_id}`;
      window.open(url, '_blank');
    }
  }

  VesselHasNewPlanJob() {
    this.hideFlag = 0;
    let currentUserId = this.store.selectSnapshot(UserProfileState.username);
    let vesseldata = this.store.selectSnapshot(SaveBunkeringPlanState.getVesselData);
    let vessalCode = vesseldata.vesselRef.vesselCode ?? vesseldata.vesselRef.code;
    //Need to check gen plan status once and check after every 15 sec after enter this screen to know the process gen plan completion
    this.observableRef$ = timer(0,15000)
    .pipe(
      switchMap(() => {
        let req = {
          vessel_Code: vessalCode,
          generate_new_plan: 0, //(genBunkerPlanRef?.import_in_progress==0)? 1: 0,
          import_gsis: 0
        }
        let payload_req = {vessel_Code:''}
        //this.store.dispatch(new GeneratePlanAction(req.generate_new_plan));
        return this.bunkerPlanService.getPlanStatus(payload_req);
    }))
    .subscribe((data_all) => {
      this.disableCurrentBPlan = false;
      let userVessalList = data_all.payload.filter(data => {
        if(data.plan_generated_by == currentUserId && data.import_in_progress == false && data.gen_in_progress==false){
          return data;
        }
        if(data.vessel_code.trim() == vessalCode.trim()  && data.gen_in_progress == true){
          this.disableCurrentBPlan = true;
        }else if(data.vessel_code.trim() == vessalCode.trim()  && data.gen_in_progress == false){
          this.disableCurrentBPlan = false;
        }
      });

      this.continueCheckingPlans = userVessalList.length;
      if(this.hideFlag == 0){
      userVessalList.forEach(data => {
         // data = (data.payload?.length)? (data.payload)[0]: data.payload;
      if(data.plan_generated_by == currentUserId &&  data.import_in_progress==false && data.gen_in_progress==false) {
        this.hideFlag = 1;
        //Enable Import GSIS checkbox and generate button after gen plan success
        //this.disableCurrentBPlan = false;
        this.isChecked = false;
        //unsubscribe next exec after 15 sec, if plan generate get completed
       // this.observableRef$.unsubscribe();
        let vesselCode = data.vessel_code;
        let messageLine =  `A plan ${data?.plan_id} is generated for vessel ${vesselCode}`;
        let warningFlag = false;
        if(data.planStatus.trim() == 'INV'){
          messageLine =  `Latest bunker plan(${data?.plan_id}) is invalid for vessel ${vesselCode}`;
          warningFlag  =true;
        }
        const dialogValidRef = this.dialog.open(SuccesspopupComponent, {
          panelClass: ['success-popup-panel', 'bg-transparent'],
          width: '350px',
          data: {
            message : messageLine,
            hideActionbtn: true, vCode : vesselCode, 
            observableRestartFlag : this.continueCheckingPlans--,
            observableIniFlag : userVessalList.length,
            warningFlag : warningFlag
          }
        });
        if(data.vessel_code.trim() == vessalCode.trim()){
          //Refresh current bunker plan section once gen plan get completed
          let vesseldata = this.store.selectSnapshot(SaveBunkeringPlanState.getVesselData);
          this.loadBunkerPlanDetails(vesseldata.vesselRef);
          this.disableCurrentBPlan = false;
        }
        if(this.BPlanGenTrigger.indexOf(this.vesselData?.vesselId)!=-1) {
          this.BPlanGenTrigger.splice(this.BPlanGenTrigger.indexOf(this.vesselData?.vesselId), 1);
        }
      }
      //Check if auto-plan generation is happening at the backend. (Usually happens once in a day)
      if (this.checkAutoPlanGenInProgress == true)
        this.checkAutoPlanGenerationInProgress(data.auto_gen_possible_time);
    });
    }
    });
  }

  checkAutoPlanGenerationInProgress(auto_gen_possible_time) {
    //Disable generate button when auto-plan generation happens at the backend.
    if (auto_gen_possible_time) {
      this.disableCurrentBPlan = true;
      const dialogRef = this.dialog.open(WarningoperatorpopupComponent, {
        width: '450px',
        panelClass: ['confirmation-popup-operator', 'bg-transparent'],
        data: {
          message:
            'General plan generation is currently running and therefore manual plan generation is disabled. Manual plan generation will be enabled again ' +
            `${auto_gen_possible_time}` +
            ' CPH time'
        }
      });
    }
    this.checkAutoPlanGenInProgress = false;
  }
  
  showViewAlert(isCellClicked) {
    if (isCellClicked?.type == 'cellClicked') {
      var overlay = document.querySelector('.cdk-overlay-container');
      overlay.classList.remove('removeOverlay');
      const dialogRef = this.dialog.open(WarningoperatorpopupComponent, {
        width: '350px',
        panelClass: ['confirmation-popup-operator', 'bg-transparent'],
        data : {message: 'A new Plan exists for this vessel. Cannot update an old Plan'}
      });
    }
  }

  ngOnDestroy() {
    //unsubscribe to avoid memory leakage
    this.subscription.unsubscribe();
    this.observableRef$.unsubscribe();
    this.unsubscribeSignal.next();
    this.unsubscribeSignal.unsubscribe();
  }
}
