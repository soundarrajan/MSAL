import { DecimalPipe, KeyValue } from '@angular/common';
import { Component, OnInit, Input, ChangeDetectorRef,Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR, Inject } from '@angular/core';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { InvoiceDetailsService } from 'libs/feature/invoice/src/lib/services/invoice-details.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'shiptech-additional-cost-modal',
  templateUrl: './additional-cost-modal.component.html',
  styleUrls: ['./additional-cost-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})

export class AdditionalCostModalComponent implements OnInit {
  switchTheme: any;
  additionalCost : any;
  productDetails : any;
  @Output() changedAdditonalcost = new EventEmitter();
  formValues: any;
  generalTenantSettings: any;
  adminConfiguration: any;
  quantityPrecision: any;
  quantityFormat: string;
  uomList: any;
  currencyList: any;
  additionalCostsComponentTypes: any;
  costTypeList: any;
  EnableBargeCostDetails: boolean;
  amountFormat: string;
  applyForList: any;
  type: any;
  old_cost: any;
  old_product: any;
  old_costType: any;
  dtMasterSource: any = {};
  cost: any;
  product: any;
  eventsSubscription: any;
  @Input('formValues') set _formValues(val){
    this.formValues = val;
    this.getApplyForList();
    this.getAdditionalCostsComponentTypes();

  }

  @Input('uomList') set _setUomList(uomList) { 
    if (!uomList) {
      return;
    } 
    this.uomList = uomList;
  }

  @Input('currencyList') set _setCurrencyList(currencyList) { 
    if (!currencyList) {
      return;
    } 
    this.currencyList = currencyList;
  }

  
  @Input('costTypeList') set _setCostTypeList(costTypeList) { 
    if (!costTypeList) {
      return;
    } 
    this.costTypeList = costTypeList;
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
  @Input() events: Observable<void>;

  constructor(private legacyLookupsDatabase: LegacyLookupsDatabase,
    private changeDetectorRef: ChangeDetectorRef,
    private tenantService: TenantFormattingService,
    private tenantSettingsService: TenantSettingsService,
    private invoiceService: InvoiceDetailsService,
    private toastr: ToastrService,
    @Inject(DecimalPipe) private _decimalPipe) { 
    this.generalTenantSettings = tenantSettingsService.getGeneralTenantSettings();
    this.quantityPrecision = this.generalTenantSettings.defaultValues.quantityPrecision;
    this.adminConfiguration = tenantSettingsService.getModuleTenantSettings<
          IGeneralTenantSettings
        >(TenantSettingsModuleName.General);
    this.quantityFormat = '1.' + this.tenantService.quantityPrecision + '-' + this.tenantService.quantityPrecision;
    this.amountFormat = '1.' + this.tenantService.amountPrecision + '-' + this.tenantService.amountPrecision;

    
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

    this.eventsSubscription = this.events.subscribe((data) => this.setInvoiceForm(data));

  }

  setInvoiceForm(data) {
    this.formValues = data;
    this.changeDetectorRef.detectChanges();
  }

  getAdditionalCostsComponentTypes() {
    //this.spinner.show();
    this.invoiceService
    .getAdditionalCostsComponentTypes({})
    .pipe(
      finalize(() => {
        //this.spinner.hide();
      })
    )
    .subscribe((response: any) => {
      if (typeof response == 'string') {
        this.toastr.error(response);
      } else {
        this.formValues.costDetailssComponentTypes = response;
        this.changeDetectorRef.detectChanges();
      }
    });
    this.productDetails = [{id:'All',name:"All"}];
    this.formValues.productDetails.forEach(element => {
      if(element.product){
        // element.product.forEach(product => {
          this.productDetails.push({id:element.product.id+'',name:element.product.name})
        // });
      }
    });
  }

  getApplyForList() {
    this.invoiceService
    .getApplyForList(this.formValues?.orderDetails?.order.id)
    .pipe(
      finalize(() => {
        //this.spinner.hide();
      })
    )
    .subscribe((response: any) => {
      if (typeof response == 'string') {
        this.toastr.error(response);
      } else {
        console.log(response);
        this.applyForList = response;
        this.changeDetectorRef.detectChanges();

      }
    });
  }

  costNameChange(){
   // this.changedAdditonalCostEmit();
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
    this.formValues.costDetails[index].amountInOrderCurrency =  this.formValues.costDetails[index].costType.id == 2 ? sumvalue * this.formValues.costDetails[index].invoiceQuantity : sumvalue;     
    this.formValues.costDetails[index].invoiceExtrasAmount = this.formValues.costDetails[index].costType.id == 2 ? this.formValues.costDetails[index].amountInOrderCurrency * this.formValues.costDetails[index].invoiceExtras/100 : this.formValues.costDetails[index].amountInOrderCurrency * this.formValues.costDetails[index].invoiceExtras/100;
    this.formValues.costDetails[index].invoiceTotalAmount = this.formValues.costDetails[index].amountInOrderCurrency + this.formValues.costDetails[index].invoiceExtrasAmount;
    this.changedAdditonalCostEmit();
  }
  extraAmount(event,index){    
    let sumValue = +event;
    this.formValues.costDetails[index].invoiceExtrasAmount = this.formValues.costDetails[index].costType.id == 2 ? this.formValues.costDetails[index].amountInOrderCurrency * this.formValues.costDetails[index].invoiceExtras/100 : this.formValues.costDetails[index].amountInOrderCurrency * this.formValues.costDetails[index].invoiceExtras/100;
    this.formValues.costDetails[index].invoiceTotalAmount = this.formValues.costDetails[index].amountInOrderCurrency + this.formValues.costDetails[index].invoiceExtrasAmount;
    // alert(index);
    this.changedAdditonalCostEmit();
  }

  changedAdditonalCostEmit(){
    this.changedAdditonalcost.emit(this.formValues.costDetails);
  }

  originalOrder = (a: KeyValue<number, any>, b: KeyValue<number, any>): number => {
    return 0;
  }

  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  compareProductObjects(object1: any, object2: any) {
    return object1 && object2 && object1.productId == object2.productId;
  }

  setDefaultCostType(additionalCost) {
    let defaultCostType;
    this.formValues.costDetailssComponentTypes.forEach((v, k) => {
        if (v.id == additionalCost.id) {
            defaultCostType = v.costType;
        }
    });
    return defaultCostType;
  }

  doFiltering(addCostCompTypes, cost, currentCost) {
    var costType = null;
    addCostCompTypes.forEach((v, k) => {
      if (v.id == currentCost) {
        costType = v.costType.id;
      }
    });
    var availableCosts = [];
    if (costType == 1 || costType == 2) {
      this.costTypeList.forEach((v, k) => {
        if (v.id == 1 || v.id == 2) {
          availableCosts.push(v);
        }
      });
    }
    if (costType == 3) {
      this.costTypeList.forEach((v, k) => {
        if (v.id == 3) {
          availableCosts.push(v);
        }
      });
    }
    this.EnableBargeCostDetails = false;
    if (costType == 4) {
      this.costTypeList.forEach((v, k) => {
        if (v.id == 4) {
          this.EnableBargeCostDetails = true;
          availableCosts.push(v);
        }
      });
    }
    if (costType == 5) {
      this.costTypeList.forEach((v, k) => {
        if (v.id == 5) {
          this.EnableBargeCostDetails = true;
          availableCosts.push(v);
        }
      });
    }

    return availableCosts;
  }


  filterCostTypesByAdditionalCost(cost, rowRenderIndex) {
       
    var currentCost = cost;
    // return doFiltering(vm.additionalCostsComponentTypes, currentCost);
    if(this.formValues.costDetailssComponentTypes === undefined) {
        // this.getAdditionalCostsComponentTypes((additionalCostsComponentTypes) => {
        //     return doFiltering(additionalCostsComponentTypes);
        // });
    }else{
        return this.doFiltering(this.formValues.costDetailssComponentTypes, 0, currentCost);
    }
  }


  addNewAdditionalCostLine(){
    if (!this.formValues.costDetails) {
      this.formValues.costDetails = [];
    }
    let newLine = {
      costName: null,
      invoiceQuantity: null,
      invoiceQuantityUom: this.generalTenantSettings.tenantFormats.uom,
      invoiceRate: null,
      invoiceRateCurrency: this.formValues.invoiceRateCurrency,
      product: {
          id: -1,
          name: 'All',
          deliveryProductId: null
      }
    }
    this.formValues.costDetails.push(newLine);
    this.changeDetectorRef.detectChanges();
    console.log()
  }

  removeAdditionalCostLine(key) {
    if (this.formValues.costDetails[key].id) {
      this.formValues.costDetails[key].isDeleted = true;
    } else {
      this.formValues.costDetails.splice(key, 1);
    }
  }


  invoiceConvertUom(type, rowIndex) {
    console.log(type);
    console.log(rowIndex);
    let currentRowIndex = rowIndex;
    this.calculateGrand(this.formValues);
    this.type = type;
    if (this.type == 'cost') {
      this.old_cost = this.formValues.costDetails[currentRowIndex];
      if (this.formValues.costDetails[currentRowIndex].product) {
        if (this.formValues.costDetails[currentRowIndex].product.id == -1) {
          this.old_product = this.formValues.costDetails[currentRowIndex].product.id;
        } else {
          this.old_product = this.formValues.costDetails[currentRowIndex].product.productId;
        }
      }

      this.old_costType = this.formValues.costDetails[currentRowIndex].costType;
      if (this.old_product == -1) {
        this.formValues.costDetails[currentRowIndex].isAllProductsCost = true;
        if (typeof this.dtMasterSource.applyFor == 'undefined') {
            this.invoiceService
            .getApplyForList(this.formValues?.orderDetails?.order.id)
            .pipe(
              finalize(() => {
                //this.spinner.hide();
              })
            )
            .subscribe((response: any) => {
              if (typeof response == 'string') {
                this.toastr.error(response);
              } else {
                console.log(response);
                this.calculate(this.old_cost, response[1].id, this.old_costType, rowIndex);
              }
            });
        } else {
          if (!this.dtMasterSource.applyFor[1]) {
            return;
          }
          this.calculate(this.old_cost, this.dtMasterSource.applyFor[1].id, this.old_costType, rowIndex);
        }
      } else {
        this.calculate(this.old_cost, this.old_product, this.old_costType, rowIndex);
      }

    }
  }


  calculate(cost, product, costType, rowIndex) {
    this.cost = cost;
    this.product = product;
    this.costType = costType;
    // calculate extra
    if (!this.formValues.costDetails[rowIndex].invoiceExtras) {
      this.formValues.costDetails[rowIndex].invoiceExtras = 0;
    }
    let rateUom, quantityUom;
    if (this.cost.invoiceRateUom) {
      rateUom = this.cost.invoiceRateUom.id;
    } else {
      rateUom = null;
    }
    if (this.cost.invoiceQuantityUom) {
      quantityUom = this.cost.invoiceQuantityUom.id;
    } else {
      quantityUom = null;
    }
    if (this.costType.name == 'Percent' || this.costType.name == 'Flat') {
      rateUom = quantityUom;
    }


    if (this.costType.name == 'Flat') {
      this.formValues.costDetails[rowIndex].invoiceAmount = this.cost.invoiceRate;
      this.formValues.costDetails[rowIndex].invoiceExtrasAmount = this.formValues.costDetails[rowIndex].invoiceExtras / 100 * this.formValues.costDetails[rowIndex].invoiceAmount;
      this.formValues.costDetails[rowIndex].invoiceTotalAmount = parseFloat(this.formValues.costDetails[rowIndex].invoiceExtrasAmount) + parseFloat(this.formValues.costDetails[rowIndex].invoiceAmount);
      this.calculateGrand(this.formValues);
      return;
    }
    this.getUomConversionFactor(this.product, 1, quantityUom, rateUom, null, 1, rowIndex);
  }

  getUomConversionFactor(ProductId, Quantity, FromUomId, ToUomId, contractProductId, orderProductId, rowIndex) {
    let productId = ProductId;
    let quantity = Quantity;
    let fromUomId = FromUomId;
    let toUomId = ToUomId;
    let data = {
      Payload: {
        ProductId: productId,
        OrderProductId: orderProductId,
        Quantity: quantity,
        FromUomId: fromUomId,
        ToUomId: toUomId,
        ContractProductId: contractProductId ? contractProductId : null

      }
    };
    if (!productId || !toUomId || !fromUomId) {
      return;
    }
    if (toUomId == fromUomId) {
      return;
    }
    this.invoiceService
    .getUomConversionFactor(data)
    .pipe(
        finalize(() => {

        })
    )
    .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.toastr.error(result);
        } else {
          console.log(result);
          if (this.costType) {
            if (this.costType.name == 'Unit') {
              this.formValues.costDetails[rowIndex].invoiceAmount = result * this.cost.invoiceRate * this.cost.invoiceQuantity;
            }

            this.formValues.costDetails[rowIndex].invoiceExtrasAmount = this.formValues.costDetails[rowIndex].invoiceExtras / 100 * this.formValues.costDetails[rowIndex].invoiceAmount;
            this.formValues.costDetails[rowIndex].invoiceTotalAmount = parseFloat(this.formValues.costDetails[rowIndex].invoiceExtrasAmount) + parseFloat(this.formValues.costDetails[rowIndex].invoiceAmount);
            this.formValues.costDetails[rowIndex].difference = parseFloat(this.formValues.costDetails[rowIndex].invoiceTotalAmount) - parseFloat(this.formValues.costDetails[rowIndex].estimatedTotalAmount);

            this.formValues.costDetails[rowIndex].deliveryProductId = this.formValues.costDetails[rowIndex].product.deliveryProductId ? this.formValues.costDetails[rowIndex].product.deliveryProductId : this.formValues.costDetails[rowIndex].deliveryProductId;
            console.log('-----------------------', this.formValues.costDetails[rowIndex].deliveryProductId);
            // calculate grandTotal
            if (this.cost) {
              this.calculateCostRecon(rowIndex);
            }
            this.calculateGrand(this.formValues);

        }


        }
    });
  };

  calculateCostRecon(rowIndex) {
    if (!this.cost.estimatedRate || !this.cost.invoiceAmount) {
      return;
    }
    this.invoiceService
    .calculateCostRecon(this.cost)
    .pipe(
        finalize(() => {

        })
    )
    .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.toastr.error(result);
        } else {
          var obj;
          if (result.data == 1) {
            obj = {
              id: 1,
              name: 'Matched'
            };
          } else {
            obj = {
              id: 2,
              name: 'Unmatched'
            };
          }
          this.formValues.costDetails[rowIndex].reconStatus = obj;
          this.changeDetectorRef.detectChanges();
        }
    });


  }


  calculateGrand(formValues) {
    if (!formValues.invoiceSummary) {
        formValues.invoiceSummary = {};
    }
    // formValues.invoiceSummary.provisionalInvoiceAmount = $scope.calculateprovisionalInvoiceAmount(formValues)
    formValues.invoiceSummary.invoiceAmountGrandTotal = this.calculateInvoiceGrandTotal(formValues) - formValues.invoiceSummary.provisionalInvoiceAmount;
    formValues.invoiceSummary.estimatedAmountGrandTotal = this.calculateInvoiceEstimatedGrandTotal(formValues);
    formValues.invoiceSummary.totalDifference = formValues.invoiceSummary.invoiceAmountGrandTotal - formValues.invoiceSummary.estimatedAmountGrandTotal;
    formValues.invoiceSummary.netPayable = formValues.invoiceSummary.invoiceAmountGrandTotal - formValues.invoiceSummary.deductions;
  }

  calculateInvoiceGrandTotal(formValues) {
    let grandTotal = 0;
    formValues.productDetails.forEach((v, k) => {
      if (!v.isDeleted && typeof v.invoiceAmount != 'undefined') {
        grandTotal = grandTotal + v.invoiceAmount;
      }
    });

    formValues.costDetails.forEach((v, k) => {
      if (!v.isDeleted) {
        if (typeof v.invoiceTotalAmount != 'undefined') {
          grandTotal = grandTotal + v.invoiceTotalAmount;
        }
      }
    });
    return grandTotal;
  };


  calculateInvoiceEstimatedGrandTotal(formValues) {
    let grandTotal = 0;
    formValues.productDetails.forEach((v, k) => {
      if (!v.isDeleted && typeof v.estimatedAmount != 'undefined') {
        grandTotal = grandTotal + v.estimatedAmount;
      }
    });

    formValues.costDetails.forEach((v, k) => {
      if (!v.isDeleted) {
        if (typeof v.estimatedAmount != 'undefined') {
          grandTotal = grandTotal + v.estimatedAmount;
        }
      }
    });
    return grandTotal;
  };

  quantityFormatValue(value) {
    if (typeof value == 'undefined') {
      return null;
    }
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    let number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if(this.tenantService.quantityPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.quantityFormat);
      }
    }
  }

  amountFormatValue(value) {
    if (typeof value == 'undefined' || !value) {
      return null;
    }
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    let number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if(this.tenantService.amountPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.amountFormat);
      }
    }
  }



}
