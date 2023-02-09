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
  public tableData:any;
  public costList;
  newtabledata: any = {}
  getPayload = {}
  uomList: any;
  ngOnInit() {
    this.myFormGroup = new FormGroup({
      frequency: new FormControl('')
    });
      this.tableData = this.additionalcoast;
      this.uomList = this.localService.masterData['Uom'];
      
    /**************** get api  **************/
    this.contractService.getAdditionalCost(this.data.id).subscribe();
    /**************** get api  **************/

    this.contractService.getMasterAdditionalCostsList({}).subscribe(res => {
    this.costList =  res['payload'].filter( e =>e.costType.name !== 'Total' &&e.costType.name !== 'Range');
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
  additionalcoast=[
  {
    "id": 0,
    "ContractRequestProductOfferId": this.data.id,
    "additionalCostId": 2,
    "costName": "Tax",
    "costTypeId": 1,
    "currencyId": 1,
    "price": 300.4,
    "priceUomId": 5,
    "extras": 2.0,
    "comment": "Test",
    "isDeleted": false
  },
];
  onCostNameChange(index,event){
    let cost = this.costList.find(e => e.id == event);
    this.tableData[index].costTypeId  = cost.costType.id;
  }
  addNew() {
    this.newtabledata = {
      "id": 0,
      "ContractRequestProductOfferId": this.data.id,
      "additionalCostId": null,
      "costName": null,
      "costTypeId": null,
      "currencyId": 1,
      "price": null,
      "priceUomId": this.data.quantityUomId,
      "extras": null,
      "comment": null,
      "isDeleted": false
    };

    this.additionalcoast.push(this.newtabledata);
  }
  
  delete1(i){
    if(this.tableData[i].id > 0){
      this.tableData[i].isDeleted = true;
    }else{
      this.tableData.splice(i, 1);
    }
    //this.tableData[i].isDeleted = true;
  }
  onPriceChange(index,price){
    this.tenantService.price(price)
    this.tableData[index].price = this.tenantService.price(price)
  }
  saveAdditionalCost(){
    let checkPrice = false;
    let costList = [];
    this.tableData.forEach(element => {
          if(element.additionalCostId != null){
            
            let cost = this.costList.find(e => e.id == element.additionalCostId);
            element.costName = cost.name;
            element.additionalCostId = +element.additionalCostId;
            element.price = +element.price;
            element.priceUomId = +element.priceUomId;
            element.costTypeId = +element.costTypeId;
            if(element.price == 0 || element.price == null){
              checkPrice = true;
              this.toaster.error('Price is required for cost '+ element.costName);
              return;
            }
            costList.push(element);
          }
    });    
    if(checkPrice)return;
    costList.forEach(element => {
      element.price = +element.price;
      element.extras = +element.extras;
    });
    let payload = {
      "contractRequestId": this.data.contractRequestId,
      "contractRequestProductId": this.data.contractRequestProductId,
      "contractRequestProductUomId": this.data.quantityUomId,
      "contractRequestProductOfferId": this.data.id,
      "additionalCosts": costList
    }
    this.dialogRef.close();
    this.contractService.saveAdditionalCost(payload).subscribe();
  }

}