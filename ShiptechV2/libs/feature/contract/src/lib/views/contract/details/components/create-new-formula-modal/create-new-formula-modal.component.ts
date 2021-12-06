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
  Renderer2,
  Optional,
  Injectable,
  InjectionToken
} from '@angular/core';

import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import _, { find } from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DecimalPipe, KeyValue } from '@angular/common';
import { ContractService } from 'libs/feature/contract/src/lib/services/contract.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { DeliveryAutocompleteComponent } from '../delivery-autocomplete/delivery-autocomplete.component';
import {
  knowMastersAutocompleteHeaderName,
  knownMastersAutocomplete
} from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { IOrderLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Moment, MomentFormatSpecification, MomentInput } from 'moment';
import moment from 'moment';
import {
  NgxMatDateAdapter,
  NgxMatDateFormats,
  NGX_MAT_DATE_FORMATS
} from '@angular-material-components/datetime-picker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  NativeDateAdapter
} from '@angular/material/core';

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
    const elem = moment.utc(value, currentFormat);
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
  selector: 'shiptech-create-new-formula-modal',
  templateUrl: './create-new-formula-modal.component.html',
  styleUrls: ['./create-new-formula-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
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
export class CreateNewFormulaModalComponent
  extends DeliveryAutocompleteComponent
  implements OnInit {
  deliveryProducts: any;
  switchTheme;
  selectedProduct;
  formValues: any = {
    name: '',
    simpleFormula: {}
  };
  splitDeliveryInLimit: any[];
  uoms: any;
  disabledSplitBtn;
  quantityFormat: string;
  modalSpecGroupParameters: any;
  modalSpecGroupParametersEditable: any;
  specParameterList: any;
  activeProductForSpecGroupEdit: any;
  selectedFormulaTab = 'Pricing formula';
  formulaTypeList: any;
  entityName: string;
  autocompleteSellers: knownMastersAutocomplete;
  private _autocompleteType: any;
  autocompleteSystemInstrument: knownMastersAutocomplete;
  systemInstumentList: any;
  marketPriceList: any;
  formulaPlusMinusList: any;
  formulaFlatPercentageList: any;
  uomList: any;
  autocompleteCurrency: knownMastersAutocomplete;
  currencyList: any;
  formulaOperationList: any;
  formulaFunctionList: any;
  marketPriceTypeList: any;
  systemInstumentList1: any;
  initialized = 1;
  pricingScheduleList: any;
  isValidFromDateInvalid: boolean;
  isValidToDateInvalid: boolean;
  holidayRuleList: any;
  isValidSpecDateInvalid: boolean;
  pricingSchedulePeriodList: any;
  eventList: any;
  dayOfWeekList: any;
  businessCalendarList: any;
  formulaEventIncludeList: any;
  rules: any = 1;
  quantityTypeList: any;
  productList: any;
  locationList: any;
  hasInvoicedOrder: any;
  constructor(
    public dialogRef: MatDialogRef<CreateNewFormulaModalComponent>,
    private ren: Renderer2,
    changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private tenantService: TenantFormattingService,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    @Inject(DecimalPipe) private _decimalPipe,
    @Inject(MAT_DATE_FORMATS) private dateFormats,
    @Inject(NGX_MAT_DATE_FORMATS) private dateTimeFormats,
    private format: TenantFormattingService,

    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(changeDetectorRef);
    this.dateFormats.display.dateInput = this.format.dateFormat;
    this.dateFormats.parse.dateInput = this.format.dateFormat;
    this.dateTimeFormats.display.dateInput = this.format.dateFormat;
    CUSTOM_DATE_FORMATS.display.dateInput = this.format.dateFormat;
    PICK_FORMATS.display.dateInput = this.format.dateFormat;
    console.log(data);
    this.formValues = data.formValues;
    if (!this.formValues) {
      this.formValues = {
        formulaType: {},
        isEditable: true,
        formulaHolidayRules: null
      };
    }
    if (this.formValues && !this.formValues.formulaHolidayRules) {
      this.formValues.formulaHolidayRules = null;
    }
    this.formulaTypeList = data.formulaTypeList;
    this.systemInstumentList = data.systemInstumentList;
    this.marketPriceList = data.marketPriceList;
    this.formulaPlusMinusList = data.formulaPlusMinusList;
    this.formulaFlatPercentageList = data.formulaFlatPercentageList;
    this.uomList = data.uomList;
    this.currencyList = data.currencyList;
    this.formulaOperationList = data.formulaOperationList;
    this.formulaFunctionList = data.formulaFunctionList;
    this.marketPriceTypeList = data.marketPriceTypeList;
    this.pricingScheduleList = data.pricingScheduleList;
    this.holidayRuleList = data.holidayRuleList;
    this.pricingSchedulePeriodList = data.pricingSchedulePeriodList;
    this.eventList = data.eventList;
    this.dayOfWeekList = data.dayOfWeekList;
    this.businessCalendarList = data.businessCalendarList;
    this.formulaEventIncludeList = data.formulaEventIncludeList;
    this.quantityTypeList = data.quantityTypeList;
    this.productList = data.productList;
    this.locationList = data.locationList;
    this.hasInvoicedOrder = data.hasInvoicedOrder;
  }

  ngOnInit() {
    this.entityName = 'Contract';
    this.setDefaultValues();
  }

  closeClick(): void {
    this.dialogRef.close();
  }

  setDefaultValues = () => {
    console.log(this.formValues);
  };

  originalOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => {
    return 0;
  };

  displayFn(value): string {
    return value && value.name ? value.name : '';
  }

  ngAfterViewInit(): void {}

  clearSchedules(id) {
    this.formValues.pricingScheduleOptionDateRange = null;
    this.formValues.pricingScheduleOptionSpecificDate = null;
    this.formValues.pricingScheduleOptionEventBasedSimple = null;
    this.formValues.pricingScheduleOptionEventBasedExtended = null;
    this.formValues.pricingScheduleOptionEventBasedContinuous = null;
    /* 
    4 = Date Range
    5 = Specific Dates 
    6 = Event Based simple
    7 = Event Based extended
    8 = Event Based Continuous
    */
    if (id == 4) {
      this.formValues.pricingScheduleOptionDateRange = {};
      this.formValues.pricingScheduleOptionDateRange.sundayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionDateRange.mondayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionDateRange.tuesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionDateRange.wednesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionDateRange.thursdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionDateRange.fridayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionDateRange.saturdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
    } else if (id == 5) {
      this.formValues.pricingScheduleOptionSpecificDate = {};
      this.formValues.pricingScheduleOptionSpecificDate.sundayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionSpecificDate.mondayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionSpecificDate.tuesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionSpecificDate.wednesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionSpecificDate.thursdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionSpecificDate.fridayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionSpecificDate.saturdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
    } else if (id == 6) {
      this.formValues.pricingScheduleOptionEventBasedSimple = {
        fromNoOfBusinessDaysBefore: 0,
        toNoOfBusinessDaysAfter: 0,
        fromBusinessCalendarId: { id: 1 },
        toBusinessCalendar: { id: 1 }
      };
      this.formValues.pricingScheduleOptionEventBasedSimple.sundayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedSimple.mondayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedSimple.tuesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedSimple.wednesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedSimple.thursdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedSimple.fridayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedSimple.saturdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
    } else if (id == 7) {
      this.formValues.pricingScheduleOptionEventBasedExtended = {
        fromNoOfBusinessDaysBefore: 0,
        toNoOfBusinessDaysAfter: 0,
        fromBusinessCalendar: { id: 1 },
        toBusinessCalendar: { id: 1 }
      };
      this.formValues.pricingScheduleOptionEventBasedExtended.sundayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedExtended.mondayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedExtended.tuesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedExtended.wednesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedExtended.thursdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedExtended.fridayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedExtended.saturdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
    } else if (id == 8) {
      this.formValues.pricingScheduleOptionEventBasedContinuous = {};
      this.formValues.pricingScheduleOptionEventBasedContinuous.sundayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedContinuous.mondayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedContinuous.tuesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedContinuous.wednesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedContinuous.thursdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedContinuous.fridayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
      this.formValues.pricingScheduleOptionEventBasedContinuous.saturdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[2]
      );
    }

    if (!this.formValues.formulaHolidayRules) {
      this.formValues.formulaHolidayRules = {};
      this.formValues.formulaHolidayRules.sundayHolidayRule = _.cloneDeep(
        this.holidayRuleList[1]
      );
      this.formValues.formulaHolidayRules.mondayHolidayRule = _.cloneDeep(
        this.holidayRuleList[1]
      );
      this.formValues.formulaHolidayRules.tuesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[1]
      );
      this.formValues.formulaHolidayRules.wednesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[1]
      );
      this.formValues.formulaHolidayRules.thursdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[1]
      );
      this.formValues.formulaHolidayRules.fridayHolidayRule = _.cloneDeep(
        this.holidayRuleList[1]
      );
      this.formValues.formulaHolidayRules.saturdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[1]
      );
    }

    console.log(this.formValues.formulaHolidayRules);
  }

  saveFormula() {
    if (this.formValues.id) {
      this.spinner.show();
      this.contractService
        .updateFormula(this.formValues)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          })
        )
        .subscribe((response: any) => {
          if (typeof response == 'string') {
            this.toastr.error(response);
          } else {
            this.dialogRef.close({
              name: this.formValues.name,
              id: this.formValues.id
            });
            this.toastr.success('Operation completed successfully!');
          }
        });
    } else {
      this.spinner.show();
      this.contractService
        .saveFormula(this.formValues)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          })
        )
        .subscribe((response: any) => {
          if (typeof response == 'string') {
            this.toastr.error(response);
          } else {
            this.dialogRef.close({
              name: this.formValues.name,
              id: response
            });
            this.toastr.success('Operation completed successfully!');
          }
        });
    }
  }

  isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0;
  }

  setFormulaTypeSelected(id) {
    if (id == 2) {
      let isEmptyObject = this.isEmptyObject(this.formValues.simpleFormula);
      if (this.isEmptyObject(this.formValues.simpleFormula)) {
        this.formValues.simpleFormula = null;
      }
      if (!this.formValues.complexFormulaQuoteLines) {
        this.formValues.complexFormulaQuoteLines = [];
      }
    } else {
      if (!this.formValues.simpleFormula) {
        this.formValues.simpleFormula = {};
      }
    }
  }

  setPricingType() {
    if (!this.formValues.pricingSchedule) {
      this.formValues.pricingSchedule = {};
    }
  }

  setHolidayRules() {
    if (!this.formValues.formulaHolidayRules) {
      this.formValues.formulaHolidayRules = {};
      this.formValues.formulaHolidayRules.sundayHolidayRule = _.cloneDeep(
        this.holidayRuleList[0]
      );
      this.formValues.formulaHolidayRules.mondayHolidayRule = _.cloneDeep(
        this.holidayRuleList[0]
      );
      this.formValues.formulaHolidayRules.tuesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[0]
      );
      this.formValues.formulaHolidayRules.wednesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[0]
      );
      this.formValues.formulaHolidayRules.thursdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[0]
      );
      this.formValues.formulaHolidayRules.fridayHolidayRule = _.cloneDeep(
        this.holidayRuleList[0]
      );
      this.formValues.formulaHolidayRules.saturdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[0]
      );
    }
  }

  cancelFormula() {
    this.dialogRef.close();
  }
}
