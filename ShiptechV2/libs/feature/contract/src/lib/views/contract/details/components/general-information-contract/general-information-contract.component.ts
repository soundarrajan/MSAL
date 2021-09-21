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
  Optional
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
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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
import { DecimalPipe } from '@angular/common';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

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
  selector: 'shiptech-general-information-contract',
  templateUrl: './general-information-contract.component.html',
  styleUrls: ['./general-information-contract.component.scss'],
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
export class GeneralInformationContract extends DeliveryAutocompleteComponent
  implements OnInit {
  switchTheme; //false-Light Theme, true- Dark Theme
  formValues: any;
  baseOrigin: string;
  selectedVal: string;
  private _autocompleteType: any;
  autocompleteVessel: knownMastersAutocomplete;
  _entityName: string;
  _entityId: number;
  autocompleteSellers: knownMastersAutocomplete;
  autocompleteCompany: knownMastersAutocomplete;
  sellerList: any;
  companyList: any;
  selectedCompany: any;
  companyListForSearch: any;
  searchCompanyModel: any;
  expandCompanyPopUp: boolean = false;
  expandAllowCompanies: boolean = false;
  expandAllowCustomer: boolean = false;
  expandCompanylistPopUp: boolean = false;
  agreementTypeList: any;
  paymentTermList: any;
  incotermList: any;
  isValidFromDateInvalid: boolean;
  isValidToDateInvalid: boolean;
  applyToList: any;
  eventsSaveButtonSubscription: any;
  buttonClicked: any;
  statusColorCode: any;
  quantityFormat: string;
  quantityPrecision: string;
  contractConfiguration: any;
  initialCompanyList: any;
  generalConfiguration: any;
  customerList: any;
  tradeBookList: any;
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
    this.selectedVal = this.formValues.evergreen ? 'evergreen' : 'dateSpecific';
  }

  @Input('applyToList') set _setApplyToList(applyToList) {
    if (!applyToList) {
      return;
    }
    this.applyToList = applyToList;
  }
  @Input('tradeBookList') set _setTradeBookList(tradeBookList) {
    if (!tradeBookList) {
      return;
    }
    this.tradeBookList = tradeBookList;
  }

  @Input('sellerList') set _setSellerList(sellerList) {
    if (!sellerList) {
      return;
    }
    this.sellerList = sellerList;
    this.sellerList.forEach((v, k) => {
      v.name = this.decodeSpecificField(v.name);
    });
  }

  @Input('companyList') set _setCompanyList(companyList) {
    if (!companyList) {
      return;
    }
    this.companyList = _.cloneDeep(companyList);
    this.initialCompanyList = _.cloneDeep(companyList);
    this.companyListForSearch = _.cloneDeep(this.companyList);
  }

  @Input('agreementTypeList') set _setAgremeentType(agreementTypeList) {
    if (!agreementTypeList) {
      return;
    }
    this.agreementTypeList = agreementTypeList;
  }

  @Input('paymentTermList') set _setPaymentTermList(paymentTermList) {
    if (!paymentTermList) {
      return;
    }
    this.paymentTermList = paymentTermList;
  }

  @Input('incotermList') set _setIncotermList(incotermList) {
    if (!incotermList) {
      return;
    }
    this.incotermList = incotermList;
  }

  @Input('statusColorCode') set _setsStatusColorCode(statusColorCode) {
    if (!statusColorCode) {
      statusColorCode = '#9E9E9E';
    }
    this.statusColorCode = statusColorCode;
  }

  @Input('contractConfiguration') set _setContractConfiguration(
    contractConfiguration
  ) {
    if (!contractConfiguration) {
      return;
    }
    this.contractConfiguration = contractConfiguration;
  }

  @Input('generalConfiguration') set _setGeneralConfiguration(
    generalConfiguration
  ) {
    if (!generalConfiguration) {
      return;
    }
    this.generalConfiguration = generalConfiguration;
  }

  @Input('customerList') set _setCustomerList(customerList) {
    if (!customerList) {
      return;
    }
    this.customerList = customerList;
  }

  @Input() eventsSaveButton: Observable<void>;
  eventsSubject2: Subject<any> = new Subject<any>();
  expandAllowedCompanylistPopUp: any = false;
  expandCustomerListPopUp: any = false;
  expandCustomer: any = false;

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
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    iconRegistry: MatIconRegistry,
    public dialog: MatDialog,
    sanitizer: DomSanitizer,
    private tenantService: TenantFormattingService,
    @Inject(DecimalPipe) private _decimalPipe
  ) {
    super(changeDetectorRef);
    this.dateFormats.display.dateInput = this.format.dateFormat;
    this.dateFormats.parse.dateInput = this.format.dateFormat;
    this.dateTimeFormats.display.dateInput = this.format.dateFormat;
    CUSTOM_DATE_FORMATS.display.dateInput = this.format.dateFormat;
    PICK_FORMATS.display.dateInput = this.format.dateFormat;
    this.baseOrigin = new URL(window.location.href).origin;
    this.autocompleteSellers = knownMastersAutocomplete.sellers;
    this.autocompleteCompany = knownMastersAutocomplete.company;
    //this.dateTimeFormats.parse.dateInput = this.format.dateFormat;
    this.quantityPrecision =
      '1.' +
      this.tenantService.quantityPrecision +
      '-' +
      this.tenantService.quantityPrecision;
  }

  ngOnInit() {
    this.entityName = 'Contract';
    if (this.formValues.allowedCompanies) {
      this.selectedAllowedCompanies();
    }
    this.eventsSaveButtonSubscription = this.eventsSaveButton.subscribe(data =>
      this.setRequiredFields(data)
    );
    //this.eventsSubscription = this.events.subscribe((data) => this.setDeliveryForm(data));
    //this.eventsSaveButtonSubscription = this.eventsSaveButton.subscribe((data) => this.setRequiredFields(data))
    //this.eventsSubject.next();
    if (this.formValues.customers) {
      this.selectedCustomers();
    }
  }

  setRequiredFields(data) {
    this.buttonClicked = data;
  }

  public onValChange(val: string) {
    this.selectedVal = val;
    if (val == 'evergreen') {
      this.formValues.evergreen = true;
      this.formValues.validTo = null;
    } else {
      this.formValues.evergreen = false;
    }
  }

  selectedAllowedCompanies() {
    this.formValues.allowedCompanies.forEach((allowedCompany, k) => {
      let findCompanyIndex = _.findIndex(this.companyList, function(
        object: any
      ) {
        return object.id == allowedCompany.id;
      });
      if (findCompanyIndex != -1 && this.companyList) {
        this.companyList[findCompanyIndex].isSelected = true;
      }
    });
    this.changeDetectorRef.detectChanges();

    console.log(this.companyList);
  }
  selectedCustomers() {
    this.formValues.customers.forEach((customer, k) => {
      let findCustomerIndex = _.findIndex(this.customerList, function(
        object: any
      ) {
        return object.id == customer.id;
      });
      if (findCustomerIndex != -1 && this.customerList) {
        this.customerList[findCustomerIndex].isSelected = true;
      }
    });
    this.changeDetectorRef.detectChanges();
    console.log(this.customerList);
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
        formattedDate = `${moment(date).format('ddd')} ${formattedDate}`;
      }
      return formattedDate;
    }
  }

  displayFn(value): string {
    return value && value.name ? value.name : '';
  }

  selectSeller(event: MatAutocompleteSelectedEvent) {
    this.formValues.seller = event.option.value;
    this.getCounterpartyById(this.formValues.seller.id);
    this.changeDetectorRef.detectChanges();
  }

  selectorSellerSelectionChange(selection: IOrderLookupDto): void {
    if (selection === null || selection === undefined) {
      this.formValues.seller = '';
    } else {
      const obj = {
        id: selection.id,
        name: this.decodeSpecificField(selection.name)
      };
      this.formValues.seller = obj;
      this.getCounterpartyById(this.formValues.seller.id);
      this.changeDetectorRef.detectChanges();
    }
  }

  getCounterpartyById(counterpartyId: number) {
    this.spinner.show();
    this.contractService
      .getCounterparty(this.formValues.seller.id)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          if (response.defaultPaymentTerm != null) {
            this.formValues.paymentTerm = response.defaultPaymentTerm;
          }
          console.log(this.formValues.paymentTerm);
        }
      });
  }

  selectCompany(event: MatAutocompleteSelectedEvent) {
    this.formValues.company = event.option.value;
    console.log(this.entityId);
    console.log(this.formValues.company);
    this.addAllowedCompanies();
  }

  selectorCompanySelectionChange(selection: IOrderLookupDto): void {
    if (selection === null || selection === undefined) {
      this.formValues.company = '';
    } else {
      const obj = {
        id: selection.id,
        name: selection.name
      };
      this.formValues.company = obj;
      this.addAllowedCompanies();
      this.changeDetectorRef.detectChanges();
    }
  }

  addAllowedCompanies() {
    if (!this.entityId) {
      this.formValues.allowedCompanies = [];
      this.companyList = _.cloneDeep(this.initialCompanyList);
      this.companyList.forEach((v, k) => {
        if (v.id != this.formValues.company.id) {
          this.formValues.allowedCompanies.push(v);
          this.companyList[k].isSelected = true;
        }
      });
    }
    console.log(this.formValues.allowedCompanies);
  }

  getHeaderNameSelector(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.sellers:
        return knowMastersAutocompleteHeaderName.sellers;
      default:
        return knowMastersAutocompleteHeaderName.sellers;
    }
  }

  getHeaderNameSelector1(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.company:
        return knowMastersAutocompleteHeaderName.company;
      default:
        return knowMastersAutocompleteHeaderName.company;
    }
  }

  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  public filterSellerList() {
    if (this.formValues.seller) {
      let filterValue = '';
      filterValue = this.formValues.seller.name
        ? this.formValues.seller.name.toLowerCase()
        : this.formValues.seller.toLowerCase();
      if (this.sellerList) {
        const list = this.sellerList
          .filter((item: any) => {
            return item.name
              .toLowerCase()
              .includes(filterValue.trim().toLowerCase());
          })
          .splice(0, 10);
        console.log(list);
        return list;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  public filterCompanyList() {
    if (this.formValues.company) {
      let filterValue = '';
      filterValue = this.formValues.company.name
        ? this.formValues.company.name.toLowerCase()
        : this.formValues.company.toLowerCase();
      if (this.companyList) {
        const list = this.companyList
          .filter((item: any) => {
            return item.name
              .toLowerCase()
              .includes(filterValue.trim().toLowerCase());
          })
          .splice(0, 10);
        console.log(list);
        return list;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  searchCompanyList(value: string): void {
    let filterCompany = this.companyList.filter(company =>
      company.name.toLowerCase().includes(value)
    );
    console.log(filterCompany);
    this.companyListForSearch = [...filterCompany];
  }

  resetCompanyData() {
    this.searchCompanyModel = null;
    this.selectedCompany = null;
    this.companyListForSearch = this.companyList;
    this.expandCompanyPopUp = false;
  }

  radioCompanyChange($event: MatRadioChange) {
    if ($event.value) {
      this.formValues.company = $event.value;
      this.addAllowedCompanies();
    }
  }

  saveAllowedCompanies() {
    let allowedCompanyList = [];
    let companyList = this.companyList;
    for (let i = 0; i < companyList.length; i++) {
      if (companyList[i].isSelected) {
        let allowedCompany = {
          id: companyList[i].id,
          name: companyList[i].name
        };
        allowedCompanyList.push(allowedCompany);
      }
    }
    this.formValues.allowedCompanies = _.cloneDeep(allowedCompanyList);
  }

  saveCustomer() {
    let customersList = [];
    let customerList = this.customerList;
    for (let i = 0; i < customerList.length; i++) {
      if (customerList[i].isSelected) {
        let customer = {
          id: customerList[i].id,
          name: customerList[i].name,
          internalName: customerList[i].internalName,
          displayName: customerList[i].displayName,
          code: customerList[i].code,
          collectionName: customerList[i].collectionName,
          customNonMandatoryAttribute1:
            customerList[i].customNonMandatoryAttribute1,
          isDeleted: customerList[i].isDeleted,
          modulePathUrl: customerList[i].modulePathUrl,
          clientIpAddress: customerList[i].clientIpAddress,
          userAction: customerList[i].userAction
        };
        customersList.push(customer);
      }
    }
    this.formValues.customers = _.cloneDeep(customersList);
  }

  changeAgreementType() {
    this.spinner.show();
    this.contractService
      .getAgreementTypeById(this.formValues.agreementType.id)
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
            this.formValues.incoterm = response.defaultIncoterm;
            //this.formValues.strategy = response.defaultStrategy;
          }
        }
      });
  }

  onChange($event, field) {
    if ($event.value) {
      let beValue = `${moment($event.value).format(
        'YYYY-MM-DDTHH:mm:ss'
      )}+00:00`;
      if (field == 'validFrom') {
        this.isValidFromDateInvalid = false;
      } else if (field == 'validTo') {
        this.isValidToDateInvalid = false;
      }
      console.log(beValue);
    } else {
      if (field == 'validFrom') {
        this.isValidFromDateInvalid = true;
      } else if (field == 'validTo') {
        this.isValidToDateInvalid = false;
      }
      this.toastr.error('Please enter the correct format');
    }
  }

  formatDateForBe(value) {
    if (value) {
      let beValue = `${moment.utc(value).format('YYYY-MM-DDTHH:mm:ss')}+00:00`;
      return `${moment.utc(value).format('YYYY-MM-DDTHH:mm:ss')}+00:00`;
    } else {
      return null;
    }
  }

  quantityFormatValue(value) {
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    let number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if (this.tenantService.quantityPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.quantityPrecision);
      }
    }
  }

  noOfDaysBeforeExpiryFormatValue(value) {
    return value.toFixed(0);
  }

  openSeller() {
    document.getElementsByTagName('body')[0].click();
  }

  decodeSpecificField(modelValue) {
    let decode = function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
    };
    return decode(_.unescape(modelValue));
  }

  ngAfterViewInit(): void {}
}
