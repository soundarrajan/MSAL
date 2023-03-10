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
import { DecimalPipe, KeyValue } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { MatMenuTrigger } from '@angular/material/menu';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ProductSpecGroupModalComponent } from '../product-spec-group-modal/product-spec-group-modal.component';
import { OVERLAY_KEYBOARD_DISPATCHER_PROVIDER_FACTORY } from '@angular/cdk/overlay/dispatchers/overlay-keyboard-dispatcher';

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
    const elem = moment(value, currentFormat);
    const date = elem.toDate();
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
  selector: 'shiptech-contract-product',
  templateUrl: './contract-product.component.html',
  styleUrls: ['./contract-product.component.scss'],
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
export class ContractProduct extends DeliveryAutocompleteComponent
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

  displayedColumns: string[] = ['name', 'country'];
  displayedProductColumns: string[] = ['name', 'productType'];

  @ViewChild('mySelect') mySelect: MatSelect;

  @ViewChildren('locationMenuTrigger') locationMenuTrigger;
  @ViewChildren('productMenuTrigger') productMenuTrigger;

  productMasterList: any;
  expandLocationProductPopUp = false;
  locationMasterSearchList: any[];
  searchLocationInput: any = '';
  expandCompanyPopUp: any;
  searchCompanyModel: any;
  productMasterSearchList: any[];
  generalTenantSettings: any;

  selectedLocation: any;
  selectedProduct: any;
  selectedTabIndex: number = 0;
  expandAllowCompanies: false;

  searchProductInput: any = '';
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
  productSpecGroup: any[];
  modalSpecGroupParameters: any;
  modalSpecGroupParametersEditable: boolean;
  canChangeSpec: boolean;
  specParameterList: any;
  activeProductForSpecGroupEdit: any;
  formulaTypeList: any;
  systemInstumentList: any;
  marketPriceList: any;
  formulaPlusMinusList: any;
  formulaFlatPercentageList: any;
  currencyList: any;
  formulaOperationList: any;
  formulaFunctionList: any;
  marketPriceTypeList: any;
  pricingScheduleList: any;
  holidayRuleList: any;
  pricingSchedulePeriodList: any;
  eventList: any;
  dayOfWeekList: any;
  businessCalendarList: any;
  formulaEventIncludeList: any;
  quantityTypeList: any;
  contractFormulaList: any = [];
  additionalCostList: any;
  costTypeList: any;
  eventsSaveButtonSubscription: any;
  buttonClicked: any;
  buttonClicked1: any;
  additionalCostsComponentTypes: any;
  eventsSelectedTabIndexSubscription: any;
  contractConfiguration: any;
  expandLocation: any = false;
  expandProduct: any = false;
  bankFilterCtrl: any = new FormControl();
  additionalCostForLocation: any = [];
  entityCopied: any;
  eventsEntityCopiedSubscription: any;
  locationMasterSearchListOptions: any = [];
  productMasterSearchListOptions: any = [];
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

  contractFormSubject: Subject<any> = new Subject<any>();
  productSpecGroupSubject: Subject<any> = new Subject<any>();

  @Input('locationMasterList') set _setLocationMasterList(locationMasterList) {
    if (!locationMasterList) {
      return;
    }
    this.locationMasterList = _.cloneDeep(locationMasterList);
    this.locationMasterSearchList = [];
    for (let i = 0; i < this.locationMasterList.length; i++) {
      this.locationMasterSearchList.push({
        id: this.locationMasterList[i].id,
        name: this.locationMasterList[i].name,
        country: this.locationMasterList[i].country
      });
    }
    this.selectedLocationList = _.cloneDeep(locationMasterList);
  }

  @Input('productMasterList') set _setProductMasterList(productMasterList) {
    if (!productMasterList) {
      return;
    }

    this.productMasterList = _.cloneDeep(productMasterList);
    this.productMasterList = _.cloneDeep(productMasterList);
    this.productMasterSearchList = _.cloneDeep(this.productMasterList);
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

  @Input('entityCopied') set _setEntityCopied(entityCopied) {
    if (!entityCopied) {
      return;
    }
    this.entityCopied = entityCopied;
  }

  @Input('currencyList') set _setCurrencyList(currencyList) {
    if (!currencyList) {
      return;
    }
    this.currencyList = currencyList;
  }

  @Input('formulaOperationList') set _setFormulaOperationList(
    formulaOperationList
  ) {
    if (!formulaOperationList) {
      return;
    }
    this.formulaOperationList = formulaOperationList;
  }

  @Input('formulaTypeList') set _setFormulaTypeList(formulaTypeList) {
    if (!formulaTypeList) {
      return;
    }
    this.formulaTypeList = formulaTypeList;
  }

  @Input('systemInstumentList') set _setSystemInstumentList(
    systemInstumentList
  ) {
    if (!systemInstumentList) {
      return;
    }
    this.systemInstumentList = systemInstumentList;
  }

  @Input('marketPriceList') set _setMarketPriceList(marketPriceList) {
    if (!marketPriceList) {
      return;
    }
    this.marketPriceList = marketPriceList;
  }

  @Input('formulaFlatPercentageList') set _setFormulaFlatPercentageList(
    formulaFlatPercentageList
  ) {
    if (!formulaFlatPercentageList) {
      return;
    }
    this.formulaFlatPercentageList = formulaFlatPercentageList;
  }

  @Input('formulaPlusMinusList') set _setFormulaPlusMinusList(
    formulaPlusMinusList
  ) {
    if (!formulaPlusMinusList) {
      return;
    }
    this.formulaPlusMinusList = formulaPlusMinusList;
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
    for (let i = 0; i < this.formValues.products.length; i++) {
      if (this.formValues.products[i].product) {
        this.getSpecGroupByProduct(
          this.formValues.products[i].product.id,
          this.formValues.products[i].specGroup,
          'CPInit'
        );
      }
      if (this.formValues.products[i].location) {
        this.getAdditionalCostsPerPort(this.formValues.products[i].location.id);
      }
    }
    this.getAdditionalCostsComponentTypes();
  }

  @Input('generalTenantSettings') set _setGeneralTenantSettings(
    generalTenantSettings
  ) {
    if (!generalTenantSettings) {
      return;
    }
    this.generalTenantSettings = generalTenantSettings;
  }

  @Input('formulaFunctionList') set _setFormulaFunctionList(
    formulaFunctionList
  ) {
    if (!formulaFunctionList) {
      return;
    }
    this.formulaFunctionList = formulaFunctionList;
  }

  @Input('marketPriceTypeList') set _setMarketPriceTypeList(
    marketPriceTypeList
  ) {
    if (!marketPriceTypeList) {
      return;
    }
    this.marketPriceTypeList = marketPriceTypeList;
  }

  @Input('pricingScheduleList') set _setPricingScheduleList(
    pricingScheduleList
  ) {
    if (!pricingScheduleList) {
      return;
    }
    this.pricingScheduleList = pricingScheduleList;
  }

  @Input('holidayRuleList') set _setHolidayRuleList(holidayRuleList) {
    if (!holidayRuleList) {
      return;
    }
    this.holidayRuleList = holidayRuleList;
  }

  @Input('pricingSchedulePeriodList') set _setPricingSchedulePeriodList(
    pricingSchedulePeriodList
  ) {
    if (!pricingSchedulePeriodList) {
      return;
    }
    this.pricingSchedulePeriodList = pricingSchedulePeriodList;
  }

  @Input('eventList') set _setEventList(eventList) {
    if (!eventList) {
      return;
    }
    this.eventList = eventList;
  }

  @Input('dayOfWeekList') set _setDayOfWeekListt(dayOfWeekList) {
    if (!dayOfWeekList) {
      return;
    }
    this.dayOfWeekList = dayOfWeekList;
  }

  @Input('businessCalendarList') set _setBusinessCalendarList(
    businessCalendarList
  ) {
    if (!businessCalendarList) {
      return;
    }
    this.businessCalendarList = businessCalendarList;
  }

  @Input('formulaEventIncludeList') set _setFormulaEventIncludeList(
    formulaEventIncludeList
  ) {
    if (!formulaEventIncludeList) {
      return;
    }
    this.formulaEventIncludeList = formulaEventIncludeList;
  }

  @Input('quantityTypeList') set _setQuantityTypeList(quantityTypeList) {
    if (!quantityTypeList) {
      return;
    }
    this.quantityTypeList = quantityTypeList;
  }

  @Input('productList') set _setProductList(productList) {
    if (!productList) {
      return;
    }
    this.productList = productList;
  }

  @Input('locationList') set _setLocationList(locationList) {
    if (!locationList) {
      return;
    }
    this.locationList = locationList;
  }

  @Input('additionalCostList') set _setAdditionalCostListt(additionalCostList) {
    if (!additionalCostList) {
      return;
    }
    this.additionalCostList = additionalCostList;
  }

  @Input('costTypeList') set _setCostTypeList(costTypeList) {
    if (!costTypeList) {
      return;
    }
    this.costTypeList = costTypeList;
  }

  @Input('buttonClicked1') set _setButtonClicked1(buttonClicked1) {
    if (!buttonClicked1) {
      return;
    }
    this.buttonClicked1 = buttonClicked1;
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
  @Input() eventsSaveButton: Observable<void>;
  @Input() eventsSelectedTabIndex: Observable<void>;
  @Input() eventsEntityCopied: Observable<void>;
  @Output() onDataPicked = new EventEmitter<any>();

  expandProductPopUp: any = false;

  eventsSubject2: Subject<any> = new Subject<any>();
  eventsSubject3: Subject<any> = new Subject<any>();

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
    if (this.locationMasterSearchList) {
      console.log(this.formValues);
      this.setLocationsOptions();
    }
    this.getContractFormulaList1();
    if (this.formValues.products && !this.formValues.products.length) {
      this.addEmptyProductLine();
    }
    this.eventsSaveButtonSubscription = this.eventsSaveButton.subscribe(data =>
      this.setRequiredFields(data)
    );
    this.eventsSelectedTabIndexSubscription = this.eventsSelectedTabIndex.subscribe(
      data => this.setSelectedTab(data)
    );
    this.eventsEntityCopiedSubscription = this.eventsEntityCopied.subscribe(
      data => this.setEntityCopied(data)
    );
  }

  setLocationsOptions() {
    for (let i = 0; i < this.formValues.products.length; i++) {
      this.locationMasterSearchListOptions[i] = _.cloneDeep(
        this.locationMasterList
      ).splice(0, 10);
      this.productMasterSearchListOptions[i] = _.cloneDeep(
        this.productMasterList
      ).splice(0, 10);
    }

    console.log(this.locationMasterSearchListOptions);
    console.log(this.productMasterSearchListOptions);
  }

  setEntityCopied(data) {
    this.entityCopied = data;
    this.eventsSubject3.next(this.entityCopied);
  }

  setSelectedTab(index) {
    this.selectedTabIndex = index;
  }

  setRequiredFields(data) {
    this.buttonClicked = data;
    console.log(this.buttonClicked);
    this.eventsSubject2.next(this.buttonClicked);
  }

  searchLocations(value: any, contractProductIndex): void {
    if (!value || typeof value == 'undefined') {
      value = '';
    }
    const filterLocations = _.filter(this.locationMasterList, function(
      location
    ) {
      return location?.name?.toLowerCase().includes(value.toLowerCase());
    });
    console.log(filterLocations);
    this.locationMasterSearchListOptions[contractProductIndex] = [
      ...filterLocations
    ].splice(0, 10);
    this.changeDetectorRef.detectChanges();
  }

  searchProducts(value: any, contractProductIndex): void {
    if (!value || typeof value == 'undefined') {
      value = '';
    }
    const filterProducts = _.filter(this.productMasterList, function(product) {
      return product?.name?.toLowerCase().includes(value.toLowerCase());
    });
    console.log(filterProducts);
    this.productMasterSearchListOptions[contractProductIndex] = [
      ...filterProducts
    ].splice(0, 10);
    this.changeDetectorRef.detectChanges();
  }

  addEmptyProductLine() {
    console.log(this.formValues);
    const emptyProductObj = {
      id: 0,
      details: null,
      additionalCosts: [],
      fixedPrice: true,
      mtmFixed: false,
      specGroup: null,
      dealDate: null,
      physicalSuppliers: [],
      allowedProducts: [],
      allowedLocations: [],
      priceUom: this.generalTenantSettings.tenantFormats.uom,
      currency: this.generalTenantSettings.tenantFormats.currency
    };

    if (this.formValues.products && !this.formValues.products.length) {
      this.formValues.products.push(emptyProductObj);
    }

    this.locationMasterSearchListOptions[
      this.formValues.products.length - 1
    ] = _.cloneDeep(this.locationMasterList).splice(0, 10);

    this.productMasterSearchListOptions[
      this.formValues.products.length - 1
    ] = _.cloneDeep(this.productMasterList).splice(0, 10);

    //this.selectedTabIndex =  0;
    this.setAllowedLocations(this.selectedTabIndex);
    this.setAllowedProducts(this.selectedTabIndex);
    if (!this.contractFormulaList.length) {
      this.getContractFormulaList();
    }
    this.changeDetectorRef.detectChanges();
  }

  addProductToContract() {
    this.spinner.show();
    console.log(this.formValues);
    const emptyProductObj = {
      id: 0,
      details: null,
      additionalCosts: [],
      fixedPrice: true,
      mtmFixed: false,
      specGroup: null,
      dealDate: null,
      physicalSuppliers: [],
      allowedProducts: [],
      allowedLocations: [],
      priceUom: this.generalTenantSettings.tenantFormats.uom,
      currency: this.generalTenantSettings.tenantFormats.currency
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

    this.locationMasterSearchListOptions[
      this.formValues.products.length - 1
    ] = _.cloneDeep(this.locationMasterList).splice(0, 10);

    this.productMasterSearchListOptions[
      this.formValues.products.length - 1
    ] = _.cloneDeep(this.productMasterList).splice(0, 10);
    this.selectedTabIndex = this.formValues.products.length - 1;
    this.setAllowedLocations(this.selectedTabIndex);
    this.setAllowedProducts(this.selectedTabIndex);
    if (!this.contractFormulaList.length) {
      this.getContractFormulaList();
    }
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      this.spinner.hide();
    }, 300);

    console.log(this.formValues);
  }

  getContractFormulaList1() {
    console.log(this._entityId);
    const data = {
      Payload: {
        PageFilters: {
          Filters: []
        },
        Filters: [
          {
            ColumnName: 'ContractId',
            Value: this._entityId ? this._entityId : null
          }
        ],
        SearchText: null,
        Pagination: {
          Skip: 0,
          Take: 999999
        }
      }
    };
    this.contractService
      .getContractFormulaList(data)
      .pipe(finalize(() => {}))
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          this.contractFormulaList = response;
        }
      });
  }

  getContractFormulaList() {
    console.log(this._entityId);
    const data = {
      Payload: {
        PageFilters: {
          Filters: []
        },
        Filters: [
          {
            ColumnName: 'ContractId',
            Value: this._entityId ? this._entityId : null
          }
        ],
        SearchText: null,
        Pagination: {
          Skip: 0,
          Take: 999999
        }
      }
    };
    this.spinner.show();
    this.contractService
      .getContractFormulaList(data)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          this.contractFormulaList = response;
          this.changeDetectorRef.detectChanges();
          //this.toastr.success('Operation completed successfully!')
        }
      });
  }

  setAllowedLocations(selectedTabIndex) {
    this.selectedLocationList = _.cloneDeep(this.locationMasterList);
    const contractProduct = this.formValues.products[selectedTabIndex];
    if (
      contractProduct.allowedLocations &&
      contractProduct.allowedLocations.length
    ) {
      for (let i = 0; i < contractProduct.allowedLocations.length; i++) {
        const allowedLocation = contractProduct.allowedLocations[i];
        const findIndexOfLocationInLocationList = _.findIndex(
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
    const newAllowedLocations = [];
    const allowedLocations = this.selectedLocationList;
    for (let i = 0; i < allowedLocations.length; i++) {
      if (allowedLocations[i].isSelected) {
        const allowedLocation = {
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
    const contractProduct = this.formValues.products[selectedTabIndex];
    if (
      contractProduct.allowedProducts &&
      contractProduct.allowedProducts.length
    ) {
      for (let i = 0; i < contractProduct.allowedProducts.length; i++) {
        const allowedProduct = contractProduct.allowedProducts[i];
        const findIndexOfProductInProductList = _.findIndex(
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
    const newAllowedProducts = [];
    const allowedProducts = this.selectedProductList;
    for (let i = 0; i < allowedProducts.length; i++) {
      if (allowedProducts[i].isSelected) {
        const allowedProduct = {
          id: allowedProducts[i].id,
          name: allowedProducts[i].name
        };
        newAllowedProducts.push(allowedProduct);
      }
    }

    const previousAllowedProducts = _.cloneDeep(
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
      const allowedProduct = {
        ...this.formValues.products[selectedTabIndex].allowedProducts[i]
      };
      const findProductIfExistsInPreviousAllowedProducts = _.find(
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
      const previousAllowedProduct = { ...previousAllowedProducts[i] };
      const findProductIfExistsInAllowedProducts = _.find(
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
      const beValue = `${moment($event.value).format(
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
      let beValue = `${moment.utc(value).format('YYYY-MM-DDTHH:mm:ss')}+00:00`;
      return `${moment.utc(value).format('YYYY-MM-DDTHH:mm:ss')}+00:00`;
    } else {
      return null;
    }
  }

  displayFn(product): string {
    return product && product.name ? product.name : '';
  }

  filterPhysicalSupplierList() {
    if (this.formValues.products[this.selectedTabIndex].physicalSuppliers[0]) {
      const filterValue = this.formValues.products[this.selectedTabIndex]
        .physicalSuppliers[0].name
        ? this.formValues.products[
            this.selectedTabIndex
          ].physicalSuppliers[0].name.toLowerCase()
        : this.formValues.products[
            this.selectedTabIndex
          ].physicalSuppliers[0].toLowerCase();
      console.log(filterValue);
      if (this.physicalSupplierList) {
        return this.physicalSupplierList
          .filter(
            option => option.name.toLowerCase().indexOf(filterValue) === 0
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
      this.formValues.products[this.selectedTabIndex].physicalSuppliers[0] = '';
    } else {
      const obj = {
        id: selection.id,
        name: selection.name
      };
      this.formValues.products[
        this.selectedTabIndex
      ].physicalSuppliers[0] = obj;
      this.changeDetectorRef.detectChanges();
      console.log(this.formValues.products[this.selectedTabIndex]);
    }
  }

  decodeSpecificField(modelValue) {
    const decode = function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
    };
    return decode(_.unescape(modelValue));
  }

  setLocationChange(location, index) {
    //this.locationMasterSearchList = _.cloneDeep(this.locationMasterList);
    this.searchLocationInput = null;
    this.formValues.products[index].location = {
      id: location.id,
      name: location.name
    };
    this.selectedLocation = null;
    this.getAdditionalCostsPerPort(location.id);
    // this.changeDetectorRef.detectChanges();
    //this.contractFormSubject.next(this.formValues);
  }

  getAdditionalCostsPerPort(locationId) {
    if (typeof this.additionalCostForLocation == 'undefined') {
      this.additionalCostForLocation = [];
    }

    if (typeof this.additionalCostForLocation[locationId] != 'undefined') {
      return;
    }

    const payload = {
      Payload: {
        Order: null,
        PageFilters: { Filters: [] },
        SortList: { SortList: [] },
        Filters: [{ ColumnName: 'LocationId', value: locationId }],
        SearchText: null,
        Pagination: { Skip: 0, Take: 25 }
      }
    };

    this.contractService
      .getAdditionalCostsPerPort(payload)
      .pipe(finalize(() => {}))
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          console.log(response);
          this.additionalCostForLocation[locationId] = response;
          this.changeAdditionalCostList(locationId);
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  getAdditionalCostsPerPortOnLocationChanging(locationId) {
    if (typeof this.additionalCostForLocation == 'undefined') {
      this.additionalCostForLocation = [];
    }

    if (typeof this.additionalCostForLocation[locationId] != 'undefined') {
      return;
    }
    const payload = {
      Payload: {
        Order: null,
        PageFilters: { Filters: [] },
        SortList: { SortList: [] },
        Filters: [{ ColumnName: 'LocationId', value: locationId }],
        SearchText: null,
        Pagination: { Skip: 0, Take: 25 }
      }
    };

    this.spinner.show();
    this.contractService
      .getAdditionalCostsPerPort(payload)
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
          this.additionalCostForLocation[locationId] = response;
          for (
            let i = 0;
            i < this.additionalCostForLocation[locationId].length;
            i++
          ) {
            if (this.additionalCostForLocation[locationId][i].locationid) {
              if (
                !this.formValues.products[this.selectedTabIndex].additionalCosts
              ) {
                this.formValues.products[
                  this.selectedTabIndex
                ].additionalCosts = [];
              }
              const additionalCostLine = {
                additionalCost: {
                  id: this.additionalCostForLocation[locationId][i]
                    .additionalCostid,
                  name: this.additionalCostForLocation[locationId][i].name
                },
                costType: this.additionalCostForLocation[locationId][i]
                  .costType,
                amount: this.additionalCostForLocation[locationId][i].amount,
                uom: this.additionalCostForLocation[locationId][i].priceUom,
                extras: this.additionalCostForLocation[locationId][i]
                  .extrasPercentage,
                currency: this.additionalCostForLocation[locationId][i]
                  .currency,
                comments: this.additionalCostForLocation[locationId][i]
                  .costDescription,
                locationAdditionalCostId: this.additionalCostForLocation[
                  locationId
                ][i].locationid
              };
              this.formValues.products[
                this.selectedTabIndex
              ].additionalCosts.push(additionalCostLine);
            }
          }
          this.changeAdditionalCostList(locationId);
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  setProductChange(product, index) {
    console.log(product);
    console.log(index);
    console.log(this.formValues.products[index]);
    const objectProduct = {
      id: product.id,
      name: product.name
    };
    this.formValues.products[index].product = { ...objectProduct };
    this.productMasterSearchList = _.cloneDeep(this.productMasterList);
    this.searchProductInput = null;
    this.addProductToConversion(index, null, true);
    this.getSpecGroupByProduct(product.id, null, 'ProductChange');
    this.defaultUomByProduct(product.id, index);
    this.changeDetectorRef.detectChanges();
    this.changeDetectorRef.markForCheck();
    this.contractFormSubject.next(this.formValues);
  }

  public sendData(date: any): void {
    this.onDataPicked.emit(date);
  }

  defaultUomByProduct(productId, index) {
    let payload = { Payload: productId };
    this.contractService
      .getProductById(payload)
      .pipe(finalize(() => {}))
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
          this.spinner.hide();
        } else {
          console.log(response);
          let productTypeGroup = response.productTypeGroup;
          let payload1 = { Payload: {} };
          this.contractService
            .listProductTypeGroupsDefaults(payload1)
            .pipe(finalize(() => {}))
            .subscribe((res: any) => {
              if (typeof res == 'string') {
                this.toastr.error(res);
                this.spinner.hide();
              } else {
                console.log(res);
                this.spinner.hide();

                let defaultUomAndCompany = _.find(res, function(object) {
                  return object.id == productTypeGroup.id;
                });
                if (defaultUomAndCompany) {
                  console.log(defaultUomAndCompany);
                  console.log(index);
                  for (let i = 0; i < this.formValues.details.length; i++) {
                    console.log(this.formValues.details[i]);
                    this.formValues.details[i].uom =
                      defaultUomAndCompany.defaultUom;
                  }
                  this.formValues.products[index].priceUom =
                    defaultUomAndCompany.defaultUom;
                  this.sendData(this.formValues);
                }
              }
            });
        }
      });
  }

  getSpecGroupByProduct(productId, additionalSpecGroup, initiatorName) {
    const data = {
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
      if (initiatorName != 'CPInit') {
        this.setDefaultSpecGroup(productId);
      }
      return;
    }

    this.contractService
      .getSpecGroupsGetByProduct(data)
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
              let additionalSpecIsInArray = false;
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
            //this.productSpecGroupSubject.next(this.productSpecGroup);
            if (initiatorName != 'CPInit') {
              this.setDefaultSpecGroup(productId);
            }
          }
        }
      });
  }

  setDefaultSpecGroup(productId) {
    this.formValues.products[
      this.selectedTabIndex
    ].specGroup = this.productSpecGroup[productId]?.find(sg => sg.isDefault);
  }

  getAdditionalCostsComponentTypes() {
    if (typeof this.additionalCostsComponentTypes != 'undefined') {
      return;
    }
    //this.spinner.show();
    this.contractService
      .getAdditionalCostsComponentTypes({})
      .pipe(
        finalize(() => {
          //this.spinner.hide();
        })
      )
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          this.additionalCostsComponentTypes = response;
          this.changeDetectorRef.detectChanges();
        }
      });
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
              const idIndex = _.findIndex(
                allowProducts,
                (o: any) => o.id == value.product.id
              );
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
          const indexProduct =
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
              const idIndex = _.findIndex(
                allowProducts,
                (o: any) => o.id == value.product.id
              );
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
        const indexProduct = _.findLastIndex(
          this.formValues.products[index].conversionFactors,
          (o: any) => o.product.id == selectedProduct.product.id
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
      this.contractService
        .getProdDefaultConversionFactors(payload)
        .pipe(
          finalize(() => {
          })
        )
        .subscribe((response: any) => {
          if (typeof response == 'string') {
            this.toastr.error(response);
          } else {
            console.log(response);
            const contractConversionFactor = {
              id: 3,
              name: 'Standard (Product)'
            };
            const object = {
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

  removeProductFromContract(key) {
    console.log(key);
    if (!this.formValues.products[key].id) {
      this.formValues.products.splice(key, 1);
    } else {
      this.formValues.products[key].isDeleted = true;
    }
    console.log(this.selectedTabIndex);

    const findFirstIndex = _.findIndex(this.formValues.products, function(
      object: any
    ) {
      return !object.isDeleted;
    });
    if (findFirstIndex != -1) {
      this.selectedTabIndex = findFirstIndex;
    }
    console.log(this.selectedTabIndex);
  }

  originalOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => 0;

  changeAdditionalCostList(locationId) {
    console.log(this.additionalCostList);
    console.log(this.additionalCostForLocation[locationId]);
    const newAdditionalCostList = _.cloneDeep(
      this.additionalCostForLocation[locationId]
    );
    // for (let j = 0; j < this.additionalCostList.length; j++) {
    //   let additionalCostFromCache = this.additionalCostList[j];
    //   let findAdditionalCostLineIndex = _.findIndex(
    //     newAdditionalCostList,
    //     function(object: any) {
    //       return additionalCostFromCache.id == object.additionalCostid;
    //     }
    //   );
    //   if (findAdditionalCostLineIndex == -1) {
    //     newAdditionalCostList.push(additionalCostFromCache);
    //   }
    // }

    console.log(newAdditionalCostList);
    this.additionalCostForLocation[locationId] = _.cloneDeep(
      newAdditionalCostList
    );
    this.formatAdditionalCostIds(locationId);
    this.changeDetectorRef.detectChanges();
  }

  formatAdditionalCostIds(locationId) {
    for (let i = 0; i < this.formValues.products.length; i++) {
      for (
        let j = 0;
        j < this.formValues.products[i].additionalCosts.length;
        j++
      ) {
        if (!this.formValues.products[i].additionalCosts[j].isDeleted) {
          if (this.formValues.products[i].additionalCosts[j].additionalCost) {
            const additionalLocationId = this.formValues.products[i]
              .additionalCosts[j].locationAdditionalCostId;
            const findLocationId = _.findIndex(
              this.additionalCostForLocation[locationId],
              function(object: any) {
                return object.locationid == additionalLocationId;
              }
            );
            if (findLocationId != -1) {
              this.formValues.products[i].additionalCosts[
                j
              ].additionalCost.locationid = this.formValues.products[
                i
              ].additionalCosts[j].locationAdditionalCostId;
            }
          }
        }
      }
    }

    console.log(this.formValues);
  }

  ngAfterViewInit(): void {}
}
