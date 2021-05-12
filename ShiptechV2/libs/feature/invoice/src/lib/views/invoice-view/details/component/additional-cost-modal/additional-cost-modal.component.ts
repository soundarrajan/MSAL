import { Component, OnInit, Input, ChangeDetectorRef,Output, EventEmitter } from '@angular/core';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';

@Component({
  selector: 'shiptech-additional-cost-modal',
  templateUrl: './additional-cost-modal.component.html',
  styleUrls: ['./additional-cost-modal.component.scss']
})

export class AdditionalCostModalComponent implements OnInit {
  additionalCost : any;
  productDetails : any;
  @Output() changedAdditonalcost = new EventEmitter();
  @Input('formValues') set _formValues(val){
    this.additionalCost = val.costDetails;
    this.productDetails = [{id:'All',name:"All"}];
    val.productDetails.forEach(element => {
      if(element.product){
        // element.product.forEach(product => {
          this.productDetails.push({id:element.product.id+'',name:element.product.name})
        // });
      }
    });
  }
  costNames:any;
  uomNames:any;
  currencyNames:any;
  public searchText:string;
  selectedRow;
  public costType:any = [{id:1, name: "Flat"},{id:2, name: "Unit"}];
  newCostItem={
    amountInInvoiceCurrency: 0,
    amountInOrderCurrency: 0,
    associatedOrderProduct: "",
    clientIpAddress: null,
    costName: {id: 0, name: "", internalName: null, displayName: null, code: null, collectionName: null},
    costType: {id: 0, name: "", internalName: null, displayName: null, code: null, collectionName: null},
    deliveryProductId: 0,
    deliveryQuantity: 0,
    deliveryQuantityUom: {id: 0, name: "", internalName: null, displayName: null, code: null, collectionName: null},
    description: null,
    difference: 0,
    estimatedAmount: 0,
    estimatedExtras: 0,
    estimatedExtrasAmount: 0,
    estimatedRate: 0,
    estimatedRateCurrency: {id: 0, name: "US dollar", internalName: null, displayName: null, code: null, collectionName: null},
    estimatedRateUom: null,
    estimatedTotalAmount: 0,
    id: 0,
    invoiceAmount: 0,
    invoiceExtras: 0,
    invoiceExtrasAmount: 0,
    invoiceQuantity: 0,
    invoiceQuantityUom: {id: 0, name: "", internalName: null, displayName: null, code: null, collectionName: null},
    invoiceRate: 0,
    invoiceRateCurrency: {id: 0, name: "", internalName: null, displayName: null, code: "", collectionName: null},
    invoiceRateUom: {id: 0, name: "", internalName: null, displayName: null, code: null, collectionName: null},
    invoiceTotalAmount: 0,
    isAllProductsCost: false,
    isDeleted: false,
    isOrderCost: true,
    modulePathUrl: null,
    orderAdditionalCostId: null,
    product: {id: 0, name: "", internalName: null, displayName: "", code: null},
    reconStatus: {transactionTypeId: null, id: 0, name: "", internalName: null, displayName: null, code: null},
    userAction: null
  }
  constructor(private legacyLookupsDatabase: LegacyLookupsDatabase,private changeDetectorRef: ChangeDetectorRef) { 
    
  }

  ngOnInit(): void {
    this.legacyLookupsDatabase.getAdditionalCost().then(list=>{
      this.costNames = list;
      this.changeDetectorRef.detectChanges();
    })
    this.legacyLookupsDatabase.getUomTable().then(list=>{
      this.uomNames = list;
      this.changeDetectorRef.detectChanges();
    })
    this.legacyLookupsDatabase.getCurrencyTable().then(list=>{
      this.currencyNames = list;
      this.changeDetectorRef.detectChanges();
    })
  }
  addNewAdditionalCostLine(){
    this.additionalCost.push(this.newCostItem);
    this.changedAdditonalCostEmit()
  }
  removeAdditionalCostLine(index){
    this.additionalCost[index].isDeleted = true;
    this.changedAdditonalCostEmit();
  }
  costNameChange(){
    this.changedAdditonalCostEmit();
  }
  radioSelected(element){
    this.selectedRow=element;
    console.log(this.selectedRow.product);
  }

  getFilterPredicate() {
    
  }

  applyFilter() {
  }
  invoiceRateChange(event,index){
    let sumvalue = +event;
    this.additionalCost[index].amountInOrderCurrency =  this.additionalCost[index].costType.id == 2 ? sumvalue * this.additionalCost[index].invoiceQuantity : sumvalue;     
    this.additionalCost[index].invoiceExtrasAmount = this.additionalCost[index].costType.id == 2 ? this.additionalCost[index].amountInOrderCurrency * this.additionalCost[index].invoiceExtras/100 : this.additionalCost[index].amountInOrderCurrency * this.additionalCost[index].invoiceExtras/100;
    this.changedAdditonalCostEmit();
  }
  extraAmount(event,index){    
    let sumValue = +event;
    this.additionalCost[index].invoiceExtrasAmount = this.additionalCost[index].costType.id == 2 ? this.additionalCost[index].amountInOrderCurrency * this.additionalCost[index].invoiceExtras/100 : this.additionalCost[index].amountInOrderCurrency * this.additionalCost[index].invoiceExtras/100;
    // alert(index);
    this.changedAdditonalCostEmit();
  }
  changedAdditonalCostEmit(){
    this.changedAdditonalcost.emit(this.additionalCost);
  }
}
