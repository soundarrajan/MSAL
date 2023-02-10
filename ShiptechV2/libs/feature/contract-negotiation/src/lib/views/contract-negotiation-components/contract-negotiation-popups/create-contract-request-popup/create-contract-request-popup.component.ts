import { ChangeDetectorRef, Component, Inject, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { KeyValue } from '@angular/common';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from '../../../../services/local-service.service';
import { SendRfqPopupComponent } from '../send-rfq-popup/send-rfq-popup.component';
import { UpdateRfqPopupComponent } from '../update-rfq-popup/update-rfq-popup.component';
import { SearchProductsPopupComponent } from '@shiptech/core/ui/components/designsystem-v2/search-products-popup/search-products-popup.component';
import { SearchLocationPopupComponent } from '@shiptech/core/ui/components/designsystem-v2/search-location-popup/search-location-popup.component';
import { ContractNegotiationService } from '../../../../services/contract-negotiation.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { Store } from '@ngxs/store';
import { Router } from "@angular/router"
import moment from 'moment';
import { Subject } from 'rxjs';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { DecimalPipe } from '@angular/common';
import _ from 'lodash';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { ContractNegotiationStoreModel } from '../../../../store/contract-negotiation.store';
//import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-create-contract-request-popup',
  templateUrl: './create-contract-request-popup.component.html',
  styleUrls: ['./create-contract-request-popup.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class CreateContractRequestPopupComponent implements OnInit {
  currentUserId = 0;
  /* Form Builder */
  isValidForm = false;
  mainProductCounter = 0;
  mainLocations = [];
  productAllowedLocations = [];
  locationBasedProducts = [];
  selectedLocationId = 0;
  isNewRequest = true;
  listData: any[] = [];
  productsListData: any = {};

  get newQuantityDetails(): any {
    return {
      contractualQuantityOptionId: 1,
      minQuantity: this.quantityFormatValue(0),
      maxQuantity: this.quantityFormatValue(0),
      uomId: this.defaultUOM.id,
      tolerancePercentage: this.quantityFormatValue(0)
    }
  }

  get newAllowedProducts(): any {
    return {
      productId: '',
      specGroupId: ''
    };
  }

  get newAllowedLocations(): any {
    return {
      locationId: ''
    };
  }

  get newContractRequestProducts(): any {
    return {
      id: 0,
      contractRequestId: 0,
      locationId: '',
      productId: '',
      specGroupId: '',
      minQuantity: this.quantityFormatValue(0),
      minQuantityUomId: this.defaultUOM.id,
      maxQuantity: this.quantityFormatValue(0),
      maxQuantityUomId: this.defaultUOM.id,
      pricingTypeId: 2,
      pricingComment: "",
      statusId: 1,
      status: 'Open',
      createdById: 0,
      lastModifiedById: 0,
      isDeleted: false,
      allowedProducts: [],
      allowedLocations: [],
      contractRequestProductOffers: []
    }
  }

  reqObj: any = {
    id: 0,
    startDate: "",
    endDate: "",
    quoteByDate: "",
    minValidity: "",
    supplierComments: "",
    statusId: 1,
    status: 'Open',
    createdById: 0,
    lastModifiedById: 0,
    quantityDetails: [],
    contractRequestProducts: []
  }
  /* Form Builder */
  
  @Input() rfqSent;
  enableSaveBtn = true;
  tempReqObj: any = {};
  contractQuarterColumns: string[] = ['quarter', 'blank'];
  selectedPlanPeriod = 'Quarter';
  planStartDate: any;
  planEndDate: any;
  planLabel: string = "";
  selectedPlanValue = '';
  planPeriod = [
    { 'type': 'Quarter', 'selected': true },
    { 'type': 'Month', 'selected': false },
    { 'type': 'Year', 'selected': false },
    { 'type': 'Semester', 'selected': false }
  ];
  plan = {
    quarterlyPeriod: [],
    monthlyPeriod: [],
    yearlyPeriod: [],
    semesterPeriod: []
  };
  selectedProduct = '';
  displayedColumns: string[] = ['location'];
  showMainLocationDropdown: boolean = true;
  hideAllowedLocationDropdown: any[] = [];
  public mainLocationName: any[] = [];
  public allowedLocationName: any[] = [];
  selectedMainLocationName: string;
  @ViewChild('mainLocationSelect') mainLocationSelect: MatSelect;
  @ViewChildren('mainProductSelect') mainProductSelects: QueryList<MatSelect>;
  @ViewChildren('allowedProductSelects') allowedProductSelects: QueryList<MatSelect>;
  @ViewChildren('allowedLocationSelect') allowedLocationSelect: QueryList<MatSelect>;
  displayedLocColumns: string[] = ['name'];
  displayedColumns2: string[] = ['name',];
  
  public locationSelected: boolean = false;
  public productSelected: boolean = false;
  public selectedLocname;
  public selectedLocindex: number;
  public selectedProindex: number;
  public selectedProname;
  public expandLocation: boolean = false;

  staticData: any = {
    Location: [],
    Product: [],
    PricingType: [],
    QuantityType: [],
    SpecGroup: [],
    Uom: []
  };
  searchFilterString: any[] = [];
  locationsList = new Subject();
  public locColsToDispay: any[] = [
    { dispName: "Locations", propName: "name"},
  ];
  generalTenantSettings: IGeneralTenantSettings;
  defaultUOM: any;
  quantityPrecision: number = 3;
  quantityFormat: string;

  constructor(
    private localService: LocalService,
    public dialog: MatDialog,
    private toaster: ToastrService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DecimalPipe) private _decimalPipe,
    private contractNegotiationService: ContractNegotiationService,
    private format: TenantFormattingService,
    private store: Store,
    private router: Router,
    private tenantSettingsService: TenantSettingsService,
    private db: LegacyLookupsDatabase,
    private _cdr: ChangeDetectorRef
  ) {
    if(this.data.requestId){
      this.isNewRequest = false;
    }
    iconRegistry.addSvgIcon('data-picker-gray', sanitizer.bypassSecurityTrustResourceUrl('../../../../../../../../../v2/assets/design-system-icons/shiptech/common-icons/calendar-dark.svg'));
    this.plan.quarterlyPeriod = this.generateQuarterlyPeriod();
    this.plan.monthlyPeriod = this.generateMonthlyPeriod();
    this.plan.yearlyPeriod = this.generateYearlyPeriod();
    this.plan.semesterPeriod = this.generateSemesterPeriod();
    this.getStaticData().then(data => {
      this.staticData = _.cloneDeep(data);
      
      /* set plan period data */
      this.planStartDate = new Date(this.plan.quarterlyPeriod[0].startDate);
      this.planEndDate = new Date(this.plan.quarterlyPeriod[0].endDate);
      this.planLabel = this.plan.quarterlyPeriod[0].label;
      /* set plan period data */
      
      this.locationsList.next(data.Location);

      if(this.isNewRequest) {
        this.reqObj.quantityDetails.push(this.newQuantityDetails);
        this.addNewMainProduct(0);
      } else {
        this.openRequest();
      }
      this._cdr.detectChanges();
    });
    this.generalTenantSettings = this.tenantSettingsService.getGeneralTenantSettings();
    this.defaultUOM = this.generalTenantSettings.tenantFormats.uom;
    this.quantityPrecision = this.format.quantityPrecision;
    this.quantityFormat =
      '1.' +
      this.quantityPrecision +
      '-' +
      this.quantityPrecision;
    this.currentUserId = this.store.selectSnapshot(UserProfileState.user).id;
  }
  
  async getStaticData() {
    this._cdr.markForCheck();
    return {
      Uom: await this.db.getUomTable({ orderBy: 'name' }),
      Product: await this.db.getProductList({ orderBy: 'name' }),
      ContractualQuantityOption: await this.db.getContractualQuantityOptionsList({ orderBy: 'name' }),
      Location: await this.db.getLocationList({ orderBy: 'name' }),
      SpecGroup: await this.db.getSpecGroupList({ orderBy: 'name' }),
      PricingType: await this.db.getPricingTypeList({ orderBy: 'name' })
    }
  }

  ngOnInit(): void {
    this.rfqSent = true;
  }

  getAndConstructDataFromStore(){
    let requestId = this.data.requestId;
    let storeDataObj = JSON.parse(JSON.stringify(this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
      return state['contractNegotiation'].ContractRequest[0];
    })));
    let storeReqObj = {
      id: storeDataObj.id,
      startDate: storeDataObj.startDate,
      endDate: storeDataObj.endDate,
      quoteByDate: storeDataObj.quoteByDate,
      minValidity: storeDataObj.minValidity,
      supplierComments: storeDataObj.supplierComments,
      statusId: storeDataObj.statusId,
      status: storeDataObj.status,
      createdById: storeDataObj.createdById,
      createdOn: storeDataObj.createdOn,
      lastModifiedById: storeDataObj.lastModifiedById,
      lastModifiedOn: storeDataObj.lastModifiedOn,
      quantityDetails: storeDataObj.quantityDetails,
      contractRequestProducts: []
    }

    storeDataObj.locations.forEach( reqProduct => {
      let contractReqProdObj = {
        id: reqProduct['contractRequestProductId'],
        contractRequestId: requestId,
        locationId: reqProduct['location-id'],
        productId: reqProduct['productId'],
        specGroupId: reqProduct['specGroupId'],
        minQuantity: this.quantityFormatValue(reqProduct['minQuantity']),
        minQuantityUomId: reqProduct['maxQuantityUomId'],
        maxQuantity: this.quantityFormatValue(reqProduct['maxQuantity']),
        maxQuantityUomId: reqProduct['maxQuantityUomId'],
        pricingTypeId: reqProduct['pricingTypeId'],
        pricingComment: reqProduct['pricingComment'],
        statusId: reqProduct['statusId'],
        status: reqProduct['status'],
        createdById: reqProduct['createdById'],
        lastModifiedById: reqProduct['lastModifiedById'],
        createdOn: reqProduct['createdOn'],
        lastModifiedOn: reqProduct['lastModifiedOn'],
        isDeleted: reqProduct['isDeleted'],
        allowedProducts: reqProduct['allowedProducts'],
        allowedLocations: reqProduct['allowedLocations'],
        contractRequestProductOffers: []
      };

      if(reqProduct.data && reqProduct.data.length > 0){
        reqProduct.data.forEach( offerData => {
          let prodOffers = {
            offerPrice: offerData['OfferPrice'],
            pricingTypeId: offerData['pricingTypeId'],
            lastEvaluationDate: offerData['lastEvaluationDate'],
            forwardPrices: offerData['forwardPrices'],
            isNoQuote: offerData['isNoQuote'],
            status: offerData['Status'],
            genRating: offerData['GenRating'],
            portRating: offerData['PortRating'],
            isSellerSuspended: offerData['isSellerSuspended'],
            statusId: offerData['statusId'],
            isSelected: offerData['check'],
            id: offerData['id'],
            productId: offerData['ProductId'],
            specGroupId: offerData['SpecGroupId'],
            minQuantity: offerData['MinQuantity'],
            minQuantityUomId: offerData['UomId'],
            maxQuantity: offerData['MaxQuantity'],
            maxQuantityUomId: offerData['UomId'],
            quantityUomId: offerData['UomId'],
            validityDate: offerData['offerValidityDate'],
            currencyId: offerData['PriceCurrencyId'],
            contractRequestProductId: offerData['contractRequestProductId'],
            contractRequestProductOfferIds : offerData['contractRequestProductOfferIds'],
            counterpartyId: offerData['CounterpartyId'],
            counterpartyName: offerData['CounterpartyName'],
            createdById: offerData['createdById'],
            lastModifiedById: offerData['lastModifiedById'],
            createdOn: offerData['createdOn'],
            lastModifiedOn: offerData['lastModifiedOn']
          };
          contractReqProdObj.contractRequestProductOffers.push(prodOffers);
        });
      }
      storeReqObj.contractRequestProducts.push(contractReqProdObj);
    });
    return storeReqObj;
  }

  openRequest(){
    this.reqObj = JSON.parse(JSON.stringify(this.getAndConstructDataFromStore()));
    this.tempReqObj = JSON.parse(JSON.stringify(this.getAndConstructDataFromStore()));
    this.reqObj.quantityDetails.forEach((q, i) => {
      q.minQuantity = this.quantityFormatValue(q.minQuantity);
      q.maxQuantity = this.quantityFormatValue(q.maxQuantity);
      q.tolerancePercentage = this.quantityFormatValue(q.tolerancePercentage);
    })
    this.reqObj.contractRequestProducts.forEach( (item, i) => {
      let location = this.staticData.Location.find( x => x.id == item.locationId);
      let newLocation = {
        locationId: location.id,
        locationName: location.name,
        selected: (i == 0)?true:false
      };
      if(newLocation.selected == true) this.selectedMainLocationName = newLocation.locationName;
      if (this.mainLocations.findIndex((l) => l.locationId == item.locationId) === -1) this.mainLocations.push(newLocation);
      this.searchFilterString.push({ mainProduct: '', allowedProducts: [], allowedLocations: '', });
      this.hideAllowedLocationDropdown[i] = false;
      this.listData[i] = {mainProduct: [], specGroup: [], allowedProducts: [], allowedLocations: []};
      this.listData[i].mainProduct = (_.cloneDeep(this.staticData.Product)).splice(0, 10);
      this.onMainProductChange(this.reqObj.contractRequestProducts[i].productId, i, false);
      item.minQuantity = this.quantityFormatValue(item.minQuantity);
      item.maxQuantity = this.quantityFormatValue(item.maxQuantity);
      if(item.allowedProducts.length > 0) {
        item.allowedProducts.forEach( (proItem, j) => {
          this.searchFilterString[i].allowedProducts.push({product: '', specGroup:'' });
          this.listData[i].allowedProducts.push({
            products: (_.cloneDeep(this.staticData.Product)).sort((a, b) => a.name.localeCompare(b.name)).splice(0, 10),
            specGroup: []
          });
          this.setProductChange(proItem.productId,i,j, false);
        });
      }
      if(item.allowedLocations.length > 0) {
        this.productAllowedLocations[i] = [];
        item.allowedLocations.forEach( (locItem, j) => {
          let location = this.staticData.Location.find( x => x.id == locItem.locationId);
          this.productAllowedLocations[i].push({
            id: location.id,
            name: location.name,
            selected: true
          })
        })
      }
      if(this.productAllowedLocations.length > 0) this.hideAllowedLocationDropdown[i] = true;
    });
    this.selectedLocationId = this.mainLocations[0].locationId;
    this.showMainLocationDropdown = false;
  }

  getLocationProducts(locationId?: number) {
    let locId = (locationId)?locationId:this.selectedLocationId;
    return this.reqObj.contractRequestProducts.filter((x) => x.locationId === locId && !x.isDeleted);
  }

  getLocationProductIndex(index){
    return this.reqObj.contractRequestProducts.filter((e, i) => (i <= index && e.locationId == this.selectedLocationId && !e.isDeleted)).length-1;
  }

  applyPlanPeriod(){
    this.reqObj.startDate = this.planStartDate;
    this.reqObj.endDate = this.planEndDate;
    this.selectedPlanValue = this.planLabel;
  }

  quantityFormatValue(value) {
    value = (value)?value:0;
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    let number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if (this.quantityPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.quantityFormat);
      }
    }
  }

  isProductDisabled(prodIndex){
    return (this.rfqSent && this.reqObj.contractRequestProducts[prodIndex].status !== 'Open')?true:false;
  }

  originalOrder = (
    a: KeyValue<string, any>,
    b: KeyValue<string, any>
  ): number => 0;

  focus(e, type) {
    if (type == 'min') {
      e.target.parentElement
        .closest('.minInputFocus')
        .classList.add('mininputFocussed');
      e.target.parentElement.lastChild.classList.remove('add-label');
      e.target.parentElement.lastChild.classList.add('remove-label');
    }

    if (type == 'max') {
      e.target.parentElement
        .closest('.maxInputFocus')
        .classList.add('maxinputFocussed');
      e.target.parentElement.lastChild.classList.remove('add-label');
      e.target.parentElement.lastChild.classList.add('remove-label');
    }

    if (type == 'uom') {
      e.target.parentElement
        .closest('.uomInputFocus')
        .classList.add('uomInputFocussed');
      e.target.parentElement.lastChild.classList.remove('add-label');
      e.target.parentElement.lastChild.classList.add('remove-label');
    }

    if (type == 'tol') {
      e.target.parentElement
        .closest('.tolInputFocus')
        .classList.add('tolinputFocussed');
      e.target.parentElement.lastChild.classList.remove('add-label');
      e.target.parentElement.lastChild.classList.add('remove-label');
    }
    if(type !== 'uom') e.target.select();
  }
  focusOut(e, type, objName, i) {
    let value = (e.target.value)?e.target.value:0;
    let qtyValue = (this.quantityFormatValue(value))?this.quantityFormatValue(value):this.quantityFormatValue(0);
    if (type == 'min') {
      e.target.parentElement
        .closest('.minInputFocus')
        .classList.remove('mininputFocussed');
      e.target.parentElement.lastChild.classList.remove('remove-label');
      e.target.parentElement.lastChild.classList.add('add-label');
      if(objName == 'quantity')
        this.reqObj.quantityDetails[i].minQuantity = qtyValue;
      if(objName == 'product')
        this.reqObj.contractRequestProducts[i].minQuantity = qtyValue;
    }

    if (type == 'max') {
      e.target.parentElement
        .closest('.maxInputFocus')
        .classList.remove('maxinputFocussed');
      e.target.parentElement.lastChild.classList.remove('remove-label');
      e.target.parentElement.lastChild.classList.add('add-label');
      if(objName == 'quantity')
        this.reqObj.quantityDetails[i].maxQuantity = qtyValue;
      if(objName == 'product')
        this.reqObj.contractRequestProducts[i].maxQuantity = qtyValue;
    }

    if (type == 'tol') {
      e.target.parentElement
        .closest('.tolInputFocus')
        .classList.remove('tolinputFocussed');
      e.target.parentElement.lastChild.classList.remove('remove-label');
      e.target.parentElement.lastChild.classList.add('add-label');
      if(objName == 'quantity')
        this.reqObj.quantityDetails[i].tolerancePercentage = qtyValue;
    }
  }
  // Only Number
  keyPressNumber(event) {
    let currStr = event.srcElement.value;
    var inp = String.fromCharCode(event.keyCode);
    if(inp == "." && currStr.includes(".")){
      return false;
    }
    if (inp == '.' || inp == ',' || inp == '-') {
      return true;
    }
    if (/^[0-9]+\.?[0-9]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  addContractQuantityDetail() {
    this.reqObj.quantityDetails.push(this.newQuantityDetails);
  }

  removeContractQuantityDetail(i) {
    this.reqObj.quantityDetails.splice(i, 1);
  }

  addNewMainLocation() {
    this.showMainLocationDropdown = true;
  }
  
  deleteMainLocation(index: number){
    let mainLocToDelete = this.mainLocations[index];
    this.reqObj.contractRequestProducts.forEach( (prod, index) => {
      if(prod.locationId == mainLocToDelete.locationId) this.deleteNewMainProduct(index);
    })
    this.mainLocations.splice(index, 1);
    if(this.mainLocations.length > 0 ){
      this.onClick(this.mainLocations[this.mainLocations.length - 1]);
    }
  }
  
  addNewAllowedLocation(prodIndex) {
    this.hideAllowedLocationDropdown[prodIndex] = false;
  }

  addSelectedAllowedLocation(prodIndex, selectedAllowedLocation) {
    let prod = this.staticData.Product.find( p => p.id == this.reqObj.contractRequestProducts[prodIndex].productId);
    if(this.reqObj.contractRequestProducts[prodIndex].allowedLocations.findIndex(al => al.locationId == selectedAllowedLocation.id) > -1){
      let prodNameMsg = (prod && prod.name)?' to '+ prod.name:'';
      this.toaster.warning(
        selectedAllowedLocation.name + ' already added' + prodNameMsg + ' as allowed location'
      );
      this.allowedLocationSelect.forEach(e => {e.close();e.value="";});
      return false;
    } else {
      this.hideAllowedLocationDropdown[prodIndex] = true;
      if(!this.productAllowedLocations[prodIndex]) this.productAllowedLocations[prodIndex] = [];
      this.productAllowedLocations[prodIndex].push({
        id: selectedAllowedLocation.id,
        name: selectedAllowedLocation.name,
        selected: true
      });
      this.productAllowedLocations[prodIndex].forEach(loc => {
        if(loc.id == selectedAllowedLocation.id) {
          loc.selected = true;
        } else {
          loc.selected = false;
        }
      });
      let addNewAllowedLoc = this.newAllowedLocations;
      addNewAllowedLoc.locationId = selectedAllowedLocation.id;
      this.reqObj.contractRequestProducts[prodIndex].allowedLocations.push(addNewAllowedLoc);
      this.searchFilterString[prodIndex].allowedLocations = "";
    }
  }

  deleteAllowedLocation(prodIndex, index) {
    this.reqObj.contractRequestProducts[prodIndex].allowedLocations.splice(index, 1);
    this.productAllowedLocations[prodIndex].splice(index, 1);
  }

  onClick(selectedLoc) {
    this.selectedLocationId = selectedLoc.locationId;
    this.mainLocations.forEach((loc) => {
      if(loc.locationId === selectedLoc.locationId)
        loc.selected = true;
      else
        loc.selected = false;
    });
    this.selectedMainLocationName = selectedLoc.locationName;
  }

  addNewMainProduct(locationId) {
    this.selectedLocationId = locationId
    let newMainProduct = this.newContractRequestProducts;
    newMainProduct.locationId = locationId;
    this.reqObj.contractRequestProducts.push(newMainProduct);
    this.listData.push({
      mainProduct: (_.cloneDeep(this.staticData.Product)).sort((a, b) => a.name.localeCompare(b.name)).splice(0, 10),
      allowedProducts:[],
      allowedLocations:[]
    });
    this.searchFilterString.push({ 
      mainProduct:"",
      allowedProducts:[],
      allowedLocations: ""
    });
  }

  deleteNewMainProduct(i) {
    if(this.reqObj.contractRequestProducts[i].contractRequestId === 0){
      this.reqObj.contractRequestProducts.splice(i, 1);
      this.listData.splice(i, 1);
      this.searchFilterString.splice(i, 1);
      this.productAllowedLocations.splice(i, 1)
      this.hideAllowedLocationDropdown.splice(i, 1);
    } else {
      this.reqObj.contractRequestProducts[i].isDeleted = true;
    }
    /*else if (this.reqObj.contractRequestProducts[i].status === 'Open') {
      this.reqObj.contractRequestProducts[i].isDeleted = true;
    } else {
      let prod = this.staticData.Product.find(p => p.id == this.reqObj.contractRequestProducts[i].productId);
      const dialogRef = this.dialog.open(ConfirmdialogComponent, {
        width: '340px',
        height: 'auto',
        panelClass: 'delete-chat-popup',
        data: { message: 'Are you sure if you want to delete this '+ prod.name +'?'}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.reqObj.contractRequestProducts[i].isDeleted = true;
        }
      });
    }*/

  }

  specGroupDataSource(prodId) {
    let specGroupArr = [];
    if(prodId == '') return specGroupArr;
    let prod = this.staticData.Product.find(p => p.id == prodId);
    if(prod.defaultSpecGroupId != 0){
      specGroupArr = this.staticData.SpecGroup.filter(sg => sg.productId === prodId || sg.id == prod.defaultSpecGroupId);
    } else {
      specGroupArr = this.staticData.SpecGroup.filter(sg => sg.productId === prodId);
    }
    return specGroupArr;
  }

  setProductChange(value, prodIndex, index, updateSpecGroupId:boolean = true) {
    this.reqObj.contractRequestProducts[prodIndex].allowedProducts[index].productId = '';
    let prod = this.staticData.Product.find(p => p.id == value);
    let mainProd = this.staticData.Product.find(mp => mp.id == this.reqObj.contractRequestProducts[prodIndex].productId);
    this.listData[prodIndex].allowedProducts[index].products = _.cloneDeep(this.staticData.Product).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 10);
    if(this.reqObj.contractRequestProducts[prodIndex].allowedProducts.findIndex(ap => ap.productId == value) > -1) {
      let prodNameMsg = (mainProd && mainProd.name)?' to '+ mainProd.name:'';
      this.toaster.warning(
        prod.name + ' already added' + prodNameMsg + ' as allowed product'
      );
      this.removeProductToContract(prodIndex, index);
      return false;
    }
    this.reqObj.contractRequestProducts[prodIndex].allowedProducts[index].productId = value;
    this.locationSelected = true;
    this.selectedLocindex = index;
    if(updateSpecGroupId){
      this.reqObj.contractRequestProducts[prodIndex].allowedProducts[index].specGroupId = prod.defaultSpecGroupId;
    }
    if(this.listData[prodIndex].allowedProducts[index].products.findIndex(p => p.id == prod.id) == -1) {
      this.listData[prodIndex].allowedProducts[index].products.push(prod);
    }
    this.listData[prodIndex].allowedProducts[index].specGroup = this.specGroupDataSource(value);
  }
  
  setSpecGroupChange(value, prodIndex, index) {
    this.reqObj.contractRequestProducts[prodIndex].allowedProducts[index].specGroupId = value;
    this.selectedProname = value.pname;
    this.productSelected = true;
    this.selectedProindex = index;
  }

  addNewAllowedProduct(prodIndex) {
    this.reqObj.contractRequestProducts[prodIndex].allowedProducts.push(this.newAllowedProducts);
    this.searchFilterString[prodIndex].allowedProducts.push({value: ''});
    this.listData[prodIndex].allowedProducts.push({products: (_.cloneDeep(this.staticData.Product)).sort((a, b) => a.name.localeCompare(b.name)).splice(0, 10),})
  }
  removeProductToContract(prodIndex, key) {
    this.reqObj.contractRequestProducts[prodIndex].allowedProducts.splice(key, 1);
    this.searchFilterString[prodIndex].allowedProducts.splice(key, 1);
    this.listData[prodIndex].allowedProducts.splice(key, 1);
  }

  /* Unused function. Can be removed in future */
  /*sendRFQ() {
    const dialogRef = this.dialog.open(SendRfqPopupComponent, {
      width: '425px',
      data: { message: 'You are sending this RFQ to all your preferred counterparty. Do you want to continue?', toastMsg: 'RFQ(s) sent successfully',createReqPopup:this.data.createReqPopup },
      panelClass: ['additional-cost-popup']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'close') {
        this.dialog.closeAll();
      }
    });
  }*/

  updateRequestWithAmendRFQ() {
    const dialogRef = this.dialog.open(UpdateRfqPopupComponent, {
      width: '425px',
      data: { message: 'You are sending the updated RFQ to all counterparties you had previously sent the RFQ. Do you want to continue?', toastMsg: 'RFQ(s) updated successfully' },
      panelClass: ['additional-cost-popup']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'yes') {
        this.reqObj.sendAmendRFQ = true;
        this.updateRequest();
        this.dialog.closeAll();
      } else if (result == 'no'){
        this.reqObj.sendAmendRFQ = false;
        this.updateRequest();
      }
    });
  }

  afterPlanSelection(selectedPlanPeriod){
    let selectedItems = [];
    let selectedItemLabels = [];
    let firstId; let lastId;
    let startDate; let endDate;
    let periodData = [];
    if (selectedPlanPeriod == 'Quarter') { periodData = this.plan.quarterlyPeriod; }
    if (selectedPlanPeriod == 'Month') { periodData = this.plan.monthlyPeriod; }
    if (selectedPlanPeriod == 'Year') { periodData = this.plan.yearlyPeriod; }
    if (selectedPlanPeriod == 'Semester') { periodData = this.plan.semesterPeriod; }
    selectedItems = periodData.filter(i => i.selected == true).map(x => x.id);
    if(selectedItems.length > 1){
      firstId = selectedItems[0];
      lastId = selectedItems[selectedItems.length - 1];
      let selectedValue = false;
      periodData.forEach(x => {
        if(firstId == x.id) selectedValue = true;
        if(selectedValue == true) {
          if(firstId == x.id) startDate = new Date(x.startDate);
          if(lastId == x.id) endDate = new Date(x.endDate);
          selectedItemLabels.push(x.label);
        }
        x.selected = selectedValue;
        if(lastId == x.id) selectedValue = false;
      });
    } else {
      periodData.filter(x => x.selected == true).map( i => {
        selectedItemLabels.push(i.label);
        startDate = new Date(i.startDate);
        endDate = new Date(i.endDate);
        return i;
      })
    }
    return { startDate: startDate, endDate: endDate, label: selectedItemLabels.join() };
  }

  onSelectPlanPeriod(element) {
    this.selectedPlanPeriod = element.type;
    let planValues = this.afterPlanSelection(element.type);
    this.planStartDate = planValues.startDate;
    this.planEndDate = planValues.endDate;
    this.planLabel = planValues.label;
  }

  emptyPlanPeriod() {
    this.plan.quarterlyPeriod.filter((item, i) => { if(i != 0) item.selected = false });
    this.plan.monthlyPeriod.filter((item, i) => { if(i != 0) item.selected = false });
    this.plan.yearlyPeriod.filter((item, i) => { if(i != 0) item.selected = false });
    this.plan.semesterPeriod.filter((item, i) => { if(i != 0) item.selected = false });
    this.selectedPlanValue = '';
  }

  selectPlanPeriod(event, item, selectedPlanPeriod) {
    event.stopPropagation();
    let periodData = [];
    if (selectedPlanPeriod == 'Quarter') { periodData = this.plan.quarterlyPeriod; }
    if (selectedPlanPeriod == 'Month') { periodData = this.plan.monthlyPeriod; }
    if (selectedPlanPeriod == 'Year') { periodData = this.plan.yearlyPeriod; }
    if (selectedPlanPeriod == 'Semester') { periodData = this.plan.semesterPeriod; }
    let selectedItemLabels = this.planLabel.split(',');
    let selectedItems = periodData.filter(i => i.selected == true).map(x => x.id);
    let firstId = selectedItems[0];
    let lastId = selectedItems[selectedItems.length - 1];
    let deselectedInMiddle = false;
    if(item.selected == true){
      if(item.id == firstId || item.id == lastId) {
        periodData.filter(i => i.id == item.id).map(i => i.selected = false);
      } else {
        deselectedInMiddle = true;
        periodData.filter(i => Number(i.id) > Number(item.id)).map(i => i.selected = false);
      }
    } else {
      periodData.filter(i => i.id == item.id).map(i => i.selected = !i.selected);
    }
    let planValues = this.afterPlanSelection(selectedPlanPeriod);
    this.planStartDate = planValues.startDate;
    this.planEndDate = planValues.endDate;
    this.planLabel = planValues.label;
    if(selectedItemLabels.length == 0){
      this.planStartDate = '';
      this.planEndDate = '';
    }
  }

  /* Generating Plan Period related arrays - Start */
  generateQuarterlyPeriod() {
    let quarterlyPeriod = [];
    for (let i = 0; i < 6; i++) {
      let obj = moment().add(i, 'quarter');
      quarterlyPeriod.push({ 
        'id': i.toString(),
        'label': 'Q' + obj.quarter() + ' ' + obj.year(),
        'selected': (i === 0) ? true : false,
        'startDate': obj.startOf('quarter').format('MM/DD/YYYY'),
        'endDate': obj.endOf('quarter').format('MM/DD/YYYY')
      });
    }
    return quarterlyPeriod;
  }

  generateMonthlyPeriod() {
    let monthlyPeriod = [];
    for (var i=0; i < 12; i++) {
      let obj = moment().add(i, "month");
      monthlyPeriod.push({ 
        'id': i.toString(),
        'label': obj.startOf("month").format('MMM YYYY'),
        'selected': (i === 0) ? true : false,
        'startDate': obj.startOf('month').format('MM/DD/YYYY'),
        'endDate': obj.endOf('month').format('MM/DD/YYYY')
      });
    }
    return monthlyPeriod;
  }

  generateYearlyPeriod() {
    let yearlyPeriod = [];
    for (var i=0; i < 6; i++) {
      let obj = moment().add(i, "year");
      yearlyPeriod.push({ 
        'id': i.toString(),
        'label': obj.format('YYYY'),
        'selected': (i === 0) ? true : false,
        'startDate': obj.startOf('year').format('MM/DD/YYYY'),
        'endDate': obj.endOf('year').format('MM/DD/YYYY') 
      });
    }
    return yearlyPeriod;
  }

  generateSemesterPeriod() {
    var obj = moment();
    var yearVal = obj.year();
    var monthVal = obj.month();
    var semVal = monthVal > 6 ? 2 : 1;
    monthVal = monthVal > 6 ? 6 : 0;
    var startDate = '';
    var endDate = '';
    let semesterPeriod = [];
    obj.set({'year': yearVal, 'month': monthVal});
    for (var i=0; i< 6; i++) {
      yearVal = obj.year();
      startDate = obj.startOf('month').format('MM/DD/YYYY');
      obj.add(5, 'month');
      endDate = obj.endOf('month').format('MM/DD/YYYY')
      semesterPeriod.push({ 
        'id': i.toString(),
        'label': 'S' + semVal + ' ' + yearVal,
        'selected': (i === 0) ? true : false,
        'startDate': startDate,
        'endDate': endDate 
      });
      obj.add(1, 'month');
      semVal = semVal === 1 ? 2 : 1;
    }
    return semesterPeriod;
  }

  onLocationChange(location) {
    this.mainLocationSelect.close();
    this.selectedLocationId = location.id;
    if(this.mainLocations.findIndex((loc) => loc.locationId === location.id) !== -1){
      this.toaster.warning(location.name + ' already added as main location.');
      return false;
    }
    this.showMainLocationDropdown = false;
    this.mainLocations.push({
      locationId: location.id,
      locationName: location.name,
      selected: true
    });
    this.mainLocations.forEach((loc) => {
      if(loc.locationId == location.id) {
        loc.selected = true;
      } else {
        loc.selected = false;
      } 
    });
    let firstLocation = (this.mainLocations.length == 1 
      && this.reqObj.contractRequestProducts.length == 1
      && this.reqObj.contractRequestProducts[0].locationId == '') ? true : false;
    this.selectedMainLocationName = location.name;
    if(firstLocation) {
      this.reqObj.contractRequestProducts.forEach( prod => {
        prod.locationId = location.id
      });
    } else {
      this.addNewMainProduct(location.id);
    }
  }

  onMainProductChange(prodId, i, setDefaults:boolean = true){
    this.reqObj.contractRequestProducts[i].productId = '';
    
    let prod = this.staticData.Product.find(p => p.id == prodId);
    this.listData[i].mainProduct = _.cloneDeep(this.staticData.Product).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 10);
    if(this.getLocationProducts().findIndex(p => p.productId == prodId) > -1){
      this.toaster.warning(
        'Product ' + prod.name + ' already added as main product for ' + this.selectedMainLocationName + ' location'
      );
      this.mainProductSelects.forEach((e, index) => { 
        if(index == i) e.value = '';
      });
      return false;
    }
    this.reqObj.contractRequestProducts[i].productId = prodId;
    if(setDefaults){
      this.db.getDefaultProductUOM(prodId).then( defaultUom => {
        this.reqObj.contractRequestProducts[i].minQuantityUomId = defaultUom.id;
        this.reqObj.contractRequestProducts[i].maxQuantityUomId = defaultUom.id;
      });
      if(this.staticData.SpecGroup.findIndex(sga => sga.id == prod.defaultSpecGroupId) > -1){
        this.reqObj.contractRequestProducts[i].specGroupId = prod.defaultSpecGroupId;
      } else this.reqObj.contractRequestProducts[i].specGroupId = '';
    }
    if(this.listData[i].mainProduct.findIndex(p => p.id == prod.id) == -1) {
      this.listData[i].mainProduct.push(prod);
    }
    this.listData[i].specGroup = this.specGroupDataSource(prodId);
    this.searchFilterString[i].mainProduct = "";
  }

  onMainProductSelectClosed(i){
    this.searchFilterString[i].mainProduct = "";
    this.onMainProdSearchChange('', i);
  }

  onMainLocationSelectClosed(){
    this.mainLocationSelect.value = '';
  }

  onMainProdSearchChange(value, i){
    if(value && value != ''){
      let filterValue = value.toString().toLowerCase();
      this.listData[i].mainProduct = this.staticData.Product.filter(p => p.name.toString().toLowerCase().includes(filterValue)).slice(0, 10);
    } else {
      this.listData[i].mainProduct =  _.cloneDeep(this.staticData.Product).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 10);
    }
    if(this.reqObj.contractRequestProducts[i].productId != ''){
      let selectedProd = this.staticData.Product.find(p => p.id == this.reqObj.contractRequestProducts[i].productId);
      if(this.listData[i].mainProduct.findIndex(p => p.id == selectedProd.id) == -1) {
        this.listData[i].mainProduct.push(selectedProd);
      }
    }
  }

  onAllowedProdSearchChange(value, i, j) {
    if(value && value != ''){
      let filterValue = value.toString().toLowerCase();
      this.listData[i].allowedProducts[j].products = this.staticData.Product.filter(p => p.name.toString().toLowerCase().includes(filterValue)).slice(0, 10);
    } else {
      this.listData[i].allowedProducts[j].products =  _.cloneDeep(this.staticData.Product).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 10);
    }
    if(this.reqObj.contractRequestProducts[i].allowedProducts[j].productId != ''){
      let selectedProd = this.staticData.Product.find(p => p.id == this.reqObj.contractRequestProducts[i].allowedProducts[j].productId);
      if(this.listData[i].allowedProducts[j].products.findIndex(p => p.id == selectedProd.id) == -1) {
        this.listData[i].allowedProducts[j].products.push(selectedProd);
      }
    }
  }

  onAllowedProductSelectClosed(i, j){
    this.searchFilterString[i].allowedProducts[j].product = "";
    this.onAllowedProdSearchChange('', i, j);
  }

  syncMinMaxUom(type, i) {
    if(type == 'min'){
      this.reqObj.contractRequestProducts[i].maxQuantityUomId = this.reqObj.contractRequestProducts[i].minQuantityUomId;
    } else if(type == 'max') {
      this.reqObj.contractRequestProducts[i].minQuantityUomId = this.reqObj.contractRequestProducts[i].maxQuantityUomId;
    }
  }

  locationDataSource(value){
    if(value && value != ''){
      let filterValue = value.toString().toLowerCase();
    return this.staticData.Location.filter(p => p.name.toString().toLowerCase().includes(filterValue))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 10);
    } else {
      return this.staticData.Location.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 10);
    }
  }

  /* Unused function, can be removed in future.*/
  /*getValue(fieldName): any {
    let valueField = moment(this.reqObj[fieldName]);
    // adjust 0 before single digit date
    let date = ('0' + valueField.date()).slice(-2);
    // current month
    let month = ('0' + (valueField.month() + 1)).slice(-2);
    // current year
    let year = valueField.year();
    return moment.utc(month + '/' + date + '/' + year, 'MM/DD/YYYY');
  }*/

  convertToDateObj(dateStr): any {
    let valueField = moment(dateStr);
    // adjust 0 before single digit date
    let date = ('0' + valueField.date()).slice(-2);
    // current month
    let month = ('0' + (valueField.month() + 1)).slice(-2);
    // current year
    let year = valueField.year();
    return moment.utc(month + '/' + date + '/' + year, 'MM/DD/YYYY');
  }

  convertDecimalSeparatorStringToNumber(number) {
    let numberToReturn = (number !== '' && number !== null && number !== undefined)?number:0;
    let decimalSeparator, thousandsSeparator;
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

  assignUserIdToReqObj(isNew) {
    let currentDateTime = moment.utc();
    if(isNew){
      this.reqObj.createdById = this.currentUserId;
      this.reqObj.createdOn = currentDateTime;
    }
    this.reqObj.lastModifiedOn = currentDateTime;
    this.reqObj.lastModifiedById = this.currentUserId;
    if(this.reqObj.contractRequestProducts.length > 0){
      this.reqObj.contractRequestProducts.forEach( product => {
        if(isNew){
          product.createdById = this.currentUserId;
          product.createdOn = currentDateTime;
        }
        product.lastModifiedById = this.currentUserId;
        product.lastModifiedOn = currentDateTime;
      })
    }
  }

  showFormErrors(): boolean {
    let message: string = 'Please fill in required fields:';
    if (!this.reqObj.startDate) {
      message += ' Start Date,';
    }
    if (!this.reqObj.endDate) {
      message += ' End Date,';
    }
    if (!this.reqObj.quoteByDate) {
      message += ' Quote By Date,';
    }
    if (!this.reqObj.minValidity) {
      message += ' Minimum Validity Date,';
    }
    if (message != 'Please fill in required fields:') {
      if (message[message.length - 1] == ',') {
        message = message.substring(0, message.length - 1);
      }
      this.toaster.error(message);
      return false;
    }

    if(!moment(this.reqObj.startDate).isBefore(this.reqObj.endDate)){
      this.toaster.error(
        'Contract Start Date must be lesser than Contract End Date'
      );
      return false;
    }
    if(!moment(this.reqObj.quoteByDate).isBefore(this.reqObj.startDate)){
      this.toaster.error(
        'Quote By Date should be less than Contract Period'
      );
      return false;
    }
    if(!moment(this.reqObj.minValidity).isBefore(this.reqObj.startDate)){
      this.toaster.error(
        'Minimum Validity Date should be less than the Contract Period'
      );
      return false;
    }
    if(!moment(this.reqObj.quoteByDate).isBefore(this.reqObj.minValidity)){
      this.toaster.error(
        'Quote By Date should be less than Minimum Validity Date'
      );
      return false;
    }

    /* Quantity Details Validation - Start */
    let hasTotalContractualQuantity = false;
    let hasPerMonthQuantity = false;
    let hasPerWeekQuantity = false;
    let hasPerDayQuantity = false;
    let hasPerLiftQuantity = false;
    let totalMaxQuantity = 0;
    let perMonthMaxQuantity = 0;
    let perWeekMaxQuantity = 0;
    let perDayMaxQuantity = 0;
    let perLiftMaxQuantity = 0;
    let minQuantityValidationError = false;
    let duplicateQuantityType = [];
    let maxZeroValidationError = '';
    message = 'Please fill in required fields:';

    this.reqObj.quantityDetails.forEach((v, k) => {
      if (typeof v != 'undefined') {
        if (v.minQuantity.toString() === '') {
          message += ' Min,';
        }
        if (v.maxQuantity.toString() === '') {
          message += ' Max,';
        }
        if (v.maxQuantity && this.convertDecimalSeparatorStringToNumber(v.maxQuantity) == 0) {
          maxZeroValidationError = 'In Quantity section Max field cannot be ' + this.quantityFormatValue(0);
        }
        if (typeof v.contractualQuantityOptionId != 'undefined') {
          if(hasTotalContractualQuantity && v.contractualQuantityOptionId == 1){
            if (!duplicateQuantityType.includes('Total Contractual Quantity')) duplicateQuantityType.push('Total Contractual Quantity');
          }
          if(hasPerMonthQuantity && v.contractualQuantityOptionId == 2){
            if (!duplicateQuantityType.includes('Per Month')) duplicateQuantityType.push('Per Month');
          }
          if(hasPerWeekQuantity && v.contractualQuantityOptionId == 3){
            if (!duplicateQuantityType.includes('Per Week')) duplicateQuantityType.push('Per Week');
          }
          if(hasPerDayQuantity && v.contractualQuantityOptionId == 4){
            if (!duplicateQuantityType.includes('Per Day')) duplicateQuantityType.push('Per Day');
          }
          if(hasPerLiftQuantity && v.contractualQuantityOptionId == 5){
            if (!duplicateQuantityType.includes('Per Lift')) duplicateQuantityType.push('Per Lift');
          }
          
          if (v.contractualQuantityOptionId == 1) {
            totalMaxQuantity = this.convertDecimalSeparatorStringToNumber(v.maxQuantity);
            hasTotalContractualQuantity = true;
          }
        }
        if (v.minQuantity && v.maxQuantity) {
          if (
            this.convertDecimalSeparatorStringToNumber(v.minQuantity) >
            this.convertDecimalSeparatorStringToNumber(v.maxQuantity)
          ) {
            minQuantityValidationError = true;
          }
        }
        if (v.contractualQuantityOptionId == 2) {
          perMonthMaxQuantity = this.convertDecimalSeparatorStringToNumber(v.maxQuantity);
          hasPerMonthQuantity = true;
        }
        if (v.contractualQuantityOptionId == 3) {
          perWeekMaxQuantity = this.convertDecimalSeparatorStringToNumber(v.maxQuantity);
          hasPerWeekQuantity = true;
        }
        if (v.contractualQuantityOptionId == 4) {
          perDayMaxQuantity = this.convertDecimalSeparatorStringToNumber(v.maxQuantity);
          hasPerDayQuantity = true;
        }
        if (v.contractualQuantityOptionId == 5) {
          perLiftMaxQuantity = this.convertDecimalSeparatorStringToNumber(v.maxQuantity);
          hasPerLiftQuantity = true;
        }
      }
    });
    if(duplicateQuantityType.length > 0){
      this.toaster.error(
        'You cannot define ' + duplicateQuantityType.join(', ') + ' multiple times'
      );
      return false;
    }
    let qtyToMatch = 0;
    if (!hasTotalContractualQuantity) {
      this.toaster.error(
        'Total ContractualQuantity option is required in Contractual Quantity section'
      );
      return false;
    } else qtyToMatch = totalMaxQuantity;
    if(hasPerMonthQuantity){
      if(qtyToMatch <= perMonthMaxQuantity){
        this.toaster.error(
          'The contract hierarchy of the quantity limit is as follows: Contractual Quantity > Per Month > Per Week > Per Day > Per Lift'
        );
        return false;  
      }
      qtyToMatch = perMonthMaxQuantity;
    }
    if(hasPerWeekQuantity){
      if(qtyToMatch <= perWeekMaxQuantity){
        this.toaster.error(
          'The contract hierarchy of the quantity limit is as follows: Contractual Quantity > Per Month > Per Week > Per Day > Per Lift'
        );
        return false;  
      }
      qtyToMatch = perWeekMaxQuantity;
    }
    if(hasPerDayQuantity){
      if(qtyToMatch <= perDayMaxQuantity){
        this.toaster.error(
          'The contract hierarchy of the quantity limit is as follows: Contractual Quantity > Per Month > Per Week > Per Day > Per Lift'
        );
        return false;  
      }
      qtyToMatch = perDayMaxQuantity;
    }
    if(hasPerLiftQuantity){
      if(qtyToMatch <= perLiftMaxQuantity){
        this.toaster.error(
          'The contract hierarchy of the quantity limit is as follows: Contractual Quantity > Per Month > Per Week > Per Day > Per Lift'
        );
        return false;  
      }
    }
    if (message != 'Please fill in required fields:') {
      if (message[message.length - 1] == ',') {
        message = message.substring(0, message.length - 1);
      }
      this.toaster.error(message);
      return false;
    }
    if(maxZeroValidationError != '') {
      this.toaster.error(maxZeroValidationError);
      return false;
    }
    if (minQuantityValidationError) {
      this.toaster.error('Min Quantity must be smaller than Max Quantity ');
      return false;
    }
    /* Quantity Details Validation - End */
    
    if(this.mainLocations.length == 0){
      this.toaster.error(
        'You must add at least one main location in the contract request'
      );
      return false;
    }

    /* Each location must have one main product validation */
    let minProdErrMsg = '';
    this.mainLocations.forEach( loc => {
      if(this.getLocationProducts(loc.locationId).length == 0 && minProdErrMsg == '')
      minProdErrMsg = 'You must add atleast one main product for '+ loc.locationName +' location';
      return false;
    })
    if(minProdErrMsg !== ''){
      this.toaster.error(minProdErrMsg);
      return false;
    }
    
    /* Contract Request Product Validation - Start */
    message = 'Please fill in required fields:';
    this.reqObj.contractRequestProducts.forEach((v, k) => {
      if (typeof v != 'undefined') {
        if(v.isDeleted) return;
        if (!v.productId) {
          message += ' Product,';
        }
        if (!v.specGroupId) {
          message += ' Spec Group,';
        }
        if (!v.pricingTypeId) {
          message += ' Pricing Type,';
        }
        if (v.minQuantity && v.maxQuantity) {
          if (
            this.convertDecimalSeparatorStringToNumber(v.minQuantity) >
            this.convertDecimalSeparatorStringToNumber(v.maxQuantity)
          ) {
            minQuantityValidationError = true;
          }
        }
        if (v.allowedProducts && v.allowedProducts.length > 0) {
          v.allowedProducts.forEach((vv, kk) => {
            if(vv.productId && !vv.specGroupId){
              message += 'Allowed Product -> Spec Group,'
            }
          });
        }
      }
    });
    if (message != 'Please fill in required fields:') {
      if (message[message.length - 1] == ',') {
        message = message.substring(0, message.length - 1);
      }
      this.toaster.error(message);
      return false;
    }
    if(minQuantityValidationError){
      this.toaster.error(
        'Min Quantity must be smaller than Max Quantity '
      );
      return false;
    }
    /* Contract Request Product Validation - End */
    return true;
  }

  saveContractRequest() {
    let prodMinMaxChange = [];
    let rfqSentCounterParties = [];
    let sellersToAmendRFQ = [];
    this.reqObj.contractRequestProducts.forEach( (pro) => {
      if(pro.contractRequestProductOffers.length > 0){
        pro.contractRequestProductOffers.forEach( sData => {
          if(sData.status !== 'Open'){
            rfqSentCounterParties.push({
              id: sData.id,
              counterpartyId: sData.counterpartyId
            });                
          }
        });
      }
    });
    let requestDetailsUpdated = false;
    if(!this.isNewRequest){
      this.reqObj.sendAmendRFQ = false;
      this.reqObj.conReqProdSellerWithProdDetatilDtos = [];
    }
    this.assignUserIdToReqObj(this.isNewRequest);
    const isValid = this.showFormErrors();
    if (!isValid) {
      return;
    }
    //Format values before send
    this.reqObj.startDate = this.convertToDateObj(this.reqObj.startDate);
    this.reqObj.endDate = this.convertToDateObj(this.reqObj.endDate);
    this.reqObj.quoteByDate = this.convertToDateObj(this.reqObj.quoteByDate);
    this.reqObj.minValidity = this.convertToDateObj(this.reqObj.minValidity);

    if(!this.isNewRequest){
      //Format dates to compare
      this.tempReqObj.startDate = this.convertToDateObj(this.tempReqObj.startDate);
      this.tempReqObj.endDate = this.convertToDateObj(this.tempReqObj.endDate);
      this.tempReqObj.quoteByDate = this.convertToDateObj(this.tempReqObj.quoteByDate);
      this.tempReqObj.minValidity = this.convertToDateObj(this.tempReqObj.minValidity);
      
      if(!this.tempReqObj.startDate.isSame(this.reqObj.startDate)
      || !this.tempReqObj.endDate.isSame(this.reqObj.endDate)
      || !this.tempReqObj.quoteByDate.isSame(this.reqObj.quoteByDate)
      || !this.tempReqObj.minValidity.isSame(this.reqObj.minValidity)
      ){
        requestDetailsUpdated = true;
      }
      if(this.reqObj.quantityDetails.length !== this.tempReqObj.quantityDetails.length){
        requestDetailsUpdated = true;
      }
    }

    this.reqObj.quantityDetails.forEach((q, i) => {
      q.maxQuantity = this.convertDecimalSeparatorStringToNumber(q.maxQuantity);
      q.minQuantity = this.convertDecimalSeparatorStringToNumber(q.minQuantity);
      q.tolerancePercentage = this.convertDecimalSeparatorStringToNumber(q.tolerancePercentage);
      
      if(!this.isNewRequest){
        if(this.tempReqObj.quantityDetails[i]?.maxQuantity !== q.maxQuantity
          || this.tempReqObj.quantityDetails[i]?.minQuantity !== q.minQuantity
          || this.tempReqObj.quantityDetails[i]?.tolerancePercentage !== q.tolerancePercentage
        ){
            requestDetailsUpdated = true;
        }
      }
    });
    this.reqObj.contractRequestProducts.forEach((pro, i) => {
      if(!this.isNewRequest){
        if(this.tempReqObj.contractRequestProducts[i]?.minQuantity !== pro.minQuantity
        || this.tempReqObj.contractRequestProducts[i]?.maxQuantity !== pro.maxQuantity){
          if(pro.contractRequestProductOffers.length > 0 && !requestDetailsUpdated){
            pro.contractRequestProductOffers.forEach( sData => {
              if(sData.status !== 'Open'){
                requestDetailsUpdated = true;
                prodMinMaxChange.push({
                  id: sData.id,
                  counterpartyId: sData.counterpartyId
                });                
              }
            });
          }
        }
      }
      pro.maxQuantity = this.convertDecimalSeparatorStringToNumber(pro.maxQuantity);
      pro.minQuantity = this.convertDecimalSeparatorStringToNumber(pro.minQuantity);
    });
    sellersToAmendRFQ = prodMinMaxChange.length > 0 ? prodMinMaxChange : rfqSentCounterParties;
    this.reqObj.conReqProdSellerWithProdDetatilDtos = requestDetailsUpdated ? sellersToAmendRFQ : [];
    if(this.isNewRequest){
      this.saveRequest();
    } else {
      if(requestDetailsUpdated){
        this.updateRequestWithAmendRFQ();
      } else {
        this.updateRequest();
      }
    }
  }

  saveRequest(){
    this.contractNegotiationService.createContractRequest(this.reqObj).subscribe( requestId => {
      if(typeof requestId == 'number' && requestId > 0){
        this.toaster.success('Contract Request has been created successfully');
        this.router.navigate(['/contract-negotiation/requests/'+requestId]);
        this.dialog.closeAll();
      } else {
        this.toaster.error(requestId.toString());
      }
    });
  }

  updateRequest(){
    this.contractNegotiationService.updateContractRequest(this.reqObj).subscribe( response => {
      if(response){
        var hasContractRequestUpdated = response['hasContractRequestUpdated'];
        if(this.reqObj.sendAmendRFQ && response['amendRfqSent'] === false){
          this.toaster.error('Failed to send amend RFQ email.');
        }
        if(hasContractRequestUpdated){
          this.toaster.success('Contract Request has been updated successfully');
          this.dialog.closeAll();
        }
        else {
          this.toaster.error('Failed to update contract request details');
        }
      } 
    });
  }

  openProductLookup(i, type, j=0) {
    let dataId;
    if(type=="main") dataId = this.reqObj.contractRequestProducts[i].productId;
    if(type=="allowed") dataId = this.reqObj.contractRequestProducts[i].allowedProducts[j].productId;
    const dialogRef = this.dialog.open(SearchProductsPopupComponent, {
      width: '100vw',
      height: '95vh',
      maxWidth: '95vw',
      panelClass: 'search-request-popup',
      data: {
        selectedId: dataId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(type == 'main'){
        if(result && result?.data){
          this.onMainProductChange(result.data.productId, i);
        }
        this.mainProductSelects.forEach(e => e.close());
      } else if(type == 'allowed'){
        if(result && result?.data){
          this.setProductChange(result.data.productId, i, j, true);
        }
        this.allowedProductSelects.forEach(e => e.close());
      }
    });
  }

  openAllowedLocationLookup(i) {
    const dialogRef = this.dialog.open(SearchLocationPopupComponent, {
      width: '100vw',
      height: '95vh',
      maxWidth: '95vw',
      panelClass: 'search-request-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result?.data){
        this.addSelectedAllowedLocation(i, result.data);
      }
      this.allowedLocationSelect.forEach(e => e.close());
    });
  }
}
