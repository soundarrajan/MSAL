import { Component, Input, OnInit } from '@angular/core';
import { LocalService } from '../../services/local-service.service';
import { MatDialog} from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'shiptech-current-rob-arbit-section',
  templateUrl: './current-rob-arbit-section.component.html',
  styleUrls: ['./current-rob-arbit-section.component.css']
})
export class CurrentRobArbitSectionComponent implements OnInit {
  @Input('planId') planId: string;
  public ROBArbitrageData: any;

  constructor(private localService: LocalService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadROBArbitrage();
  }
  public loadROBArbitrage() {
    if(!this.planId) { return; }
        this.localService.loadROBArbitrage(this.planId).subscribe((data)=> {
          this.ROBArbitrageData = (data?.payload && data?.payload.length)? data.payload[0]: {};
          this.triggerTitleToBind();
        })
  }
  
  triggerTitleToBind() {
    let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
    titleEle.click();
  }

  showViewAlert() {
      var overlay = document.querySelector('.cdk-overlay-container');
      overlay.classList.remove('removeOverlay');
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        panelClass: 'confirmation-popup-operator',// confirmation-popup',
        data: {message : 'A new Plan exists for this vessel. Cannot update an old Plan', source: 'vesselHardWarning'}
      });
    }
}
