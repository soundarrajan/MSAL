import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ChangeDetectorRef,
  Input,
  Injectable,
  InjectionToken,
  Optional
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import {
  knowMastersAutocompleteHeaderName,
  knownMastersAutocomplete
} from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { AgGridDatetimePickerToggleComponent } from 'libs/feature/spot-negotiation/src/lib/core/ag-grid/ag-grid-datetimePicker-Toggle';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import moment, { Moment, MomentFormatSpecification, MomentInput } from 'moment';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { SetLocationsRows } from 'libs/feature/spot-negotiation/src/lib/store/actions/ag-grid-row.action';
import { OrderListGridViewModel } from '@shiptech/core/ui/components/delivery/view-model/order-list-grid-view-model.service';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import {
  NgxMatDateAdapter,
  NgxMatDateFormats,
  NGX_MAT_DATE_FORMATS
} from '@angular-material-components/datetime-picker';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';

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
  selector: 'app-spotnego-otherdetails2',
  templateUrl: './spotnego-otherdetails2.component.html',
  styleUrls: ['./spotnego-otherdetails2.component.css'],
  providers: [
    OrderListGridViewModel,
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
export class SpotnegoOtherdetails2Component implements OnInit {
  uomList: any;
  switchTheme; //false-Light Theme, true- Dark Theme
  SupplyQuantityUoms: any;
  disableScrollDown = false;
  public showaddbtn = true;
  isShown: boolean = true; // hidden by default
  isBtnActive: boolean = false;
  isButtonVisible = true;
  iscontentEditable = false;
  isSupplyDeliveryDateInvalid: boolean;
  public selectedFormulaTab;
  public initialized;
  otherDetailsItems: any = [];
  staticLists: any;
  productList: any = [];
  inactiveList: any = [];
  selectedProductList: any;
  productIndex: any = 0;
  locationsRows: any;
  locations: any;
  supplyDeliveryDate: '';
  dateFormat_rel_SupplyDate: any;
  tenantConfiguration: any;
  autocompleteProducts: knownMastersAutocomplete;
  _entityId: number;
  _entityName: string;
  private _autocompleteType: any;
  @ViewChild(AgGridDatetimePickerToggleComponent)
  child: AgGridDatetimePickerToggleComponent;
  ngOnInit() {}
  get entityId(): number {
    return this._entityId;
  }

  get entityName(): string {
    return this._entityName;
  }
  @Input() set autocompleteType(value: string) {
    this._autocompleteType = value;
  }

  @Input() set entityName(value: string) {
    this._entityName = value;
    this.gridViewModel.entityName = this.entityName;
  }
  constructor(
    public dialogRef: MatDialogRef<SpotnegoOtherdetails2Component>,
    private store: Store,
    public gridViewModel: OrderListGridViewModel,
    protected changeDetectorRef: ChangeDetectorRef,
    private spotNegotiationService: SpotNegotiationService,
    private toastr: ToastrService,
    public tenantFormat: TenantFormattingService,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    @Inject(MAT_DATE_FORMATS) private dateFormats,
    @Inject(NGX_MAT_DATE_FORMATS) private dateTimeFormats,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedProductList = this.data;
    //RequestProductId:   parseInt(this.data.column.userProvidedColDef.product.id),
    //   RequestLocationSellerId: parseInt(updatedRow.id),
    //   LocationId:parseInt(updatedRow.locationId)
    this.autocompleteProducts = knownMastersAutocomplete.products;
    this.dateFormats.display.dateInput = this.tenantFormat.dateFormat;
    this.dateFormats.parse.dateInput = this.tenantFormat.dateFormat;
    this.dateTimeFormats.display.dateInput = this.tenantFormat.dateFormat;
    CUSTOM_DATE_FORMATS.display.dateInput = this.tenantFormat.dateFormat;
    PICK_FORMATS.display.dateInput = this.tenantFormat.dateFormat;
    // this.dateFormat_rel_SupplyDate=this.tenantFormat.dateFormat
    // .replace('DDD', 'ddd')
    // .replace('dd/', 'DD/')
    // .replace('dd-', 'DD-');
    this.store.selectSnapshot<any>((state: any) => {
      this.staticLists =  state.spotNegotiation.staticLists;
    });
    this.uomList = this.staticLists.uom;
    this.productList = this.staticLists.product;
    //this.productList = this.productList.concat(this.setListFromStaticLists('inactiveProducts'));


    // this.legacyLookupsDatabase.getTableByName('product').then(response => {
    //   this.productList = response;
    // });
    // // this.legacyLookupsDatabase.getTableByName('inactiveProducts').then(response => {
    // //   this.inactiveList = response;
    // //   this.productList = this.productList.concat(this.inactiveList);
    // // });
    // this.legacyLookupsDatabase.getTableByName('uom').then(response => {
    //   this.uomList = response;
    // });
    this.getOtherDetailsLoad();
  }

  closeDialog() {
    this.dialogRef.close();
  }
  displayFn(product): string {
    return product && product.name ? product.name : '';
  }

  formatDate(date?: any) {
    if (date) {
      let currentFormat = this.tenantFormat.dateFormat;
      let hasDayOfWeek;
      if (currentFormat.startsWith('DDD ')) {
        hasDayOfWeek = true;
        currentFormat = currentFormat.split('DDD ')[1];
      }
      currentFormat = currentFormat.replace(/d/g, 'D');
      currentFormat = currentFormat.replace(/y/g, 'Y');
      const elem = moment(date, 'YYYY-MM-DDTHH:mm:ss');
      let formattedDate = moment(elem).format(currentFormat);
      if (hasDayOfWeek) {
        formattedDate = `${moment(date).format('ddd')} ${formattedDate}`;
      }
      return formattedDate;
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

  //popup initial load data..
  getOtherDetailsLoad() {
    this.store.selectSnapshot<any>((state: any) => {
      this.locationsRows = state.spotNegotiation.locationsRows;
      this.locations = state.spotNegotiation.locations;
      //this.staticLists =state.spotNegotiation.staticLists;
      this.tenantConfiguration = state.spotNegotiation.tenantConfigurations;
    });
    var otherDetailsPayload = [];
    this.locations.forEach(ele => {
      this.locationsRows.forEach(element1 => {
        if (element1.requestOffers != undefined) {
          element1.requestOffers.forEach(reqOff => {
            if (
              reqOff.requestProductId ==
                this.selectedProductList.column.userProvidedColDef.product.id &&
              element1.id == this.selectedProductList.data.id &&
              ele.locationId == element1.locationId
            ) {
              let etaDate, reqProd;
              if (reqOff.supplyDeliveryDate == null) {
                etaDate = ele.recentEta ?? ele.eta;
              } else {
                etaDate = reqOff.supplyDeliveryDate;
              }
              reqProd = ele.requestProducts.filter(
                item => item.id === reqOff.requestProductId
              );
              otherDetailsPayload = this.ConstructOtherDetailsPayload(
                reqOff,
                etaDate,
                reqProd
              );
              this.otherDetailsItems.push(otherDetailsPayload[0]);
            }
          });
        }
      });
    });
  }
  ///product lookup filter
  filterProductList() {
    if (this.otherDetailsItems[this.productIndex].product) {
      const filterValue = this.otherDetailsItems[this.productIndex].product.name
        ? this.otherDetailsItems[this.productIndex].product.name.toLowerCase()
        : this.otherDetailsItems[this.productIndex].product.toLowerCase();
      if (this.productList) {
        return this.productList
          .filter(
            option =>
              option.name.toLowerCase().indexOf(filterValue.trim()) === 0 //
          )
          .slice(0, 10);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
  //Construct UI Value's to bind the popup grid
  ConstructOtherDetailsPayload(requestOffers, etaDate, reqProd) {
    let QtyUomId;
    if (requestOffers.supplyQuantityUomId == null) {
      QtyUomId =
        requestOffers.priceQuantityUomId ?? this.tenantConfiguration.uomId;
    } else {
      QtyUomId = requestOffers.supplyQuantityUomId;
    }
    return [
      {
        OfferId: requestOffers.offerId,
        RequestOfferId: requestOffers.id,
        SupplyQuantity: this.tenantFormat.quantity(requestOffers.supplyQuantity)
          ? this.tenantFormat.quantity(requestOffers.supplyQuantity)
          : '',
        SupplyDeliveryDate: etaDate
          ? moment(etaDate).format(this.dateFormat_rel_SupplyDate)
          : '',
        product:
          requestOffers.quotedProductId == reqProd[0].productId
            ? ''
            : {
                id: requestOffers.quotedProductId,
                name: this.productList.find(
                  x => x.id == requestOffers.quotedProductId
                ).name
              },
        QuotedProductId: requestOffers.quotedProductId,
        uom: {
          id: QtyUomId,
          name: this.uomList.find(x => x.id == QtyUomId).name //Default Uom is Id:5
        }
      }
    ];
  }
  // Only Number
  keyPressNumber(event) {
    const inp = String.fromCharCode(event.keyCode);
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
  onChange($event, field) {
    if ($event.value) {
      let beValue = `${moment($event.value).format(
        'YYYY-MM-DDTHH:mm:ss'
      )}+00:00`;
      if (field == 'supplyDeliveryDate') {
        this.isSupplyDeliveryDateInvalid = false;
      }
    } else {
      if (field == 'supplyDeliveryDate') {
        this.isSupplyDeliveryDateInvalid = true;
      }
      this.toastr.error('Please enter the correct format');
    }
  }
  //decode
  htmlDecode(str: any): any {
    var decode = function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
    };

    return decode(_.unescape(str));
  }
  getHeaderNameSelector(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.products:
        return knowMastersAutocompleteHeaderName.products;
      default:
        return knowMastersAutocompleteHeaderName.products;
    }
  }
  selectorProductSelectionChange(selection: IDisplayLookupDto): void {
    if (selection === null || selection === undefined) {
      this.otherDetailsItems[this.productIndex].product = '';
    } else {
      const obj = {
        id: selection.id,
        name: selection.name
      };
      this.otherDetailsItems[this.productIndex].product = obj;
      this.changeDetectorRef.detectChanges();
    }
  }
  /// lists class separate
  setListFromStaticLists(name) {
    const findList = _.find(this.staticLists, function(object) {
      return object.name == name;
    });
    if (findList != -1) {
      return findList?.items;
    }
  }
  /// uom list's compare
  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }
  /// save request Change
  saveOtherDetails() {
    // if (this.otherDetailsItems[this.productIndex].product=='' || this.otherDetailsItems[this.productIndex].product == undefined || this.otherDetailsItems[this.productIndex].SupplyQuantity == undefined || this.otherDetailsItems[this.productIndex].SupplyQuantity=='' || this.otherDetailsItems[this.productIndex].SupplyDeliveryDate=='') {
    //   this.toastr.warning('Fill the required fields quotedProduct ,supplyQuantity & supplyDeliveryDate');
    //   return;
    // }
    let isAllow = false;
    /// If the user is trying to capture product same as that in the request under same location
    this.locations.forEach(ele => {
      if (ele.requestProducts != undefined) {
        ele.requestProducts.forEach(reqOff => {
          if (
            reqOff.id ==
              this.selectedProductList.column.userProvidedColDef.product.id &&
            ele.locationId == this.selectedProductList.data.locationId
          ) {
            if (
              reqOff.productId ==
              this.otherDetailsItems[this.productIndex].product.id
            ) {
              isAllow = true;
            }
          }
        });
      }
    });
    if (isAllow) {
      this.toastr.warning('Product already exists in the negotiation');
      return;
    }
    /// end
    /// payload construct
    let otherDetails_data = {
      RequestOfferId: this.otherDetailsItems[this.productIndex].RequestOfferId,
      OfferId: this.otherDetailsItems[this.productIndex].OfferId,
      QuotedProductId: this.otherDetailsItems[this.productIndex].product.id,
      SupplyQuantity: this.otherDetailsItems[this.productIndex].SupplyQuantity,
      SupplyQuantityUomId: this.otherDetailsItems[this.productIndex].uom.id,
      SupplyDeliveryDate: this.otherDetailsItems[this.productIndex]
        .SupplyDeliveryDate
        ? moment(
            this.otherDetailsItems[this.productIndex].SupplyDeliveryDate
          ).format(this.dateFormat_rel_SupplyDate)
        : ''
    };
    const response = this.spotNegotiationService.OtherDetails(
      otherDetails_data
    );
    response.subscribe((res: any) => {
      if (res?.message == 'Unauthorized') {
        return;
      }
      if (res.status) {
        this.toastr.success('Saved successfully..');
        const futureLocationsRows = this.getLocationRowsWithOtherDetails(
          JSON.parse(JSON.stringify(this.locationsRows)),
          otherDetails_data
        );
        this.store.dispatch(new SetLocationsRows(futureLocationsRows));
        this.spotNegotiationService.callGridRefreshService();
      } else {
        this.toastr.error(res.message);
        return;
      }
    });
  }
  /// update store loctionrows
  getLocationRowsWithOtherDetails(rowdata, requestChangeData) {
    rowdata.forEach((element1, key) => {
      if (element1.requestOffers != undefined) {
        element1.requestOffers.forEach((reqOff, reqkey) => {
          if (
            reqOff.requestProductId ==
              this.selectedProductList.column.userProvidedColDef.product.id &&
            element1.id == this.selectedProductList.data.id
          ) {
            reqOff.supplyQuantity = requestChangeData.SupplyQuantity;
            reqOff.supplyDeliveryDate = requestChangeData.SupplyDeliveryDate;
            reqOff.supplyQuantityUomId = requestChangeData.SupplyQuantityUomId;
            reqOff.quotedProductId =
              requestChangeData.QuotedProductId == undefined
                ? this.otherDetailsItems[this.productIndex].QuotedProductId
                : requestChangeData.QuotedProductId;
            reqOff.isSupplyQuantityEdited = true;
            reqOff.priceQuantityUomId = requestChangeData.SupplyQuantityUomId;
          }
        });
      }
    });
    return rowdata;
  }

  tabledata = [
    {
      seller: 'Total Marine Fuel',
      port: 'Amstredam',
      contractname: 'Cambodia Contarct 2021',
      contractproduct: 'DMA 1.5%',
      formula: 'Cambodia Con',
      schedule: 'Average of 5 Days',
      contractqty: '10,000,.00',
      liftedqty: '898.00 MT',
      availableqty: '96,602.00 MT',
      price: '$500.00'
    },
    {
      seller: 'Total Marine Fuel',
      port: 'Amstredam',
      contractname: 'Amstredam Contarct 2021',
      contractproduct: 'DMA 1.5%',
      formula: 'Cambodia Con',
      schedule: 'Average of 5 Days',
      contractqty: '10,000,.00',
      liftedqty: '898.00 MT',
      availableqty: '96,602.00 MT',
      price: '$500.00'
    }
  ];
}
