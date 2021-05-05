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
import { DeliveryAutocompleteComponent } from '../delivery-autocomplete/delivery-autocomplete.component';
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
import { ContractService } from 'libs/feature/contract/src/lib/services/contract.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { DecimalPipe, KeyValue } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { MatMenuTrigger } from '@angular/material/menu';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ProductSpecGroupModalComponent } from '../product-spec-group-modal/product-spec-group-modal.component';
import { OVERLAY_KEYBOARD_DISPATCHER_PROVIDER_FACTORY } from '@angular/cdk/overlay/dispatchers/overlay-keyboard-dispatcher';
import { CreateNewFormulaModalComponent } from '../create-new-formula-modal/create-new-formula-modal.component';
import { throws } from 'assert';
import { FormulaHistoryModalComponent } from '../formula-history-modal/formula-history-modal.component';



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
  selector: 'shiptech-product-pricing',
  templateUrl: './product-pricing.component.html',
  styleUrls: ['./product-pricing.component.scss'],
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
export class ProductPricing extends DeliveryAutocompleteComponent
  implements OnInit{
  [x: string]: any;
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
  expandLocationProductPopUp =  false;
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
  productSpecGroup: any[];
  modalSpecGroupParameters: any;
  modalSpecGroupParametersEditable: boolean;
  canChangeSpec: boolean;
  specParameterList: any;
  activeProductForSpecGroupEdit: any;
  eventsSubscription: any;
  selectedVal: string;
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
  contractFormulaList: any;
  autocompleteFormula: knownMastersAutocomplete;
  additionalCostList: any;
  additionalCostsComponentTypes: any;
  costTypeList: any;
  EnableBargeCostDetails: boolean;
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
  @Input('additionalCostForLocation') set _setAdditionalCostForLocation(additionalCostForLocation) {
    if (!additionalCostForLocation) {
      return;
    }
    this.additionalCostForLocation = additionalCostForLocation;
  }


  @Input('contractProductIndex') set _setContractProductIndex(contractProductIndex) { 
    if (!contractProductIndex) {
      return;
    } 
    this.selectedTabIndex = contractProductIndex;
    if (this.formValues && this.formValues.products[contractProductIndex]) {
      this.selectedVal = this.formValues.products[contractProductIndex].isFormula ? 'formula' : 'fixed';
    }

  }

  @Input('uomList') set _setUomList(uomList) { 
    if (!uomList) {
      return;
    } 
    this.uomList = uomList;
  }

  @Input('formulaTypeList') set _setFormulaTypeList(formulaTypeList) { 
    if (!formulaTypeList) {
      return;
    } 
    this.formulaTypeList = formulaTypeList;
  }

  @Input('marketPriceList') set _setMarketPriceList(marketPriceList) { 
    if (!marketPriceList) {
      return;
    } 
    this.marketPriceList = marketPriceList;
  }

  @Input('formulaPlusMinusList') set _setFormulaPlusMinusList(formulaPlusMinusList) { 
    if (!formulaPlusMinusList) {
      return;
    } 
    this.formulaPlusMinusList = formulaPlusMinusList;
  }

  @Input('systemInstumentList') set _setSystemInstumentList(systemInstumentList) { 
    if (!systemInstumentList) {
      return;
    } 
    this.systemInstumentList = systemInstumentList;
  }

  @Input('formulaFlatPercentageList') set _setFormulaFlatPercentageList(formulaFlatPercentageList) { 
    if (!formulaFlatPercentageList) {
      return;
    } 
    this.formulaFlatPercentageList = formulaFlatPercentageList;
  }

  @Input('model') set _setFormValues(formValues) { 
    if (!formValues) {
      return;
    } 
    this.formValues = formValues;
    if (this.formValues && this.formValues.products[this.selectedTabIndex]) {
      this.selectedVal = this.formValues.products[this.selectedTabIndex].isFormula ? 'formula' : 'fixed';
      //this.formatAdditionalCostValue();
      this.formatPrice();
    }

  }

  @Input('additionalCostsComponentTypes') set _setAdditionalCostsComponentTypes(additionalCostsComponentTypes) { 
    if (!additionalCostsComponentTypes) {
      return;
    } 
    this.additionalCostsComponentTypes = additionalCostsComponentTypes;
  }

  @Input('generalTenantSettings') set _setGeneralTenantSettings(generalTenantSettings) { 
    if (!generalTenantSettings) {
      return;
    } 
    this.generalTenantSettings = generalTenantSettings;
  }


  @Input('currencyList') set _setCurrencyList(currencyList) { 
    if (!currencyList) {
      return;
    } 
    this.currencyList = currencyList;
  }

  @Input('formulaOperationList') set _setFormulaOperationList(formulaOperationList) { 
    if (!formulaOperationList) {
      return;
    } 
    this.formulaOperationList = formulaOperationList;
  }
  

  @Input('formulaFunctionList') set _setFormulaFunctionList(formulaFunctionList) { 
    if (!formulaFunctionList) {
      return;
    } 
    this.formulaFunctionList = formulaFunctionList;
  }

  @Input('marketPriceTypeList') set _setMarketPriceTypeList(marketPriceTypeList) { 
    if (!marketPriceTypeList) {
      return;
    } 
    this.marketPriceTypeList = marketPriceTypeList;
  }


  @Input('pricingScheduleList') set _setPricingScheduleList(pricingScheduleList) { 
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

  @Input('pricingSchedulePeriodList') set _setPricingSchedulePeriodList(pricingSchedulePeriodList) { 
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

      
  @Input('businessCalendarList') set _setBusinessCalendarList(businessCalendarList) { 
    if (!businessCalendarList) {
      return;
    } 
    this.businessCalendarList = businessCalendarList;
  }

        
  @Input('formulaEventIncludeList') set _setFormulaEventIncludeList(formulaEventIncludeList) { 
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
  
  @Input('contractFormulaList') set _setContractFormulaList(contractFormulaList) { 
    if (!contractFormulaList) {
      return;
    } 
    this.contractFormulaList = contractFormulaList;
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




  
  index = 0;
  expandLocationPopUp = false;
  array = [0,1,2,3,4,5,6,7,8,9,10];
  isMenuOpen = true;
  @Input() events: Observable<void>;
  @Input() eventsSaveButton: Observable<void>;
  priceFormat: any;



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
    private overlayContainer: OverlayContainer) {
    super(changeDetectorRef);
    this.autocompletePhysicalSupplier = knownMastersAutocomplete.formula;
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

  ngOnInit(){  
    this.entityName = 'Contract';
    this.eventsSubscription = this.events.subscribe((data) => this.setContractForm(data));
    this.eventsSaveButtonSubscription = this.eventsSaveButton.subscribe((data) => this.setRequiredFields(data))
  }

  setContractForm(form) {
    this.formValues = form;
    console.log(this.formValues);
    if (this.formValues && this.formValues.products[this.selectedTabIndex]) {
      this.selectedVal = this.formValues.products[this.selectedTabIndex].isFormula ? 'formula' : 'fixed';
      this.formatAdditionalCostValue();
      this.formatPrice();
    }
  }

  
  setRequiredFields(data) {
    this.buttonClicked = data;
    //this.changeDetectorRef.detectChanges();
    console.log(this.buttonClicked);
  }

  public onValChange(val: string) {
    this.selectedVal = val;
    if (val == 'formula') {
      this.formValues.products[this.selectedTabIndex].fixedPrice = false;
      this.formValues.products[this.selectedTabIndex].isFormula = true;
    } else {
      this.formValues.products[this.selectedTabIndex].isFormula = false;
      this.formValues.products[this.selectedTabIndex].fixedPrice = true;
    }
  }

  createNewFormulaPopup(selectedTabIndex) {
    if (!this.formValues.products[selectedTabIndex].formula) {
      const dialogRef = this.dialog.open(CreateNewFormulaModalComponent, {
        width: '80%',
        data:  {
          'formValues': null,
          'selectedTabIndex': this.selectedTabIndex,
          'formulaTypeList': this.formulaTypeList,
          'systemInstumentList': this.systemInstumentList,
          'marketPriceList': this.marketPriceList,
          'formulaPlusMinusList': this.formulaPlusMinusList,
          'formulaFlatPercentageList': this.formulaFlatPercentageList,
          'uomList': this.uomList,
          'currencyList': this.currencyList,
          'formulaOperationList': this.formulaOperationList,
          'formulaFunctionList': this.formulaFunctionList,
          'marketPriceTypeList': this.marketPriceTypeList,
          'pricingScheduleList': this.pricingScheduleList,
          'holidayRuleList': this.holidayRuleList,
          'pricingSchedulePeriodList': this.pricingSchedulePeriodList,
          'eventList': this.eventList,
          'dayOfWeekList': this.dayOfWeekList,
          'businessCalendarList': this.businessCalendarList,
          'formulaEventIncludeList': this.formulaEventIncludeList,
          'quantityTypeList': this.quantityTypeList,
          'productList': this.productList,
          'locationList': this.locationList,
          'hasInvoicedOrder': this.formValues.hasInvoicedOrder
        }
      }); 
      dialogRef.afterClosed().subscribe(result => {
        console.log('RESULT');
        if (result) {
          this.formValues.products[this.selectedTabIndex].formula = {
            'id': result.id,
            'name': result.name
          }
          this.updateConversionFactor(this.formValues.products[this.selectedTabIndex].formula);
          this.changeDetectorRef.detectChanges();
        }
      });       
    } 
  
  }

  
  getHeaderNameSelector1(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.formula:
        return knowMastersAutocompleteHeaderName.formula;
      default:
        return knowMastersAutocompleteHeaderName.formula;
    }
  }

  selectorFormulaSelectionChange(
    selection: IDisplayLookupDto
  ): void {
    if (selection === null || selection === undefined) {
      this.formValues.products[this.selectedTabIndex].formula = '';
    } else {
      const obj = {
        'id': selection.id,
        'name': selection.name
      };
      this.formValues.products[this.selectedTabIndex].formula = obj; 
      this.updateConversionFactor(this.formValues.products[this.selectedTabIndex].formula);
      this.changeDetectorRef.detectChanges();   
      console.log(this.formValues.products[this.selectedTabIndex]);
    }
  }

  filterContractFormulaList() {
    if (this.formValues.products[this.selectedTabIndex].formula) {
      const filterValue = this.formValues.products[this.selectedTabIndex].formula.name ? this.formValues.products[this.selectedTabIndex].formula.name.toLowerCase() : this.formValues.products[this.selectedTabIndex].formula.toLowerCase();
      console.log(filterValue);
      if (this.contractFormulaList) {
        return this.contractFormulaList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0)
          .slice(0, 10);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  displayFn(value): string {
    return value && value.name ? value.name : '';
  }


  removeFormula(selectedTabIndex) {
    this.formValues.products[selectedTabIndex].formula = null;
  }

  viewFormula(selectedTabIndex) {
    let formulaId = this.formValues.products[selectedTabIndex].formula ? this.formValues.products[selectedTabIndex].formula.id : null;
    if (!formulaId) {
      return;
    }
    this.spinner.show();
    this.contractService
    .getFormulaId(formulaId)
    .pipe(
      finalize(() => {
        this.spinner.hide();
      })
    )
    .subscribe((response: any) => {
      if (typeof response == 'string') {
        this.toastr.error(response);
      } else {
        const dialogRef = this.dialog.open(CreateNewFormulaModalComponent, {
          width: '80%',
          data:  {
            'formValues': response,
            'selectedTabIndex': this.selectedTabIndex,
            'formulaTypeList': this.formulaTypeList,
            'systemInstumentList': this.systemInstumentList,
            'marketPriceList': this.marketPriceList,
            'formulaPlusMinusList': this.formulaPlusMinusList,
            'formulaFlatPercentageList': this.formulaFlatPercentageList,
            'uomList': this.uomList,
            'currencyList': this.currencyList,
            'formulaOperationList': this.formulaOperationList,
            'formulaFunctionList': this.formulaFunctionList,
            'marketPriceTypeList': this.marketPriceTypeList,
            'pricingScheduleList': this.pricingScheduleList,
            'holidayRuleList': this.holidayRuleList,
            'pricingSchedulePeriodList': this.pricingSchedulePeriodList,
            'eventList': this.eventList,
            'dayOfWeekList': this.dayOfWeekList,
            'businessCalendarList': this.businessCalendarList,
            'formulaEventIncludeList': this.formulaEventIncludeList,
            'quantityTypeList': this.quantityTypeList,
            'productList': this.productList,
            'locationList': this.locationList,
            'hasInvoicedOrder': this.formValues.hasInvoicedOrder
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.formValues.products[this.selectedTabIndex].formula = {
              'id': result.id,
              'name': result.name
            }
            this.changeDetectorRef.detectChanges();
          }
        });
      }
    });

  }

  originalOrder = (a: KeyValue<number, any>, b: KeyValue<number, any>): number => {
    return 0;
  }



  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  compareAdditionalCostObjects(object1: any, object2: any) {
    return object1 && object2 && object1.additionalCostid == object2.id;
  }

  
  doFiltering(addCostCompTypes, cost, currentCost) {
    var costType = null;
    addCostCompTypes.forEach((v, k) => {
      if (v.id == currentCost) {
        costType = v.costType.id;
      }
    });
    var availableCosts = [];
    if (costType == 1 || costType == 2) {
      this.costTypeList.forEach((v, k) => {
        if (v.id == 1 || v.id == 2) {
          availableCosts.push(v);
        }
      });
    }
    if (costType == 3) {
      this.costTypeList.forEach((v, k) => {
        if (v.id == 3) {
          availableCosts.push(v);
        }
      });
    }
    this.EnableBargeCostDetails = false;
    if (costType == 4) {
      this.costTypeList.forEach((v, k) => {
        if (v.id == 4) {
          this.EnableBargeCostDetails = true;
          availableCosts.push(v);
        }
      });
    }
    if (costType == 5) {
      this.costTypeList.forEach((v, k) => {
        if (v.id == 5) {
          this.EnableBargeCostDetails = true;
          availableCosts.push(v);
        }
      });
    }

    return availableCosts;
  }

  filterCostTypesByAdditionalCost(cost, rowRenderIndex) {
       
    var currentCost = cost;
    // return doFiltering(vm.additionalCostsComponentTypes, currentCost);
    if(this.additionalCostsComponentTypes === undefined) {
        // this.getAdditionalCostsComponentTypes((additionalCostsComponentTypes) => {
        //     return doFiltering(additionalCostsComponentTypes);
        // });
    }else{
        return this.doFiltering(this.additionalCostsComponentTypes, 0, currentCost);
    }
  }

  resetUom(key1, key2) {
    console.log(this.generalTenantSettings);
    if (this.formValues.products[key1].additionalCosts[key2].costType.name != 'Unit') {
        this.formValues.products[key1].additionalCosts[key2].uom = null;
    } else {
        this.formValues.products[key1].additionalCosts[key2].uom = this.generalTenantSettings.tenantFormats.uom;
    }
  };

  addNewAdditionalCostLine() {
    if (this.formValues.status && this.formValues.status.name == 'Confirmed') {
      return;
    }
    if (!this.formValues.products[this.selectedTabIndex].additionalCosts) {
      this.formValues.products[this.selectedTabIndex].additionalCosts = [];
    }
    this.formValues.products[this.selectedTabIndex].additionalCosts.push({'id':0, 'currency': this.generalTenantSettings.tenantFormats.currency})

  }

  removeAdditionalCostLine(key) {
    if (this.formValues.status && this.formValues.status.name == 'Confirmed') {
      return;
    }
    if (this.formValues.products[this.selectedTabIndex].additionalCosts[key].id) {
      this.formValues.products[this.selectedTabIndex].additionalCosts[key].isDeleted = true;
    } else {
      this.formValues.products[this.selectedTabIndex].additionalCosts.splice(key, 1);
    }
  }

  setDefaultCostType(additionalCost) {
    let defaultCostType;
    this.additionalCostsComponentTypes.forEach((v, k) => {
        if (v.id == additionalCost.id) {
            defaultCostType = v.costType;
        }
    });
    return defaultCostType;
  }

  setIsAllowingNegativeAmmount(key1, key2) {
    let additionalCost = this.formValues.products[key1].additionalCosts[key2].additionalCost;
    let findAdditionalCostComponent = _.find(this.additionalCostsComponentTypes, function(obj) {
        return obj.id == additionalCost.id;
    });
    if (findAdditionalCostComponent) {
      this.formValues.products[key1].additionalCosts[key2].isAllowingNegativeAmmount = findAdditionalCostComponent.isAllowingNegativeAmmount;
    }
  }

  formatAdditionalCostValue() {
    if (this.formValues.products[this.selectedTabIndex].additionalCosts) {
      for (let i = 0; i < this.formValues.products[this.selectedTabIndex].additionalCosts.length; i++) {
        this.formValues.products[this.selectedTabIndex].additionalCosts[i].amount = this.amountFormatValue(this.formValues.products[this.selectedTabIndex].additionalCosts[i].amount);
      }
    }

  }

  formatPrice() {
    if (!this.formValues.products[this.selectedTabIndex].pricePrecision) {
      this.formValues.products[this.selectedTabIndex].pricePrecision = this.tenantService.pricePrecision;
    }
  }


  recomputeProductPricePrecision (productKey) {
    if (this.formValues.products[productKey].price) {
      this.formValues.products[productKey].price = this.priceFormatValue(this.formValues.products[productKey].price, this.formValues.products[productKey].pricePrecision);
      
      if (!this.formValues.products[productKey].pricePrecision) {
        (<HTMLInputElement>document.getElementById('price_'+ productKey)).value = this.formValues.products[productKey].price;
      }

      this.changeDetectorRef.detectChanges();
    }
  }
  
  amountFormatValue(value) {
    if (typeof value == 'undefined') {
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

  priceFormatValue(value, pricePrecision) {
    if (typeof value == 'undefined') {
      return null;
    }
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    let number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (number) {
      if (pricePrecision == 0) {
        return number;
      }
      return this._decimalPipe.transform(number, '1.' + pricePrecision +  '-' + pricePrecision);
    }
  }

  changePricing(type) {
    console.log(type);
  }

   // Only Number
   keyPressNumber(event) {
    var inp = String.fromCharCode(event.keyCode);
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


  createRange(min, max) {
    min = parseInt(min);
    max = parseInt(max);
    var input = [];
    for (let i = min; i <= max; i++) {
        input.push(i);
    }
    return input;
  }

  updateConversionFactor(event) {
    console.log(event);
    if (!this.formValues.products[this.selectedTabIndex].conversionFactors) {
      return;
    }
    for (let i = 0; i < this.formValues.products[this.selectedTabIndex].conversionFactors.length; i++) {
      if (this.formValues.products[this.selectedTabIndex].conversionFactors[i].contractConversionFactorOptions && this.formValues.products[this.selectedTabIndex].conversionFactors[i].contractConversionFactorOptions.id == 4) {
        let product  = this.formValues.products[this.selectedTabIndex];
        let conversionFactors = this.formValues.products[this.selectedTabIndex].conversionFactors[i];
        let payload = {};
        payload = {
          Payload: {
            ProductId: conversionFactors.product.id,
            FormulaId: event.id
          }
        };
        this.openedScreenLoaders += 1;
        this.spinner.show();
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
                this.openedScreenLoaders +=1;
                let conversionFactorsList = [];
                conversionFactorsList.push(conversionFactors);
                payload = { Payload: conversionFactorsList };
               // this.spinner.show();
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
                      this.spinner.hide();
                    } else if (response) {
                      let res = response[0];
                      this.formValues.products[this.selectedTabIndex].convFactorMassUom = res.massUom;
                      this.formValues.products[this.selectedTabIndex].convFactorValue = res.value;
                      this.formValues.products[this.selectedTabIndex].convFactorVolumeUom = res.volumeUom;
                    }
                  });
              }
            }
          }
        });
      }
    }
  }

  openFormulaHistory(productId) {
    console.log(this._entityId);
    let payload = {
      ContractId :  this._entityId,
      ContractProductId : productId
    };
    this.spinner.show();
    this.contractService
    .getContractFormulas(payload)
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
          const dialogRef = this.dialog.open(FormulaHistoryModalComponent, {
            width: '80%',
            data:  {
              'formulaHistoryDataResponse': response
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
          });
        }
      }
    });
  }
    

  ngAfterViewInit(): void {
  
  }
}

