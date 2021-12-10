import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { FormControl } from '@angular/forms';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import moment from 'moment';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ControlTowerService } from 'libs/feature/control-tower/src/lib/services/control-tower.service';

@Component({
  selector: 'control-tower-popup',
  templateUrl: './control-tower-popup.component.html',
  styleUrls: ['./control-tower-popup.component.scss']
})
export class ControlTowerPopupComponent implements OnInit {
  public switchTheme: boolean = true;
  public status: string;
  public comments: string;
  public logStatus: string = '';
  public controlTowerActionStatus: any;
  public defaultStatus: string;
  public controlTowePopupForm = new FormControl();
  initialDefaultStatus: string;
  initialComments: string;
  controlTowerLogStatus: any[];
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
    this.initialComments = _.cloneDeep(data.comments);
  }

  ngOnInit(): void {
    this.defaultStatus = this.data.progressId.toString();
    this.initialDefaultStatus = _.cloneDeep(this.data.progressId.toString());
    this.legacyLookupsDatabase
      .getTableByName('controlTowerActionStatus')
      .then(response => {
        this.controlTowerActionStatus = response;
        console.log(this.controlTowePopupForm);
        this.status = this.data.progressId.toString();
      });
    this.legacyLookupsDatabase
      .getTableByName('controlTowerLogStatus')
      .then(response => {
        this.controlTowerLogStatus = response;
        console.log(this.controlTowerLogStatus);
      });
  }
  changeStatus(status) {
    //alert(status);
    this.status = status;
  }

  transform(str: any, property?: string): any {
    var decode = function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
    };
    if (str && str[property]) {
      str[property] = decode(_.unescape(str[property]));
      return str;
    }
    return decode(_.unescape(str));
  }

  fetchLabsActionPopup(payloadData) {
    this.controlTowerService
      .getQualityLabsPopUp(payloadData, payloadData => {
        console.log('asd');
      })
      .pipe()
      .subscribe(
        (response: any) => {
          if (typeof response == 'string') {
            this.toastr.error(response);
          } else {
            if (response?.length) {
              this.data.changeLog =
                response[0]?.controlTowerLabChangeLogResults.map(logObj => {
                  logObj['user'] = logObj.createdBy;
                  logObj['date'] = logObj.createdOn;
                  logObj['newComments'] = logObj.comments;
                  return logObj;
                }) ?? [];
              this.data.comments = this.transform(response[0]?.comments);
              this.data.status = response[0]?.controlTowerActionStatusId;
              this.data.progressId = response[0]?.controlTowerActionStatusId;
              this.initialComments = _.cloneDeep(response[0].comments);
              this.initialDefaultStatus = _.cloneDeep(
                response[0]?.controlTowerActionStatusId.toString()
              );
              this.logStatus = null;
            }
          }
        },
        () => {}
      );
  }

  getQuantityResiduePopUp(payloadData) {
    this.controlTowerService
      .getQuantityResiduePopUp(payloadData, payloadData => {
        console.log('Get quantity popup details!');
      })
      .pipe()
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          this.data.changeLog = _.cloneDeep(response.changeLog);
          this.initialComments = _.cloneDeep(response.comments);
          this.initialDefaultStatus = _.cloneDeep(
            response?.progress?.id.toString()
          );
          this.logStatus = null;
        }
      });
  }

  getResiduePopUp(payloadData) {
    this.controlTowerService
      .getResiduePopUp(payloadData, payloadData => {
        console.log('Get residue popup details!');
      })
      .pipe()
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          this.data.changeLog = _.cloneDeep(response.changeLog);
          this.initialComments = _.cloneDeep(response.comments);
          this.initialDefaultStatus = _.cloneDeep(
            response?.progress?.id.toString()
          );
          this.logStatus = null;
        }
      });
  }

  checkChangedFields() {
    this.logStatus = this.controlTowerLogStatus.filter(
      obj => obj.name == 'Status'
    )[0];
    if (
      parseFloat(this.initialDefaultStatus) != parseFloat(this.status) &&
      this.transform(this.initialComments) != this.transform(this.comments)
    ) {
      this.logStatus = this.controlTowerLogStatus.filter(
        obj => obj.name == 'Both'
      )[0];
    } else if (
      parseFloat(this.initialDefaultStatus) != parseFloat(this.status)
    ) {
      this.logStatus = this.controlTowerLogStatus.filter(
        obj => obj.name == 'Status'
      )[0];
    } else if (
      this.transform(this.initialComments) != this.transform(this.comments)
    ) {
      this.logStatus = this.controlTowerLogStatus.filter(
        obj => obj.name == 'Comments'
      )[0];
    }

    console.log(this.logStatus);
  }

  statusChanged() {
    this.checkChangedFields();

    if (this.data?.popupType == 'qualityLabs') {
      if (!this.logStatus && this.status != '1') {
        return;
      }
      let payloadData = {
        controlTowerActionStatusId: this.status,
        comments:
          this.comments && this.comments.trim() != '' ? this.comments : '',
        labResultId: this.data?.lab,
        logStatus: this.logStatus
      };

      this.controlTowerService
        .saveQualityLabsPopUp(payloadData, payloadData => {
          console.log('labs changes updated..');
        })
        .pipe()
        .subscribe((response: any) => {
          if (typeof response == 'string') {
            this.toastr.error(response);
          } else if (response?.message === 'Unauthorized') {
            this.resetUserChanges();
          } else {
            this.fetchLabsActionPopup(payloadData?.labResultId);
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
        comments: this.comments,
        logStatus: this.logStatus
      };
      if (
        this.data.differenceType.name == 'Rob' ||
        this.data.differenceType.name == 'Supply'
      ) {
        this.controlTowerService
          .saveQuantityResiduePopUp(payloadData, payloadData => {
            console.log('Quantity changes updated!');
          })
          .pipe()
          .subscribe((response: any) => {
            if (typeof response == 'string') {
              this.toastr.error(response);
            } else if (response?.message === 'Unauthorized') {
              this.resetUserChanges();
            } else {
              let payload = {
                differenceType: this.data.differenceType,
                quantityControlReport: {
                  id: this.data.quantityControlReport.id
                }
              };
              this.getQuantityResiduePopUp(payload);
            }
          });
      } else if (this.data.differenceType.name == 'Sludge') {
        this.controlTowerService
          .saveResiduePopUp(payloadData, payloadData => {
            console.log('Residue changes updated!');
          })
          .pipe()
          .subscribe((response: any) => {
            if (typeof response == 'string') {
              this.toastr.error(response);
            } else if (response?.message === 'Unauthorized') {
              this.resetUserChanges();
            } else {
              let payload = {
                differenceType: this.data.differenceType,
                quantityControlReport: {
                  id: this.data.quantityControlReport.id
                }
              };
              this.getResiduePopUp(payload);
            }
          });
      }
    }
  }
  closeDialog() {
    let statusId = parseFloat(this.status);
    let findStatusIndex = _.findIndex(this.controlTowerActionStatus, function(
      object: any
    ) {
      return object.id == statusId;
    });
    if (findStatusIndex != -1) {
      this.dialogRef.close({
        status: this.controlTowerActionStatus[findStatusIndex]
      });
    } else {
      this.dialogRef.close();
    }
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

  formatDateTo12Hrs(date?: any) {
    if (date) {
      let currentFormat = this.format.dateFormat;
      let hasDayOfWeek;
      if (currentFormat.startsWith('DDD ')) {
        hasDayOfWeek = true;
        currentFormat = currentFormat.split('DDD ')[1];
      }
      currentFormat = currentFormat.replace(/d/g, 'D');
      currentFormat = currentFormat.replace(/y/g, 'Y');
      //convert tenant setting format to 24 hrs as per requirement design
      currentFormat = currentFormat.replace(/H/g, 'h').concat(' a');

      // let formattedDate = moment(elem).format(currentFormat);
      let formattedDate = moment(date).format(
        dateTimeAdapter.fromDotNet(currentFormat)
      );
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

  canSave() {
    if (!this.data.changeLog) {
      return true;
    }
    if (
      this.data.changeLog[this.data.changeLog.length - 1].newComments !=
        this.comments ||
      this.data.changeLog[this.data.changeLog.length - 1].newStatus.id !=
        +this.status
    ) {
      return true;
    }
    return false;
  }

  resetUserChanges() {
    if (!this.data.changeLog) {
      this.comments = '';
    } else {
      this.comments = this.data.changeLog[
        this.data.changeLog.length - 1
      ].newComments;
      this.status = this.data.changeLog[
        this.data.changeLog.length - 1
      ].newStatus.id.toString();
      this.changeDetectorRef.detectChanges();
    }
  }
}
