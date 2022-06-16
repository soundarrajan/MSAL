import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { OrderListGridViewModel } from '@shiptech/core/ui/components/delivery/view-model/order-list-grid-view-model.service';
import _ from 'lodash';

import {
  MatDialog,
} from '@angular/material/dialog';
import { KeyValue } from '@angular/common';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'shiptech-event-based-continuous',
  templateUrl: './event-based-continuous.component.html',
  styleUrls: ['./event-based-continuous.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [OrderListGridViewModel, DialogService, ConfirmationService]
})
export class EventBasedContinuous implements OnInit {
  switchTheme; //false-Light Theme, true- Dark Theme
  _entityId: number;
  _entityName: string;
  formValues: any;
  formulaFlatPercentageList: any;
  systemInstumentList: any;
  formulaPlusMinusList: any;
  marketPriceList: any;
  currencyList: any;
  formulaOperationList: any;
  formulaFunctionList: any;
  marketPriceTypeList: any;
  pricingSchedulePeriodList: any;
  eventList: any;
  dayOfWeekList: any;
  holidayRuleList: any;
  isValidFromDateInvalid: boolean;
  hasInvoicedOrder: any;

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

  @Input('model') set _setFormValues(formValues) {
    if (!formValues) {
      return;
    }
    this.formValues = formValues;
  }

  @Input('formulaFlatPercentageList') set _setFormulaFlatPercentageList(
    formulaFlatPercentageList
  ) {
    if (!formulaFlatPercentageList) {
      return;
    }
    this.formulaFlatPercentageList = formulaFlatPercentageList;
  }

  @Input('systemInstumentList') set _setSystemInstumentList(
    systemInstumentList
  ) {
    if (!systemInstumentList) {
      return;
    }
    this.systemInstumentList = systemInstumentList;
  }

  @Input('formulaPlusMinusList') set _setFormulaPlusMinusList(
    formulaPlusMinusList
  ) {
    if (!formulaPlusMinusList) {
      return;
    }
    this.formulaPlusMinusList = formulaPlusMinusList;
  }

  @Input('marketPriceList') set _setMarketPriceList(marketPriceList) {
    if (!marketPriceList) {
      return;
    }
    this.marketPriceList = marketPriceList;
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

  @Input('dayOfWeekList') set _setDayOfWeekList(dayOfWeekList) {
    if (!dayOfWeekList) {
      return;
    }
    this.dayOfWeekList = dayOfWeekList;
  }

  @Input('holidayRuleList') set _setHolidayRuleList(holidayRuleList) {
    if (!holidayRuleList) {
      return;
    }
    this.holidayRuleList = holidayRuleList;
  }

  @Input('hasInvoicedOrder') set _setHasInvoicedOrder(hasInvoicedOrder) {
    if (!hasInvoicedOrder) {
      return;
    }
    this.hasInvoicedOrder = hasInvoicedOrder;
  }

  @Input() events: Observable<void>;

  expandPricingDayCalendar: any = false;
  expandEventDayCalendar: any = false;

  constructor(
    public gridViewModel: OrderListGridViewModel,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.entityName = 'Contract';
    //this.eventsSubscription = this.events.subscribe((data) => this.setContractForm(data));
  }

  setContractForm(form) {
    this.formValues = form;
  }

  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  originalOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => {
    return 0;
  };

  displayFn(value): string {
    return value && value.name ? value.name : '';
  }

  calendarOptionChange(ob: MatCheckboxChange, object, id, name, day) {
    if (ob.checked) {
      if (typeof object == 'undefined' || !object) {
        object = {
          id: id,
          name: name
        };
      }
      object.id = id;
      object.name = name;
      if (day == 'Sunday') {
        this.formValues.pricingScheduleOptionEventBasedContinuous.sundayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Monday') {
        this.formValues.pricingScheduleOptionEventBasedContinuous.mondayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Tuesday') {
        this.formValues.pricingScheduleOptionEventBasedContinuous.tuesdayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Wednesday') {
        this.formValues.pricingScheduleOptionEventBasedContinuous.wednesdayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Thursday') {
        this.formValues.pricingScheduleOptionEventBasedContinuous.thursdayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Friday') {
        this.formValues.pricingScheduleOptionEventBasedContinuous.fridayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Saturday') {
        this.formValues.pricingScheduleOptionEventBasedContinuous.saturdayHolidayRule = _.cloneDeep(
          object
        );
      }
    } else {
      if (day == 'Sunday') {
        this.formValues.pricingScheduleOptionEventBasedContinuous.sundayHolidayRule = null;
      } else if (day == 'Monday') {
        this.formValues.pricingScheduleOptionEventBasedContinuous.mondayHolidayRule = null;
      } else if (day == 'Tuesday') {
        this.formValues.pricingScheduleOptionEventBasedContinuous.tuesdayHolidayRule = null;
      } else if (day == 'Wednesday') {
        this.formValues.pricingScheduleOptionEventBasedContinuous.wednesdayHolidayRule = null;
      } else if (day == 'Thursday') {
        this.formValues.pricingScheduleOptionEventBasedContinuous.thursdayHolidayRule = null;
      } else if (day == 'Friday') {
        this.formValues.pricingScheduleOptionEventBasedContinuous.fridayHolidayRule = null;
      } else if (day == 'Saturday') {
        this.formValues.pricingScheduleOptionEventBasedContinuous.saturdayHolidayRule = null;
      }
    }
  }

  calendarOptionHolidayRuleChange(
    ob: MatCheckboxChange,
    object,
    id,
    name,
    day
  ) {
    if (ob.checked) {
      if (typeof object == 'undefined' || !object) {
        object = {
          id: id,
          name: name
        };
      }
      object.id = id;
      object.name = name;
      if (day == 'Sunday') {
        this.formValues.formulaHolidayRules.sundayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Monday') {
        this.formValues.formulaHolidayRules.mondayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Tuesday') {
        this.formValues.formulaHolidayRules.tuesdayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Wednesday') {
        this.formValues.formulaHolidayRules.wednesdayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Thursday') {
        this.formValues.formulaHolidayRules.thursdayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Friday') {
        this.formValues.formulaHolidayRules.fridayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Saturday') {
        this.formValues.formulaHolidayRules.saturdayHolidayRule = _.cloneDeep(
          object
        );
      }
    } else {
      if (day == 'Sunday') {
        this.formValues.formulaHolidayRules.sundayHolidayRule = null;
      } else if (day == 'Monday') {
        this.formValues.formulaHolidayRules.mondayHolidayRule = null;
      } else if (day == 'Tuesday') {
        this.formValues.formulaHolidayRules.tuesdayHolidayRule = null;
      } else if (day == 'Wednesday') {
        this.formValues.formulaHolidayRules.wednesdayHolidayRule = null;
      } else if (day == 'Thursday') {
        this.formValues.formulaHolidayRules.thursdayHolidayRule = null;
      } else if (day == 'Friday') {
        this.formValues.formulaHolidayRules.fridayHolidayRule = null;
      } else if (day == 'Saturday') {
        this.formValues.formulaHolidayRules.saturdayHolidayRule = null;
      }
    }
  }

  defaultHolidayRuleDays(event) {
    if (
      this.formValues.pricingScheduleOptionEventBasedContinuous.period.id != 4
    ) {
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
    } else {
      this.formValues.pricingScheduleOptionEventBasedContinuous.sundayHolidayRule = _.cloneDeep(
        this.holidayRuleList[0]
      );
      this.formValues.pricingScheduleOptionEventBasedContinuous.mondayHolidayRule = _.cloneDeep(
        this.holidayRuleList[0]
      );
      this.formValues.pricingScheduleOptionEventBasedContinuous.tuesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[0]
      );
      this.formValues.pricingScheduleOptionEventBasedContinuous.wednesdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[0]
      );
      this.formValues.pricingScheduleOptionEventBasedContinuous.thursdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[0]
      );
      this.formValues.pricingScheduleOptionEventBasedContinuous.fridayHolidayRule = _.cloneDeep(
        this.holidayRuleList[0]
      );
      this.formValues.pricingScheduleOptionEventBasedContinuous.saturdayHolidayRule = _.cloneDeep(
        this.holidayRuleList[0]
      );
    }

    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit(): void {}
}
