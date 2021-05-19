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
  Injectable,
  InjectionToken,
  Optional,
  ViewChildren
} from '@angular/core';
import { Select } from '@ngxs/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { finalize, map, scan, startWith, timeout } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BdnInformationApiService } from '@shiptech/core/services/delivery-api/bdn-information/bdn-information-api.service';
import { TransactionForSearch } from 'libs/feature/delivery/src/lib/services/api/request-response/bdn-information';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { IDisplayLookupDto, IOrderLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { knowMastersAutocompleteHeaderName, knownMastersAutocomplete } from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { OrderListGridViewModel } from '@shiptech/core/ui/components/delivery/view-model/order-list-grid-view-model.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { AppConfig } from '@shiptech/core/config/app-config';
import { HttpClient } from '@angular/common/http';
import { IVesselMastersApi, VESSEL_MASTERS_API_SERVICE } from '@shiptech/core/services/masters-api/vessel-masters-api.service.interface';
import { DeliveryInfoForOrder, IDeliveryInfoForOrderDto, OrderInfoDetails } from 'libs/feature/delivery/src/lib/services/api/dto/delivery-details.dto';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import moment, { Moment, MomentFormatSpecification, MomentInput } from 'moment';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { IDeliveryTenantSettings } from 'libs/feature/delivery/src/lib/core/settings/delivery-tenant-settings';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import _ from 'lodash';
import { NgxMatDateAdapter, NgxMatDateFormats, NgxMatNativeDateAdapter, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { DecimalPipe, KeyValue } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { MatMenuTrigger } from '@angular/material/menu';
import { OverlayContainer } from '@angular/cdk/overlay';
import { OVERLAY_KEYBOARD_DISPATCHER_PROVIDER_FACTORY } from '@angular/cdk/overlay/dispatchers/overlay-keyboard-dispatcher';
import { throws } from 'assert';
import { DeliveryAutocompleteComponent } from '../delivery-autocomplete/delivery-autocomplete.component';
import { InvoiceDetailsService } from 'libs/feature/invoice/src/lib/services/invoice-details.service';



const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'YYYY-MM-DD HH:mm'
  },
  display: {
    dateInput: 'YYYY-MM-DD HH:mm',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};


  
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



export interface NgxMatMomentDateAdapterOptions {

  strict?: boolean;

  useUtc?: boolean;
}

export const MAT_MOMENT_DATE_ADAPTER_OPTIONS = new InjectionToken<NgxMatMomentDateAdapterOptions>(
  'MAT_MOMENT_DATE_ADAPTER_OPTIONS', {
    providedIn: 'root',
    factory: MAT_MOMENT_DATE_ADAPTER_OPTIONS_FACTORY
  });

export function MAT_MOMENT_DATE_ADAPTER_OPTIONS_FACTORY(): NgxMatMomentDateAdapterOptions {
  return {
    useUtc: false
  };
}

function range<T>(length: number, valueFunction: (index: number) => T): T[] {
  const valuesArray = Array(length);
  for (let i = 0; i < length; i++) {
    valuesArray[i] = valueFunction(i);
  }
  return valuesArray;
}

@Injectable()
export class CustomNgxDatetimeAdapter extends NgxMatDateAdapter<Moment> {
  private _localeData: {
    firstDayOfWeek: number,
    longMonths: string[],
    shortMonths: string[],
    dates: string[],
    longDaysOfWeek: string[],
    shortDaysOfWeek: string[],
    narrowDaysOfWeek: string[]
  };

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string,
              @Optional() @Inject(MAT_MOMENT_DATE_ADAPTER_OPTIONS)
              private _options?: NgxMatMomentDateAdapterOptions) {

    super();
    this.setLocale(dateLocale || moment.locale());
  }

  setLocale(locale: string) {
    super.setLocale(locale);

    const momentLocaleData = moment.localeData(locale);
    this._localeData = {
      firstDayOfWeek: momentLocaleData.firstDayOfWeek(),
      longMonths: momentLocaleData.months(),
      shortMonths: momentLocaleData.monthsShort(),
      dates: range(31, (i) => this.createDate(2017, 0, i + 1).format('D')),
      longDaysOfWeek: momentLocaleData.weekdays(),
      shortDaysOfWeek: momentLocaleData.weekdaysShort(),
      narrowDaysOfWeek: momentLocaleData.weekdaysMin(),
    };
  }

  getYear(date: Moment): number {
    return this.clone(date).year();
  }

  getMonth(date: Moment): number {
    return this.clone(date).month();
  }

  getDate(date: Moment): number {
    return this.clone(date).date();
  }

  getDayOfWeek(date: Moment): number {
    return this.clone(date).day();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    // Moment.js doesn't support narrow month names, so we just use short if narrow is requested.
    return style === 'long' ? this._localeData.longMonths : this._localeData.shortMonths;
  }

  getDateNames(): string[] {
    return this._localeData.dates;
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (style === 'long') {
      return this._localeData.longDaysOfWeek;
    }
    if (style === 'short') {
      return this._localeData.shortDaysOfWeek;
    }
    return this._localeData.narrowDaysOfWeek;
  }

  getYearName(date: Moment): string {
    return this.clone(date).format('YYYY');
  }

  getFirstDayOfWeek(): number {
    return this._localeData.firstDayOfWeek;
  }

  getNumDaysInMonth(date: Moment): number {
    return this.clone(date).daysInMonth();
  }

  clone(date: Moment): Moment {
    return date.clone().locale(this.locale);
  }

  createDate(year: number, month: number, date: number): Moment {
    if (month < 0 || month > 11) {
      throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    const result = this._createMoment({ year, month, date }).locale(this.locale);
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }

  today(): Moment {
    // @ts-ignore
    return this._createMoment().locale(this.locale);
  }

  parse(value: any, parseFormat: string | string[]): Moment | null {
    let currentFormat = PICK_FORMATS.display.dateInput;
    let hasDayOfWeek;
    if (currentFormat.startsWith('DDD ')) {
        hasDayOfWeek = true;
        currentFormat = currentFormat.split('DDD ')[1];
    }
    currentFormat = currentFormat.replace(/d/g, 'D');
    currentFormat = currentFormat.replace(/y/g, 'Y');
    let elem = moment(value, currentFormat);
    const isValid = this.isValid(elem);
    return this.isValid(elem) ? elem : null;
  }

  format(date: Moment, displayFormat: string): string {
    date = this.clone(date);
    if (!this.isValid(date)) {
      throw Error('MomentDateAdapter: Cannot format invalid date.');
    }
    let currentFormat = CUSTOM_DATE_FORMATS.display.dateInput;
    let hasDayOfWeek;
    if (currentFormat.startsWith('DDD ')) {
        hasDayOfWeek = true;
        currentFormat = currentFormat.split('DDD ')[1];
    }
    currentFormat = currentFormat.replace(/d/g, 'D');
    currentFormat = currentFormat.replace(/y/g, 'Y');
    let formattedDate = moment(date).format(currentFormat);
    if (hasDayOfWeek) {
      formattedDate = `${moment(date).format('ddd') } ${ formattedDate}`;
    }
    return formattedDate;
  }

  addCalendarYears(date: Moment, years: number): Moment {
    return this.clone(date).add({ years });
  }

  addCalendarMonths(date: Moment, months: number): Moment {
    return this.clone(date).add({ months });
  }

  addCalendarDays(date: Moment, days: number): Moment {
    return this.clone(date).add({ days });
  }

  toIso8601(date: Moment): string {
    return this.clone(date).format();
  }

  deserialize(value: any): Moment | null {
    let date;
    if (value instanceof Date) {
      date = this._createMoment(value);
    } else if (this.isDateInstance(value)) {
      return this.clone(value);
    }
    if (typeof value === 'string') {
      if (!value) {
        return null;
      }
      let currentFormat = PICK_FORMATS.display.dateInput;
      let hasDayOfWeek;
      if (currentFormat.startsWith('DDD ')) {
          hasDayOfWeek = true;
          currentFormat = currentFormat.split('DDD ')[1];
      }
      currentFormat = currentFormat.replace(/d/g, 'D');
      currentFormat = currentFormat.replace(/y/g, 'Y');
      let elem = moment(value, 'YYYY-MM-DDTHH:mm:ss');
      let newVal = moment(elem).format(currentFormat);
      console.log(newVal);
      if (elem && this.isValid(elem)) {
        return elem;
      }
    }
    return super.deserialize(value);
  }

  isDateInstance(obj: any): boolean {
    return moment.isMoment(obj);
  }

  isValid(date: Moment): boolean {
    return this.clone(date).isValid();
  }

  invalid(): Moment {
    return moment.invalid();
  }

  getHour(date: Moment): number {
    const el = date.hours();
    const elem = moment(date).utcOffset(0);
    return date.hours();
  }
  getMinute(date: Moment): number {
    return date.minutes();
  }
  getSecond(date: Moment): number {
    return date.seconds();
  }
  setHour(date: Moment, value: number): void {
    date.hours(value);
  }
  setMinute(date: Moment, value: number): void {
    date.minutes(value)
  }
  setSecond(date: Moment, value: number): void {
    date.seconds(value);
  }

  private _createMoment(
    date: MomentInput,
    format?: MomentFormatSpecification,
    locale?: string,
  ): Moment {
    const { strict, useUtc }: NgxMatMomentDateAdapterOptions = this._options || {};

    return useUtc
      ? moment.utc(date, format, locale, strict)
      : moment(date, format, locale, strict);
  }
}

@Component({
  selector: 'shiptech-invoice-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [OrderListGridViewModel, 
              DialogService, 
              ConfirmationService,
              {provide: DateAdapter, useClass: PickDateAdapter},
              {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
              {
                provide: NgxMatDateAdapter,
                useClass: CustomNgxDatetimeAdapter,
                deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
              },
              { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }]
})
export class ProductDetailsComponent extends DeliveryAutocompleteComponent
implements OnInit {
  switchTheme; //false-Light Theme, true- Dark Theme
  formValues: any;
  amountFormat: string;
  priceFormat: string;
  quantityFormat: string;
  autocompleteFormula: knownMastersAutocomplete;
  baseOrigin: string;
  autocompletePhysicalSupplier: knownMastersAutocomplete;
  productList: any;
  private _autocompleteType: any;
  _entityName: string;
  _entityId: number;
  autocompleteInvoiceProduct: knownMastersAutocomplete;
  uomList: any;
  currencyList: any;
  physicalSupplierList: any;
  type: any;
  expandAddTransactionListPopUp: boolean =  false;
  displayedColumns: string[] = ['product', 'delivery'];
  @Output() amountChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() costDetailsChanged: EventEmitter<any> = new EventEmitter<any>();

  deliveriesToBeInvoicedList: any = [];
  selectedProductLine: any;
  productSearch: any;
  filteredProductOptions: Observable<string[]>;
  @ViewChild('productMenuTrigger') productMenuTrigger: MatMenuTrigger;
  eventsFormValuesSubscription: any;


  get entityId(): number {
    return this._entityId;
  }

  get entityName(): string {
    return this._entityName;
  }

  @Input() set entityId(value: number) {
    this._entityId = value;
    this.gridViewModel.entityId = this.entityId;
  }

  @Input() set entityName(value: string) {
    this._entityName = value;
    this.gridViewModel.entityName = this.entityName;
  }
     
  @Input() vesselId: number;
  @Input('model') set _setFormValues(formValues) { 
    if (!formValues) {
      return;
    } 
    this.formValues = formValues;
  }

  @Input('productList') set _setProductList(productList) { 
    if (!productList) {
      return;
    } 
    this.productList = productList;
  }

  @Input('uomList') set _setUomList(uomList) { 
    if (!uomList) {
      return;
    } 
    this.uomList = uomList;
  }

  @Input('currencyList') set _setCurrencyList(currencyList) { 
    if (!currencyList) {
      return;
    } 
    this.currencyList = currencyList;
  }
  
  @Input('physicalSupplierList') set _setPhysicalSupplierList(physicalSupplierList) { 
    if (!physicalSupplierList) {
      return;
    } 
    this.physicalSupplierList = physicalSupplierList;
  }
  productDetailsExpandArray = [];
  @Input() eventsFormValues: Observable<void>;




  constructor(
    public gridViewModel: OrderListGridViewModel,
    @Inject(VESSEL_MASTERS_API_SERVICE) private mastersApi: IVesselMastersApi,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private appConfig: AppConfig,
    private httpClient: HttpClient,
    changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DATE_FORMATS) private dateFormats,
    @Inject(NGX_MAT_DATE_FORMATS) private dateTimeFormats,
    private format: TenantFormattingService,
    private tenantSettingsService: TenantSettingsService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    iconRegistry: MatIconRegistry, 
    public dialog: MatDialog, 
    @Inject(DecimalPipe) private _decimalPipe,
    private tenantService: TenantFormattingService,
    sanitizer: DomSanitizer,
    private overlayContainer: OverlayContainer,
    private invoiceService: InvoiceDetailsService) {
    super(changeDetectorRef);
    this.autocompleteInvoiceProduct = knownMastersAutocomplete.products;
    this.autocompletePhysicalSupplier = knownMastersAutocomplete.physicalSupplier;
    this.dateFormats.display.dateInput = this.format.dateFormat;
    this.dateFormats.parse.dateInput = this.format.dateFormat;
    this.dateTimeFormats.display.dateInput = this.format.dateFormat;
    CUSTOM_DATE_FORMATS.display.dateInput = this.format.dateFormat;
    PICK_FORMATS.display.dateInput = this.format.dateFormat;
    this.baseOrigin = new URL(window.location.href).origin;
    this.autocompleteFormula = knownMastersAutocomplete.formula;
    this.quantityFormat = '1.' + this.tenantService.quantityPrecision + '-' + this.tenantService.quantityPrecision;
    this.amountFormat = '1.' + this.tenantService.amountPrecision + '-' + this.tenantService.amountPrecision;
    this.priceFormat = '1.' + this.tenantService.pricePrecision + '-' + this.tenantService.pricePrecision;

  }

  ngOnInit(): void {
    this.eventsFormValuesSubscription = this.eventsFormValues.subscribe((data) => this.setFormValues(data));

  }

  setFormValues(data) {
    this.formValues = this.formValues;
  }


  originalOrder = (a: KeyValue<number, any>, b: KeyValue<number, any>): number => {
    return 0;
  }

  ngAfterViewInit(): void {
  
  }

  openDeliveryLink(deliveryId) {
    return `${this.baseOrigin}/v2/delivery/delivery/${deliveryId}/details`;
  }

  openContractLink(contractId) {
    return `${this.baseOrigin}/v2/contracts/contract/${contractId}/details`;

  }

  quantityFormatValue(value) {
    if (typeof value == 'undefined' || value == null) {
      return null;
    }
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

  amountFormatValue(value) {
    if (typeof value == 'undefined' || value == null) {
      return null;
    }
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    let number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if(this.tenantService.amountPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.amountFormat);
      }
    }
  }

  displayFn(value): string {
    return value && value.name ? value.name : '';
  }

  getHeaderNameSelector(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.physicalSupplier:
        return knowMastersAutocompleteHeaderName.physicalSupplier;
      default:
        return knowMastersAutocompleteHeaderName.physicalSupplier;
    }
  }


  getHeaderNameSelector1(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.invoiceProduct:
        return knowMastersAutocompleteHeaderName.invoiceProduct;
      default:
        return knowMastersAutocompleteHeaderName.invoiceProduct;
    }
  }

  selectorInvoicedProductSelectionChange(
    selection: IDisplayLookupDto,
    line
  ): void {
    if (selection === null || selection === undefined) {
      this.formValues.productDetails[line].invoicedProduct = null;
    } else {
      const obj = {
        'id': selection.id,
        'name': selection.name
      };
      this.formValues.productDetails[line].invoicedProduct = obj; 
      console.log(this.formValues.productDetails[line]);
      this.changeDetectorRef.detectChanges();   
    }
  }

  filterInvoiceProductLine(value) {
    if (value) {
      const  filterValue = value.toLowerCase();
      if (this.productList) {
        return this.productList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0)
          .slice(0, 10);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  selectPhysicalSupplierLine(
    selection: IDisplayLookupDto,
    line
  ): void {
    if (selection === null || selection === undefined) {
      this.formValues.productDetails[line].physicalSupplierCounterparty = null;
    } else {
      const obj = {
        'id': selection.id,
        'name': selection.name
      };
      this.formValues.productDetails[line].physicalSupplierCounterparty = obj; 
      console.log(this.formValues.productDetails[line]);
      this.changeDetectorRef.detectChanges();   
    }
  }

  filterPhysicalSupplierLine(value) {
    if (value) {
      const  filterValue = value.toLowerCase();
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

  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  selectInvoiceProductLine(value, line) {
    this.formValues.productDetails[line].invoicedProduct = value;
    this.changeDetectorRef.detectChanges(); 
  }

  selectorPhysicalSupplierSelectionChange(value, line) {
    this.formValues.productDetails[line].physicalSupplierCounterparty = value;
    this.changeDetectorRef.detectChanges(); 
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
      currentFormat = currentFormat.replace(/HH:mm/g, '');
      let elem = moment(date, 'YYYY-MM-DDTHH:mm:ss');
      let formattedDate = moment(elem).format(currentFormat);
      if (hasDayOfWeek) {
        formattedDate = `${moment(date).format('ddd') } ${ formattedDate}`;
      }
      return formattedDate;
    }
  }

  invoiceConvertUom(type, rowIndex) {
    console.log(type);
    console.log(rowIndex);
    let currentRowIndex = rowIndex;
    this.calculateGrand(this.formValues);
    this.type = type;
    if (this.type == 'product') {
        let product = this.formValues.productDetails[currentRowIndex];
        if (typeof product.product != 'undefined' && typeof product.invoiceQuantityUom != 'undefined' && typeof product.invoiceRateUom !== 'undefined') {
            if (product.invoiceQuantityUom == null || product.invoiceRateUom == null /* || typeof(product.invoiceAmount) == 'undefined'*/) {
                return;
            };
            this.getUomConversionFactor(product.product.id, 1, product.invoiceQuantityUom.id, product.invoiceRateUom.id, product.contractProductId, product.orderProductId ? product.orderProductId : product.id, currentRowIndex);

           
        }
        // recalculatePercentAdditionalCosts(formValues);
    }


  }

  getUomConversionFactor(ProductId, Quantity, FromUomId, ToUomId, contractProductId, orderProductId, currentRowIndex) {
    let conversionFactor = 1;
    let productId = ProductId;
    let quantity = Quantity;
    let fromUomId = FromUomId;
    let toUomId = ToUomId;
    let data = {
      Payload: {
        ProductId: productId,
        OrderProductId: orderProductId,
        Quantity: quantity,
        FromUomId: fromUomId,
        ToUomId: toUomId,
        ContractProductId: contractProductId ? contractProductId : null
      }
    };
    if (toUomId == fromUomId) {
      conversionFactor = 1;
      this.formValues.productDetails[currentRowIndex].invoiceAmount = this.convertDecimalSeparatorStringToNumber(this.formValues.productDetails[currentRowIndex].invoiceQuantity) * (this.convertDecimalSeparatorStringToNumber(this.formValues.productDetails[currentRowIndex].invoiceRate) * conversionFactor);
      this.formValues.productDetails[currentRowIndex].difference = parseFloat(this.formValues.productDetails[currentRowIndex].invoiceAmount) - parseFloat(this.formValues.productDetails[currentRowIndex].estimatedAmount);
      this.calculateGrand(this.formValues);
      if (this.formValues.productDetails[currentRowIndex]) {
        this.calculateProductRecon(this.formValues.productDetails[currentRowIndex]);
      }

    }
    if (!productId || !toUomId || !fromUomId) {
        return;
    }

    this.invoiceService
    .getUomConversionFactor(data)
    .pipe(
        finalize(() => {

        })
    )
    .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.spinner.hide();
          this.toastr.error(result);
        } else {
          console.log(result);
          conversionFactor = result;
          this.formValues.productDetails[currentRowIndex].invoiceAmount = this.convertDecimalSeparatorStringToNumber(this.formValues.productDetails[currentRowIndex].invoiceQuantity) * (this.convertDecimalSeparatorStringToNumber(this.formValues.productDetails[currentRowIndex].invoiceRate) * conversionFactor);
          this.formValues.productDetails[currentRowIndex].difference = parseFloat(this.formValues.productDetails[currentRowIndex].invoiceAmount) - parseFloat(this.formValues.productDetails[currentRowIndex].estimatedAmount);
          this.calculateGrand(this.formValues);
          if (this.formValues.productDetails[currentRowIndex]) {
            this.calculateProductRecon(this.formValues.productDetails[currentRowIndex]);
          }


        }
    });

  };

  calculateGrand(formValues) {
    if (!formValues.invoiceSummary) {
        formValues.invoiceSummary = {};
    }
    // formValues.invoiceSummary.provisionalInvoiceAmount = $scope.calculateprovisionalInvoiceAmount(formValues){}
    formValues.invoiceSummary.invoiceAmountGrandTotal = this.calculateInvoiceGrandTotal(formValues);
    formValues.invoiceSummary.invoiceAmountGrandTotal -= formValues.invoiceSummary.provisionalInvoiceAmount;
    formValues.invoiceSummary.estimatedAmountGrandTotal = this.calculateInvoiceEstimatedGrandTotal(formValues);
    formValues.invoiceSummary.totalDifference = this.convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.invoiceAmountGrandTotal) - this.convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.estimatedAmountGrandTotal);
    formValues.invoiceSummary.netPayable = this.convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.invoiceAmountGrandTotal) - this.convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.deductions);
    this.changeDetectorRef.detectChanges();
    this.amountChanged.emit(true);
    console.log(formValues);
  }

  calculateInvoiceGrandTotal(formValues) {
    let grandTotal = 0;
    formValues.productDetails.forEach((v, k) => {
        if (!v.isDeleted && typeof v.invoiceAmount != 'undefined') {
            grandTotal = grandTotal + this.convertDecimalSeparatorStringToNumber(v.invoiceAmount);
        }
    });
    formValues.costDetails.forEach((v, k) => {
        if (!v.isDeleted) {
            if (typeof v.invoiceTotalAmount != 'undefined') {
                grandTotal = grandTotal + this.convertDecimalSeparatorStringToNumber(v.invoiceTotalAmount);
            }
        }
    });
    return grandTotal;
  }

  calculateInvoiceEstimatedGrandTotal(formValues) {
    let grandTotal = 0;
    formValues.productDetails.forEach((v, k) => {
      if (!v.isDeleted && typeof v.estimatedAmount != 'undefined') {
        grandTotal = grandTotal + this.convertDecimalSeparatorStringToNumber(v.estimatedAmount);
      }
    });
    
    formValues.costDetails.forEach((v, k) => {
      if (!v.isDeleted) {
        if (typeof v.estimatedAmount != 'undefined') {
            grandTotal = grandTotal + this.convertDecimalSeparatorStringToNumber(v.estimatedAmount);
        }
      }
    });
    return grandTotal;
  }

  convertDecimalSeparatorStringToNumber(number) {
    var numberToReturn = number;
    var decimalSeparator, thousandsSeparator;
    if (typeof number == 'string') {
        if (number.indexOf(',') != -1 && number.indexOf('.') != -1) {
          if (number.indexOf(',') > number.indexOf('.')) {
            decimalSeparator = ',';
            thousandsSeparator = '.';
          } else {
            thousandsSeparator = ',';
            decimalSeparator = '.';
          }
          numberToReturn = parseFloat(number.split(decimalSeparator)[0].replace(new RegExp(thousandsSeparator, 'g'), '')) + parseFloat(`0.${number.split(decimalSeparator)[1]}`);
        } else {
          numberToReturn = parseFloat(number);
        }
    }
    if (isNaN(numberToReturn)) {
      numberToReturn = 0;
    }
    return parseFloat(numberToReturn);
  }

  calculateProductRecon(product) {
    if (!product.invoiceRateCurrency || !product.estimatedRateCurrency) {
      return false;
    }
    if (!product.invoiceRateCurrency.id || !product.estimatedRateCurrency.id) {
      return false;
    }
    this.invoiceService
    .calculateProductRecon(product)
    .pipe(
        finalize(() => {

        })
    )
    .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.spinner.hide();
          this.toastr.error(result);
        } else {
          var obj;
          if (result.data == 1) {
            obj = {
              id: 1,
              name: 'Matched'
            };
          } else {
            obj = {
              id: 2,
              name: 'Unmatched'
            };
          }
          product.reconStatus = obj;
          this.changeDetectorRef.detectChanges();
        }
    });

  }


  removeProductDetailLine(key) {
    if (this.formValues.productDetails[key].id) {
      this.formValues.productDetails[key].isDeleted = true;
    } else {
      this.formValues.productDetails.splice(key, 1);
    }
    this.productDetailsExpandArray[key] =  false;
  }

  addTransaction() {
    this.productMenuTrigger.closeMenu();
    this.deliveriesToBeInvoicedList = [];
    let payload = {"Payload":
        {"Order":null,
        "PageFilters":
            {"Filters":[]},
        "SortList":{"SortList":[]},"Filters":[{"ColumnName":"Order_Id","Value": this.formValues.orderDetails ? this.formValues.orderDetails.order.id : ''}],"SearchText":null,"Pagination":{"Skip":0,"Take":999999}}};
    this.spinner.show();
    this.invoiceService
    .addTransaction(payload)
    .pipe(
      finalize(() => {
        this.spinner.hide();
      })
    )
    .subscribe((result: any) => {
      if (typeof result == 'string') {
        this.spinner.hide();
        this.toastr.error(result);
      } else {
        this.deliveriesToBeInvoicedList = result;
        this.productMenuTrigger.openMenu();
        this.changeDetectorRef.detectChanges();
      }

    });
    
  }

  searchProducts(value: string): void {
    let filterProducts = this.deliveriesToBeInvoicedList.filter((option) => option.product.name.toLowerCase().includes(value));
    this.deliveriesToBeInvoicedList = [ ... filterProducts];
    this.changeDetectorRef.detectChanges();
  }

  addTransactionsInInvoice(rowData) {
    console.log(rowData);
    let transactionstobeinvoiced_dtRow;
    if (rowData.costName) {
      let transaction_type = 'cost';
      rowData.product.productId = rowData.product.id;
      transactionstobeinvoiced_dtRow = {
        product: rowData.product,
        costName: rowData.costName,
        costType: rowData.costType,
        orderAdditionalCostId: rowData.orderAdditionalCostId,
        deliveryProductId: rowData.deliveryProductId,
        deliveryQuantity: rowData.deliveryQuantity,
        deliveryQuantityUom: rowData.deliveryQuantityUom,
        estimatedAmount: rowData.estimatedAmount,
        estimatedAmountCurrency: rowData.estimatedAmountCurrency,
        estimatedRate: rowData.estimatedRate,
        estimatedRateCurrency: rowData.estimatedRateCurrency,
        invoiceRateCurrency: this.formValues.invoiceRateCurrency,
        estimatedRateUom: rowData.estimatedRateUom,
        sulphurContent: rowData.sulphurContent,
        pricingDate: rowData.pricingDate,
        isDeleted: rowData.isDeleted,
        invoiceAmount: rowData.invoiceAmount,
        invoiceQuantity: rowData.deliveryQuantity,
        invoiceTotalAmount: rowData.invoiceTotalAmount,
        estimatedTotalAmount: rowData.estimatedTotalAmount,
        // new on 30.08.2018
        invoiceQuantityUom: rowData.invoiceQuantityUom,
        invoiceRateUom: rowData.invoiceRateUom,
        estimatedExtras: rowData.estimatedExtra,
        // invoiceExtras: rowData.estimatedExtra,
        estimatedExtrasAmount: rowData.estimatedExtraAmount
    };
    }

    if (rowData.delivery) {
      rowData.product.productId = rowData.product.id;
      transactionstobeinvoiced_dtRow = {
        amountInInvoice: '',
        deliveryNo: rowData.delivery.name,
        agreementType: rowData.agreementType,
        deliveryProductId: rowData.deliveryProductId,
        invoicedProduct: rowData.invoicedProduct,
        orderedProduct: rowData.orderedProduct,
        confirmedQuantity: rowData.confirmedQuantity,
        confirmedQuantityUom: rowData.confirmedQuantityUom,
        deliveryQuantity: rowData.deliveryQuantity,
        deliveryQuantityUom: rowData.confirmedQuantityUom,
        deliveryMFM: rowData.deliveryMFM,
        sulphurContent: rowData.sulphurContent,
        difference: '',
        estimatedAmount: rowData.estimatedAmount,
        estimatedAmountCurrency: rowData.estimatedRateCurrency,
        estimatedRate: rowData.estimatedRate,
        estimatedRateCurrency: rowData.estimatedRateCurrency,
        invoiceAmount: '',
        invoiceAmountCurrency: {},
        invoiceQuantity: '',
        invoiceQuantityUom: {},
        invoiceRate: '',
        invoiceRateUom: rowData.invoiceRateUom,
        invoiceRateCurrency: this.formValues.invoiceRateCurrency,
        isDeleted: rowData.isDeleted,
        pricingDate: rowData.pricingDate,
        product: rowData.product,
        physicalSupplierCounterparty: rowData.physicalSupplierCounterparty,
        estimatedRateUom: rowData.estimatedRateUom,
        pricingScheduleName: rowData.pricingScheduleName,
        reconStatus: {
          id: 1,
          name: 'Matched',
          code: '',
          collectionName: null
        }
      };
    }

    let alreadyExists = false;
    if (rowData.costName) {
      alreadyExists = false;
      this.formValues.costDetails.forEach((val, idx) => {
        if (rowData.orderAdditionalCostId == val.orderAdditionalCostId) {
          alreadyExists = true;
        }
      });
      if (!alreadyExists) {
        this.formValues.costDetails.push(transactionstobeinvoiced_dtRow);
        this.costDetailsChanged.emit(true);
      } else {
        this.toastr.error('Selected cost already exists');
      }
    }

    if (rowData.delivery) {
      alreadyExists = false;
      this.formValues.productDetails.forEach((val, idx) => {
        if (rowData.deliveryProductId == val.deliveryProductId && !val.isDeleted) {
          alreadyExists = true;
        }
      });
      if (!alreadyExists) {
        transactionstobeinvoiced_dtRow.invoiceQuantity = transactionstobeinvoiced_dtRow.deliveryQuantity;
        transactionstobeinvoiced_dtRow.invoiceQuantityUom = transactionstobeinvoiced_dtRow.deliveryQuantityUom;
        this.formValues.productDetails.push(transactionstobeinvoiced_dtRow);
      } else {
        this.toastr.error('Selected product already exists');
      }
    }
    this.selectedProductLine = null;
    this.changeDetectorRef.detectChanges();
  }



}
