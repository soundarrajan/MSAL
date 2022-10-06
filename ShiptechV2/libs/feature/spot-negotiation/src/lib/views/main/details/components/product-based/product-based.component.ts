import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Inject,
  ChangeDetectorRef
} from '@angular/core';
import {  Observable } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { OrderListGridViewModel } from '@shiptech/core/ui/components/delivery/view-model/order-list-grid-view-model.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import _ from 'lodash';
import {MatDialog} from '@angular/material/dialog';
import { DecimalPipe, KeyValue } from '@angular/common';

@Component({
  selector: 'shiptech-product-based',
  templateUrl: './product-based.component.html',
  styleUrls: ['./product-based.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [OrderListGridViewModel, DialogService, ConfirmationService]
})
export class ProductBased implements OnInit {
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
  businessCalendarList: any;
  formulaEventIncludeList: any;
  quantityTypeList: any;
  uomList: any;
  productList: any;
  amountFormat: string;
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
    if (
      this.formValues.productDiscountRules &&
      this.formValues.productDiscountRules.length
    ) {
      this.formatValues();
    }
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

  @Input('uomList') set _setUomList(uomList) {
    if (!uomList) {
      return;
    }
    this.uomList = uomList;
  }

  @Input('productList') set _setProductList(productList) {
    if (!productList) {
      return;
    }
    this.productList = productList;
  }

  @Input('hasInvoicedOrder') set _setHasInvoicedOrder(hasInvoicedOrder) {
    if (!hasInvoicedOrder) {
      return;
    }
    this.hasInvoicedOrder = hasInvoicedOrder;
  }

  @Input() events: Observable<void>;

  constructor(
    public gridViewModel: OrderListGridViewModel,
    changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    @Inject(DecimalPipe) private _decimalPipe,
    private tenantService: TenantFormattingService,
  ) {
    this.amountFormat =
      '1.' +
      this.tenantService.amountPrecision +
      '-' +
      this.tenantService.amountPrecision;
  }

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

  addNewProductBasedLine() {
    if (!this.formValues.productDiscountRules) {
      this.formValues.productDiscountRules = [];
    }
    this.formValues.productDiscountRules.push({ id: 0 });
  }

  removeProductBasedLine(key) {
    if (this.formValues.productDiscountRules[key].id) {
      this.formValues.productDiscountRules[key].isDeleted = true;
    } else {
      this.formValues.productDiscountRules.splice(key, 1);
    }
  }

  filterProductList(value) {
    if (value) {
      const filterValue = value.toLowerCase();
      if (this.productList) {
        return this.productList
          .filter(
            option =>
              option.name.toLowerCase().indexOf(filterValue.trim()) === 0
          )
          .slice(0, 10);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  selectProductDiscountRuleLine(value, line) {
    this.formValues.productDiscountRules[line].product = value;
  }

  formatValues() {
    for (let i = 0; i < this.formValues.productDiscountRules.length; i++) {
      if (this.formValues.productDiscountRules[i].amount) {
        this.formValues.productDiscountRules[i].amount = this.amountFormatValue(
          this.formValues.productDiscountRules[i].amount
        );
      }
    }
  }

  amountFormatValue(value) {
    if (typeof value == 'undefined' || !value) {
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

  ngAfterViewInit(): void {}
}
