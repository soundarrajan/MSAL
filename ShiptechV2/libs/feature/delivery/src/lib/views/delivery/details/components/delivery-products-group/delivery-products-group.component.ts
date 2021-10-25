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
  ChangeDetectorRef
} from '@angular/core';
import { Select } from '@ngxs/store';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
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
  NativeDateAdapter
} from '@angular/material/core';
import moment from 'moment';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { DecimalPipe } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { throws } from 'assert';

export const PICK_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

export class PickDateAdapter extends NativeDateAdapter {
  format(value: Date, displayFormat: string): string {
    if (value === null || value === undefined) return undefined;
    return moment(value).format(dateTimeAdapter.fromDotNet(displayFormat));
  }
}

@Component({
  selector: 'shiptech-delivery-products-group',
  templateUrl: './delivery-products-group.component.html',
  styleUrls: ['./delivery-products-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    OrderListGridViewModel,
    DialogService,
    ConfirmationService,
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ]
})
export class DeliveryProductsGroupComponent
  extends DeliveryAutocompleteComponent
  implements OnInit {
  @Input() data;
  toleranceLimits: any;
  formValues: any;
  openedScreenLoaders: number = 0;
  uoms: any;
  quantityCategory: any;
  summaryProducts: any;
  quantityFormat: string;
  @Input() eventsSaveButton: Observable<void>;
  @Input() eventsChangedOrderNumber: Observable<void>;
  @Input() eventsConversionInfoData: Observable<void>;
  eventsSaveButtonSubscription: any;
  buttonClicked: any;
  eventsConversionInfoDataSubscription: Subscription;
  eventsOrderNumberSubscription: Subscription;
  uomVolume: any;
  uomMass: any;
  pumpingRateUom: any;
  expandProductPopUp: any = false;
  @ViewChild('mySelect') mySelect: MatSelect;
  searchProductInput: any;

  @Input('quantityCategory') set _setQuantityCategory(quantityCategory) {
    if (!quantityCategory) {
      return;
    }
    this.quantityCategory = quantityCategory;
  }

  @Input('pumpingRateUom') set _setPumpingRateUom(pumpingRateUom) {
    if (!pumpingRateUom) {
      return;
    }
    this.pumpingRateUom = pumpingRateUom;
  }

  @Input('uoms') set _setUoms(uoms) {
    if (!uoms) {
      return;
    }
    this.uoms = uoms;
  }

  @Input('uomVolume') set _setUomVolume(uomVolume) {
    if (!uomVolume) {
      return;
    }
    this.uomVolume = uomVolume;
  }

  @Input('uomMass') set _setUomMass(uomMass) {
    if (!uomMass) {
      return;
    }
    this.uomMass = uomMass;
  }

  @Input('conversionInfoData') set _setConversionInfoData(conversionInfoData) {
    if (!conversionInfoData) {
      return;
    }
    this.conversionInfoData = conversionInfoData;
  }

  @Input('model') set _setFormValues(formValues) {
    if (!formValues) {
      return;
    }
    this.formValues = formValues;
    this.changeDetectorRef.detectChanges();
  }

  @Input('finalQuantityRules') set _setFinalQuantityRules(finalQuantityRules) {
    if (!finalQuantityRules) {
      return;
    }
    this.finalQuantityRules = finalQuantityRules;
  }

  @Input('toleranceLimits') set _setToleranceLimits(toleranceLimits) {
    if (!toleranceLimits) {
      return;
    }
    this.toleranceLimits = toleranceLimits;
  }

  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;

  deliveryForm: FormGroup;
  displayedColumns: string[] = ['product', 'productType'];
  selectedProductToAddInDelivery: any;
  deliveryProducts: any[] = [];
  hideDropdown: boolean;
  conversionInfoData: any = [];
  finalQuantityRules: any;
  selectedProduct: number = 0;
  deliveryFormSubject: Subject<any> = new Subject<any>();
  conversionDataInfoSubject: Subject<any> = new Subject<any>();
  requiredInfoSubject: Subject<any> = new Subject<any>();

  @Output() onProductSelected = new EventEmitter<any>();
  @Output() onConversionSelected = new EventEmitter<any>();
  constructor(
    public gridViewModel: OrderListGridViewModel,
    public bdnInformationService: BdnInformationApiService,
    @Inject(VESSEL_MASTERS_API_SERVICE) private mastersApi: IVesselMastersApi,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private appConfig: AppConfig,
    private httpClient: HttpClient,
    changeDetectorRef: ChangeDetectorRef,
    private deliveryService: DeliveryService,
    @Inject(MAT_DATE_FORMATS) private dateFormats,
    private format: TenantFormattingService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(DecimalPipe) private _decimalPipe,
    private tenantService: TenantFormattingService
  ) {
    super(changeDetectorRef);
    this.quantityFormat =
      '1.' +
      this.tenantService.quantityPrecision +
      '-' +
      this.tenantService.quantityPrecision;
  }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe(data =>
      this.setDeliveryForm(data)
    );
    this.eventsSaveButtonSubscription = this.eventsSaveButton.subscribe(data =>
      this.setRequiredFields(data)
    );
    this.eventsConversionInfoDataSubscription = this.eventsConversionInfoData.subscribe(
      data => this.setConversionInfo(data)
    );
    this.eventsOrderNumberSubscription = this.eventsChangedOrderNumber.subscribe(
      data => this.orderNumberChanged(data)
    );
  }

  orderNumberChanged(data) {
    this.hideDropdown = !data;
  }

  setConversionInfo(conversionInfoData) {
    this.conversionInfoData = conversionInfoData;
    this.conversionDataInfoSubject.next(this.conversionInfoData);
  }

  setRequiredFields(data) {
    this.buttonClicked = data;
    this.requiredInfoSubject.next(this.buttonClicked);
  }

  setDeliveryForm(form) {
    if (!form) {
      return;
    }
    this.formValues = form;
    if (
      this.formValues.temp.deliverysummary &&
      this.formValues.temp.deliverysummary.products
    ) {
      this.formValues.temp.deliverySummaryProducts = [
        ...this.formValues.temp.deliverysummary.products
      ];
    }
    this.deliveryFormSubject.next(this.formValues);
    this.hideDropdown = false;
  }

  ngAfterViewInit(): void {}

  quantityFormatValue(value) {
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    if (plainNumber) {
      if (this.tenantService.quantityPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.quantityFormat);
      }
    }
  }

  addSelectedProductInDelivery(selectedProductToAddInDelivery) {
    if (!this.formValues.deliveryProducts) {
      this.formValues.deliveryProducts = [];
    }
    var productAlreadyExist = false;
    this.formValues.deliveryProducts.forEach((deliveryProduct, _) => {
      if (deliveryProduct.orderProductId == selectedProductToAddInDelivery.id) {
        productAlreadyExist = true;
      }
    });
    if (productAlreadyExist) {
      this.selectedProductToAddInDelivery = null;
      return this.toastr.error(
        'The selected product is already added to delivery'
      );
    }

    let newProductData: any = {};
    let orderProductId = selectedProductToAddInDelivery.id;

    if (selectedProductToAddInDelivery.specGroup) {
      let orderProductSpecGroupId = selectedProductToAddInDelivery.specGroup.id;
      var data = {
        Payload: {
          Filters: [
            {
              ColumnName: 'OrderProductId',
              Value: orderProductId
            },
            {
              ColumnName: 'SpecGroupId',
              Value: orderProductSpecGroupId
            }
          ]
        }
      };
      this.openedScreenLoaders += 1;
      this.spinner.show();
      this.deliveryService
        .loadDeliverySpecParameters(data)
        .pipe(
          finalize(() => {
            this.openedScreenLoaders -= 1;
            if (!this.openedScreenLoaders) {
              this.spinner.hide();
            }
          })
        )
        .subscribe((result: any) => {
          if (typeof result == 'string') {
            this.toastr.error(result);
          } else {
            newProductData.qualityHeader = {};
            newProductData.qualityParameters = result;
            if (newProductData.qualityParameters) {
              newProductData.qualityParameters.forEach(
                (productParameter, key1) => {
                  productParameter.specParameter.name = this.decodeSpecificField(
                    productParameter.specParameter.name
                  );
                }
              );
            }
            this.changeDetectorRef.detectChanges();
            this.deliveryFormSubject.next(this.formValues);
          }
        });
      this.openedScreenLoaders += 1;
      this.deliveryService
        .loadDeliveryQuantityParameters(data)
        .pipe(
          finalize(() => {
            this.openedScreenLoaders -= 1;
            if (!this.openedScreenLoaders) {
              this.spinner.hide();
            }
          })
        )
        .subscribe((result: any) => {
          if (typeof result == 'string') {
            this.toastr.error(result);
          } else {
            newProductData.quantityHeader = {};
            newProductData.quantityParameters = result;
            this.deliveryFormSubject.next(this.formValues);
            this.changeDetectorRef.detectChanges();
          }
        });
      newProductData.confirmedQuantityAmount = this.quantityFormatValue(
        selectedProductToAddInDelivery.orderedQuantity.amount
      );
      newProductData.confirmedQuantityUom =
        selectedProductToAddInDelivery.orderedQuantity.uom;
      // set default uoms
      newProductData.surveyorQuantityUom =
        selectedProductToAddInDelivery.orderedQuantity.uom;
      newProductData.vesselQuantityUom =
        selectedProductToAddInDelivery.orderedQuantity.uom;
      newProductData.agreedQuantityUom =
        selectedProductToAddInDelivery.orderedQuantity.uom;
      newProductData.bdnQuantityUom =
        selectedProductToAddInDelivery.orderedQuantity.uom;
      newProductData.vesselFlowMeterQuantityUom =
        selectedProductToAddInDelivery.orderedQuantity.uom;
      newProductData.finalQuantityUom =
        selectedProductToAddInDelivery.orderedQuantity.uom;
      newProductData.product = selectedProductToAddInDelivery.product;
      newProductData.orderedProduct = selectedProductToAddInDelivery.product;
      // add buyer and seller quantity types
      newProductData.sellerQuantityType = this.formValues.temp.sellerPrecedenceRule;
      newProductData.buyerQuantityType = this.formValues.temp.buyerPrecedenceRule;
      // add physical supplier -- orderProductId
      newProductData.physicalSupplier =
        selectedProductToAddInDelivery.physicalSupplier;
      newProductData.productTypeId =
        selectedProductToAddInDelivery.productType.id;
      // set orderproductid
      newProductData.orderProductId = selectedProductToAddInDelivery.id;
      newProductData.manualPricingDateOverride =
        selectedProductToAddInDelivery.manualPricingDateOverride;

      newProductData.convFactorOptions =
        selectedProductToAddInDelivery.convFactorOptions;
      newProductData.convFactorMassUom =
        selectedProductToAddInDelivery.convFactorMassUom;
      newProductData.convFactorValue =
        selectedProductToAddInDelivery.convFactorValue;
      newProductData.convFactorVolumeUom =
        selectedProductToAddInDelivery.convFactorVolumeUom;

      // add pricing date
      // add pricing date
      this.formValues.temp.deliverysummary.products.forEach(
        (summaryProd, _) => {
          if (summaryProd.id == selectedProductToAddInDelivery.orderProductId) {
            if (summaryProd.pricingDate != null) {
              newProductData.pricingDate = summaryProd.pricingDate;
            } else {
              newProductData.pricingDate = this.formValues.temp.deliverysummary.deliveryDate;
            }
          }
        }
      );
      this.selectedProductToAddInDelivery = null;
      this.hideDropdown = true;
      this.formValues.deliveryProducts.push(newProductData);
      //this.changeDetectorRef.detectChanges();
      // this.deliveryFormSubject.next(this.formValues);
      this.openedScreenLoaders += 1;
      this.deliveryService
        .loadConversionInfo(selectedProductToAddInDelivery.product.id)
        .pipe(
          finalize(() => {
            this.openedScreenLoaders -= 1;
            if (!this.openedScreenLoaders) {
              this.spinner.hide();
            }
          })
        )
        .subscribe(response => {
          if (typeof response == 'string') {
            this.toastr.error(response);
          } else {
            let productIndex = this.formValues.deliveryProducts.length - 1;
            this.selectedProduct = productIndex;
            this.selectProduct(productIndex);
            this.conversionInfoData[this.selectedProduct] = response;
            this.calculateVarianceAndReconStatus(productIndex);
            // this.orderProductsByProductType('deliveryProducts');
            this.orderProductsByProductType('summaryProducts');
            this.changeDetectorRef.detectChanges();
            this.deliveryFormSubject.next(this.formValues);
            //this.conversionDataInfoSubject.next(this.conversionInfoData);
          }
        });
    } else {
      this.toastr.error('Selected product does not have a Spec Group defined.');
    }
  }

  setQuantityFormat(value) {
    let viewValue = `${value}`;
    let plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
    return plainNumber;
  }

  calculateVarianceAndReconStatus(productIdx) {
    // function called for all quantities, call here calculate final quantity
    this.calculateFinalQuantity(productIdx);
    let confirmedQuantityUom,
      vesselQuantityUom,
      bdnQuantityUom,
      vesselFlowMeterQuantityUom,
      surveyorQuantityUom;
    let conversionInfo = this.conversionInfoData[productIdx];
    let activeProduct = this.formValues.deliveryProducts[productIdx];
    // get fields values and uom
    activeProduct.confirmedQuantityUom == null
      ? (confirmedQuantityUom = null)
      : (confirmedQuantityUom = activeProduct.confirmedQuantityUom.name);
    activeProduct.vesselQuantityUom == null
      ? (vesselQuantityUom = null)
      : (vesselQuantityUom = activeProduct.vesselQuantityUom.name);
    activeProduct.bdnQuantityUom == null
      ? (bdnQuantityUom = null)
      : (bdnQuantityUom = activeProduct.bdnQuantityUom.name);
    activeProduct.vesselFlowMeterQuantityUom == null
      ? (vesselFlowMeterQuantityUom = null)
      : (vesselFlowMeterQuantityUom =
          activeProduct.vesselFlowMeterQuantityUom.name);
    // activeProduct.bargeFlowMeterQuantityUom == null ? bargeFlowMeterQuantityUom = null : bargeFlowMeterQuantityUom = activeProduct.bargeFlowMeterQuantityUom.name;
    activeProduct.surveyorQuantityUom == null
      ? (surveyorQuantityUom = null)
      : (surveyorQuantityUom = activeProduct.surveyorQuantityUom.name);
    let Confirm = {
      val: this.setQuantityFormat(activeProduct.confirmedQuantityAmount),
      uom: confirmedQuantityUom
    };
    let Vessel = {
      val: this.setQuantityFormat(activeProduct.vesselQuantityAmount),
      uom: vesselQuantityUom
    };
    let Bdn = {
      val: this.setQuantityFormat(activeProduct.bdnQuantityAmount),
      uom: bdnQuantityUom
    };
    let VesselFlowMeter = {
      val: this.setQuantityFormat(activeProduct.vesselFlowMeterQuantityAmount),
      uom: vesselFlowMeterQuantityUom
    };
    // BargeFlowMeter = {
    //     'val': activeProduct.bargeFlowMeterQuantityAmount,
    //     'uom': bargeFlowMeterQuantityUom
    // };
    let Surveyor = {
      val: this.setQuantityFormat(activeProduct.surveyorQuantityAmount),
      uom: surveyorQuantityUom
    };
    let currentFieldValues = {
      Confirm: Confirm,
      Vessel: Vessel,
      Bdn: Bdn,
      VesselFlowMeter: VesselFlowMeter,
      Surveyor: Surveyor
    };
    // "BargeFlowMeter": BargeFlowMeter,
    let fieldUoms = {
      Confirm: 'confirmedQuantityUom',
      Vessel: 'vesselQuantityUom',
      Bdn: 'bdnQuantityUom',
      VesselFlowMeter: 'vesselFlowMeterQuantityUom',
      Surveyor: 'surveyorQuantityUom'
    };
    // "BargeFlowMeter": 'bargeFlowMeterQuantityUom',
    let convertedFields: any = {};
    let baseUom: any = {};
    let convFact = 1;
    if (typeof conversionInfo == 'undefined') {
      conversionInfo = {};
    }
    if (
      productIdx == 0 &&
      typeof this.formValues.temp.variances == 'undefined'
    ) {
      this.formValues.temp.variances = [];
    }
    if (
      this.formValues.deliveryProducts[productIdx].sellerQuantityType &&
      typeof this.formValues.deliveryProducts[productIdx].sellerQuantityType
        .name != 'undefined'
    ) {
      let uomObjId =
        fieldUoms[
          this.formValues.deliveryProducts[productIdx].sellerQuantityType.name
        ];
      baseUom = this.formValues.deliveryProducts[productIdx][uomObjId];
    }
    if (!baseUom) {
      this.formValues.temp.variances[`uom_${productIdx}`] = null;
      this.formValues.temp.variances[`product_${productIdx}`] = null;
      this.setVarianceColor(productIdx);
      // return;
    }

    const currentFieldValuesProps = Object.keys(currentFieldValues);
    for (let fieldKey of currentFieldValuesProps) {
      const fieldVal = currentFieldValues[fieldKey];
      conversionInfo.uomConversionFactors.forEach((factVal, factKey) => {
        if (fieldVal.uom == factVal.sourceUom.name) {
          const convertedValue = fieldVal.val * factVal.conversionFactor;
          convertedFields[fieldKey] = convertedValue;
        }
      });
    }
    if (baseUom && conversionInfo.toleranceQuantityUom) {
      if (baseUom.name != conversionInfo.toleranceQuantityUom.name) {
        conversionInfo.uomConversionFactors.forEach((factVal, factKey) => {
          if (baseUom.name == factVal.sourceUom.name) {
            convFact = factVal.conversionFactor;
          }
        });
      } else {
        convFact = 1;
      }
    }

    this.formValues.temp.variances[`mfm_product_${productIdx}`] = null;
    this.formValues.temp.variances[`mfm_uom_${productIdx}`] = null;
    if (
      activeProduct.vesselFlowMeterQuantityUom &&
      activeProduct.bdnQuantityUom &&
      activeProduct.bdnQuantityAmount &&
      activeProduct.vesselFlowMeterQuantityAmount
    ) {
      let mfm_baseUom = activeProduct.vesselFlowMeterQuantityUom;
      if (mfm_baseUom && conversionInfo.toleranceQuantityUom) {
        if (mfm_baseUom.name != conversionInfo.toleranceQuantityUom.name) {
          conversionInfo.uomConversionFactors.forEach((factVal, factKey) => {
            if (mfm_baseUom.name == factVal.sourceUom.name) {
              var mfm_convFact = factVal.conversionFactor;
            }
          });
        } else {
          var mfm_convFact = 1;
        }
        var mfm_qty = convertedFields.VesselFlowMeter;
        var bdn_qty = convertedFields.Bdn;
        var variance = mfm_qty - bdn_qty;
        var mfm_variance = (mfm_qty - bdn_qty) / mfm_convFact;
        this.formValues.temp.variances[
          `mfm_product_${productIdx}`
        ] = this._decimalPipe.transform(mfm_variance, this.quantityFormat);
        this.formValues.temp.variances[`mfm_uom_${productIdx}`] =
          mfm_baseUom.name;
      }
    }

    if (!activeProduct.buyerQuantityType) {
      return;
    }
    if (!activeProduct.sellerQuantityType) {
      return;
    }
    var buyerOption = activeProduct.buyerQuantityType.name;
    var sellerOption = activeProduct.sellerQuantityType.name;
    var buyerConvertedValue = convertedFields[buyerOption];
    var sellerConvertedValue = convertedFields[sellerOption];
    if (!sellerConvertedValue || !buyerConvertedValue) {
      variance = null;
      this.formValues.temp.variances[`product_${productIdx}`] = variance;
      this.setVarianceColor(productIdx);
    } else {
      // this is where variance is calculated. rn it's buyer - seler (15/08)
      variance = buyerConvertedValue - sellerConvertedValue;

      //
      var varianceDisplay = variance / convFact;
      this.formValues.temp.variances[
        `product_${productIdx}`
      ] = this._decimalPipe.transform(varianceDisplay, this.quantityFormat);
      this.formValues.temp.variances[`uom_${productIdx}`] = baseUom.name;
      this.setVarianceColor(productIdx);
    }
    if (typeof this.formValues.temp.reconStatus == 'undefined') {
      this.formValues.temp.reconStatus = [];
    }
    if (variance != null) {
      if (conversionInfo.quantityReconciliation.name == 'Flat') {
        if (variance < conversionInfo.minToleranceLimit) {
          this.formValues.temp.reconStatus[`product_${productIdx}`] = 1; // Matched Green
        }
        if (
          variance > conversionInfo.minToleranceLimit &&
          variance < conversionInfo.maxToleranceLimit
        ) {
          this.formValues.temp.reconStatus[`product_${productIdx}`] = 2; // Unmatched Amber
        }
        if (variance > conversionInfo.maxToleranceLimit) {
          this.formValues.temp.reconStatus[`product_${productIdx}`] = 3; // Unmatched Red
        }
      } else {
        var minValue =
          (conversionInfo.minToleranceLimit *
            this.formValues.deliveryProducts[productIdx]
              .confirmedQuantityAmount) /
          100;
        var maxValue =
          (conversionInfo.maxToleranceLimit *
            this.formValues.deliveryProducts[productIdx]
              .confirmedQuantityAmount) /
          100;
        if (variance < minValue) {
          this.formValues.temp.reconStatus[`product_${productIdx}`] = 1; // Matched Green
        }
        if (variance > minValue && variance < maxValue) {
          this.formValues.temp.reconStatus[`product_${productIdx}`] = 2; // Unmatched Amber
        }
        if (variance > maxValue) {
          this.formValues.temp.reconStatus[`product_${productIdx}`] = 3; // Unmatched Red
        }
      }
    } else {
      this.formValues.temp.reconStatus[`product_${productIdx}`] = null;
    }

    // Update buyer & seller amount and uom
    this.setBuyerSellerQuantityAndUom('buyer');
    this.setBuyerSellerQuantityAndUom('seller');
  }

  calculateFinalQuantity(productIdx) {
    if (typeof productIdx == 'undefined') {
      return;
    }
    if (typeof this.formValues.deliveryProducts[productIdx] == 'undefined') {
      return;
    }
    let dataSet = false;

    // rules are in order, check for each if quantity exists and set that
    // if not, go on
    for (let i = 0; i < this.finalQuantityRules.length; i++) {
      let rule = this.finalQuantityRules[i];
      if (
        typeof this.formValues.deliveryProducts[productIdx][
          `${rule.deliveryMapping}Uom`
        ] != 'undefined' &&
        this.formValues.deliveryProducts[productIdx][
          `${rule.deliveryMapping}Amount`
        ] != '' &&
        this.formValues.deliveryProducts[productIdx][
          `${rule.deliveryMapping}Amount`
        ] != null
      ) {
        // quantity exists, set it
        this.formValues.deliveryProducts[
          productIdx
        ].finalQuantityUom = this.formValues.deliveryProducts[productIdx][
          `${rule.deliveryMapping}Uom`
        ];
        this.formValues.deliveryProducts[
          productIdx
        ].finalQuantityAmount = this.formValues.deliveryProducts[productIdx][
          `${rule.deliveryMapping}Amount`
        ];
        dataSet = true;
      }
      if (dataSet) {
        break;
      } // break loop
    }

    if (!dataSet) {
      this.formValues.deliveryProducts[productIdx].finalQuantityUom = null;
      this.formValues.deliveryProducts[productIdx].finalQuantityAmount = null;
    }
  }

  setVarianceColor(idx) {
    // debugger
    if (typeof this.formValues.temp.variances[`color_${idx}`] == 'undefined') {
      this.formValues.temp.variances[`color_${idx}`] = '';
    }
    if (
      typeof this.formValues.temp.variances[`mfm_color_${idx}`] == 'undefined'
    ) {
      this.formValues.temp.variances[`mfm_color_${idx}`] = '';
    }

    if (this.formValues.temp.variances[`product_${idx}`] != null) {
      // new color code
      // 1. If the variance is Negative value and exceeds Max tolerance, then display the “Variance Qty” value field in “Red” colour
      // 2. If the variance is Negative value and less than Max tolerance, then display the “Variance Qty” value field in “Amber” colour
      // 3. If the variance is Positive value, then display the “Variance Qty” value field in “Green” colour

      if (parseFloat(this.formValues.temp.variances[`product_${idx}`]) < 0) {
        // 1 or 2
        if (
          Math.abs(
            parseFloat(this.formValues.temp.variances[`product_${idx}`])
          ) < parseFloat(this.toleranceLimits.maxToleranceLimit)
        ) {
          this.formValues.temp.variances[`color_${idx}`] = 'amber';
        }

        if (
          Math.abs(
            parseFloat(this.formValues.temp.variances[`product_${idx}`])
          ) >= parseFloat(this.toleranceLimits.maxToleranceLimit)
        ) {
          this.formValues.temp.variances[`color_${idx}`] = 'red';
        }
      } else {
        this.formValues.temp.variances[`color_${idx}`] = 'green';
      }
    } else {
      // if variance is null, set color to white
      this.formValues.temp.variances[`color_${idx}`] = 'white';
    }

    if (this.formValues.temp.variances[`mfm_product_${idx}`] != null) {
      if (
        parseFloat(this.formValues.temp.variances[`mfm_product_${idx}`]) < 0
      ) {
        if (
          Math.abs(
            parseFloat(this.formValues.temp.variances[`mfm_product_${idx}`])
          ) <= parseFloat(this.toleranceLimits.maxToleranceLimit)
        ) {
          this.formValues.temp.variances[`mfm_color_${idx}`] = 'amber';
        }

        if (
          Math.abs(
            parseFloat(this.formValues.temp.variances[`mfm_product_${idx}`])
          ) > parseFloat(this.toleranceLimits.maxToleranceLimit)
        ) {
          this.formValues.temp.variances[`mfm_color_${idx}`] = 'red';
        }
      } else {
        this.formValues.temp.variances[`mfm_color_${idx}`] = 'green';
      }
    } else {
      // if variance is null, set color to white
      this.formValues.temp.variances[`mfm_color_${idx}`] = 'white';
    }
  }

  setBuyerSellerQuantityAndUom(qtyToChange) {
    if (qtyToChange == 'seller') {
      let sellerQty = this.formValues.temp.sellerPrecedenceRule.name;
      if (sellerQty == 'Surveyor') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityUom = this.formValues.deliveryProducts[
            key
          ].surveyorQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].surveyorQuantityAmount;
        });
      }
      if (sellerQty == 'Bdn') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityUom = this.formValues.deliveryProducts[
            key
          ].bdnQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].bdnQuantityAmount;
        });
      }
      if (sellerQty == 'Vessel') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityUom = this.formValues.deliveryProducts[
            key
          ].vesselQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].vesselQuantityAmount;
        });
      }
      if (sellerQty == 'VesselFlowMeter') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityUom = this.formValues.deliveryProducts[
            key
          ].vesselFlowMeterQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].vesselFlowMeterQuantityAmount;
        });
      }
      if (sellerQty == 'Confirm') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityUom = this.formValues.deliveryProducts[
            key
          ].confirmedQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].confirmedQuantityAmount;
        });
      }
    }

    if (qtyToChange == 'buyer') {
      let buyerQty = this.formValues.temp.buyerPrecedenceRule.name;
      if (buyerQty == 'Surveyor') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityUom = this.formValues.deliveryProducts[
            key
          ].surveyorQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].surveyorQuantityAmount;
        });
      }
      if (buyerQty == 'Bdn') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityUom = this.formValues.deliveryProducts[
            key
          ].bdnQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].bdnQuantityAmount;
        });
      }
      if (buyerQty == 'Vessel') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityUom = this.formValues.deliveryProducts[
            key
          ].vesselQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].vesselQuantityAmount;
        });
      }
      if (buyerQty == 'VesselFlowMeter') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityUom = this.formValues.deliveryProducts[
            key
          ].vesselFlowMeterQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].vesselFlowMeterQuantityAmount;
        });
      }
      if (buyerQty == 'Confirm') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityUom = this.formValues.deliveryProducts[
            key
          ].confirmedQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].confirmedQuantityAmount;
        });
      }
    }

    // function called for all quantities, call here calculate final quantity
    this.calculateFinalQuantity(this.selectedProduct);
  }

  orderProductsByProductType(listName) {
    if (listName == 'deliveryProducts') {
      this.formValues.deliveryProducts = _.orderBy(
        this.formValues.deliveryProducts,
        ['productTypeId'],
        ['asc']
      );
      // set CM.selectedProduct and initial selectedProduct
      this.formValues.temp.savedProdForCheck = this.formValues.deliveryProducts[0].product;
    }
    if (listName == 'summaryProducts') {
      this.formValues.temp.deliverysummary.products = _.orderBy(
        this.formValues.temp.deliverysummary.products,
        ['productType.id'],
        ['asc']
      );
    }
  }

  selectProduct(key) {
    this.selectedProduct = key;
    this.onProductSelected.emit(this.selectedProduct);
    this.onConversionSelected.emit(this.conversionInfoData);
  }

  addNewProduct() {
    this.hideDropdown = false;
  }

  search(value: string): void {
    let filterSummaryProducts = this.formValues.temp.deliverysummary.products.filter(
      summaryProd => summaryProd.product.name.toLowerCase().includes(value)
    );
    this.formValues.temp.deliverySummaryProducts = [...filterSummaryProducts];
  }

  deleteDeliveryProduct(productId, productIdx) {
    if (this.formValues.deliveryStatus) {
      if (this.formValues.deliveryStatus.name == 'Verified') {
        return;
      }
    }
    if (typeof productId == 'undefined') {
      // simply erase product from list
      let okay = false;
      this.formValues.deliveryProducts.forEach((v, k) => {
        if (typeof v.id == 'undefined') {
          if (k == productIdx) {
            okay = true;
          }
        }
      });

      if (okay) {
        // product is there and not saved
        this.formValues.deliveryProducts.splice(productIdx, 1);
        this.selectedProduct = 0;
      }
    } else {
      // make call to delete product
      this.toastr.info('Deleting product...');
      this.spinner.show();
      this.deliveryService
        .deleteDeliveryProduct(productId)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          })
        )
        .subscribe(response => {
          if (typeof response == 'string') {
            this.toastr.error(response);
          } else {
            this.toastr.success('Product deleted!');
            this.formValues.deliveryProducts.splice(productIdx, 1);
            this.selectedProduct = 0;
          }
        });
    }
  }

  decodeSpecificField(modelValue) {
    let decode = function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
    };
    return decode(_.unescape(modelValue));
  }

  openAddProductSelect() {
    this.searchProductInput = null;
    if (
      this.formValues.temp.deliverysummary &&
      this.formValues.temp.deliverysummary.products
    ) {
      this.formValues.temp.deliverySummaryProducts = [
        ...this.formValues.temp.deliverysummary.products
      ];
      this.changeDetectorRef.detectChanges();
    }
    this.mySelect.close();
    this.mySelect.open();
  }
}
