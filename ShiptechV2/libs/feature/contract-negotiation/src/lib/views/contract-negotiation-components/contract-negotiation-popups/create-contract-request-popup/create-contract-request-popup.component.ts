import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
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
import { ContractNegotiationService } from '../../../../services/contract-negotiation.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { Store } from '@ngxs/store';
import { Router } from "@angular/router"
import moment from 'moment';
import _ from 'lodash';
import { Subject } from 'rxjs';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { DecimalPipe } from '@angular/common';

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
      pricingTypeId: 1,
      pricingComment: "",
      statusId: 1,
      status: 'Open',
      createdById: 0,
      lastModifiedById: 0,
      allowedProducts: [],
      allowedLocations: [],
      contractRequestProductOffers: []
    }
  }


  reqObj: any = {
    id: 0,
    startDate: new Date(),
    endDate: new Date(),
    quoteByDate: new Date(),
    minValidity: new Date(),
    supplierComments: "",
    statusId: 1,
    status: 'Open',
    createdById: 0,
    lastModifiedById: 0,
    quantityDetails: [],
    contractRequestProducts: []
  }

  getLocationProducts(locationId) {
    this.reqObj.contractRequestProducts.filter((x) => x.locationId === locationId);
  }
  /* Form Builder */

  @Input() rfqSent;
  enableSaveBtn = true;
  enableRFQBtn = false;
  enableSendRfqBtn = false;
  enableUpdateRfqBtn = false;
  allowedProducts = [{ 'id': 0, 'allowedProducts': { 'id': 1, 'name': 'Product1', 'displayName': 'Product2' } }];
  contractualQuantityOptionList = [
    { name: 'Total Contract Qty' },
    { name: 'PerMonth' },
    { name: 'PerWeek' },
    { name: 'PerDay' },
    { name: 'PerLift' }
  ];
  contractQuarterColumns: string[] = ['quarter', 'blank'];
  selectedPlanPeriod = 'Quarter';
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
  selectedMainLocation = '';
  selectedProduct = '';
  selectedAllowedLocation: any;
  displayedColumns: string[] = ['location'];
  showMainLocationDropdown: boolean = true;
  hideAllowedLocationDropdown: any = { 0: true };
  public mainLocationName: any[] = [];
  public allowedLocationName: any[] = [];
  selectedMainLocationName;
  @ViewChild('mainLocationSelect') mainLocationSelect: MatSelect;
  @ViewChild('allowedLocationSelect') allowedLocationSelect: MatSelect;
  displayedLocColumns: string[] = ['name'];
  displayedColumns2: string[] = ['name',];
  
  public locationSelected: boolean = false;
  public productSelected: boolean = false;
  public selectedLocname;
  public selectedLocindex: number;
  public selectedProindex: number;
  public selectedProname;
  expandLocation: boolean = false;

  staticData: any = {
    Location: [],
    Product: [],
    PricingType: [],
    QuantityType: [],
    SpecGroup: [],
    Uom: []
  };
  mainSpecGroupOptions = [];
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
  ) {
    iconRegistry.addSvgIcon('data-picker-gray', sanitizer.bypassSecurityTrustResourceUrl('../../../../../../../../../v2/assets/design-system-icons/shiptech/common-icons/calendar-dark.svg'));
    this.plan.quarterlyPeriod = this.generateQuarterlyPeriod();
    this.plan.monthlyPeriod = this.generateMonthlyPeriod();
    this.plan.yearlyPeriod = this.generateYearlyPeriod();
    this.plan.semesterPeriod = this.generateSemesterPeriod();
    this.localService.getMasterListData([
      "Location",
      "Product",
      "PricingType",
      "ContractualQuantityOption",
      "SpecGroup",
      "Uom"
    ]).subscribe((data) => {
      this.staticData = data;
      this.locationsList.next(data.Location);
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

  ngOnInit(): void {
    this.localService.sendRFQUpdate.subscribe((r) => {
      if (r == true) {
        if (this.data.createReqPopup) {
          this.enableUpdateRfqBtn = false;
          this.enableSendRfqBtn = true;
        }
        else {
          this.enableUpdateRfqBtn = true;
          this.enableSendRfqBtn = false
        }
      }
    });
    this.reqObj.quantityDetails.push(this.newQuantityDetails);
    this.addNewMainProduct(0);
  }

  quantityFormatValue(value) {
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

  }
  focusOut(e, type) {
    console.log('event', e);
    if (type == 'min') {
      e.target.parentElement
        .closest('.minInputFocus')
        .classList.remove('mininputFocussed');
      e.target.parentElement.lastChild.classList.remove('remove-label');
      e.target.parentElement.lastChild.classList.add('add-label');
    }

    if (type == 'max') {
      e.target.parentElement
        .closest('.maxInputFocus')
        .classList.remove('maxinputFocussed');
      e.target.parentElement.lastChild.classList.remove('remove-label');
      e.target.parentElement.lastChild.classList.add('add-label');
    }

    if (type == 'tol') {
      e.target.parentElement
        .closest('.tolInputFocus')
        .classList.remove('tolinputFocussed');
      e.target.parentElement.lastChild.classList.remove('remove-label');
      e.target.parentElement.lastChild.classList.add('add-label');
    }
  }
  // Only Number
  keyPressNumber(event) {
    var inp = String.fromCharCode(event.keyCode);
    
    if (inp == '.' || inp == ',' || inp == '-') {
      return true;
    }
    if (/^[-,+]*\d{1,6}(,\d{})*(\.\d*)?$/.test(inp)) {
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

  addAllowedProducts() {
    this.allowedProducts.push({ 'id': 0, 'allowedProducts': { 'id': 1, 'name': 'Manifold', 'displayName': 'Manifold' } });
  }

  removeAllowedProducts(index) {
    this.allowedProducts.splice(index, 1);
  }

  addNewMainLocation() {
    this.showMainLocationDropdown = true;
    this.selectedMainLocation = '';
  }

  addNewAllowedLocation(prodIndex) {
    this.hideAllowedLocationDropdown[prodIndex] = false;
    this.selectedAllowedLocation = '';
  }

  openAddMainLocationSelect() {
    this.mainLocationSelect.open();
  }

  openAddAllowedLocationSelect() {
    this.allowedLocationSelect.open();
  }

  addSelectedAllowedLocation(prodIndex, selectedAllowedLocation) {
    this.hideAllowedLocationDropdown[prodIndex] = true;
    if(!this.productAllowedLocations[prodIndex]) this.productAllowedLocations[prodIndex] = [];
    this.productAllowedLocations[prodIndex].push({
      id: selectedAllowedLocation.id,
      name: selectedAllowedLocation.name,
      selected: true
    })
    this.productAllowedLocations[prodIndex].forEach(loc => {
      if(loc.id == selectedAllowedLocation.id) {
        loc.selected = true;
      } else {
        loc.selected = false;
      }
    })
    
    let addNewAllowedLoc = this.newAllowedLocations;
    addNewAllowedLoc.locationId = selectedAllowedLocation.id;
    this.reqObj.contractRequestProducts[prodIndex].allowedLocations.push(addNewAllowedLoc);
    this.selectedAllowedLocation = '';
  }

  deleteMainLocation(index) {
    this.mainLocations.splice(index, 1);
  }

  deleteAllowedLocation(prodIndex, index) {
    this.reqObj.contractRequestProducts[prodIndex].allowedLocations.splice(index, 1);
    this.productAllowedLocations[prodIndex].splice(index, 1);
  }

  onClick(selectedProd) {
    this.selectedLocationId = selectedProd.locationId;
    this.mainLocations.forEach((loc) => {
      if(loc.locationId === selectedProd.locationId)
        loc.selected = true;
      else
        loc.selected = false;
    })
  }

  public trackByFnMainProduct(index: number, item: any): number {
    return item.id;
  }

  addNewMainProduct(locationId) {
    this.selectedLocationId = locationId
    let newMainProduct = this.newContractRequestProducts;
    //newMainProduct.id = ++this.mainProductCounter;
    newMainProduct.locationId = locationId;
    this.reqObj.contractRequestProducts.push(newMainProduct);
  }

  deleteNewMainProduct(i) {
    i=i+1;
    this.reqObj.contractRequestProducts.splice(i, 1);
  }

  mainProductChange(prodId) {
    this.mainSpecGroupOptions = this.specGroupDataSource(prodId);
  }

  specGroupDataSource(prodId) {
    return this.staticData.SpecGroup.filter(p => p.databaseValue === prodId );
  }

  setProductChange(value, prodIndex, index) {
    this.reqObj.contractRequestProducts[prodIndex].allowedProducts[index].productId = value
    this.selectedLocname = value.name;
    this.locationSelected = true;
    this.selectedLocindex = index;
  }
  setSpecGroupChange(value, prodIndex, index) {
    this.reqObj.contractRequestProducts[prodIndex].allowedProducts[index].specGroupId = value;
    this.selectedProname = value.pname;
    this.productSelected = true;
    this.selectedProindex = index;
  }

  addNewAllowedProduct(prodIndex) {
    this.reqObj.contractRequestProducts[prodIndex].allowedProducts.push(this.newAllowedProducts);
  }
  removeProductToContract(prodIndex, key) {
    this.reqObj.contractRequestProducts[prodIndex].allowedProducts.splice(key, 1);
  }
  sendRFQ() {
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
  }
  updateRFQ() {
    const dialogRef = this.dialog.open(UpdateRfqPopupComponent, {
      width: '425px',
      data: { message: 'You are sending the updated RFQ to all counterparties you had previously sent the RFQ. Do you want to continue?', toastMsg: 'RFQ(s) updated successfully' },
      panelClass: ['additional-cost-popup']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'close') {
        this.dialog.closeAll();
      }
    });
  }
  onSelectPlanPeriod(element) {
    this.selectedPlanPeriod = element.type;
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
    if (selectedPlanPeriod == 'Quarter') {
      let selectedQuarters = [];
      let loopIndex = 0;
      this.plan.quarterlyPeriod.filter((i) => {
        if (i.id <= item.id) {
          if(loopIndex == 0) this.reqObj.startDate = new Date(i.startDate);
          i.selected = true;
          this.reqObj.endDate = new Date(i.endDate);
          selectedQuarters.push(i.label);
          loopIndex++;
        } else i.selected = false;
      })
      this.selectedPlanValue = selectedQuarters.join();
    }
    if (selectedPlanPeriod == 'Month') {
      let selectedMonths = [];
      let loopIndex = 0;
      this.plan.monthlyPeriod.filter((i) => {
        if (i.id <= item.id) {
          if(loopIndex == 0) this.reqObj.startDate = new Date(i.startDate);
          i.selected = true;
          this.reqObj.endDate = new Date(i.endDate);
          selectedMonths.push(i.label);
          loopIndex++;
        } else i.selected = false;
      })
      this.selectedPlanValue = selectedMonths.join();
    }
    if (selectedPlanPeriod == 'Year') {
      let selectedYears = [];
      let loopIndex = 0;
      this.plan.yearlyPeriod.filter((i) => {
        if (i.id <= item.id) {
          if(loopIndex == 0) this.reqObj.startDate = new Date(i.startDate);
          i.selected = true;
          this.reqObj.endDate = new Date(i.endDate);
          selectedYears.push(i.label);
          loopIndex++;
        } else i.selected = false;
      })
      this.selectedPlanValue = selectedYears.join();
    }
    if (selectedPlanPeriod == 'Semester') {
      let selectedSemesters = [];
      let loopIndex = 0;
      this.plan.semesterPeriod.filter((i) => {
        if (i.id <= item.id) {
          if(loopIndex == 0) this.reqObj.startDate = new Date(i.startDate);
          i.selected = true;
          this.reqObj.endDate = new Date(i.endDate);
          selectedSemesters.push(i.label);
          loopIndex++;
        } else i.selected = false;
      })
      this.selectedPlanValue = selectedSemesters.join();
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
    let limit = (12 - (moment().month()) === 0) ? 12 : 12 - (moment().month());
    for (var i=0; i < limit; i++) {
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
      //this.errors.mainLocation.duplicate = true;
      return;
    }
    let firstLocation = (this.mainLocations.length > 0) ? false : true;
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
    })
    if(firstLocation) {
      this.reqObj.contractRequestProducts.forEach( prod => {
        prod.locationId = location.id
      });
    } else {
      this.addNewMainProduct(location.id);
    }
  }

  productDataSource(value) {
    if(value && value != ''){
      let filterValue = value.toString().toLowerCase();
    return this.staticData.Product.filter(p => p.name.toString().toLowerCase().includes(filterValue) );
    } else {
      return this.staticData.Product;
    }
  }

  convertDecimalSeparatorStringToNumber(number) {
    let numberToReturn = number;
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

  assignUserIdToReqObj() {
    this.reqObj.createdById = this.currentUserId;
    this.reqObj.lastModifiedById = this.currentUserId;
    if(this.reqObj.contractRequestProducts.length > 0){
      this.reqObj.contractRequestProducts.forEach( product => {
        product.createdById = this.currentUserId;
        product.lastModifiedById = this.currentUserId;
      })
    }
  }

  testForValidDates() {
    let notValidDates = false;
    const start = new Date(this.reqObj.startDate);
    const startDate = start.getTime();
    const end = new Date(this.reqObj.endDate);
    const endDate = end.getTime();
    const quote = new Date(this.reqObj.quoteByDate);
    const quoteDate = quote.getTime();
    const minValidity = new Date(this.reqObj.minValidity);
    const minValidityDate = minValidity.getTime();

    if (startDate > endDate) {
      this.toaster.error(
        'Contract Start Date must be lesser than Contract End Date'
      );
      notValidDates = true;
    }
    if (startDate < quoteDate) {
      this.toaster.error(
        'Quote By Date should be less than  Contract Period'
      );
      notValidDates = true;
    }
    if (startDate < minValidityDate) {
      this.toaster.error(
        'Minimum Validity Date should be less than the Contract Period'
      );
      notValidDates = true;
    }
    return notValidDates;
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
      return;
    }

    // Date fields Valiation
    const notValid = this.testForValidDates();
    if (notValid) {
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
    let minQuantityValidationError = false;
    let perMonthQuantityValidationError = '';
    let perWeekQuantityValidationError = '';
    let perDayQuantityValidationError = '';
    let perLiftQuantityValidationError = '';
    message = 'Please fill in required fields:';
    this.reqObj.quantityDetails.forEach((v, k) => {
      if (typeof v != 'undefined') {
        if (!v.minQuantity) {
          message += ' Min,';
        }
        if (!v.maxQuantity) {
          message += ' Max,';
        }
        if (typeof v.contractualQuantityOptionId != 'undefined') {
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
          if(hasTotalContractualQuantity && totalMaxQuantity < perMonthMaxQuantity){
            perMonthQuantityValidationError = 'Per Month Max Quantity must me smaller than Total ContractualQuantity Max Quantity';
          }
        }
        if (v.contractualQuantityOptionId == 3) {
          perWeekMaxQuantity = this.convertDecimalSeparatorStringToNumber(v.maxQuantity);
          hasPerWeekQuantity = true;
          if(hasPerMonthQuantity && perMonthMaxQuantity < perWeekMaxQuantity){
            perWeekQuantityValidationError = 'Per Week Max Quantity must me smaller than Per Month Max Quantity';
          }
        }
        if (v.contractualQuantityOptionId == 4) {
          perDayMaxQuantity = this.convertDecimalSeparatorStringToNumber(v.maxQuantity);
          hasPerDayQuantity = true;
          if(hasPerWeekQuantity && perWeekMaxQuantity < perDayMaxQuantity){
            perDayQuantityValidationError = 'Per Day Max Quantity must me smaller than Per Month Max Quantity';
          }
        }
        if (v.contractualQuantityOptionId == 5) {
          this.convertDecimalSeparatorStringToNumber(v.maxQuantity);
          hasPerLiftQuantity = true;
          if(hasPerDayQuantity && perDayMaxQuantity < this.convertDecimalSeparatorStringToNumber(v.maxQuantity)){
            perLiftQuantityValidationError = 'Per Lift Max Quantity must me smaller than Per Day Max Quantity';
          }
        }
      }
    });
    if (message != 'Please fill in required fields:') {
      if (message[message.length - 1] == ',') {
        message = message.substring(0, message.length - 1);
      }
      this.toaster.error(message);
      return;
    }
    if (minQuantityValidationError) {
      this.toaster.error('Min Quantity must be smaller than Max Quantity ');
      return false;
    }
    if (!hasTotalContractualQuantity) {
      this.toaster.error(
        'Total ContractualQuantity option is required in Contractual Quantity section'
      );
      return false;
    }

    if ((hasPerWeekQuantity && !hasPerMonthQuantity) || (hasPerDayQuantity && !hasPerWeekQuantity) || (hasPerLiftQuantity && !hasPerDayQuantity)) {
        this.toaster.error(
          'The contract hierarchy of the quantity limit is as follows: Contractual Quantity > Per Month > Per Week > Per Day > Per Lift'
        );
        return false;
    }
    if (perMonthQuantityValidationError != '') {
      this.toaster.error(perMonthQuantityValidationError);
      return false;
    }
    if (perDayQuantityValidationError != '') {
      this.toaster.error(perDayQuantityValidationError);
      return false;
    }
    if (perLiftQuantityValidationError != '') {
      this.toaster.error(perLiftQuantityValidationError);
      return false;
    }
    /* Quantity Details Validation - End */
    
    if(this.mainLocations.length == 0){
      this.toaster.error(
        'Atleast one location should be added'
      );
      return false;
    }

    /* Contract Request Product Validation - Start */
    message = 'Please fill in required fields:';
    this.reqObj.contractRequestProducts.forEach((v, k) => {
      if (typeof v != 'undefined') {
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

  saveContract() {
    this.assignUserIdToReqObj();
    const isValid = this.showFormErrors();
    if (!isValid) {
      return;
    }
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
}