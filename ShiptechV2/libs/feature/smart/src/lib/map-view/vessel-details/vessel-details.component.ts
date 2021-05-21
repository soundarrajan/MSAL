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
  public vesselName;
  public vesselView;
  public vesselData;
  public isBunkerPlanEdited: boolean;
  public enableSelection: boolean;
  public theme:boolean=true;
  selectedRole: any;
  changeUserRole: Subject<void> = new Subject<void>();
  IsVesselhasNewPlan: boolean = false;
  constructor(private store: Store, private localService: LocalService, public dialog: MatDialog) { }

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

  }

  getBunkerUserMode() {
    // load user role
    // this.bunkerUserRole = [{id: 1111, name: 'Vessel', default: false}, {id: 2222, name: 'Operator', default: true}];
    //   this.selectedUserRole = this.bunkerUserRole.find((role)=> (role.default==true) );
    this.localService.getBunkerUserRole(1).subscribe((data)=> {
      console.log('LoadBunkerPlanByRole',data);
      this.bunkerUserRole = data.payload;
      this.selectedUserRole = this.bunkerUserRole.find((role)=> (role.default==true) );
      // this.LoadBunkerPlanByRole();
      // store user role for shared ref
      this.store.dispatch(new saveVesselDataAction({'userRole': this.selectedUserRole?.name}));
    })
  }
  getVesselList() {
    // load vessel list for vessel search option
    this.localService.getVesselListImono(false).subscribe((tenantConfRes)=> {
      console.log('tenantConfRes for vessel imono',tenantConfRes);
      tenantConfRes = tenantConfRes.items
      this.localService.getVesselList(false).subscribe((data)=> {
        console.log('getVesselList',data);
        let vesselRes = data;
        this.vesselList = [];
        this.vesselList = vesselRes.map(vesselItem=> {
          let obj = tenantConfRes.find(imoItem => imoItem.id === vesselItem.id);
          return {...vesselItem, imono:obj.name }
        })
        console.log(this.vesselList);
        
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
      width: '350px',
      panelClass: 'bunkerplan-role-confirm',
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
    let vesselId = this.vesselData?.vesselId
    this.localService.checkVesselHasNewPlan(vesselId).subscribe((data)=> {
      console.log('vessel has new plan',data);
      data = (data.payload?.length)? (data.payload)[0]: data.payload; 
      if(data.planCount>0)
      this.vesselWarningConfirmation();
    })
  }

  vesselWarningConfirmation() {
    const warningMessage = 'A plan has been received from the vessel but this has not yet been imported. Please generate a new plan to import the latest input from the vessel. When the latest input from the vessel has been imported you can play the role of vessel'
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      panelClass: 'bunkerplan-role-confirm',
      data:  { message: warningMessage, source: 'vesselHardWarning' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result) {

      } else {
        this.selectedUserRole = this.previousUserRole;
      }
    });
  }
  
  onDefaultViewChange(event:MatCheckboxChange) {
    console.log(event.checked);
    
  }

  dontSendPlanReminder(event:MatCheckboxChange) {
    console.log(event.checked);
    
  }

  closePanel() {
    if (!this.isBunkerPlanEdited) {
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
  }
  vesselChange(event) {
    this.IsVesselhasNewPlan = event?.IsVesselhasNewPlan;
    this.vesselName = event?.displayName;
    // this.vesselView = event.ROB.Color.indexOf('red') > 0 ? 'higher-warning-view' :
    //   event.ROB.Color.indexOf('orange') > 0 ? 'minor-warning-view' : 'standard-view';
    // this.changeVessel.emit(event);
  }
}
