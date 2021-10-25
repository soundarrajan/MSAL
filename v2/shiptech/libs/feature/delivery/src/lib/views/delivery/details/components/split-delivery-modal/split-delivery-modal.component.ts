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
import {
  ColumnsToolPanelModule,
  Optional
} from '@ag-grid-enterprise/all-modules';
import { MatRadioChange } from '@angular/material/radio';
import { Router } from '@angular/router';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { KnownDeliverylRoutes } from 'libs/feature/delivery/src/lib/known-delivery.routes';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'shiptech-split-delivery-modal',
  templateUrl: './split-delivery-modal.component.html',
  styleUrls: ['./split-delivery-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SplitDeliveryModalComponent implements OnInit {
  deliveryProducts: any;
  switchTheme;
  selectedProduct;
  formValues: any;
  splitDeliveryInLimit: any[];
  uoms: any;
  disabledSplitBtn;
  quantityFormat: string;
  constructor(
    public dialogRef: MatDialogRef<SplitDeliveryModalComponent>,
    private ren: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private deliveryService: DeliveryService,
    private router: Router,
    private tenantService: TenantFormattingService,
    @Inject(DecimalPipe) private _decimalPipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.quantityFormat =
      '1.' +
      this.tenantService.quantityPrecision +
      '-' +
      this.tenantService.quantityPrecision;
    this.formValues = data.formValues;
    this.uoms = data.uoms;
    this.initSplitModalContent();
  }

  ngOnInit() {}

  closeClick(): void {
    this.dialogRef.close();
  }

  initSplitModalContent() {
    this.formValues.splitDelivery = {};
    this.formValues.splitDelivery.deliveryId = this.formValues.id;
    this.formValues.splitDelivery.items = [];
    var delProd = {};

    this.formValues.deliveryProducts.forEach((value, _) => {
      delProd = {
        name: value.orderedProduct.name,
        deliveryProductId: value.id,
        initialConfirmedAmount: this.quantityFormatValue(
          value.confirmedQuantityAmount
        ),
        initialConfirmedUom: value.confirmedQuantityUom,
        remainingConfirmedAmount: null,
        remainingConfirmedUom: value.confirmedQuantityUom,
        updateAgreedQuantityAmount: false,
        initialAgreedAmount: this.quantityFormatValue(
          value.agreedQuantityAmount
        ),
        remainingAgreedAmount: null,
        updateVesselQuantityAmount: false,
        initialVesselAmount: this.quantityFormatValue(
          value.vesselQuantityAmount
        ),
        remainingVesselAmount: null,
        updateVesselFlowQuantityAmount: false,
        initialVesselFlowAmount: this.quantityFormatValue(
          value.vesselFlowMeterQuantityAmount
        ),
        remainingVesselFlowAmount: null,
        updateSurveyorQuantityAmount: false,
        initialSurveyorAmount: this.quantityFormatValue(
          value.surveyorQuantityAmount
        ),
        remainingSurveyorAmount: null,
        updateBDNQuantityAmount: false,
        initialBDNAmount: this.quantityFormatValue(value.bdnQuantityAmount),
        remainingBDNAmount: null,
        productId: value.product.id,
        orderProductId: value.orderProductId
      };
      this.formValues.splitDelivery.items.push(delProd);
    });
    let splitLimits = [];
    this.formValues.deliveryProducts.forEach((value, key) => {
      let pair = {
        OrderId: this.formValues.order.id,
        OrderProductId: value.orderProductId, // sending orderProductId in field ProductId, returns in ProductId but its actually orderProductId
        DeliveryId: this.formValues.id
      };
      splitLimits.push(pair);
    });
    this.splitDeliveryInLimit = [];
    this.deliveryService
      .getSplitDeliveryLimits(splitLimits)
      .pipe()
      .subscribe((response: any) => {
        this.formValues.splitDelivery.items.forEach((splitProd, key) => {
          response.forEach((respProd, _) => {
            if (respProd.orderProductId == splitProd.orderProductId) {
              splitProd.orderLimit = respProd.orderLimit;
              splitProd.remainingConfirmedAmount = this.quantityFormatValue(
                respProd.remainingConfirmedAmount
              );
              this.splitDeliveryInLimit[key] = true;
            }
          });
        });
        this.changeDetectorRef.detectChanges();
      });
  }

  quantityFormatValue(value) {
    if (value == 0) {
      if (this.tenantService.quantityPrecision == 0) {
        return 0;
      } else {
        return this._decimalPipe.transform(0, this.quantityFormat);
      }
    }
    if (value == null) {
      return null;
    }
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    let number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if (this.tenantService.quantityPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.quantityFormat);
      }
    }
  }

  disabledSplitDelivery(splitDeliveryInLimit) {
    if (splitDeliveryInLimit.indexOf(false) < 0) {
      return false;
    }
    return true;
  }

  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  changeGender(e) {}

  splitDelivery() {
    let newProductsList = [];
    this.formValues.splitDelivery.items.forEach((split_val, _) => {
      this.formValues.deliveryProducts.forEach((prod_val, key) => {
        if (split_val.deliveryProductId == prod_val.id) {
          if (split_val.remainingConfirmedAmount != 0) {
            newProductsList.push(prod_val);
          }
        }
      });
    });
    this.formValues.deliveryProducts = [...newProductsList];
    this.formValues.splitDelivery.splittedDeliveryId = this.formValues.id;

    localStorage.setItem(
      'parentSplitDelivery',
      JSON.stringify(this.formValues)
    );
    this.dialogRef.close();
    this.router
      .navigate([
        KnownPrimaryRoutes.Delivery,
        `${KnownDeliverylRoutes.Delivery}`,
        0,
        KnownDeliverylRoutes.DeliveryDetails
      ])
      .then(() => {});
  }

  // Only Number
  keyPressNumber(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (inp == '.' || inp == ',' || inp == '-') {
      return true;
    }
    if (/^[-,+]*\d{1,6}(,\d{3})*(\.\d*)?$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
