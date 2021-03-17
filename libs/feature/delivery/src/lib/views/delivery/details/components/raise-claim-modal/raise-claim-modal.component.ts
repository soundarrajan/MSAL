import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  HostListener,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  Inject,
  ChangeDetectorRef,
  Renderer2
} from '@angular/core';
import { Select } from '@ngxs/store';
import { QcReportService } from '../../../../../services/qc-report.service';
import { BehaviorSubject, Observable, pipe, Subject, Subscription } from 'rxjs';
import { QcReportState } from '../../../../../store/report/qc-report.state';
import { ToastrService } from 'ngx-toastr';
import { finalize, map, scan, startWith, timeout } from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BdnInformationApiService } from '@shiptech/core/services/delivery-api/bdn-information/bdn-information-api.service';
import { TransactionForSearch } from 'libs/feature/delivery/src/lib/services/api/request-response/bdn-information';
import { DocumentsGridViewModel } from '@shiptech/core/ui/components/documents/view-model/documents-grid-view-model.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ModuleError } from '@shiptech/core/ui/components/documents/error-handling/module-error';
import { IDocumentsCreateUploadDetailsDto, IDocumentsCreateUploadDto } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-create-upload.dto';
import { IDocumentsDeleteRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto';
import { IDocumentsItemDto } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto';
import { DocumentViewEditNotesComponent } from '@shiptech/core/ui/components/documents/document-view-edit-notes/document-view-edit-notes.component';
import { IDocumentsUpdateIsVerifiedRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto';
import { IDisplayLookupDto, IOrderLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { knowMastersAutocompleteHeaderName, knownMastersAutocomplete } from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { FileSaverService } from 'ngx-filesaver';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { DOCUMENTS_API_SERVICE } from '@shiptech/core/services/masters-api/documents-api.service';
import { IDocumentsApiService } from '@shiptech/core/services/masters-api/documents-api.service.interface';
import { FileUpload } from 'primeng/fileupload';
import { OrderListGridViewModel } from '@shiptech/core/ui/components/delivery/view-model/order-list-grid-view-model.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { DeliveryAutocompleteComponent } from '../delivery-autocomplete/delivery-autocomplete.component';
import { AppConfig } from '@shiptech/core/config/app-config';
import { HttpClient } from '@angular/common/http';
import { IVesselMastersApi, VESSEL_MASTERS_API_SERVICE } from '@shiptech/core/services/masters-api/vessel-masters-api.service.interface';
import { DeliveryService } from 'libs/feature/delivery/src/lib/services/delivery.service';
import { DeliveryInfoForOrder, DeliveryProduct, DeliveryProductDto, IDeliveryInfoForOrderDto, OrderInfoDetails } from 'libs/feature/delivery/src/lib/services/api/dto/delivery-details.dto';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter, ThemePalette } from '@angular/material/core';
import moment from 'moment';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import _ from 'lodash';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { IDeliveryTenantSettings } from 'libs/feature/delivery/src/lib/core/settings/delivery-tenant-settings';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Optional } from '@ag-grid-enterprise/all-modules';
import { MatRadioChange } from '@angular/material/radio';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}
@Component({
  selector: 'shiptech-raise-claim-modal',
  templateUrl: './raise-claim-modal.component.html',
  styleUrls: ['./raise-claim-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class RaiseClaimModalComponent implements OnInit {
  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Primary', completed: false, color: 'primary'},
      {name: 'Accent', completed: false, color: 'accent'},
      {name: 'Warn', completed: false, color: 'warn'}
    ]
  };
  currentCheckedValue = null;

  allComplete: boolean = false;
  favoriteSeason: any ;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
  availableClaimTypes: any;
  CM: any = {
    'availableClaimTypes': ''
  };
  deliveryProducts: any;
  switchTheme;
  selectedProduct;
  constructor(
    public dialogRef: MatDialogRef<RaiseClaimModalComponent>,
    private ren: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
      this.CM.availableClaimTypes = data.availableClaimTypes;
      this.deliveryProducts = data.deliveryProducts;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = completed);
  }

  ngOnInit() {
  }

  selectParamToRaiseClaim(claimTypeKey, paramKey) {
    console.log(claimTypeKey);
    console.log(paramKey);
    console.log(this.CM.availableClaimTypes);
    this.CM.availableClaimTypes.forEach((typeV, typeK) => {
      console.log(typeV);
      console.log(typeV.specParams);
      typeV.specParams.forEach((specV, specK) => {
        if (typeK != claimTypeKey) {
          specV.isDisabled = true;
        }
      });
    });

    var selectedSpecsInCurrentClaim = 0;
    this.CM.availableClaimTypes[claimTypeKey].specParams.forEach((specV, specK) => {
        if (specV.isSelected) {
          selectedSpecsInCurrentClaim = selectedSpecsInCurrentClaim + 1;
        }
    });

    if (selectedSpecsInCurrentClaim == 0) {
      this.CM.availableClaimTypes.forEach((typeV, typeK) => {
        typeV.specParams.forEach((specV, specK) => {
          if (typeK != claimTypeKey) {
            specV.isDisabled = false;
          }
        });
      });
    }

    if (selectedSpecsInCurrentClaim == this.CM.availableClaimTypes[claimTypeKey].specParams.length) {
      this.CM.availableClaimTypes[claimTypeKey].isTypeSelected = true;
    } else {
      this.CM.availableClaimTypes[claimTypeKey].isTypeSelected = false;
    }
    console.log(this.CM.availableClaimTypes);
  };

  selectAllParamsToRaiseClaim(claimTypeKey, checked) {
    console.log(claimTypeKey);
    console.log(checked);
    if (checked) {
      this.CM.availableClaimTypes.forEach((typeV, typeK) => {
          if (typeK != claimTypeKey) {
              typeV.isTypeSelected = false;
          }
          typeV.specParams.forEach((specV, specK) => {
              specV.isSelected = false;
              specV.isDisabled = true;
              if (typeK == claimTypeKey) {
                  specV.isDisabled = false;
                  specV.isSelected = true;
              }
          });
      });
    } else {
      this.CM.availableClaimTypes.forEach((typeV, typeK) => {
          typeV.specParams.forEach((specV, specK) => {
              specV.isDisabled = false;
              specV.isSelected = false;
          });
      });
    }
    console.log(this.CM.availableClaimTypes);
    this.changeDetectorRef.detectChanges();
  };

  changeGender(e) {
    console.log(e.target.value);
  }

  
 

  
}
