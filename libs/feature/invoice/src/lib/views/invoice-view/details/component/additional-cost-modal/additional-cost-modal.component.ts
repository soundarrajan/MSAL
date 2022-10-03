import { DecimalPipe, KeyValue } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR,
  Inject
} from '@angular/core';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { InvoiceDetailsService } from 'libs/feature/invoice/src/lib/services/invoice-details.service';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'shiptech-additional-cost-modal',
  templateUrl: './additional-cost-modal.component.html',
  styleUrls: ['./additional-cost-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AdditionalCostModalComponent implements OnInit {
  switchTheme: any;
  additionalCost: any;
  productDetails: any;
  @Output() changedAdditonalcost = new EventEmitter();
  displayedColumns: string[] = ['name'];
  displayedColumnsProd: string[] = ['name', 'delNo']
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
  expandAddTransactionListPopUp: any;
  selectedProductLine: any;
  additionalCostProduct: any;
  additionalProdSearch: any;
  selectedProduct: any;
  costType: any;
  costDetailsComponentTypes: any;
  filterCostNames: any[];
  additionalCostForLocation: any = [];
  additionalCostForLocationFilter: any = [];
  priceFormat: string;
  @Input('formValues') set _formValues(val) {
    this.formValues = val;
    this.getApplyForList();
    this.getAdditionalCostsComponentTypes();
    this.formatAdditionalCosts();
    this.getAdditionalCostsPerPort(this.formValues.orderDetails?.portId);
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

  costNames: any;
  uomNames: any;
  currencyNames: any;
  additionalSearch: any;
  public searchText: string;
  selectedRow;
  selectedAdditionalLine: any;
  @Output() amountChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() additionalCostRemoved: EventEmitter<any> = new EventEmitter<any>();

  newCostItem = {
    amountInInvoiceCurrency: 0,
    amountInOrderCurrency: 0,
    associatedOrderProduct: '',
    clientIpAddress: null,
    costName: {
      id: 0,
      name: '',
      internalName: null,
      displayName: null,
      code: null,
      collectionName: null
    },
    costType: {
      id: 0,
      name: '',
      internalName: null,
      displayName: null,
      code: null,
      collectionName: null
    },
    deliveryProductId: 0,
    deliveryQuantity: 0,
    deliveryQuantityUom: {
      id: 0,
      name: '',
      internalName: null,
      displayName: null,
      code: null,
      collectionName: null
    },
    description: null,
    difference: 0,
    estimatedAmount: 0,
    estimatedExtras: 0,
    estimatedExtrasAmount: 0,
    estimatedRate: 0,
    estimatedRateCurrency: {
      id: 0,
      name: 'US dollar',
      internalName: null,
      displayName: null,
      code: null,
      collectionName: null
    },
    estimatedRateUom: null,
    estimatedTotalAmount: 0,
    id: 0,
    invoiceAmount: 0,
    invoiceExtras: 0,
    invoiceExtrasAmount: 0,
    invoiceQuantity: 0,
    invoiceQuantityUom: {
      id: 0,
      name: '',
      internalName: null,
      displayName: null,
      code: null,
      collectionName: null
    },
    invoiceRate: 0,
    invoiceRateCurrency: {
      id: 0,
      name: '',
      internalName: null,
      displayName: null,
      code: '',
      collectionName: null
    },
    invoiceRateUom: {
      id: 0,
      name: '',
      internalName: null,
      displayName: null,
      code: null,
      collectionName: null
    },
    invoiceTotalAmount: 0,
    isAllProductsCost: false,
    isDeleted: false,
    isOrderCost: true,
    modulePathUrl: null,
    orderAdditionalCostId: null,
    product: {
      id: 0,
      name: '',
      internalName: null,
      displayName: '',
      code: null
    },
    reconStatus: {
      transactionTypeId: null,
      id: 0,
      name: '',
      internalName: null,
      displayName: null,
      code: null
    },
    userAction: null
  };
  @Input() events: Observable<void>;

  constructor(
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private changeDetectorRef: ChangeDetectorRef,
    private tenantService: TenantFormattingService,
    private tenantSettingsService: TenantSettingsService,
    private invoiceService: InvoiceDetailsService,
    private toastr: ToastrService,
    @Inject(DecimalPipe) private _decimalPipe
  ) {
    this.generalTenantSettings = tenantSettingsService.getGeneralTenantSettings();
    this.quantityPrecision = this.generalTenantSettings.defaultValues.quantityPrecision;
    this.adminConfiguration = tenantSettingsService.getModuleTenantSettings<
      IGeneralTenantSettings
    >(TenantSettingsModuleName.General);
    this.quantityFormat =
      '1.' +
      this.tenantService.quantityPrecision +
      '-' +
      this.tenantService.quantityPrecision;
    this.amountFormat =
      '1.' +
      this.tenantService.amountPrecision +
      '-' +
      this.tenantService.amountPrecision;
    this.priceFormat =
      '1.' +
      this.tenantService.pricePrecision +
      '-' +
      this.tenantService.pricePrecision;
  }

  ngOnInit(): void {
    this.legacyLookupsDatabase.getAdditionalCost().then(list => {
      this.costNames = list;
      this.filterCostNames = _.cloneDeep(list);
      this.changeDetectorRef.detectChanges();
    });
    this.legacyLookupsDatabase.getUomTable().then(list => {
      this.uomNames = list;
      this.changeDetectorRef.detectChanges();
    });
    this.legacyLookupsDatabase.getCurrencyTable().then(list => {
      this.currencyNames = list;
      this.changeDetectorRef.detectChanges();
    });

    this.eventsSubscription = this.events.subscribe(data =>
      this.setInvoiceForm(data)
    );
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
          this.costDetailsComponentTypes = response;
          this.changeDetectorRef.detectChanges();
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
          this.applyForList = response;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  costNameChange() {
    // this.changedAdditonalCostEmit();
  }

  radioSelected(element) {
    this.selectedRow = element;
  }

  getFilterPredicate() {}

  applyFilter() {}

  invoiceRateChange(event, index) {
    const sumvalue = +event;
    this.formValues.costDetails[index].amountInOrderCurrency =
      this.formValues.costDetails[index].costType.id == 2
        ? sumvalue * this.formValues.costDetails[index].invoiceQuantity
        : sumvalue;
    this.formValues.costDetails[index].invoiceExtrasAmount =
      this.formValues.costDetails[index].costType.id == 2
        ? (this.formValues.costDetails[index].amountInOrderCurrency *
            this.formValues.costDetails[index].invoiceExtras) /
          100
        : (this.formValues.costDetails[index].amountInOrderCurrency *
            this.formValues.costDetails[index].invoiceExtras) /
          100;
    this.formValues.costDetails[index].invoiceTotalAmount =
      this.formValues.costDetails[index].amountInOrderCurrency +
      this.formValues.costDetails[index].invoiceExtrasAmount;
    this.changedAdditonalCostEmit();
  }
  extraAmount(event, index) {
    const sumValue = +event;
    this.formValues.costDetails[index].invoiceExtrasAmount =
      this.formValues.costDetails[index].costType.id == 2
        ? (this.formValues.costDetails[index].amountInOrderCurrency *
            this.formValues.costDetails[index].invoiceExtras) /
          100
        : (this.formValues.costDetails[index].amountInOrderCurrency *
            this.formValues.costDetails[index].invoiceExtras) /
          100;
    this.formValues.costDetails[index].invoiceTotalAmount =
      this.formValues.costDetails[index].amountInOrderCurrency +
      this.formValues.costDetails[index].invoiceExtrasAmount;
    // alert(index);
    this.changedAdditonalCostEmit();
  }

  changedAdditonalCostEmit() {
    this.changedAdditonalcost.emit(this.formValues.costDetails);
  }

  originalOrder = (
    a: KeyValue<number, any>,
    b: KeyValue<number, any>
  ): number => 0;

  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  compareCostTypeObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  compareProductObjects(object1: any, object2: any) {
    return object1 && object2 && object1.productId == object2.productId;
  }

  setDefaultCostType(additionalCost) {
    let defaultCostType;
    this.costDetailsComponentTypes.forEach((v, k) => {
      if (v.id == additionalCost.id) {
        defaultCostType = v.costType;
      }
    });
    return defaultCostType;
  }

  doFiltering(addCostCompTypes, cost, currentCost) {
    let costType = null;
    addCostCompTypes.forEach((v, k) => {
      if (v.id == currentCost) {
        costType = v.costType.id;
      }
    });
    const availableCosts = [];
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

  filterCostTypesByAdditionalCost(cost) {
    const currentCost = cost;
    // return doFiltering(vm.additionalCostsComponentTypes, currentCost);
    if (this.costDetailsComponentTypes === undefined) {
      // this.getAdditionalCostsComponentTypes((additionalCostsComponentTypes) => {
      //     return doFiltering(additionalCostsComponentTypes);
      // });
    } else {
      return this.doFiltering(this.costDetailsComponentTypes, 0, currentCost);
    }
  }

  getRangeTotalAmount(additionalCost, rowIndex) {
    additionalCost.deliveryId = additionalCost.product.deliveryNumber;
    additionalCost.invoiceQuantity = this.quantityFormatValue(additionalCost.product.finalQuantityAmount);
    additionalCost.invoiceQuantityUom = this.uomList.find(item => item.id === additionalCost.product.finalQuantityAmountUomId);
    if (!additionalCost.locationAdditionalCostId) {
      return;
    }

    if (
      !(
        additionalCost.costType.name == 'Range' ||
        additionalCost.costType.name == 'Total'
      )
    ) {
      return;
    }

    if (!additionalCost.invoiceQuantity) {
      return;
    }

    const payload = {
      Payload: {
        Order: null,
        Filters: [
          {
            ColumnName: 'ProductId',
            Value: additionalCost.product
              ? additionalCost.product.productId
              : null
          },
          {
            ColumnName: 'LocationId',
            Value: this.formValues.orderDetails.portId
              ? this.formValues.orderDetails.portId
              : null
          },
          {
            ColumnName: 'AdditionalCostId',
            Value: additionalCost.locationAdditionalCostId
              ? additionalCost.locationAdditionalCostId
              : null
          },
          {
            ColumnName: 'Qty',
            Value: additionalCost.invoiceQuantity
          },
          {
            ColumnName: 'QtyUomId',
            Value: additionalCost.invoiceQuantityUom
              ? additionalCost.invoiceQuantityUom.id
              : null
          }
        ],
        Pagination: {
          Skip: 0,
          Take: 25
        },
        SearchText: null
      }
    };

    this.invoiceService
      .getRangeTotalAdditionalCosts(payload)
      .pipe(
        finalize(() => {
          //this.spinner.hide();
        })
      )
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          additionalCost.invoiceRate = this.quantityFormatValue(response.price);
          this.invoiceConvertUom('cost', rowIndex);
        }
      });
  }

  addCostDetail(additionalCost) {
    if (!this.formValues.costDetails) {
      this.formValues.costDetails = [];
    }
    let isTaxComponent = false;
    this.costDetailsComponentTypes.forEach((v, k) => {
      if (v.id == additionalCost.additionalCostid) {
        if (v.componentType) {
          if (v.componentType.id == 1) {
            isTaxComponent = true;
          }
        }
      }
    });

    let productLine;
    if (
      additionalCost.costType.name == 'Range' ||
      additionalCost.costType.name == 'Total'
    ) {
      productLine = {
        id: this.applyForList[1].productId,
        productId: this.applyForList[1].productId,
        name: this.applyForList[1].name,
        deliveryProductId: this.applyForList[1].deliveryProductId
      };
    }
    const newLine = {
      costName: {
        id: additionalCost.additionalCostid,
        name: additionalCost.name,
        code: additionalCost.code,
        collectionName: null
      },
      costType: additionalCost.costType,
      invoiceAmount: additionalCost.amount
        ? this.amountFormatValue(additionalCost.amount)
        : '',
      invoiceExtras: null,
      invoiceQuantity: null,
      invoiceQuantityUom: additionalCost.priceUom
        ? additionalCost.priceUom
        : this.generalTenantSettings.tenantFormats.uom,
      invoiceRate: null,
      invoiceRateUom: additionalCost.priceUom
        ? additionalCost.priceUom
        : this.generalTenantSettings.tenantFormats.uom,
      invoiceRateCurrency: additionalCost.currency
        ? additionalCost.currency
        : this.formValues.invoiceRateCurrency,
      product: productLine,
      isTaxComponent: isTaxComponent,
      locationAdditionalCostId: additionalCost.locationid,
      description: additionalCost.costDescription
        ? additionalCost.costDescription
        : null
    };
    this.formValues.costDetails.push(newLine);
    this.invoiceConvertUom('cost', this.formValues.costDetails.length - 1);
    this.changeDetectorRef.detectChanges();
  }

  removeAdditionalCostLine(key) {
    if (this.formValues.status) {
      if (this.formValues.status.name == 'Approved') {
        if (this.formValues.costDetails[key].id) {
          this.toastr.info(
            'You cannot delete product if invoice status is Approved'
          );
          return;
        }
      }
    }
    if (this.formValues.costDetails[key].id) {
      this.formValues.costDetails[key].isDeleted = true;
      this.additionalCostRemoved.emit(true);
    } else {
      this.formValues.costDetails.splice(key, 1);
    }
  }

  invoiceConvertUom(type, rowIndex) {
    const currentRowIndex = rowIndex;
    this.calculateGrand(this.formValues);
    this.type = type;
    if (this.type == 'cost') {
      this.old_cost = this.formValues.costDetails[currentRowIndex];
      if (this.formValues.costDetails[currentRowIndex].product) {
        if (this.formValues.costDetails[currentRowIndex].product.id === -1) {
          this.old_product = this.formValues.costDetails[
            currentRowIndex
          ].product.id;
        } else {
          this.old_product = this.formValues.costDetails[
            currentRowIndex
          ].product.productId;
        }
      }

      this.old_costType = this.formValues.costDetails[currentRowIndex].costType;
      if (this.old_product === -1) {
        this.formValues.costDetails[currentRowIndex].isAllProductsCost = true;
        if (typeof this.applyForList == 'undefined') {
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
                this.calculate(
                  this.old_cost,
                  response[1].productId,
                  this.old_costType,
                  rowIndex
                );
              }
            });
        } else {
          this.calculate(
            this.old_cost,
            this.applyForList[1].productId,
            this.old_costType,
            rowIndex
          );
        }
      } else {
        this.calculate(
          this.old_cost,
          this.old_product,
          this.old_costType,
          rowIndex
        );
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
    if (this.costType) {
      if (this.costType.name == 'Percent' || this.costType.name == 'Flat') {
        rateUom = quantityUom;
      }
    }

    if (this.costType && this.costType.name == 'Flat') {
      this.formValues.costDetails[
        rowIndex
      ].invoiceAmount = this.cost.invoiceRate;
      this.formValues.costDetails[rowIndex].invoiceExtrasAmount =
        (this.convertDecimalSeparatorStringToNumber(
          this.formValues.costDetails[rowIndex].invoiceExtras
        ) /
          100) *
        this.convertDecimalSeparatorStringToNumber(
          this.formValues.costDetails[rowIndex].invoiceAmount
        );
      this.formValues.costDetails[rowIndex].invoiceTotalAmount =
        this.convertDecimalSeparatorStringToNumber(
          this.formValues.costDetails[rowIndex].invoiceExtrasAmount
        ) +
        this.convertDecimalSeparatorStringToNumber(
          this.formValues.costDetails[rowIndex].invoiceAmount
        );
      this.formValues.costDetails[rowIndex].difference =
        parseFloat(this.formValues.costDetails[rowIndex].invoiceTotalAmount) -
        parseFloat(this.formValues.costDetails[rowIndex].estimatedTotalAmount);
      this.calculateGrand(this.formValues);
      return;
    }

    if (
      this.cost.locationAdditionalCostId &&
      this.costType &&
      (this.costType.name == 'Range' || this.costType.name == 'Total')
    ) {
      this.formValues.costDetails[
        rowIndex
      ].invoiceAmount = this.cost.invoiceRate;
      this.formValues.costDetails[rowIndex].invoiceExtrasAmount =
        (this.convertDecimalSeparatorStringToNumber(
          this.formValues.costDetails[rowIndex].invoiceExtras
        ) /
          100) *
        this.convertDecimalSeparatorStringToNumber(
          this.formValues.costDetails[rowIndex].invoiceAmount
        );
      this.formValues.costDetails[rowIndex].invoiceTotalAmount =
        this.convertDecimalSeparatorStringToNumber(
          this.formValues.costDetails[rowIndex].invoiceExtrasAmount
        ) +
        this.convertDecimalSeparatorStringToNumber(
          this.formValues.costDetails[rowIndex].invoiceAmount
        );
      this.formValues.costDetails[rowIndex].difference =
        parseFloat(this.formValues.costDetails[rowIndex].invoiceTotalAmount) -
        parseFloat(this.formValues.costDetails[rowIndex].estimatedTotalAmount);
      this.calculateGrand(this.formValues);
      return;
    }
    this.getUomConversionFactor(
      this.product,
      1,
      quantityUom,
      rateUom,
      null,
      1,
      rowIndex
    );
  }

  getUomConversionFactor(
    ProductId,
    Quantity,
    FromUomId,
    ToUomId,
    contractProductId,
    orderProductId,
    rowIndex
  ) {
    const productId = ProductId;
    const quantity = Quantity;
    const fromUomId = FromUomId;
    const toUomId = ToUomId;
    const data = {
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
      const result = 1;
      if (this.costType) {
        if (this.costType.name == 'Unit') {
          this.formValues.costDetails[rowIndex].invoiceAmount =
            result *
            this.convertDecimalSeparatorStringToNumber(this.cost.invoiceRate) *
            this.convertDecimalSeparatorStringToNumber(
              this.cost.invoiceQuantity
            );
        }

        this.formValues.costDetails[rowIndex].invoiceExtrasAmount =
          (this.convertDecimalSeparatorStringToNumber(
            this.formValues.costDetails[rowIndex].invoiceExtras
          ) /
            100) *
          this.convertDecimalSeparatorStringToNumber(
            this.formValues.costDetails[rowIndex].invoiceAmount
          );
        this.formValues.costDetails[rowIndex].invoiceTotalAmount =
          this.convertDecimalSeparatorStringToNumber(
            this.formValues.costDetails[rowIndex].invoiceExtrasAmount
          ) +
          this.convertDecimalSeparatorStringToNumber(
            this.formValues.costDetails[rowIndex].invoiceAmount
          );
        this.formValues.costDetails[rowIndex].difference =
          this.convertDecimalSeparatorStringToNumber(
            this.formValues.costDetails[rowIndex].invoiceTotalAmount
          ) -
          this.convertDecimalSeparatorStringToNumber(
            this.formValues.costDetails[rowIndex].estimatedTotalAmount
          );

        this.formValues.costDetails[rowIndex].deliveryProductId = this
          .formValues.costDetails[rowIndex].product.deliveryProductId
          ? this.formValues.costDetails[rowIndex].product.deliveryProductId
          : this.formValues.costDetails[rowIndex].deliveryProductId;
        // calculate grandTotal
        if (this.cost) {
          this.calculateCostRecon(rowIndex);
        }
        this.calculateGrand(this.formValues);
        this.changeDetectorRef.detectChanges();
      }
    }
    this.invoiceService
      .getUomConversionFactor(data)
      .pipe(finalize(() => {}))
      .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.toastr.error(result);
        } else {
          if (this.costType) {
            if (this.costType.name == 'Unit') {
              this.formValues.costDetails[rowIndex].invoiceAmount =
                result *
                this.convertDecimalSeparatorStringToNumber(
                  this.cost.invoiceRate
                ) *
                this.convertDecimalSeparatorStringToNumber(
                  this.cost.invoiceQuantity
                );
            }

            this.formValues.costDetails[rowIndex].invoiceExtrasAmount =
              (this.convertDecimalSeparatorStringToNumber(
                this.formValues.costDetails[rowIndex].invoiceExtras
              ) /
                100) *
              this.convertDecimalSeparatorStringToNumber(
                this.formValues.costDetails[rowIndex].invoiceAmount
              );
            this.formValues.costDetails[rowIndex].invoiceTotalAmount =
              this.convertDecimalSeparatorStringToNumber(
                this.formValues.costDetails[rowIndex].invoiceExtrasAmount
              ) +
              this.convertDecimalSeparatorStringToNumber(
                this.formValues.costDetails[rowIndex].invoiceAmount
              );
            this.formValues.costDetails[rowIndex].difference =
              this.convertDecimalSeparatorStringToNumber(
                this.formValues.costDetails[rowIndex].invoiceTotalAmount
              ) -
              this.convertDecimalSeparatorStringToNumber(
                this.formValues.costDetails[rowIndex].estimatedTotalAmount
              );

            this.formValues.costDetails[rowIndex].deliveryProductId = this
              .formValues.costDetails[rowIndex].product.deliveryProductId
              ? this.formValues.costDetails[rowIndex].product.deliveryProductId
              : this.formValues.costDetails[rowIndex].deliveryProductId;
            // calculate grandTotal
            if (this.cost) {
              this.calculateCostRecon(rowIndex);
            }
            this.calculateGrand(this.formValues);
            this.changeDetectorRef.detectChanges();
          }
        }
      });
  }

  calculateCostRecon(rowIndex) {
    if (!this.cost.estimatedRate || !this.cost.invoiceAmount) {
      return;
    }
    this.invoiceService
      .calculateCostRecon(this.cost)
      .pipe(finalize(() => {}))
      .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.toastr.error(result);
        } else {
          if (result == 1) {
            this.formValues.costDetails[rowIndex].reconStatus = {
              id: 1,
              name: 'Matched'
            };
          } else {
            this.formValues.costDetails[rowIndex].reconStatus = {
              id: 2,
              name: 'Unmatched'
            };
          }
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  calculateGrand(formValues) {
    if (!formValues.invoiceSummary) {
      formValues.invoiceSummary = {};
    }
    // formValues.invoiceSummary.provisionalInvoiceAmount = $scope.calculateprovisionalInvoiceAmount(formValues)
    formValues.invoiceSummary.invoiceAmountGrandTotal = this.calculateInvoiceGrandTotal(
      formValues
    );
    formValues.invoiceSummary.invoiceAmountGrandTotal -=
      formValues.invoiceSummary.provisionalInvoiceAmount;
    formValues.invoiceSummary.estimatedAmountGrandTotal = this.calculateInvoiceEstimatedGrandTotal(
      formValues
    );
    formValues.invoiceSummary.totalDifference =
      this.convertDecimalSeparatorStringToNumber(
        formValues.invoiceSummary.invoiceAmountGrandTotal
      ) -
      this.convertDecimalSeparatorStringToNumber(
        formValues.invoiceSummary.estimatedAmountGrandTotal
      );
    formValues.invoiceSummary.netPayable =
      this.convertDecimalSeparatorStringToNumber(
        formValues.invoiceSummary.invoiceAmountGrandTotal
      ) -
      this.convertDecimalSeparatorStringToNumber(
        formValues.invoiceSummary.deductions
      );
    this.changeDetectorRef.detectChanges();
    this.amountChanged.emit(true);
  }

  calculateInvoiceGrandTotal(formValues) {
    let grandTotal = 0;
    formValues.productDetails.forEach((v, k) => {
      if (!v.isDeleted && typeof v.invoiceAmount != 'undefined') {
        grandTotal =
          grandTotal +
          this.convertDecimalSeparatorStringToNumber(v.invoiceAmount);
      }
    });

    formValues.costDetails.forEach((v, k) => {
      if (!v.isDeleted) {
        if (typeof v.invoiceTotalAmount != 'undefined') {
          grandTotal =
            grandTotal +
            this.convertDecimalSeparatorStringToNumber(v.invoiceTotalAmount);
        }
      }
    });
    return grandTotal;
  }

  calculateInvoiceEstimatedGrandTotal(formValues) {
    let grandTotal = 0;
    formValues.productDetails.forEach((v, k) => {
      if (!v.isDeleted && typeof v.estimatedAmount != 'undefined') {
        grandTotal = grandTotal + v.estimatedAmount;
      }
    });

    formValues.costDetails.forEach((v, k) => {
      if (!v.isDeleted) {
        if (typeof v.estimatedTotalAmount != 'undefined') {
          grandTotal = grandTotal + v.estimatedTotalAmount;
        }
      }
    });
    return grandTotal;
  }

  convertDecimalSeparatorStringToNumber(number) {
    let numberToReturn = number;
    let decimalSeparator, thousandsSeparator;
    if (typeof number == 'string') {
      if (number.indexOf(',') != -1 && number.indexOf('.') != -1) {
        if (number.indexOf(',') > number.indexOf('.')) {
          decimalSeparator = ',';
          thousandsSeparator = '.';
        } else {
          thousandsSeparator = ',';
          decimalSeparator = '.';
        }
        numberToReturn =
          parseFloat(
            number
              .split(decimalSeparator)[0]
              .replace(new RegExp(thousandsSeparator, 'g'), '')
          ) + parseFloat(`0.${number.split(decimalSeparator)[1]}`);
      } else {
        numberToReturn = parseFloat(number);
      }
    }
    if (isNaN(numberToReturn)) {
      numberToReturn = 0;
    }
    return parseFloat(numberToReturn);
  }

  quantityFormatValue(value) {
    if (typeof value == 'undefined' || value == null) {
      return null;
    }
    const plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    const number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if (this.tenantService.quantityPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.quantityFormat);
      }
    }
  }

  priceFormatValue(value) {
    if (typeof value == 'undefined' || value == null) {
      return null;
    }
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    const number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if (this.tenantService.pricePrecision) {
        plainNumber = this.roundDownValue(plainNumber, 'price');
      } else {
        plainNumber = Math.trunc(plainNumber);
      }
      if (this.tenantService.pricePrecision == 0) {
        return plainNumber;
      } else {
        plainNumber = plainNumber.toString().replace(/,/g, '');
        return this._decimalPipe.transform(plainNumber, this.priceFormat);
      }
    }
  }

  roundDownValue(value, type) {
    if (type == 'quantity') {
      let quantityPrecision = this.tenantService.quantityPrecision;
      let viewValue = `${value}`;
      let plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
      let roundedValue = this._decimalPipe.transform(
        plainNumber,
        '1.' + quantityPrecision + '-' + quantityPrecision
      );
      return roundedValue;
    } else if (type == 'price') {
      let pricePrecision = this.tenantService.pricePrecision;
      let viewValue = `${value}`;
      let plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
      let roundedValue = this._decimalPipe.transform(
        plainNumber,
        '1.' + pricePrecision + '-' + pricePrecision
      );

      return roundedValue;
    }
  }
  /**
   * truncate to decimal place.
   */
  truncateToDecimals(num, dec) {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  }

  amountFormatValue(value) {
    if (typeof value == 'undefined' || !value) {
      return null;
    }
    let amountPrecision = this.tenantService.amountPrecision;

    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    const number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    if (plainNumber) {
      if (this.tenantService.amountPrecision == 0) {
        return plainNumber;
      } else {
        return this._decimalPipe.transform(plainNumber, this.amountFormat);
      }
    }
  }

  triggerChangeFieldsAppSpecific(name, key) {
    if (name == 'costType') {
      if (this.formValues.costDetails.length > 0) {
        if (this.formValues.costDetails[key]) {
          if (this.formValues.costDetails[key].costType.name == 'Flat') {
            this.formValues.costDetails[
              key
            ].invoiceQuantity = this.quantityFormatValue(1);
          } else {
            this.formValues.costDetails[key].invoiceQuantity = '';
          }
        }
      }
    }
  }

  formatAdditionalCosts() {
    for (let i = 0; i < this.formValues.costDetails.length; i++) {
      if (this.formValues.costDetails[i].product) {
        if (this.formValues.costDetails[i].product.id != -1) {
          if (
            this.formValues.costDetails[i].product.id !=
            this.formValues.costDetails[i].deliveryProductId
          ) {
            this.formValues.costDetails[
              i
            ].product.productId = this.formValues.costDetails[i].product.id;
            this.formValues.costDetails[
              i
            ].product.id = this.formValues.costDetails[i].deliveryProductId;
          }
        }
      } else {
        this.formValues.costDetails[i].product = {
          id: -1,
          name: 'All',
          deliveryProductId: null
        };
      }
    }

    this.changeDetectorRef.detectChanges();
  }

  searchCostName(value: string, locationId): void {
    if (!this.additionalCostForLocationFilter[locationId]) {
      return;
    }
    const filterCostList = this.additionalCostForLocationFilter[
      locationId
    ].filter(option => option.name.toLowerCase().includes(value.toLowerCase()));
    this.additionalCostForLocation[locationId] = _.cloneDeep(filterCostList);
    this.changeDetectorRef.detectChanges();
  }

  searchProduct(value: string, locationId): void {
  }

  getAdditionalCostsPerPort(locationId) {
    if (!locationId) {
      return;
    }
    if (typeof this.additionalCostForLocation == 'undefined') {
      this.additionalCostForLocation = [];
    }
    if (typeof this.additionalCostForLocationFilter == 'undefined') {
      this.additionalCostForLocationFilter = [];
    }

    const payload = {
      Payload: {
        Order: null,
        PageFilters: { Filters: [] },
        SortList: { SortList: [] },
        Filters: [{ ColumnName: 'LocationId', value: locationId }],
        SearchText: null,
        Pagination: { Skip: 0, Take: 25 }
      }
    };

    this.invoiceService
      .getAdditionalCostsPerPort(payload)
      .pipe(finalize(() => {}))
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          this.additionalCostForLocation[locationId] = _.cloneDeep(response);
          const filterElements = _.filter(
            this.additionalCostForLocation[locationId],
            function(object) {
              return !object.isDeleted;
            }
          );
          const newAdditionalCostList = _.cloneDeep(filterElements);
          this.additionalCostForLocation[locationId] = _.cloneDeep(
            filterElements
          );

          this.additionalCostForLocationFilter[locationId] = _.cloneDeep(
            filterElements
          );
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  // Only Number
  keyPressNumber(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (inp == '.' || inp == ',' || inp == '-') {
      return true;
    }
    if (/^[-,+]*\d{1,6}(,\d{3})*(\.\d*)?$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
