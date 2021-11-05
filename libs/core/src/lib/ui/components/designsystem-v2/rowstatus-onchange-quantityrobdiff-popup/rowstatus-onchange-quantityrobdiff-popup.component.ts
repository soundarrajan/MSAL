import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { FormControl } from '@angular/forms';  
import moment from 'moment';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

@Component({
  selector: 'app-rowstatus-onchange-quantityrobdiff-popup',
  templateUrl: './rowstatus-onchange-quantityrobdiff-popup.component.html',
  styleUrls: ['./rowstatus-onchange-quantityrobdiff-popup.component.css']
})
export class RowstatusOnchangeQuantityrobdiffPopupComponent implements OnInit {
  public switchTheme: boolean = true;
  public status : string;
  public comments : string;
  public controlTowerActionStatus : any;
  public defaultStatus : string;
  public controlTowePopupForm = new FormControl();
  constructor(
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private format: TenantFormattingService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<
      RowstatusOnchangeQuantityrobdiffPopupComponent
    >,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.defaultStatus = "1";
    this.legacyLookupsDatabase.getTableByName("controlTowerActionStatus").then( (response) => {
      this.controlTowerActionStatus = response;
      console.log(this.controlTowePopupForm);
      this.status = "1";
      // this.changeStatus(this.controlTowerActionStatus[0]);
    });
  }
  changeStatus(status) {
    //alert(status);
    this.status = status;
  }
  statusChanged() {
    let data = {
      status : { id : +this.status},
      comments : this.comments
    } 
    this.dialogRef.close({ data: data });
  }
  closeDialog() {
    this.dialogRef.close();
  }

  formatDate(date?: any) {
    if (date) {
      let currentFormat = this.format.dateFormat;
      let hasDayOfWeek;
      if (currentFormat.startsWith('DDD ')) {
        hasDayOfWeek = true;
        currentFormat = currentFormat.split('DDD ')[1];
      }
      currentFormat = currentFormat.replace(/d/g, 'D');
      currentFormat = currentFormat.replace(/y/g, 'Y');
      const elem = moment(date, 'YYYY-MM-DDTHH:mm:ss');
      let formattedDate = moment(elem).format(currentFormat);
      if (hasDayOfWeek) {
        formattedDate = `${moment(date).format('ddd')} ${formattedDate}`;
      }
      return formattedDate;
    }
  }

}
