import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  Input,
  ViewChildren
} from '@angular/core';
import {  Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import {
  knownMastersAutocomplete
} from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { OrderListGridViewModel } from '@shiptech/core/ui/components/delivery/view-model/order-list-grid-view-model.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

import moment from 'moment';
import _ from 'lodash';
import {MatDialog} from '@angular/material/dialog';
import { KeyValue } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'shiptech-specific-dates',
  templateUrl: './specific-dates.component.html',
  styleUrls: ['./specific-dates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [OrderListGridViewModel, DialogService, ConfirmationService]
})
export class SpecificDates implements OnInit {
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
  formulaFlatPercentageList: any;
  systemInstumentList: any;
  formulaPlusMinusList: any;
  marketPriceList: any;
  autocompleteSystemInstrument: knownMastersAutocomplete;
  currencyList: any;
  autocompleteCurrency: knownMastersAutocomplete;
  formulaOperationList: any;
  formulaFunctionList: any;
  marketPriceTypeList: any;
  isValidFromDateInvalid: boolean;
  isValidToDateInvalid: boolean;

  expandPricingDayCalendar: any = false;
  expandEventDayCalendar: any = false;
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

  @Input('contractProductIndex') set _setContractProductIndex(
    contractProductIndex
  ) {
    if (!contractProductIndex) {
      return;
    }
    this.selectedTabIndex = contractProductIndex;
  }

  @Input('locationMasterList') set _setLocationMasterList(locationMasterList) {
    if (!locationMasterList) {
      return;
    }
    this.locationMasterList = _.cloneDeep(locationMasterList);
  }

  @Input('productMasterList') set _setProductMasterList(productMasterList) {
    if (!productMasterList) {
      return;
    }

    this.productMasterList = _.cloneDeep(productMasterList);
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
  }

  @Input('generalTenantSettings') set _setGeneralTenantSettings(
    generalTenantSettings
  ) {
    if (!generalTenantSettings) {
      return;
    }
    this.generalTenantSettings = generalTenantSettings;
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

  @Input('hasInvoicedOrder') set _setHasInvoicedOrder(hasInvoicedOrder) {
    if (!hasInvoicedOrder) {
      return;
    }
    this.hasInvoicedOrder = hasInvoicedOrder;
  }

  index = 0;
  expandLocationPopUp = false;
  array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  isMenuOpen = true;
  @Input() events: Observable<void>;

  constructor(
    public gridViewModel: OrderListGridViewModel,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private tenantService: TenantFormattingService,
  ) {
    this.autocompletePhysicalSupplier =
      knownMastersAutocomplete.physicalSupplier;
    this.baseOrigin = new URL(window.location.href).origin;
    this.quantityFormat =
      '1.' +
      this.tenantService.quantityPrecision +
      '-' +
      this.tenantService.quantityPrecision;
  }

  ngOnInit() {
    this.entityName = 'Contract';
    this.autocompleteCurrency = knownMastersAutocomplete.currency;
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

  onChange($event, field) {
    if ($event.value) {
      let beValue = `${moment($event.value).format(
        'YYYY-MM-DDTHH:mm:ss'
      )}+00:00`;
      if (field == 'from') {
        this.isValidFromDateInvalid = false;
      } else if (field == 'to') {
        this.isValidToDateInvalid = false;
      }
    } else {
      if (field == 'from') {
        this.isValidFromDateInvalid = true;
      } else if (field == 'to') {
        this.isValidToDateInvalid = true;
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
        this.formValues.pricingScheduleOptionSpecificDate.sundayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Monday') {
        this.formValues.pricingScheduleOptionSpecificDate.mondayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Tuesday') {
        this.formValues.pricingScheduleOptionSpecificDate.tuesdayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Wednesday') {
        this.formValues.pricingScheduleOptionSpecificDate.wednesdayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Thursday') {
        this.formValues.pricingScheduleOptionSpecificDate.thursdayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Friday') {
        this.formValues.pricingScheduleOptionSpecificDate.fridayHolidayRule = _.cloneDeep(
          object
        );
      } else if (day == 'Saturday') {
        this.formValues.pricingScheduleOptionSpecificDate.saturdayHolidayRule = _.cloneDeep(
          object
        );
      }
    } else {
      if (day == 'Sunday') {
        this.formValues.pricingScheduleOptionSpecificDate.sundayHolidayRule = null;
      } else if (day == 'Monday') {
        this.formValues.pricingScheduleOptionSpecificDate.mondayHolidayRule = null;
      } else if (day == 'Tuesday') {
        this.formValues.pricingScheduleOptionSpecificDate.tuesdayHolidayRule = null;
      } else if (day == 'Wednesday') {
        this.formValues.pricingScheduleOptionSpecificDate.wednesdayHolidayRule = null;
      } else if (day == 'Thursday') {
        this.formValues.pricingScheduleOptionSpecificDate.thursdayHolidayRule = null;
      } else if (day == 'Friday') {
        this.formValues.pricingScheduleOptionSpecificDate.fridayHolidayRule = null;
      } else if (day == 'Saturday') {
        this.formValues.pricingScheduleOptionSpecificDate.saturdayHolidayRule = null;
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

  addNewSpecificDateLine() {
    if (!this.formValues.pricingScheduleOptionSpecificDate.dates) {
      this.formValues.pricingScheduleOptionSpecificDate.dates = [];
    }
    this.formValues.pricingScheduleOptionSpecificDate.dates.push({ id: 0 });
  }

  removeSpecificDateLine(key) {
    if (
      this.formValues.pricingScheduleOptionSpecificDate.dates &&
      this.formValues.pricingScheduleOptionSpecificDate.dates[key]
    ) {
      if (this.formValues.pricingScheduleOptionSpecificDate.dates[key].id) {
        this.formValues.pricingScheduleOptionSpecificDate.dates[
          key
        ].isDeleted = true;
      } else {
        this.formValues.pricingScheduleOptionSpecificDate.dates.splice(key, 1);
      }
    }
  }

  ngAfterViewInit(): void {}
}
