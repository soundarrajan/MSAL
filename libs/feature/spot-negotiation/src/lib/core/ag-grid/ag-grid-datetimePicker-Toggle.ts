import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  Injectable,
  InjectionToken,
  Optional,
  Inject
} from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import _moment, { Moment, MomentFormatSpecification, MomentInput } from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;
import { MatMenuTrigger } from '@angular/material/menu';
import { FormControl } from '@angular/forms';
import { SpotNegotiationService } from '../../services/spot-negotiation.service';
import { Store } from '@ngxs/store';
import { SetQuoteDateAndTimeZoneId } from '../../store/actions/request-group-actions';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { NgxMatDateAdapter, NgxMatDateFormats, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
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
  selector: 'app-date-time-toggle',
  template: `
    <div
      (click)="$event.stopPropagation(); picker.open()"
      style="cursor:pointer;float: left;position:relative;font-size: 12px;color: #ffffff;
  font-weight: 500;"
    >
      <div class="quoteByContainer">
      <mat-form-field class="quoteByMatfield">
        <input
          style="cursor:pointer;width:98px;float:left;height: 17px !important;text-align:left;color:black; margin-left:-18px;"
          matInput
          class="date-trigger"
          [ngModel]="initialDate.value"
          [matDatepicker]="picker"
          (dateChange)="dateChanged($event)"
          #datetrigger
        />
       </mat-form-field>
        <div
          style="height:24px;float:right;line-height:15px;width:30px;position: absolute;
    right: 1px;"
        >
          {{ timeValue }}
        </div>
      </div>
    </div>
    <mat-datepicker-toggle matSuffix [for]="picker">
      <mat-icon matDatepickerToggleIcon class="mini-dateIcon"></mat-icon>
    </mat-datepicker-toggle>
    <mat-datepicker
      [panelClass]="
        dark ? 'new-datepicker datepicker-darktheme' : 'new-datepicker'
      "
      #picker
      (opened)="opened()"
    ></mat-datepicker>
    <input
      #timepicker
      [(ngModel)]="timerValue"
      (dateTimeChange)="onChange($event)"
      [owlDateTimeTrigger]="dt"
      [owlDateTime]="dt"
      style="position: relative;top: -19px;
               width: 100px;visibility:hidden;border: none"
    />

    <!-- <span
      [owlDateTimeTrigger]="dt"
      style="position: absolute;top: 7px;left: 116px;"
      ><i class="fa">&#xf017;</i></span
    > -->
    <div class="time-pick-container">
    <owl-date-time
      [pickerType]="'timer'"
      #dt
      [panelClass]="dark ? ['timerPanelClass', 'darktheme'] : 'timerPanelClass'"
      (afterPickerClosed)="timepickerClosed()"
      (afterPickerOpen)="timepickerOpened()"
    ></owl-date-time>
        </div>
  `,
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    {
      provide: NgxMatDateAdapter,
      useClass: CustomNgxDatetimeAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ]
})
export class AgGridDatetimePickerToggleComponent
  implements ICellEditorAngularComp, AfterViewInit {
  private params: any;
  public matDate = new Date();
  // matDate.setValue('1/1/2021');
  valueField: any;
  oldCellValue: string;
  timeValue: any ;
  timerValue: any;
  currentRequestInfo: any;
  quoteByTimeZoneId:number|null;
  newFormattedValue: string;
  matDateFieldWidth = '100px';
  initialDate = new FormControl(moment()); 
  public dateTime;
  @Input() dark: any;
  constructor(    
    private store: Store,
    private format: TenantFormattingService,
    @Inject(MAT_DATE_FORMATS) private dateFormats,
    @Inject(NGX_MAT_DATE_FORMATS) private dateTimeFormats,
    private spotNegotiationService: SpotNegotiationService) {
      this.dateFormats.display.dateInput = this.format.dateFormat;
      this.dateFormats.parse.dateInput = this.format.dateFormat;
      this.dateTimeFormats.display.dateInput = this.format.dateFormat;
      CUSTOM_DATE_FORMATS.display.dateInput = this.format.dateFormat;
      PICK_FORMATS.display.dateInput = this.format.dateFormat;
    //this.appContext = appContext || AppContext.instance;
  }
  @ViewChild('dateInputFlde', { read: ViewContainerRef }) public input;
  @ViewChild('picker') picker;
  @ViewChild('dt') dt;
  @ViewChild('timepicker') timepicker: ElementRef<HTMLElement>;
  @ViewChild('datetrigger') datetrigger: ElementRef<HTMLElement>;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @Output() onDatePicked = new EventEmitter();
  agInit(params: any): void {
    this.params = params;
    this.valueField = '12/12/2018 10:10';
    this.oldCellValue = params.value;
    this.initialDate.setValue(new Date(this.valueField));
    //this.timeValue = this.valueField.slice(-6);
    //var timervalue = this.timeValue;
    //var showTime = this.timeValue.split(':');
    //this.timerValue = new Date(0, 0, 0, showTime[0], showTime[1]);
    // let d = new Date(this.valueField);
    // let h = (d.getHours()<10?'0':'') + d.getHours();
    // let m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    // let i = h + ':' + m;
    // this.timeValue = i;
    this.newFormattedValue = params.value;
    this.matDateFieldWidth = params.matDateFieldWidth - 16 + 'px';
  }

  onChange(event) {
    //alert("");
    this.timeValue = event.value.getHours() + ':' + event.value.getMinutes();
    let h = (event.value.getHours() < 10 ? '0' : '') + event.value.getHours();
    let m =
      (event.value.getMinutes() < 10 ? '0' : '') + event.value.getMinutes();
    this.timeValue = h + ':' + m;
    //this.timeValue = "10:15";
    this.initialDate=new FormControl(moment(this.spotNegotiationService.QuoteByDate),);
    this.initialDate = this.getValue();
    this.updateQuoteByGroup(this.initialDate);
  }
  dateChanged(event) {
    this.initialDate = new FormControl(moment(event.value));
    const closeFn = this.picker.close;
    this.picker.close = () => {};
    this.picker[
      '_popupComponentRef'
    ].instance._calendar.monthView._createWeekCells();
    setTimeout(() => {
      this.picker.close = closeFn;
    });
    this.spotNegotiationService.QuoteByDate = this.getValue();
    this.updateQuoteByGroup(this.spotNegotiationService.QuoteByDate);
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
      let elem = moment(date, 'YYYY-MM-DDTHH:mm:ss');
      let formattedDate = moment(elem).format(currentFormat);
      if (hasDayOfWeek) {
        formattedDate = `${moment(date).format('ddd')} ${formattedDate}`;
      }
      return formattedDate;
    }
  }

  timepickerClosed() {
    //alert("");
    //var elements = document.getElementsByClassName('owl-dt-control')[1] as HTMLElement;
    //elements.click();
    //alert(this.timeValue);
    this.onDatePicked.emit({ date: this.initialDate, time: this.timeValue });
  }

  timepickerOpened() {
    /*var arrowclick = document.getElementsByClassName('owl-dt-control-arrow-button');
    let i;
    for (i = 0; i < arrowclick.length; i++) {
      arrowclick[i].addEventListener("click",function() {
        var elements = document.getElementsByClassName('owl-dt-control')[1] as HTMLElement;
        elements.click();
        event.stopPropagation();
        //this.dt.open();
        });
    }*/
    var div = document.createElement('div');
    div.classList.add('calendar-picker-toggle');
    //div.classList.add("calendar-picker-toggless");
    div.onclick = () => {
      //alert("blabla");
      //this.picker.open();
      //this.trigger.openMenu();
      //this.time.open();
      //this.timepicker.nativeElement.click();
      var elements = document.getElementsByClassName(
        'owl-dt-control'
      )[1] as HTMLElement;
      //elements.click();
      this.dt.close();
      this.picker.open();
      //   setTimeout(() => {
      //   let el: HTMLElement = this.datetrigger.nativeElement;
      //   el.click();
      //  })
      //  setTimeout(() => {
      //   let el1: HTMLElement = this.timepicker.nativeElement;
      //   el1.click();
      //   },3000)
    };
    //setTimeout(() => {
    var element = document.getElementsByClassName('owl-dt-container-inner');
    element[0].appendChild(div);
    //})
  }

  opened() {
    var div = document.createElement('div');
    div.classList.add('time-picker-toggle');
    var div1 = document.createElement('div');
    div1.classList.add('time-picker-toggle-container');
    div1.appendChild(div);
    div.onclick = () => {
      //alert("blabla");
      this.picker.close();
      //this.trigger.openMenu();
      //this.time.open();
      let el: HTMLElement = this.timepicker.nativeElement;
      el.click();
    };

    if (this.dark) {
      var element = document.getElementsByTagName('mat-datepicker-content');
      element[0].classList.add('darktheme');
      element[0].appendChild(div1);
    } else {
      //setTimeout(() => {
      var element = document.getElementsByTagName('mat-datepicker-content');
      element[0].appendChild(div1);
    }
    //})
  }

  getValue(): any {
    this.valueField = this.initialDate.value;

    // adjust 0 before single digit date
    let date = ('0' + this.valueField.date()).slice(-2);

    // current month
    let month = ('0' + (this.valueField.month() + 1)).slice(-2);

    // current year
    let year = this.valueField.year();
    if (this.timeValue) {
      return moment(month + '/' + date + '/' + year + ' ' + this.timeValue, 'MM/DD/YYYY HH:mm:ss')
      //return( month + "/" + date+ "/" + year);
    } else return moment(month + '/' + date + '/' + year, 'MM/DD/YYYY')
    //return(this.valueField.getMonth()+'/'+this.valueField.getDate()+'/'+this.valueField.getFullYear()+" "+this.timeValue.getHours()+":"+this.timeValue.getMinutes())
    // .format(this.appContext.tenantSettingsContext.dateTimeFormat)
    // .substring(0, 19);
  }
  ngDoCheck() {
    if(this.spotNegotiationService.QuoteByDate!=undefined){
      this.initialDate = new FormControl(this.spotNegotiationService.QuoteByDate);
      this.getHrsMins(this.initialDate.value);  
    }
  }
  getHrsMins(valueField){
    let d = new Date(valueField._i??valueField);
    let h =  d.getHours();
    let m =  d.getMinutes();
    let i = h + ':' + m;
    this.timeValue = i;
  }
  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    //this.matDate.setValue('1/1/2021');
    setTimeout(() => {
      //this.input.element.nativeElement.focus();
      //this.picker.open();
    });
  }

  getDateValue(event: MatDatepickerInputEvent<Date>) {
    alert('');
    // this.newFormattedValue =
    //   moment
    //     .utc(event.value)
    //     .local()
    //     .format(this.appContext.tenantSettingsContext.dateFormat) +
    //   ' ' +
    //   this.oldCellValue.substring(11, 16);
  }
  ///Update the QuoteByDate and TimeZone by requestGroups
  updateQuoteByGroup(updateDateTime){

    this.currentRequestInfo =this.store.selectSnapshot<any>((state: any) => {
        return state.spotNegotiation.currentRequestSmallInfo;
      }); 
    let payload={
      QuoteByTimeZoneId:this.spotNegotiationService.QuoteByTimeZoneId, 
      RequestGroupId:this.currentRequestInfo.requestGroupId, 
      QuoteByDate: moment.utc(updateDateTime._i) 
    }
    this.spotNegotiationService
    .updateQuoteDateGroup(payload)
    .subscribe((response: any) => {
      if (response?.message == 'Unauthorized') {
        return;
      }
      if (response?.status) {
        this.spotNegotiationService.QuoteByTimeZoneId=payload.QuoteByTimeZoneId;
        this.spotNegotiationService.QuoteByDate=updateDateTime;
        let setQuoteByGroup={
          quoteTimeZoneIdByGroup:payload.QuoteByTimeZoneId,
          quoteDateByGroup: updateDateTime
        };
        payload.QuoteByTimeZoneId;
        this.store.dispatch(new SetQuoteDateAndTimeZoneId(setQuoteByGroup));
      }
    });
  }
  onBlur(): any {
    var selectedCell = this.params.column.colId;
    //this.params.data[selectedCell] = moment(this.valueField).format(this.appContext.tenantSettingsContext.dateTimeFormat).substring(0, 19);
    //this.objJSF.send('refreshSelectedRow');
  }

  pickerOpen() {
    //alert("");
    this.picker.open();
  }
}
