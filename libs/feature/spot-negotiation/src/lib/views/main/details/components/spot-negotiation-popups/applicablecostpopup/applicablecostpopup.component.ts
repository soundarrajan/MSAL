import { AdditionalCostViewModel } from './../../../../../../core/models/additional-costs-model';
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpotNegotiationService } from './../../../../../../services/spot-negotiation.service';
import { Component, OnInit, Inject, ViewChild, ElementRef, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  applicableForItems: any = [];
  totalMaxQuantity: number = 0;
  maxQuantityUomId: number;
  maxQuantityUom: string;
  enableSave: boolean = false;

  constructor(public dialogRef: MatDialogRef<ApplicablecostpopupComponent>
    , private spinner: NgxSpinnerService
    , private toastr: ToastrService
    , @Inject(MAT_DIALOG_DATA) public requestLocation: any
    , private spotNegotiationService: SpotNegotiationService) {

  }

  ngOnInit() {
    this.buildApplicableForItems();
    this.getLocationCosts();
  }

  getLocationCosts(){
    this.spinner.show();
    this.spotNegotiationService.getLocationCosts(this.requestLocation.locationId)
    .subscribe((res: any)=>{
      this.spinner.hide();
      if(res){
        this.locationCosts = res;
      }
    });
  }

  saveLocationAdditionalCosts() {
    if (!this.enableSave) {
      this.toastr.warning('No changes are made to perform save.');
      return;
    }

    const payload = { additionalCosts: this.locationBasedCosts }
    this.spotNegotiationService.saveOfferAdditionalCosts(payload)
    .subscribe((res:any) => {
        if(res.status){
          let locationAdditionalCosts = res?.costs?.locationAdditionalCosts;
          locationAdditionalCosts.forEach((cost : any)=> {
            cost.selectedApplicableForId = cost.requestProductId?? 0;
          })
          this.locationBasedCosts = locationAdditionalCosts;
          this.toastr.success('Additional cost saved successfully.');
        }
        else
          this.toastr.error('Please try again later.')
    });

    this.enableSave = false;
  }

  buildApplicableForItems() {
    this.applicableForItems.push({ id: 0, name: 'All' });
    this.requestLocation.requestProducts.forEach((product: any) => {
      if (product.status !== 'Stemmed') {
        this.applicableForItems.push({ id: product.id, name: product.productName });
        this.totalMaxQuantity = this.totalMaxQuantity + product.maxQuantity;
        this.maxQuantityUomId = product.uomId;
        this.maxQuantityUom = product.uomName;
      }
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
    cost.priceUomId = maxQtyDetails.maxQtyUomId;
    this.calculateCostAmount(cost);
    this.enableSave = true;
  }

  calculateCostAmount(cost: any){
    cost.amount = cost.costType === 'Flat'? cost.price : cost.maxQuantity * cost.price;
    cost.extraAmount = cost.extras? cost.amount * cost.extras/100: 0;
    cost.totalAmount = cost.amount + cost.extraAmount;
    cost.ratePerUom = cost.totalAmount / cost.maxQuantity;
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
  }

  closeDialog() {
    this.dialogRef.close();
  }

}

