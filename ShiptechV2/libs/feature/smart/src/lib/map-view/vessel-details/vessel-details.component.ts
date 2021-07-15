import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { saveVesselDataAction } from "./../../store/bunker-plan/bunkering-plan.action";
import { Subject } from 'rxjs';
import { LocalService } from '../../services/local-service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WarningComponent } from '../../shared/warning/warning.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { VesselInfoComponent} from '../../shared/vessel-info/vessel-info.component';
import { GeneratePlanAction, ImportGsisAction, SendPlanAction} from './../../store/bunker-plan/bunkering-plan.action';
import { VesselPopupService } from '../../services/vessel-popup.service';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
// import { Store } from '@ngxs/store';

@Component({
  selector: 'app-vessel-details',
  templateUrl: './vessel-details.component.html',
  styleUrls: ['./vessel-details.component.scss']
})
export class VesselDetailsComponent implements OnInit {

  @ViewChild(VesselInfoComponent) vesselInfo;
  @Output() closeBPlan = new EventEmitter();
  @Output() changeVessel = new EventEmitter();
  public bunkerUserRole = [];
  previousUserRole: any;
  selectedUserRole: any;
  public vesselList = [];
  public vesselId;
  public vesselName;
  public vesselView;
  public vesselData;
  public isBunkerPlanEdited: boolean;
  public enableSelection: boolean;
  public theme:boolean=true;
  selectedRole: any;
  changeUserRole: Subject<void> = new Subject<void>();
  IsVesselhasNewPlan: boolean = false;
  getVesselListVesselWithImo: any[];
  getVesselListVesselWithCode: any[];
  constructor(private store: Store, private localService: LocalService, public dialog: MatDialog,private vesselService: VesselPopupService) { }

  ngOnInit() {
    this.getBunkerUserMode();
    this.getVesselList();
    // this.localService.getVesselsList().subscribe((res: any) => {
    //   this.vesselList = res;
    // });
    this.localService.isBunkerPlanEdited.subscribe(value => { this.isBunkerPlanEdited = value });
    this.localService.vesselPopUpDetails.subscribe(value => this.vesselData = value);
    this.localService.themeChange.subscribe(value => this.theme = value);

    this.vesselView = this.vesselData.vesselView;
    this.vesselName = this.vesselData.name;
    this.vesselId = this.vesselData?.vesselId
    this.store.dispatch(new saveVesselDataAction({'vesselRef': this.vesselData}));
  }

  getBunkerUserMode() {
    // load user role
    // this.bunkerUserRole = [{id: 1111, name: 'Vessel', default: false}, {id: 2222, name: 'Operator', default: true}];
    //   this.selectedUserRole = this.bunkerUserRole.find((role)=> (role.default==true) );
    this.localService.getBunkerUserRole(1).subscribe((data)=> {
      console.log('LoadBunkerPlanByRole',data);
      this.bunkerUserRole = data.payload;
      this.selectedUserRole = this.bunkerUserRole.find((role)=> (role.default==1) );
      this.selectedRole= this.selectedUserRole;
      // this.LoadBunkerPlanByRole();
      // store user role for shared ref
      this.store.dispatch(new saveVesselDataAction({'userRole': this.selectedUserRole?.name}));
    })
  }
  getVesselList() {
    // load vessel list for vessel search option
    this.localService.getVesselListall(false).subscribe((tenantConfRes)=> {
      this.getVesselListVesselWithImo = tenantConfRes.find(txn => txn.name =="VesselWithImo").items;
      this.getVesselListVesselWithCode = tenantConfRes.find(txn => txn.name =="Vessel").items;
      this.vesselList = this.getVesselListVesselWithCode.map(vesselItem=> {
            let obj = this.getVesselListVesselWithImo.find(imoItem => imoItem.id === vesselItem.id);
            return obj? {...vesselItem, imono:obj.name, displayName:vesselItem.name }: false;
          })
    })

  }

  selectedUserRoleFn(role1: any, role2: any) {
    if(!role2) {
      return role1.default;
    } else {
      return (role2.name == role1.name)
    }
  }

  loadBunkerPlan(event) {
    this.previousUserRole = this.selectedUserRole;
    this.selectedUserRole = event.value;
    console.log(this.selectedRole);

    this.LoadBunkerPlanByRole();
  }

  LoadBunkerPlanByRole() {
    var _this = this;
    const confirmMessage = this.selectedUserRole?.name == 'Vessel'? 'Are you sure to switch your role to Vessel?' : 'Are you sure to switch your role to Operator?'
    console.log('LoadBunkerPlanByRole service', this.selectedUserRole);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirmation-popup-operator', // bunkerplan-role-confirm
      data:  { message: confirmMessage }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result) {
        // store user role for shared ref
        this.store.dispatch(new saveVesselDataAction({'userRole': this.selectedUserRole?.name}));
        if(this.selectedUserRole?.name=='Vessel') {
          this.checkVesselHasNewPlan();
        }
      } else {
        setTimeout(() => {
          _this.selectedRole = _this.bunkerUserRole.find((role)=> (role.name==_this.previousUserRole?.name) );
          _this.selectedUserRole = _this.selectedRole;
          // store user role for shared ref
          this.store.dispatch(new saveVesselDataAction({'userRole': _this.selectedUserRole?.name}));
          let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
          titleEle.click();
        }, 500);
      }
      this.changeUserRole.next(this.selectedUserRole);
    });



  }

  checkVesselHasNewPlan() {
    //let vesselId = this.vesselData?.vesselId
    this.localService.checkVesselHasNewPlan(this.vesselId).subscribe((data)=> {
      console.log('vessel has new plan',data);
      data = (data.payload?.length)? (data.payload)[0]: data.payload;
      if(data.planCount>0)
      this.vesselWarningConfirmation();
    })
  }

  vesselWarningConfirmation() {
    const warningMessage = 'A plan has been received from the vessel but this has not yet been imported. Please generate a new plan to import the latest input from the vessel. When the latest input from the vessel has been imported you can play the role of vessel'
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'confirmation-popup-operator', // bunkerplan-role-confirm
      data:  { message: warningMessage, source: 'vesselHardWarning' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
        let _this = this;
        setTimeout(() => {
          _this.selectedRole = _this.bunkerUserRole.find((role)=> (role.name==_this.previousUserRole?.name) );
          _this.selectedUserRole = _this.selectedRole;
          // store user role for shared ref
          this.store.dispatch(new saveVesselDataAction({'userRole': _this.selectedUserRole?.name}));
          let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
          titleEle.click();
          this.changeUserRole.next(_this.selectedUserRole);
        }, 500);
    });
  }

  onDefaultViewChange(event:MatCheckboxChange) {
    console.log(event.checked);

  }

  dontSendPlanReminder(event:MatCheckboxChange) {
    console.log(event.checked);

  }

  closePanel() {
    debugger;
    if (!this.isBunkerPlanEdited) {
      if(this.vesselService.myDefaultViewPayload.bunker_Plan != undefined){
        this.SavemyDefaultView();
      }
     
      this.closeBPlan.emit();
    }
    else {
      const dialogRef = this.dialog.open(WarningComponent, {
        panelClass: ['confirmation-popup']

      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if (result == false) {
          this.closeBPlan.emit();
          this.localService.setBunkerPlanState(false);
        }
        else {
        }

      })
    }
    this.store.dispatch(new GeneratePlanAction(0));
    this.store.dispatch(new ImportGsisAction(0));
    this.store.dispatch(new SendPlanAction(0));
  }
  SavemyDefaultView() {
    console.log("======Final Payload===========", this.vesselService.myDefaultViewPayload)
    let requestPayload = {}
    requestPayload = {
      "Payload": {
        "UserId": this.vesselService.myDefaultViewPayload.userId,
        "Port": this.vesselService.myDefaultViewPayload.port,
        "Vessel": this.vesselService.myDefaultViewPayload.vessel,
        "DefaultView": this.vesselService.myDefaultViewPayload.defaultView,
        "BunkerPlan": this.vesselService.myDefaultViewPayload.bunker_Plan,
        "PortRemarks": this.vesselService.myDefaultViewPayload.portRemarks,
        "ProductAvailability":this.vesselService.myDefaultViewPayload.productAvailability,
        "BOPSPrice": this.vesselService.myDefaultViewPayload.bopsPrice,
        "PortsAgents": this.vesselService.myDefaultViewPayload.portsAgents,
        "OtherDetails": this.vesselService.myDefaultViewPayload.otherDetails,
        "VesselAlerts": this.vesselService.myDefaultViewPayload.vesselAlerts,
        "FutureRequest": this.vesselService.myDefaultViewPayload.futureRequest,
        "VesselRedelivery": this.vesselService.myDefaultViewPayload.vesselRedelivery,
        "VesselSchedule": this.vesselService.myDefaultViewPayload.vesselSchedule,
        "CurrentROBandArbitragedetails": this.vesselService.myDefaultViewPayload.currentROBandArbitragedetails,
        "Comments": this.vesselService.myDefaultViewPayload.comments,
        "CurrentBunkeringPlan": this.vesselService.myDefaultViewPayload.currentBunkeringPlan,
        "PreviousBunkeringPlan": this.vesselService.myDefaultViewPayload.previousBunkeringPlan
      }
    }
    this.vesselService.saveDefaultView(requestPayload).subscribe(response => {
      console.log(response.payload);
      this.vesselService.myDefaultViewPayload = [];
      this.vesselService.APImyDefaultView = [];
      if(response.payload[0].success == 1){
        this.getDefaultView();
      }
    })
  }

  getDefaultView() {
    let req = { "UserId": this.store.selectSnapshot(UserProfileState.userId)}
    this.vesselService.getmyDefaultview(req).subscribe((res) => {
      this.vesselService.myDefaultViewPayload = [];
        this.vesselService.APImyDefaultView = [];
        // debugger;
      if (res.payload.length > 0) {
        this.vesselService.myDefaultViewPayload = res.payload[0];
      }
      else{
        if (this.vesselService.myDefaultViewPayload.length == 0) {
          this.vesselService.myDefaultViewPayload.userId = this.store.selectSnapshot(UserProfileState.userId);
          this.vesselService.myDefaultViewPayload.port = 0;
          this.vesselService.myDefaultViewPayload.vessel = 0;
          this.vesselService.myDefaultViewPayload.defaultView = 0;
          this.vesselService.myDefaultViewPayload.bunker_Plan = 0;
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
          this.vesselService.myDefaultViewPayload.previousBunkeringPlan = 0
        }
      }
      
    })


  }


  vesselChange(event) {
    this.IsVesselhasNewPlan = event?.IsVesselhasNewPlan;
    if(event.displayName){
      this.vesselName = event?.displayName;
    }
    if(event.id){
      this.vesselId = event.id;
    }
    this.getBunkerUserMode();
    // this.vesselView = event.ROB.Color.indexOf('red') > 0 ? 'higher-warning-view' :
    //   event.ROB.Color.indexOf('orange') > 0 ? 'minor-warning-view' : 'standard-view';
    // this.changeVessel.emit(event);
  }
}
