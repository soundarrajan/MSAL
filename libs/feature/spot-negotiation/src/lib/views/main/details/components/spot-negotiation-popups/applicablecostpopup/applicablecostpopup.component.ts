import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { MatSelect } from '@angular/material/select';
import { AdditionalCostViewModel } from './../../../../../../core/models/additional-costs-model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpotNegotiationService } from './../../../../../../services/spot-negotiation.service';
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import _ from 'lodash';
@Component({
  selector: 'app-applicablecostpopup',
  templateUrl: './applicablecostpopup.component.html',
  styleUrls: ['./applicablecostpopup.component.css']
})
export class ApplicablecostpopupComponent implements OnInit {

  requestOptions = [
    {
      request: 'Req 12321', vessel: 'Merlion', selected: true
    },
    {
      request: 'Req 12322', vessel: 'Afif', selected: true
    }
  ];
  disableScrollDown = false;
  public showaddbtn = true;
  isShown: boolean = true; // hidden by default
  isShown2: boolean = true;
  isBtnActive: boolean = false;
  isButtonVisible = true;
  iscontentEditable = false;

  locationCosts: any = []; // location specific costs from location master
  locationBasedCosts: AdditionalCostViewModel[] = []; // saved location based costs
  deletedCosts: AdditionalCostViewModel[] = []; // deleted costs
  applicableForItems: any = [];
  totalMaxQuantity: number = 0;
  maxQuantityUomId: number;
  maxQuantityUom: string;
  enableSave: boolean = false;
  costTypeList: any[];
  uomList: any[];
  currencyList: any[];

  constructor(public dialogRef: MatDialogRef<ApplicablecostpopupComponent>
    , private spinner: NgxSpinnerService
    , private toastr: ToastrService
    , @Inject(MAT_DIALOG_DATA) public requestLocation: any
    , private spotNegotiationService: SpotNegotiationService
    , private legacyLookupsDatabase: LegacyLookupsDatabase,) {

  }

  ngOnInit() {
    this.buildApplicableForItems();
    this.getLocationCosts();
  }

  getLocationCosts(){
    this.spinner.show();
    this.spotNegotiationService.getLocationCosts(this.requestLocation.locationId)
    .subscribe((res: any)=>{
      // this.spinner.hide();
      if(res){
        this.locationCosts = res;
      }
      const payload = {
        requestLocationId: this.requestLocation.id,
        isLocationBased: true
      };
      this.spotNegotiationService.getAdditionalCosts(payload)
        .subscribe((response: any) => {
          this.spinner.hide();
          this.locationBasedCosts = this.formatCostItemForDisplay(response.locationAdditionalCosts)
         });
    });
  }

  saveLocationAdditionalCosts() {
    if (!this.enableSave) {
      this.toastr.warning('No changes are made to perform save.');
      return;
    }

    const payload = {
      additionalCosts: this.locationBasedCosts.concat(this.deletedCosts),
      skipTotalCostUpdate: true
    };
    this.spotNegotiationService.saveOfferAdditionalCosts(payload)
    .subscribe((res:any) => {
        if(res.status){
          this.locationBasedCosts = this.formatCostItemForDisplay(res?.costs?.locationAdditionalCosts)
          this.toastr.success('Additional cost saved successfully.');
          this.deletedCosts = [];
        }
        else
          this.toastr.error('Please try again later.')
    });

    this.enableSave = false;
  }

  formatCostItemForDisplay(locationAdditionalCosts: any){
    locationAdditionalCosts.forEach((cost : any)=> {
      cost.selectedApplicableForId = cost.isAllProductsCost? 0 : cost.requestProductId;
      cost.costType = this.costTypeList.find(c=> c.id === cost.costTypeId)?.name;
      cost.maxQuantityUom = this.uomList.find(c=> c.id === cost.maxQuantityUomId)?.name;
      cost.currency = this.currencyList.find(c=> c.id === cost.currencyId)?.code;
    });

    return locationAdditionalCosts;
  }

  buildApplicableForItems() {
    this.applicableForItems.push({ id: 0, name: 'All' });
    this.requestLocation.requestProducts.forEach((product: any) => {
      if (product.status !== 'Stemmed') {
        this.applicableForItems.push({ id: product.id, name: product.productName, productId: product.productId });
        this.totalMaxQuantity = this.totalMaxQuantity + product.maxQuantity;
        this.maxQuantityUomId = product.uomId;
        this.maxQuantityUom = product.uomName;
      }
    });

    this.legacyLookupsDatabase.getTableByName('costType').then(response => {
      this.costTypeList = response;
    });
    this.legacyLookupsDatabase.getTableByName('uom').then(response => {
      this.uomList = response;
    });
    this.legacyLookupsDatabase.getTableByName('currency').then(response => {
      this.currencyList = response;
    });
  }

  onCostSelectionChange(selectedCostId: number, selectedIndex: number){
    let cost = this.locationBasedCosts[selectedIndex];
    const selectedCost = this.locationCosts.find((cost: any)=>{
      return cost.id === selectedCostId
    });
    cost.requestLocationId = this.requestLocation.id;
    cost.isLocationBased = true;
    cost.additionalCostId = selectedCost.additionalCostId;
    cost.requestProductId = cost.selectedApplicableForId === 0? null: cost.selectedApplicableForId;
    cost.isAllProductsCost = cost.requestProductId? false: true;

    cost.costName = selectedCost.costName;
    cost.costTypeId = selectedCost.costTypeId;
    cost.costType = selectedCost.costType;
    const maxQtyDetails = this.getMaxQuantityByApplicableFor(cost.selectedApplicableForId);
    cost.maxQuantity = maxQtyDetails.maxQty;
    cost.maxQuantityUom = maxQtyDetails.maxQtyUom;
    cost.maxQuantityUomId = maxQtyDetails.maxQtyUomId;
    cost.priceUomId = maxQtyDetails.maxQtyUomId;
    cost.price = selectedCost.price;
    cost.currency = selectedCost.currencyCode;
    cost.currencyId = selectedCost.currencyId;
    cost.extras = selectedCost.extrasPercentage;
    this.calculateCostAmount(cost);
    this.enableSave = true;
  }

  getMaxQuantityByApplicableFor(requestProductId: any) {
    if (requestProductId > 0){
      const product = this.requestLocation.requestProducts.find((item: any)=> item.id === requestProductId);
      return { maxQty: product.maxQuantity, maxQtyUomId: product.uomId, maxQtyUom: product.uomName };
    }
    else
      return { maxQty: this.totalMaxQuantity, maxQtyUomId: this.maxQuantityUomId, maxQtyUom: this.maxQuantityUom };
  }

  onApplicableForChange(selectedApplicableForId: number, selectedIndex: number){
    let cost = this.locationBasedCosts[selectedIndex];
    cost.requestProductId = selectedApplicableForId === 0? null: cost.selectedApplicableForId;
    cost.isAllProductsCost = cost.requestProductId? false: true;

    const maxQtyDetails = this.getMaxQuantityByApplicableFor(selectedApplicableForId);
    cost.maxQuantity = maxQtyDetails.maxQty;
    cost.maxQuantityUom = maxQtyDetails.maxQtyUom;
    cost.maxQuantityUomId = maxQtyDetails.maxQtyUomId;
    cost.priceUomId = maxQtyDetails.maxQtyUomId;
    this.calculateCostAmount(cost);
    this.enableSave = true;
  }

  calculateCostAmount(cost: any){
    cost.amount = this.getCostAmountByType(cost);
    cost.extraAmount = cost.extras? cost.amount * (cost.extras/100): 0;
    cost.totalAmount = cost.amount + cost.extraAmount;
    cost.ratePerUom = cost.totalAmount / cost.maxQuantity;
  }

  getCostAmountByType(cost: any){
    var costAmount = 0;
    switch(cost.costType){
      case 'Flat':
        costAmount = cost.price;
        break;
      case 'Unit':
        costAmount = cost.maxQuantity * cost.price;
        break;
      case 'Percent':
        costAmount = cost.price;
        break;
      case 'Range':
      case 'Total':
        this.getRangeTotalAdditionalCosts(cost);
        break;
    }
    return costAmount;
  }

  getRangeTotalAdditionalCosts(cost: any){
    let productId = cost.requestProductId?
        this.applicableForItems.find((item: any) => item.id == cost.requestProductId)?.productId : 1;
    const payload = {
      Payload: {
        Filters: [
          {
            ColumnName: 'ProductId',
            Value: productId?? 1
          },
          {
            ColumnName: 'LocationId',
            Value: this.requestLocation.locationId
          },
          {
            ColumnName: 'AdditionalCostId',
            Value: cost.locationAdditionalCostId
          },
          {
            ColumnName: 'Qty',
            Value: cost.maxQuantity
          },
          {
            ColumnName: 'QtyUomId',
            Value: cost.maxQuantityUomId
          }
        ],
        Pagination: {
          Skip: 0,
          Take: 25
        },
        SearchText: null
      }
    };

    this.spinner.show();
    this.spotNegotiationService.getRangeTotalAdditionalCosts(payload)
      .subscribe((response: any) => {
        this.spinner.hide();
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          cost.price = response.price;
          cost.amount = response.price;

          cost.extraAmount = cost.extras ? cost.amount * (cost.extras / 100) : 0;
          cost.totalAmount = cost.amount + cost.extraAmount;
          cost.ratePerUom = cost.totalAmount / cost.maxQuantity;

          let locationBasedCost = this.locationBasedCosts.find((c: any) => c.id == cost.id);
          locationBasedCost = cost;
        }
      });
  }

  addNew() {
    if(this.locationCosts.length === 0)
      this.toastr.warning('No location specific additional cost is available.')
    else{
      const additionalCost = { selectedApplicableForId: 0 } as AdditionalCostViewModel;
      this.locationBasedCosts.push(additionalCost);
    }
  }

  removeCost(j: number, cost: any) {
    this.locationBasedCosts.splice(j, 1);
    cost.isDeleted = true;
    if(cost.id){
      this.deletedCosts.push(cost);
      this.enableSave = true;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}

