import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ControlTowerService } from 'libs/feature/control-tower/src/lib/services/control-tower.service';

@Component({
  selector: 'control-tower-popup',
  templateUrl: './control-tower-popup.component.html',
  styleUrls: ['./control-tower-popup.component.css']
})
export class ControlTowerPopupComponent implements OnInit {
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
    public dialogRef: MatDialogRef<ControlTowerPopupComponent>,
    private controlTowerService: ControlTowerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.comments = data.comments;
  }

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
    if(this.data?.popupType == "qualityLabs") {
      let payloadData = {
        "controlTowerActionStatusId": this.status,
        "comments": this.comments,
        "labResultId": this.data?.lab
      };
  
      this.controlTowerService
        .saveQualityLabsPopUp(payloadData, payloadData => {
          console.log('labs changes updated..');
        })
        .pipe()
        .subscribe((response: any) => {
          if (typeof response == 'string') {
            this.toastr.error(response);
          } else {
            this.dialogRef.close();
          }
        });
    } else {
      console.log(this.data.differenceType);
      let payloadData = {
        differenceType: this.data.differenceType,
        quantityControlReport: {
          id: this.data.quantityControlReport.id
        },
        status: { id: +this.status },
        comments: this.comments
      };
      if (
        this.data.differenceType.name == 'Rob' ||
        this.data.differenceType.name == 'Supply'
      ) {
        this.controlTowerService
          .saveQuantityResiduePopUp(payloadData, payloadData => {
            console.log('asd');
          })
          .pipe()
          .subscribe((response: any) => {
            if (typeof response == 'string') {
              this.toastr.error(response);
            } else {
              this.dialogRef.close();
            }
          });
      } else if (this.data.differenceType.name == 'Sludge') {
        this.controlTowerService
          .saveResiduePopUp(payloadData, payloadData => {
            console.log('asd');
          })
          .pipe()
          .subscribe((response: any) => {
            if (typeof response == 'string') {
              this.toastr.error(response);
            } else {
              this.dialogRef.close();
            }
          });
      }
    }
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
