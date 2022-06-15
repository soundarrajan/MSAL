import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { FormValues } from './spotnego-pricing-details.interface';

@Component({
  selector: 'app-spotnego-pricing-details',
  templateUrl: './spotnego-pricing-details.component.html',
  styleUrls: ['./spotnego-pricing-details.component.css']
})
export class SpotnegoPricingDetailsComponent implements OnInit {
  
  formulaFlatPercentageList : any;
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
  formulaEventIncludeList : any;
  pricingSchedulePeriodList: any;
  dayOfWeekList: any;
  holidayRuleList: any;
  quantityTypeList: any;
  productList: any;
  enterFormula: any;
  sessionFormulaList: any;
  locationList : any;
  formulaTypeList: any;
  formulaNameList : any = [];
  public comment: string = "";
  expressType1: string;
  expressType: string='';
  // formValues: any = {
  //   name: '',
  //   simpleFormula: {}
  // };
  formValues: FormValues;
  public selectedFormulaTab='Pricing formula';
  formulaValue : any = '';
  showFormula : any;
  formulaDesc: any;
  rules: any = 1;
  public initialized = 1;
  pricingScheduleList: any;
  list : any
  entityName: string;

  constructor(public dialogRef: MatDialogRef<SpotnegoPricingDetailsComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer,
              public dialog: MatDialog,
              private spotNegotiationService : SpotNegotiationService,
              public format: TenantFormattingService,
              public legacylookup : LegacyLookupsDatabase,
              private store : Store,
              private spinner : NgxSpinnerService,
              private toastr : ToastrService 
              
              ) {
    iconRegistry.addSvgIcon('data-picker-gray', sanitizer.bypassSecurityTrustResourceUrl('../../assets/customicons/calendar-dark.svg'));

    this.sessionFormulaList = JSON.parse(sessionStorage.getItem('formula'));

    this.store.selectSnapshot<any>((state: any) => {
      this.staticList = state.spotNegotiation.staticLists.otherLists;
    });
    this.list = this.spotNegotiationService.indexedDBList;
    this.formValues = {
      id: 1,
      name: " ",
      isEditable: true,
      formulaType:{
        id: 1,
      },
      simpleFormula:{}
    }
    this.formValues.complexFormulaQuoteLines = [];
   }
  closeDialog() {
      this.dialogRef.close();
    }

    ngOnInit() {
        this.formulaFlatPercentageList = this.setStaticLists('FormulaFlatPercentage');
        this.formulaPlusMinusList = this.setStaticLists('FormulaPlusMinus');
        this.marketPriceList = this.setStaticLists('MarketPriceType');
        this.systemInstumentList = this.setStaticLists('SystemInstrument');
        this.uomList = this.setStaticLists('Uom');
        this.currencyList = this.setStaticLists('Currency');
        this.formulaOperationList = this.setStaticLists('FormulaOperation');
        this.formulaFunctionList = this.setStaticLists('FormulaFunction');
        this.marketPriceTypeList = this.setStaticLists('MarketPriceType');
        this.businessCalendarList = this.setStaticLists('BusinessCalendar');
        this.eventList = this.setStaticLists('Event');
        this.formulaEventIncludeList =  this.setStaticLists('FormulaEventInclude');
        this.dayOfWeekList = this.setStaticLists('DayOfWeek');
        this.holidayRuleList = this.setStaticLists('HolidayRule');
        this.pricingSchedulePeriodList = this.setStaticLists('PricingSchedulePeriod');
        this.quantityTypeList = this.setStaticLists('QuantityType');
        this.productList = this.setStaticLists('Product');
        this.locationList = this.setStaticLists('Location');
        this.formulaTypeList = this.setStaticLists('FormulaType');
        this.pricingScheduleList = this.setStaticLists('PricingSchedule');
    }

    setStaticLists(staticName) {
      const findList = this.list[staticName] ;
      return findList;
    }

    isEmptyObject(obj) {
      return obj && Object.keys(obj).length === 0;
    }

    setFormulaTypeSelected(id) {
      if (id == 2) {
        //let isEmptyObject = this.isEmptyObject(this.formValues.simpleFormula);
        if (this.isEmptyObject(this.formValues.simpleFormula)) {
          this.formValues.simpleFormula = null;
        }
        if (!this.formValues.complexFormulaQuoteLines) {
          this.formValues.complexFormulaQuoteLines = [];
        }
      }
       else {
        if (!this.formValues.simpleFormula) {
          this.formValues.simpleFormula = {id : 0,
            amount: 0,
            flatPercentage:{
              id: 0,
              name: ''
            },
            isDeleted: true,
            plusMinus: {
              id: 0,
              name: ''
            },
            priceType : {
              id: 0,
              name: ''
            },
            systemInstrument :{},
            uom: {
              id :0,
              isDeleted : true,
              name :''
            }};
        }
      }
    }

    setPricingType() {
      if (!this.formValues.pricingSchedule) {
        this.formValues.pricingSchedule = {};
      }
    }

    handleNullValues(formValues){
       if(formValues.simpleFormula == null){
        this.formValues.simpleFormula = {
          id : 0,
          amount: 0,
          flatPercentage:{
            id: 0,
            name: ''
          },
          isDeleted: true,
          plusMinus: {
            id: 0,
            name: ''
          },
          priceType : {
            id: 0,
            name: ''
          },
          systemInstrument :{
            id: 0,
            name: " "
          },
          uom: {
            id :0,
            isDeleted : false,
            name :''
          }
        }
       }
       if(formValues.complexFormulaQuoteLines == null){
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

  SearchFormulaList(item : any){
    //this.formulaNameList = this.sessionData.payload;
    if (item != null) {
     if(this.sessionFormulaList != null){
      this.formulaNameList = this.sessionFormulaList.payload.filter(e => {
        if (e.name.toLowerCase().includes(item.toLowerCase())) {
          return true;
        } else {
          return false;
        }
      }).splice(0,7)  ;
     }
     else{
       return;
     }
    }
  }

  addFormula(item : any){
    let payload = item.id;
    this.spinner.show();
    this.spotNegotiationService.getContractFormula(payload).subscribe((data: any)=>{
    this.formValues = data.payload;
    this.spinner.hide();
     this.formulaDesc = data.payload?.name;
     this.expressType1  = data.payload.formulaType?.name;
     this.expressType = data.payload.pricingSchedule?.name;
     this.handleNullValues(this.formValues);
     console.log(this.list);
  });
  }
  
  hideFormula(){

  } 

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
        name: " ",
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

  saveFormula() {
    if (this.formValues.id) {
      this.spinner.show();
      this.spotNegotiationService
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
      this.spotNegotiationService
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


  searchFormula(){
    const dialogRef = this.dialog.open(SearchFormulaPopupComponent, {
      width: '80vw',
      height: 'auto',
      maxWidth: '95vw',
      panelClass: 'search-request-popup',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.formulaValue = result.data[0].name
      return this.addFormula(result.data[0]);
    });
  }

  typeFormula(){

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

}
