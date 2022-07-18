import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { BunkeringPlanService } from '../../services/bunkering-plan.service';
import { LocalService } from '../../services/local-service.service';


@Component({
  selector: 'app-successpopup',
  templateUrl: './successpopup.component.html',
  styleUrls: ['./successpopup.component.scss']
})
export class SuccesspopupComponent implements OnInit {

  public message : string;
  public vessalId : string;
  public observableRestartFlag : number = 0;
  public id ?: any;
  public ViewFlagPayload : any;
  observableIniFlag: any;
  
  constructor(
      public dialogRef: MatDialogRef<SuccesspopupComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private http: HttpClient,
      private bplanService: BunkeringPlanService,
      private localService: LocalService
      ) {
    //dialogRef.disableClose = true;
    this.message = data?.message;
    this.vessalId = data?.vCode;
    this.observableRestartFlag = data?.observableRestartFlag;
    this.observableIniFlag = data?.observableIniFlag;
    if(this.data?.id)
    this.id = data?.id;
  }
  ngOnInit(): void {
  }
  changeVessalPlanViewFlag(){
    this.ViewFlagPayload = {"vessel_code":this.vessalId};
    this.bplanService.updatePlanStatus(this.ViewFlagPayload).subscribe();
    if(this.observableRestartFlag == this.observableIniFlag){
        this.localService.checkVesselNewPlanJob();
    }
  }
  close() {
    this.dialogRef.close();
    this.changeVessalPlanViewFlag();
  }
}
