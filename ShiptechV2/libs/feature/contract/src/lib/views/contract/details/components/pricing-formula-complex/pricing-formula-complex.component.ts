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
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'shiptech-pricing-formula-complex',
  templateUrl: './pricing-formula-complex.component.html',
  styleUrls: ['./pricing-formula-complex.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [OrderListGridViewModel, DialogService, ConfirmationService]
})
export class PricingFormulaComplex extends DeliveryAutocompleteComponent
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
    if (
      this.formValues.complexFormulaQuoteLines &&
      this.formValues.complexFormulaQuoteLines.length
    ) {
      this.formatAmount();
    }
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
    this.baseOrigin = new URL(window.location.href).origin;
    this.amountFormat =
      '1.' +
      this.tenantService.amountPrecision +
      '-' +
      this.tenantService.amountPrecision;
  }

  ngOnInit() {
    this.entityName = 'Contract';
    this.autocompleteCurrency = knownMastersAutocomplete.currency;
    //this.eventsSubscription = this.events.subscribe((data) => this.setContractForm(data));
  }

  setContractForm(form) {
    this.formValues = form;
    console.log(this.formValues);
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

  selectCurrency(event: MatAutocompleteSelectedEvent) {
    this.formValues.currency = event.option.value;
    if (
      !this.formValues.complexFormulaQuoteLines ||
      !this.formValues.complexFormulaQuoteLines.length
    ) {
      this.formValues.complexFormulaQuoteLines = [
        {
          id: 0,
          weight: '100',
          formulaFunction: {
            id: 1,
            name: 'Min',
            internalName: null,
            code: null
          }
        }
      ];
      if (!this.formValues.isMean) {
        this.formValues.complexFormulaQuoteLines[0].formulaOperation = {
          id: 1,
          name: 'Add',
          internalName: null,
          code: null
        };
      } else {
        this.formValues.complexFormulaQuoteLines[0].formulaOperation = {
          id: 3,
          name: 'Mean',
          internalName: null,
          code: null
        };
      }
      this.formValues.complexFormulaQuoteLines[0].systemInstruments = [
        {
          id: 0
        },
        {
          id: 0
        },
        {
          id: 0
        }
      ];
    }
  }

  filterCurrencyList() {
    if (this.formValues.currency) {
      const filterValue = this.formValues.currency.name
        ? this.formValues.currency.name.toLowerCase()
        : this.formValues.currency.toLowerCase();
      console.log(filterValue);
      if (this.currencyList) {
        return this.currencyList
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

  getHeaderNameSelector1(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.currency:
        return knowMastersAutocompleteHeaderName.currency;
      default:
        return knowMastersAutocompleteHeaderName.currency;
    }
  }

  selectorCurrencySelectionChange(selection: IOrderLookupDto): void {
    if (selection === null || selection === undefined) {
      this.formValues.currency = '';
    } else {
      const obj = {
        id: selection.id,
        name: selection.name
      };
      this.formValues.currency = obj;
      this.changeDetectorRef.detectChanges();
    }
  }

  isMeanChange(ob: MatCheckboxChange) {
    console.log('checked: ' + ob.checked);
    if (ob.checked) {
      for (
        let i = 0;
        i < this.formValues.complexFormulaQuoteLines.length;
        i++
      ) {
        this.formValues.complexFormulaQuoteLines[i].formulaOperation.id = 3;
        this.formValues.complexFormulaQuoteLines[i].formulaOperation.name =
          'Mean';
      }
      this.changeDetectorRef.detectChanges();
    }
  }

  addComplexFormulaQuoteLine() {
    if (!this.formValues.complexFormulaQuoteLines) {
      this.formValues.complexFormulaQuoteLines = [];
    }
    var count = 0;
    this.formValues.complexFormulaQuoteLines.forEach((val, key) => {
      if (!val.isDeleted) {
        count++;
      }
    });
    if (count < 3) {
      this.formValues.complexFormulaQuoteLines.push({
        id: 0,
        formulaOperation: {
          id: this.formValues.isMean ? 3 : 1,
          name: this.formValues.isMean ? 'Mean' : 'Add',
          internalName: null,
          code: null
        },
        weight: '100',
        formulaFunction: {
          id: 1,
          name: 'Min',
          internalName: null,
          code: null
        },
        systemInstruments: [
          {
            id: 0
          },
          {
            id: 0
          },
          {
            id: 0
          }
        ]
      });
    } else {
      this.toastr.error('Max 3 Quotes allowed');
    }
  }

  removeComplexFormulaQuoteLine(key) {
    var count = this.formValues.complexFormulaQuoteLines.length;
    if (count > 1) {
      if (this.formValues.complexFormulaQuoteLines[key].id > 0) {
        this.formValues.complexFormulaQuoteLines[key].isDeleted = true;
      } else {
        this.formValues.complexFormulaQuoteLines.splice(key, 1);
      }
    } else {
      this.toastr.error('Min 1 Quote');
    }
  }

  setFormulaOperation(value, line) {
    let findObject = _.find(this.formulaOperationList, function(obj) {
      return obj.id == value;
    });
    if (findObject != -1) {
      this.formValues.complexFormulaQuoteLines[
        line
      ].formulaOperation = _.cloneDeep(findObject);
    }
    console.log(value);
  }

  selectSystemInstrumentFromComplexFormulaQuoteLine(value, line, key) {
    this.formValues.complexFormulaQuoteLines[line].systemInstruments[
      key
    ].systemInstrument = value;
  }

  filterSystemInstrumentListFromComplexFormulaQuoteLine(value) {
    if (value) {
      const filterValue = value.toLowerCase();
      if (this.systemInstumentList) {
        return this.systemInstumentList
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

  formatAmount() {
    for (let i = 0; i < this.formValues.complexFormulaQuoteLines.length; i++) {
      if (this.formValues.complexFormulaQuoteLines[i].amount) {
        this.formValues.complexFormulaQuoteLines[
          i
        ].amount = this.amountFormatValue(
          this.formValues.complexFormulaQuoteLines[i].amount
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
