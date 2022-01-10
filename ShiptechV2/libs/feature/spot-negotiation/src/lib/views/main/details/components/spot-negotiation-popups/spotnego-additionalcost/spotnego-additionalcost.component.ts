import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdditionalCostViewModel } from '../../../../../../core/models/additional-costs-model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-spotnego-additionalcost',
  templateUrl: './spotnego-additionalcost.component.html',
  styleUrls: ['./spotnego-additionalcost.component.css']
})
export class SpotnegoAdditionalcostComponent implements OnInit {
  requestOptions = [
    {
      request: 'Req 12321',
      vessel: 'Merlion',
      selected: true
    },
    {
      request: 'Req 12322',
      vessel: 'Afif',
      selected: true
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
  // locationBasedCosts: AdditionalCostViewModel[] = []; // saved location based costs
  applicableForItems: any = [];
  totalMaxQuantity: number = 0;
  maxQuantityUomId: number;
  maxQuantityUom: string;
  enableSave: boolean = false;
  requestLocation: any;
  costTypeList: any[];
  productList: any[];
  additionalCostList: any;
  offerAdditionalCostList: AdditionalCostViewModel[] = [];
  locationAdditionalCostsList: AdditionalCostViewModel[] = [];
  rowData: any;

  constructor(
    public dialogRef: MatDialogRef<SpotnegoAdditionalcostComponent>,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spotNegotiationService: SpotNegotiationService,
    private legacyLookupsDatabase: LegacyLookupsDatabase
  ) {
    this.requestLocation = data.requestLocation;
    this.rowData = data.rowData;
  }

  ngOnInit() {
    this.buildApplicableForItems();
    this.getAdditionalCosts();
  }

  getAdditionalCosts() {
    this.legacyLookupsDatabase.getTableByName('costType').then(response => {
      this.costTypeList = response;
    });
    this.legacyLookupsDatabase.getTableByName('product').then(response => {
      console.log(response);
      this.productList = response;
    });

    this.spotNegotiationService
      .getMasterAdditionalCosts({})
      .subscribe((response: any) => {
        if (typeof response === 'string') {
          this.toastr.error(response);
        } else {
          console.log(response);
          this.additionalCostList = _.cloneDeep(response.payload);
          console.log(this.additionalCostList);
        }
      });

    if (this.rowData?.requestOffers?.length > 0) {
      const firstOffer = this.rowData.requestOffers[0];
      const payload = {
        offerId: firstOffer.offerId,
        requestLocationId: this.rowData.requestLocationId,
        isLocationBased: false
      };
      this.spotNegotiationService
        .getAdditionalCosts(payload)
        .subscribe((response: any) => {
          if (typeof response === 'string') {
            this.toastr.error(response);
          } else {
            console.log(response);
            this.offerAdditionalCostList = _.cloneDeep(
              response.offerAdditionalCosts
            );
            this.locationAdditionalCostsList = _.cloneDeep(
              response.locationAdditionalCostsList
            );
          }
        });
    }
  }

  /**
   * Create Applicable For dropdown values
   */

  buildApplicableForItems() {
    this.applicableForItems.push({ id: 0, name: 'All' });
    this.requestLocation.requestProducts.forEach((product: any) => {
      if (product.status !== 'Stemmed') {
        this.applicableForItems.push({
          id: product.id,
          name: product.productName
        });
        this.totalMaxQuantity = this.totalMaxQuantity + product.maxQuantity;
        this.maxQuantityUomId = product.uomId;
        this.maxQuantityUom = product.uomName;
      }
    });
  }

  onCostSelectionChange(additionalCost: any, selectedIndex: number) {
    let cost = this.offerAdditionalCostList[selectedIndex];
    cost.requestLocationId = this.requestLocation.id;
    cost.isLocationBased = false;
    cost.additionalCostId = additionalCost.id;
    const maxQtyDetails = this.getMaxQuantityByApplicableFor(
      cost.selectedApplicableForId
    );
    cost.maxQuantity = maxQtyDetails.maxQty;
    cost.maxQuantityUom = maxQtyDetails.maxQtyUom;
    cost.priceUomId = maxQtyDetails.maxQtyUomId;
    this.calculateCostAmount(cost);
    this.enableSave = true;
  }

  getMaxQuantityByApplicableFor(requestProductId: any) {
    if (requestProductId > 0) {
      const product = this.requestLocation.requestProducts.find(
        (item: any) => item.id === requestProductId
      );
      return {
        maxQty: product.maxQuantity,
        maxQtyUomId: product.uomId,
        maxQtyUom: product.uomName
      };
    } else
      return {
        maxQty: this.totalMaxQuantity,
        maxQtyUomId: this.maxQuantityUomId,
        maxQtyUom: this.maxQuantityUom
      };
  }

  onApplicableForChange(
    selectedApplicableForId: number,
    selectedIndex: number
  ) {
    let cost = this.offerAdditionalCostList[selectedIndex];
    cost.requestProductId =
      selectedApplicableForId === 0 ? null : cost.selectedApplicableForId;
    cost.isAllProductsCost = cost.requestProductId ? false : true;

    const maxQtyDetails = this.getMaxQuantityByApplicableFor(
      selectedApplicableForId
    );
    cost.maxQuantity = maxQtyDetails.maxQty;
    cost.maxQuantityUom = maxQtyDetails.maxQtyUom;
    cost.priceUomId = maxQtyDetails.maxQtyUomId;
    this.calculateCostAmount(cost);
    this.enableSave = true;
  }

  calculateCostAmount(cost: any) {
    cost.amount =
      cost.costType === 'Flat' ? cost.price : cost.maxQuantity * cost.price;
    cost.extraAmount = cost.extras ? (cost.amount * cost.extras) / 100 : 0;
    cost.totalAmount = cost.amount + cost.extraAmount;
    cost.ratePerUom = cost.totalAmount / cost.maxQuantity;
  }

  addNew() {
    const additionalCost = {
      selectedApplicableForId: 0
    } as AdditionalCostViewModel;
    this.offerAdditionalCostList.push(additionalCost);
  }

  removeCost(j: number, cost: any) {
    this.offerAdditionalCostList.splice(j, 1);
    cost.isDeleted = true;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  compareObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  /**
   * Change the cost type to the default for the respective additional cost.
   */
  additionalCostNameChanged(additionalCost) {
    console.log(additionalCost);
    additionalCost.costType = this.getAdditionalCostDefaultCostType(
      additionalCost
    );
  }

  /**
   * Get the corresponding component type ID for a given additional cost.
   */
  getAdditionalCostDefaultCostType(additionalCost) {
    if (!additionalCost.additionalCost) {
      return false;
    }
    if (this.additionalCostList[additionalCost.additionalCost.id].costType) {
      if (
        this.additionalCostList[additionalCost.additionalCost.id].costType.id ==
          1 ||
        this.additionalCostList[additionalCost.additionalCost.id].costType.id ==
          2
      ) {
        additionalCost.allowedCostTypes = [];
        this.costTypeList.forEach(v => {
          if (v.id == 1 || v.id == 2) {
            additionalCost.allowedCostTypes.push(v);
          }
        });
      } else {
        additionalCost.allowedCostTypes = [];
        this.costTypeList.forEach(v => {
          if (v.id == 3) {
            additionalCost.allowedCostTypes.push(v);
          }
        });
      }

      return this.additionalCostList[additionalCost.additionalCost.id].costType;
    }
    return false;
  }
}
