import { ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
import moment from 'moment';
import _ from 'lodash';
import { Subject } from 'rxjs';

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

export const dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const start = control.get('dateStart');
  const end = control.get('dateEnd');
  console.log("validators called");  
  return start.value !== null && end.value !== null && start.value < end.value 
  ? null :{ dateValid:true };
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
      minQuantity: '0.00',
      maxQuantity: '0.00',
      uomId: 5,
      tolerancePercentage: '0.00'
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
      minQuantity: '0.00',
      minQuantityUomId: 5,
      maxQuantity: '0.00',
      maxQuantityUomId: 5,
      pricingTypeId: 1,
      pricingComment: "",
      statusId: 1,
      createdOn: "2022-10-31T10:46:32.596Z",
      createdById: 1,
      lastModifiedById: 1,
      lastModifiedOn: "2022-10-31T10:46:32.596Z",
      allowedProducts: [this.newAllowedProducts],
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
    createdOn: "2022-10-31T10:46:32.596Z",
    createdById: 1,
    lastModifiedById: 1,
    lastModifiedOn: "2022-10-31T10:46:32.596Z",
    quantityDetails: [this.newQuantityDetails],
    contractRequestProducts: []
  }

  errors: any = {
    startDate: { required: false, invalidDateRange: false },
    endDate: { required: false, invalidDateRange: false },
    quoteByDate: { required: false, invalidDateRange: false },
    mainLocation: { required: false, duplicate: false },
    minValidity: { required: false, invalidDateRange: false },
    quantityDetails: [{
      contractualQuantityOptionId: { required: false },
      minQuantity: { required: false, invalidNumberRange: false },
      maxQuantity: { required: false, invalidNumberRange: false },
      uomId: { required: false },
      tolerancePercentage: { required: false }
    }],
    contractRequestProducts: [{
      productId: { required: false },
      specGroupId: { required: false },
      minQuantity: { required: false, invalidNumberRange: false },
      minQuantityUomId: { required: false },
      maxQuantity: { required: false, invalidNumberRange: false },
      maxQuantityUomId: { required: false },
      pricingTypeId: { required: false },
      pricingComment: { required: false },
      allowedProducts: { required: false, duplicate: false },
      allowedLocation: { required: false, duplicate: false }
    }]
  };
  
  get newQuantityDetailsErrors() {
    return {
      contractualQuantityOptionId: { required: false },
      minQuantity: { required: false, invalidNumberRange: false },
      maxQuantity: { required: false, invalidNumberRange: false },
      uomId: { required: false },
      tolerancePercentage: { required: false }
    }
  }

  get newContractRequestProductsErrors() {
    return {
      productId: { required: false },
      specGroupId: { required: false },
      minQuantity: { required: false, invalidNumberRange: false },
      minQuantityUomId: { required: false },
      maxQuantity: { required: false, invalidNumberRange: false },
      maxQuantityUomId: { required: false },
      pricingTypeId: { required: false },
      pricingComment: { required: false }
    }
  }

  setErrorsToFalse(controlName = '') {
    if(controlName !== '') {
      Object.keys(this.errors[controlName]).forEach(eType => this.errors[controlName][eType] = false)
    } else {
      Object.keys(this.errors).forEach(controls => {
        Object.keys(controls).forEach(eType => controls[eType] = false)
      })
    }
  }
    
  setErrors(controlName, errorType, error: boolean = true) {
    console.log('setErrors:controlName::'+ controlName + ', errorType::'+errorType+', error::'+error);
    if(this.errors[controlName] === undefined) this.errors[controlName];
    this.errors[controlName][errorType] = error;
  }

  getLocationProducts(locationId) {
    this.reqObj.contractRequestProducts.filter((x) => x.locationId === locationId);
  }

  comparisonEnddateValidator(): any {
    this.setErrorsToFalse('startDate');
    this.setErrorsToFalse('endDate');
    if(!this.reqObj.startDate) this.setErrors('startDate', 'required');
    if(!this.reqObj.endDate) this.setErrors('endDate', 'required');
    let startnew = new Date(this.reqObj.startDate);
    let endnew = new Date(this.reqObj.endDate);
    if (endnew < startnew) {
      this.setErrors('endDate', 'invalidDaterange');
    } else {
      this.setErrors('endDate', 'invalidDaterange', false);
    }
  }

  comparisonStartdateValidator(): any {
    this.setErrorsToFalse('startDate');
    this.setErrorsToFalse('endDate');
    if(!this.reqObj.startDate) this.setErrors('startDate', 'required');
    if(!this.reqObj.endDate) this.setErrors('endDate', 'required');
    let startnew = new Date(this.reqObj.startDate);
    let endnew = new Date(this.reqObj.endDate);
    if (startnew > endnew) {
      this.setErrors('startDate', 'invalidDaterange');
    } else {
      this.setErrors('startDate', 'invalidDaterange', false);
    }
  }

  isBeforePlanPeriod(controlName) {
    this.setErrorsToFalse(controlName);
    let startnew = new Date(this.reqObj.startDate);
    let dateToCheck = new Date(this.reqObj[controlName]);
    if(dateToCheck > startnew) {
      this.setErrors(controlName, 'invalidDaterange');
    } else {
      this.setErrors(controlName, 'invalidDaterange', false);
    }
  }

  minMaxValidation(parentProperty, index, controlName) {
    this.errors[parentProperty][index]['minQuantity'].invalidNumberRange = false;
    this.errors[parentProperty][index]['maxQuantity'].invalidNumberRange = false;
    let minValue: number = +this.reqObj[parentProperty][index]['minQuantity'];
    let maxValue: number = +this.reqObj[parentProperty][index]['maxQuantity'];
    if(minValue != undefined && maxValue != undefined && minValue > maxValue) {
      this.errors[parentProperty][index][controlName].invalidNumberRange = true;
    } else {
      this.errors[parentProperty][index][controlName].invalidNumberRange = false;
    }
  }
  /* Form Builder */


  @Input() rfqSent;
  enableSaveBtn = true;
  enableRFQBtn = false;
  enableSendRfqBtn = false;
  enableUpdateRfqBtn = false;
  allowedProducts = [{ 'id': 0, 'allowedProducts': { 'id': 1, 'name': 'Product1', 'displayName': 'Product2' } }];
  //minQuantity = "0.00";
  //maxQuantity = "0.00";
  tolerance = "0.00";
  selectedUom = 'MT';
  selectedContractualQuantity = 'Total Contract Qty';
  uoms = ['BBL', 'GAL', 'MT'];
  contractualQuantityOptionList = [
    { name: 'Total Contract Qty' },
    { name: 'PerMonth' },
    { name: 'PerWeek' },
    { name: 'PerDay' },
    { name: 'PerLift' }
  ];
  productData = ['Product1', 'Product2'];
  public product = 'Product1';
  specGroupData = ['specGroup1', 'specGroup2'];
  public specGroup = 'specGroup1';
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
  //hideAllowedLocationDropdown: boolean = true;
  hideAllowedLocationDropdown: any = {
    0: true
  };
  public mainLocationName: any[] = [];
  public allowedLocationName: any[] = [];
  selectedMainLocationName;
  @ViewChild('mainLocationSelect') mainLocationSelect: MatSelect;
  @ViewChild('allowedLocationSelect') allowedLocationSelect: MatSelect;
  locationDataSource = [
    { location: 'Rotterdam' },
    { location: 'Antwerp' }
  ];
  locationBasedSubArray = [];
  public allowedProductsValue = [{ location: '', product: '' }];
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
  locationsList = new Subject();
  public locColsToDispay: any[] = [
    { dispName: "Locations", propName: "name"},
  ];

  constructor(
    private localService: LocalService,
    public dialog: MatDialog,
    private toaster: ToastrService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private contractNegotiationService: ContractNegotiationService,
    private cdRef:ChangeDetectorRef
  ) {
    iconRegistry.addSvgIcon('data-picker-gray', sanitizer.bypassSecurityTrustResourceUrl('../../assets/design-system-icons/shiptech/common-icons/calendar-dark.svg'));
    this.plan.quarterlyPeriod = this.generateQuarterlyPeriod();
    this.plan.monthlyPeriod = this.generateMonthlyPeriod();
    this.plan.yearlyPeriod = this.generateYearlyPeriod();
    this.plan.semesterPeriod = this.generateSemesterPeriod();
    this.localService.getMasterListData([
      "Location",
      "Product",
      "PricingType",
      "QuantityType",
      "SpecGroup",
      "Uom"
    ]).subscribe((data) => {
      this.staticData = data;
      this.locationsList.next(data.Location);
    });
    this.locationBasedSubArray = this.locationBasedProducts[0]?.mainProduct;
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
    })
    this.addNewMainProduct(0);
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

  addContractQuantityDetail() {
    this.reqObj.quantityDetails.push(this.newQuantityDetails);
    this.errors.quantityDetails.push(this.newQuantityDetailsErrors)
  }

  removeContractQuantityDetail(i) {
    this.reqObj.quantityDetails.splice(i, 1);
    this.errors.quantityDetails.splice(i, 1)
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
    console.log('hideAllowedLocationDropdown', this.hideAllowedLocationDropdown);
    this.selectedAllowedLocation = '';
  }

  openAddMainLocationSelect() {
    this.mainLocationSelect.open();
  }

  openAddAllowedLocationSelect() {
    this.allowedLocationSelect.open();
  }

  /*addSelectedMainLocation(locationId) {
    this.showMainLocationDropdown = false;
    console.log('locationId',locationId);
    this.mainLocations.forEach((loc) => {
      if(loc.locationId === locationId)
        loc.selected = true;
      else
        loc.selected = false;
    })
    console.log('mainLocations::click', this.mainLocations);
    console.log('contractRequestProducts::click', this.reqObj.contractRequestProducts[0].locationId);
  }*/

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
    console.log('allowedLocations::', this.productAllowedLocations[prodIndex]);
    /* this.allowedLocationName.push(
      {
        location:selectedAllowedLocation,
        selected:false
      }
      ); */
    let addNewAllowedLoc = this.newAllowedLocations;
    addNewAllowedLoc.locationId = selectedAllowedLocation.id;
    this.reqObj.contractRequestProducts[prodIndex].allowedLocations.push(addNewAllowedLoc);
    console.log('selectedAllowedLocation', selectedAllowedLocation);
    this.selectedAllowedLocation = '';
    console.log('allowedLoc', this.reqObj.contractRequestProducts [prodIndex].allowedLocations);
  }

  deleteMainLocation(index) {
    this.mainLocations.splice(index, 1);
  }

  deleteAllowedLocation(index) {
    this.allowedLocationName.splice(index, 1);
  }

  onClick(selectedProd) {
    this.selectedLocationId = selectedProd.locationId;
    this.mainLocations.forEach((loc) => {
      if(loc.locationId === selectedProd.locationId)
        loc.selected = true;
      else
        loc.selected = false;
    })
    console.log('mainLocations::click', this.mainLocations);
    /*this.mainLocationName.forEach((element) => {
      if (element.location == selectedProd)
        element.selected = true;
      else
        element.selected = false;
    })
    this.locationBasedProducts.forEach((element) => {
      if (element.mainLocationName == selectedProd.mainLocationName) {
        element.selected = true;
        this.locationBasedSubArray = element.mainProduct;
      }
      else
        element.selected = false;
    })*/
  }

  public trackByFnMainProduct(index: number, item: any): number {
    return item.id;
  }

  addNewMainProduct(locationId) {
    this.selectedLocationId = locationId
    let newMainProduct = this.newContractRequestProducts;
    newMainProduct.id = ++this.mainProductCounter;
    newMainProduct.locationId = locationId;
    this.reqObj.contractRequestProducts.push(newMainProduct);
    this.errors.contractRequestProducts.push(this.newContractRequestProductsErrors);
  }

  deleteNewMainProduct(i) {
    i=i+1;
    this.reqObj.contractRequestProducts.splice(i, 1);
  }
  setProductChange(value, prodIndex, index) {
    this.reqObj.contractRequestProducts[prodIndex].allowedProducts[index].productId = value
    console.log(this.reqObj.contractRequestProducts[prodIndex].allowedProducts);
    this.selectedLocname = value.name;
    this.locationSelected = true;
    this.selectedLocindex = index;
  }
  setSpecGroupChange(value, prodIndex, index) {
    this.reqObj.contractRequestProducts[prodIndex].allowedProducts[index].specGroupId = value;
    console.log(this.reqObj.contractRequestProducts[prodIndex].allowedProducts);
    this.selectedProname = value.pname;
    this.productSelected = true;
    this.selectedProindex = index;
  }

  setAllowedLocations(prodIndex, i) {
    if(!this.reqObj.contractRequestProducts[prodIndex].allowedLocations[i]){
      this.reqObj.contractRequestProducts[prodIndex].allowedLocations.push(this.newAllowedLocations);
    }
    // alert(i);
    /*console.log('setAllowedLocations::');
    if (value?.name?.name) {
      this.selectedLocname = value.name.name;
      this.locationSelected = true;
      // this.productSelected = true;
    }
    else {
      this.locationSelected = false;
    }
    if (value?.name?.name) {
      this.selectedProname = value.name.name;
      // this.locationSelected = true;
      this.productSelected = true;
    }
    else {
      this.productSelected = false;
    }

    this.selectedLocindex = i;
    this.selectedProindex = i;*/

  }
  addNewAllowedProduct(prodIndex) {
    this.reqObj.contractRequestProducts[prodIndex].allowedProducts.push(this.newAllowedLocations);
    console.log('contractRequestProducts::', this.reqObj.contractRequestProducts[prodIndex]);
    /*this.locationSelected = false;
    this.productSelected = false;
    this.selectedLocname = "";
    this.selectedProname = "";
    this.selectedLocindex = 999;
    this.selectedProindex = 999;*/
  }
  removeProductToContract(prodIndex, key) {
    this.reqObj.contractRequestProducts[prodIndex].allowedProducts.splice(key, 1);
  }
  sendRFQ() {
    console.log(this.data)
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
    this.errors.mainLocation.duplicate = false;
    this.mainLocationSelect.close();
    this.selectedLocationId = location.id;
    if(this.mainLocations.findIndex((loc) => loc.locationId === location.id) !== -1){
      this.errors.mainLocation.duplicate = true;
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
    console.log('loc-id::', this.reqObj.contractRequestProducts);
  }

  validate(obj){
    this.isValidForm = true;
    this.iterate(obj);
  }
  
  iterate = (obj) => {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        this.iterate(obj[key])
      } else {
        if(obj[key] === true){
          this.isValidForm = false;
        }
      }
    })
  }

  saveContract() {
    this.comparisonEnddateValidator();
    this.comparisonStartdateValidator();
    if(!(this.mainLocations.length > 0)) {
      this.setErrors('mainLocations', 'required');
    }
    this.validate(this.errors);
    console.log('is planDateForm valid ? ', this.errors);
  }

}