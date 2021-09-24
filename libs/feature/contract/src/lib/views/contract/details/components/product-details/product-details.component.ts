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
import {
  IDisplayLookupDto,
  IOrderLookupDto
} from '@shiptech/core/lookups/display-lookup-dto.interface';
import {
  knowMastersAutocompleteHeaderName,
  knownMastersAutocomplete
} from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
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
import {
  DeliveryInfoForOrder,
  IDeliveryInfoForOrderDto,
  OrderInfoDetails
} from 'libs/feature/delivery/src/lib/services/api/dto/delivery-details.dto';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  NativeDateAdapter
} from '@angular/material/core';
import moment, { Moment, MomentFormatSpecification, MomentInput } from 'moment';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  _MatAutocompleteBase
} from '@angular/material/autocomplete';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { IDeliveryTenantSettings } from 'libs/feature/delivery/src/lib/core/settings/delivery-tenant-settings';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import _ from 'lodash';
import {
  NgxMatDateAdapter,
  NgxMatDateFormats,
  NgxMatNativeDateAdapter,
  NGX_MAT_DATE_FORMATS
} from '@angular-material-components/datetime-picker';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ContractService } from 'libs/feature/contract/src/lib/services/contract.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { DecimalPipe, KeyValue } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { MatMenuTrigger } from '@angular/material/menu';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ProductSpecGroupModalComponent } from '../product-spec-group-modal/product-spec-group-modal.component';
import { OVERLAY_KEYBOARD_DISPATCHER_PROVIDER_FACTORY } from '@angular/cdk/overlay/dispatchers/overlay-keyboard-dispatcher';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'YYYY-MM-DD HH:mm'
  },
  display: {
    dateInput: 'YYYY-MM-DD HH:mm',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

export const PICK_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
  parse: {
    dateInput: 'DD MMM YYYY'
  }
};

@Injectable()
export class CustomDateAdapter extends MomentDateAdapter {
  public format(value: moment.Moment, displayFormat: string): string {
    if (value === null || value === undefined) return '';
    let currentFormat = PICK_FORMATS.display.dateInput;
    let hasDayOfWeek;
    if (currentFormat.startsWith('DDD ')) {
      hasDayOfWeek = true;
      currentFormat = currentFormat.split('DDD ')[1];
    }
    currentFormat = currentFormat.replace(/d/g, 'D');
    currentFormat = currentFormat.replace(/y/g, 'Y');
    currentFormat = currentFormat.split(' HH:mm')[0];
    let formattedDate = moment.utc(value).format(currentFormat);
    if (hasDayOfWeek) {
      formattedDate = `${moment.utc(value).format('ddd')} ${formattedDate}`;
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
    let elem = moment.utc(value, currentFormat);
    return value ? elem : null;
  }
}
export interface NgxMatMomentDateAdapterOptions {
  strict?: boolean;

  useUtc?: boolean;
}

export const MAT_MOMENT_DATE_ADAPTER_OPTIONS_1 = new InjectionToken<
  NgxMatMomentDateAdapterOptions
>('MAT_MOMENT_DATE_ADAPTER_OPTIONS_1', {
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
    firstDayOfWeek: number;
    longMonths: string[];
    shortMonths: string[];
    dates: string[];
    longDaysOfWeek: string[];
    shortDaysOfWeek: string[];
    narrowDaysOfWeek: string[];
  };

  constructor(
    @Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string,
    @Optional()
    @Inject(MAT_MOMENT_DATE_ADAPTER_OPTIONS_1)
    private _options?: NgxMatMomentDateAdapterOptions
  ) {
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
      dates: range(31, i => this.createDate(2017, 0, i + 1).format('D')),
      longDaysOfWeek: momentLocaleData.weekdays(),
      shortDaysOfWeek: momentLocaleData.weekdaysShort(),
      narrowDaysOfWeek: momentLocaleData.weekdaysMin()
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
    return style === 'long'
      ? this._localeData.longMonths
      : this._localeData.shortMonths;
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
      throw Error(
        `Invalid month index "${month}". Month index has to be between 0 and 11.`
      );
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    const result = this._createMoment({ year, month, date }).locale(
      this.locale
    );
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
    const elem = moment(value, currentFormat);
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
      formattedDate = `${moment(date).format('ddd')} ${formattedDate}`;
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
      const elem = moment(value, 'YYYY-MM-DDTHH:mm:ss');
      const newVal = moment(elem).format(currentFormat);
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
    date.minutes(value);
  }
  setSecond(date: Moment, value: number): void {
    date.seconds(value);
  }

  private _createMoment(
    date: MomentInput,
    format?: MomentFormatSpecification,
    locale?: string
  ): Moment {
    const { strict, useUtc }: NgxMatMomentDateAdapterOptions =
      this._options || {};

    return useUtc
      ? moment.utc(date, format, locale, strict)
      : moment(date, format, locale, strict);
  }
}
@Component({
  selector: 'shiptech-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    OrderListGridViewModel,
    DialogService,
    ConfirmationService,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    {
      provide: NgxMatDateAdapter,
      useClass: CustomNgxDatetimeAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS_1]
    },
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class ProductDetails extends DeliveryAutocompleteComponent
  implements OnInit {
  switchTheme; //false-Light Theme, true- Dark Theme
  formValues: any;
  _entityId: number;
  baseOrigin: string;
  _entityName: string;
  contractualQuantityOptionList: any;
  uomList: any;
  quantityFormat: string;
  locationList: any;
  productList: any;
  locationMasterList: any;
  productSpecGroup: any = [];

  displayedColumns: string[] = ['name', 'country'];
  displayedProductColumns: string[] = ['name', 'productType'];

  @ViewChild('mySelect') mySelect: MatSelect;

  @ViewChildren('locationMenuTrigger') locationMenuTrigger;
  @ViewChildren('productMenuTrigger') productMenuTrigger;

  productMasterList: any;
  expandLocationProductPopUp = false;
  locationMasterSearchList: any[];
  searchLocationInput: any;
  expandCompanyPopUp: any;
  searchCompanyModel: any;
  productMasterSearchList: any[];
  generalTenantSettings: any;

  selectedLocation: any;
  selectedProduct: any;
  selectedTabIndex: number = 0;
  expandAllowCompanies: false;

  searchProductInput: any;
  selectedLocationList: any[];
  selectedProductList: any[];

  expandAllowLocations: boolean = false;
  expandAllowProducts: boolean = false;
  uomVolumeList: any;
  uomMassList: any;
  contractConversionFactorOptions: any;
  isDealDateInvalid: boolean;
  physicalSupplierList: any[];
  autocompletePhysicalSupplier: knownMastersAutocomplete;
  _autocompleteType: any;
  modalSpecGroupParameters: any;
  modalSpecGroupParametersEditable: boolean;
  canChangeSpec: boolean;
  specParameterList: any;
  activeProductForSpecGroupEdit: any;
  eventsSubscription: any;
  events1Subscription: any;
  contractConfiguration: any;
  filteredOptions: Observable<string[]>;
  filteredAllowedLocationOptions: Observable<string[]>;
  filteredAllowedProductOptions: Observable<string[]>;
  openedScreenLoaders: number = 0;

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

  @Input('contractProductIndex') set _setContractProductIndex(
    contractProductIndex
  ) {
    if (!contractProductIndex) {
      return;
    }
    this.selectedTabIndex = contractProductIndex;
  }

  @Input('locationMasterList') set _setLocationMasterList(locationMasterList) {
    if (!locationMasterList) {
      return;
    }
    this.locationMasterList = _.cloneDeep(locationMasterList);
    this.locationMasterSearchList = _.cloneDeep(locationMasterList);
    this.selectedLocationList = _.cloneDeep(locationMasterList);
    if (this.formValues && this.formValues.products) {
      this.setAllowedLocations(this.selectedTabIndex);
    }
  }

  @Input('productMasterList') set _setProductMasterList(productMasterList) {
    if (!productMasterList) {
      return;
    }

    this.productMasterList = _.cloneDeep(productMasterList);
    this.productMasterSearchList = _.cloneDeep(this.productMasterList);
    this.selectedProductList = _.cloneDeep(this.productMasterList);
    if (this.formValues && this.formValues.products) {
      this.setAllowedProducts(this.selectedTabIndex);
    }
  }

  @Input('specParameterList') set _setSpecParameterList(specParameterList) {
    if (!specParameterList) {
      return;
    }
    this.specParameterList = specParameterList;
  }

  @Input('uomList') set _setUomList(uomList) {
    if (!uomList) {
      return;
    }
    this.uomList = uomList;
  }

  @Input('productSpecGroup') set _setProductSpecGroup(productSpecGroup) {
    if (!productSpecGroup) {
      return;
    }
    this.productSpecGroup = productSpecGroup;
  }

  @Input('uomVolumeList') set _setUomVolumeList(uomVolumeList) {
    if (!uomVolumeList) {
      return;
    }
    this.uomVolumeList = uomVolumeList;
  }

  @Input('uomMassList') set _setUomMassList(uomMassList) {
    if (!uomMassList) {
      return;
    }
    this.uomMassList = uomMassList;
  }

  @Input('contractConversionFactorOptions')
  set _setContractConversionFactorOptions(contractConversionFactorOptions) {
    if (!contractConversionFactorOptions) {
      return;
    }
    this.contractConversionFactorOptions = contractConversionFactorOptions;
  }

  @Input('model') set _setFormValues(formValues) {
    if (!formValues) {
      return;
    }
    this.formValues = formValues;
  }

  @Input('generalTenantSettings') set _setGeneralTenantSettings(
    generalTenantSettings
  ) {
    if (!generalTenantSettings) {
      return;
    }
    this.generalTenantSettings = generalTenantSettings;
  }

  @Input('contractConfiguration') set _setContractConfiguration(
    contractConfiguration
  ) {
    if (!contractConfiguration) {
      return;
    }
    this.contractConfiguration = contractConfiguration;
  }

  index = 0;
  expandLocationPopUp = false;
  array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  isMenuOpen = true;
  @Input() events: Observable<void>;
  @Input() events1: Observable<void>;

  @Input('auto1')
  autocomplete: _MatAutocompleteBase;

  searchAllowedLocation: any = '';
  allowedLocationSearch = new FormControl();
  allowedProductSearch = new FormControl();

  constructor(
    public gridViewModel: OrderListGridViewModel,
    @Inject(VESSEL_MASTERS_API_SERVICE) private mastersApi: IVesselMastersApi,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private appConfig: AppConfig,
    private httpClient: HttpClient,
    changeDetectorRef: ChangeDetectorRef,
    private contractService: ContractService,
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
    private overlayContainer: OverlayContainer
  ) {
    super(changeDetectorRef);
    this.autocompletePhysicalSupplier =
      knownMastersAutocomplete.physicalSupplier;
    this.dateFormats.display.dateInput = this.format.dateFormat;
    this.dateFormats.parse.dateInput = this.format.dateFormat;
    this.dateTimeFormats.display.dateInput = this.format.dateFormat;
    CUSTOM_DATE_FORMATS.display.dateInput = this.format.dateFormat;
    PICK_FORMATS.display.dateInput = this.format.dateFormat;
    this.baseOrigin = new URL(window.location.href).origin;
    this.quantityFormat =
      '1.' +
      this.tenantService.quantityPrecision +
      '-' +
      this.tenantService.quantityPrecision;
  }

  ngOnInit() {
    this.entityName = 'Contract';
    console.log('Product details');
    console.log(this.locationMasterList);
    console.log(this.formValues);
    if (this.formValues && this.formValues.products) {
      this.setAllowedLocations(this.selectedTabIndex);
      this.setAllowedProducts(this.selectedTabIndex);
    }
    this.getPhysicalSupplierList();
    this.eventsSubscription = this.events.subscribe(data =>
      this.setContractForm(data)
    );
    this.events1Subscription = this.events1.subscribe(data =>
      this.setProductSpecGroup(data)
    );
    this.filteredAllowedLocationOptions = this.allowedLocationSearch.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.filteredAllowedProductOptions = this.allowedProductSearch.valueChanges.pipe(
      startWith(''),
      map(value => this._filter1(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.selectedLocationList.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filter1(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.selectedProductList.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  setProductSpecGroup(data) {
    console.log(data);
    this.productSpecGroup = data;
  }

  setContractForm(form) {
    this.formValues = form;
    console.log(this.formValues);
  }

  async getPhysicalSupplierList() {
    this.physicalSupplierList = await this.legacyLookupsDatabase.getPhysicalSupplierList();
    this.physicalSupplierList.forEach((v, k) => {
      v.name = this.decodeSpecificField(v.name);
    });
    console.log(this.physicalSupplierList);
  }

  getHeaderNameSelector1(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.physicalSupplier:
        return knowMastersAutocompleteHeaderName.physicalSupplier;
      default:
        return knowMastersAutocompleteHeaderName.physicalSupplier;
    }
  }

  searchLocations(value: string): void {
    let filterLocations = this.locationMasterList.filter(location =>
      location.name.toLowerCase().includes(value)
    );
    console.log(filterLocations);
    this.locationMasterSearchList = [...filterLocations];
    this.changeDetectorRef.detectChanges();
  }

  searchProducts(value: string): void {
    let filterProducts = this.productMasterList.filter(location =>
      location.name.toLowerCase().includes(value)
    );
    console.log(filterProducts);
    this.productMasterSearchList = [...filterProducts];
    this.changeDetectorRef.detectChanges();
  }

  openAddLocationSelect() {
    this.searchLocationInput = null;
    if (this.locationMasterList) {
      this.locationMasterSearchList = [...this.locationMasterList];
      this.changeDetectorRef.detectChanges();
    }
    this.mySelect.close();
    this.mySelect.open();
  }

  clickAdd(key) {
    console.log('as');
    let trigger = this.locationMenuTrigger._results;
    for (let i = 0; i < this.locationMenuTrigger._results.length; i++) {
      if (i != key) {
        trigger[i].closeMenu();
      } else {
        trigger[i].openMenu();
      }
    }

    console.log(trigger);
    this.isMenuOpen = true;
  }

  onClickedOutside(event) {
    console.log(event);
  }

  addProductToContract() {
    console.log(this.formValues);
    let emptyProductObj = {
      id: 0,
      details: [
        {
          contractualQuantityOption: {
            id: 1,
            name: 'TotalContractualQuantity',
            code: '',
            collectionName: null
          },
          id: 0,
          uom: this.generalTenantSettings.tenantFormats.uom
        }
      ],
      additionalCosts: [],
      fixedPrice: true,
      mtmFixed: true,
      specGroup: null,
      dealDate: null,
      physicalSupplier: null,
      allowedProducts: [],
      allowedLocations: []
    };
    if (this.formValues) {
      if (!this.formValues.products) {
        this.formValues.products = [];
        this.formValues.products.push(emptyProductObj);
      } else {
        this.formValues.products.push(emptyProductObj);
      }
    } else {
      this.formValues = {};
      this.formValues.products = [];
      this.formValues.products.push(emptyProductObj);
    }

    this.selectedTabIndex = this.formValues.products.length - 1;
    this.setAllowedLocations(this.selectedTabIndex);
    this.setAllowedProducts(this.selectedTabIndex);
    this.changeDetectorRef.detectChanges();

    console.log(this.formValues);
  }

  setAllowedLocations(selectedTabIndex) {
    this.selectedLocationList = _.cloneDeep(this.locationMasterList);
    let contractProduct = this.formValues.products[selectedTabIndex];
    if (
      contractProduct.allowedLocations &&
      contractProduct.allowedLocations.length
    ) {
      for (let i = 0; i < contractProduct.allowedLocations.length; i++) {
        let allowedLocation = contractProduct.allowedLocations[i];
        let findIndexOfLocationInLocationList = _.findIndex(
          this.selectedLocationList,
          function(obj) {
            return (
              obj.id == allowedLocation.id && obj.name == allowedLocation.name
            );
          }
        );
        if (findIndexOfLocationInLocationList != -1) {
          this.selectedLocationList[
            findIndexOfLocationInLocationList
          ].isSelected = true;
        }
      }
    }
    console.log(this.selectedLocationList);
  }

  saveAllowedLocations(selectedTabIndex) {
    let newAllowedLocations = [];
    let allowedLocations = this.selectedLocationList;
    for (let i = 0; i < allowedLocations.length; i++) {
      if (allowedLocations[i].isSelected) {
        let allowedLocation = {
          id: allowedLocations[i].id,
          name: allowedLocations[i].name
        };
        newAllowedLocations.push(allowedLocation);
      }
    }

    this.formValues.products[selectedTabIndex].allowedLocations = _.cloneDeep(
      newAllowedLocations
    );
  }

  setAllowedProducts(selectedTabIndex) {
    this.selectedProductList = _.cloneDeep(this.productMasterList);
    let contractProduct = this.formValues.products[selectedTabIndex];
    if (
      contractProduct.allowedProducts &&
      contractProduct.allowedProducts.length
    ) {
      for (let i = 0; i < contractProduct.allowedProducts.length; i++) {
        let allowedProduct = contractProduct.allowedProducts[i];
        let findIndexOfProductInProductList = _.findIndex(
          this.selectedProductList,
          function(obj) {
            return (
              obj.id == allowedProduct.id && obj.name == allowedProduct.name
            );
          }
        );
        if (findIndexOfProductInProductList != -1) {
          this.selectedProductList[
            findIndexOfProductInProductList
          ].isSelected = true;
        }
      }
    }
    this.changeDetectorRef.detectChanges();
    console.log(this.selectedProductList);
  }

  saveAllowedProducts(selectedTabIndex) {
    let newAllowedProducts = [];
    let allowedProducts = this.selectedProductList;
    for (let i = 0; i < allowedProducts.length; i++) {
      if (allowedProducts[i].isSelected) {
        let allowedProduct = {
          id: allowedProducts[i].id,
          name: allowedProducts[i].name
        };
        newAllowedProducts.push(allowedProduct);
      }
    }

    let previousAllowedProducts = _.cloneDeep(
      this.formValues.products[selectedTabIndex].allowedProducts
    );
    this.formValues.products[selectedTabIndex].allowedProducts = _.cloneDeep(
      newAllowedProducts
    );

    //check new  allowed products added
    for (
      let i = 0;
      i < this.formValues.products[selectedTabIndex].allowedProducts.length;
      i++
    ) {
      let allowedProduct = {
        ...this.formValues.products[selectedTabIndex].allowedProducts[i]
      };
      let findProductIfExistsInPreviousAllowedProducts = _.find(
        previousAllowedProducts,
        function(obj) {
          return obj.id == allowedProduct.id && obj.name == allowedProduct.name;
        }
      );
      //new allowed product added
      if (!findProductIfExistsInPreviousAllowedProducts) {
        this.addProductToConversion(selectedTabIndex, allowedProduct, false);
      }
    }

    //check allowed products removed
    for (let i = 0; i < previousAllowedProducts.length; i++) {
      let previousAllowedProduct = { ...previousAllowedProducts[i] };
      let findProductIfExistsInAllowedProducts = _.find(
        this.formValues.products[selectedTabIndex].allowedProducts,
        function(obj) {
          return (
            obj.id == previousAllowedProduct.id &&
            obj.name == previousAllowedProduct.name
          );
        }
      );
      //product was removed from allowed product
      if (!findProductIfExistsInAllowedProducts) {
        this.addProductToConversion(selectedTabIndex, null, false);
      }
    }
  }

  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  onChange($event, field) {
    if ($event.value) {
      let beValue = `${moment($event.value).format(
        'YYYY-MM-DDTHH:mm:ss'
      )}+00:00`;
      if (field == 'dealDate') {
        this.isDealDateInvalid = false;
      }
      console.log(beValue);
    } else {
      if (field == 'dealDate') {
        this.isDealDateInvalid = true;
      }
      this.toastr.error('Please enter the correct format');
    }
  }

  formatDateForBe(value) {
    if (value) {
      let beValue = `${moment(value).format('YYYY-MM-DDTHH:mm:ss')}+00:00`;
      return `${moment(value).format('YYYY-MM-DDTHH:mm:ss')}+00:00`;
    } else {
      return null;
    }
  }

  displayFn(product): string {
    return product && product.name ? product.name : '';
  }

  filterPhysicalSupplierList() {
    if (this.formValues.products[this.selectedTabIndex].physicalSupplier) {
      const filterValue = this.formValues.products[this.selectedTabIndex]
        .physicalSupplier.name
        ? this.formValues.products[
            this.selectedTabIndex
          ].physicalSupplier.name.toLowerCase()
        : this.formValues.products[
            this.selectedTabIndex
          ].physicalSupplier.toLowerCase();
      console.log(filterValue);
      if (this.physicalSupplierList) {
        return this.physicalSupplierList
          .filter(option =>
            option.name.toLowerCase().includes(filterValue.trim())
          )
          .slice(0, 10);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  selectorPhysicalSupplierSelectionChange(selection: IDisplayLookupDto): void {
    if (selection === null || selection === undefined) {
      this.formValues.products[this.selectedTabIndex].physicalSupplier = '';
    } else {
      const obj = {
        id: selection.id,
        name: this.decodeSpecificField(selection.name)
      };
      this.formValues.products[this.selectedTabIndex].physicalSupplier = obj;
      this.changeDetectorRef.detectChanges();
      console.log(this.formValues.products[this.selectedTabIndex]);
    }
  }

  getSpecGroupByProduct(productId, additionalSpecGroup) {
    var data = {
      Payload: {
        Filters: [
          {
            ColumnName: 'ProductId',
            Value: productId
          }
        ]
      }
    };
    if (typeof this.productSpecGroup == 'undefined') {
      this.productSpecGroup = [];
    }

    // if spec group for product exists, do not make call again
    if (typeof this.productSpecGroup[productId] != 'undefined') {
      return;
    }

    this.contractService
      .getSpecGroupGetByProduct(data)
      .pipe(finalize(() => {}))
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          console.log(response);
          if (response) {
            response = _.filter(response, function(o) {
              return o.isDeleted == false;
            });
            if (additionalSpecGroup) {
              var additionalSpecIsInArray = false;
              response.forEach(function(v, k) {
                if (v.id == additionalSpecGroup.id) {
                  additionalSpecIsInArray = true;
                }
              });
              if (!additionalSpecIsInArray) {
                response.push(additionalSpecGroup);
              }
            }
            this.productSpecGroup[productId] = response;
            this.changeDetectorRef.detectChanges();
          }
        }
      });
  }

  openSpecGroupPopUp(product) {
    if (!product.specGroup) {
      this.toastr.error('Please select a spec group!');
      return;
    }
    this.activeProductForSpecGroupEdit = product;
    var productId = product.product.id;
    var data = {
      Payload: {
        Filters: [
          {
            ColumnName: 'ContractProductId',
            Value: product.id ? product.id : null
          },
          {
            ColumnName: 'SpecGroupId',
            Value: product.specGroup.id
          },
          {
            ColumnName: 'ProductId',
            Value: productId
          }
        ]
      }
    };
    if (this.formValues.status) {
      if (this.formValues.status.name != 'Confirmed' && product.id != 0) {
        this.modalSpecGroupParametersEditable = true;
        this.canChangeSpec = true;
      }
    }
    this.spinner.show();
    this.contractService
      .getSpecForProcurement(data)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          console.log(response);
          if (response) {
            this.modalSpecGroupParameters = response;
            for (let i = 0; i < this.modalSpecGroupParameters.length; i++) {
              this.modalSpecGroupParameters[
                i
              ].specParameter.name = this.decodeSpecificField(
                this.modalSpecGroupParameters[i].specParameter.name
              );
            }
            const dialogRef = this.dialog.open(ProductSpecGroupModalComponent, {
              width: '50%',
              data: {
                modalSpecGroupParameters: this.modalSpecGroupParameters,
                modalSpecGroupParametersEditable: this
                  .modalSpecGroupParametersEditable,
                specParameterList: this.specParameterList,
                activeProductForSpecGroupEdit: this
                  .activeProductForSpecGroupEdit
              }
            });

            dialogRef.afterClosed().subscribe(result => {
              console.log(result);
            });
          }
        }
      });
  }

  decodeSpecificField(modelValue) {
    let decode = function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
    };
    return decode(_.unescape(modelValue));
  }

  setLocationChange(location, index) {
    console.log(location);
    console.log(index);
    console.log(this.formValues.products[index]);
    let objectLocation = {
      id: location.id,
      name: location.name
    };
    this.selectedLocation = null;
    this.formValues.products[index].location = { ...objectLocation };
    this.changeDetectorRef.detectChanges();
  }

  setProductChange(product, index) {
    console.log(product);
    console.log(index);
    console.log(this.formValues.products[index]);
    let objectProduct = {
      id: product.id,
      name: product.name
    };
    this.formValues.products[index].product = { ...objectProduct };
    this.selectedProduct = null;
    this.changeDetectorRef.detectChanges();
    this.addProductToConversion(index, null, true);
  }

  addProductToConversion(index, allowProduct, isMainProduct) {
    if (!this.formValues.products[index].conversionFactors) {
      this.formValues.products[index].conversionFactors = [];
    }
    let selectedProduct,
      isAlreadyAdded = 0,
      indexDeleted = -1;
    let payload;

    if (isMainProduct) {
      selectedProduct = this.formValues.products[index];
      if (this.formValues.products[index].conversionFactors.length) {
        var allowProducts = this.formValues.products[index].allowedProducts;
        if (allowProducts.length) {
          this.formValues.products[index].conversionFactors.forEach(
            (value, key) => {
              var idIndex = _.findIndex(allowProducts, (o: any) => {
                return o.id == value.product.id;
              });
              if (idIndex == -1) {
                if (value.id == 0) {
                  this.formValues.products[index].conversionFactors.splice(
                    key,
                    1
                  );
                  return;
                }
                this.formValues.products[index].conversionFactors[
                  key
                ].isDeleted = true;
              }
            }
          );
        } else {
          var indexProduct =
            this.formValues.products[index].conversionFactors.length - 1;
          this.formValues.products[index].conversionFactors[
            indexProduct
          ].isDeleted = true;
        }
      }
    } else if (allowProduct != null) {
      selectedProduct = { product: allowProduct };
    } else if (allowProduct == null) {
      var allowProducts = this.formValues.products[index].allowedProducts;
      if (allowProducts.length) {
        this.formValues.products[index].conversionFactors.forEach(
          (value, key) => {
            if (
              value.product.id != this.formValues.products[index].product.id
            ) {
              var idIndex = _.findIndex(allowProducts, (o: any) => {
                return o.id == value.product.id;
              });
              if (idIndex == -1) {
                indexDeleted = key;
                if (value.id == 0) {
                  this.formValues.products[index].conversionFactors.splice(
                    indexDeleted,
                    1
                  );
                  return;
                }
                this.formValues.products[index].conversionFactors[
                  indexDeleted
                ].isDeleted = true;
              }
            }
          }
        );
      } else {
        this.formValues.products[index].conversionFactors.forEach(
          (value, key) => {
            if (
              value.product.id != this.formValues.products[index].product.id &&
              !value.isDeleted
            ) {
              if (value.id == 0) {
                this.formValues.products[index].conversionFactors.splice(
                  key,
                  1
                );
                return;
              }
              this.formValues.products[index].conversionFactors[
                key
              ].isDeleted = true;
            }
          }
        );
      }
    }
    if (this.formValues.products[index].conversionFactors) {
      if (selectedProduct) {
        let indexProduct = _.findLastIndex(
          this.formValues.products[index].conversionFactors,
          (o: any) => {
            return o.product.id == selectedProduct.product.id;
          }
        );
        if (indexProduct != -1) {
          if (
            !this.formValues.products[index].conversionFactors[indexProduct]
              .isDeleted
          ) {
            this.toastr.error('Product is already added');
            isAlreadyAdded = 1;
          }
        }
      }
    }
    if (!isAlreadyAdded && indexDeleted == -1 && selectedProduct) {
      payload = { Payload: { ProductId: selectedProduct.product.id } };
      this.spinner.show();
      this.contractService
        .getProdDefaultConversionFactors(payload)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          })
        )
        .subscribe((response: any) => {
          if (typeof response == 'string') {
            this.toastr.error(response);
          } else {
            console.log(response);
            let contractConversionFactor = {
              id: 3,
              name: 'Standard (Product)'
            };
            let object = {
              id: 0,
              product: selectedProduct.product,
              value: response.value,
              massUom: response.massUom,
              volumeUom: response.volumeUom,
              contractConversionFactorOptions: contractConversionFactor
            };
            this.formValues.products[index].conversionFactors.push(object);
            this.changeDetectorRef.detectChanges();
          }
        });
    }
  }

  saveConversionFactors(conversionFactors, conversionFactorsDropdown) {
    if (
      conversionFactorsDropdown &&
      (conversionFactors.contractConversionFactorOptions.id == 3 ||
        conversionFactors.contractConversionFactorOptions.id == 4)
    ) {
      let payload = {};
      if (conversionFactors.contractConversionFactorOptions.id == 4) {
        let product = this.formValues.products[this.selectedTabIndex];
        if (product.fixedPrice) {
          this.toastr.warning(
            'Please select formula for using system instrument conversion'
          );
          return;
        }
        if (product.isFormula) {
          if (!(product.formula && product.formula.id)) {
            this.toastr.warning(
              'Please select formula for using system instrument conversion'
            );
            return;
          }

          if (product.formula && product.formula.id) {
            payload = {
              Payload: {
                ProductId: conversionFactors.product.id,
                FormulaId: product.formula.id
              }
            };
          }
        }
      } else {
        payload = { Payload: { ProductId: conversionFactors.product.id } };
      }
      this.openedScreenLoaders += 1;
      // this.spinner.show();
      this.contractService
        .getProdDefaultConversionFactors(payload)
        .pipe(
          finalize(() => {
            this.openedScreenLoaders -= 1;
            if (!this.openedScreenLoaders) {
              this.spinner.hide();
            }
          })
        )
        .subscribe((response: any) => {
          if (typeof response == 'string') {
            this.toastr.error(response);
            this.spinner.hide();
          } else {
            console.log(response);
            if (response) {
              conversionFactors.value = response.value;
              conversionFactors.massUom = response.massUom;
              conversionFactors.volumeUom = response.volumeUom;
              if (conversionFactors.contractProductId) {
                let conversionFactorsList = [];
                conversionFactorsList.push(conversionFactors);
                payload = { Payload: conversionFactorsList };
                this.openedScreenLoaders += 1;
                this.contractService
                  .saveConversionFactorsForContractProduct(payload)
                  .pipe(
                    finalize(() => {
                      this.openedScreenLoaders -= 1;
                      if (!this.openedScreenLoaders) {
                        this.spinner.hide();
                      }
                    })
                  )
                  .subscribe((response: any) => {
                    if (typeof response == 'string') {
                      this.toastr.error(response);
                    } else if (response) {
                      let res = response[0];
                      this.formValues.products[
                        this.selectedTabIndex
                      ].convFactorMassUom = res.massUom;
                      this.formValues.products[
                        this.selectedTabIndex
                      ].convFactorValue = res.value;
                      this.formValues.products[
                        this.selectedTabIndex
                      ].convFactorVolumeUom = res.volumeUom;
                    }
                  });
              }
            }
          }
        });
    } else {
      if (conversionFactors.contractProductId) {
        let conversionFactorsList = [];
        conversionFactorsList.push(conversionFactors);
        let payload = { Payload: conversionFactorsList };
        //this.spinner.show();
        this.contractService
          .saveConversionFactorsForContractProduct(payload)
          .pipe(
            finalize(() => {
              this.spinner.hide();
            })
          )
          .subscribe((response: any) => {
            if (typeof response == 'string') {
              this.toastr.error(response);
            } else if (response) {
              let res = response[0];
              this.formValues.products[
                this.selectedTabIndex
              ].convFactorMassUom = res.massUom;
              this.formValues.products[this.selectedTabIndex].convFactorValue =
                res.value;
              this.formValues.products[
                this.selectedTabIndex
              ].convFactorVolumeUom = res.volumeUom;
            }
          });
      }
    }
  }

  openSupplier() {
    document.getElementsByTagName('body')[0].click();
  }

  originalOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => {
    return 0;
  };

  ngAfterViewInit(): void {}
}
