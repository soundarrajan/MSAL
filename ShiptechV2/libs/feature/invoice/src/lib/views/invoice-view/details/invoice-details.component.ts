import { KnownInvoiceRoutes } from './../../../known-invoice.routes';
import { KnownPrimaryRoutes } from './../../../../../../../core/src/lib/enums/known-modules-routes.enum';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChildren,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Injectable,
  InjectionToken
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import {
  forkJoin,
  Observable,
  of,
  ReplaySubject,
  Subject,
  throwError
} from 'rxjs';
import {
  catchError,
  concatMap,
  finalize,
  map,
  takeUntil,
  tap
} from 'rxjs/operators';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@shiptech/environment';

// import { EMPTY$ } from './utils/rxjs-operators';
import { TenantSettingsApi } from '@shiptech/core/services/tenant-settings/api/tenant-settings-api.service';
import { TenantSettingsModuleName } from '../../../../../../../core/src/lib/store/states/tenant/tenant-settings.interface';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellEditableComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-editable.component';
import { AGGridCellRendererComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-renderer.component';
import { AgGridCellStyleComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-style.component';
import { GridOptions, Optional } from 'ag-grid-community';
import moment from 'moment';
import {
  IInvoiceDetailsItemBaseInfo,
  IInvoiceDetailsItemCounterpartyDetails,
  IInvoiceDetailsItemResponse,
  IInvoiceDetailsItemDto,
  IInvoiceDetailsItemInvoiceCheck,
  IInvoiceDetailsItemInvoiceSummary,
  IInvoiceDetailsItemOrderDetails,
  IInvoiceDetailsItemPaymentDetails,
  IInvoiceDetailsItemProductDetails,
  IInvoiceDetailsItemRequestInfo,
  IInvoiceDetailsItemStatus
} from '../../../services/api/dto/invoice-details-item.dto';
import { InvoiceDetailsService } from '../../../services/invoice-details.service';
import { TenantSettingsService } from '../../../../../../../core/src/lib/services/tenant-settings/tenant-settings.service';
import { ToastrService } from 'ngx-toastr';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { InvoiceTypeSelectionComponent } from './component/invoice-type-selection/invoice-type-selection.component';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
// import {MomentDateAdapter} from '@angular/material-moment-adapter';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import _ from 'lodash';
import { DecimalPipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';
import { DeliveryAutocompleteComponent } from './component/delivery-autocomplete/delivery-autocomplete.component';
import {
  knowMastersAutocompleteHeaderName,
  knownMastersAutocomplete
} from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { IOrderLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

import { NativeDateAdapter } from '@angular/material/core';
import { Moment, MomentFormatSpecification, MomentInput } from 'moment';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  NgxMatDateAdapter,
  NgxMatDateFormats,
  NgxMatNativeDateAdapter,
  NGX_MAT_DATE_FORMATS
} from '@angular-material-components/datetime-picker';
import { ContractService } from 'libs/feature/contract/src/lib/services/contract.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { AppConfig } from '@shiptech/core/config/app-config';

const isEmpty = object =>
  !Object.values(object).some(x => x !== null && x !== '');

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
      // console.log(newVal);
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
  selector: 'shiptech-invoice-detail',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },

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
export class InvoiceDetailComponent extends DeliveryAutocompleteComponent
  implements OnInit, OnDestroy {
  //Default Values - strats
  orderId: number;
  public gridOptions_data: GridOptions;
  public gridOptions_ac: GridOptions;
  public gridOptions_claims: GridOptions;
  public gridOptions_rel_invoice: GridOptions;
  private rowData_aggrid_pd = [];
  private rowData_aggrid_ac = [];
  public productData: any = [];
  paidAmmoutDisabled = false;
  paymentStatus: number = 0;
  customInvoice: number = 0;
  dateFormat;
  formSubmitted: boolean = false;
  showMoreButtons: boolean = false;
  expandRelatedInvoice: boolean = true;
  emptyStringVal = '--';
  emptyNumberVal = '';
  @ViewChildren('addProductMenu') addproductMenu;
  more_invoice_types = [
    {
      displayName: 'Final',
      value: 2
    },
    {
      displayName: 'Provisional',
      value: 1
    },
    {
      displayName: 'Credit',
      value: 4
    },
    {
      displayName: 'Debit',
      value: 5
    },
    {
      displayName: 'Pre-claim Credit Note',
      value: 6
    },
    {
      displayName: 'Pre-claim Debit Note',
      value: 7
    }
  ];
  invoice_types = [
    {
      displayName: 'Final',
      value: 2
    },
    {
      displayName: 'Provisional',
      value: 1
    },
    {
      displayName: 'Credit',
      value: 4
    },
    {
      displayName: 'Debit',
      value: 5
    }
  ];

  public chipData = [
    { Title: 'Invoice No', Data: this.emptyStringVal },
    { Title: 'Status', Data: this.emptyStringVal, statusColorCode: '' },
    { Title: 'Invoice Total', Data: this.emptyStringVal },
    { Title: 'Estimated Total', Data: this.emptyStringVal },
    { Title: 'Total Difference', Data: this.emptyStringVal },
    { Title: 'Provisional Inv No.', Data: this.emptyStringVal },
    { Title: 'Provisional Total', Data: this.emptyStringVal },
    { Title: 'Deductions', Data: this.emptyStringVal },
    { Title: 'Net Payable', Data: this.emptyStringVal }
  ];
  public orderDetails = {
    contents: [
      {
        label: 'Vessel',
        value: this.emptyStringVal,
        customLabelClass: [],
        customValueClass: []
      },
      {
        label: 'Vessel Code',
        value: this.emptyStringVal,
        customLabelClass: [],
        customValueClass: []
      },
      {
        label: 'Port',
        value: this.emptyStringVal,
        customLabelClass: [],
        customValueClass: []
      },
      {
        label: 'ETA',
        value: this.emptyStringVal,
        customLabelClass: [],
        customValueClass: []
      }
    ],
    hasSeparator: false
  };

  public orderDetails2 = {
    contents: [
      {
        label: 'Buyer',
        value: this.emptyStringVal,
        customLabelClass: [],
        customValueClass: []
      },
      {
        label: 'Trader',
        value: this.emptyStringVal,
        customLabelClass: [],
        customValueClass: []
      }
    ],
    hasSeparator: true
  };
  public counterpartyDetails = {
    contents: [
      {
        label: 'Seller',
        value: this.emptyStringVal,
        customLabelClass: [],
        customValueClass: []
      },
      {
        label: 'Broker',
        value: this.emptyStringVal,
        customLabelClass: [],
        customValueClass: []
      }
    ],
    hasSeparator: true
  };

  invoiceStatusList: any;
  paymentStatusList: any;
  invoiceTypeList: any;
  manualtab: any;
  entityName: string;
  entityId: number;
  uomList: any;
  staticLists: any;
  currencyList: any;
  productList: any;
  physicalSupplierList: any;
  amountFormat: string;
  convertedAmount: any;
  conversionTo: any;
  conversionRoe: any;
  roeDisabled: boolean = false;
  type: string;
  eventsSubject5: Subject<any> = new Subject<any>();
  costTypeList: any;
  eventsSubject: Subject<any> = new Subject<any>();
  cost: any;
  costType: any;
  product: any;
  old_cost: any;
  old_product: any;
  old_costType: any;
  applyForList: any;
  bankAccountNumbers: any;
  visibilityConfigs: any;
  isPricingDateEditable: boolean = false;
  formErrors: any = {};
  tenantConfiguration: any;
  _autocompleteType: any;
  @Input() vesselId: number;
  autocompleteSellers: knownMastersAutocomplete;
  autocompletePaybleTo: knownMastersAutocomplete;
  autocompleteCompany: knownMastersAutocomplete;
  autocompleteCarrier: knownMastersAutocomplete;
  autocompleteCustomer: knownMastersAutocomplete;
  autocompletePaymentTerm: knownMastersAutocomplete;
  paymentTermList: any;
  companyList: any;
  customerList: any;
  paybleToList: any;
  scheduleDashboardLabelConfiguration: any;
  statusColorCode: string = '#9E9E9E';
  invoiceId: number;
  quantityFormat: string;
  initialHasManualPaymentDate: boolean;
  manualPaymentDateReference: string;
  initialDueDate: string;
  rowData_aggrid_rel_invoice: any = [];
  totalrowData = [];
  dateFormat_rel_invoice: any;
  //formValues:any;

  // detailFormvalues:any;
  @Input('detailFormvalues') set _detailFormvalues(val) {
    if (val) {
      this.formValues = val;
      // Set trader and buyer name;
      this.orderDetails2.contents[0].value =
        this.formValues.orderDetails.buyerName || this.emptyStringVal;
      this.orderDetails2.contents[1].value =
        this.formValues.orderDetails.traderName || this.emptyStringVal;

      if (this.formValues.relatedInvoices) {
        this.formValues.relatedInvoices.forEach(element => {
          this.rowData_aggrid_rel_invoice.push({
            id: element.id,
            'order-number': element.orderId,
            type: element.invoiceType.name,
            date: element.invoiceDate
              ? moment(element.invoiceDate).format(this.dateFormat_rel_invoice)
              : '',
            amount: this.format.amount(element.invoiceAmount),
            deductions: this.format.amount(element.deductions),
            paid: this.format.amount(element.paidAmount),
            status: element.invoiceStatus.name
          });
        });
        this.formValues.relatedInvoicesSummary.forEach(total => {
          this.totalrowData.push({
            id: 'Net Payable',
            'order-number': this.format.amount(total.netPayable),
            type: '',
            date: 'Total',
            amount: this.format.amount(total.invoiceAmountTotal),
            deductions: this.format.amount(total.deductionsTotal),
            paid: this.format.amount(total.paidAmount),
            status: ''
          });
        });
        if (this.gridOptions_rel_invoice.api) {
          this.gridOptions_rel_invoice.api.sizeColumnsToFit();
        }
      }
      // Set paid ammount disabled;
      if (
        !this.formValues.status ||
        this.formValues.status.name === 'New' ||
        this.formValues.status.name === 'Cancelled'
      ) {
        this.paidAmmoutDisabled = true;
      }

      if (this.formValues.invoiceRateCurrency) {
        this.conversionTo = this.formValues.invoiceRateCurrency;
      }
      this.entityId = val.id;
      if (!this.formValues.paymentDetails) {
        this.formValues.paymentDetails = <IInvoiceDetailsItemPaymentDetails>{};
      }
      if (!this.formValues.counterpartyDetails.counterpartyBankAccount) {
        this.formValues.counterpartyDetails.counterpartyBankAccount = <
          IInvoiceDetailsItemBaseInfo
        >{};
      }
      this.parseProductDetailData(this.formValues.productDetails);
      //  console.log(this.invoiceDetailsComponent.parseProductDetailData);
      this.setOrderDetailsLables(this.formValues.orderDetails);
      this.setcounterpartyDetailsLables(this.formValues.counterpartyDetails);
      this.setChipDatas();
      this.manualtab = this.more_invoice_types.filter(x => {
        return x.value === this.formValues.documentType?.id;
      });
      if (this.manualtab.length == 0) {
        this.more_invoice_types.pop();
      }
      this.setInvoiceAmount();
      this.setTitle();
      if (!this.entityId) {
        this.summaryCalculationsForProductDetails();
        this.summaryCalculationsForCostDetails();
      }

      //For Due Date
      this.initialDueDate = this.formValues.dueDate;

      //For Payment Date Field
      this.manualPaymentDateReference = this.formValues.paymentDate;
      this.initialHasManualPaymentDate = this.formValues.hasManualPaymentDate;
    }
  }

  @Output() onInvoiceDetailsChanged = new EventEmitter<any>();

  //Default Values - strats
  constructor(
    private router: Router,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private invoiceService: InvoiceDetailsService,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private format: TenantFormattingService,
    private tenantSetting: TenantSettingsService,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    changeDetectorRef: ChangeDetectorRef,
    @Inject(DecimalPipe) private _decimalPipe,
    private tenantService: TenantFormattingService,
    private titleService: Title,
    private toastr: ToastrService,
    public urlService: UrlService,
    public appConfig: AppConfig,
    @Inject(MAT_DATE_FORMATS) private dateFormats,
    @Inject(NGX_MAT_DATE_FORMATS) private dateTimeFormats
  ) {
    super(changeDetectorRef);
    this.dateFormats.display.dateInput = this.format.dateFormat;
    this.dateFormats.parse.dateInput = this.format.dateFormat;
    this.dateTimeFormats.display.dateInput = this.format.dateFormat;
    CUSTOM_DATE_FORMATS.display.dateInput = this.format.dateFormat;
    PICK_FORMATS.display.dateInput = this.format.dateFormat;
    this.amountFormat =
      '1.' +
      this.tenantService.amountPrecision +
      '-' +
      this.tenantService.amountPrecision;
    // this.quantityFormat =
    //   '1.' +
    //   this.tenantService.quantityPrecision +
    //   '-' +
    //   this.tenantService.quantityPrecision;
    this.autocompletePaybleTo = knownMastersAutocomplete.payableTo;
    this.autocompleteCompany = knownMastersAutocomplete.company;
    this.autocompleteCarrier = knownMastersAutocomplete.company;
    this.autocompleteCustomer = knownMastersAutocomplete.customer;
    this.autocompletePaymentTerm = knownMastersAutocomplete.paymentTerm;
    this.dateFormat_rel_invoice = this.format.dateFormat
      .replace('DDD', 'ddd')
      .replace('dd/', 'DD/');
    this.setupGrid();
    this.setupGrid_related_invoice();
    this.setClaimsDetailsGrid();
  }

  ngOnInit(): void {
    this.formErrors = {};
    // Set deductions to 0 if null
    if (!this.formValues.invoiceSummary.deductions) {
      this.formValues.invoiceSummary.deductions = this.amountFormatValue(0);
    }

    this.entityName = 'Invoice';
    this.route.params.pipe().subscribe(params => {
      this.entityId = parseFloat(params.invoiceid);
      this.invoiceId = parseFloat(params.invoiceid);
    });
    this.route.data.subscribe(data => {
      this.staticLists = data.staticLists;
      this.tenantConfiguration = data.tenantConfiguration;
      this.uomList = this.setListFromStaticLists('Uom');
      this.productList = this.setListFromStaticLists('Product');
      this.currencyList = this.setListFromStaticLists('Currency');
      this.physicalSupplierList = this.setListFromStaticLists('Supplier');
      this.costTypeList = this.setListFromStaticLists('CostType');
      this.scheduleDashboardLabelConfiguration =
        data.scheduleDashboardLabelConfiguration;
      this.invoiceStatusList = this.setListFromStaticLists(
        'InvoiceCustomStatus'
      );
      this.paymentStatusList = this.setListFromStaticLists('PaymentStatus');
      if (typeof this.formValues.status != 'undefined') {
        if (this.formValues.status && this.formValues.status.name) {
          this.statusColorCode = this.getColorCodeFromLabels(
            this.formValues.status,
            this.scheduleDashboardLabelConfiguration
          );
        }
        // console.log(this.statusColorCode);
      }
      this.setChipDatas();
      this.setVisibilityAndPricingDateConfig();

      this.entityId = this.route.snapshot.params[
        KnownInvoiceRoutes.InvoiceIdParam
      ];
    });

    this.getPaymentTermList();
    this.getCompanyList();
    this.getCustomerList();
    this.getPaybleToList();

    this.getBankAccountNumber();
    this.buildProductDetilsGrid();

    this.legacyLookupsDatabase.getsInvoiceType().then(list => {
      // avoid preclaim credit/debit note invoice type selection
      this.invoiceTypeList = list.filter(x => x.id !== 6 && x.id !== 7);
    });
    this.dateFormat = this.format.dateFormat.replace('DDD', 'E');
    // this.getProductList();
    if (!this.formValues.paymentDate) {
      this.formValues.paymentDate = this.formValues.workingDueDate;
    }
  }

  getDebunkerCheckboxConfig() {
    const isVisible =
      this.manualtab[0].displayName === 'Credit' &&
      this.tenantConfiguration?.invoiceConfiguration?.isDebunker;

    const isMandatory = false;
    const isChecked =
      this.formValues.invoiceClaimDetails.length > 0 &&
      this.formValues.invoiceClaimDetails[0].claimType.name === 'Debunker';
    // Mandatory only if mandatory is true and visible is true;

    return {
      isVisible,
      isMandatory: isMandatory && isVisible,
      value: isChecked
    };
  }

  getInvoiceDateConfig() {
    const isVisible = !this.tenantConfiguration?.invoiceConfiguration
      ?.fieldVisibility?.isInvoiceDateHidden;

    const isMandatory = this.tenantConfiguration?.invoiceConfiguration
      ?.fieldVisibility?.isInvoiceDateMandatory;

    return { isVisible, isMandatory: isMandatory && isVisible };
  }

  getSupplierInvoiceNumberDateConfig() {
    const isVisible = !this.tenantConfiguration?.invoiceConfiguration
      ?.fieldVisibility?.isSupplierInvoiceNumberHidden;
    const isMandatory = this.tenantConfiguration?.invoiceConfiguration
      ?.fieldVisibility?.isSupplierInvoiceNumberMandatory;
    return { isVisible, isMandatory: isMandatory && isVisible };
  }

  getReceivedDateConfig() {
    const isVisible = !this.tenantConfiguration?.invoiceConfiguration
      ?.fieldVisibility?.isReceivedDateHidden;
    const isMandatory = this.tenantConfiguration?.invoiceConfiguration
      ?.fieldVisibility?.isReceivedDateMandatory;
    return { isVisible, isMandatory: isMandatory && isVisible };
  }

  getCustomerDateConfig() {
    const isVisible = !this.tenantConfiguration?.invoiceConfiguration
      ?.fieldVisibility?.isInvoiceCustomerHidden;
    const isMandatory = this.tenantConfiguration?.invoiceConfiguration
      ?.fieldVisibility?.isInvoiceCustomerMandatory;
    return { isVisible, isMandatory: isMandatory && isVisible };
  }

  getBankAccountNumberDateConfig() {
    const isVisible = !this.tenantConfiguration?.invoiceConfiguration
      ?.fieldVisibility?.isBankAccountNumberHidden;
    const isMandatory = this.tenantConfiguration?.invoiceConfiguration
      ?.fieldVisibility?.isBankAccountNumberMandatory;
    return { isVisible, isMandatory: isMandatory && isVisible };
  }

  isFormValid(configObject): any {
    let useToaster = configObject?.useToaster || false;
    let error = false;
    let errorMessage = '';
    this.formErrors = {};

    if (!this.formSubmitted) {
      return null;
    }

    // Bank Accound
    if (
      isEmpty(this.formValues.counterpartyDetails?.counterpartyBankAccount) &&
      this.getBankAccountNumberDateConfig().isMandatory
    ) {
      error = true;
      errorMessage += 'Bank account number is required. \n';
      this.formErrors.counterpartyDetails = {};
      this.formErrors.counterpartyDetails.counterpartyBankAccount = errorMessage;
    }

    // Delivery date
    if (!this.formValues.deliveryDate) {
      error = true;
      errorMessage += 'Delivery date is required. \n';
      this.formErrors.deliveryDate = errorMessage;
    }

    // Customer
    if (
      !this.formValues.counterpartyDetails?.customer &&
      this.getCustomerDateConfig().isMandatory
    ) {
      error = true;
      errorMessage += 'Customer is required. \n';
      if (!this.formErrors.counterpartyDetails) {
        this.formErrors.counterpartyDetails = {};
      }

      this.formErrors.counterpartyDetails.customer = errorMessage;
    }

    // Supplier Invoice number
    if (
      !this.formValues.sellerInvoiceNo &&
      this.getSupplierInvoiceNumberDateConfig().isMandatory
    ) {
      error = true;
      errorMessage += 'Supplier invoice number is required. \n';
      this.formErrors.sellerInvoiceNo = errorMessage;
    }

    // Invoice date
    if (
      !this.formValues.invoiceDate &&
      this.getInvoiceDateConfig().isMandatory
    ) {
      error = true;
      errorMessage += 'Invoice date is required. \n';
      this.formErrors.invoiceDate = errorMessage;
    }

    // Recived date
    if (
      !this.formValues.receivedDate &&
      this.getReceivedDateConfig().isMandatory
    ) {
      error = true;
      errorMessage += 'Recived date is required. \n';
      this.formErrors.receivedDate = errorMessage;
    }

    // Due date
    if (!this.formValues.dueDate) {
      error = true;
      errorMessage += 'Due date is required. \n';
      this.formErrors.dueDate = errorMessage;
    }

    // Working due date
    if (!this.formValues.workingDueDate) {
      error = true;
      errorMessage += 'Working due date is required. \n';
      this.formErrors.workingDueDate = errorMessage;
    }

    // Payment term
    if (!this.formValues.counterpartyDetails?.paymentTerm?.name) {
      error = true;
      errorMessage += 'Payment term is required. \n';
      this.formErrors.counterpartyDetails = {};
      this.formErrors.counterpartyDetails.paymentTerm = {};
      this.formErrors.counterpartyDetails.paymentTerm.name = errorMessage;
    }

    // Payment company
    if (!this.formValues.orderDetails?.paymentCompany?.name) {
      error = true;
      errorMessage += 'Payment company is required. \n';
      this.formErrors.orderDetails = {};
      this.formErrors.orderDetails.paymentCompany = {};
      this.formErrors.orderDetails.paymentCompany.name = errorMessage;
    }

    if (useToaster && errorMessage) {
      this.toastrService.error(errorMessage);
    }

    this.changeDetectorRef.detectChanges();
    return !error; // Is form valid?
  }

  summaryCalculationsForProductDetails() {
    if (this.formValues.productDetails) {
      for (let i = 0; i < this.formValues.productDetails.length; i++) {
        this.invoiceConvertUom('product', i);
      }
    }
  }

  summaryCalculationsForCostDetails() {
    if (this.formValues.costDetails) {
      for (let i = 0; i < this.formValues.costDetails.length; i++) {
        if (
          this.formValues.costDetails[i] &&
          (this.formValues.costDetails[i].costType.name == 'Range' ||
            this.formValues.costDetails[i].costType.name == 'Total')
        ) {
          this.getRangeTotalAmount(this.formValues.costDetails[i], i);
        } else {
          this.invoiceConvertUomCost('cost', i);
        }
      }
    }
  }

  getRangeTotalAmount(additionalCost, rowIndex) {
    if (!additionalCost.locationAdditionalCostId) {
      return;
    }

    if (
      !(
        additionalCost.costType.name == 'Range' ||
        additionalCost.costType.name == 'Total'
      )
    ) {
      return;
    }

    if (!additionalCost.invoiceQuantity) {
      return;
    }

    let payload = {
      Payload: {
        Order: null,
        Filters: [
          {
            ColumnName: 'ProductId',
            Value: additionalCost.product
              ? additionalCost.product.productId
              : null
          },
          {
            ColumnName: 'LocationId',
            Value: this.formValues.orderDetails.portId
              ? this.formValues.orderDetails.portId
              : null
          },
          {
            ColumnName: 'AdditionalCostId',
            Value: additionalCost.locationAdditionalCostId
              ? additionalCost.locationAdditionalCostId
              : null
          },
          {
            ColumnName: 'Qty',
            Value: additionalCost.invoiceQuantity
          },
          {
            ColumnName: 'QtyUomId',
            Value: additionalCost.invoiceQuantityUom
              ? additionalCost.invoiceQuantityUom.id
              : null
          }
        ],
        Pagination: {
          Skip: 0,
          Take: 25
        },
        SearchText: null
      }
    };

    this.invoiceService
      .getRangeTotalAdditionalCosts(payload)
      .pipe(
        finalize(() => {
          //this.spinner.hide();
        })
      )
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          // console.log(response);
          additionalCost.invoiceRate = this.quantityFormatValue(response.price);
          this.invoiceConvertUomCost('cost', rowIndex);
        }
      });
  }

  quantityFormatValue(value) {
    if (typeof value == 'undefined' || value == null) {
      return null;
    }
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    let number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if (this.tenantService.quantityPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.quantityFormat);
      }
    }
  }
  invoiceConvertUomCost(type, rowIndex) {
    // console.log(type);
    // console.log(rowIndex);
    let currentRowIndex = rowIndex;
    this.calculateGrand(this.formValues);
    this.type = type;
    if (this.type == 'cost') {
      this.old_cost = this.formValues.costDetails[currentRowIndex];
      if (this.formValues.costDetails[currentRowIndex].product) {
        if (this.formValues.costDetails[currentRowIndex].product.id == -1) {
          this.old_product = this.formValues.costDetails[
            currentRowIndex
          ].product.id;
        } else {
          this.old_product = this.formValues.costDetails[
            currentRowIndex
          ].product.productId;
        }
      }

      this.old_costType = this.formValues.costDetails[currentRowIndex].costType;
      if (this.old_product == -1) {
        this.formValues.costDetails[currentRowIndex].isAllProductsCost = true;
        if (typeof this.applyForList == 'undefined') {
          this.invoiceService
            .getApplyForList(this.formValues?.orderDetails?.order.id)
            .pipe(
              finalize(() => {
                //this.spinner.hide();
              })
            )
            .subscribe((response: any) => {
              if (typeof response == 'string') {
                this.toastr.error(response);
              } else {
                // console.log(response);
                this.calculate(
                  this.old_cost,
                  response[1].id,
                  this.old_costType,
                  rowIndex
                );
              }
            });
        } else {
          if (this.formValues.productDetails[0]) {
            if (!this.formValues.productDetails[0].invoicedProduct) {
              return;
            }
          }
          this.calculate(
            this.old_cost,
            this.formValues.productDetails[0]
              ? this.formValues.productDetails[0].invoicedProduct.id
              : null,
            this.old_costType,
            rowIndex
          );
        }
      } else {
        this.calculate(
          this.old_cost,
          this.old_product,
          this.old_costType,
          rowIndex
        );
      }
    }
  }

  calculate(cost, product, costType, rowIndex) {
    this.cost = cost;
    this.product = product;
    this.costType = costType;
    // calculate extra
    if (!this.formValues.costDetails[rowIndex].invoiceExtras) {
      this.formValues.costDetails[rowIndex].invoiceExtras = 0;
    }
    let rateUom, quantityUom;
    if (this.cost.invoiceRateUom) {
      rateUom = this.cost.invoiceRateUom.id;
    } else {
      rateUom = null;
    }
    if (this.cost.invoiceQuantityUom) {
      quantityUom = this.cost.invoiceQuantityUom.id;
    } else {
      quantityUom = null;
    }
    if (this.costType) {
      if (this.costType.name == 'Percent' || this.costType.name == 'Flat') {
        rateUom = quantityUom;
      }
    }

    if (this.costType && this.costType.name == 'Flat') {
      this.formValues.costDetails[
        rowIndex
      ].invoiceAmount = this.cost.invoiceRate;
      this.formValues.costDetails[rowIndex].invoiceExtrasAmount =
        (this.formValues.costDetails[rowIndex].invoiceExtras / 100) *
        this.formValues.costDetails[rowIndex].invoiceAmount;
      this.formValues.costDetails[rowIndex].invoiceTotalAmount =
        parseFloat(this.formValues.costDetails[rowIndex].invoiceExtrasAmount) +
        parseFloat(this.formValues.costDetails[rowIndex].invoiceAmount);
      this.calculateGrand(this.formValues);
      return;
    }

    if (
      this.cost.locationAdditionalCostId &&
      this.costType &&
      (this.costType.name == 'Range' || this.costType.name == 'Total')
    ) {
      this.formValues.costDetails[
        rowIndex
      ].invoiceAmount = this.cost.invoiceRate;
      this.formValues.costDetails[rowIndex].invoiceExtrasAmount =
        (this.formValues.costDetails[rowIndex].invoiceExtras / 100) *
        this.formValues.costDetails[rowIndex].invoiceAmount;
      this.formValues.costDetails[rowIndex].invoiceTotalAmount =
        parseFloat(this.formValues.costDetails[rowIndex].invoiceExtrasAmount) +
        parseFloat(this.formValues.costDetails[rowIndex].invoiceAmount);
      this.calculateGrand(this.formValues);
      return;
    }

    this.getUomConversionFactorCost(
      this.product,
      1,
      quantityUom,
      rateUom,
      null,
      1,
      rowIndex
    );
  }

  getUomConversionFactorCost(
    ProductId,
    Quantity,
    FromUomId,
    ToUomId,
    contractProductId,
    orderProductId,
    rowIndex
  ) {
    let productId = ProductId;
    let quantity = Quantity;
    let fromUomId = FromUomId;
    let toUomId = ToUomId;
    let data = {
      Payload: {
        ProductId: productId,
        OrderProductId: orderProductId,
        Quantity: quantity,
        FromUomId: fromUomId,
        ToUomId: toUomId,
        ContractProductId: contractProductId ? contractProductId : null
      }
    };
    if (!productId || !toUomId || !fromUomId) {
      return;
    }
    if (toUomId == fromUomId) {
      let result = 1;
      if (this.costType) {
        if (this.costType.name == 'Unit') {
          this.formValues.costDetails[rowIndex].invoiceAmount =
            result * this.cost.invoiceRate * this.cost.invoiceQuantity;
        }

        this.formValues.costDetails[rowIndex].invoiceExtrasAmount =
          (this.formValues.costDetails[rowIndex].invoiceExtras / 100) *
          this.formValues.costDetails[rowIndex].invoiceAmount;
        this.formValues.costDetails[rowIndex].invoiceTotalAmount =
          parseFloat(
            this.formValues.costDetails[rowIndex].invoiceExtrasAmount
          ) + parseFloat(this.formValues.costDetails[rowIndex].invoiceAmount);
        this.formValues.costDetails[rowIndex].difference =
          parseFloat(this.formValues.costDetails[rowIndex].invoiceTotalAmount) -
          parseFloat(
            this.formValues.costDetails[rowIndex].estimatedTotalAmount
          );

        this.formValues.costDetails[rowIndex].deliveryProductId = this
          .formValues.costDetails[rowIndex].product.deliveryProductId
          ? this.formValues.costDetails[rowIndex].product.deliveryProductId
          : this.formValues.costDetails[rowIndex].deliveryProductId;
        // console.log('-----------------------',this.formValues.costDetails[rowIndex].deliveryProductId);
        // calculate grandTotal
        if (this.cost) {
          this.calculateCostRecon(rowIndex);
        }
        this.calculateGrand(this.formValues);
        this.changeDetectorRef.detectChanges();
      }
    }
    this.invoiceService
      .getUomConversionFactor(data)
      .pipe(finalize(() => {}))
      .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.toastr.error(result);
        } else {
          // console.log(result);
          if (this.costType) {
            if (this.costType.name == 'Unit') {
              this.formValues.costDetails[rowIndex].invoiceAmount =
                result * this.cost.invoiceRate * this.cost.invoiceQuantity;
            }

            this.formValues.costDetails[rowIndex].invoiceExtrasAmount =
              (this.formValues.costDetails[rowIndex].invoiceExtras / 100) *
              this.formValues.costDetails[rowIndex].invoiceAmount;
            this.formValues.costDetails[rowIndex].invoiceTotalAmount =
              parseFloat(
                this.formValues.costDetails[rowIndex].invoiceExtrasAmount
              ) +
              parseFloat(this.formValues.costDetails[rowIndex].invoiceAmount);
            this.formValues.costDetails[rowIndex].difference =
              parseFloat(
                this.formValues.costDetails[rowIndex].invoiceTotalAmount
              ) -
              parseFloat(
                this.formValues.costDetails[rowIndex].estimatedTotalAmount
              );

            this.formValues.costDetails[rowIndex].deliveryProductId = this
              .formValues.costDetails[rowIndex].product.deliveryProductId
              ? this.formValues.costDetails[rowIndex].product.deliveryProductId
              : this.formValues.costDetails[rowIndex].deliveryProductId;
            // console.log(
            //   '-----------------------',
            //   this.formValues.costDetails[rowIndex].deliveryProductId
            // );
            // calculate grandTotal
            if (this.cost) {
              this.calculateCostRecon(rowIndex);
            }
            this.calculateGrand(this.formValues);
            this.changeDetectorRef.detectChanges();
          }
        }
      });
  }

  calculateCostRecon(rowIndex) {
    if (!this.cost.estimatedRate || !this.cost.invoiceAmount) {
      return;
    }
    this.invoiceService
      .calculateCostRecon(this.cost)
      .pipe(finalize(() => {}))
      .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.toastr.error(result);
        } else {
          if (result == 1) {
            this.formValues.costDetails[rowIndex].reconStatus = {
              id: 1,
              name: 'Matched'
            };
          } else {
            this.formValues.costDetails[rowIndex].reconStatus = {
              id: 2,
              name: 'Unmatched'
            };
          }
          this.changeDetectorRef.detectChanges();
        }
      });
  }
  setVisibilityAndPricingDateConfig() {
    this.visibilityConfigs = this.tenantConfiguration?.invoiceConfiguration?.fieldVisibility;
    if (
      this.tenantConfiguration?.procurementConfiguration.price
        .pricingDateStopOption?.name == 'Invoice' &&
      this.tenantConfiguration?.procurementConfiguration.price
        .pricingEventDateManualOverrride?.name == 'Yes'
    ) {
      this.isPricingDateEditable = true;
    }
  }

  getBankAccountNumber() {
    if (!this.formValues.counterpartyDetails.payableTo) {
      return;
    }
    let counterPartyId = this.formValues.counterpartyDetails.payableTo.id;
    this.invoiceService
      .getBankAccountNumber(counterPartyId)
      .subscribe((result: any) => {
        // console.log(result);
        this.bankAccountNumbers = result;
        this.changeDetectorRef.detectChanges();
      });
  }

  invoiceConvertUom(type, rowIndex) {
    // console.log(type);
    // console.log(rowIndex);
    let currentRowIndex = rowIndex;
    this.calculateGrand(this.formValues);
    this.type = type;
    if (this.type == 'product') {
      let product = this.formValues.productDetails[currentRowIndex];
      if (
        typeof product.product != 'undefined' &&
        typeof product.invoiceQuantityUom != 'undefined' &&
        typeof product.invoiceRateUom !== 'undefined'
      ) {
        if (
          product.invoiceQuantityUom == null ||
          product.invoiceRateUom ==
            null /* || typeof(product.invoiceAmount) == 'undefined'*/
        ) {
          return;
        }
        this.getUomConversionFactor(
          product.product.id,
          1,
          product.invoiceQuantityUom.id,
          product.invoiceRateUom.id,
          product.contractProductId,
          product.orderProductId ? product.orderProductId : product.id,
          currentRowIndex
        );
        this.changeDetectorRef.detectChanges();
        this.eventsSubject5.next(this.formValues);
      }
      // recalculatePercentAdditionalCosts(formValues);
    }
  }

  getUomConversionFactor(
    ProductId,
    Quantity,
    FromUomId,
    ToUomId,
    contractProductId,
    orderProductId,
    currentRowIndex
  ) {
    let conversionFactor = 1;
    let productId = ProductId;
    let quantity = Quantity;
    let fromUomId = FromUomId;
    let toUomId = ToUomId;
    let data = {
      Payload: {
        ProductId: productId,
        OrderProductId: orderProductId,
        Quantity: quantity,
        FromUomId: fromUomId,
        ToUomId: toUomId,
        ContractProductId: contractProductId ? contractProductId : null
      }
    };
    if (toUomId == fromUomId) {
      conversionFactor = 1;
      this.formValues.productDetails[currentRowIndex].invoiceAmount =
        this.convertDecimalSeparatorStringToNumber(
          this.formValues.productDetails[currentRowIndex].invoiceQuantity
        ) *
        (this.convertDecimalSeparatorStringToNumber(
          this.formValues.productDetails[currentRowIndex].invoiceRate
        ) *
          conversionFactor);
      this.formValues.productDetails[currentRowIndex].difference =
        this.formValues.productDetails[currentRowIndex].invoiceAmount -
        this.formValues.productDetails[currentRowIndex].estimatedAmount;
      this.calculateGrand(this.formValues);
      if (this.formValues.productDetails[currentRowIndex]) {
        this.calculateProductRecon(
          this.formValues.productDetails[currentRowIndex]
        );
        this.changeDetectorRef.detectChanges();
      }
    }
    if (!productId || !toUomId || !fromUomId) {
      return;
    }

    this.invoiceService
      .getUomConversionFactor(data)
      .pipe(finalize(() => {}))
      .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.spinner.hide();
          this.toastr.error(result);
        } else {
          // console.log(result);
          conversionFactor = result;
          this.formValues.productDetails[currentRowIndex].invoiceAmount =
            this.convertDecimalSeparatorStringToNumber(
              this.formValues.productDetails[currentRowIndex].invoiceQuantity
            ) *
            (this.convertDecimalSeparatorStringToNumber(
              this.formValues.productDetails[currentRowIndex].invoiceRate
            ) *
              conversionFactor);
          this.formValues.productDetails[currentRowIndex].difference =
            this.formValues.productDetails[currentRowIndex].invoiceAmount -
            this.formValues.productDetails[currentRowIndex].estimatedAmount;
          this.calculateGrand(this.formValues);
          if (this.formValues.productDetails[currentRowIndex]) {
            this.calculateProductRecon(
              this.formValues.productDetails[currentRowIndex]
            );
            this.changeDetectorRef.detectChanges();
          }
        }
      });
  }

  calculateProductRecon(product) {
    if (!product.invoiceRateCurrency || !product.estimatedRateCurrency) {
      return false;
    }
    if (!product.invoiceRateCurrency.id || !product.estimatedRateCurrency.id) {
      return false;
    }
    this.invoiceService
      .calculateProductRecon(product)
      .pipe(finalize(() => {}))
      .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.spinner.hide();
          this.toastr.error(result);
        } else {
          if (result == 1) {
            product.reconStatus = {
              id: 1,
              name: 'Matched'
            };
          } else {
            product.reconStatus = {
              id: 2,
              name: 'Unmatched'
            };
          }
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  setTitle() {
    // 1.if request available, use request id
    if (this.formValues.requestInfo) {
      if (this.formValues.requestInfo.request) {
        let title = `Invoice - ${this.formValues.requestInfo.request.name} - ${this.formValues.requestInfo.vesselName}`;
        this.titleService.setTitle(title);
        return;
      }
    }

    // 2. else use order id
    if (this.formValues.orderDetails) {
      if (this.formValues.orderDetails.order) {
        let invoiceTitle = `Invoice - ${this.formValues.orderDetails.order.name} - ${this.formValues.orderDetails.vesselName}`;
        this.titleService.setTitle(invoiceTitle);
        return;
      }
    }

    // 3. use invoice name
    if (this.formValues.id) {
      let invoiceTitle = `Invoice - INV${this.formValues.id} - ${this.formValues.orderDetails.vesselName}`;
      this.titleService.setTitle(invoiceTitle);
    }
  }

  setInvoiceAmount() {
    let totalInvoiceAmount: any;
    this.formValues.productDetails.forEach((v, k) => {
      if (v.sapInvoiceAmount) {
        v.invoiceAmount = v.sapInvoiceAmount;
      } else {
        v.invoiceAmount = v.invoiceComputedAmount;
      }
      totalInvoiceAmount += v.invoiceAmount;
    });
    this.formValues.invoiceAmount = totalInvoiceAmount;
    // console.log(this.formValues.productDetails);
  }

  setListFromStaticLists(name) {
    let findList = _.find(this.staticLists, function(object) {
      return object.name == name;
    });
    if (findList != -1) {
      return findList?.items;
    }
  }

  private setupGrid() {
    this.gridOptions_ac = <GridOptions>{
      defaultColDef: {
        resizable: true,
        filtering: false,
        sortable: false
      },
      columnDefs: this.columnDef_aggrid_ac,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 35,
      rowHeight: 45,
      animateRows: false,

      onGridReady: params => {
        this.gridOptions_data.api = params.api;
        this.gridOptions_data.columnApi = params.columnApi;
        this.gridOptions_data.api.sizeColumnsToFit();
        this.gridOptions_data.api.setRowData(this.rowData_aggrid_ac);
        this.addCustomHeaderEventListener_AC(params);
      },
      onColumnResized: function(params) {
        if (
          params.columnApi.getAllDisplayedColumns().length <= 9 &&
          params.type === 'columnResized' &&
          params.finished === true &&
          params.source === 'uiColumnDragged'
        ) {
          params.api.sizeColumnsToFit();
        }
      },
      onColumnVisible: function(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 9) {
          params.api.sizeColumnsToFit();
        }
      }
    };
  }

  private columnDef_aggrid_pd = [
    {
      resizable: false,
      width: 30,
      suppressMenu: true,
      headerName: '',
      headerClass: ['aggridtextalign-center'],
      headerComponentParams: {
        template: `<span  unselectable="on">
             <div class="add-btn"></div>
             <span ref="eMenu"></span>`
      },
      cellClass: ['aggridtextalign-left'],
      cellRendererFramework: AGGridCellActionsComponent,
      cellRendererParams: { type: 'row-remove-icon' }
    },
    /* {
      children: [{headerName: 'Delivery No./ ', headerTooltip: 'Delivery No./ Order Product', field: 'del_no',
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: function(params) {
                  let keyData = params.value;
                  let newLink =
                  `<a href= "https://www.figma.com/proto/vdYj7vV3e5WCNVIxzpMkzA/Shiptech-Invoice-screen_Final?node-id=94%3A7895&scaling=min-zoom"
                  target="_blank">${keyData}</a>`;
                  return newLink;
              }
      },
      {
        headerName: 'Order Product', headerTooltip: 'Order Product', field: 'order_product'
      }]
    }, */
    {
      headerName: 'Delivery No. / Order Product',
      width: 250,
      headerTooltip: 'Delivery No. / Order Product',
      field: 'del_no',
      cellRendererFramework: AGGridCellActionsComponent,
      cellRendererParams: { type: 'border-cell' }
    },
    {
      children: [
        {
          headerName: 'Deliv Product',
          headerTooltip: 'Deliv Product',
          field: 'del_product',
          cellClass: 'border-padding-5 p-r-0',
          cellRendererFramework: AgGridCellStyleComponent,
          cellRendererParams: {
            cellClass: ['cell-bg-border'],
            label: 'div-in-cell'
          }
        },
        {
          headerName: 'Deliv. Qty',
          headerTooltip: 'Deliv. Qty',
          field: 'del_qty',
          cellClass: 'blue-opacity-cell pad-lr-0'
        },
        {
          headerName: 'Estd. Rate',
          editable: true,
          headerTooltip: 'Estd. Rate',
          field: 'est_rate',
          cellClass: 'blue-opacity-cell pad-lr-0'
        },
        {
          headerName: 'Amount',
          headerTooltip: 'Amount',
          field: 'amount1',
          cellClass: 'blue-opacity-cell pad-lr-5'
        }
      ]
    },
    {
      children: [
        {
          headerName: 'Invoice Product',
          headerTooltip: 'Invoice Product',
          field: 'inv_product',
          cellClass: 'border-padding-5 p-r-0',
          cellRendererFramework: AGGridCellActionsComponent,
          cellRendererParams: { type: 'dashed-border-dark' }
        },
        {
          headerName: 'Invoice Qty',
          headerTooltip: 'Invoice Qty',
          field: 'inv_qty',
          cellClass: 'blue-opacity-cell dark pad-lr-0',
          cellRendererFramework: AGGridCellActionsComponent,
          cellRendererParams: { type: 'dashed-border-darkcell' }
        },
        {
          headerName: 'Invoice Rate',
          headerTooltip: 'Invoice Rate',
          field: 'inv_rate',
          cellClass: 'blue-opacity-cell dark pad-lr-0',
          cellRendererFramework: AGGridCellActionsComponent,
          cellRendererParams: { type: 'dashed-border-darkcell' }
        },
        {
          headerName: 'Amount',
          headerTooltip: 'Amount',
          field: 'amount2',
          cellClass: 'blue-opacity-cell dark pad-lr-5'
        }
      ]
    },
    {
      headerName: 'Recon status',
      headerTooltip: 'Recon status',
      field: 'recon_status',
      cellRendererFramework: AGGridCellRendererComponent,
      cellRendererParams: function(params) {
        var classArray: string[] = [];
        classArray.push('aggridtextalign-center');
        let newClass =
          params.value === 'Unmatched'
            ? 'custom-chip-type1 red-chip'
            : params.value === 'Matched'
            ? 'custom-chip-type1 mediumgreen'
            : 'custom-chip-type1';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null };
      }
    },
    {
      headerName: 'Sulpher content',
      headerTooltip: 'Sulpher content',
      field: 'sulpher_content',
      cellRendererFramework: AGGridCellActionsComponent,
      cellRendererParams: { type: 'dashed-border' }
    },
    {
      headerName: 'Phy. suppier',
      headerTooltip: 'Phy. supplier',
      field: 'phy_supplier',
      width: 250,
      cellRendererFramework: AGGridCellActionsComponent,
      cellRendererParams: { type: 'dashed-border-with-expand' }
    }
  ];

  private columnDef_aggrid_ac = [
    {
      resizable: false,
      width: 30,
      suppressMenu: true,
      headerName: '',
      headerClass: ['aggridtextalign-center'],
      headerComponentParams: {
        template: `<span  unselectable="on">
             <div class="add-btn-ac"></div>
             <span ref="eMenu"></span>`
      },
      cellClass: ['aggridtextalign-left'],
      cellRendererFramework: AGGridCellActionsComponent,
      cellRendererParams: { type: 'row-remove-icon' }
    },
    {
      headerName: 'Item',
      editable: true,
      headerTooltip: 'Item',
      field: 'cost',
      cellRendererFramework: AGGridCellEditableComponent,
      cellRendererParams: {
        type: 'cell-edit-dropdown',
        label: 'cost-type',
        items: ['Pay', 'Receive']
      }
    },
    {
      headerName: 'Cost Type',
      headerTooltip: 'Cost Type',
      field: 'name',
      cellRendererFramework: AGGridCellEditableComponent,
      cellRendererParams: { type: 'cell-edit-autocomplete', label: 'cost-name' }
    },
    {
      headerName: '%of',
      headerTooltip: '% of',
      field: 'provider',
      cellRendererFramework: AGGridCellEditableComponent,
      cellRendererParams: {
        type: 'cell-edit-autocomplete',
        label: 'service-provider'
      }
    },
    {
      headerName: 'BDN Qty',
      editable: true,
      headerTooltip: 'BDN Qty',
      field: 'type',
      cellRendererFramework: AGGridCellEditableComponent,
      cellRendererParams: {
        type: 'cell-edit-dropdown',
        label: 'rate-type',
        items: ['Flat', 'Option 2']
      }
    },
    {
      headerName: 'Estd. Rate',
      headerTooltip: 'Estd. Rate',
      field: 'currency'
    },
    { headerName: 'Amount', headerTooltip: 'Amount', field: 'name' },
    { headerName: 'Extra %', headerTooltip: 'Extra %', field: 'name' },
    { headerName: 'ExtraAmt', headerTooltip: 'ExtraAmt', field: 'name' },
    { headerName: 'Amount', headerTooltip: 'Amount', field: 'name' },
    { headerName: 'Total', headerTooltip: 'Total', field: 'name' },
    { headerName: 'Invoice Qty', headerTooltip: 'Invoice Qty', field: 'name' },
    {
      headerName: 'Invoice Rate',
      headerTooltip: 'Invoice Rate',
      field: 'name'
    },
    { headerName: 'Amount', headerTooltip: 'Amount', field: 'name' },
    { headerName: 'Extra%', headerTooltip: 'Extra%', field: 'name' },
    { headerName: 'ExtraAmt', headerTooltip: 'ExtraAmt', field: 'name' },
    { headerName: 'Total', headerTooltip: 'Total', field: 'name' },
    { headerName: 'Difference', headerTooltip: 'Difference', field: 'name' }
  ];

  private columnDef_aggrid_claims = [
    { headerName: 'Claim ID', headerTooltip: 'Claim ID', field: 'claim.id' },
    {
      headerName: 'Delivery No',
      headerTooltip: 'Delivery No',
      field: 'delivery.id'
    },
    {
      headerName: 'Claim Type',
      headerTooltip: 'Claim Type',
      field: 'claimType.name'
    },
    { headerName: 'Product', headerTooltip: 'Product', field: 'product.name' },
    {
      headerName: 'Delivery Qty',
      headerTooltip: 'Delivery Quantity',
      field: 'deliveryQuantity'
    },
    {
      headerName: 'Invoice Amount',
      headerTooltip: 'Invoice Amount',
      field: 'invoiceAmount',
      editable: true,
      cellRendererFramework: AGGridCellEditableComponent,
      cellRendererParams: { type: 'dashed-border-with-expand' }
    },
    {
      headerName: 'Amount(order currency)',
      headerTooltip: ' Amount',
      field: 'baseInvoiceAmount'
    }
  ];

  public formValues: IInvoiceDetailsItemDto = {
    sellerInvoiceNo: 0,
    documentNo: 0,
    invoiceId: 0,
    documentType: <IInvoiceDetailsItemBaseInfo>{
      internalName: 'FinalInvoice'
    },
    canCreateFinalInvoice: false,
    receivedDate: '',
    dueDate: '',
    manualDueDate: '',
    accountNumber: 0,
    workingDueDate: '',
    sellerInvoiceDate: '',
    sellerDueDate: '',
    approvedDate: '',
    paymentDate: '',
    accountancyDate: '',
    invoiceRateCurrency: <IInvoiceDetailsItemBaseInfo>{},
    backOfficeComments: '',
    customStatus: '',
    status: <IInvoiceDetailsItemStatus>{},
    reconStatus: <IInvoiceDetailsItemStatus>{},
    deliveryDate: '',
    orderDeliveryDate: '',
    workflowId: '',
    invoiceChecks: <IInvoiceDetailsItemInvoiceCheck[]>[],
    invoiceAmount: 0,
    invoiceTotalPrice: 0,
    createdByUser: <IInvoiceDetailsItemBaseInfo>{ name: '' },
    createdAt: '',
    invoiceDate: '',
    lastModifiedByUser: <IInvoiceDetailsItemBaseInfo>{},
    lastModifiedAt: '',
    relatedInvoices: '',
    relatedInvoicesSummary: [],
    orderDetails: <IInvoiceDetailsItemOrderDetails>{},
    counterpartyDetails: <IInvoiceDetailsItemCounterpartyDetails>{
      paymentTerm: <IInvoiceDetailsItemBaseInfo>{ name: '' },
      payableTo: <IInvoiceDetailsItemBaseInfo>{ name: '' },
      counterpartyBankAccount: <any>{},
      customer: <any>{}
    },
    paymentDetails: <IInvoiceDetailsItemPaymentDetails>{},
    productDetails: <IInvoiceDetailsItemProductDetails[]>[],
    costDetails: [],
    invoiceClaimDetails: [],
    invoiceSummary: <IInvoiceDetailsItemInvoiceSummary>{},
    screenActions: <IInvoiceDetailsItemBaseInfo[]>[],
    requestInfo: <IInvoiceDetailsItemRequestInfo>{
      request: <IInvoiceDetailsItemBaseInfo>{ id: 0 }
    },
    isCreatedFromIntegration: false,
    hasManualPaymentDate: false,
    attachments: [],
    customNonMandatoryAttribute1: '',
    customNonMandatoryAttribute2: '',
    customNonMandatoryAttribute3: '',
    customNonMandatoryAttribute4: '',
    customNonMandatoryAttribute5: '',
    customNonMandatoryAttribute6: '',
    customNonMandatoryAttribute7: '',
    customNonMandatoryAttribute8: '',
    customNonMandatoryAttribute9: '',
    name: '',
    id: 0,
    isDeleted: false,
    modulePathUrl: '',
    clientIpAddress: '',
    userAction: ''
  };

  addCustomHeaderEventListener(params) {
    /*let addButtonElement = document.getElementsByClassName('add-btn');
    if(addButtonElement && addButtonElement.length > 0){
      addButtonElement[0].addEventListener('mouseover', (event) => {
        const dialogRef = this.dialog.open(ProductDetailsModalComponent, {
          width: '600px',
          data:  { orderId: this.formValues.orderDetails?.order?.id }
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result && result != 'close'){
            this.addrow(params,result);
          }
        });
        });

      addButtonElement[0].addEventListener('click', (event) => {
        // this.addrow(params);
      });
    }*/
  }

  addrow(param, details) {
    let value = details.data;
    // console.log('add btn');

    let productdetail = {
      del_no: { no: value.deliveryId, order_prod: value.invoicedProduct.name },
      del_product: value.product.name,
      del_qty: value.deliveryQuantity + ' ' + value.deliveryQuantityUom.name,
      est_rate: value.estimatedRate + ' ' + value.estimatedRateCurrency.code,
      amount1: value.estimatedAmount + ' ' + value.estimatedRateCurrency.code,
      inv_product: value.invoicedProduct.name,
      inv_qty: value.invoiceQuantity + ' ' + value.invoiceQuantityUom.name,
      inv_rate: value.invoiceRate + ' ' + value.estimatedRateCurrency.code, //invoiceRateCurrency
      amount2:
        value.invoiceComputedAmount + ' ' + value.estimatedRateCurrency.code,
      recon_status: value.reconStatus ? value.reconStatus.name : '',
      sulpher_content: value.sulphurContent,
      phy_supplier: value.physicalSupplierCounterparty.name
    };
    param.api.applyTransaction({
      add: [productdetail]
    });
  }

  addCustomHeaderEventListener_AC(params) {
    let addButtonElementAC = document.getElementsByClassName('add-btn-ac');
    addButtonElementAC[0].addEventListener('click', event => {
      var newItems = [{}];
      params.api.applyTransaction({
        add: newItems
      });
    });
  }

  buildProductDetilsGrid() {
    this.gridOptions_data = <GridOptions>{
      defaultColDef: {
        resizable: true,
        filtering: false,
        sortable: false
      },
      columnDefs: this.columnDef_aggrid_pd,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 35,
      rowHeight: 45,
      animateRows: false,
      masterDetail: true,

      onGridReady: params => {
        this.gridOptions_data.api = params.api;
        this.gridOptions_data.columnApi = params.columnApi;
        this.gridOptions_data.api.sizeColumnsToFit();
        this.gridOptions_data.api.setRowData(this.rowData_aggrid_pd);
        // this.addCustomHeaderEventListener(params);
      },

      onColumnResized: function(params) {
        if (
          params.columnApi.getAllDisplayedColumns().length <= 9 &&
          params.type === 'columnResized' &&
          params.finished === true &&
          params.source === 'uiColumnDragged'
        ) {
          params.api.sizeColumnsToFit();
        }
      },
      onColumnVisible: function(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 9) {
          params.api.sizeColumnsToFit();
        }
      }
    };
  }

  parseProductDetailData(productDetails: IInvoiceDetailsItemProductDetails[]) {
    for (let value of productDetails) {
      let productdetail = {
        del_no: {
          no: value.deliveryId,
          order_prod: value.invoicedProduct.name
        },
        del_product: value.product.name,
        del_qty: value.deliveryQuantity + ' ' + value.deliveryQuantityUom.name,
        est_rate: value.estimatedRate + ' ' + value.estimatedRateCurrency.code,
        amount1: value.estimatedAmount + ' ' + value.estimatedRateCurrency.code,
        inv_product: value.invoicedProduct.name,
        inv_qty: value.invoiceQuantity + ' ' + value.invoiceQuantityUom.name,
        inv_rate: value.invoiceRate + ' ' + value.invoiceRateCurrency.code,
        amount2:
          value.invoiceComputedAmount + ' ' + value.invoiceRateCurrency.code,
        recon_status: value.reconStatus ? value.reconStatus.name : '',
        sulpher_content: value.sulphurContent,
        phy_supplier: value.physicalSupplierCounterparty.name
      };
      this.rowData_aggrid_pd.push(productdetail);
    }
  }

  setOrderDetailsLables(orderDetails) {
    this.orderDetails.contents[0].value = orderDetails?.vesselName
      ? orderDetails?.vesselName
      : this.emptyStringVal;
    this.orderDetails.contents[1].value = orderDetails?.vesselCode
      ? orderDetails?.vesselCode
      : this.emptyStringVal;
    this.orderDetails.contents[2].value = orderDetails?.portName
      ? orderDetails?.portName
      : this.emptyStringVal;
    this.orderDetails.contents[3].value = orderDetails?.eta
      ? moment(orderDetails?.eta).format(
          this.format.dateFormat.replace('DDD', 'ddd').replace('dd/', 'DD/')
        )
      : this.emptyStringVal;

    this.formValues.orderDetails.frontOfficeComments =
      this.formValues.orderDetails.frontOfficeComments?.trim() == ''
        ? null
        : this.formValues.orderDetails.frontOfficeComments;
    this.formValues.backOfficeComments =
      this.formValues.backOfficeComments?.trim() == ''
        ? null
        : this.formValues.backOfficeComments;
    if (
      this.formValues.paymentDetails != undefined &&
      this.formValues.paymentDetails != null
    ) {
      this.formValues.paymentDetails.comments =
        this.formValues.paymentDetails?.comments?.trim() == ''
          ? null
          : this.formValues.paymentDetails?.comments;
    }
  }

  setcounterpartyDetailsLables(counterpartyDetails) {
    this.counterpartyDetails.contents[0].value = counterpartyDetails?.sellerName
      ? counterpartyDetails?.sellerName
      : this.emptyStringVal;
    this.counterpartyDetails.contents[1].value = counterpartyDetails?.brokerName
      ? counterpartyDetails?.brokerName
      : this.emptyStringVal;
  }

  setChipDatas() {
    var currencyCode = this.formValues.invoiceRateCurrency.code; // USD
    var emptyValue = `${this.amountFormatValue(0)} ${currencyCode}`; // 0.00 USD

    var ivs = this.formValues.invoiceSummary;
    this.chipData[0].Data = this.formValues.id?.toString();
    this.chipData[1].Data = this.formValues.status?.displayName
      ? this.formValues.status.displayName
      : this.emptyStringVal;
    this.chipData[1].statusColorCode = this.statusColorCode;

    if (ivs) {
      this.chipData[2].Data = ivs.invoiceAmountGrandTotal
        ? `${this.amountFormatValue(
            ivs.invoiceAmountGrandTotal?.toString()
          )} ${currencyCode}`
        : emptyValue;
      this.chipData[3].Data = ivs?.estimatedAmountGrandTotal
        ? `${this.amountFormatValue(
            ivs?.estimatedAmountGrandTotal.toString()
          )} ${currencyCode}`
        : emptyValue;
      this.chipData[4].Data = ivs?.totalDifference
        ? this.amountFormatValue(ivs?.totalDifference?.toString()) +
          ' ' +
          currencyCode
        : emptyValue;
      this.chipData[5].Data = ivs?.provisionalInvoiceNo
        ? ivs?.provisionalInvoiceNo?.toString()
        : '';
      this.chipData[6].Data = ivs?.provisionalInvoiceAmount
        ? this.amountFormatValue(ivs?.provisionalInvoiceAmount?.toString()) +
          ' ' +
          currencyCode
        : emptyValue;
      this.chipData[7].Data = ivs?.deductions
        ? this.amountFormatValue(ivs?.deductions?.toString()) +
          ' ' +
          currencyCode
        : emptyValue;
      this.chipData[8].Data = ivs?.netPayable
        ? this.amountFormatValue(ivs?.netPayable?.toString()) +
          ' ' +
          currencyCode
        : emptyValue;
    } else {
      this.formValues.invoiceSummary = <IInvoiceDetailsItemInvoiceSummary>{};
    }
    // commented out because on claim invoice save and load, there error : ViewDestroyedError: Attempt to use a destroyed view: detectChanges
    // setTimeout(() => {
    //     this.calculateGrand(this.formValues);
    // });
  }

  formatDateForBe(value) {
    if (value) {
      let beValue = `${moment(value).format('YYYY-MM-DDTHH:mm:ss')}+00:00`;
      return `${moment(value).format('YYYY-MM-DDTHH:mm:ss')}+00:00`;
    } else {
      return null;
    }
  }

  ngOnDestroy(): void {
    // this.invoiceService.getInvoicDetails().
  }

  public saveInvoiceDetails() {
    if (this.formSubmitted) {
      return;
    }
    this.spinner.show();
    this.formSubmitted = true;

    if (!this.isFormValid({ useToaster: true })) {
      this.formSubmitted = false;
      this.spinner.hide();
      return;
    }
    this.setAdditionalCostLine();
    let valuesForm = _.cloneDeep(this.formValues); //avoid error on ngModel of bankAccount
    if (
      this.formValues.counterpartyDetails.counterpartyBankAccount.id ==
        undefined ||
      this.formValues.counterpartyDetails.counterpartyBankAccount.id == 0
    ) {
      valuesForm.counterpartyDetails.counterpartyBankAccount = null;
    }
    if (
      !parseFloat(this.formValues?.id?.toString()) ||
      this.formValues.id == 0
    ) {
      // this.spinner.show();
      this.invoiceService.saveInvoice(valuesForm).subscribe((result: any) => {
        this.entityId = result;
        this.handleServiceResponse(result, 'Invoice saved successfully.');
      });
    } else {
      // this.spinner.show();
      this.invoiceService.updateInvoice(valuesForm).subscribe((result: any) => {
        this.handleServiceResponse(result, 'Invoice updated successfully.');
      });
    }
  }

  setAdditionalCostLine() {
    let validCostDetails = [];
    if (this.formValues.costDetails.length > 0) {
      this.formValues.costDetails.forEach((v, k) => {
        if (typeof v.product != 'undefined' && v.product != null) {
          if (v.product.id == -1) {
            v.product = null;
            v.deliveryProductId = null;
          } else {
            if (v.product.productId) {
              v.product.id = v.product.productId;
            }
            if (v.product.deliveryProductId) {
              v.deliveryProductId = v.product.deliveryProductId;
            }
            if (!v.product.productId) {
              v.product = null;
            }
            v.isAllProductsCost = false;
          }
        }
        if (
          (Boolean(v.id) && !(v.id == 0 && v.isDeleted)) ||
          (!v.Id && !v.isDeleted)
        ) {
          // v.isDeleted = false;
          validCostDetails.push(v);
        }
      });
    }
    // console.log(validCostDetails);
    this.formValues.costDetails = _.cloneDeep(validCostDetails);

    this.changeDetectorRef.detectChanges();
  }
  public openRequest() {
    //https://bvt.shiptech.com/#/edit-request/89053
  }

  handleServiceResponse(result: any, successMsg: string) {
    this.spinner.hide();
    this.formSubmitted = false;
    if (typeof result == 'string') {
      this.toastrService.error(result);
    } else {
      this.toastrService.success(successMsg);
      this.router
        .navigate([
          KnownPrimaryRoutes.Invoices,
          `${KnownInvoiceRoutes.InvoiceView}`,
          this.entityId
        ])
        .then(() => {});
      this.onInvoiceDetailsChanged.emit(true);
      this.changeDetectorRef.detectChanges();
    }
  }

  onModelChanged(evt) {}

  AC_valueChanges(type, event) {
    let eventValueObject = {
      id: event.id ? event.id : null,
      name: event.name ? event.name : null,
      internalName: event.internalName ? event.internalName : null,
      displayName: event.displayName ? event.displayName : null,
      code: event.code ? event.code : null,
      collectionName: event.collectionName ? event.collectionName : null,
      customNonMandatoryAttribute1: event.customNonMandatoryAttribute1
        ? event.customNonMandatoryAttribute1
        : null,
      isDeleted: event.isDeleted ? event.isDeleted : null,
      modulePathUrl: event.modulePathUrl ? event.modulePathUrl : null,
      clientIpAddress: event.clientIpAddress ? event.clientIpAddress : null,
      userAction: event.userAction ? event.userAction : null
    };
    if (type === 'company') {
      this.formValues.orderDetails.paymentCompany = eventValueObject;
      // this.formValues.orderDetails.paymentCompany.displayName = event.displayName ? event.displayName : event.name ? event.name : null;
      // this.formValues.orderDetails.paymentCompany.code = event.code ? event.code : '';
    } else if (type === 'carrier') {
      this.formValues.orderDetails.carrierCompany = eventValueObject;
      // this.formValues.orderDetails.carrierCompany.displayName = event.displayName ? event.displayName : '';
      // this.formValues.orderDetails.carrierCompany.code = event.code ? event.code : '';
    } else if (type === 'customer') {
      let res = isEmpty(eventValueObject) ? null : eventValueObject;
      this.formValues.counterpartyDetails.customer = res;
    } else if (type === 'payableto') {
      this.formValues.counterpartyDetails.payableTo = eventValueObject;
      this.formValues.counterpartyDetails.counterpartyBankAccount.id = 0;
      this.getBankAccountNumber();
    } else if (type === 'paymentterms') {
      this.formValues.counterpartyDetails.paymentTerm = eventValueObject;
    }
    // console.log('type',type,'evnt',event);
  }

  invoiceOptionSelected(option) {
    if (this.formSubmitted) {
      return;
    }
    this.spinner.show();
    this.formSubmitted = true;
    this.setAdditionalCostLine();
    let valuesForm = _.cloneDeep(this.formValues); //avoid error on ngModel of bankAccount
    if (
      this.formValues.counterpartyDetails.counterpartyBankAccount.id ==
        undefined ||
      this.formValues.counterpartyDetails.counterpartyBankAccount.id == 0
    ) {
      valuesForm.counterpartyDetails.counterpartyBankAccount = null;
    }
    if (option == 'submitreview') {
      this.invoiceService
        .submitForReview(this.formValues.id)
        .subscribe((result: any) => {
          this.handleServiceResponse(
            result,
            'Invoice submitted for review successfully.'
          );
        });
    } else if (option == 'submitapprove') {
      this.invoiceService
        .submitapproval(valuesForm)
        .subscribe((result: any) => {
          this.handleServiceResponse(
            result,
            'Invoice submitted for approval successfully.'
          );
        });
    } else if (option == 'cancel') {
      this.invoiceService
        .cancelInvoiceItem(this.formValues.id)
        .subscribe((result: any) => {
          this.handleServiceResponse(result, 'Invoice cancelled successfully.');
        });
    } else if (option == 'accept') {
      this.invoiceService
        .acceptInvoiceItem(this.formValues.id)
        .subscribe((result: any) => {
          this.handleServiceResponse(result, 'Invoice accepted successfully.');
        });
    } else if (option == 'revert') {
      this.invoiceService
        .revertInvoiceItem(this.formValues.id)
        .subscribe((result: any) => {
          this.handleServiceResponse(result, 'Invoice reverted successfully.');
        });
    } else if (option == 'reject') {
      this.invoiceService
        .rejectInvoiceItem(this.formValues.id)
        .subscribe((result: any) => {
          this.handleServiceResponse(result, 'Invoice rejected successfully.');
        });
    } else if (option == 'approve') {
      if (
        this.formValues.invoiceClaimDetails &&
        this.formValues.invoiceClaimDetails.length &&
        this.formValues.invoiceClaimDetails[0]['isPreclaimCN']
      ) {
        let claimsCN = false;
        this.formValues.relatedInvoices.forEach(element => {
          if (element.invoiceType.name == 'Pre-claim Credit Note') {
            claimsCN = true;
            return;
          }
        });
        if (!claimsCN) {
          this.spinner.hide();
          this.formSubmitted = false;
          this.toastr.error(
            "Invoice can't be approved when PreClaimCreditNote is not available."
          );
          return;
        }
      }
      this.invoiceService
        .approveInvoiceItem(valuesForm)
        .subscribe((result: any) => {
          this.handleServiceResponse(result, 'Invoice approved successfully.');
        });
    } else if (option == 'create') {
      this.spinner.hide();
      const dialogRef = this.dialog.open(InvoiceTypeSelectionComponent, {
        width: '400px',
        height: '230px',
        panelClass: 'popup-grid',
        data: {
          orderId: this.formValues.orderDetails?.order?.id,
          lists: this.invoiceTypeList
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.formSubmitted = false;
        if (result && result != 'close') {
          let createinvoice = this.invoiceTypeList.filter(x => {
            return x.id === result;
          });
          this.entityId = 0;
          this.formValues.documentType.id = createinvoice[0].id;
          this.formValues.documentType.name = createinvoice[0].name;

          localStorage.setItem(
            'createInvoice',
            JSON.stringify(this.formValues)
          );
          this.router
            .navigate([
              KnownPrimaryRoutes.Invoices,
              `${KnownInvoiceRoutes.InvoiceView}`,
              0
            ])
            .then(() => {});
          this.changeDetectorRef.detectChanges();
        }
      });
    }
  }

  setClaimsDetailsGrid() {
    this.gridOptions_claims = <GridOptions>{
      defaultColDef: {
        resizable: true,
        filtering: false,
        sortable: false
      },
      columnDefs: this.columnDef_aggrid_claims,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 35,
      rowHeight: 45,
      animateRows: false,
      masterDetail: true,
      onGridReady: params => {
        this.gridOptions_claims.api = params.api;
        this.gridOptions_claims.columnApi = params.columnApi;
        this.gridOptions_claims.api.sizeColumnsToFit();
        this.gridOptions_claims.api.setRowData(
          this.formValues.invoiceClaimDetails
        );
        // this.addCustomHeaderEventListener(params);
      },
      onColumnResized: function(params) {
        if (
          params.columnApi.getAllDisplayedColumns().length <= 9 &&
          params.type === 'columnResized' &&
          params.finished === true &&
          params.source === 'uiColumnDragged'
        ) {
          params.api.sizeColumnsToFit();
        }
      },
      onColumnVisible: function(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 9) {
          params.api.sizeColumnsToFit();
        }
      }
    };
  }

  getProductList() {
    let data: any = {
      Order: null,
      PageFilters: { Filters: [] },
      SortList: { SortList: [] },
      Filters: [{ ColumnName: 'Order_Id', Value: this.orderId }],
      SearchText: null,
      Pagination: {}
    };
    this.invoiceService
      .productListOnInvoice(data)
      .subscribe((response: any) => {
        if (response) {
          response.forEach(row => {
            this.productData.push({
              selected: false,
              product: row.product.name,
              deliveries: row.order.id,
              details: row
            });
          });
        }
      });
  }

  addnewProduct(event) {
    // console.log(event);
    var itemsToUpdate = [];
    this.gridOptions_data.api.forEachNodeAfterFilterAndSort(function(
      rowNode,
      index
    ) {
      if (index >= 1) {
        return;
      }
      var data = rowNode.data;

      // data.price = Math.floor(Math.random() * 20000 + 20000);
      itemsToUpdate.push(data);
    });
    this.gridOptions_data.api.applyTransaction({
      update: itemsToUpdate
    });
  }

  openMoreButtons($event) {
    this.showMoreButtons = !this.showMoreButtons;
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
      if (this.tenantService.amountPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.amountFormat);
      }
    }
  }

  public updateAmountValues(changes: any): void {
    // this.setChipDatas();
    this.calculateGrand(this.formValues);
  }

  productDetailChanged(productDetails: any): void {
    this.formValues.productDetails = productDetails;
    this.calculateGrand(this.formValues);
  }

  claimDetailChanged(claimDetails: any): void {
    this.formValues.invoiceClaimDetails = claimDetails;
    this.calculateGrand(this.formValues);
  }

  changedAdditonalcost(event) {
    this.formValues.costDetails = event;
    this.calculateGrand(this.formValues);
  }
  calculateGrand(formValues) {
    if (!formValues.invoiceSummary) {
      formValues.invoiceSummary = null;
    }

    // formValues.invoiceSummary.provisionalInvoiceAmount = this.calculateprovisionalInvoiceAmount(formValues){}
    formValues.invoiceSummary.invoiceAmountGrandTotal = this.calculateInvoiceGrandTotal(
      formValues
    );
    formValues.invoiceSummary.invoiceAmountGrandTotal -=
      formValues.invoiceSummary.provisionalInvoiceAmount ?? 0;
    formValues.invoiceSummary.estimatedAmountGrandTotal = this.calculateInvoiceEstimatedGrandTotal(
      formValues
    );
    formValues.invoiceSummary.totalDifference =
      this.convertDecimalSeparatorStringToNumber(
        formValues.invoiceSummary.invoiceAmountGrandTotal
      ) -
      this.convertDecimalSeparatorStringToNumber(
        formValues.invoiceSummary.estimatedAmountGrandTotal
      );

    if (
      formValues.documentType.name === 'Credit Note' ||
      formValues.documentType.name === 'Pre-claim Credit Note'
    ) {
      formValues.invoiceSummary.netPayable =
        formValues.invoiceSummary.invoiceAmountGrandTotal * -1 -
        formValues.invoiceSummary.deductions;
    } else {
      formValues.invoiceSummary.netPayable =
        formValues.invoiceSummary.invoiceAmountGrandTotal -
        formValues.invoiceSummary.deductions;
    }

    this.changeDetectorRef.detectChanges();
    this.setChipDatas();
  }
  calculateInvoiceGrandTotal(formValues) {
    let grandTotal = 0;
    formValues.productDetails.forEach((v, k) => {
      if (!v.isDeleted && typeof v.invoiceAmount != 'undefined') {
        grandTotal =
          grandTotal +
          this.convertDecimalSeparatorStringToNumber(v.invoiceAmount);
      }
    });
    formValues.costDetails.forEach((v, k) => {
      if (!v.isDeleted) {
        if (typeof v.invoiceTotalAmount != 'undefined') {
          grandTotal =
            grandTotal +
            this.convertDecimalSeparatorStringToNumber(v.invoiceTotalAmount);
        }
      }
    });

    formValues.invoiceClaimDetails.forEach((v, k) => {
      if (typeof v.invoiceAmount != 'undefined') {
        grandTotal =
          grandTotal +
          this.convertDecimalSeparatorStringToNumber(v.invoiceAmount);
      }
    });
    return grandTotal;
  }

  calculateInvoiceEstimatedGrandTotal(formValues) {
    let grandTotal = 0;
    formValues.productDetails.forEach((v, k) => {
      if (!v.isDeleted && typeof v.estimatedAmount != 'undefined') {
        grandTotal = grandTotal + v.estimatedAmount;
      }
    });
    formValues.costDetails.forEach((v, k) => {
      if (!v.isDeleted) {
        if (typeof v.estimatedAmount != 'undefined') {
          grandTotal = grandTotal + v.estimatedAmount;
        }
      }
    });
    return grandTotal;
  }

  calculateClaimInvoiceGrandTotal(formValues) {
    let grandTotal = 0;

    return grandTotal;
  }

  convertDecimalSeparatorStringToNumber(number) {
    var numberToReturn = number;
    var decimalSeparator, thousandsSeparator;
    if (typeof number == 'string') {
      if (number.indexOf(',') != -1 && number.indexOf('.') != -1) {
        if (number.indexOf(',') > number.indexOf('.')) {
          decimalSeparator = ',';
          thousandsSeparator = '.';
        } else {
          thousandsSeparator = ',';
          decimalSeparator = '.';
        }
        numberToReturn =
          parseFloat(
            number
              .split(decimalSeparator)[0]
              .replace(new RegExp(thousandsSeparator, 'g'), '')
          ) + parseFloat(`0.${number.split(decimalSeparator)[1]}`);
      } else {
        numberToReturn = parseFloat(number);
      }
    }
    if (isNaN(numberToReturn)) {
      numberToReturn = 0;
    }
    return parseFloat(numberToReturn);
  }
  updateCostDetails(data) {
    // console.log(data);
    this.eventsSubject.next(this.formValues);
  }

  additionalCostRemovedLine(data) {
    // console.log(data);
    this.saveInvoiceDetails();
  }

  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  ngAfterViewInit(): void {}

  displayFn(value): string {
    return value && value.name ? value.name : '';
  }

  getHeaderNameSelector(): string {
    return knowMastersAutocompleteHeaderName.payableTo;
  }

  getHeaderNameSelector1(): string {
    return knowMastersAutocompleteHeaderName.company;
  }

  getHeaderNameSelector2(): string {
    return knowMastersAutocompleteHeaderName.company;
  }

  getHeaderNameSelector3(): string {
    return knowMastersAutocompleteHeaderName.customer;
  }

  getHeaderNameSelector4(): string {
    return knowMastersAutocompleteHeaderName.paymentTerm;
  }

  selectorPaymentTermSelectionChange(selection: IOrderLookupDto): void {
    if (selection === null || selection === undefined) {
      this.formValues.counterpartyDetails.paymentTerm = null;
    } else {
      const obj = {
        id: selection.id,
        name: selection.name
      };
      this.formValues.counterpartyDetails.paymentTerm = obj;
      this.triggerChangeFieldsAppSpecific('PaymentTerm');
      this.changeDetectorRef.detectChanges();
    }
  }

  getPaymentTermList() {
    let payload = {
      Payload: {
        Order: null,
        PageFilters: {
          Filters: []
        },
        SortList: {
          SortList: []
        },
        Filters: [],
        SearchText: '',
        Pagination: {
          Skip: 0,
          Take: 25
        }
      }
    };

    this.invoiceService.getPaymentTermList(payload).subscribe((result: any) => {
      // console.log(result);
      this.paymentTermList = result;
      this.changeDetectorRef.detectChanges();
    });
  }

  public filterPaymentTermList() {
    if (this.formValues.counterpartyDetails.paymentTerm) {
      let filterValue = '';
      filterValue = this.formValues.counterpartyDetails.paymentTerm.name
        ? this.formValues.counterpartyDetails.paymentTerm.name.toLowerCase()
        : this.formValues.counterpartyDetails.paymentTerm.toLowerCase();
      if (this.paymentTermList) {
        const list = this.paymentTermList
          .filter((item: any) => {
            return item.name.toLowerCase().includes(filterValue.toLowerCase());
          })
          .splice(0, 10);
        // console.log(list);
        return list;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  setPaymentTerm(data) {
    this.formValues.counterpartyDetails.paymentTerm = {
      id: data.id,
      name: data.name
    };
    // console.log(this.formValues.counterpartyDetails.paymentTerm);
    this.triggerChangeFieldsAppSpecific('PaymentTerm');
    this.changeDetectorRef.detectChanges();
  }

  getCompanyList() {
    let payload = {
      Payload: {
        Order: null,
        PageFilters: {
          Filters: []
        },
        SortList: {
          SortList: []
        },
        Filters: [],
        SearchText: '',
        Pagination: {
          Skip: 0,
          Take: 25
        }
      }
    };

    this.invoiceService.getCompanyList(payload).subscribe((result: any) => {
      // console.log(result);
      this.companyList = result;
      this.changeDetectorRef.detectChanges();
    });
  }

  public filterCompanyList() {
    if (this.formValues.orderDetails.paymentCompany) {
      let filterValue = '';
      filterValue = this.formValues.orderDetails.paymentCompany.name
        ? this.formValues.orderDetails.paymentCompany.name.toLowerCase()
        : this.formValues.orderDetails.paymentCompany.toLowerCase();
      if (this.companyList) {
        const list = this.companyList
          .filter((item: any) => {
            return item.name.toLowerCase().includes(filterValue.toLowerCase());
          })
          .splice(0, 10);
        // console.log(list);
        return list;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  setPaymentCompany(data) {
    this.formValues.orderDetails.paymentCompany = {
      id: data.id,
      name: data.name
    };
    // console.log(this.formValues.orderDetails.paymentCompany);
    this.changeDetectorRef.detectChanges();
  }

  selectorCompanySelectionChange(selection: IOrderLookupDto): void {
    if (selection === null || selection === undefined) {
      this.formValues.counterpartyDetails.paymentTerm = null;
    } else {
      const obj = {
        id: selection.id,
        name: selection.name
      };
      this.formValues.orderDetails.paymentCompany = obj;
      this.changeDetectorRef.detectChanges();
    }
  }

  public filterCarrierList() {
    if (this.formValues.orderDetails.carrierCompany) {
      let filterValue = '';
      filterValue = this.formValues.orderDetails.carrierCompany.name
        ? this.formValues.orderDetails.carrierCompany.name.toLowerCase()
        : this.formValues.orderDetails.carrierCompany.toLowerCase();
      if (this.companyList) {
        const list = this.companyList
          .filter((item: any) => {
            return item.name.toLowerCase().includes(filterValue.toLowerCase());
          })
          .splice(0, 10);
        // console.log(list);
        return list;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  setCarrierCompany(data) {
    this.formValues.orderDetails.carrierCompany = {
      id: data.id,
      name: data.name
    };
    // console.log(this.formValues.orderDetails.carrierCompany);
    this.changeDetectorRef.detectChanges();
  }

  selectorCarrierSelectionChange(selection: IOrderLookupDto): void {
    if (selection === null || selection === undefined) {
      this.formValues.orderDetails.carrierCompany = null;
    } else {
      const obj = {
        id: selection.id,
        name: selection.name
      };
      this.formValues.orderDetails.carrierCompany = obj;
      this.changeDetectorRef.detectChanges();
    }
  }

  getCustomerList() {
    let payload = {
      Payload: {
        Order: null,
        PageFilters: {
          Filters: []
        },
        SortList: {
          SortList: []
        },
        Filters: [
          {
            ColumnName: 'CounterpartyTypes',
            Value: '4'
          }
        ],
        SearchText: '',
        Pagination: {
          Skip: 0,
          Take: 25
        }
      }
    };

    this.invoiceService.getCustomerList(payload).subscribe((result: any) => {
      // console.log(result);
      this.customerList = result;
      this.changeDetectorRef.detectChanges();
    });
  }

  public filterCustomerList() {
    if (this.formValues.counterpartyDetails.customer) {
      let filterValue = '';
      filterValue = this.formValues.counterpartyDetails.customer.name
        ? this.formValues.counterpartyDetails.customer.name.toLowerCase()
        : this.formValues.counterpartyDetails.customer.toLowerCase();
      if (this.customerList) {
        const list = this.customerList
          .filter((item: any) => {
            return item.name.toLowerCase().includes(filterValue.toLowerCase());
          })
          .splice(0, 10);
        // console.log(list);
        return list;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  selectorCustomerSelectionChange(selection: IOrderLookupDto): void {
    if (selection === null || selection === undefined) {
      this.formValues.counterpartyDetails.customer = null;
    } else {
      const obj = {
        id: selection.id,
        name: selection.name
      };
      this.formValues.counterpartyDetails.customer = obj;
      this.changeDetectorRef.detectChanges();
    }
  }

  setCustomer(data) {
    this.formValues.counterpartyDetails.customer = {
      id: data.id,
      name: data.name
    };
    // console.log(this.formValues.counterpartyDetails.customer);
    this.changeDetectorRef.detectChanges();
  }

  getPaybleToList() {
    let payload = {
      Payload: {
        Order: null,
        PageFilters: {
          Filters: []
        },
        SortList: {
          SortList: []
        },
        Filters: [
          {
            ColumnName: 'CounterpartyTypes',
            Value: '2, 11'
          }
        ],
        SearchText: '',
        Pagination: {
          Skip: 0,
          Take: 25
        }
      }
    };

    this.invoiceService.getPaybleToList(payload).subscribe((result: any) => {
      // console.log(result);
      this.paybleToList = result;
      this.changeDetectorRef.detectChanges();
    });
  }

  public filterPaybleToList() {
    if (this.formValues.counterpartyDetails.payableTo) {
      let filterValue = '';
      filterValue = this.formValues.counterpartyDetails.payableTo.name
        ? this.formValues.counterpartyDetails.payableTo.name.toLowerCase()
        : this.formValues.counterpartyDetails.payableTo.toLowerCase();
      if (this.paybleToList) {
        const list = this.paybleToList
          .filter((item: any) => {
            return item.name.toLowerCase().includes(filterValue.toLowerCase());
          })
          .splice(0, 10);
        // console.log(list);
        return list;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  selectorPaybleToSelectionChange(selection: IOrderLookupDto): void {
    if (selection === null || selection === undefined) {
      this.formValues.counterpartyDetails.payableTo = null;
    } else {
      const obj = {
        id: selection.id,
        name: selection.name
      };
      this.formValues.counterpartyDetails.payableTo = obj;
      this.changeDetectorRef.detectChanges();
    }
  }

  setPaybleTo(data) {
    this.formValues.counterpartyDetails.payableTo = {
      id: data.id,
      name: data.name
    };
    // console.log(this.formValues.counterpartyDetails.payableTo);
    this.changeDetectorRef.detectChanges();
  }

  getColorCodeFromLabels(statusObj, labels) {
    if(labels){
        for (let i = 0; i < labels.length; i++) {
            if (statusObj) {
                if (
                statusObj.id === labels[i].id &&
                statusObj.transactionTypeId === labels[i].transactionTypeId
                ) {
                return labels[i].code;
                }
            }
        }
    }
  }

  compareObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  triggerChangeFieldsAppSpecific(name: string) {
    let dueDate = this.formValues.dueDate;
    switch (name) {
      case 'DueDate':
        if (this.initialDueDate) {
          if (this.initialDueDate.split('T')[0] != this.formValues.dueDate) {
            this.formValues.manualDueDate = this.formValues.dueDate;
          } else {
            this.formValues.manualDueDate = null;
          }
        } else {
          this.formValues.manualDueDate = this.formValues.dueDate;
        }
        if (parseFloat(dueDate.split('-')[0]) < 1753) {
          return;
        }
        this.invoiceService
          .getWorkingDueDate(dueDate)
          .pipe(finalize(() => {}))
          .subscribe((response: any) => {
            if (typeof response == 'string') {
              this.toastr.error(response);
            } else {
              this.formValues.workingDueDate = response;
              if (!this.initialHasManualPaymentDate) {
                this.formValues.hasManualPaymentDate = false;
                this.formValues.paymentDate = response;
                this.manualPaymentDateReference = this.formValues.paymentDate;
              }
              this.changeDetectorRef.detectChanges();
            }
          });
        break;
      case 'PaymentDate':
        // if (!this.initialHasManualPaymentDate) {
        //   this.formValues.hasManualPaymentDate = false;
        //   if (this.manualPaymentDateReference) {
        //     if (
        //       this.manualPaymentDateReference.split('T')[0] !=
        //       this.formValues.paymentDate.split('T')[0]
        //     ) {
        //       this.formValues.hasManualPaymentDate = true;
        //     }
        //   }
        // }
        this.formValues.hasManualPaymentDate = true;
        break;
      case 'InvoiceRateCurrency':
        this.formValues.productDetails.forEach(element => {
          element.invoiceRateCurrency = this.formValues.invoiceRateCurrency;
        });
        this.formValues.costDetails.forEach(element => {
          element.invoiceRateCurrency = this.formValues.invoiceRateCurrency;
        });
        this.formValues.invoiceClaimDetails.forEach(element => {
          element.invoiceAmountCurrency = this.formValues.invoiceRateCurrency;
        });
        this.setChipDatas();
        break;
      case 'PaymentTerm':
      case 'DeliveryDate':
        if (!this.formValues.id || this.formValues.id == 0) {
          break;
        }
        let payload = {
          InvoiceId: this.formValues.id,
          PaymentTermId: this.formValues.counterpartyDetails.paymentTerm.id,
          InvoiceDeliveryDate: this.formValues.deliveryDate,
          ManualDueDate: this.formValues.manualDueDate
        };

        this.invoiceService
          .getDueDateWithoutSave(payload)
          .pipe(finalize(() => {}))
          .subscribe((response: any) => {
            if (typeof response == 'string') {
              this.toastr.error(response);
            } else {
              this.formValues.dueDate = response.dueDate;
              if (!this.initialHasManualPaymentDate) {
                this.formValues.paymentDate = response.paymentDate;
                this.manualPaymentDateReference = this.formValues.paymentDate;
              }
              this.formValues.workingDueDate = response.workingDueDate;
            }
          });
        break;
    }
  }

  setupGrid_related_invoice() {
    this.gridOptions_rel_invoice = <GridOptions>{
      enableColResize: true,
      defaultColDef: {
        resizable: true,
        filtering: false,
        sortable: false
      },
      columnDefs: this.columnDef_aggrid_rel_invoice,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 35,
      rowHeight: 35,
      getRowClass: params => {
        // Make invoice amount text red if the type is Credit Note or Pre-Claim Credit Note
        if (
          params.node.data.type === 'Credit Note' ||
          params.node.data.type === 'Pre-claim Credit Note'
        ) {
          return ['related-invoice-red-text'];
        }
      },
      animateRows: false,
      onGridReady: params => {
        this.gridOptions_rel_invoice.api = params.api;
        this.gridOptions_rel_invoice.columnApi = params.columnApi;
        this.gridOptions_rel_invoice.api.setPinnedBottomRowData(
          this.totalrowData
        );
        this.gridOptions_rel_invoice.api.setRowData(
          this.rowData_aggrid_rel_invoice
        );
        this.gridOptions_rel_invoice.api.sizeColumnsToFit();
        // params.api.sizeColumnsToFit();
      },
      onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
      },

      onColumnResized: function(params) {
        if (
          params.columnApi.getAllDisplayedColumns().length <= 8 &&
          params.type === 'columnResized' &&
          params.finished === true &&
          params.source === 'uiColumnDragged'
        ) {
          params.api.sizeColumnsToFit();
        }
      },
      onColumnVisible: function(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8) {
          params.api.sizeColumnsToFit();
        }
      }
    };
  }

  private columnDef_aggrid_rel_invoice = [
    {
      headerName: 'Invoice ID',
      headerTooltip: 'Invoice ID',
      field: 'id',
      width: 100,
      cellClass: ['aggridlink aggridtextalign-center'],
      headerClass: ['aggrid-text-align-c']
    },
    {
      headerName: 'Order number',
      headerTooltip: 'Order number',
      field: 'order-number',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Invoice Type',
      headerTooltip: 'Invoice Type',
      field: 'type'
    },
    {
      headerName: 'Invoice Date',
      headerTooltip: 'Invoice Date',
      field: 'date',
      width: 150
    },
    {
      headerName: 'Invoice Amt',
      headerTooltip: 'Invoice Amt',
      field: 'amount',
      width: 150
    },
    {
      headerName: 'Deductions',
      headerTooltip: 'Deductions',
      field: 'deductions',
      width: 150
    },
    {
      headerName: 'Paid Amount',
      headerTooltip: 'Paid Amount',
      field: 'paid',
      width: 150
    },
    {
      headerName: 'Invoice status',
      headerTooltip: 'Invoice status',
      field: 'status',
      cellRendererFramework: AGGridCellRendererComponent,
      cellRendererParams: function(params) {
        var classArray: string[] = [];
        classArray.push('aggridtextalign-center');
        let newClass =
          params.value === 'Reverted' || params.value === 'Discrepancy'
            ? 'custom-chip-type1 red-chip'
            : params.value === 'Approved'
            ? 'custom-chip-type1 mediumgreen'
            : params.value === 'New'
            ? 'custom-chip-type1 dark'
            : 'custom-chip-type1';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null };
      }
    }
  ];

  onCellClicked(params) {
    if (params.colDef.field === 'id' && !params.rowPinned) {
      this.openEditInvoice(params.data.id);
    }
  }

  openEditInvoice(invoiceId: number): void {
    window.open(
      this.urlService.editInvoice(invoiceId),
      this.appConfig.openLinksInNewTab ? '_blank' : '_self'
    );
  }

  compareCurrencyObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }
}
