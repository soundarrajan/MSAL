import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rowstatus-onchange-quantityrobdiff-popup',
  templateUrl: './rowstatus-onchange-quantityrobdiff-popup.component.html',
  styleUrls: ['./rowstatus-onchange-quantityrobdiff-popup.component.css']
})
export class RowstatusOnchangeQuantityrobdiffPopupComponent implements OnInit {
  public switchTheme: boolean = true;
  public status: string;
  public comments: string;
  public controlTowerActionStatus: any;
  public defaultStatus: string;
  public controlTowePopupForm = new FormControl();
  constructor(
    private toastr: ToastrService,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private changeDetectorRef: ChangeDetectorRef,
    public format: TenantFormattingService,
    public dialogRef: MatDialogRef<
      RowstatusOnchangeQuantityrobdiffPopupComponent
    >,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.defaultStatus = this.data.progressId.toString();
    this.legacyLookupsDatabase
      .getTableByName('controlTowerActionStatus')
      .then(response => {
        this.controlTowerActionStatus = response;
        console.log(this.controlTowePopupForm);
        this.status = this.data.progressId.toString();
      });
  }
  changeStatus(status) {
    //alert(status);
    this.status = status;
  }
  statusChanged() {
    let statusFromPopUp = this.status;
    let actionStatus = _.find(this.controlTowerActionStatus, function(object) {
      return object.id == statusFromPopUp;
    });
    let data = {
      status: { id: +this.status },
      comments: this.comments,
      actionStatus: actionStatus
    };
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

  checkLengthOfTextarea(value) {
    if (value.length == 500) {
      this.toastr.warning('Maximum 500 characters allowed!');
    }
  }

  getStatusId() {
    return parseFloat(this.status);
  }
}
