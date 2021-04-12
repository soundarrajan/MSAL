import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { LocalService } from '../../services/local-service.service';
import { CommentsComponent } from '../comments/comments.component';
import { CurrentBunkeringPlanComponent } from '../current-bunkering-plan/current-bunkering-plan.component';
import { WarningComponent } from '../warning/warning.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-vessel-info',
  templateUrl: './vessel-info.component.html',
  styleUrls: ['./vessel-info.component.scss']
})
export class VesselInfoComponent implements OnInit {

  @ViewChild(CommentsComponent) child;
  @ViewChild(CurrentBunkeringPlanComponent) currentBplan;
  @Input('vesselData') vesselData;
  @Input('vesselList') vesselList;
  @Output() changeVessel = new EventEmitter();
  @Output() currentBPlanSave = new EventEmitter();
  public enableCreateReq: boolean = false;
  public expandBplan: boolean = false;
  public expandComments: boolean = false;
  public expandPrevBPlan: boolean = false;
  public step = 0;
  public dialogRef: MatDialogRef<WarningComponent>;

  constructor(private localService: LocalService, public dialog: MatDialog) { }

  ngOnInit() {

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
}
