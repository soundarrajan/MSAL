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
import { CustomDateAdapter, CustomNgxDatetimeAdapter, CUSTOM_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS_1, PICK_FORMATS } from '@shiptech/core/utils/dateTime.utils';
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

  setDefaultValues = () => {};

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
  }

  saveFormula() {
    let payload = _.cloneDeep(this.formValues);
    if (payload.complexFormulaQuoteLines && payload.complexFormulaQuoteLines?.length > 0) {
      for (let cfql of payload.complexFormulaQuoteLines) {
        if (cfql.systemInstruments) {
          for (var i = cfql.systemInstruments.length - 1; i >= 0; i--) {
            if(!(cfql.systemInstruments[i]?.id > 0) && !cfql.systemInstruments[i]?.systemInstrument
            && !cfql.systemInstruments[i]?.marketPriceTypeId) {
              cfql.systemInstruments.splice(i, 1);
            }
          }
        }
      }
    }
    if (this.formValues.id) {
      this.spinner.show();
      this.contractService
        .updateFormula(payload)
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
        .saveFormula(payload)
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
