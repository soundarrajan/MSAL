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
  InjectionToken
} from '@angular/core';
import { Select } from '@ngxs/store';
import { QcReportService } from '../../../../../services/qc-report.service';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
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
  MAT_DATE_LOCALE,
  NativeDateAdapter
} from '@angular/material/core';
import moment, { Moment, MomentFormatSpecification, MomentInput } from 'moment';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { IDeliveryTenantSettings } from 'libs/feature/delivery/src/lib/core/settings/delivery-tenant-settings';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';
import {
  NgxMatDateAdapter,
  NgxMatDateFormats,
  NGX_MAT_DATE_FORMATS
} from '@angular-material-components/datetime-picker';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Optional } from '@ag-grid-enterprise/all-modules';

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
  selector: 'shiptech-bdn-additional-information',
  templateUrl: './bdn-additional-information.component.html',
  styleUrls: ['./bdn-additional-information.component.scss'],
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
export class BdnAdditionalInformationComponent
  extends DeliveryAutocompleteComponent
  implements OnInit {
  @Input() data;
  switchTheme;
  deliverySettings: any;
  adminConfiguration: any;
  deliveryFeedbackList$: any[];
  deliveryFeedback: any;
  satisfactionLevel: any;
  isBargePumpingRateStartTimeInvalid: boolean;
  isBargePumpingRateEndTimeInvalid: boolean;
  pumpingRateUom: any;
  simpleSource: any;

  @Input('sampleSource') set _setSimpleSource(simpleSource) {
    if (!simpleSource) {
      return;
    }
    this.simpleSource = simpleSource;
  }

  @Input('satisfactionLevel') set _setSatisfactionLevel(satisfactionLevel) {
    if (!satisfactionLevel) {
      return;
    }
    this.satisfactionLevel = satisfactionLevel;
  }

  @Input('deliveryFeedback') set _setDeliveryFeedback(deliveryFeedback) {
    if (!deliveryFeedback) {
      return;
    }
    this.deliveryFeedback = deliveryFeedback;
  }

  @Input('pumpingRateUom') set _setPumpingRateUom(pumpingRateUom) {
    if (!pumpingRateUom) {
      return;
    }
    this.pumpingRateUom = pumpingRateUom;
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
    this.changeDetectorRef.detectChanges();
  }

  @Input('toleranceLimits') set _setToleranceLimits(toleranceLimits) {
    if (!toleranceLimits) {
      return;
    }
    this.toleranceLimits = toleranceLimits;
    this.changeDetectorRef.detectChanges();
  }

  states: string[] = ['Alabama', 'Alaska', 'Arizona', 'Arkansas'];
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;

  deliveryFormSubject: Subject<any> = new Subject<any>();
  toleranceLimits: any;
  formValues: any;
  openedScreenLoaders: number = 0;
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
    private spinner: NgxSpinnerService,
    private tenantSettingsService: TenantSettingsService,
    @Inject(NGX_MAT_DATE_FORMATS) private dateTimeFormats,
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
    this.dateFormats.display.dateInput = this.format.dateFormat;
    this.dateFormats.parse.dateInput = this.format.dateFormat;
    this.dateTimeFormats.display.dateInput = this.format.dateFormat;
    CUSTOM_DATE_FORMATS.display.dateInput = this.format.dateFormat;
    PICK_FORMATS.display.dateInput = this.format.dateFormat;
  }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe(data =>
      this.setDeliveryForm(data)
    );
    this.getDeliveryFeedbackList();
    //this.getTimeBetweenDates(this.formValues.bargePumpingRateStartTime, this.formValues.bargePumpingRateEndTime);
  }

  setDeliveryForm(form) {
    if (!form) {
      return;
    }
    this.formValues = form;
    this.deliveryFormSubject.next(form);
    this.changeDetectorRef.detectChanges();
  }

  async getDeliveryFeedbackList() {
    this.deliveryFeedbackList$ = await this.legacyLookupsDatabase.getDeliveryFeedbackList();
  }

  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  onChange($event, field) {
    if ($event.value) {
      let beValue = `${moment($event.value).format('YYYY-MM-DDTHH:mm')}+00:00`;
      if (field == 'bargePumpingRateStartTime') {
        this.isBargePumpingRateStartTimeInvalid = false;
      } else if (field == 'bargePumpingRateEndTime') {
        this.isBargePumpingRateEndTimeInvalid = false;
      }
    } else {
      if (field == 'bargePumpingRateStartTime') {
        this.isBargePumpingRateStartTimeInvalid = true;
      } else if (field == 'bargePumpingRateEndTime') {
        this.isBargePumpingRateEndTimeInvalid = true;
      }
      this.toastr.error('Please enter the correct format');
    }

    let bargePumpingRateEndTime = this.formatDateForBeForDateWithTime(
      this.formValues.bargePumpingRateEndTime
    );
    let bargePumpingRateStartTime = this.formatDateForBeForDateWithTime(
      this.formValues.bargePumpingRateStartTime
    );

    if (
      moment
        .utc(bargePumpingRateEndTime)
        .isBefore(moment.utc(bargePumpingRateStartTime))
    ) {
      let errorMessage = 'Pumping Start must be lower or equal to Pumping End.';
      this.isBargePumpingRateStartTimeInvalid = true;
      this.isBargePumpingRateEndTimeInvalid = true;
      this.toastr.error(errorMessage);
    } else {
      this.isBargePumpingRateStartTimeInvalid = false;
      this.isBargePumpingRateEndTimeInvalid = false;
    }
  }

  formatDateForBe(value) {
    if (typeof value == 'string') {
      return value;
    }
    if (value) {
      let beValue = `${moment.utc(value).format('YYYY-MM-DDTHH:mm')}+00:00`;
      return `${moment.utc(value).format('YYYY-MM-DDTHH:mm')}+00:00`;
    } else {
      return null;
    }
  }

  getTimeBetweenDates(start, end) {
    if (!start) {
      return;
    }
    if (!end) {
      return;
    }
    let startDate, endDate, timeBetween, minutes, mins, hours;
    startDate = new Date(start);
    endDate = new Date(end);
    timeBetween = Math.abs(endDate.getTime() - startDate.getTime());
    if (endDate < startDate) {
      timeBetween = Math.abs(startDate.getTime() - endDate.getTime());
    }
    minutes = (0.001 * timeBetween) / 60;
    mins = minutes % 60;
    hours = (minutes - mins) / 60;
    hours = hours < 10 ? `0${hours}` : hours;
    mins = mins < 10 ? `0${mins}` : mins;
    var result = `${hours}:${mins}`;
    if (result.indexOf('NaN') != -1) {
      result = null;
    }
    if (endDate < startDate) {
      this.formValues.pumpingDuration = `-${result}`;
      return;
    }
    this.formValues.pumpingDuration = result;
    this.calculatePumpingRate(this.formValues.pumpingDuration, 0);
  }

  getTimeBetweenBerthinAndBargeDates(start, end) {
    if (!start) {
      return;
    }
    if (!end) {
      return;
    }
    let startDate, endDate, timeBetween, minutes, mins, hours;
    startDate = new Date(start);
    endDate = new Date(end);
    timeBetween = Math.abs(endDate.getTime() - startDate.getTime());
    if (endDate < startDate) {
      timeBetween = Math.abs(startDate.getTime() - endDate.getTime());
    }
    minutes = (0.001 * timeBetween) / 60;
    mins = minutes % 60;
    hours = (minutes - mins) / 60;
    hours = hours < 10 ? `0${hours}` : hours;
    mins = mins < 10 ? `0${mins}` : mins;
    var result = `${hours}:${mins}`;
    if (result.indexOf('NaN') != -1) {
      result = null;
    }
    if (endDate < startDate) {
      this.formValues.bargeDelay = `-${result}`;
      return;
    }
    this.formValues.bargeDelay = result;
  }

  calculatePumpingRate(timeString, prodIndex) {
    if (
      typeof timeString == 'undefined' ||
      typeof this.formValues.deliveryProducts == 'undefined' ||
      !this.formValues.deliveryProducts.length
    ) {
      return;
    }
    if (
      typeof this.formValues.deliveryProducts[prodIndex].bdnQuantityUom ==
        'undefined' ||
      this.formValues.deliveryProducts[prodIndex].bdnQuantityUom == null ||
      this.formValues.deliveryProducts[prodIndex].bdnQuantityAmount == null
    ) {
      return;
    }
    if (typeof this.formValues.pumpingRate == 'undefined') {
      this.formValues.pumpingRate = '';
      this.formValues.pumpingRateUom = '';
    }
    var pumpingTime =
      (parseInt(timeString.split(':')[0]) * 60 +
        parseInt(timeString.split(':')[1])) /
      60;
    this.formValues.pumpingRate =
      this.formValues.deliveryProducts[prodIndex].bdnQuantityAmount /
      pumpingTime;
    this.pumpingRateUom.forEach((val, key) => {
      if (
        val.name.split('/')[0] ==
        this.formValues.deliveryProducts[prodIndex].bdnQuantityUom.name
      ) {
        this.formValues.pumpingRateUom = val;
      }
    });
  }

  addSampleSources() {
    if (this.formValues.deliveryStatus.name == 'Verified') {
      return;
    }
    if (!this.formValues.sampleSources) {
      this.formValues.sampleSources = [];
    }
    let firstSampleSourceOption = this.simpleSource[0];
    this.formValues.sampleSources.push({
      id: 0,
      sampleSource: firstSampleSourceOption
    });
  }

  removeSampleSources(key) {
    if (this.formValues.deliveryStatus.name == 'Verified') {
      return;
    }
    if (this.formValues.sampleSources[key].id) {
      this.formValues.sampleSources[key].isDeleted = true;
    } else {
      this.formValues.sampleSources.splice(key, 1);
    }
  }

  // Only AlphaNumeric
  keyPressAlphaNumeric(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  formatDateForBeForDateWithTime(value) {
    if (typeof value == 'string') {
      return value;
    }
    if (value) {
      const beValue = `${moment(value).format('YYYY-MM-DDTHH:mm:ss')}+00:00`;
      return `${moment(value).format('YYYY-MM-DDTHH:mm:ss')}+00:00`;
    } else {
      return null;
    }
  }

  ngAfterViewInit(): void {
    this.addSampleSources();
  }
}
