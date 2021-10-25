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
import { BehaviorSubject, Observable, pipe, Subject, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { finalize, map, scan, startWith, timeout } from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BdnInformationApiService } from '@shiptech/core/services/delivery-api/bdn-information/bdn-information-api.service';
import { TransactionForSearch } from 'libs/feature/delivery/src/lib/services/api/request-response/bdn-information';
import { DocumentsGridViewModel } from '@shiptech/core/ui/components/documents/view-model/documents-grid-view-model.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ModuleError } from '@shiptech/core/ui/components/documents/error-handling/module-error';
import {
  IDocumentsCreateUploadDetailsDto,
  IDocumentsCreateUploadDto
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-create-upload.dto';
import { IDocumentsDeleteRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto';
import { IDocumentsItemDto } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto';
import { DocumentViewEditNotesComponent } from '@shiptech/core/ui/components/documents/document-view-edit-notes/document-view-edit-notes.component';
import { IDocumentsUpdateIsVerifiedRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto';
import {
  IDisplayLookupDto,
  IOrderLookupDto
} from '@shiptech/core/lookups/display-lookup-dto.interface';
import {
  knowMastersAutocompleteHeaderName,
  knownMastersAutocomplete
} from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
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
import {
  IVesselMastersApi,
  VESSEL_MASTERS_API_SERVICE
} from '@shiptech/core/services/masters-api/vessel-masters-api.service.interface';
import { DeliveryService } from 'libs/feature/delivery/src/lib/services/delivery.service';
import {
  DeliveryInfoForOrder,
  DeliveryProduct,
  DeliveryProductDto,
  IDeliveryInfoForOrderDto,
  OrderInfoDetails
} from 'libs/feature/delivery/src/lib/services/api/dto/delivery-details.dto';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  NativeDateAdapter,
  ThemePalette
} from '@angular/material/core';
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
import { NgxSpinnerService } from 'ngx-spinner';

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
      { name: 'Primary', completed: false, color: 'primary' },
      { name: 'Accent', completed: false, color: 'accent' },
      { name: 'Warn', completed: false, color: 'warn' }
    ]
  };
  currentCheckedValue = null;

  allComplete: boolean = false;
  favoriteSeason: any;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
  availableClaimTypes: any;
  CM: any = {
    availableClaimTypes: ''
  };
  deliveryProducts: any;
  switchTheme;
  selectedProduct;
  raiseClaimInfo: any;
  baseOrigin: string;
  selectedProductIndex: any;
  formValues: any;
  constructor(
    public dialogRef: MatDialogRef<RaiseClaimModalComponent>,
    private ren: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private toastrService: ToastrService,
    private deliveryService: DeliveryService,
    private spinner: NgxSpinnerService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formValues = data.formValues;
    this.CM = data.CM;
    this.CM.availableClaimTypes = data.availableClaimTypes;
    this.deliveryProducts = data.deliveryProducts;
    this.raiseClaimInfo = data.raiseClaimInfo;
    this.baseOrigin = new URL(window.location.href).origin;
    this.selectedProductIndex = data.selectedProductIndex;
    this.selectedProduct = this.deliveryProducts[this.selectedProductIndex];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}

  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  selectParamToRaiseClaim(claimTypeKey, paramKey) {
    this.CM.availableClaimTypes.forEach((typeV, typeK) => {
      typeV.specParams.forEach((specV, specK) => {
        if (typeK != claimTypeKey) {
          specV.isDisabled = true;
        }
      });
    });

    var selectedSpecsInCurrentClaim = 0;
    this.CM.availableClaimTypes[claimTypeKey].specParams.forEach(
      (specV, specK) => {
        if (specV.isSelected) {
          selectedSpecsInCurrentClaim = selectedSpecsInCurrentClaim + 1;
        }
      }
    );

    if (selectedSpecsInCurrentClaim == 0) {
      this.CM.availableClaimTypes.forEach((typeV, typeK) => {
        typeV.specParams.forEach((specV, specK) => {
          if (typeK != claimTypeKey) {
            specV.isDisabled = false;
          }
        });
      });
    }

    if (
      selectedSpecsInCurrentClaim ==
      this.CM.availableClaimTypes[claimTypeKey].specParams.length
    ) {
      this.CM.availableClaimTypes[claimTypeKey].isTypeSelected = true;
    } else {
      this.CM.availableClaimTypes[claimTypeKey].isTypeSelected = false;
    }
  }

  selectAllParamsToRaiseClaim(claimTypeKey, checked) {
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
    this.changeDetectorRef.detectChanges();
  }

  changeGender(e) {}

  closeClick(): void {
    this.dialogRef.close();
  }

  raiseClaim() {
    if (this.raiseClaimInfo) {
      let DeliveryProductId = `${this.raiseClaimInfo.productId}`;
      let specParamsIds = [];
      let claimTypeId;
      this.CM.availableClaimTypes.forEach((typeV, typeK) => {
        typeV.specParams.forEach((specV, specK) => {
          if (specV.isSelected) {
            specParamsIds.push(specV.id);
            claimTypeId = typeV.claim.id;
          }
        });
      });

      this.CM.availableClaimTypes.forEach((v, k) => {
        if (v.isTypeSelected) {
          claimTypeId = v.claim.id;
        }
      });
      if (!claimTypeId) {
        this.toastrService.error('Please select at least one spec parameter');
        return;
      }

      let data = {
        LabTestResultIds: [],
        DeliveryQualityParameterIds: specParamsIds,
        DeliveryProductId: DeliveryProductId,
        ClaimTypeId: claimTypeId
      };
      this.raiseNewClaim(data);
    }
  }

  raiseNewClaim(data) {
    let specParamsIds = [],
      claimId;
    this.CM.availableClaimTypes.forEach((typeV, typeK) => {
      typeV.specParams.forEach((specV, specK) => {
        if (specV.isSelected) {
          specParamsIds.push(specV.id);
          claimId = typeV.id;
        }
      });
    });
    this.CM.availableClaimTypes.forEach((v, k) => {
      if (v.isTypeSelected) {
        claimId = v.id;
      }
    });

    if (!claimId) {
      this.toastrService.error('Please select at least one spec parameter');
      return;
    }

    if (!data) {
      data = {
        LabTestResultIds: specParamsIds,
        DeliveryQualityParameterIds: [],
        DeliveryProductId: null,
        ClaimTypeId: claimId
      };
    }

    this.spinner.show();
    this.deliveryService
      .raiseClaim(data)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastrService.error(response);
        } else {
          localStorage.setItem('raiseNewClaimData', JSON.stringify(response));
          window.location.href = `${this.baseOrigin}/#/claims/claim/edit/`;
        }
      });
  }

  changeProduct(value) {
    let findProductIndex = _.findIndex(
      this.formValues.deliveryProducts,
      function(object: any) {
        return (
          object.product.id == value.product.id &&
          object.product.name == value.product.name
        );
      }
    );
    if (findProductIndex != -1) {
      this.CM.selectedProduct = findProductIndex;
    }
    const product = value;
    if (product.qualityParameters) {
      this.getClaimInfo([...product.qualityParameters], product.id);
    }
  }

  getClaimInfo(specParams, prodId) {
    this.raiseClaimInfo = {};
    this.raiseClaimInfo.allSpecParams = [...specParams];
    this.raiseClaimInfo.productId = prodId;
    this.raiseNewClaimWhenChangeProduct();
  }

  raiseNewClaimWhenChangeProduct() {
    if (
      typeof this.raiseClaimInfo.allSpecParams == 'undefined' ||
      this.raiseClaimInfo.allSpecParams == null
    ) {
      this.toastrService.error('Claim can not be raised for this product!');
      return;
    }
    this.CM.availableClaimTypes = [];
    const claimType = {
      displayName: '',
      claim: {},
      specParams: []
    };
    this.CM.listsCache.ClaimType.forEach((val, ind) => {
      // only allow these 3 types of claim
      if (val.id != 1 && val.id != 3 && val.id != 6 && val.id != 2) {
        return;
      }
      const params = [];
      this.raiseClaimInfo.allSpecParams.forEach((paramVal, paramKey) => {
        if (paramVal.claimTypes) {
          paramVal.claimTypes.forEach((element, key) => {
            if (element.id == val.id) {
              paramVal.disabled = 'false';
              params.push({ ...paramVal });
            }
          });
        }
      });
      const claimType = {
        claim: val,
        specParams: [...params],
        disabled: false,
        displayName: null,
        id: null,
        isTypeSelected: false
      };
      claimType.disabled = true;
      if (params.length > 0) {
        claimType.disabled = false;
      }
      if (this.formValues.feedback) {
        if (
          this.formValues.feedback.hasLetterOfProtest &&
          this.formValues.feedback.hasLetterOfProtest.id == 1
        ) {
          claimType.disabled = false;
        }
      }
      if (val.name == 'Quantity') {
        const claim1: any = {};
        claim1.claim = { ...val };
        claim1.specParams = [...params];
        claim1.disabled = claimType.disabled;
        claim1.displayName = 'Overstated Density';
        claim1.id = 1;
        claim1.isTypeSelected = false;
        this.CM.availableClaimTypes.push({ ...claim1 });
        const claim2: any = {};
        claim2.claim = { ...val };
        claim2.specParams = [];
        claim2.disabled = false;
        if (typeof this.formValues.temp.variances != 'undefined') {
          if (
            typeof this.formValues.temp.variances[
              `product_${this.CM.selectedProduct}`
            ] == 'undefined' ||
            this.formValues.temp.variances[
              `product_${this.CM.selectedProduct}`
            ] == null
          ) {
            claim2.disabled = true;
          }
        } else {
          claim2.disabled = true;
        }
        claim2.displayName = 'Quantity Variance';
        claim2.id = 1;
        claim2.isTypeSelected = false;
        this.CM.availableClaimTypes.push({ ...claim2 });
      }
      if (val.name == 'Compliance') {
        claimType.displayName = 'Sulphur Variance';
        claimType.id = 3;
        this.CM.availableClaimTypes.push(Object.assign({}, claimType));
      }
      if (val.name == 'Quality') {
        claimType.displayName = 'Quality';
        claimType.id = 2;
        this.CM.availableClaimTypes.push(Object.assign({}, claimType));
      }
      if (val.name == 'Others') {
        claimType.displayName = 'Letter of Protest Claim';
        claimType.id = 4;
        this.CM.availableClaimTypes.push(Object.assign({}, claimType));
      }
    });
    this.raiseClaimInfo.currentSpecParamIds = [];
  }
}
