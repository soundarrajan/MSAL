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
import moment from 'moment';
import _ from 'lodash';
import { SearchFormulaPopupComponent } from '../search-formula-popup/search-formula-popup.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ComplexFormula, DateRangeDto, EventBasedContinuousDto, EventBasedExtendDto, EventBasedSimpleDto, FormValues, HolidayRuleDto, LocationDiscountRulesDto, OfferPriceFormulaDto,
   PricingScheduleOptionDateRange, PricingScheduleOptionEventBasedContinuous, PricingScheduleOptionEventBasedExtended, PricingScheduleOptionEventBasedSimple, 
   ProductDiscountRulesDto, 
   QuantityDiscountRulesDto, 
   SpecificDateDto, SystemInstrumentDto, SystemInstruments } from './spotnego-pricing-details.interface';
import { first, switchMap, tap } from 'rxjs/operators';
import { SetOfferPriceFormulaId } from 'libs/feature/spot-negotiation/src/lib/store/actions/ag-grid-row.action';

@Component({
  selector: 'app-spotnego-pricing-details',
  templateUrl: './spotnego-pricing-details.component.html',
  styleUrls: ['./spotnego-pricing-details.component.css']
})
export class SpotnegoPricingDetailsComponent implements OnInit {
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
  // formValues: any = {
  //   name: '',
  //   simpleFormula: {}
  // };
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
  productId : number;
  massUom: any;
  uomVolumeList: any;
  constructor(
    public dialogRef: MatDialogRef<SpotnegoPricingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private spotNegotiationService: SpotNegotiationService,
    public format: TenantFormattingService,
    public legacylookup: LegacyLookupsDatabase,
    private store: Store,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    iconRegistry.addSvgIcon(
      'data-picker-gray',
      sanitizer.bypassSecurityTrustResourceUrl(
        '../../assets/customicons/calendar-dark.svg'
      )
    );
    this.requestOfferId = data.requestOfferId;
    this.offerPriceFormulaId = data.offerPriceFormulaId;
    this.productId = data.productId;
    this.sessionFormulaList = JSON.parse(sessionStorage.getItem('formula'));
    this.store.selectSnapshot<any>((state: any) => {
      this.staticList = state.spotNegotiation.staticLists.otherLists;
    });

    this.getOfferPriceConfiguration();
  }

  getConversionFactor(){
    const payload = {
      ProductId: this.productId
    };
    this.spotNegotiationService.getDefaultConversionFactor(payload)
      .subscribe((res: any)=>{
        this.massUom = res.payload.massUom;
        this.formValues.conversionRate = res.payload.value;
        this.formValues.conversionVolumeUom = {id : res.payload.volumeUom.id }
      });
  }

  ngOnInit() {
    this.formulaFlatPercentageList = this.setListFromStaticLists(
      'FormulaFlatPercentage'
    );
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
    this.formulaEventIncludeList = this.setListFromStaticLists(
      'FormulaEventInclude'
    );
    this.dayOfWeekList = this.setListFromStaticLists('DayOfWeek');
    this.holidayRuleList = this.setListFromStaticLists('HolidayRule');
    this.pricingSchedulePeriodList = this.setListFromStaticLists(
      'PricingSchedulePeriod'
    );
    this.quantityTypeList = this.setListFromStaticLists('QuantityType');
    this.productList = this.setListFromStaticLists('Product');
    this.locationList = this.setListFromStaticLists('Location');
    this.formulaTypeList = this.setListFromStaticLists('FormulaType');
    this.pricingScheduleList = this.setListFromStaticLists('PricingSchedule');

    //this.getConversionFactor();
  }

  setListFromStaticLists(name) {
    const findList = _.find(this.staticList, function(object) {
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
    if (id == 1) {
      if (this.formValues.complexFormulaQuoteLines) {
        this.formValues.complexFormulaQuoteLines = [];
        this.formulaId = id;
      } else this.formulaId = id;
    }
    if (id == 2) {
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

  displayFn(value) {
    return value && value.name ? value.name : '';
  }

  SearchFormulaList(item: any) {
    //this.formulaNameList = this.sessionData.payload;
    if (item != null) {
      if (this.sessionFormulaList != null) {
        this.formulaNameList = this.sessionFormulaList.payload
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
    this.spotNegotiationService
      .getMasterFormula(payload)
      .subscribe((data: any) => {
        this.spinner.hide();
        this.formValues = data.payload;
        this.formulaDesc = data.payload?.name;
        this.formulaId = data.payload.formulaType?.id;
        this.scheduleId = data.payload.pricingSchedule?.id;
        this.handleNullValues(this.formValues);
      });
  }

  hideFormula() {}

  clearSchedules(id) {
    this.formValues.pricingScheduleOptionDateRange = {};
    this.formValues.pricingScheduleOptionSpecificDate = {};
    this.formValues.pricingScheduleOptionEventBasedSimple = {};
    this.formValues.pricingScheduleOptionEventBasedExtended = {};
    this.formValues.pricingScheduleOptionEventBasedContinuous = {};
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
        name: ' ',
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

  generateSystemInstrumentForComplexFormula(systemInstrument: any) {
    let systemInstrumentList = [];
    systemInstrument.forEach(sys =>
      systemInstrumentList.push({
        marketPriceTypeId: sys.marketPriceTypeId?.id
          ? sys.marketPriceTypeId.id
          : 0,
        systemInstrumentId: sys.systemInstrument?.id
          ? sys.systemInstrument.id
          : 0
      })
    );

    return systemInstrumentList;
  }
  constructSimpleFormula(simpleFormula) {
    if(simpleFormula.systemInstrument === undefined) return null;
    let simplePayload = {
      systemInstrumentId: simpleFormula.systemInstrument?.id
        ? simpleFormula.systemInstrument.id
        : 0,
      marketPriceTypeId: simpleFormula.priceType.id
        ? simpleFormula.priceType.id
        : 0,
      formulaPlusMinusId: simpleFormula.plusMinus.id
        ? simpleFormula.plusMinus.id
        : 0,
      amount: simpleFormula.amount ? simpleFormula.amount : 0,
      formulaFlatPercentageId: simpleFormula.flatPercentage.id
        ? simpleFormula.flatPercentage.id
        : 0,
      uomId: simpleFormula.uom?.id ? simpleFormula.uom.id : 0
    };
    return simplePayload;
  }
  constructComplexFormula(complexFormula) {
    if(!complexFormula || complexFormula.length <=0) return null;
    let complexPayload = [];
    complexFormula.forEach(comp =>
      complexPayload.push({
        id: comp.id ? comp.id : 0,
        amount: comp.amount,
        formulaFlatPercentageId: comp.formulaFlatPercentage?.id
          ? comp.formulaFlatPercentage.id
          : 0,
        formulaFunctionId: comp.formulaFunction?.id
          ? comp.formulaFunction.id
          : 0,
        formulaOperationId: comp.formulaOperation.id
          ? comp.formulaOperation.id
          : 0,
        formulaPlusMinusId: comp.formulaPlusMinus.id
          ? comp.formulaPlusMinus.id
          : 0,
        weight: comp.weight,
        systemInstruments: this.generateSystemInstrumentForComplexFormula(comp.systemInstruments),
        uomId: comp.uom?.id
      })
    );
    return complexPayload;
  }
  constructHolidayRule(holidayRules: any) {
    // if(!holidayRules) return null;
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
        sundayHolidayRuleId: holidayRules.sundayHolidayRule?.id
          ? holidayRules.sundayHolidayRule.id
          : 0,
        mondayHolidayRuleId: holidayRules.mondayHolidayRule?.id
          ? holidayRules.mondayHolidayRule.id
          : 0,
        tuesdayHolidayRuleId: holidayRules.tuesdayHolidayRule?.id
          ? holidayRules.tuesdayHolidayRule.id
          : 0,
        wednesdayHolidayRuleId: holidayRules.wednesdayHolidayRule?.id
          ? holidayRules.wednesdayHolidayRule.id
          : 0,
        thursdayHolidayRuleId: holidayRules.thursdayHolidayRule?.id
          ? holidayRules.thursdayHolidayRule.id
          : 0,
        fridayHolidayRuleId: holidayRules.fridayHolidayRule?.id
          ? holidayRules.fridayHolidayRule.id
          : 0,
        saturdayHolidayRuleId: holidayRules.saturdayHolidayRule?.id
          ? holidayRules.saturdayHolidayRule.id
          : 0
      };
      return holidayRule;
    }
  }

  constructFormulaPayload(formValues: any) {
    let formulaPayload = {
      formulaTypeId: formValues.formulaType?.id ? formValues.formulaType.id : 0,
      isMean: formValues.isMean,
      currencyId: formValues.currency?.id, //------------------------------Needs to replace----------------------
      simpleFormula: formValues.formulaType?.id === 1? this.constructSimpleFormula(formValues.simpleFormula) : null,
      complexFormulaQuoteLines: formValues.formulaType?.id === 2? this.constructComplexFormula(formValues.complexFormulaQuoteLines) : null,
      holidayRule: this.constructHolidayRule(formValues.formulaHolidayRules)
    };
    return formulaPayload;
  }

  constructSchedulePayload(formValues: any) {
    let schedulePayload = {
      pricingScheduleId: formValues.pricingSchedule.id,
      dateRange: formValues.pricingSchedule.id === 4? this.constructDateRange(formValues.pricingScheduleOptionDateRange) : null,
      specificDate: formValues.pricingSchedule.id === 5? this.constructSpecificDate(formValues.pricingScheduleOptionSpecificDate) : null,
      eventBasedSimple: formValues.pricingSchedule.id === 6? 
          this.constructEventBasedSimple(formValues.pricingScheduleOptionEventBasedSimple) : null,
      eventBasedExtended: formValues.pricingSchedule.id === 7? 
        this.constructEventBasedExtended(formValues.pricingScheduleOptionEventBasedExtended) : null,
      eventBasedContinuous: formValues.pricingSchedule.id === 8? this.constructEventBasedContinuous(formValues.pricingScheduleOptionEventBasedContinuous) : null
    };
    return schedulePayload;
  }

  constructEventBasedContinuous(scheduleEventBasedContinuous: any) {
    if (!scheduleEventBasedContinuous) return null;
    let eventBasedContinuous = {
      assumeHolidayOnInstruments:
        scheduleEventBasedContinuous.assumeHolidayOnInstruments,
      sundayHolidayRuleId: scheduleEventBasedContinuous.sundayHolidayRule?.id
        ? scheduleEventBasedContinuous.sundayHolidayRule.id
        : 0,
      mondayHolidayRuleId: scheduleEventBasedContinuous.mondayHolidayRule?.id
        ? scheduleEventBasedContinuous.mondayHolidayRule.id
        : 0,
      tuesdayHolidayRuleId: scheduleEventBasedContinuous.tuesdayHolidayRule?.id
        ? scheduleEventBasedContinuous.tuesdayHolidayRule.id
        : 0,
      wednesdayHolidayRuleId: scheduleEventBasedContinuous.wednesdayHolidayRule
        ?.id
        ? scheduleEventBasedContinuous.wednesdayHolidayRule.id
        : 0,
      thursdayHolidayRuleId: scheduleEventBasedContinuous.thursdayHolidayRule
        ?.id
        ? scheduleEventBasedContinuous.thursdayHolidayRule.id
        : 0,
      fridayHolidayRuleId: scheduleEventBasedContinuous.fridayHolidayRule?.id
        ? scheduleEventBasedContinuous.fridayHolidayRule.id
        : 0,
      saturdayHolidayRuleId: scheduleEventBasedContinuous.saturdayHolidayRule
        ?.id
        ? scheduleEventBasedContinuous.saturdayHolidayRule.id
        : 0,
      pricingSchedulePeriodId: scheduleEventBasedContinuous.period?.id
        ? scheduleEventBasedContinuous.period.id
        : 0,
      eventId: scheduleEventBasedContinuous.event.id
        ? scheduleEventBasedContinuous.event.id
        : 0,
      date: scheduleEventBasedContinuous.date,
      weekStartsOn: scheduleEventBasedContinuous.weekStartsOn.id
        ? scheduleEventBasedContinuous.weekStartsOn.id
        : 0
    };
    return eventBasedContinuous;
  }

  constructEventBasedExtended(scheduleEventBasedExtended: any) {
    if (!scheduleEventBasedExtended) return null;
    let eventBasedExtended = {
      assumeHolidayOnInstruments:
        scheduleEventBasedExtended.assumeHolidayOnInstruments,
      sundayHolidayRuleId: scheduleEventBasedExtended.sundayHolidayRule?.id
        ? scheduleEventBasedExtended.sundayHolidayRule.id
        : 0,
      mondayHolidayRuleId: scheduleEventBasedExtended.mondayHolidayRule?.id
        ? scheduleEventBasedExtended.mondayHolidayRule.id
        : 0,
      tuesdayHolidayRuleId: scheduleEventBasedExtended.tuesdayHolidayRule?.id
        ? scheduleEventBasedExtended.tuesdayHolidayRule.id
        : 0,
      wednesdayHolidayRuleId: scheduleEventBasedExtended.wednesdayHolidayRule
        ?.id
        ? scheduleEventBasedExtended.wednesdayHolidayRule.id
        : 0,
      thursdayHolidayRuleId: scheduleEventBasedExtended.thursdayHolidayRule?.id
        ? scheduleEventBasedExtended.thursdayHolidayRule.id
        : 0,
      fridayHolidayRuleId: scheduleEventBasedExtended.fridayHolidayRule?.id
        ? scheduleEventBasedExtended.fridayHolidayRule.id
        : 0,
      saturdayHolidayRuleId: scheduleEventBasedExtended.saturdayHolidayRule.id
        ? scheduleEventBasedExtended.saturdayHolidayRule.id
        : 0,
      name: scheduleEventBasedExtended.name,
      fromNoOfBusinessDaysBefore:
        scheduleEventBasedExtended.fromNoOfBusinessDaysBefore,
      fromBusinessCalendarId: scheduleEventBasedExtended.fromBusinessCalendar
        ?.id
        ? scheduleEventBasedExtended.fromBusinessCalendar.id
        : 0,
      toNoOfBusinessDaysAfter:
        scheduleEventBasedExtended.toNoOfBusinessDaysAfter,
      toBusinessCalendarId: scheduleEventBasedExtended.toBusinessCalendar?.id
        ? scheduleEventBasedExtended.toBusinessCalendar.id
        : 0,
      excludeFromNoOfBusinessDaysBefore:
        scheduleEventBasedExtended.excludeFromNoOfBusinessDaysBefore,
      excludeToNoOfBusinessDaysAfter:
        scheduleEventBasedExtended.excludeToNoOfBusinessDaysAfter,
      eventId: scheduleEventBasedExtended.event?.id
        ? scheduleEventBasedExtended.event.id
        : 0,
      isEventIncludedId: scheduleEventBasedExtended.isEventIncluded?.id
        ? scheduleEventBasedExtended.isEventIncluded.id
        : 0
    };
    return eventBasedExtended;
  }

  constructEventBasedSimple(scheduleEvenetBasedSimple: any) {
    if (!scheduleEvenetBasedSimple) return null;
    let eventBasedSimple = {
      assumeHolidayOnInstruments:
        scheduleEvenetBasedSimple.assumeHolidayOnInstruments,
      sundayHolidayRuleId: scheduleEvenetBasedSimple.sundayHolidayRule?.id
        ? scheduleEvenetBasedSimple.sundayHolidayRule.id
        : 0,
      mondayHolidayRuleId: scheduleEvenetBasedSimple.mondayHolidayRule?.id
        ? scheduleEvenetBasedSimple.mondayHolidayRule.id
        : 0,
      tuesdayHolidayRuleId: scheduleEvenetBasedSimple.tuesdayHolidayRule?.id
        ? scheduleEvenetBasedSimple.tuesdayHolidayRule.id
        : 0,
      wednesdayHolidayRuleId: scheduleEvenetBasedSimple.wednesdayHolidayRule.id
        ? scheduleEvenetBasedSimple.wednesdayHolidayRule.id
        : 0,
      thursdayHolidayRuleId: scheduleEvenetBasedSimple.thursdayHolidayRule?.id
        ? scheduleEvenetBasedSimple.thursdayHolidayRule.id
        : 0,
      fridayHolidayRuleId: scheduleEvenetBasedSimple.fridayHolidayRule?.id
        ? scheduleEvenetBasedSimple.fridayHolidayRule.id
        : 0,
      saturdayHolidayRuleId: scheduleEvenetBasedSimple.saturdayHolidayRule?.id
        ? scheduleEvenetBasedSimple.saturdayHolidayRule.id
        : 0,
      name: scheduleEvenetBasedSimple.name,
      fromNoOfBusinessDaysBefore:
        scheduleEvenetBasedSimple.fromNoOfBusinessDaysBefore,
      fromBusinessCalendarId: scheduleEvenetBasedSimple.fromBusinessCalendarId
        ?.id
        ? scheduleEvenetBasedSimple.fromBusinessCalendarId.id
        : 0,
      toNoOfBusinessDaysAfter:
        scheduleEvenetBasedSimple.toNoOfBusinessDaysAfter,
      toBusinessCalendarId: scheduleEvenetBasedSimple.toBusinessCalendar?.id
        ? scheduleEvenetBasedSimple.toBusinessCalendar.id
        : 0,
      eventId: scheduleEvenetBasedSimple.event?.id
        ? scheduleEvenetBasedSimple.event.id
        : 0,
      isEventIncludedId: scheduleEvenetBasedSimple.isEventIncluded.id
        ? scheduleEvenetBasedSimple.isEventIncluded.id
        : 0
    };
    return eventBasedSimple;
  }

  constructSpecificDate(ScheduleSpecificDate: any) {
    if (!ScheduleSpecificDate) return null;
    let specificDate = {
      assumeHolidayOnInstruments:
        ScheduleSpecificDate.assumeHolidayOnInstruments,
      sundayHolidayRuleId: ScheduleSpecificDate.sundayHolidayRule?.id
        ? ScheduleSpecificDate.sundayHolidayRule.id
        : 0,
      mondayHolidayRuleId: ScheduleSpecificDate.mondayHolidayRule?.id
        ? ScheduleSpecificDate.mondayHolidayRule.id
        : 0,
      tuesdayHolidayRuleId: ScheduleSpecificDate.tuesdayHolidayRule?.id
        ? ScheduleSpecificDate.tuesdayHolidayRule.id
        : 0,
      wednesdayHolidayRuleId: ScheduleSpecificDate.wednesdayHolidayRule?.id
        ? ScheduleSpecificDate.wednesdayHolidayRule.id
        : 0,
      thursdayHolidayRuleId: ScheduleSpecificDate.thursdayHolidayRule?.id
        ? ScheduleSpecificDate.thursdayHolidayRule.id
        : 0,
      fridayHolidayRuleId: ScheduleSpecificDate.fridayHolidayRule?.id
        ? ScheduleSpecificDate.fridayHolidayRule.id
        : 0,
      saturdayHolidayRuleId: ScheduleSpecificDate.saturdayHolidayRule?.id
        ? ScheduleSpecificDate.saturdayHolidayRule.id
        : 0,
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
      sundayHolidayRuleId: scheduleDateRange?.sundayHolidayRule?.id
        ? scheduleDateRange.sundayHolidayRule.id
        : 0,
      mondayHolidayRuleId: scheduleDateRange?.mondayHolidayRule?.id
        ? scheduleDateRange.mondayHolidayRule.id
        : 0,
      tuesdayHolidayRuleId: scheduleDateRange?.tuesdayHolidayRule?.id
        ? scheduleDateRange.tuesdayHolidayRule.id
        : 0,
      wednesdayHolidayRuleId: scheduleDateRange?.wednesdayHolidayRule?.id
        ? scheduleDateRange.wednesdayHolidayRule.id
        : 0,
      thursdayHolidayRuleId: scheduleDateRange?.thursdayHolidayRule?.id
        ? scheduleDateRange.thursdayHolidayRule.id
        : 0,
      fridayHolidayRuleId: scheduleDateRange?.fridayHolidayRule?.id
        ? scheduleDateRange.fridayHolidayRule.id
        : 0,
      saturdayHolidayRuleId: scheduleDateRange?.saturdayHolidayRule?.id
        ? scheduleDateRange.saturdayHolidayRule.id
        : 0,
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
          flatPercentageId: rules.flatPercentage?.id
            ? rules.flatPercentage?.id
            : 0,
          uomId: rules.uom?.id ? rules.uom.id : 0,
          quantityTypeId: rules.quantityType?.id ? rules.quantityType.id : 0,
          quantityRangeFrom: rules.quantityRangeFrom,
          quantityRangeTo: rules.quantityRangeTo
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
          flatPercentageId: rule.flatPercentage?.id
            ? rule.flatPercentage.id
            : 0,
          uomId: rule.uom?.id ? rule.uom.id : 0,
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
          flatPercentageId: rule.formulaFlatPercentageId?.id
            ? rule.formulaFlatPercentageId.id
            : 0,
          uomId: rule.uom?.id ? rule.uom.id : 0,
          locationId: rule.location?.id ? rule.location.id : 0
        });
      }
    });
    return discountruleLocationBased;
  }

  constructDiscountRules(discountRules: any) {
    let discountRulesList = {
      quantityDiscountRules: this.constructDiscountRulesQuantityBased(
        discountRules.quantityDiscountRules
      ),
      productDiscountRules: this.constructDiscountRulesProductBased(
        discountRules.productDiscountRules
      ),
      locationDiscountRules: this.constructLocationDiscount(
        discountRules.locationDiscountRules
      )
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
      formula: this.constructFormulaPayload(formValues),
      schedule: formValues.pricingSchedule? this.constructSchedulePayload(formValues) : null,
      discountRules: this.constructDiscountRules(formValues),
      conversionMassUomId: this.massUom.id,
      conversionValue: formValues.conversionRate,
      conversionVolumeUomId: formValues.conversionVolumeUom.id
    };
    return finalPayload;
  }

  saveFormula() {
    let formulaPayload: any = this.constructPayload(this.formValues);
    
    if(!formulaPayload.name || formulaPayload.name ===''){
        this.toastr.error('Formula name field is required.')
        return;
    }
    if(!formulaPayload.formula.simpleFormula && !formulaPayload.formula.complexFormulaQuoteLines){
      this.toastr.error('Either simple or complex formula quote lines are required.')
      return;
    }

    if(!formulaPayload.schedule || !formulaPayload.schedule.pricingScheduleId){
      this.toastr.error('Atleast 1 pricing schedule option is required.')
      return;
    }

    if (formulaPayload.id == 0) {
      this.spinner.show();
      this.spotNegotiationService
        .addNewFormulaPrice(formulaPayload, this.requestOfferId)
        .pipe(
          tap((res: any) => {
            if(!res || !res.id)
            {
              this.spinner.hide();
              this.toastr.error('Failed to save Formula. Please try again with valid data.');
              return;
            }
            this.requestOfferId = res.requestOfferId;
            this.offerPriceFormulaId = res.id;
          }),
          switchMap((res: any) =>
            this.spotNegotiationService.evaluateFormulaPrice({
              RequestOfferId: res.requestOfferId,
              PriceConfigurationId: res.id
            })
          )
        )
        .subscribe((item: any) => {
          this.spinner.hide();
          if (item.errors) {
            this.toastr.error('Failed to save Formula.');
            return;
          } else {
            this.toastr.success('Operatation completed Successfully.');
            this.evaluatedFormulaPrice = item;
            let payload = {
              RequestOfferId: this.requestOfferId,
              priceConfigurationId: this.offerPriceFormulaId
            };
            this.store.dispatch(new SetOfferPriceFormulaId(payload));
            //close popup with evaluated price item update
            this.closePopup();
          }
        });
    } else {
      this.spinner.show();
      this.spotNegotiationService
        .updateFormulaPrice(
          formulaPayload,
          this.requestOfferId,
          this.offerPriceFormulaId
        )
        .pipe(
          switchMap((res: any) =>
            this.spotNegotiationService.evaluateFormulaPrice({
              RequestOfferId: res.requestOfferId,
              PriceConfigurationId: res.id
            })
          )
        )
        .subscribe((item: any) => {
          this.spinner.hide();
          if (item.errors) {
            this.toastr.error('Failed to Update formula');
            return;
          } else {
            this.toastr.success('Operation Completed Successfully');
            this.evaluatedFormulaPrice = item;
            //close popup with evaluated price item update
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
      this.formulaValue = result.data[0].name;
      return this.addFormula(result.data[0]);
    });
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

  getInstrumentNameById(instrumentId: number){
    var instrumentName = '';
    if(this.systemInstumentList){
      instrumentName = this.systemInstumentList.filter(item=> item.id === instrumentId)[0].name
    }
    return instrumentName;
  }

  getOfferPriceConfiguration() {
    this.formValues = {
      isEditable: true,
      formulaType: { },
      simpleFormula: {},
      conversionVolumeUom: {}
    };
    this.formValues.complexFormulaQuoteLines = [];
    if (this.offerPriceFormulaId) {
      this.spinner.show();
      this.spotNegotiationService
        .getOfferPriceConfiguration(
          this.requestOfferId,
          this.offerPriceFormulaId
        )
        .pipe(first())
        .subscribe(response => {
          this.spinner.hide();
          this.constructUIFormValues(response as OfferPriceFormulaDto);
        });
    }else{
      this.getConversionFactor();
    }
  }

  getSystemInstruments(systemInstruments: SystemInstrumentDto[]) {
    var uiInstruments: SystemInstruments[] = [];
    systemInstruments.forEach(item => {
      uiInstruments.push({
        marketPriceTypeId: { id: item.marketPriceTypeId },
        systemInstrument: { id: item.systemInstrumentId, name:  this.getInstrumentNameById(item.systemInstrumentId) }
      });
    });
    return uiInstruments;
  }

  getHolidayRule(holidayRuleDto: HolidayRuleDto){
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
    }
    return scheduleOption;
  }

  getDateRange(scheduleDateRange: DateRangeDto){
    var dateRangeOption = this.getHolidayRule(scheduleDateRange as HolidayRuleDto) as PricingScheduleOptionDateRange;
    dateRangeOption.from = scheduleDateRange.validFrom,
    dateRangeOption.to = scheduleDateRange.validTo,
    dateRangeOption.allowsPricingOnHoliday = scheduleDateRange.allowsPricingOnHoliday
    return dateRangeOption;
  }

  getSpecificDate(scheduleSpecificDate: any){
    var scheduleOption = this.getHolidayRule(scheduleSpecificDate as HolidayRuleDto);
    scheduleOption = {...scheduleSpecificDate};
    return scheduleOption;
  }

  getEventBasedSimple(eventBasedSimple: EventBasedSimpleDto){
    var scheduleOption = this.getHolidayRule(eventBasedSimple as HolidayRuleDto) as PricingScheduleOptionEventBasedSimple;
    scheduleOption.fromNoOfBusinessDaysBefore = eventBasedSimple.fromNoOfBusinessDaysBefore;
    scheduleOption.toNoOfBusinessDaysAfter = eventBasedSimple.toNoOfBusinessDaysAfter;
    scheduleOption.fromBusinessCalendarId = {id: eventBasedSimple.fromBusinessCalendarId};
    scheduleOption.toBusinessCalendar = {id : eventBasedSimple.toBusinessCalenderId}
    scheduleOption.event = {id: eventBasedSimple.eventId }
    scheduleOption.isEventIncluded = {id: eventBasedSimple.isEventIncludedId}
    return scheduleOption;
  }

  getEventBasedExtended(eventBasedExtended: EventBasedExtendDto){
    var scheduleOption = this.getHolidayRule(eventBasedExtended as HolidayRuleDto) as PricingScheduleOptionEventBasedExtended;
    scheduleOption = { ...this.getEventBasedSimple(eventBasedExtended) as PricingScheduleOptionEventBasedExtended}
    scheduleOption.excludeFromNoOfBusinessDaysBefore = eventBasedExtended.excludeFromNoOfBusinessDaysBefore;
    scheduleOption.excludeToNoOfBusinessDaysAfter = eventBasedExtended.excludeToNoOfBusinessDaysAfter;
    return scheduleOption;
  }

  getEventBasedContinuous(eventBasedContinuous: EventBasedContinuousDto){
    var scheduleOption = this.getHolidayRule(eventBasedContinuous as HolidayRuleDto) as PricingScheduleOptionEventBasedContinuous;
    scheduleOption.pricingSchedulePeriod = { id: eventBasedContinuous.pricingSchedulePeriodId };
    scheduleOption.event = { id: eventBasedContinuous.eventId };
    scheduleOption.date = eventBasedContinuous.date;
    scheduleOption.weekStartsOn = eventBasedContinuous.weekStartsOn;
    return scheduleOption;
  }

  getQuantityDiscountRules(quantityRules: any){
    quantityRules.forEach(rule => {
      rule.plusMinus = this.formulaPlusMinusList.find(item=> item.id === rule.plusMinusId);
      rule.flatPercentage = this.formulaFlatPercentageList.find(item=> item.id === rule.flatPercentageId);
      rule.uom = this.uomList.find(item=> item.id === rule.uomId);
      rule.quantityType = this.quantityTypeList.find(item=> item.id === rule.quantityTypeId);
    });
    return quantityRules;
  }

  getProductDiscountRules(productRules: any){
    productRules.forEach(rule => {
      rule.plusMinus = this.formulaPlusMinusList.find(item=> item.id === rule.plusMinusId);
      rule.flatPercentage = this.formulaFlatPercentageList.find(item=> item.id === rule.flatPercentageId);
      rule.uom = this.uomList.find(item=> item.id === rule.uomId);
      rule.product = this.productList.find(item=> item.id === rule.productId); 
    });
    return productRules;
  }
  getLocationDiscountRules(locationRules: any){
    locationRules.forEach(rule => {
      rule.plusMinus = this.formulaPlusMinusList.find(item=> item.id === rule.plusMinusId);
      rule.flatPercentage = this.formulaFlatPercentageList.find(item=> item.id === rule.flatPercentageId);
      rule.uom = this.uomList.find(item=> item.id === rule.uomId);
      rule.location = this.locationList.find(item=> item.id === rule.locationId);
    });
    return locationRules;
  }

  constructUIFormValues(priceConfig: OfferPriceFormulaDto) {
    this.formValues = {
      id: priceConfig.id,
      name: priceConfig.name,
      isEditable: true,
      formulaType: { id: priceConfig.formula.formulaTypeId },
      isMean: priceConfig.formula.isMean,
      currency: this.currencyList.find(item=> item.id === priceConfig.formula.currencyId),
      pricingSchedule: {id: priceConfig.schedule.pricingScheduleId},
      pricingScheduleOptionDateRange: priceConfig.schedule.pricingScheduleId === 4? this.getDateRange(priceConfig.schedule.dateRange) : null,
      pricingScheduleOptionSpecificDate:  priceConfig.schedule.pricingScheduleId === 5? this.getSpecificDate(priceConfig.schedule.specificDate): null,
      pricingScheduleOptionEventBasedSimple: priceConfig.schedule.pricingScheduleId === 6? this.getEventBasedSimple(priceConfig.schedule.eventBasedSimple): null,
      pricingScheduleOptionEventBasedExtended: priceConfig.schedule.pricingScheduleId === 7? this.getEventBasedExtended(priceConfig.schedule.eventBasedExtended): null,
      pricingScheduleOptionEventBasedContinuous: priceConfig.schedule.pricingScheduleId === 8? this.getEventBasedContinuous(priceConfig.schedule.eventBasedContinuous): null,
      formulaHolidayRules: priceConfig.formula.holidayRule? this.getHolidayRule(priceConfig.formula.holidayRule) : null,
      quantityDiscountRules: this.getQuantityDiscountRules(priceConfig.discountRules?.quantityDiscountRules),
      productDiscountRules:  this.getProductDiscountRules(priceConfig.discountRules?.productDiscountRules),
      locationDiscountRules:  this.getLocationDiscountRules(priceConfig.discountRules?.locationDiscountRules),
      conversionVolumeUom: {}
    };

    if (priceConfig.formula.formulaTypeId === 1) {
      this.formValues.simpleFormula = {
        plusMinus: { id: priceConfig.formula.simpleFormula.formulaPlusMinusId },
        priceType: { id: priceConfig.formula.simpleFormula.marketPriceTypeId },
        systemInstrument: {
          id: priceConfig.formula.simpleFormula.systemInstrumentId, name: this.getInstrumentNameById(priceConfig.formula.simpleFormula.systemInstrumentId)
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
    this.massUom = uomMassList.find(item=> item.id === priceConfig.conversionMassUomId);
    this.formValues.conversionRate = priceConfig.conversionValue;
    this.formValues.conversionVolumeUom = { id : priceConfig.conversionVolumeUomId }

  }
}
