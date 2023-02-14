import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { ContractNegotiationService } from 'libs/feature/contract-negotiation/src/lib/services/contract-negotiation.service'
import moment from 'moment';
import _ from 'lodash';
import { SearchFormulaPopupComponent } from '../search-formula-popup/search-formula-popup.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ContractNegotiationStoreModel } from '../../../../../feature/contract-negotiation/src/lib/store/contract-negotiation.store';

import {
  ComplexFormula, DateRangeDto, EventBasedContinuousDto, EventBasedExtendDto, EventBasedSimpleDto, FormValues, HolidayRuleDto, OfferPriceFormulaDto,
  PricingScheduleDto,
  PricingScheduleOptionDateRange, PricingScheduleOptionEventBasedContinuous, PricingScheduleOptionEventBasedExtended, PricingScheduleOptionEventBasedSimple, PricingScheduleOptionSpecificDate, SystemInstrumentDto, SystemInstruments
} from './pricing-details.interface';
import { first, switchMap, tap } from 'rxjs/operators';
import { ContractRequest } from 'libs/feature/contract-negotiation/src/lib/store/actions/ag-grid-row.action';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';
import { CustomDateAdapter, CustomNgxDatetimeAdapter, CUSTOM_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS_1, PICK_FORMATS } from '@shiptech/core/utils/dateTime.utils';
import {
  NgxMatDateAdapter,
  NGX_MAT_DATE_FORMATS
} from '@angular-material-components/datetime-picker';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-pricing-details',
  templateUrl: './nego-pricing-details.component.html',
  styleUrls: ['./nego-pricing-details.component.css'],
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
export class negoPricingDetailsComponent implements OnInit {
  formulaFlatPercentageList: any;
  formulaPlusMinusList: any;
  marketPriceList: any;
  systemInstumentList: any;
  uomList: any;
  hasInvoicedOrder;
  staticList: any;
  currencyList: any;
  formulaOperationList: any;
  formulaFunctionList: any;
  marketPriceTypeList: any;
  businessCalendarList: any;
  eventList: any;
  formulaEventIncludeList: any;
  pricingSchedulePeriodList: any;
  dayOfWeekList: any;
  holidayRuleList: any;
  quantityTypeList: any;
  productList: any;
  enterFormula: any;
  sessionFormulaList: any;
  locationList: any;
  formulaTypeList: any;
  formulaNameList: any = [];
  public comment: string = '';
  expressType1: string;
  expressType: string = '';
  formValues: FormValues;
  public selectedFormulaTab = 'Pricing formula';
  formulaValue: any = '';
  showFormula: any;
  formulaDesc: any;
  rules: any = 1;
  public initialized = 1;
  pricingScheduleList: any;
  list: any;
  entityName: string;
  formulaId: number;
  scheduleId: number;
  requestOfferId: number;
  priceConfigurationId: number;
  offerPriceFormulaId: number;
  evaluatedFormulaPrice: any;
  productId: number;
  massUom: any;
  uomVolumeList: any;
  defaultConversionRate: number;
  defaultConversionVolumeUomId: number;
  isComplexFormulaWeightEnforced: boolean;
  checkRequestStatus: boolean = false;
  public maxContractPeriodOptions = [
    {"id": 1, "name": "3 month"},
    {"id": 2, "name": "6 months"},
    {"id": 3, "name": "9 months"},
    {"id": 4, "name": "12 months"},   
  ];
  additionalCost: number;
  constructor(
    public dialogRef: MatDialogRef<negoPricingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private spotNegotiationService: SpotNegotiationService,
    private contractNegotiationService:ContractNegotiationService,
    public format: TenantFormattingService,
    public legacylookup: LegacyLookupsDatabase,
    private store: Store,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    @Inject(MAT_DATE_FORMATS) private dateFormats,
    @Inject(NGX_MAT_DATE_FORMATS) private dateTimeFormats
  ) {
    iconRegistry.addSvgIcon('data-picker-gray', sanitizer.bypassSecurityTrustResourceUrl('../../assets/customicons/calendar-dark.svg'));
    this.requestOfferId = data.contractRequestOfferId;
    this.offerPriceFormulaId = data.offerPriceFormulaId;
    this.productId = data.productId;  
    this.dateFormats.display.dateInput = this.format.dateFormat;
    this.dateFormats.parse.dateInput = this.format.dateFormat;
    this.dateTimeFormats.display.dateInput = this.format.dateFormat;
    CUSTOM_DATE_FORMATS.display.dateInput = this.format.dateFormat;
    PICK_FORMATS.display.dateInput = this.format.dateFormat;  

    this.store.selectSnapshot<any>((state: any) => {
      this.staticList = state.spotNegotiation.staticLists.otherLists;
      this.sessionFormulaList = state.spotNegotiation.formulaList;
      this.isComplexFormulaWeightEnforced = state.tenantSettings.general.defaultValues.isComplexFormulaWeightEnforced;     
    });
    
  
    let payload = {
      PageFilters: {
        Filters: []
      },
      Filters: [
        {
          ColumnName: 'ContractId',
          Value: null
        }
      ],
      SearchText: null,
      Pagination: {
        Skip: 0,
        Take: 9999
      }
    };
    const response =  this.spotNegotiationService.getContractFormulaList(payload)
    response.subscribe((data: any)=>{
      this.sessionFormulaList = data.payload;
    });

    this.getOfferPriceConfiguration();
  }

  getConversionFactor() {

    const payload = {
      ProductId: this.productId 
    };
    this.spotNegotiationService.getDefaultConversionFactor(payload).subscribe((res: any) => {
      this.massUom = res.payload.massUom;
      this.defaultConversionRate = this.formValues.conversionRate = res.payload.value;
      this.defaultConversionVolumeUomId = this.formValues.conversionVolumeUomId = res.payload.volumeUom.id;
    });
  }

  ngOnInit() {
    this.formulaFlatPercentageList = this.setListFromStaticLists('FormulaFlatPercentage');
    this.formulaPlusMinusList = this.setListFromStaticLists('FormulaPlusMinus');
    this.marketPriceList = this.setListFromStaticLists('MarketPriceType');
    this.systemInstumentList = this.setListFromStaticLists('SystemInstrument');
    this.uomList = this.setListFromStaticLists('Uom');
    this.currencyList = this.setListFromStaticLists('Currency');
    this.formulaOperationList = this.setListFromStaticLists('FormulaOperation');
    this.formulaFunctionList = this.setListFromStaticLists('FormulaFunction');
    this.marketPriceTypeList = this.setListFromStaticLists('MarketPriceType');
    this.businessCalendarList = this.setListFromStaticLists('BusinessCalendar');
    this.eventList = this.setListFromStaticLists('Event');
    this.uomVolumeList = this.setListFromStaticLists('UomVolume');
    this.formulaEventIncludeList = this.setListFromStaticLists('FormulaEventInclude');
    this.dayOfWeekList = this.setListFromStaticLists('DayOfWeek');
    this.holidayRuleList = this.setListFromStaticLists('HolidayRule');
    this.pricingSchedulePeriodList = this.setListFromStaticLists('PricingSchedulePeriod');
    this.quantityTypeList = this.setListFromStaticLists('QuantityType');
    this.productList = this.setListFromStaticLists('Product');
    this.locationList = this.setListFromStaticLists('Location');
    this.formulaTypeList = this.setListFromStaticLists('FormulaType');
    this.pricingScheduleList = this.setListFromStaticLists('PricingSchedule');

    // this.getConversionFactor();
  }

  setListFromStaticLists(name) {
    const findList = _.find(this.staticList, function (object: any) {
      return object.name == name;
    });
    if (findList != -1) {
      return findList?.items;
    }
  }

  setStaticLists(staticName) {
    const findList = this.list[staticName];
    return findList;
  }

  isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0;
  }

  setFormulaTypeSelected(id) {
    if (id == 2) {
      if (this.formValues.complexFormulaQuoteLines) {
        this.formValues.complexFormulaQuoteLines = [];
        this.formulaId = id;
      } else this.formulaId = id;
    }
    if (id == 1) {
      if (this.formValues.simpleFormula) {
        this.formValues.simpleFormula = {};
        this.formulaId = id;
      } else {
        this.formulaId = id;
      }
    }
  }

  setPricingType() {
    if (!this.formValues.pricingSchedule) {
      this.formValues.pricingSchedule = {};
    }
  }

  handleNullValues(formValues) {
    if (formValues.simpleFormula == null) {
      this.formValues.simpleFormula = {
        id: 0,
        amount: 0,
        flatPercentage: {
          id: 0,
          name: ''
        },
        isDeleted: true,
        plusMinus: {
          id: 0,
          name: ''
        },
        priceType: {
          id: 0,
          name: ''
        },
        systemInstrument: {
          id: 0,
          name: ' '
        },
        uom: {
          id: 0,
          isDeleted: false,
          name: ''
        }
      };
    }
    if (formValues.complexFormulaQuoteLines == null) {
      this.formValues.complexFormulaQuoteLines = [];
    }
  }

  setHolidayRules() {
    if (!this.formValues.formulaHolidayRules) {
      this.formValues.formulaHolidayRules = {};
      this.formValues.formulaHolidayRules.sundayHolidayRule = _.cloneDeep(this.holidayRuleList[0]);
      this.formValues.formulaHolidayRules.mondayHolidayRule = _.cloneDeep(this.holidayRuleList[0]);
      this.formValues.formulaHolidayRules.tuesdayHolidayRule = _.cloneDeep(this.holidayRuleList[0]);
      this.formValues.formulaHolidayRules.wednesdayHolidayRule = _.cloneDeep(this.holidayRuleList[0]);
      this.formValues.formulaHolidayRules.thursdayHolidayRule = _.cloneDeep(this.holidayRuleList[0]);
      this.formValues.formulaHolidayRules.fridayHolidayRule = _.cloneDeep(this.holidayRuleList[0]);
      this.formValues.formulaHolidayRules.saturdayHolidayRule = _.cloneDeep(this.holidayRuleList[0]);
    }
  }

  displayFn(value) {
    return value && value.name ? value.name : '';
  }

  SearchFormulaList(item: any) {
    //this.formulaNameList = this.sessionData.payload;
    if (item != null) {
      if (this.sessionFormulaList != null) {
        this.formulaNameList = this.sessionFormulaList
          .filter(e => {
            if (e.name.toLowerCase().includes(item.toLowerCase())) {
              return true;
            } else {
              return false;
            }
          })
          .splice(0, 7);
      } else {
        return;
      }
    }
  }

  addFormula(item: any) {
    let payload = item.id;
    this.spinner.show();
    this.spotNegotiationService.getMasterFormula(payload).subscribe((data: any) => {
      this.spinner.hide();
      data.payload?.complexFormulaQuoteLines
        .filter(item => item.systemInstruments.length < 3)
        .forEach(quote => {
          for (var i = 0; i < 3; i++) {
            var instrument = quote?.systemInstruments.length > 0 ? quote.systemInstruments[i] : null;
            quote.systemInstruments.push({
              marketPriceTypeId: instrument?.marketPriceTypeId?.id ? instrument.marketPriceTypeId.id : 0,
              systemInstrumentId: instrument.systemInstrument?.id ? instrument.systemInstrument.id : 0
            });
          }
        });

      this.formValues = data.payload;
      this.getConversionFactor();
      this.formValues.conversionRate = this.defaultConversionRate;
      this.formValues.conversionVolumeUomId = this.defaultConversionVolumeUomId;
      this.formulaDesc = data.payload?.name;
      this.formulaId = data.payload.formulaType?.id;
      this.scheduleId = data.payload.pricingSchedule?.id;
      this.handleNullValues(this.formValues);
    });
  }

  hideFormula() { }

  clearSchedules(id) {
    this.formValues.pricingScheduleOptionDateRange = undefined;
    this.formValues.pricingScheduleOptionSpecificDate = undefined;
    this.formValues.pricingScheduleOptionEventBasedSimple = undefined;
    this.formValues.pricingScheduleOptionEventBasedExtended = undefined;
    this.formValues.pricingScheduleOptionEventBasedContinuous = undefined;
    /* 
    4 = Date Range
    5 = Specific Dates 
    6 = Event Based simple
    7 = Event Based extended
    8 = Event Based Continuous
    */
    if (id == 4) {
      this.formValues.pricingScheduleOptionDateRange = {} as PricingScheduleOptionDateRange;
      this.formValues.pricingScheduleOptionDateRange.sundayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionDateRange.mondayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionDateRange.tuesdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionDateRange.wednesdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionDateRange.thursdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionDateRange.fridayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionDateRange.saturdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
    } else if (id == 5) {
      this.formValues.pricingScheduleOptionSpecificDate = {} as PricingScheduleOptionSpecificDate;
      this.formValues.pricingScheduleOptionSpecificDate.sundayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionSpecificDate.mondayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionSpecificDate.tuesdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionSpecificDate.wednesdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionSpecificDate.thursdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionSpecificDate.fridayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionSpecificDate.saturdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
    } else if (id == 6) {
      this.formValues.pricingScheduleOptionEventBasedSimple = {
        fromNoOfBusinessDaysBefore: '0',
        name: '',
        toNoOfBusinessDaysAfter: '0',
        fromBusinessCalendarId: { id: 1 },
        toBusinessCalendar: { id: 1 }
      };
      this.formValues.pricingScheduleOptionEventBasedSimple.sundayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedSimple.mondayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedSimple.tuesdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedSimple.wednesdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedSimple.thursdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedSimple.fridayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedSimple.saturdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
    } else if (id == 7) {
      this.formValues.pricingScheduleOptionEventBasedExtended = {
        fromNoOfBusinessDaysBefore: '0',
        toNoOfBusinessDaysAfter: '0',
        fromBusinessCalendar: { id: 1 },
        toBusinessCalendar: { id: 1 },
        excludeFromNoOfBusinessDaysBefore: undefined,
        excludeToNoOfBusinessDaysAfter: undefined
      };
      this.formValues.pricingScheduleOptionEventBasedExtended.sundayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedExtended.mondayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedExtended.tuesdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedExtended.wednesdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedExtended.thursdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedExtended.fridayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedExtended.saturdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
    } else if (id == 8) {
      this.formValues.pricingScheduleOptionEventBasedContinuous = {} as PricingScheduleOptionEventBasedContinuous;
      this.formValues.pricingScheduleOptionEventBasedContinuous.sundayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedContinuous.mondayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedContinuous.tuesdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedContinuous.wednesdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedContinuous.thursdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedContinuous.fridayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
      this.formValues.pricingScheduleOptionEventBasedContinuous.saturdayHolidayRule = _.cloneDeep(this.holidayRuleList[2]);
    }

    if (!this.formValues.formulaHolidayRules) {
      this.formValues.formulaHolidayRules = {};
      this.formValues.formulaHolidayRules.sundayHolidayRule = _.cloneDeep(this.holidayRuleList[1]);
      this.formValues.formulaHolidayRules.mondayHolidayRule = _.cloneDeep(this.holidayRuleList[1]);
      this.formValues.formulaHolidayRules.tuesdayHolidayRule = _.cloneDeep(this.holidayRuleList[1]);
      this.formValues.formulaHolidayRules.wednesdayHolidayRule = _.cloneDeep(this.holidayRuleList[1]);
      this.formValues.formulaHolidayRules.thursdayHolidayRule = _.cloneDeep(this.holidayRuleList[1]);
      this.formValues.formulaHolidayRules.fridayHolidayRule = _.cloneDeep(this.holidayRuleList[1]);
      this.formValues.formulaHolidayRules.saturdayHolidayRule = _.cloneDeep(this.holidayRuleList[1]);
    }
  }

  generateDate(dates: any) {
    let date = [];
    dates.forEach(val => {
      date.push({
        date: val.date,
        comment: val.comment,
        isDeleted: val.isDeleted
      });
    });
    return date;
  }

  generateSystemInstrumentForComplexFormula(systemInstruments: any) {
    let systemInstrumentList = [];
    systemInstruments.forEach(sys => {
      if (sys.systemInstrument) {
        systemInstrumentList.push({
          marketPriceTypeId: sys.marketPriceTypeId?.id ? sys.marketPriceTypeId.id : 0,
          systemInstrumentId: sys.systemInstrument?.id ? sys.systemInstrument.id : 0
        });
      }
    });

    return systemInstrumentList;
  }
  constructSimpleFormula(simpleFormula) {
    if (simpleFormula.systemInstrument === undefined) return null;
    let simplePayload = {
      systemInstrumentId: simpleFormula.systemInstrument?.id ? simpleFormula.systemInstrument.id : 0,
      marketPriceTypeId: simpleFormula.priceType.id ? simpleFormula.priceType.id : 0,
      formulaPlusMinusId: simpleFormula.plusMinus.id ? simpleFormula.plusMinus.id : 0,
      amount: simpleFormula.amount ? parseFloat(simpleFormula.amount.replace(/,/g, '')) : 0,
      formulaFlatPercentageId: simpleFormula.flatPercentage?.id ? simpleFormula.flatPercentage?.id : 0,
      uomId: simpleFormula.uom?.id ? simpleFormula.uom?.id : 0
    };
    return simplePayload;
  }
  constructComplexFormula(complexFormula) {
    if (!complexFormula || complexFormula.length <= 0) return null;
    let complexPayload = [];
    complexFormula.forEach(comp => {
      if (!comp.isDeleted) {
        complexPayload.push({
          id: comp.id ? comp.id : 0,
          amount: comp.amount,
          formulaFlatPercentageId: comp.formulaFlatPercentage?.id ? comp.formulaFlatPercentage?.id : 0,
          formulaFunctionId: comp.formulaFunction?.id ? comp.formulaFunction.id : 0,
          formulaOperationId: comp.formulaOperation.id ? comp.formulaOperation.id : 0,
          formulaPlusMinusId: comp.formulaPlusMinus.id ? comp.formulaPlusMinus.id : 0,
          weight: comp.weight,
          systemInstruments: this.generateSystemInstrumentForComplexFormula(comp.systemInstruments),
          uomId: comp.uom?.id
        });
      }
    });
    return complexPayload;
  }
  constructHolidayRule(holidayRules: any) {
    if (!holidayRules) return null;
    if (!holidayRules) {
      let holidayRule = {
        assumeHolidayOnInstruments: true,
        sundayHolidayRuleId: 0,
        mondayHolidayRuleId: 0,
        tuesdayHolidayRuleId: 0,
        wednesdayHolidayRuleId: 0,
        thursdayHolidayRuleId: 0,
        fridayHolidayRuleId: 0,
        saturdayHolidayRuleId: 0
      };
      return holidayRule;
    } else {
      let holidayRule = {
        assumeHolidayOnInstruments: holidayRules.assumeHolidayOnInstruments,
        sundayHolidayRuleId: holidayRules.sundayHolidayRule?.id ? holidayRules.sundayHolidayRule.id : 0,
        mondayHolidayRuleId: holidayRules.mondayHolidayRule?.id ? holidayRules.mondayHolidayRule.id : 0,
        tuesdayHolidayRuleId: holidayRules.tuesdayHolidayRule?.id ? holidayRules.tuesdayHolidayRule.id : 0,
        wednesdayHolidayRuleId: holidayRules.wednesdayHolidayRule?.id ? holidayRules.wednesdayHolidayRule.id : 0,
        thursdayHolidayRuleId: holidayRules.thursdayHolidayRule?.id ? holidayRules.thursdayHolidayRule.id : 0,
        fridayHolidayRuleId: holidayRules.fridayHolidayRule?.id ? holidayRules.fridayHolidayRule.id : 0,
        saturdayHolidayRuleId: holidayRules.saturdayHolidayRule?.id ? holidayRules.saturdayHolidayRule.id : 0
      };
      return holidayRule;
    }
  }

  constructFormulaPayload(formValues: any) {
    let formulaPayload = {
      formulaTypeId: formValues.formulaType?.id ? formValues.formulaType.id : 0,
      isMean: formValues.isMean,
      currencyId: formValues.currency?.id, //------------------------------Needs to replace----------------------
      simpleFormula: formValues.formulaType?.id === 1 ? this.constructSimpleFormula(formValues.simpleFormula) : null,
      complexFormulaQuoteLines: formValues.formulaType?.id === 2 ? this.constructComplexFormula(formValues.complexFormulaQuoteLines) : null,
      holidayRule: this.constructHolidayRule(formValues.formulaHolidayRules)
    };
    return formulaPayload;
  }

  constructSchedulePayload(formValues: any) {
    let schedulePayload = {
      pricingScheduleId: formValues.pricingSchedule.id
    } as PricingScheduleDto;
    (schedulePayload.dateRange = formValues.pricingSchedule.id === 4 ? this.constructDateRange(formValues.pricingScheduleOptionDateRange) : null),
      (schedulePayload.specificDate = formValues.pricingSchedule.id === 5 ? this.constructSpecificDate(formValues.pricingScheduleOptionSpecificDate) : null),
      (schedulePayload.eventBasedSimple = formValues.pricingSchedule.id === 6 ? this.constructEventBasedSimple(formValues.pricingScheduleOptionEventBasedSimple) : null),
      (schedulePayload.eventBasedExtended = formValues.pricingSchedule.id === 7 ? this.constructEventBasedExtended(formValues.pricingScheduleOptionEventBasedExtended) : null),
      (schedulePayload.eventBasedContinuous = formValues.pricingSchedule.id === 8 ? this.constructEventBasedContinuous(formValues.pricingScheduleOptionEventBasedContinuous) : null);
    return schedulePayload;
  }

  constructEventBasedContinuous(scheduleEventBasedContinuous: any) {
    if (!scheduleEventBasedContinuous) return null;
    let eventBasedContinuous = {
      assumeHolidayOnInstruments: scheduleEventBasedContinuous.assumeHolidayOnInstruments,
      sundayHolidayRuleId: scheduleEventBasedContinuous.sundayHolidayRule?.id ? scheduleEventBasedContinuous.sundayHolidayRule.id : 0,
      mondayHolidayRuleId: scheduleEventBasedContinuous.mondayHolidayRule?.id ? scheduleEventBasedContinuous.mondayHolidayRule.id : 0,
      tuesdayHolidayRuleId: scheduleEventBasedContinuous.tuesdayHolidayRule?.id ? scheduleEventBasedContinuous.tuesdayHolidayRule.id : 0,
      wednesdayHolidayRuleId: scheduleEventBasedContinuous.wednesdayHolidayRule?.id ? scheduleEventBasedContinuous.wednesdayHolidayRule.id : 0,
      thursdayHolidayRuleId: scheduleEventBasedContinuous.thursdayHolidayRule?.id ? scheduleEventBasedContinuous.thursdayHolidayRule.id : 0,
      fridayHolidayRuleId: scheduleEventBasedContinuous.fridayHolidayRule?.id ? scheduleEventBasedContinuous.fridayHolidayRule.id : 0,
      saturdayHolidayRuleId: scheduleEventBasedContinuous.saturdayHolidayRule?.id ? scheduleEventBasedContinuous.saturdayHolidayRule.id : 0,
      name: scheduleEventBasedContinuous.name,
      pricingSchedulePeriodId: scheduleEventBasedContinuous.period?.id ? scheduleEventBasedContinuous.period.id : 0,
      eventId: scheduleEventBasedContinuous.event.id ? scheduleEventBasedContinuous.event.id : 0,
      weekStartsOn: scheduleEventBasedContinuous.weekStartsOn.id ? scheduleEventBasedContinuous.weekStartsOn.id : 0
    };
    return eventBasedContinuous;
  }

  constructEventBasedExtended(scheduleEventBasedExtended: any) {
    if (!scheduleEventBasedExtended) return null;
    let eventBasedExtended = {
      assumeHolidayOnInstruments: scheduleEventBasedExtended.assumeHolidayOnInstruments,
      sundayHolidayRuleId: scheduleEventBasedExtended.sundayHolidayRule?.id ? scheduleEventBasedExtended.sundayHolidayRule.id : 0,
      mondayHolidayRuleId: scheduleEventBasedExtended.mondayHolidayRule?.id ? scheduleEventBasedExtended.mondayHolidayRule.id : 0,
      tuesdayHolidayRuleId: scheduleEventBasedExtended.tuesdayHolidayRule?.id ? scheduleEventBasedExtended.tuesdayHolidayRule.id : 0,
      wednesdayHolidayRuleId: scheduleEventBasedExtended.wednesdayHolidayRule?.id ? scheduleEventBasedExtended.wednesdayHolidayRule.id : 0,
      thursdayHolidayRuleId: scheduleEventBasedExtended.thursdayHolidayRule?.id ? scheduleEventBasedExtended.thursdayHolidayRule.id : 0,
      fridayHolidayRuleId: scheduleEventBasedExtended.fridayHolidayRule?.id ? scheduleEventBasedExtended.fridayHolidayRule.id : 0,
      saturdayHolidayRuleId: scheduleEventBasedExtended.saturdayHolidayRule.id ? scheduleEventBasedExtended.saturdayHolidayRule.id : 0,
      name: scheduleEventBasedExtended.name,
      fromNoOfBusinessDaysBefore: scheduleEventBasedExtended.fromNoOfBusinessDaysBefore,
      fromBusinessCalendarId: scheduleEventBasedExtended.fromBusinessCalendar?.id ? scheduleEventBasedExtended.fromBusinessCalendar.id : 0,
      toNoOfBusinessDaysAfter: scheduleEventBasedExtended.toNoOfBusinessDaysAfter,
      toBusinessCalendarId: scheduleEventBasedExtended.toBusinessCalendar?.id ? scheduleEventBasedExtended.toBusinessCalendar.id : 0,
      excludeFromNoOfBusinessDaysBefore: scheduleEventBasedExtended.excludeFromNoOfBusinessDaysBefore,
      excludeToNoOfBusinessDaysAfter: scheduleEventBasedExtended.excludeToNoOfBusinessDaysAfter,
      eventId: scheduleEventBasedExtended.event?.id ? scheduleEventBasedExtended.event.id : 0,
      isEventIncludedId: scheduleEventBasedExtended.isEventIncluded?.id ? scheduleEventBasedExtended.isEventIncluded.id : 0
    };
    return eventBasedExtended;
  }

  constructEventBasedSimple(scheduleEvenetBasedSimple: any) {
    if (!scheduleEvenetBasedSimple) return null;
    let eventBasedSimple = {
      assumeHolidayOnInstruments: scheduleEvenetBasedSimple.assumeHolidayOnInstruments,
      sundayHolidayRuleId: scheduleEvenetBasedSimple.sundayHolidayRule?.id ? scheduleEvenetBasedSimple.sundayHolidayRule.id : 0,
      mondayHolidayRuleId: scheduleEvenetBasedSimple.mondayHolidayRule?.id ? scheduleEvenetBasedSimple.mondayHolidayRule.id : 0,
      tuesdayHolidayRuleId: scheduleEvenetBasedSimple.tuesdayHolidayRule?.id ? scheduleEvenetBasedSimple.tuesdayHolidayRule.id : 0,
      wednesdayHolidayRuleId: scheduleEvenetBasedSimple.wednesdayHolidayRule.id ? scheduleEvenetBasedSimple.wednesdayHolidayRule.id : 0,
      thursdayHolidayRuleId: scheduleEvenetBasedSimple.thursdayHolidayRule?.id ? scheduleEvenetBasedSimple.thursdayHolidayRule.id : 0,
      fridayHolidayRuleId: scheduleEvenetBasedSimple.fridayHolidayRule?.id ? scheduleEvenetBasedSimple.fridayHolidayRule.id : 0,
      saturdayHolidayRuleId: scheduleEvenetBasedSimple.saturdayHolidayRule?.id ? scheduleEvenetBasedSimple.saturdayHolidayRule.id : 0,
      name: scheduleEvenetBasedSimple.name,
      fromNoOfBusinessDaysBefore: scheduleEvenetBasedSimple.fromNoOfBusinessDaysBefore,
      fromBusinessCalendarId: scheduleEvenetBasedSimple.fromBusinessCalendarId?.id ? scheduleEvenetBasedSimple.fromBusinessCalendarId.id : 0,
      toNoOfBusinessDaysAfter: scheduleEvenetBasedSimple.toNoOfBusinessDaysAfter,
      toBusinessCalendarId: scheduleEvenetBasedSimple.toBusinessCalendar?.id ? scheduleEvenetBasedSimple.toBusinessCalendar.id : 0,
      eventId: scheduleEvenetBasedSimple.event?.id ? scheduleEvenetBasedSimple.event.id : 0,
      isEventIncludedId: scheduleEvenetBasedSimple.isEventIncluded.id ? scheduleEvenetBasedSimple.isEventIncluded.id : 0
    };
    return eventBasedSimple;
  }

  constructSpecificDate(ScheduleSpecificDate: any) {
    if (!ScheduleSpecificDate) return null;
    let specificDate = {
      assumeHolidayOnInstruments: ScheduleSpecificDate.assumeHolidayOnInstruments,
      sundayHolidayRuleId: ScheduleSpecificDate.sundayHolidayRule?.id ? ScheduleSpecificDate.sundayHolidayRule.id : 0,
      mondayHolidayRuleId: ScheduleSpecificDate.mondayHolidayRule?.id ? ScheduleSpecificDate.mondayHolidayRule.id : 0,
      tuesdayHolidayRuleId: ScheduleSpecificDate.tuesdayHolidayRule?.id ? ScheduleSpecificDate.tuesdayHolidayRule.id : 0,
      wednesdayHolidayRuleId: ScheduleSpecificDate.wednesdayHolidayRule?.id ? ScheduleSpecificDate.wednesdayHolidayRule.id : 0,
      thursdayHolidayRuleId: ScheduleSpecificDate.thursdayHolidayRule?.id ? ScheduleSpecificDate.thursdayHolidayRule.id : 0,
      fridayHolidayRuleId: ScheduleSpecificDate.fridayHolidayRule?.id ? ScheduleSpecificDate.fridayHolidayRule.id : 0,
      saturdayHolidayRuleId: ScheduleSpecificDate.saturdayHolidayRule?.id ? ScheduleSpecificDate.saturdayHolidayRule.id : 0,
      name: ScheduleSpecificDate.name,
      allowsPricingOnHoliday: ScheduleSpecificDate.allowsPricingOnHoliday,
      dates: this.generateDate(ScheduleSpecificDate.dates)
    };
    return specificDate;
  }

  constructDateRange(scheduleDateRange: any) {
    if (!scheduleDateRange) return null;
    let dateRange = {
      assumeHolidayOnInstruments: scheduleDateRange.assumeHolidayOnInstruments,
      sundayHolidayRuleId: scheduleDateRange?.sundayHolidayRule?.id ? scheduleDateRange.sundayHolidayRule.id : 0,
      mondayHolidayRuleId: scheduleDateRange?.mondayHolidayRule?.id ? scheduleDateRange.mondayHolidayRule.id : 0,
      tuesdayHolidayRuleId: scheduleDateRange?.tuesdayHolidayRule?.id ? scheduleDateRange.tuesdayHolidayRule.id : 0,
      wednesdayHolidayRuleId: scheduleDateRange?.wednesdayHolidayRule?.id ? scheduleDateRange.wednesdayHolidayRule.id : 0,
      thursdayHolidayRuleId: scheduleDateRange?.thursdayHolidayRule?.id ? scheduleDateRange.thursdayHolidayRule.id : 0,
      fridayHolidayRuleId: scheduleDateRange?.fridayHolidayRule?.id ? scheduleDateRange.fridayHolidayRule.id : 0,
      saturdayHolidayRuleId: scheduleDateRange?.saturdayHolidayRule?.id ? scheduleDateRange.saturdayHolidayRule.id : 0,
      name: scheduleDateRange.name,
      validFrom: scheduleDateRange.from,
      validTo: scheduleDateRange.to,
      allowsPricingOnHoliday: scheduleDateRange.allowsPricingOnHoliday
    };
    return dateRange;
  }

  constructDiscountRulesQuantityBased(quantityDiscountRules: any) {
    if (!quantityDiscountRules) return null;
    let discountRulesQuantityBased = [];
    quantityDiscountRules.forEach(rules => {
      if (!rules.isDeleted) {
        discountRulesQuantityBased.push({
          plusMinusId: rules.plusMinus?.id ? rules.plusMinus?.id : 0,
          amount: rules.amount,
          flatPercentageId: rules.flatPercentage?.id ? rules.flatPercentage?.id : 0,
          uomId: rules.uom?.id ? rules.uom.id : 0,
          quantityTypeId: rules.quantityType?.id ? rules.quantityType.id : 0,
          quantityRangeFrom: rules.quantityRangeFrom.toString().replace(/,/g, ''),
          quantityRangeTo: rules.quantityRangeTo.toString().replace(/,/g, '')
        });
      }
    });
    return discountRulesQuantityBased;
  }

  constructDiscountRulesProductBased(productBased: any) {
    if (!productBased) return null;
    let discountRulesProductBased = [];
    productBased.forEach(rule => {
      if (!rule.isDeleted) {
        discountRulesProductBased.push({
          plusMinusId: rule.plusMinus?.id ? rule.plusMinus.id : 0,
          amount: rule.amount,
          flatPercentageId: rule.flatPercentage?.id ? rule.flatPercentage?.id : 0,
          uomId: rule.uom?.id ? rule.uom?.id : 0,
          productId: rule.product?.id ? rule.product.id : 0
        });
      }
    });
    return discountRulesProductBased;
  }

  constructLocationDiscount(locationDiscount: any) {
    if (!locationDiscount) return null;
    let discountruleLocationBased = [];
    locationDiscount.forEach(rule => {
      if (!rule.isDeleted) {
        discountruleLocationBased.push({
          plusMinusId: rule.plusMinus?.id ? rule.plusMinus.id : 0,
          amount: rule.amount,
          flatPercentageId: rule.flatPercentage?.id ? rule.flatPercentage?.id : 0,
          uomId: rule.uom?.id ? rule.uom.id : 0,
          locationId: rule.location?.id ? rule.location.id : 0
        });
      }
    });
    return discountruleLocationBased;
  }

  constructDiscountRules(discountRules: any) {
    let discountRulesList = {
      quantityDiscountRules: this.constructDiscountRulesQuantityBased(discountRules.quantityDiscountRules),
      productDiscountRules: this.constructDiscountRulesProductBased(discountRules.productDiscountRules),
      locationDiscountRules: this.constructLocationDiscount(discountRules.locationDiscountRules)
    };
    return discountRulesList;
  }

  constructPayload(formValues: any) {  
    let finalPayload = {};
    // for pricing Formula
    finalPayload = {
      id: this.offerPriceFormulaId ? this.offerPriceFormulaId : 0,
      requestOfferId: this.requestOfferId,
      name: formValues.name,
      maxContractPeriod: (formValues.maxContractPeriod)?formValues.maxContractPeriod:2,
      formula: this.constructFormulaPayload(formValues),
      schedule: formValues.pricingSchedule ? this.constructSchedulePayload(formValues) : null,
      discountRules: this.constructDiscountRules(formValues),
      conversionMassUomId: this.massUom?.id ? this.massUom.id : 0,
      conversionValue: formValues.conversionRate,
      conversionVolumeUomId: formValues.conversionVolumeUomId,
  
    };
    return finalPayload;
  }

  saveFormula() {
    if (!this.formValues.conversionRate) {
      this.toastr.error('Conversion Rate field is required.');
      return;
    }

    if (this.formValues.formulaType.id == 1) {
      if (!this.formValues.simpleFormula.systemInstrument) {
        this.toastr.error('System Instrument field is required in Simple Pricing formula.');
        return;
      }

      if (!this.formValues.simpleFormula.priceType) {
        this.toastr.error('Price Type field is required in Simple Pricing formula.');
        return;
      }

      if (!this.formValues.simpleFormula.plusMinus) {
        this.toastr.error('Premimum/Discount  field is required in Simple Pricing formula');
        return;
      }
      if (this.formValues.simpleFormula?.plusMinus.id != 3) {
        if (!this.formValues.simpleFormula.amount) {
          this.toastr.error('Amount  field is required in Simple Pricing formula');
          return;
        }
        if (!this.formValues.simpleFormula.flatPercentage) {
          this.toastr.error('Flat Percentage  field is required in Simple Pricing formula');
          return;
        }
        if (!this.formValues.simpleFormula.uom) {
          if (this.formValues?.simpleFormula?.flatPercentage?.name != 'Percentage') {
            this.toastr.error('UOM  field is required in Simple Pricing formula');
            return;
          }
        }
      }
    } else if (this.formValues.formulaType.id == 2) {
      let _length = this.formValues.complexFormulaQuoteLines.length;
      let totalWeight = 0;
      for (let i = 1; i <= _length; i++) {
        if (this.formValues.complexFormulaQuoteLines[i - 1]?.weight) {
          totalWeight += parseInt(this.formValues.complexFormulaQuoteLines[i - 1].weight.toString());
        }
        if (!this.formValues.complexFormulaQuoteLines[i - 1]?.systemInstruments[0]?.systemInstrument) {
          this.toastr.error('Instument1  field is required in Complex Pricing formula');
          return;
        }

        if (!this.formValues.complexFormulaQuoteLines[i - 1]?.systemInstruments[0]?.marketPriceTypeId) {
          this.toastr.error('Price Type  field is required in Complex Pricing formula');
          return;
        }

        if (!this.formValues.complexFormulaQuoteLines[i - 1]?.formulaPlusMinus) {
          this.toastr.error('Plus Minus field is required in in Complex Pricing formula');
          return;
        }

        if (this.formValues.complexFormulaQuoteLines[i - 1]?.formulaPlusMinus.id != 3) {
          if (!this.formValues.complexFormulaQuoteLines[i - 1]?.amount) {
            this.toastr.error('Amount field is required in Complex Pricing formula');
            return;
          }

          if (!this.formValues.complexFormulaQuoteLines[i - 1]?.formulaFlatPercentage || this.formValues.complexFormulaQuoteLines[i - 1]?.formulaFlatPercentage.id == 0) {
            this.toastr.error('FlatPercentage field is required in Complex Pricing formula');
            return;
          }

          if (!this.formValues.complexFormulaQuoteLines[i - 1]?.uom || this.formValues.complexFormulaQuoteLines[i - 1]?.uom.id == null) {
            // id = 2  is percentage
            if (this.formValues.complexFormulaQuoteLines[i - 1]?.formulaFlatPercentage.id != 2) {
              this.toastr.error('UOM field is required in Complex Pricing formula');
              return;
            }
          }
        }
      }
      if (this.isComplexFormulaWeightEnforced == true) {
        if (totalWeight != 100) {
          this.toastr.error('Complex Formula Weight Enforced so Weight should be restricted to 100 ');
          return;
        }
      }

    }

    if (this.formValues.pricingScheduleOptionDateRange != undefined) {
      if (!this.formValues.pricingScheduleOptionDateRange?.name) {
        this.toastr.error('Description is required in Pricing schedule Section -> Date Range Section');
        return;
      }
      if (!this.formValues.pricingScheduleOptionDateRange?.from) {
        this.toastr.error('From date  is required in Pricing schedule -> Date Range Section');
        return;
      }
      if (!this.formValues.pricingScheduleOptionDateRange?.to) {
        this.toastr.error('To date  is required in Pricing schedule -> Date Range Section');
        return;
      }
    }

    if (this.formValues.pricingScheduleOptionSpecificDate != undefined) {
      if (!this.formValues.pricingScheduleOptionSpecificDate?.name) {
        this.toastr.error('Description is required in Pricing schedule Section -> Specific Dates Section');
        return;
      }
      let errorCkeck = 0;
      if (!this.formValues.pricingScheduleOptionSpecificDate?.dates) {
        this.toastr.error('Add atleast one date in Pricing schedule -> Specific Dates Section');
        return;
      } else {
        this.formValues.pricingScheduleOptionSpecificDate.dates.some((data, index) => {
          if (!data?.date) {
            this.toastr.error('Date  is required in row ' + (index + 1) + ' in Pricing schedule -> Specific Dates Section');
            errorCkeck = 1;
          }
        });
      }
      if (errorCkeck == 1) {
        return;
      }
    }

    if (this.formValues.pricingScheduleOptionEventBasedSimple != undefined) {
      if (!this.formValues.pricingScheduleOptionEventBasedSimple?.name) {
        this.toastr.error('Description is required in Pricing schedule Section -> Event Based Simple Section');
        return;
      }
      this.formValues.pricingScheduleOptionEventBasedSimple.fromNoOfBusinessDaysBefore = this.formValues.pricingScheduleOptionEventBasedSimple.fromNoOfBusinessDaysBefore.toString();
      if (this.formValues.pricingScheduleOptionEventBasedSimple.fromNoOfBusinessDaysBefore == "" || this.formValues.pricingScheduleOptionEventBasedSimple.fromNoOfBusinessDaysBefore.length == 0) {
        this.toastr.error('From - (From No Of Business Days Before) field is required in Pricing schedule -> Event Based Simple Section');
        return;
      }
      this.formValues.pricingScheduleOptionEventBasedSimple.toNoOfBusinessDaysAfter = this.formValues.pricingScheduleOptionEventBasedSimple.toNoOfBusinessDaysAfter.toString();
      if (this.formValues.pricingScheduleOptionEventBasedSimple.toNoOfBusinessDaysAfter == "" || this.formValues.pricingScheduleOptionEventBasedSimple.toNoOfBusinessDaysAfter.length == 0) {
        this.toastr.error('To - (To No Of Business Days After) field is required in Pricing schedule -> Event Based Simple Section');
        return;
      }
      if (!this.formValues.pricingScheduleOptionEventBasedSimple?.event) {
        this.toastr.error('Event field is required in Pricing schedule -> Event Based Simple Section');
        return;
      }
      if (!this.formValues.pricingScheduleOptionEventBasedSimple?.isEventIncluded) {
        this.toastr.error('Where Event date field is required in Pricing schedule -> Event Based Simple Section');
        return;
      }
    }


    if (this.formValues.pricingScheduleOptionEventBasedExtended != undefined) {
      if (!this.formValues.pricingScheduleOptionEventBasedExtended?.name) {
        this.toastr.error('Description is required in Pricing schedule Section -> Event Based Extended Section');
        return;
      }
      this.formValues.pricingScheduleOptionEventBasedExtended.fromNoOfBusinessDaysBefore = this.formValues.pricingScheduleOptionEventBasedExtended.fromNoOfBusinessDaysBefore.toString();
      if (this.formValues.pricingScheduleOptionEventBasedExtended.fromNoOfBusinessDaysBefore == "" || this.formValues.pricingScheduleOptionEventBasedExtended.fromNoOfBusinessDaysBefore.length == 0) {
        this.toastr.error('From - (From No Of Business Days Before) field is required in Pricing schedule -> Event Based Extended Section');
        return;
      }
      this.formValues.pricingScheduleOptionEventBasedExtended.toNoOfBusinessDaysAfter = this.formValues.pricingScheduleOptionEventBasedExtended.toNoOfBusinessDaysAfter.toString();
      if (this.formValues.pricingScheduleOptionEventBasedExtended.toNoOfBusinessDaysAfter == "" || this.formValues.pricingScheduleOptionEventBasedExtended.toNoOfBusinessDaysAfter.length == 0) {
        this.toastr.error('To - (To No Of Business Days After) field is required in Pricing schedule -> Event Based Extended Section');
        return;
      }
      if (!this.formValues.pricingScheduleOptionEventBasedExtended?.event) {
        this.toastr.error('Event field is required in Pricing schedule -> Event Based Extended Section');
        return;
      }
      if (!this.formValues.pricingScheduleOptionEventBasedExtended?.isEventIncluded) {
        this.toastr.error('Where Event date field is required in Pricing schedule -> Event Based Extended Section');
        return;
      }
    }

    if (this.formValues.pricingScheduleOptionEventBasedContinuous != undefined) {
      if (!this.formValues.pricingScheduleOptionEventBasedContinuous?.name) {
        this.toastr.error('Description is required in Pricing schedule Section -> Event Based Continuous Section');
        return;
      }
      if (!this.formValues.pricingScheduleOptionEventBasedContinuous?.period) {
        this.toastr.error('Type - (Period) field is required in Pricing schedule -> Event Based Continuous Section');
        return;
      }
      if (!this.formValues.pricingScheduleOptionEventBasedContinuous?.event) {
        this.toastr.error('Average of the Event field is required in Pricing schedule -> Event Based Continuous Section');
        return;
      }
      if (!this.formValues.pricingScheduleOptionEventBasedContinuous?.weekStartsOn) {
        this.toastr.error('Where the Week Starts From field is required in Pricing schedule -> Event Based Continuous Section');
        return;
      }
    }


    let formulaPayload: any = this.constructPayload(this.formValues);

    if (!formulaPayload.name || formulaPayload.name === '') {
      this.toastr.error('Formula name field is required.');
      return;
    }
    if (!formulaPayload.formula.simpleFormula && !formulaPayload.formula.complexFormulaQuoteLines) {
      this.toastr.error('Either simple or complex formula quote lines are required.');
      return;
    }

    if (!formulaPayload.schedule || !formulaPayload.schedule.pricingScheduleId) {
      this.toastr.error('Atleast 1 pricing schedule option is required.');
      return;
    }
    var contractReq = JSON.parse(JSON.stringify(this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
      return state['contractNegotiation'].ContractRequest[0];
    })));
    if (formulaPayload.id == 0) {  
      this.spinner.show();
      this.contractNegotiationService
        .addNewFormulaPrice(formulaPayload, this.requestOfferId)
        .pipe(
          tap((res: any) => {
            if (!res || !res.id) {
              this.spinner.hide();
              this.toastr.error('Failed to save Formula. Please try again with valid data.');
              return;
            }
            this.requestOfferId = res.requestOfferId;
            this.offerPriceFormulaId = res.id;
            
          }),
        
        )
        .subscribe((item: any) => {
          this.spinner.hide();
          if (item.errors) {
            this.toastr.error('Failed to save Formula.');
            return;
          } else {
            this.toastr.success('Operatation completed Successfully.');          
           
            contractReq.locations.map( prod => {
              if(prod.data.length > 0){
                prod.data.map( req => {                
                    if(req.id == this.requestOfferId){                
                        req.isFormulaPricing = true;
                        req.offerPriceFormulaId = this.offerPriceFormulaId;                  
                        this.additionalCost = (req.aditionalCost)?req.aditionalCost:0
                        req.OfferPrice = (Math.random() * 1000) + (this.additionalCost);                      
                    }
                })
              }
            });          
            this.store.dispatch(new ContractRequest([contractReq]));
            //close popup with evaluated price item update
            this.closePopup();
          }
        });
    } else {
      this.spinner.show();
      this.contractNegotiationService
        .updateFormulaPrice(formulaPayload, this.requestOfferId, this.offerPriceFormulaId)       
        .subscribe((item: any) => {
          this.spinner.hide();
          if (item.errors) {
            this.toastr.error('Failed to Update formula');
            return;
          } else {
            this.toastr.success('Operation Completed Successfully');         
            //close popup with evaluated price item update
            let payload = {
              requestOfferId: this.requestOfferId,
              priceConfigurationId: this.offerPriceFormulaId
            };         
            contractReq.locations.map( prod => {
              if(prod.data.length > 0){
                prod.data.map( req => {                    
                    if(req.id == this.requestOfferId){                
                        req.isFormulaPricing = true;
                        req.offerPriceFormulaId = payload.priceConfigurationId;  
                    }
                })
              }
            });         
            this.store.dispatch(new ContractRequest([contractReq]));
            this.contractNegotiationService.callGridRedrawService();
            this.closePopup();
          }
        });
    }
  }

  closePopup() {
    this.dialogRef.close(this.evaluatedFormulaPrice);
  }

  searchFormula() {
    const dialogRef = this.dialog.open(SearchFormulaPopupComponent, {
      width: '80vw',
      height: 'auto',
      maxWidth: '95vw',
      panelClass: 'search-request-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != true) {
        this.formulaValue = result.data[0].name;
        return this.addFormula(result.data[0]);
      }
    });
  }

  clearInput() {
    this.formValues.name = '';
  }

  formatDate(date?: any) {
    if (date) {
      let currentFormat = this.format.dateFormat;
      let hasDayOfWeek;

      if (currentFormat.startsWith('DDD ')) {
        hasDayOfWeek = true;
        currentFormat = currentFormat.split('DDD ')[1];
      }
      if (currentFormat.endsWith('HH:mm')) {
        currentFormat = currentFormat.split('HH:mm')[0];
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

  closeDialog() {
    this.dialogRef.close();
  }

  getInstrumentNameById(instrumentId: number) {

    var instrumentName = '';
    if (instrumentId == 0) {
      return instrumentName;
    }
    if (this.systemInstumentList) {
      instrumentName = this.systemInstumentList.filter(item => item.id === instrumentId)[0].name;
    }
    return instrumentName;
  }

  getOfferPriceConfiguration() {
    this.formValues = {
      isEditable: true,
      formulaType: {},
      simpleFormula: {},
      maxContractPeriod : 2
    };
    this.formValues.complexFormulaQuoteLines = [];
    if (this.offerPriceFormulaId) {
      this.spinner.show();
      this.contractNegotiationService
        .getOfferPriceConfiguration(this.requestOfferId, this.offerPriceFormulaId)
        .pipe(first())
        .subscribe(response => {
          this.spinner.hide();
          this.constructUIFormValues(response as OfferPriceFormulaDto);
        });
    } else {
      this.getConversionFactor();
    }
  }

  getSystemInstruments(systemInstruments: SystemInstrumentDto[]) {
    var uiInstruments: SystemInstruments[] = [];
    systemInstruments.forEach(item => {
      uiInstruments.push({
        marketPriceTypeId: { id: item.marketPriceTypeId },
        systemInstrument: { id: item.systemInstrumentId, name: this.getInstrumentNameById(item.systemInstrumentId) }
      });
    });

    if (systemInstruments.length < 3) {
      for (var i = systemInstruments.length + 1; i <= 3; i++) {
        uiInstruments.push({
          marketPriceTypeId: { id: 0 },
          systemInstrument: { id: 0, name: '' }
        });
      }
  
    }

    return uiInstruments;
  }

  getHolidayRule(holidayRuleDto: HolidayRuleDto) {
    var scheduleOption = {
      name: holidayRuleDto.name,
      assumeHolidayOnInstruments: holidayRuleDto.assumeHolidayOnInstruments,
      sundayHolidayRule: { id: holidayRuleDto.sundayHolidayRuleId },
      mondayHolidayRule: { id: holidayRuleDto.mondayHolidayRuleId },
      tuesdayHolidayRule: { id: holidayRuleDto.tuesdayHolidayRuleId },
      wednesdayHolidayRule: { id: holidayRuleDto.wednesdayHolidayRuleId },
      thursdayHolidayRule: { id: holidayRuleDto.thursdayHolidayRuleId },
      fridayHolidayRule: { id: holidayRuleDto.fridayHolidayRuleId },
      saturdayHolidayRule: { id: holidayRuleDto.saturdayHolidayRuleId }
    };
    return scheduleOption;
  }

  getDateRange(scheduleDateRange: DateRangeDto) {
    var dateRangeOption = this.getHolidayRule(scheduleDateRange as HolidayRuleDto) as PricingScheduleOptionDateRange;
    (dateRangeOption.from = scheduleDateRange.validFrom), (dateRangeOption.to = scheduleDateRange.validTo), (dateRangeOption.allowsPricingOnHoliday = scheduleDateRange.allowsPricingOnHoliday);
    return dateRangeOption;
  }

  getSpecificDate(scheduleSpecificDate: any) {
    var scheduleOption = this.getHolidayRule(scheduleSpecificDate as HolidayRuleDto) as PricingScheduleOptionSpecificDate;
    scheduleOption = { ...scheduleOption, ...scheduleSpecificDate };
    return scheduleOption;
  }

  getEventBasedSimple(eventBasedSimple: EventBasedSimpleDto) {
    var scheduleOption = this.getHolidayRule(eventBasedSimple as HolidayRuleDto) as PricingScheduleOptionEventBasedSimple;
    scheduleOption.fromNoOfBusinessDaysBefore = eventBasedSimple.fromNoOfBusinessDaysBefore;
    scheduleOption.toNoOfBusinessDaysAfter = eventBasedSimple.toNoOfBusinessDaysAfter;
    scheduleOption.fromBusinessCalendarId = { id: eventBasedSimple.fromBusinessCalendarId };
    scheduleOption.toBusinessCalendar = { id: eventBasedSimple.toBusinessCalendarId };
    scheduleOption.event = { id: eventBasedSimple.eventId };
    scheduleOption.isEventIncluded = { id: eventBasedSimple.isEventIncludedId };
    return scheduleOption;
  }

  getEventBasedExtended(eventBasedExtended: EventBasedExtendDto) {
    var scheduleOption = this.getHolidayRule(eventBasedExtended as HolidayRuleDto) as PricingScheduleOptionEventBasedExtended;
    scheduleOption = { ...(this.getEventBasedSimple(eventBasedExtended) as PricingScheduleOptionEventBasedExtended) };
    scheduleOption.excludeFromNoOfBusinessDaysBefore = eventBasedExtended.excludeFromNoOfBusinessDaysBefore;
    scheduleOption.excludeToNoOfBusinessDaysAfter = eventBasedExtended.excludeToNoOfBusinessDaysAfter;
    return scheduleOption;
  }

  getEventBasedContinuous(eventBasedContinuous: EventBasedContinuousDto) {
    var scheduleOption = this.getHolidayRule(eventBasedContinuous as HolidayRuleDto) as PricingScheduleOptionEventBasedContinuous;
    scheduleOption.period = { id: eventBasedContinuous.pricingSchedulePeriodId };
    scheduleOption.event = { id: eventBasedContinuous.eventId };
    scheduleOption.name = eventBasedContinuous.name;
    scheduleOption.weekStartsOn = { id: eventBasedContinuous.weekStartsOn };
    return scheduleOption;
  }

  getQuantityDiscountRules(quantityRules: any) {
    quantityRules?.forEach(rule => {
      rule.plusMinus = this.formulaPlusMinusList.find(item => item.id === rule.plusMinusId);
      rule.flatPercentage = this.formulaFlatPercentageList.find(item => item.id === rule.flatPercentageId);
      rule.uom = this.uomList.find(item => item.id === rule.uomId);
      rule.quantityType = this.quantityTypeList.find(item => item.id === rule.quantityTypeId);
    });
    return quantityRules;
  }

  getProductDiscountRules(productRules: any) {
    productRules?.forEach(rule => {
      rule.plusMinus = this.formulaPlusMinusList.find(item => item.id === rule.plusMinusId);
      rule.flatPercentage = this.formulaFlatPercentageList.find(item => item.id === rule.flatPercentageId);
      rule.uom = this.uomList.find(item => item.id === rule.uomId);
      rule.product = this.productList.find(item => item.id === rule.productId);
    });
    return productRules;
  }
  getLocationDiscountRules(locationRules: any) {
    locationRules?.forEach(rule => {
      rule.plusMinus = this.formulaPlusMinusList.find(item => item.id === rule.plusMinusId);
      rule.flatPercentage = this.formulaFlatPercentageList.find(item => item.id === rule.flatPercentageId);
      rule.uom = this.uomList.find(item => item.id === rule.uomId);
      rule.location = this.locationList.find(item => item.id === rule.locationId);
    });
    return locationRules;
  }

  constructUIFormValues(priceConfig: OfferPriceFormulaDto) {
    this.formValues = {
      id: priceConfig.id,
      name: priceConfig.name,
      maxContractPeriod: priceConfig.maxContractPeriod,
      isEditable: true,
      formulaType: { id: priceConfig.formula.formulaTypeId },
      isMean: priceConfig.formula.isMean,
      currency: this.currencyList.find(item => item.id === priceConfig.formula.currencyId),
      pricingSchedule: { id: priceConfig.schedule.pricingScheduleId },
      pricingScheduleOptionDateRange: priceConfig.schedule.pricingScheduleId === 4 ? this.getDateRange(priceConfig.schedule.dateRange) : null,
      pricingScheduleOptionSpecificDate: priceConfig.schedule.pricingScheduleId === 5 ? this.getSpecificDate(priceConfig.schedule.specificDate) : null,
      pricingScheduleOptionEventBasedSimple: priceConfig.schedule.pricingScheduleId === 6 ? this.getEventBasedSimple(priceConfig.schedule.eventBasedSimple) : null,
      pricingScheduleOptionEventBasedExtended: priceConfig.schedule.pricingScheduleId === 7 ? this.getEventBasedExtended(priceConfig.schedule.eventBasedExtended) : null,
      pricingScheduleOptionEventBasedContinuous: priceConfig.schedule.pricingScheduleId === 8 ? this.getEventBasedContinuous(priceConfig.schedule.eventBasedContinuous) : null,
      formulaHolidayRules: priceConfig.formula.holidayRule ? this.getHolidayRule(priceConfig.formula.holidayRule) : null,
      quantityDiscountRules: this.getQuantityDiscountRules(priceConfig.discountRules?.quantityDiscountRules),
      productDiscountRules: this.getProductDiscountRules(priceConfig.discountRules?.productDiscountRules),
      locationDiscountRules: this.getLocationDiscountRules(priceConfig.discountRules?.locationDiscountRules)
    };

    if (priceConfig.formula.formulaTypeId === 1) {
      this.formValues.simpleFormula = {
        plusMinus: { id: priceConfig.formula.simpleFormula.formulaPlusMinusId },
        priceType: { id: priceConfig.formula.simpleFormula.marketPriceTypeId },
        systemInstrument: {
          id: priceConfig.formula.simpleFormula.systemInstrumentId,
          name: this.getInstrumentNameById(priceConfig.formula.simpleFormula.systemInstrumentId)
        },
        flatPercentage: {
          id: priceConfig.formula.simpleFormula.formulaFlatPercentageId
        },
        uom: { id: priceConfig.formula.simpleFormula.uomId },
        amount: priceConfig.formula.simpleFormula.amount
      };
    } else {
      var complexFormulaQuoteLines: ComplexFormula[] = [];
      priceConfig.formula.complexFormulaQuoteLines.forEach(quote => {
        complexFormulaQuoteLines.push({
          amount: quote.amount,
          formulaFlatPercentage: { id: quote.formulaFlatPercentageId },
          formulaOperation: { id: quote.formulaOperationId },
          formulaPlusMinus: { id: quote.formulaPlusMinusId },
          formulaFunction: { id: quote.formulaFunctionId },
          weight: quote.weight,
          uom: { id: quote.uomId },
          systemInstruments: this.getSystemInstruments(quote.systemInstruments)
        } as ComplexFormula);
      });

      this.formValues.complexFormulaQuoteLines = complexFormulaQuoteLines;
    }
    var uomMassList = this.setListFromStaticLists('UomMass');
    this.massUom = uomMassList.find(item => item.id === priceConfig.conversionMassUomId);
    this.formValues.conversionRate = priceConfig.conversionValue;
    this.formValues.conversionVolumeUomId = priceConfig.conversionVolumeUomId;
  }
  removeFromula() {
    this.formValues.formulaType.id = 0;
    this.formValues.name = '';
  }
}
