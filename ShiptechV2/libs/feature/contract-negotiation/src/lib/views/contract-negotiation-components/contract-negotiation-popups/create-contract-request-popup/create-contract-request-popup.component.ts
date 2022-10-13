import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  setStartDate = new FormControl(new Date(''));
  setEndDate = new FormControl(new Date(''));
  @Input() rfqSent;
  enableSaveBtn = false;
  enableRFQBtn = false;
  enableSendRfqBtn = false;
  enableUpdateRfqBtn = false;
  public details = [{
    id: 0,
    minContractQuantity: 0.00,
    contractualQuantityOption: {
      code: null,
      databaseValue: 0,
      description: null,
      displayName: null,
      id: 1,
      internalName: null,
      name: 'TotalContractualQuantity',
      productTypeId: 0,
      transactionTypeId: 0
    },
    uom: {
      clientIpAddress: null,
      code: '',
      collectionName: null,
      customNonMandatoryAttribute1: 'TON',
      displayName: '',
      id: 5,
      internalName: '',
      isDeleted: false,
      modulePathUrl: null,
      name: 'MT',
      userAction: null
    }
  }];
  public locationBasedProducts = [
    {
      id: 0,
      mainLocationName: 'Rotterdam',
      selected: true,
      mainProduct: [{
        productId: 1,
        allowedLocations: []
      }]
    }];
  allowedProducts = [{ 'id': 0, 'allowedProducts': { 'id': 1, 'name': 'Product1', 'displayName': 'Product2' } }];
  minQuantity = "0.00";
  maxQuantity = "0.00";
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
  contractQuarterList = [
    { 'quarter': 'Q3 2022', 'selected': false },
    { 'quarter': 'Q4 2022', 'selected': false },
    { 'quarter': 'Q1 2023', 'selected': false },
    { 'quarter': 'Q2 2023', 'selected': false },
    { 'quarter': 'Q3 2023', 'selected': false },
    { 'quarter': 'Q4 2023', 'selected': false }
  ];
  selectedPlanPeriod = 'Quarter';
  selectedPlanValue = '';
  planPeriod = [
    { 'type': 'Quarter', 'selected': true },
    { 'type': 'Month', 'selected': false },
    { 'type': 'Year', 'selected': false },
    { 'type': 'Semester', 'selected': false }
  ];
  quarterlyPeriod = [
    { 'id': '0', 'label': 'Q3 2022', 'selected': true, 'startDate': '7/1/2022', 'endDate': '9/31/2022' },
    { 'id': '1', 'label': 'Q4 2022', 'selected': true, 'startDate': '10/1/2022', 'endDate': '12/31/2022' },
    { 'id': '2', 'label': 'Q1 2023', 'selected': false, 'startDate': '1/1/2023', 'endDate': '3/31/2023' },
    { 'id': '3', 'label': 'Q2 2023', 'selected': false, 'startDate': '4/1/2023', 'endDate': '6/30/2023' },
    { 'id': '4', 'label': 'Q3 2023', 'selected': false, 'startDate': '7/1/2023', 'endDate': '9/31/2023' },
    { 'id': '5', 'label': 'Q4 2023', 'selected': false, 'startDate': '10/1/2023', 'endDate': '12/31/2023' }
  ];
  monthlyPeriod = [
    { 'id': '0', 'label': 'Jan 2022', 'selected': false, 'startDate': '1/1/2022', 'endDate': '1/31/2022' },
    { 'id': '1', 'label': 'Feb 2022', 'selected': false, 'startDate': '2/1/2022', 'endDate': '2/29/2022' },
    { 'id': '2', 'label': 'Mar 2022', 'selected': true, 'startDate': '3/1/2022', 'endDate': '3/31/2022' },
    { 'id': '3', 'label': 'Apr 2022', 'selected': false, 'startDate': '4/1/2022', 'endDate': '4/30/2022' },
    { 'id': '4', 'label': 'May 2022', 'selected': false, 'startDate': '5/1/2022', 'endDate': '5/31/2022' },
    { 'id': '5', 'label': 'June 2022', 'selected': false, 'startDate': '6/1/2022', 'endDate': '6/30/2022' },
    { 'id': '6', 'label': 'July 2022', 'selected': false, 'startDate': '7/1/2022', 'endDate': '7/31/2022' },
    { 'id': '7', 'label': 'Aug 2022', 'selected': false, 'startDate': '8/1/2022', 'endDate': '8/31/2022' },
    { 'id': '8', 'label': 'Sep 2022', 'selected': false, 'startDate': '9/1/2022', 'endDate': '9/30/2022' },
    { 'id': '9', 'label': 'Oct 2022', 'selected': false, 'startDate': '10/1/2022', 'endDate': '10/31/2022' },
    { 'id': '10', 'label': 'Nov 2022', 'selected': false, 'startDate': '11/1/2022', 'endDate': '11/30/2022' },
    { 'id': '11', 'label': 'Dec 2022', 'selected': false, 'startDate': '12/1/2022', 'endDate': '12/31/2022' }
  ];
  yearlyPeriod = [
    { 'id': '0', 'label': '2021', 'selected': false, 'startDate': '1/1/2021', 'endDate': '3/31/2021' },
    { 'id': '1', 'label': '2022', 'selected': true, 'startDate': '1/1/2022', 'endDate': '3/31/2022' },
    { 'id': '2', 'label': '2023', 'selected': false, 'startDate': '1/1/2023', 'endDate': '3/31/2023' },
    { 'id': '3', 'label': '2024', 'selected': false, 'startDate': '1/1/2024', 'endDate': '3/31/2024' },
    { 'id': '4', 'label': '2025', 'selected': false, 'startDate': '1/1/2025', 'endDate': '3/31/2025' },
    { 'id': '5', 'label': '2026', 'selected': false, 'startDate': '1/1/2026', 'endDate': '3/31/2026' }
  ];
  semesterPeriod = [
    { 'id': '0', 'label': 'S1 2022', 'selected': false, 'startDate': '1/1/2022', 'endDate': '6/30/2022' },
    { 'id': '1', 'label': 'S2 2022', 'selected': false, 'startDate': '7/1/2022', 'endDate': '12/31/2022' },
    { 'id': '2', 'label': 'S1 2023', 'selected': false, 'startDate': '1/1/2023', 'endDate': '2/5/2023' },
    { 'id': '3', 'label': 'S2 2023', 'selected': true, 'startDate': '7/1/2023', 'endDate': '12/31/2023' },
    { 'id': '4', 'label': 'S1 2024', 'selected': false, 'startDate': '1/1/2024', 'endDate': '2/5/2024' },
    { 'id': '5', 'label': 'S2 2024', 'selected': false, 'startDate': '7/1/2024', 'endDate': '12/31/2024' }
  ];
  selectedMainLocation = '';
  selectedAllowedLocation: any;
  displayedColumns: string[] = ['location'];
  hideMainLocationDropdown: boolean = true;
  hideAllowedLocationDropdown: boolean = false;
  public mainLocationName: any[] = [];
  public allowedLocationName: any[] = [];
  selectedMainLocationName;
  @ViewChild('mySelect') mainLocationSelect: MatSelect;
  @ViewChild('mySelect') allowedLocationSelect: MatSelect;
  locationDataSource = [
    { location: 'Rotterdam' },
    { location: 'Antwerp' }
  ];
  locationBasedSubArray = [];
  public allowedProductsValue = [{ location: '', product: '' }];
  displayedLocColumns: string[] = ['name'];
  displayedColumns2: string[] = ['name',];
  locationMasterSearchListOptions = [
    { 'name': 'DMB MAX 0.1 %S', 'country': 'Aalesund' },
    { 'name': 'DMA MAX 1%', 'country': 'Aarhus' },
    { 'name': 'SDMB MAX 0.1 %S', 'country': 'Aalborg' },
    { 'name': 'DMB MAX 0.1 %S', 'country': 'Aalesund' },
    { 'name': 'DMA MAX 1%', 'country': 'Aarhus' },
    { 'name': 'SDMB MAX 0.1 %S', 'country': 'Aalborg' },
  ];
  productMasterSearchListOptions = [
    { 'pname': 'DMB MAX 0.1 %S', 'type': 'LSFO' },
    { 'pname': 'DMA MAX 1%', 'type': 'DOGO' },
    { 'pname': 'SDMB MAX 0.1 %S', 'type': 'LSFO' },
    { 'pname': 'XDMA MAX 1%', 'type': 'DOGO' },
    { 'pname': 'DMB MAX 0.1 %S', 'type': 'LSFO' },
    { 'pname': 'DMB MAX 0.1 %S', 'type': 'LSFO' },
    { 'pname': 'DMA MAX 1%', 'type': 'DOGO' },
    { 'pname': 'SDMB MAX 0.1 %S', 'type': 'LSFO' },
    { 'pname': 'XDMA MAX 1%', 'type': 'DOGO' },
    { 'pname': 'DMB MAX 0.1 %S', 'type': 'LSFO' },
    { 'pname': 'DMB MAX 0.1 %S', 'type': 'LSFO' },
    { 'pname': 'DMA MAX 1%', 'type': 'DOGO' },
    { 'pname': 'SDMB MAX 0.1 %S', 'type': 'LSFO' },
    { 'pname': 'XDMA MAX 1%', 'type': 'DOGO' },
    { 'pname': 'DMB MAX 0.1 %S', 'type': 'LSFO' },
  ];
  public locationSelected: boolean = false;
  public productSelected: boolean = false;
  public selectedLocname;
  public selectedLocindex: number;
  public selectedProindex: number;
  public selectedProname;
  expandLocation: boolean = false;

  constructor(private localService: LocalService, public dialog: MatDialog, private toaster: ToastrService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, @Inject(MAT_DIALOG_DATA) public data: any) {
    iconRegistry.addSvgIcon('data-picker-gray', sanitizer.bypassSecurityTrustResourceUrl('../../assets/design-system-icons/shiptech/common-icons/calendar-dark.svg'));
  }

  ngOnInit(): void {
    this.locationBasedSubArray = this.locationBasedProducts[0].mainProduct;

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
    this.details.push({
      id: 0,
      minContractQuantity: 0.00,
      contractualQuantityOption: {
        code: null,
        databaseValue: 0,
        description: null,
        displayName: null,
        id: 1,
        internalName: null,
        name: 'TotalContractualQuantity',
        productTypeId: 0,
        transactionTypeId: 0
      },
      uom: {
        clientIpAddress: null,
        code: '',
        collectionName: null,
        customNonMandatoryAttribute1: 'TON',
        displayName: '',
        id: 5,
        internalName: '',
        isDeleted: false,
        modulePathUrl: null,
        name: 'MT',
        userAction: null
      }
    });
  }

  removeContractQuantityDetail(key) {
    this.details.splice(key, 1);
  }

  addAllowedProducts() {
    this.allowedProducts.push({ 'id': 0, 'allowedProducts': { 'id': 1, 'name': 'Manifold', 'displayName': 'Manifold' } });
  }

  removeAllowedProducts(index) {
    this.allowedProducts.splice(index, 1);
  }

  addNewMainLocation() {
    this.hideMainLocationDropdown = false;
    this.selectedMainLocation = '';
  }

  addNewAllowedLocation() {
    this.hideAllowedLocationDropdown = false;
    this.selectedAllowedLocation = '';
  }

  openAddMainLocationSelect() {
    this.mainLocationSelect.open();
  }

  openAddAllowedLocationSelect() {
    this.allowedLocationSelect.open();
  }

  addSelectedMainLocation(selectedMainLocation) {
    this.hideMainLocationDropdown = true;
    this.mainLocationName.push(
      {
        location: selectedMainLocation,
        selected: false
      }
    );
  }

  addSelectedAllowedLocation(prod, selectedAllowedLocation) {
    this.hideAllowedLocationDropdown = true;
    /* this.allowedLocationName.push(
      {
        location:selectedAllowedLocation,
        selected:false
      }
      ); */
    this.locationBasedSubArray.forEach((element) => {
      if (element.productId == prod.productId) {
        element.allowedLocations.push({
          location: selectedAllowedLocation,
          selected: false
        })
      }
    })
    this.selectedAllowedLocation = '';
    console.log(this.locationBasedSubArray)

  }

  deleteMainLocation(index) {
    this.locationBasedProducts.splice(index, 1);
  }

  deleteAllowedLocation(index) {
    this.allowedLocationName.splice(index, 1);
  }

  openSelectedMainLocation($event, location) {
    this.selectedMainLocationName = location;
    this.locationBasedProducts.push({
      id: 1,
      mainLocationName: location,
      selected: false,
      mainProduct: [{
        productId: 1,
        allowedLocations: [
          {
            location: 'Rotterdam',
            selected: false
          }
        ]
      }]
    });
  }

  onClick(selectedProd) {
    this.mainLocationName.forEach((element) => {
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
    })
  }

  addNewMainProduct(prod) {
    this.locationBasedSubArray.push({
      productId: prod.productId + 1
    });
  }

  deleteNewMainProduct(prod) {
    this.locationBasedSubArray.splice(prod.productId, 1);
  }
  setLocationChange(test, value, index) {
    this.selectedLocname = value.name;
    this.locationSelected = true;
    this.selectedLocindex = index;
  }
  setProductChange(value, index) {
    //console.log(value);
    this.selectedProname = value.pname;
    this.productSelected = true;
    this.selectedProindex = index;
  }
  setAllowedProducts(i) {

  }
  setAllowedLocations(value, i) {
    // alert(i);
    console.log(value);
    if (value?.name?.name) {
      this.selectedLocname = value.name.name;
      this.locationSelected = true;
      // this.productSelected = true;
    }
    else {
      this.locationSelected = false;
    }
    if (value?.pname?.pname) {
      this.selectedProname = value.pname.pname;
      // this.locationSelected = true;
      this.productSelected = true;
    }
    else {
      this.productSelected = false;
    }

    this.selectedLocindex = i;
    this.selectedProindex = i;

  }
  addNewAllowedProduct() {
    this.allowedProductsValue.push({ location: '', product: '' });
    this.locationSelected = false;
    this.productSelected = false;
    this.selectedLocname = "";
    this.selectedProname = "";
    this.selectedLocindex = 999;
    this.selectedProindex = 999;
  }
  removeProductToContract(key) {
    this.allowedProductsValue.splice(key, 1);
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
  selectPlanPeriod(event, item, selectedPlanPeriod) {
    event.stopPropagation();
    if (selectedPlanPeriod == 'Quarter') {
      this.quarterlyPeriod.filter((i) => {
        // if (i.selected) {
        //   i.selected = !i.selected;
        // }
        
        if (i.id == item.id) {
          i.selected = !i.selected;
          this.selectedPlanValue = i.label;
          this.setStartDate.setValue(new Date(i.startDate));
          this.setEndDate.setValue(new Date(i.endDate));
        }
      })
    }
    if (selectedPlanPeriod == 'Month') {
      this.monthlyPeriod.filter((i) => {
        // if (i.selected) {
        //   i.selected = !i.selected;
        // }
        if (i.id == item.id) {
          i.selected = !i.selected;
          this.selectedPlanValue = i.label;
          this.setStartDate.setValue(new Date(i.startDate));
          this.setEndDate.setValue(new Date(i.endDate));
          console.log(this.setEndDate)

        }
      })
    }
    if (selectedPlanPeriod == 'Year') {
      this.yearlyPeriod.filter((i) => {
        // if (i.selected) {
        //   i.selected = !i.selected;
        // }
        if (i.id == item.id) {
          i.selected = !i.selected;
          this.selectedPlanValue = i.label;
          this.setStartDate.setValue(new Date(i.startDate));
          this.setEndDate.setValue(new Date(i.endDate));
        }
      })
    }
    if (selectedPlanPeriod == 'Semester') {
      this.semesterPeriod.filter((i) => {
        // if (i.selected) {
        //   i.selected = !i.selected;
        // }
        if (i.id == item.id) {
          i.selected = !i.selected;
          this.selectedPlanValue = i.label;
          this.setStartDate.setValue(new Date(i.startDate));
          this.setEndDate.setValue(new Date(i.endDate));
        }
      })
    }
  }

}

