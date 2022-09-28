import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  Input,
  Inject,
  ChangeDetectorRef,
  ViewChildren
} from '@angular/core';
import { Observable } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { IOrderLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import {
  knowMastersAutocompleteHeaderName,
  knownMastersAutocomplete
} from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { OrderListGridViewModel } from '@shiptech/core/ui/components/delivery/view-model/order-list-grid-view-model.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import _ from 'lodash';
import {MatDialog} from '@angular/material/dialog';
import { DecimalPipe, KeyValue } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { Store } from '@ngxs/store';
@Component({
  selector: 'shiptech-pricing-formula-simple',
  templateUrl: './pricing-formula-simple.component.html',
  styleUrls: ['./pricing-formula-simple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [OrderListGridViewModel, DialogService, ConfirmationService]
})
export class PricingFormulaSimple implements OnInit {
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
 disabled : boolean;
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
  amountFormat: string;
  hasInvoicedOrder: any;
  massUomName : any;
  volumeUomName : string;
  conversionFactor : number;
  checkRequestStatus: boolean = false;

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
    console.log(this.formValues);
    if (this.formValues.simpleFormula && this.formValues.simpleFormula.amount) {
      this.formValues.simpleFormula.amount = this.amountFormatValue(
        this.formValues.simpleFormula.amount
      );
    
    }else{
      if( this.formValues.simpleFormula){
       //  simpleFormula value will be assigned from api
      }else{
         /*switching from complex to simple formula*/
        this.formValues.simpleFormula = {
          plusMinus: { id: 0 },
          priceType: { id: 0 },
          systemInstrument: { id:0,name:''},
          flatPercentage: {
            id: 0
          },
          uom: {},
          amount: 0
       };
      }
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
    public changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    @Inject(DecimalPipe) private _decimalPipe,
    private tenantService: TenantFormattingService,
    private store: Store
  ) {
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
    this.autocompleteSystemInstrument =
      knownMastersAutocomplete.systemInstrument;
    this.entityName = 'Contract';
    //this.eventsSubscription = this.events.subscribe((data) => this.setContractForm(data));

    this.store.selectSnapshot<any>((state: any) => {
      if(state.spotNegotiation.currentRequestSmallInfo.status == 'Stemmed'){
        this.checkRequestStatus = true;
        this.hasInvoicedOrder = true;
      }
    });

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

  selectSystemInstrument(event: MatAutocompleteSelectedEvent) {
    this.formValues.simpleFormula.systemInstrument = event.option.value;
  }

  filterSystemInstrumenttList() {
    if (this.formValues.simpleFormula.systemInstrument) {

   
    
      if(this.formValues.simpleFormula.systemInstrument.name == ""){
        console.log(this.formValues.simpleFormula.systemInstrument);
        const filterValue = this.formValues.simpleFormula.systemInstrument.name.toLowerCase();
        return this.systemInstumentList
        .filter(
          option =>
            option.name.toLowerCase(filterValue.trim())
        )
        .slice(0, 10);
       
      }

      const filterValue = this.formValues.simpleFormula.systemInstrument.name
        ? this.formValues.simpleFormula.systemInstrument.name.toLowerCase()
        : this.formValues.simpleFormula.systemInstrument.toLowerCase();
      if (this.systemInstumentList) {
        return this.systemInstumentList
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

  getHeaderNameSelector(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.systemInstrument:
        return knowMastersAutocompleteHeaderName.systemInstrument;
      default:
        return knowMastersAutocompleteHeaderName.systemInstrument;
    }
  }

  selectorSystemInstumentSelectionChange(selection: IOrderLookupDto): void {
    if (selection === null || selection === undefined) {
      this.formValues.simpleFormula.systemInstrument = '';
    } else {
      const obj = {
        id: selection.id,
        name: selection.name
      };
      this.formValues.simpleFormula.systemInstrument = obj;
      this.changeDetectorRef.detectChanges();
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
