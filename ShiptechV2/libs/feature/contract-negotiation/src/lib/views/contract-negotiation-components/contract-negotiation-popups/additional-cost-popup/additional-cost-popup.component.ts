import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  uomList: any;
  ngOnInit() {
    this.myFormGroup = new FormGroup({
      frequency: new FormControl('')
    });
      this.tableData = this.additionalcoast;
      this.uomList = this.localService.masterData['Uom'];
    let getPayload ={
      "contractRequestProductOfferId": "[1834,1835]"
    }
   // this.contractService.getAdditionalCost(getPayload).subscribe();
    this.contractService.getMasterAdditionalCostsList({}).subscribe(res => {
     this.costList =  res['payload'].filter( e =>e.costType.name !== 'Total' &&e.costType.name !== 'Range');
    });
  }
  constructor(
    public dialogRef: MatDialogRef<AdditionalCostPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public contractService: ContractNegotiationService,
    private localService: LocalService
    ) { }

  closeDialog() {
    this.dialogRef.close();
  }
  additionalcoast=[
  {
    id:1,
    costname: 'Surveyor Fee',
    itemname: 'new1',
    costtype: 'Unit',
    maxqty: '1500  MT',
    price: '5000',
    priceuom: 'Pails of 20 liters',
    applicationFor:'',
    extra: '0',
    amount: '2.00',
    extraamt: '5000',
    totalamt: '',
    rate: '',
    currency: 'US dollars',
    comment: '',
    checked: false,
    isDeleted: false
  },
];
  onCostNameChange(){
    console.log(this.tableData);
  }
  addNew() {
    this.newtabledata = {
        id:0,
        costname: null,
        itemname: null,
        costtype: null,
        price: null,
        priceuom: null,
        extra: null,
        amount: null,
        currency: 'US dollars',
        comment: '',
        isDeleted: false
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
  saveAdditionalCost(){
    let payload = {
      "contractRequestId": 268,
      "contractRequestProductId": 453,
      "contractRequestProductUomId": 5,
      "contractRequestProductOfferId": "[1834,1835]",
      "additionalCosts": [
        {
          "id": 0,
          "ContractRequestProductOfferId": "[1834,1835]",
          "additionalCostId": 2,
          "costName": "TAX",
          "costTypeId": 1,
          "currencyId": 1,
          "price": 401.0,
          "priceUomId": 5,
          "extras": 2.0,
          "comment": "Test",
          "isDeleted": false
        }
      ]
    }
    this.contractService.saveAdditionalCost(payload).subscribe();
  }

}