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
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import moment from 'moment';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import _ from 'lodash';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { IDeliveryTenantSettings } from 'libs/feature/delivery/src/lib/core/settings/delivery-tenant-settings';
import { DecimalPipe } from '@angular/common';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { throws } from 'assert';

import { MastersListApiService } from '@shiptech/core/delivery-api/masters-list/masters-list-api.service'
export const PICK_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
  parse: {
    dateInput: 'DD MMM YYYY'
  }
};


export class PickDateAdapter extends NativeDateAdapter {
  format(value: Date, displayFormat: string): string {
    if (value === null || value === undefined) return '';
    let currentFormat = displayFormat;
    let hasDayOfWeek;
    if (currentFormat.startsWith('DDD ')) {
        hasDayOfWeek = true;
        currentFormat = currentFormat.split('DDD ')[1];
    }
    currentFormat = currentFormat.replace(/d/g, 'D');
    currentFormat = currentFormat.replace(/y/g, 'Y');
    currentFormat = currentFormat.split(' HH:mm')[0];
    let formattedDate = moment(value).format(currentFormat);
    if (hasDayOfWeek) {
      formattedDate = `${moment(value).format('ddd') } ${ formattedDate}`;
    }
    return formattedDate;
  }


  parse(value) {
    // We have no way using the native JS Date to set the parse format or locale, so we ignore these
    // parameters.
    let currentFormat = PICK_FORMATS.display.dateInput;
    let hasDayOfWeek;
    if (currentFormat.startsWith('DDD ')) {
        hasDayOfWeek = true;
        currentFormat = currentFormat.split('DDD ')[1];
    }
    currentFormat = currentFormat.replace(/d/g, 'D');
    currentFormat = currentFormat.replace(/y/g, 'Y');
    currentFormat = currentFormat.split(' HH:mm')[0];
    let elem = moment(value, currentFormat);
    let date = elem.toDate();
    return value ? date : null;
  }

}



@Component({
  selector: 'shiptech-delivery-product',
  templateUrl: './delivery-product.component.html',
  styleUrls: ['./delivery-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [OrderListGridViewModel,
              DialogService,
              ConfirmationService,
              {provide: DateAdapter, useClass: PickDateAdapter},
              {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS}]
})
export class DeliveryProductComponent extends DeliveryAutocompleteComponent
  implements OnInit{
  switchTheme; //false-Light Theme, true- Dark Theme
  uomList$: any;
  text: any;
  uoms: any;
  quantityCategory: any;
  selectedProduct: any;
  quantityFormat: string;
  events1Subscription: Subscription;
  isPricingEventDateInvalid: boolean;
  buttonClicked: any;
  events2Subscription: Subscription;
  uomVolume: any;
  uomMass: any;
  deliveredQuantityUoms: any;
  pumpingRateUom: any;


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
    this.deliveredQuantityUoms = uoms;
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

  @Input('buttonClicked') set _setButtonClicked(buttonClicked) {
    if (!buttonClicked) {
      return;
    }
    this.buttonClicked = buttonClicked;
  }


  @Input() set autocompleteType(value: string) {
    this._autocompleteType = value;
  }

  get entityId(): number {
    return this._entityId;
  }

  get entityName(): string {
    return this._entityName;
  }

  @Input() set entityId(value: number) {
    this._entityId = this.formValues.deliveryProducts[this.deliveryProductIndex].productTypeId;
    this.gridViewModel.entityId = this.formValues.deliveryProducts[this.deliveryProductIndex].productTypeId;
  }

  @Input() set entityName(value: string) {
    this._entityName = value;
    this.gridViewModel.entityName = this.entityName;
  }

  @Input() vesselId: number;
  @Input() data;

  autocompleteVessel: knownMastersAutocomplete;
  _entityId: number;
  _entityName: string;
  toleranceLimits: any;
  deliveryProductIndex: any;
  productList$: any;
  filteredOptions: any;
  options: any;
  productList: any[];
  private _autocompleteType: any;
  @Input('formValues') set _setFormValues(formValues) {
    if (!formValues) {
      return;
    }
    this.formValues = formValues;
  }

  @Input('deliveryProductIndex') set _setDeliveryProductIndex(deliveryProductIndex) {
    if (!deliveryProductIndex) {
      return;
    }
    this.deliveryProductIndex = deliveryProductIndex;
    if (this.formValues.deliveryProducts[this.deliveryProductIndex]){
      this.deliveryProduct = this.formValues.deliveryProducts[this.deliveryProductIndex];
    }
    if (this.formValues.deliveryProducts[this.deliveryProductIndex].confirmedQuantityAmount) {
      this.formValues.deliveryProducts[this.deliveryProductIndex].confirmedQuantityAmount = this.quantityFormatValue(this.formValues.deliveryProducts[this.deliveryProductIndex].confirmedQuantityAmount);
    }
    if (this.formValues.deliveryProducts[this.deliveryProductIndex].bdnQuantityAmount) {
      this.formValues.deliveryProducts[this.deliveryProductIndex].bdnQuantityAmount = this.quantityFormatValue(this.formValues.deliveryProducts[this.deliveryProductIndex].bdnQuantityAmount);
    }
    if (this.formValues.deliveryProducts[this.deliveryProductIndex].vesselQuantityAmount) {
      this.formValues.deliveryProducts[this.deliveryProductIndex].vesselQuantityAmount = this.quantityFormatValue(this.formValues.deliveryProducts[this.deliveryProductIndex].vesselQuantityAmount);
    }
    if (this.formValues.deliveryProducts[this.deliveryProductIndex].surveyorQuantityAmount) {
      this.formValues.deliveryProducts[this.deliveryProductIndex].surveyorQuantityAmount = this.quantityFormatValue(this.formValues.deliveryProducts[this.deliveryProductIndex].surveyorQuantityAmount);
    }
    if (this.formValues.deliveryProducts[this.deliveryProductIndex].vesselFlowMeterQuantityAmount) {
      this.formValues.deliveryProducts[this.deliveryProductIndex].vesselFlowMeterQuantityAmount = this.quantityFormatValue(this.formValues.deliveryProducts[this.deliveryProductIndex].vesselFlowMeterQuantityAmount);
    }
    if (this.formValues.deliveryProducts[this.deliveryProductIndex].finalQuantityAmount) {
      this.formValues.deliveryProducts[this.deliveryProductIndex].finalQuantityAmount = this.quantityFormatValue(this.formValues.deliveryProducts[this.deliveryProductIndex].finalQuantityAmount);
    }
    if (this.formValues.deliveryProducts[this.deliveryProductIndex].agreedQuantityAmount) {
      this.formValues.deliveryProducts[this.deliveryProductIndex].agreedQuantityAmount = this.quantityFormatValue(this.formValues.deliveryProducts[this.deliveryProductIndex].agreedQuantityAmount);
    }
    if (!this.formValues.deliveryProducts[this.deliveryProductIndex].fuelManifoldTemperatureUom) {
      this.formValues.deliveryProducts[this.deliveryProductIndex].fuelManifoldTemperatureUom  = 'Celsius';
    }
    if (this.formValues.deliveryProducts[this.deliveryProductIndex].deliveredVolume) {
      this.formValues.deliveryProducts[this.deliveryProductIndex].deliveredVolume = this.quantityFormatValue(this.formValues.deliveryProducts[this.deliveryProductIndex].deliveredVolume);
    }
    this.setDeliveredQuantityUomList(this.deliveryProductIndex);
  }


  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
  @Input() events1: Observable<void>;
  @Input() events2: Observable<void>;
  autocompleteProducts: knownMastersAutocomplete;
  physicalSupplierList: any[];
  autocompletePhysicalSupplier: knownMastersAutocomplete;
  formValues: any;
  deliveryForm: FormGroup;
  selectedProductToAddInDelivery: any;
  deliveryProduct: FormGroup;
  hideDropdown: boolean;
  conversionInfoData: any = {};
  finalQuantityRules: any;
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
    private tenantService: TenantFormattingService,
    private mastersListApiService: MastersListApiService,
    @Inject(DecimalPipe) private _decimalPipe,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    super(changeDetectorRef);
    this.autocompleteProducts = knownMastersAutocomplete.products;
    this.autocompletePhysicalSupplier = knownMastersAutocomplete.physicalSupplier;
    this.dateFormats.display.dateInput = this.format.dateFormat;
    this.dateFormats.parse.dateInput = this.format.dateFormat;
    PICK_FORMATS.display.dateInput = this.format.dateFormat;
    this.quantityFormat = '1.' + this.tenantService.quantityPrecision + '-' + this.tenantService.quantityPrecision;

  }

  ngOnInit(){
    this.entityName = 'Delivery';
    this.eventsSubscription = this.events.subscribe((data) => this.setDeliveryForm(data));
    this.events1Subscription = this.events1.subscribe((data) => this.setConversionDataInfo(data));
    this.events2Subscription = this.events2.subscribe((data) => this.setRequiredFields(data));
    this.getUomList();
    this.getProductList();
    this.getPhysicalSupplierList();
  }

  setRequiredFields(data) {
    this.buttonClicked = data;
  }

  setConversionDataInfo(conversionInfo) {
    if (!conversionInfo) {
      return;
    }

    this.conversionInfoData = conversionInfo;
  }

  setDeliveryForm(form){
    if (!form) {
      return;
    }
    this.formValues = form;
    if (this.formValues.deliveryProducts) {
      this.setDeliveredQuantityUomList(this.deliveryProductIndex);
    }
    //this.changeDetectorRef.detectChanges();
  }



  getHeaderNameSelector(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.products:
        return knowMastersAutocompleteHeaderName.products;
      default:
        return knowMastersAutocompleteHeaderName.products;
    }
  }

  getHeaderNameSelector1(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.physicalSupplier:
        return knowMastersAutocompleteHeaderName.physicalSupplier;
      default:
        return knowMastersAutocompleteHeaderName.physicalSupplier;
    }
  }


  getUomList() {
    this.uomList$ =  this.legacyLookupsDatabase.getUomTable();
  }

  getProductList(){
    let data : any = {"Order":null,"PageFilters":{"Filters":[]},"SortList":{"SortList":[]},"Filters":[{"ColumnName":"productTypeId","Value": this.formValues.deliveryProducts[this.deliveryProductIndex].productTypeId}],"SearchText":null,"Pagination":{}}
    this.mastersListApiService.getProducts(data).subscribe((response: any) => {
      if(response){
          this.productList=response.payload;
      }
    });
  }

  async getPhysicalSupplierList() {
    this.physicalSupplierList = await this.legacyLookupsDatabase.getPhysicalSupplierList();
  }


  selectorPhysicalSupplierSelectionChange(
    selection: IDisplayLookupDto
  ): void {
    if (selection === null || selection === undefined) {
      this.formValues.deliveryProducts[this.deliveryProductIndex].physicalSupplier = '';
    } else {
      const obj = {
        'id': selection.id,
        'name': selection.name
      };
      this.formValues.deliveryProducts[this.deliveryProductIndex].physicalSupplier = obj;
      this.changeDetectorRef.detectChanges();
    }
  }

  selectorProductSelectionChange(
    selection: IDisplayLookupDto
  ): void {
    if (selection === null || selection === undefined) {
      this.formValues.deliveryProducts[this.deliveryProductIndex].product = '';
    } else {
      const obj = {
        'id': selection.id,
        'name': selection.name
      };
      this.formValues.deliveryProducts[this.deliveryProductIndex].product  = obj;
      this.changeDetectorRef.detectChanges();
    }
  }

  filterProductList() {
    const filterValue = this.formValues.deliveryProducts[this.deliveryProductIndex].product.name ? this.formValues.deliveryProducts[this.deliveryProductIndex].product.name.toLowerCase() : this.formValues.deliveryProducts[this.deliveryProductIndex].product.toLowerCase();
    if (this.productList) {
      return this.productList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0)
        .slice(0, 10);
    } else {
      return [];
    }
  }

  filterPhysicalSupplierList() {
    if (this.formValues.deliveryProducts[this.deliveryProductIndex].physicalSupplier) {
      const filterValue = this.formValues.deliveryProducts[this.deliveryProductIndex].physicalSupplier.name ? this.formValues.deliveryProducts[this.deliveryProductIndex].physicalSupplier.name.toLowerCase() : this.formValues.deliveryProducts[this.deliveryProductIndex].physicalSupplier.toLowerCase();
      if (this.physicalSupplierList) {
        return this.physicalSupplierList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0)
          .slice(0, 10);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  ngAfterViewInit(): void {

  }

  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  displayFn(product): string {
    return product && product.name ? product.name : '';
  }

  valueChange(value){
    this.formValues.deliveryProducts[this.deliveryProductIndex].confirmedQuantityAmount  = value;

  }

  setVarianceQty(qtyToChange, rule) {
    // sets buyer/seller qty for all products
    if (qtyToChange == 'seller') {
      this.formValues.deliveryProducts.forEach((val, key) => {
        val.sellerQuantityType = rule;
        this.setBuyerSellerQuantityAndUom('seller');
        this.calculateVarianceAndReconStatus(key);
      });
    }
    if (qtyToChange == 'buyer') {
      this.formValues.deliveryProducts.forEach((val, key) => {
        val.buyerQuantityType = rule;
        this.setBuyerSellerQuantityAndUom('buyer');
        this.calculateVarianceAndReconStatus(key);
      });
    }
  }

   /* delivery quantity variance and status calculations*/
  setBuyerSellerQuantityAndUom(qtyToChange) {
    if (qtyToChange == 'seller') {
        let sellerQty = this.formValues.temp.sellerPrecedenceRule.name;
        if (sellerQty == 'Surveyor') {
            this.formValues.deliveryProducts.forEach((val, key) => {
              this.formValues.deliveryProducts[key].sellerQuantityUom = this.formValues.deliveryProducts[key].surveyorQuantityUom;
              this.formValues.deliveryProducts[key].sellerQuantityAmount = this.formValues.deliveryProducts[key].surveyorQuantityAmount;
            });
        }
        if (sellerQty == 'Bdn') {
            this.formValues.deliveryProducts.forEach((val, key) => {
              this.formValues.deliveryProducts[key].sellerQuantityUom = this.formValues.deliveryProducts[key].bdnQuantityUom;
              this.formValues.deliveryProducts[key].sellerQuantityAmount = this.formValues.deliveryProducts[key].bdnQuantityAmount;
            });
        }
        if (sellerQty == 'Vessel') {
            this.formValues.deliveryProducts.forEach((val, key) => {
              this.formValues.deliveryProducts[key].sellerQuantityUom = this.formValues.deliveryProducts[key].vesselQuantityUom;
              this.formValues.deliveryProducts[key].sellerQuantityAmount = this.formValues.deliveryProducts[key].vesselQuantityAmount;
            });
        }
        if (sellerQty == 'VesselFlowMeter') {
            this.formValues.deliveryProducts.forEach((val, key) => {
              this.formValues.deliveryProducts[key].sellerQuantityUom = this.formValues.deliveryProducts[key].vesselFlowMeterQuantityUom;
              this.formValues.deliveryProducts[key].sellerQuantityAmount = this.formValues.deliveryProducts[key].vesselFlowMeterQuantityAmount;
            });
        }
        if (sellerQty == 'Confirm') {
            this.formValues.deliveryProducts.forEach((val, key) => {
              this.formValues.deliveryProducts[key].sellerQuantityUom = this.formValues.deliveryProducts[key].confirmedQuantityUom;
              this.formValues.deliveryProducts[key].sellerQuantityAmount = this.formValues.deliveryProducts[key].confirmedQuantityAmount;
            });
        }
    }
    if (qtyToChange == 'buyer') {
        let buyerQty = this.formValues.temp.buyerPrecedenceRule.name;
        if (buyerQty == 'Surveyor') {
            this.formValues.deliveryProducts.forEach((val, key) => {
              this.formValues.deliveryProducts[key].buyerQuantityUom = this.formValues.deliveryProducts[key].surveyorQuantityUom;
              this.formValues.deliveryProducts[key].buyerQuantityAmount = this.formValues.deliveryProducts[key].surveyorQuantityAmount;
            });
        }
        if (buyerQty == 'Bdn') {
            this.formValues.deliveryProducts.forEach((val, key) => {
              this.formValues.deliveryProducts[key].buyerQuantityUom = this.formValues.deliveryProducts[key].bdnQuantityUom;
              this.formValues.deliveryProducts[key].buyerQuantityAmount = this.formValues.deliveryProducts[key].bdnQuantityAmount;
            });
        }
        if (buyerQty == 'Vessel') {
          this.formValues.deliveryProducts.forEach((val, key) => {
              this.formValues.deliveryProducts[key].buyerQuantityUom = this.formValues.deliveryProducts[key].vesselQuantityUom;
              this.formValues.deliveryProducts[key].buyerQuantityAmount = this.formValues.deliveryProducts[key].vesselQuantityAmount;
          });
        }
        if (buyerQty == 'VesselFlowMeter') {
          this.formValues.deliveryProducts.forEach((val, key) => {
            this.formValues.deliveryProducts[key].buyerQuantityUom = this.formValues.deliveryProducts[key].vesselFlowMeterQuantityUom;
            this.formValues.deliveryProducts[key].buyerQuantityAmount = this.formValues.deliveryProducts[key].vesselFlowMeterQuantityAmount;
          });
        }
        if (buyerQty == 'Confirm') {
          this.formValues.deliveryProducts.forEach((val, key) => {
            this.formValues.deliveryProducts[key].buyerQuantityUom = this.formValues.deliveryProducts[key].confirmedQuantityUom;
            this.formValues.deliveryProducts[key].buyerQuantityAmount = this.formValues.deliveryProducts[key].confirmedQuantityAmount;
          });
        }
    }
    // function called for all quantities, call here calculate final quantity
    this.calculateFinalQuantity(this.selectedProduct);
  };

  calculateFinalQuantity(productIdx) {
    // debugger;
    if (typeof productIdx == 'undefined') {
        return;
    }
    if (typeof this.formValues.deliveryProducts[productIdx] == 'undefined') {
        return;
    }
    let dataSet = false;


    // rules are in order, check for each if quantity exists and set that
    // if not, go on
    for (let i = 0; i < this.finalQuantityRules.length; i ++) {
      let rule = this.finalQuantityRules[i];
      if (typeof this.formValues.deliveryProducts[productIdx][`${rule.deliveryMapping }Uom`] != 'undefined' &&
        this.formValues.deliveryProducts[productIdx][`${rule.deliveryMapping }Amount`] != '' &&
        this.formValues.deliveryProducts[productIdx][`${rule.deliveryMapping }Amount`] != null) {
        // quantity exists, set it
        this.formValues.deliveryProducts[productIdx].finalQuantityUom = this.formValues.deliveryProducts[productIdx][`${rule.deliveryMapping }Uom`];
        this.formValues.deliveryProducts[productIdx].finalQuantityAmount = this.quantityFormatValue(this.formValues.deliveryProducts[productIdx][`${rule.deliveryMapping }Amount`]);
        dataSet = true;
      }
      if (dataSet) {
        break;
      } // break loop
    }

    if(!dataSet) {
      this.formValues.deliveryProducts[productIdx].finalQuantityUom = null;
      this.formValues.deliveryProducts[productIdx].finalQuantityAmount = null;
    }
  };

  setQuantityFormat(value) {
    let viewValue = `${value}`;
    let plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
    return plainNumber;
  }


  calculateVarianceAndReconStatus(productIdx) {
    // function called for all quantities, call here calculate final quantity
    this.calculateFinalQuantity(productIdx);
    let confirmedQuantityUom, vesselQuantityUom, bdnQuantityUom,vesselFlowMeterQuantityUom, surveyorQuantityUom;
    let conversionInfo = this.conversionInfoData[productIdx];
    let activeProduct = this.formValues.deliveryProducts[productIdx];
    // get fields values and uom
    activeProduct.confirmedQuantityUom == null ? confirmedQuantityUom = null : confirmedQuantityUom = activeProduct.confirmedQuantityUom.name;
    activeProduct.vesselQuantityUom == null ? vesselQuantityUom = null : vesselQuantityUom = activeProduct.vesselQuantityUom.name;
    activeProduct.bdnQuantityUom == null ? bdnQuantityUom = null : bdnQuantityUom = activeProduct.bdnQuantityUom.name;
    activeProduct.vesselFlowMeterQuantityUom == null ? vesselFlowMeterQuantityUom = null : vesselFlowMeterQuantityUom = activeProduct.vesselFlowMeterQuantityUom.name;
    // activeProduct.bargeFlowMeterQuantityUom == null ? bargeFlowMeterQuantityUom = null : bargeFlowMeterQuantityUom = activeProduct.bargeFlowMeterQuantityUom.name;
    activeProduct.surveyorQuantityUom == null ? surveyorQuantityUom = null : surveyorQuantityUom = activeProduct.surveyorQuantityUom.name;
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
    let convertedFields : any = {};
    let baseUom : any = {};
    let convFact = 1;
    if (typeof conversionInfo == 'undefined') {
      conversionInfo = {};
    }
    if (productIdx == 0 && typeof this.formValues.temp.variances == 'undefined') {
      this.formValues.temp.variances = [];
    }
    if (this.formValues.deliveryProducts[productIdx].sellerQuantityType  && typeof this.formValues.deliveryProducts[productIdx].sellerQuantityType.name != 'undefined') {
      let uomObjId = fieldUoms[this.formValues.deliveryProducts[productIdx].sellerQuantityType.name];
      baseUom = this.formValues.deliveryProducts[productIdx][uomObjId];
    }
    if (!baseUom) {
      this.formValues.temp.variances[`uom_${ productIdx}`] = null;
      this.formValues.temp.variances[`product_${ productIdx}`] = null;
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

    this.formValues.temp.variances[`mfm_product_${ productIdx}`] = null;
    this.formValues.temp.variances[`mfm_uom_${ productIdx}`] = null;
    if (activeProduct.vesselFlowMeterQuantityUom && activeProduct.bdnQuantityUom && activeProduct.bdnQuantityAmount && activeProduct.vesselFlowMeterQuantityAmount) {
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
        this.formValues.temp.variances[`mfm_product_${ productIdx}`] = this._decimalPipe.transform(mfm_variance, this.quantityFormat);
        this.formValues.temp.variances[`mfm_uom_${ productIdx}`] = mfm_baseUom.name;
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
      this.formValues.temp.variances[`product_${ productIdx}`] = variance;
      this.setVarianceColor(productIdx);
    } else {
      // this is where variance is calculated. rn it's buyer - seler (15/08)
      variance = buyerConvertedValue - sellerConvertedValue;

      //
      var varianceDisplay = variance / convFact;
      this.formValues.temp.variances[`product_${ productIdx}`] = this._decimalPipe.transform(varianceDisplay, this.quantityFormat);
      this.formValues.temp.variances[`uom_${ productIdx}`] = baseUom.name;
      this.setVarianceColor(productIdx);
    }
    if (typeof this.formValues.temp.reconStatus == 'undefined') {
      this.formValues.temp.reconStatus = [];
    }
    if (variance != null) {
      if (conversionInfo.quantityReconciliation.name == 'Flat') {
        if (variance < conversionInfo.minToleranceLimit) {
            this.formValues.temp.reconStatus[`product_${ productIdx}`] = 1; // Matched Green
        }
        if (variance > conversionInfo.minToleranceLimit && variance < conversionInfo.maxToleranceLimit) {
            this.formValues.temp.reconStatus[`product_${ productIdx}`] = 2; // Unmatched Amber
        }
        if (variance > conversionInfo.maxToleranceLimit) {
            this.formValues.temp.reconStatus[`product_${ productIdx}`] = 3; // Unmatched Red
        }
      } else {
        var minValue = conversionInfo.minToleranceLimit * this.formValues.deliveryProducts[productIdx].confirmedQuantityAmount / 100;
        var maxValue = conversionInfo.maxToleranceLimit * this.formValues.deliveryProducts[productIdx].confirmedQuantityAmount / 100;
        if (variance < minValue) {
            this.formValues.temp.reconStatus[`product_${ productIdx}`] = 1; // Matched Green
        }
        if (variance > minValue && variance < maxValue) {
            this.formValues.temp.reconStatus[`product_${ productIdx}`] = 2; // Unmatched Amber
        }
        if (variance > maxValue) {
            this.formValues.temp.reconStatus[`product_${ productIdx}`] = 3; // Unmatched Red
        }
      }
    } else {
      this.formValues.temp.reconStatus[`product_${ productIdx}`] = null;
    }

     // Update buyer & seller amount and uom
    this.setBuyerSellerQuantityAndUom('buyer');
    this.setBuyerSellerQuantityAndUom('seller');
  }

  setVarianceColor(idx) {
     // debugger
    if(typeof this.formValues.temp.variances[`color_${ idx}`] == 'undefined') {
      this.formValues.temp.variances[`color_${ idx}`] = '';
    }
    if(typeof this.formValues.temp.variances[`mfm_color_${ idx}`] == 'undefined') {
      this.formValues.temp.variances[`mfm_color_${ idx}`] = '';
    }
    // ckeck product_{{idx}}

    if(this.formValues.temp.variances[`product_${ idx}`] != null) {
        /*
      // old color code
      // 1. Variance < Min Tolerance  => Green
        if(parseFloat(this.formValues.temp.variances["product_" + idx]) < parseFloat(this.toleranceLimits.minToleranceLimit))
            this.formValues.temp.variances['color_' + idx] = "green";

        // 2. Max Tolerance > Variance > Min Tolerance => Amber
        if((parseFloat(this.formValues.temp.variances["product_" + idx]) >= parseFloat(this.toleranceLimits.minToleranceLimit)) &&
            (parseFloat(this.formValues.temp.variances["product_" + idx]) <= parseFloat(this.toleranceLimits.maxToleranceLimit))){
            this.formValues.temp.variances['color_' + idx] = "amber";
        }

        // 3. Variance > Max Tolerance => Red
        if((parseFloat(this.formValues.temp.variances["product_" + idx]) > parseFloat(this.toleranceLimits.maxToleranceLimit))){
            this.formValues.temp.variances['color_' + idx] = "red";
        }
        */


        // new color code
        // 1. If the variance is Negative value and exceeds Max tolerance, then display the “Variance Qty” value field in “Red” colour
        // 2. If the variance is Negative value and less than Max tolerance, then display the “Variance Qty” value field in “Amber” colour
        // 3. If the variance is Positive value, then display the “Variance Qty” value field in “Green” colour

        if(parseFloat(this.formValues.temp.variances[`product_${ idx}`]) < 0) {
          // 1 or 2
          if(Math.abs(parseFloat(this.formValues.temp.variances[`product_${ idx}`])) < parseFloat(this.toleranceLimits.maxToleranceLimit)) {
            this.formValues.temp.variances[`color_${ idx}`] = 'amber';
          }

          if(Math.abs(parseFloat(this.formValues.temp.variances[`product_${ idx}`])) >= parseFloat(this.toleranceLimits.maxToleranceLimit)) {
            this.formValues.temp.variances[`color_${ idx}`] = 'red';
          }
        }else{
          this.formValues.temp.variances[`color_${ idx}`] = 'green';
        }
    }else{
        // if variance is null, set color to white
      this.formValues.temp.variances[`color_${ idx}`] = 'white';
    }

    if(this.formValues.temp.variances[`mfm_product_${ idx}`] != null) {
        if(parseFloat(this.formValues.temp.variances[`mfm_product_${ idx}`]) < 0) {
            if(Math.abs(parseFloat(this.formValues.temp.variances[`mfm_product_${ idx}`])) <= parseFloat(this.toleranceLimits.maxToleranceLimit)) {
                this.formValues.temp.variances[`mfm_color_${ idx}`] = 'amber';
            }

            if(Math.abs(parseFloat(this.formValues.temp.variances[`mfm_product_${ idx}`])) > parseFloat(this.toleranceLimits.maxToleranceLimit)) {
                this.formValues.temp.variances[`mfm_color_${ idx}`] = 'red';
            }
        }else{
            this.formValues.temp.variances[`mfm_color_${ idx}`] = 'green';
        }
    }else{
        // if variance is null, set color to white
        this.formValues.temp.variances[`mfm_color_${ idx}`] = 'white';
    }
  }

  getColorCodeFromLabels(statusObj, labels) {
    for(let i = 0; i < labels.length; i++) {
      if (statusObj) {
        if(statusObj.id === labels[i].id && statusObj.transactionTypeId === labels[i].transactionTypeId) {
            return labels[i].code;
        }
      }
    }
  }


  quantityFormatValue(value) {
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    let number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if(this.tenantService.quantityPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.quantityFormat);
      }
    }
  }

  onChange($event, field) {
    if ($event.value) {
      let beValue = `${moment($event.value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
      if (field == 'pricingEventDate') {
        this.isPricingEventDateInvalid = false;
      }
    } else {
      if (field == 'pricingEventDate') {
        this.isPricingEventDateInvalid = true;
      }
      this.toastr.error('Please enter the correct format');
    }

  }

  formatDateForBe(value) {
    if (value) {
      let beValue = `${moment(value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
      return `${moment(value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
    } else {
      return null;
    }
  }


  setDeliveredQuantityUomList(deliveryProductIndex) {
    let bdnUom = this.formValues.deliveryProducts[deliveryProductIndex].bdnQuantityUom;
    if (bdnUom) {
      let verifyIfBdnUomIsMassUom = _.find(this.uomMass, function(object) {
        return object.name == bdnUom.name && object.id == bdnUom.id;
      });
      if (verifyIfBdnUomIsMassUom) {
        if (this.uomVolume) {
          this.deliveredQuantityUoms = [...this.uomVolume];
        }
      } else {
        if (this.uomMass) {
          this.deliveredQuantityUoms = [...this.uomMass];
        }
      }
    }
  }

  calculatePumpingRate(timeString, prodIndex) {
    if (typeof timeString == 'undefined' || typeof this.formValues.deliveryProducts == 'undefined' || !this.formValues.deliveryProducts.length) {
      return;
    }
    if (typeof this.formValues.deliveryProducts[prodIndex].bdnQuantityUom == 'undefined' || this.formValues.deliveryProducts[prodIndex].bdnQuantityUom == null || this.formValues.deliveryProducts[prodIndex].bdnQuantityAmount == null) {
      return;
    }
    if (typeof this.formValues.pumpingRate == 'undefined') {
      this.formValues.pumpingRate = '';
      this.formValues.pumpingRateUom = '';
    }
    var pumpingTime = (parseInt(timeString.split(':')[0]) * 60 + parseInt(timeString.split(':')[1])) / 60;
    this.formValues.pumpingRate = this.formValues.deliveryProducts[prodIndex].bdnQuantityAmount / pumpingTime;
    this.pumpingRateUom.forEach((val, key) => {
      if (val.name.split('/')[0] == this.formValues.deliveryProducts[prodIndex].bdnQuantityUom.name) {
        this.formValues.pumpingRateUom = val;
      }
    });
  };


  // Only Number
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
