import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LocalService } from '../../services/local-service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WarningComponent } from '../../shared/warning/warning.component';

@Component({
  selector: 'app-vessel-details',
  templateUrl: './vessel-details.component.html',
  styleUrls: ['./vessel-details.component.scss']
})
export class VesselDetailsComponent implements OnInit {

  @Output() closeBPlan = new EventEmitter();
  @Output() changeVessel = new EventEmitter();
  public vesselList = [];
  public vesselName;
  public vesselView;
  public vesselData;
  public isBunkerPlanEdited: boolean;
  public enableSelection: boolean;
  public theme:boolean=true;
  constructor(private localService: LocalService, public dialog: MatDialog) { }

  ngOnInit() {
    this.localService.getVesselsList().subscribe((res: any) => {
      this.vesselList = res;
    });
    this.localService.isBunkerPlanEdited.subscribe(value => { this.isBunkerPlanEdited = value });
    this.localService.vesselPopUpDetails.subscribe(value => this.vesselData = value);
    this.localService.themeChange.subscribe(value => this.theme = value);

    this.vesselView = this.vesselData.vesselView;
    this.vesselName = this.vesselData.name;
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
    this.vesselName = event.VesselName;
    this.vesselView = event.ROB.Color.indexOf('red') > 0 ? 'higher-warning-view' :
      event.ROB.Color.indexOf('orange') > 0 ? 'minor-warning-view' : 'standard-view';
    this.changeVessel.emit(event);
  }
}
