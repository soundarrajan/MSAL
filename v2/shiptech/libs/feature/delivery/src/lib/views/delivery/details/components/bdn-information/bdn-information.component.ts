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
import { QcReportService } from '../../../../../services/qc-report.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { QcReportState } from '../../../../../store/report/qc-report.state';
import { ToastrService } from 'ngx-toastr';
import { finalize, map, scan, startWith, timeout } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
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
      formattedDate = `${moment(value).format('ddd')} ${formattedDate}`;
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

export const MAT_MOMENT_DATE_ADAPTER_OPTIONS = new InjectionToken<
  NgxMatMomentDateAdapterOptions
>('MAT_MOMENT_DATE_ADAPTER_OPTIONS', {
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
    @Inject(MAT_MOMENT_DATE_ADAPTER_OPTIONS)
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
      let elem = moment(value, 'YYYY-MM-DDTHH:mm:ss');
      let newVal = moment(elem).format(currentFormat);
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
  selector: 'shiptech-bdn-information',
  templateUrl: './bdn-information.component.html',
  styleUrls: ['./bdn-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    OrderListGridViewModel,
    DialogService,
    ConfirmationService,
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    {
      provide: NgxMatDateAdapter,
      useClass: CustomNgxDatetimeAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ]
})
export class BdnInformationComponent extends DeliveryAutocompleteComponent
  implements OnInit {
  switchTheme; //false-Light Theme, true- Dark Theme
  bargeOptions: any;
  orderDetails: any;
  deliverySettings: any;
  bargeList$: any;
  formValues: any;
  isLoading: boolean;
  eventsSubscription: any;
  eventsSaveButtonSubscription: any;
  adminConfiguration: IGeneralTenantSettings;
  openedScreenLoaders: number = 0;
  bargeList: any;
  bargeListLength: any;
  isDeliveryInvalid: boolean;
  isDeliveryDateInvalid: boolean;
  isBdnDateInvalid: boolean;
  isBerthingTimeDateInvalid: boolean;
  isBargeAlongsideDateInvalid: boolean;
  statusColorCode: any;
  buttonClicked: any;
  baseOrigin: string;
  bargeId: any;
  backgroundColor: string;

  @Input() set autocompleteType(value: string) {
    this._autocompleteType = value;
  }

  @Input('statusColorCode') set _setsStatusColorCode(statusColorCode) {
    if (!statusColorCode) {
      return;
    }
    this.statusColorCode = statusColorCode;
    this.backgroundColor = this.getContrastYIQ(this.statusColorCode);
  }
  @Input('bargeList') set _setBargeList(bargeList) {
    if (!bargeList) {
      return;
    }
    this.bargeList = bargeList;
  }
  @Input('model') set _setFormValues(formValues) {
    if (!formValues) {
      return;
    }
    this.formValues = formValues;
    if (this.formValues.barge) {
      this.bargeId = this.formValues.barge.id;
    }
  }

  @Input('relatedDeliveries') set _relatedDeliveries(relatedDeliveries) {
    if (!relatedDeliveries) {
      return;
    }
    this.relatedDeliveries = relatedDeliveries;
  }

  @Input('orderNumberOptions') set _setOptions(orderNumberOptions) {
    if (!orderNumberOptions) {
      return;
    }
    this.options = orderNumberOptions;
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
  @Output() changeInputBdn = new EventEmitter<any>();
  @Output() onDatePicked = new EventEmitter<any>();

  @Output() onOrderNumberChanged = new EventEmitter<any>();

  @Select(UserProfileState.displayName) displayName$: Observable<string>;
  @Select(UserProfileState.username) username$: Observable<string>;
  private _autocompleteType: string;
  private _TRANSACTION_TYPE_ID: number = 46;
  protected _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;
  firstTenOptions: any;
  filteredOptions: Observable<any>;

  myControl = new FormControl();
  selectedOrderNumber: IOrderLookupDto;
  isReadOnly: boolean;

  autocompleteVessel: string;

  private _entityId: any;
  private _entityName: string;
  options: TransactionForSearch[];
  relatedDeliveries: DeliveryInfoForOrder[];
  options1 = new BehaviorSubject<any[]>([]);
  options$: Observable<any[]>;
  myDatePicker: any;
  @Input() events: Observable<void>;
  eventsSubject: Subject<void> = new Subject<void>();
  total = 100;
  data = Array.from({ length: this.total }).map((_, i) => `Option ${i}`);
  limit = 10;
  offset = 0;
  @Input() eventsSaveButton: Observable<void>;

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
    @Inject(NGX_MAT_DATE_FORMATS) private dateTimeFormats,
    private format: TenantFormattingService,
    private tenantSettingsService: TenantSettingsService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    super(changeDetectorRef);
    this.deliverySettings = tenantSettingsService.getModuleTenantSettings<
      IDeliveryTenantSettings
    >(TenantSettingsModuleName.Delivery);
    this.adminConfiguration = tenantSettingsService.getModuleTenantSettings<
      IGeneralTenantSettings
    >(TenantSettingsModuleName.General);
    this.autocompleteVessel = knownMastersAutocomplete.orders;
    this.dateFormats.display.dateInput = this.format.dateFormat;
    this.dateFormats.parse.dateInput = this.format.dateFormat;
    this.dateTimeFormats.display.dateInput = this.format.dateFormat;
    CUSTOM_DATE_FORMATS.display.dateInput = this.format.dateFormat;
    PICK_FORMATS.display.dateInput = this.format.dateFormat;
    this.baseOrigin = new URL(window.location.href).origin;
    //this.dateTimeFormats.parse.dateInput = this.format.dateFormat;
  }

  ngOnInit() {
    this.setOrderNumberOptions();
    this.getBargeList();
    this.entityName = 'Delivery';
    this.eventsSubscription = this.events.subscribe(data =>
      this.setDeliveryForm(data)
    );
    this.eventsSaveButtonSubscription = this.eventsSaveButton.subscribe(data =>
      this.setRequiredFields(data)
    );
    this.eventsSubject.next();
  }

  getContrastYIQ(hexcolor) {
    if (!hexcolor) {
      return 'black';
    }
    hexcolor = hexcolor.replace('#', '');
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  }

  setRequiredFields(data) {
    this.buttonClicked = data;
  }

  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  setDeliveryForm(form) {
    if (!form) {
      return;
    }
    this.formValues = form;
    if (this.formValues.barge) {
      this.bargeId = this.formValues.barge.id;
    }
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {}

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
      let elem = moment(date, 'YYYY-MM-DDTHH:mm:ss');
      let formattedDate = moment(elem).format(currentFormat);
      if (hasDayOfWeek) {
        formattedDate = `${moment(date).format('ddd')} ${formattedDate}`;
      }
      return formattedDate;
    }
  }

  async getBargeList() {
    this.bargeList$ = await this.legacyLookupsDatabase.getBargeTable();
  }

  getHeaderNameSelector(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.orders:
        return knowMastersAutocompleteHeaderName.orders;
      default:
        return knowMastersAutocompleteHeaderName.orders;
    }
  }

  setOrderNumberOptions() {
    // this.filteredOptions = this.deliveryForm.controls['order'].valueChanges
    //   .pipe(
    //       startWith(''),
    //       map(value => typeof value === 'string' ? value : value.name),
    //       map(name => name ? this._filter(name) : this.options.slice(0, 10))
    // );
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  orderNumberSelection(event: IOrderLookupDto): void {}

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  displayFn(orderNumber): string {
    return orderNumber && orderNumber.name ? orderNumber.name : '';
  }

  public filterOrderNumberList() {
    if (this.formValues.order) {
      const filterValue = this.formValues.order.name
        ? this.formValues.order.name
        : this.formValues.order;
      if (this.options) {
        const list = this.options
          .filter((item: any) => {
            return item.name
              .toLowerCase()
              .includes(filterValue.trim().toLowerCase());
          })
          .splice(0, 10);
        return list;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  public filterBargeList() {
    let filterValue = '';
    if (this.formValues.barge) {
      filterValue = this.formValues.barge.name
        ? this.formValues.barge.name.toLowerCase()
        : this.formValues.barge.toLowerCase();
    }
    if (this.bargeList$) {
      const list = this.bargeList$
        .filter((item: any) => {
          return item.name.toLowerCase().includes(filterValue.toLowerCase());
        })
        .splice(0, 10);
      return list;
    } else {
      return [];
    }
  }

  selectorOrderNumberSelectionChange(selection: IOrderLookupDto): void {
    if (selection === null || selection === undefined) {
      this.formValues.order = '';
    } else {
      this.formValues.order = selection.order;
      this.changeDetectorRef.detectChanges();
      const orderId = this.formValues.order ? this.formValues.order.id : null;
      if (typeof this.formValues.order != 'undefined') {
        if (!this.formValues.order.id) {
          return;
        }
      }
      this.formValues.SellerName = '';
      this.formValues.Port = '';
      this.formValues.OrderBuyer = '';
      this.getRelatedDeliveries(orderId);
      this.getDeliveryOrderSummary(orderId);
      this.onOrderNumberChanged.emit(true);
    }
  }

  selectOrderNumber(event: MatAutocompleteSelectedEvent) {
    const orderId = event.option.value ? event.option.value.id : null;
    if (typeof this.formValues.order != 'undefined') {
      if (!this.formValues.order.id) {
        return;
      }
    }
    this.formValues.SellerName = '';
    this.formValues.Port = '';
    this.formValues.OrderBuyer = '';
    if (typeof this.formValues.order != 'undefined') {
      this.spinner.show();
      this.getRelatedDeliveries(orderId);
      this.getDeliveryOrderSummary(orderId);
    }

    this.onOrderNumberChanged.emit(true);
  }

  getRelatedDeliveries(orderId: number) {
    this.relatedDeliveries = [];
    this.openedScreenLoaders += 1;
    let duplicate = false;
    this.deliveryService
      .loadDeliveryInfoForOrder(orderId)
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
          this.toastr.error('An error has occurred!');
        } else {
          response.forEach((val, key) => {
            this.relatedDeliveries.forEach((val2, key2) => {
              if (val2.deliveryId == val.deliveryId) {
                duplicate = true;
              }
            });
            if (!duplicate) {
              this.relatedDeliveries.push(val);
            }
          });
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  getDeliveryOrderSummary(orderId: number) {
    this.openedScreenLoaders += 1;
    this.deliveryService
      .loadDeliveryOrderSummary(orderId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.openedScreenLoaders -= 1;
          if (!this.openedScreenLoaders) {
            this.spinner.hide();
          }
        })
      )
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error('An error has occurred!');
        } else {
          if (typeof this.formValues.temp == 'undefined') {
            this.formValues.temp = {};
          }
          this.formValues.info.vesselName = response.vesselName;
          this.formValues.info.locationName = response.location;
          this.formValues.info.eta = response.eta;
          this.formValues.info.etb = response.etb;
          this.formValues.temp.deliverysummary = response;
          this.formValues.temp.deliverySummaryProducts = [...response.products];
          if (!parseInt(this._entityId)) {
            // new delivery
            // also set pricing date for delivery to delivery date if null
            this.formValues.deliveryProducts.forEach((deliveryProd, _) => {
              this.formValues.temp.deliverysummary.products.forEach(
                (summaryProd, _) => {
                  if (summaryProd.id == deliveryProd.orderProductId) {
                    if (summaryProd.pricingDate != null) {
                      deliveryProd.pricingDate = summaryProd.pricingDate;
                    } else {
                      deliveryProd.pricingDate = this.formValues.temp.deliverysummary.deliveryDate;
                    }
                    if (summaryProd.convFactorOptions) {
                      deliveryProd.convFactorOptions =
                        summaryProd.convFactorOptions;
                    }
                    if (summaryProd.convFactorMassUom != null) {
                      deliveryProd.convFactorMassUom =
                        summaryProd.convFactorMassUom;
                    }
                    if (summaryProd.convFactorValue != null) {
                      deliveryProd.convFactorValue =
                        summaryProd.convFactorValue;
                    }
                    if (summaryProd.convFactorVolumeUom != null) {
                      deliveryProd.convFactorVolumeUom =
                        summaryProd.convFactorVolumeUom;
                    }
                  }
                }
              );
            });
            if (this.deliverySettings.deliveryDateFlow.internalName == 'Yes') {
              this.formValues.deliveryDate = this.formValues.temp.deliverysummary.deliveryDate;
            }
          }
          this.orderProductsByProductType('summaryProducts');
          if (this.formValues.deliveryProducts) {
            this.setProductsPhysicalSupplier();
            this.setQtyUoms();
          }
          //this.changeInputBdn.emit(this.formValues);
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  setProductsPhysicalSupplier() {
    this.formValues.deliveryProducts.forEach((deliveryProd, _) => {
      this.formValues.temp.deliverysummary.products.forEach(
        (summaryProd, key) => {
          if (deliveryProd.orderProductId == summaryProd.id) {
            if (!deliveryProd.physicalSupplier && !this.formValues.id) {
              deliveryProd.physicalSupplier = Object.assign(
                {},
                summaryProd.physicalSupplier
              );
            }
          }
        }
      );
    });
  }

  setQtyUoms() {
    this.formValues.deliveryProducts.forEach((deliveryProd, _) => {
      this.formValues.temp.deliverysummary.products.forEach(
        (summaryProd, key) => {
          if (summaryProd.id == deliveryProd.orderProductId) {
            if (!deliveryProd.surveyorQuantityUom) {
              deliveryProd.surveyorQuantityUom =
                summaryProd.orderedQuantity.uom;
            }
            if (!deliveryProd.vesselQuantityUom) {
              deliveryProd.vesselQuantityUom = summaryProd.orderedQuantity.uom;
            }
            if (!deliveryProd.agreedQuantityUom) {
              deliveryProd.agreedQuantityUom = summaryProd.orderedQuantity.uom;
            }
            if (!deliveryProd.bdnQuantityUom) {
              deliveryProd.bdnQuantityUom = summaryProd.orderedQuantity.uom;
            }
            if (!deliveryProd.vesselFlowMeterQuantityUom) {
              deliveryProd.vesselFlowMeterQuantityUom =
                summaryProd.orderedQuantity.uom;
            }
            if (!deliveryProd.finalQuantityUom) {
              deliveryProd.finalQuantityUom = summaryProd.orderedQuantity.uom;
            }
          }
        }
      );
    });
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

  onChange($event, field) {
    if ($event.value) {
      let beValue = `${moment($event.value).format(
        'YYYY-MM-DDTHH:mm:ss'
      )}+00:00`;
      if (field == 'deliveryDate') {
        this.isDeliveryDateInvalid = false;
      } else if (field == 'bdnDate') {
        this.isBdnDateInvalid = false;
      } else if (field == 'berthingTime') {
        this.isBerthingTimeDateInvalid = false;
      } else if (field == 'bargeAlongside') {
        this.isBargeAlongsideDateInvalid = false;
      }
    } else {
      if (field == 'deliveryDate') {
        this.isDeliveryDateInvalid = true;
      } else if (field == 'bdnDate') {
        this.isBdnDateInvalid = true;
      } else if (field == 'berthingTime') {
        this.isBerthingTimeDateInvalid = true;
      } else if (field == 'bargeAlongside') {
        this.isBargeAlongsideDateInvalid = true;
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

  getRelatedDeliveryLink(deliveryId) {
    return `${this.baseOrigin}/v2/delivery/delivery/${deliveryId}/details`;
  }

  setBarge(value) {
    let findBarge = _.find(this.bargeList, function(object) {
      return object.id == value;
    });
    if (findBarge != -1) {
      this.formValues.barge = findBarge;
    }
  }
}
