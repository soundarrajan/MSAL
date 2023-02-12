import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { ToastrService } from 'ngx-toastr';
import { ContractNegotiationService } from '../../../../services/contract-negotiation.service';
import { LocalService } from '../../../../services/local-service.service';
@Component({
  selector: 'app-additional-cost-popup',
  templateUrl: './additional-cost-popup.component.html',
  styleUrls: ['./additional-cost-popup.component.scss']
})
export class AdditionalCostPopupComponent implements OnInit {
  public myFormGroup;
  public tableData: any;
  public costList;
  public inactiveCostList;
  newtabledata: any = {};
  getPayload = {};
  uomList: any;
  additionalcoast: any;

  flatUnitTypeList = [
    { id: 1, name: 'Flat' },
    { id: 2, name: 'Unit' }
  ];
  percentageTypeList = [{ id: 3, name: 'Percent' }];

  costTypeList = [];
  ngOnInit() {
    this.myFormGroup = new FormGroup({
      frequency: new FormControl('')
    });
    this.uomList = this.localService.masterData['Uom'];
    this.contractService.getAdditionalCost(this.data.id).subscribe(res => {
      res.forEach(element => {
        element.price = this.tenantService.price(element.price);
        if (element.costTypeId == 1 || element.costTypeId == 2) {
          this.costTypeList.push(this.flatUnitTypeList);
        } else if (element.costTypeId == 3) {
          this.costTypeList.push(this.percentageTypeList);
        }
      });
      this.tableData = res;
      this.getAdditionalCostMasterList();
    });
  }
  constructor(
    public dialogRef: MatDialogRef<AdditionalCostPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public contractService: ContractNegotiationService,
    private localService: LocalService,
    private toaster: ToastrService,
    private tenantService: TenantFormattingService,
    ) { }

  closeDialog() {
    this.dialogRef.close();
  }
  getAdditionalCostMasterList() {
    this.contractService.getMasterAdditionalCostsList({}).subscribe(res => {
      this.costList = res['payload'].filter(e => e.costType.name !== 'Total' && e.costType.name !== 'Range' && e.costType.name !== 'Percent' && e.isDeleted == false);
      this.inactiveCostList = res['payload'].filter(e => e.costType.name !== 'Total' && e.costType.name !== 'Range' && e.costType.name !== 'Percent' && e.isDeleted == true);
      this.inactiveCostList.filter(res => {
        this.tableData.filter(inRes => {
          if (res.id == inRes.additionalCostId) {
            this.costList.push(res);
          }
        });
      });
    });
  }
  onCostNameChange(index, event) {
    let cost = this.costList.find(e => e.id == event);
    this.tableData[index].costTypeId = cost.costType.id;
    if (cost.costType.id == 3) this.costTypeList[index] = this.percentageTypeList;
    else this.costTypeList[index] = this.flatUnitTypeList;
    if (cost.costType.id == 3 || cost.costType.id == 1) {
      this.tableData[index].priceUomId = null;
    }
    this.onPriceChange(index, this.tableData[index].price);
  }
  onCostTypeChange(index, event) {
    if (event == 3 || event == 1) {
      this.tableData[index].priceUomId = null;
    } else {
      this.tableData[index].priceUomId = this.data.requestUomId;
    }
  }
  addNew() {
    this.newtabledata = {
      id: 0,
      ContractRequestProductOfferId: this.data.id,
      additionalCostId: null,
      costName: null,
      costTypeId: null,
      currencyId: 1,
      price: null,
      priceUomId: this.data.requestUomId,
      extras: null,
      comment: null,
      isDeleted: false
    };

    this.tableData.push(this.newtabledata);
  }

  deleteRow(i) {
    if (this.tableData[i].id > 0) {
      this.tableData[i].isDeleted = true;
    } else {
      this.tableData.splice(i, 1);
    }
  }
  onPriceChange(index, price) {
    if(price == '' || price == null) return;
    let isPriceNegative = false;
    let cost = this.costList.find(e => e.id == this.tableData[index].additionalCostId);
    if (Number(price.replace(/,/g, '')) < 0) isPriceNegative = true;
    if (!cost.isAllowingNegativeAmmount && isPriceNegative) {
      this.toaster.error('Negative price is not allowed for cost ' + cost.name);
      this.tableData[index].price = 0;
      return;
    }
    this.tableData[index].price = this.tenantService.price(price);
  }
  onExtrsChange(index, extras) {
    if (Number(this.tableData[index].extras.replace(/,/g, '')) < 0) {
      this.toaster.error('Extra % cannot be negative.');
      this.tableData[index].extras = 0;
      return;
    } else if (Number(this.tableData[index].extras.replace(/,/g, '')) > 100) {
      this.toaster.error('Extra % cannot be greater than 100.');
      this.tableData[index].extras = 0;
      return;
    }
    this.tableData[index].extras = this.tenantService.price(extras);
  }
  saveAdditionalCost() {
    let checkPrice = false;
    let costList = [];
    this.tableData.forEach(element => {
      if (element.additionalCostId != null) {
        let cost = this.costList.find(e => e.id == element.additionalCostId);
        console.log(element.price);
        let rawPrice = element.price;
        let extras = element.extras;
        if (typeof element.price != 'number' && element.price != null && element.price != '') {
          rawPrice = Number(element.price.replace(/,/g, ''));
        }
        if (typeof element.extras != 'number' && element.extras != null && element.extras != '') {
          extras = Number(element.extras.replace(/,/g, ''));
        }
        element.costName = cost.name;
        element.additionalCostId = +element.additionalCostId;
        element.price = rawPrice;
        element.extras = extras;
        element.priceUomId = +element.priceUomId;
        element.costTypeId = +element.costTypeId;
        if (element.price == 0 || element.price == null) {
          checkPrice = true;
          this.toaster.error('Price is required for cost ' + element.costName);
          return;
        }
        costList.push(element);
      }
    });
    if (checkPrice) return;
    let payload = {
      contractRequestId: this.data.contractRequestId,
      contractRequestProductId: this.data.contractRequestProductId,
      contractRequestProductUomId: this.data.requestUomId,
      contractRequestProductOfferId: this.data.id,
      additionalCosts: costList
    };
    this.dialogRef.close();
    this.contractService.saveAdditionalCost(payload).subscribe();
  }
}
