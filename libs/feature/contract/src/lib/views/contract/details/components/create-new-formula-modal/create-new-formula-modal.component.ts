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
import { knowMastersAutocompleteHeaderName, knownMastersAutocomplete } from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { IOrderLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Moment, MomentFormatSpecification, MomentInput } from 'moment';
import moment from 'moment';
import { NgxMatDateAdapter, NgxMatDateFormats, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';


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
  selector: 'shiptech-create-new-formula-modal',
  templateUrl: './create-new-formula-modal.component.html',
  styleUrls: ['./create-new-formula-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [  {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS},
    {
      provide: NgxMatDateAdapter,
      useClass: CustomNgxDatetimeAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }]
})
export class CreateNewFormulaModalComponent extends DeliveryAutocompleteComponent implements OnInit {
  deliveryProducts: any;
  switchTheme;
  selectedProduct;
  formValues: any = {
    'name': '',
    'simpleFormula': {}
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
    
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) 
    {
      super(changeDetectorRef);
      this.dateFormats.display.dateInput = this.format.dateFormat;
      this.dateFormats.parse.dateInput = this.format.dateFormat;
      this.dateTimeFormats.display.dateInput = this.format.dateFormat;
      CUSTOM_DATE_FORMATS.display.dateInput = this.format.dateFormat;
      PICK_FORMATS.display.dateInput = this.format.dateFormat;
      console.log(data);
      this.formValues = data.formValues;
      this.formulaTypeList = data.formulaTypeList;
      this.systemInstumentList = data.systemInstumentList;
      this.marketPriceList =  data.marketPriceList;
      this.formulaPlusMinusList = data.formulaPlusMinusList;
      this.formulaFlatPercentageList = data.formulaFlatPercentageList;
      this.uomList = data.uomList;
      this.currencyList = data.currencyList;
      this.formulaOperationList = data.formulaOperationList;
      this.formulaFunctionList = data.formulaFunctionList;
      this.marketPriceTypeList = data.marketPriceTypeList;
      this.pricingScheduleList = data.pricingScheduleList;
      this.holidayRuleList = data.holidayRuleList;
    }

  ngOnInit() {
    this.entityName = 'Contract';
    this.autocompleteSystemInstrument = knownMastersAutocomplete.systemInstrument;
    this.autocompleteCurrency = knownMastersAutocomplete.currency;


  }

  getHeaderNameSelector(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.systemInstrument:
        return knowMastersAutocompleteHeaderName.systemInstrument;
      default:
        return knowMastersAutocompleteHeaderName.systemInstrument;
    }
  }

  getHeaderNameSelector1(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.currency:
        return knowMastersAutocompleteHeaderName.currency;
      default:
        return knowMastersAutocompleteHeaderName.currency;
    }
  }
  
  selectorSystemInstumentSelectionChange(
    selection: IOrderLookupDto
  ): void {
    if (selection === null || selection === undefined) {
      this.formValues.simpleFormula.systemInstrument = '';
    } else {
      const obj = {
        'id': selection.id,
        'name': selection.name
      };
      this.formValues.simpleFormula.systemInstrument = obj; 
      this.changeDetectorRef.detectChanges();   
    }
  }

  selectorCurrencySelectionChange(
    selection: IOrderLookupDto
  ): void {
    if (selection === null || selection === undefined) {
      this.formValues.currency = '';
    } else {
      const obj = {
        'id': selection.id,
        'name': selection.name
      };
      this.formValues.currency = obj; 
      this.changeDetectorRef.detectChanges();   
    }
  }



  filterSystemInstrumenttList() {
    if (this.formValues.simpleFormula.systemInstrument) {
      const filterValue = this.formValues.simpleFormula.systemInstrument.name ? this.formValues.simpleFormula.systemInstrument.name.toLowerCase() : this.formValues.simpleFormula.systemInstrument.toLowerCase();
      console.log(filterValue);
      if (this.systemInstumentList) {
        return this.systemInstumentList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0)
          .slice(0, 10);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  filterSystemInstrumentListFromComplexFormulaQuoteLine(value) {
    if (value) {
      const  filterValue = value.toLowerCase();
      if (this.systemInstumentList) {
        return this.systemInstumentList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0)
          .slice(0, 10);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }


  
  filterCurrencyList() {
    if (this.formValues.currency) {
      const filterValue = this.formValues.currency.name ? this.formValues.currency.name.toLowerCase() : this.formValues.currency.toLowerCase();
      console.log(filterValue);
      if (this.currencyList) {
        return this.currencyList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0)
          .slice(0, 10);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }


  closeClick(): void {
    this.dialogRef.close();
  }

  originalOrder = (a: KeyValue<number, any>, b: KeyValue<number, any>): number => {
    return 0;
  }

  displayFn(value): string {
    return value && value.name ? value.name : '';
  }

  ngAfterViewInit(): void {
  
  }

  selectSystemInstrument(event: MatAutocompleteSelectedEvent) {
    this.formValues.simpleFormula.systemInstrument = event.option.value;
  }

  selectCurrency(event: MatAutocompleteSelectedEvent) {
    this.formValues.currency = event.option.value;
  }


  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }


  selectSystemInstrumentFromComplexFormulaQuoteLine(value, line, key) {
    this.formValues.complexFormulaQuoteLines[line].systemInstruments[key].systemInstrument = value;
  }

 
  addComplexFormulaQuoteLine() {
    if (!this.formValues.complexFormulaQuoteLines) {
      this.formValues.complexFormulaQuoteLines = [];
    }
    var count = 0;
    this.formValues.complexFormulaQuoteLines.forEach((val, key) => {
      if(!val.isDeleted) {
          count++;
      }
    });
    if (count < 3) {
      this.formValues.complexFormulaQuoteLines.push({
          id: 0,
          formulaOperation: {
              id: this.formValues.isMean ? 3 : 1,
              name: this.formValues.isMean ? 'Mean' : 'Add',
              internalName: null,
              code: null
          },
          weight: '100',
          formulaFunction: {
              id: 1,
              name: 'Min',
              internalName: null,
              code: null
          },
          systemInstruments: [ 
            {
              id: 0
            }, 
            {
              id: 0
            }, 
            {
              id: 0
            }
        ]
      });
    } else {
      this.toastr.error('Max 3 Quotes allowed');
    }
  }


  removeComplexFormulaQuoteLine(key) {
    var count = this.formValues.complexFormulaQuoteLines.length;
    if (count > 1) {
      if (this.formValues.complexFormulaQuoteLines[key].id > 0) {
        this.formValues.complexFormulaQuoteLines[key].isDeleted = true;
      } else {
        this.formValues.complexFormulaQuoteLines.splice(key, 1);
      }
    } else {
      this.toastr.error('Min 1 Quote');
    }
  }

  isMeanChange(ob: MatCheckboxChange) {
    console.log("checked: " + ob.checked);
    if (ob.checked) {
      for (let i = 0; i < this.formValues.complexFormulaQuoteLines.length; i++) {
        this.formValues.complexFormulaQuoteLines[i].formulaOperation.id = 3;
        this.formValues.complexFormulaQuoteLines[i].formulaOperation.name = 'Mean';
      }
      this.changeDetectorRef.detectChanges();
    }
  } 


  calendarOptionChange(ob: MatCheckboxChange, object, id, name) {
    console.log("checked: " + ob.checked);
    if (ob.checked) {
      if (typeof object == 'undefined') {
        object = {
          'id': id,
          'name': name
        }
        this.changeDetectorRef.detectChanges();
      }
      object.id = id;
      object.name = name;
    }
  }
  

  setFormulaOperation(value, line) {
    let findObject = _.find(this.formulaOperationList, function(obj) {
      return obj.id == value;
    });
    if (findObject != -1) {
      this.formValues.complexFormulaQuoteLines[line].formulaOperation = _.cloneDeep(findObject);
    }
    console.log(value);
    
  }

  clearSchedules() {
    this.formValues.pricingScheduleOptionDateRange = {};
    this.formValues.pricingScheduleOptionSpecificDate = {};
    this.formValues.pricingScheduleOptionEventBasedSimple = {};
    this.formValues.pricingScheduleOptionEventBasedExtended = {};
    this.formValues.pricingScheduleOptionEventBasedContinuous = {};
  }

  onChange($event, field) {
    if ($event.value) {
      let beValue = `${moment($event.value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
      if (field == 'from') {
        this.isValidFromDateInvalid = false;
      } else if (field == 'to') {
        this.isValidToDateInvalid = false;
      }
      console.log(beValue);
    } else {
      if (field == 'from') {
        this.isValidFromDateInvalid = true;
      } else if (field == 'to') {
        this.isValidToDateInvalid = false;
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

  
  
}
