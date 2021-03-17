import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { Select, Store } from '@ngxs/store';
import { QcReportState } from '../../../store/report/qc-report.state';
import { BehaviorSubject, empty, Observable, Subject } from 'rxjs';
import { QcReportService } from '../../../services/qc-report.service';
import { catchError, filter, finalize, map, scan, skip, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  SwitchActiveBunkerResponseAction,
  SwitchActiveSludgeResponseAction
} from '../../../store/report/details/actions/qc-vessel-response.actions';
import { RaiseClaimComponent } from './components/raise-claim/raise-claim.component';
import { ResetQcReportDetailsStateAction } from '../../../store/report/qc-report-details.actions';
import { ToastrService } from 'ngx-toastr';
import {
  QcVesselResponseBunkerStateModel,
  QcVesselResponseSludgeStateModel
} from '../../../store/report/details/qc-vessel-responses.state';
import {
  IDisplayLookupDto,
  IVesselToWatchLookupDto
} from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';
import { IQcReportDetailsState } from '../../../store/report/details/qc-report-details.model';
import { roundDecimals } from '@shiptech/core/utils/math';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { IQcVesselPortCallDto } from '../../../services/api/dto/qc-vessel-port-call.interface';
import { IVesselPortCallMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/vessel-port-call';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { KnownDeliverylRoutes } from '../../../known-delivery.routes';
import { fromLegacyLookupVesselToWatch } from '@shiptech/core/lookups/utils';
import { ReconStatusLookup } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import { IReconStatusLookupDto } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.interface';
import { StatusLookupEnum } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { StatusLookup } from '@shiptech/core/lookups/known-lookups/status/status-lookup.service';
import { knownMastersAutocomplete } from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { VesselToWatchModel } from '../../../store/report/models/vessel-to-watch.model';
import { MyMonitoringService } from '../../service/logging.service';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { BdnInformationApiService } from '@shiptech/core/delivery-api/bdn-information/bdn-information-api.service';
import { IDeliveryTenantSettings } from '../../../core/settings/delivery-tenant-settings';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import _ from 'lodash';
import { ToleranceLimits } from '../../../services/api/dto/delivery-details.dto';
import { DeliveryService } from '../../../services/delivery.service';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { RaiseClaimModalComponent } from './components/raise-claim-modal/raise-claim-modal.component';
import { SplitDeliveryModalComponent } from './components/split-delivery-modal/split-delivery-modal.component';
import { NavBarApiService } from '@shiptech/core/services/navbar/navbar-api.service';

interface DialogData {
  email: string;
}


@Component({
  selector: 'shiptech-port-call',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss'],
  providers: [ConfirmationService, DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryDetailsComponent implements OnInit, OnDestroy {


  @Select(QcReportState.isReadOnly) isReadOnly$: Observable<boolean>;
  @Select(QcReportState.isBusy) isBusy$: Observable<boolean>;
  @Select(QcReportState.isNew) isNew$: Observable<boolean>;

  hasVerifiedStatus$ = new BehaviorSubject<boolean>(false);
  private _destroy$ = new Subject();

  private quantityPrecision: number;

  entityId: string;
  entityName: string;
  isLoading: boolean;
  orderNumberOptions: any;
  eventsSubject: Subject<any> = new Subject<any>();
  eventsSubject2: Subject<any> = new Subject<any>();
  anyChanges: boolean;
  deliverySettings: IDeliveryTenantSettings;
  finalQuantityRules: any[];
  deliveryForm: any;
  formValues: any;
  toleranceLimits: any;
  adminConfiguration: any;
  relatedDeliveries: any = [];
  uoms: any;
  deliveryFeedback: any;
  satisfactionLevel: any;
  bargeList: any;
  navBar: any;
  email: string;
  selectedProductIndex: any = 0;
  raiseClaimInfo: any;
  CM: any = {
    'listsCache': {
      'ClaimType': []
    }
  };
  claimType: any;
  scheduleDashboardConfiguration: any;
  statusBackgorund: any;
  scheduleDashboardLabelConfiguration: any;
  statusBackground: any;
  statusBackgroundCode: any;
  statusColorCode: any;
  quantityCategory: any;
  saveButtonClicked: boolean;
  buttonClicked: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private entityStatus: EntityStatusService,
    private store: Store,
    private router: Router,
    private location: Location,
    private reportService: QcReportService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private toastrService: ToastrService,
    private reconStatusLookups: ReconStatusLookup,
    private tenantSettingsService: TenantSettingsService,
    private statusLookup: StatusLookup,
    private myMonitoringService: MyMonitoringService,
    public bdnInformationService: BdnInformationApiService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private deliveryService: DeliveryService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private navBarService: NavBarApiService
    ) {
    this.formValues = {
      'sellerName': '',
      'port': '',
      'OrderBuyer': '',
      'surveyorName': '',
      'bdnInformation': '',
      'orderNumber': '',
      'deliveryDate': '',
      'order': null,
      'barge': null,
      'bdnDate': '',
      'berthingTime': '',
      'bargeAlongside': '',
      'info': {},
      'temp': {
        'orderedProducts': {},
        'deliverysummary': {},
        'deliveryProducts': [],
        'buyerPrecedenceRule': {},
        'sellerPrecedenceRule': {},
        'finalQtyPrecedenceLogicRules': {},
        'isShowQuantityReconciliationSection': {},
        'isShowDeliveryEmailToLabsButton': {},
        'hiddenFields': {},
        'savedProdForCheck': {}
      },
      'deliveryProducts': [],
      'feedback': {}
    };
    this.entityName = 'Delivery'
    const generalTenantSettings = tenantSettingsService.getGeneralTenantSettings();
    this.quantityPrecision = generalTenantSettings.defaultValues.quantityPrecision;
    this.deliverySettings = tenantSettingsService.getModuleTenantSettings<
            IDeliveryTenantSettings
          >(TenantSettingsModuleName.Delivery);
    this.adminConfiguration = tenantSettingsService.getModuleTenantSettings<
          IGeneralTenantSettings
        >(TenantSettingsModuleName.General);
    console.log(this.deliverySettings);
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this._destroy$)).subscribe(params => {
      this.entityId = params.deliveryId;
    });
    this.route.data.subscribe(data => {
      if (localStorage.getItem('deliveriesFromOrder')) {
        this.createDeliveryFromOrdersToDeliveriesList();
      }
      console.log('Check route resolver data')
      console.log(data);
      this.orderNumberOptions = data.orderNumbers;
      if (data.delivery) {
        this.formValues = data.delivery;
      }
      if (typeof this.formValues.feedback == 'undefined' || !this.formValues.feedback) {
        this.formValues.feedback = {};
      }
      this.uoms = data.uoms;
      this.deliveryFeedback = data.deliveryFeedback;
      this.satisfactionLevel = data.satisfactionLevel;
      this.bargeList = data.bargeList;
      this.navBar = data.navBar;
      this.CM.listsCache.ClaimType = data.claimType;
      this.quantityCategory = data.quantityCategory;
      this.scheduleDashboardLabelConfiguration = data.scheduleDashboardLabelConfiguration;
      if (this.formValues.order && this.formValues.order.id) {
        this.getDeliveryOrderSummary(this.formValues.order.id);
        this.getRelatedDeliveries(this.formValues.order.id);
      }

      const deliveryData = {
        'data': this.deliverySettings
      }
      this.setDeliverySettings(deliveryData);
      if (this.formValues.deliveryProducts[this.selectedProductIndex]) {
        const product = this.formValues.deliveryProducts[this.selectedProductIndex];
        this.getClaimInfo([...product.qualityParameters], product.id);
      }
    });

    //this.changeDetectorRef.detectChanges();
  }

  createDeliveryFromOrdersToDeliveriesList() {
    let data = JSON.parse(localStorage.getItem('deliveriesFromOrder'));
    localStorage.removeItem('deliveriesFromOrder');
    this.formValues.order = data[0].order;
    this.formValues.surveyor = data[0].surveyor;
    if (typeof this.formValues.deliveryProducts == 'undefined') {
      this.formValues.deliveryProducts = [];
    }
    data.forEach((delivery, key) => {
      this.formValues.deliveryProducts.push({
          orderedProduct: delivery.product,
          product: delivery.product,
          confirmedQuantityAmount: delivery.confirmedQuantityAmount,
          confirmedQuantityUom: delivery.confirmedQuantityUom,
          orderProductId: delivery.orderProductId
      });
      let orderProductId = delivery.orderProductId;
      let orderProductSpecGroupId = delivery.specGroup.id;
      let dataForInfo = {
        Payload: {
            Filters: [ {
                ColumnName: 'OrderProductId',
                Value: orderProductId
            }, {
                ColumnName: 'SpecGroupId',
                Value: orderProductSpecGroupId
            } ]
        }
      };
      this.deliveryService
      .loadDeliverySpecParameters(dataForInfo)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe((response: any) => {
        this.formValues.deliveryProducts[key].qualityParameters = response;
        console.log(this.formValues.deliveryProducts[key]);
      });

      this.deliveryService
      .loadDeliveryQuantityParameters(dataForInfo)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe((response: any) => {
        this.formValues.deliveryProducts[key].quantityParameters = response;
        console.log(this.formValues.deliveryProducts[key]);
      });
    });
    this.deliveryService
    .loadOrder(this.formValues.order.id)
    .pipe(
      finalize(() => {

      })
    )
    .subscribe((response: any)  => {
      this.formValues.sellerName = response.seller.name;
      this.formValues.port = response.location.name;
      this.formValues.OrderBuyer = response.buyer.name;
      this.formValues.temp.orderedProducts = response.products;
      if (response.surveyorCounterparty) {
          this.formValues.surveyorName = response.surveyorCounterparty.name;
      }
    });
    //this.getDeliveryOrderSummary(this.formValues.order.id);
  }

  getDeliveryOrderSummary(orderId: number) {
    this.deliveryService
    .loadDeliveryOrderSummary(orderId)
    .pipe(
        finalize(() => {
          //this.isLoading = false;
        })
    )
    .subscribe((response: any) => {
      console.log(this.entityId);
      if (typeof this.formValues.temp == 'undefined') {
        this.formValues.temp = {};
      }
      this.formValues.temp.deliverysummary = response;
      if (!this.entityId) {
        // new delivery
        // also set pricing date for delivery to delivery date if null
        this.formValues.deliveryProducts.forEach((deliveryProd, _) => {
          this.formValues.temp.deliverysummary.products.forEach((summaryProd, _) => {
              if (summaryProd.id == deliveryProd.orderProductId) {
                  if (summaryProd.pricingDate != null) {
                      deliveryProd.pricingDate = summaryProd.pricingDate;
                  } else {
                      deliveryProd.pricingDate = this.formValues.temp.deliverysummary.deliveryDate;
                  }
                  if (summaryProd.convFactorOptions) {
                      deliveryProd.convFactorOptions = summaryProd.convFactorOptions;
                  }
                  if (summaryProd.convFactorMassUom != null) {
                      deliveryProd.convFactorMassUom = summaryProd.convFactorMassUom;
                  }
                  if (summaryProd.convFactorValue != null) {
                      deliveryProd.convFactorValue = summaryProd.convFactorValue;
                  }
                  if (summaryProd.convFactorVolumeUom != null) {
                      deliveryProd.convFactorVolumeUom = summaryProd.convFactorVolumeUom;
                  }
              }
          });
        });
        if (this.deliverySettings.deliveryDateFlow.internalName == 'Yes') {
          this.formValues.deliveryDate = this.formValues.temp.deliverysummary.deliveryDate;
        }
      }
      if (typeof this.formValues.deliveryStatus != 'undefined') {
        if (this.formValues.deliveryStatus.name) {
            this.statusColorCode = this.getColorCodeFromLabels(this.formValues.deliveryStatus, this.scheduleDashboardLabelConfiguration);
            console.log(this.statusColorCode)
        }
      }
      // this.orderProductsByProductType('summaryProducts');
      if (this.formValues.deliveryProducts) {
        this.setProductsPhysicalSupplier();
        this.setQtyUoms();
      }
      console.log(this.formValues);
      this.changeDetectorRef.detectChanges();
      this.eventsSubject.next(this.formValues);
    });
  }

  setProductsPhysicalSupplier() {
    this.formValues.deliveryProducts.forEach((deliveryProd, _) => {
      this.formValues.temp.deliverysummary.products.forEach((summaryProd, key) => {
          if (deliveryProd.orderProductId == summaryProd.id) {
            if (!deliveryProd.physicalSupplier && !this.formValues.id) {
                deliveryProd.physicalSupplier = summaryProd.physicalSupplier;
            }
          }
      });
    });
  }

  setQtyUoms() {
    this.formValues.deliveryProducts.forEach((deliveryProd, _) => {
        this.formValues.temp.deliverysummary.products.forEach((summaryProd, key) => {
            if (summaryProd.id == deliveryProd.orderProductId) {
                if (!deliveryProd.surveyorQuantityUom) {
                    deliveryProd.surveyorQuantityUom = summaryProd.orderedQuantity.uom;
                }
                if (!deliveryProd.vesselQuantityUom) {
                    deliveryProd.vesselQuantityUom = summaryProd.orderedQuantity.uom;
                }
                if (!deliveryProd.agreedQuantityUom) {
                    deliveryProd.agreedQuantityUom = summaryProd.orderedQuantity.uom;
                }
                if (!deliveryProd.bdnQuantityUom) {
                    deliveryProd.bdnQuantityUom = summaryProd.orderedQuantity.uom;
                }
                if (!deliveryProd.vesselFlowMeterQuantityUom) {
                    deliveryProd.vesselFlowMeterQuantityUom = summaryProd.orderedQuantity.uom;
                }
                if (!deliveryProd.finalQuantityUom) {
                    deliveryProd.finalQuantityUom = summaryProd.orderedQuantity.uom;
                }
            }
        });
    });
  };

  getColorCodeFromLabels(statusObj, labels) {
    for(let i = 0; i < labels.length; i++) {
      if (statusObj) {
        if(statusObj.id === labels[i].id && statusObj.transactionTypeId === labels[i].transactionTypeId) {
            return labels[i].code;
        }
      }
    }
  }

  
  getRelatedDeliveries(orderId: number) {
    let duplicate = false;
    this.deliveryService
    .loadDeliveryInfoForOrder(orderId)
    .pipe(
        finalize(() => {
          this.isLoading = true;
        })
    )
    .subscribe((response: any) => {
        if (typeof response == 'string') {
          console.log('eroare');
        } else {
          response.forEach((val, key) => {
            this.relatedDeliveries.forEach((val2, key2) => {
                if (val2.deliveryId == val.deliveryId) {
                    duplicate = true;
                }
            });
            if (!duplicate) {
              this.relatedDeliveries.push(val);
            }
          });
          console.log(this.relatedDeliveries);
          this.changeDetectorRef.detectChanges();
          this.eventsSubject.next(this.formValues);
        }
    });
  }


  setDeliverySettings(response) {
    if (typeof this.formValues.temp == 'undefined') {
      this.formValues.temp = {};
    }
    // set buyer & seller qty and uom in temp if no products yet
    this.formValues.temp.buyerPrecedenceRule = {};
    this.formValues.temp.sellerPrecedenceRule = {};
    this.formValues.temp.finalQtyPrecedenceLogicRules = [];
    this.formValues.temp.buyerPrecedenceRule = response.data.buyerPrecedenceLogicRules[0].precedenceRule;
    this.formValues.temp.sellerPrecedenceRule = response.data.sellerPrecedenceLogicRules[0].precedenceRule;


    // final quantity defaultation rules
    // form local finalQuantityRules, include delivery mapping
    this.formValues.temp.finalQtyPrecedenceLogicRules = response.data.finalQtyPrecedenceLogicRules;
    this.finalQuantityRules = [];
    this.formValues.temp.finalQtyPrecedenceLogicRules.forEach((rule, _) => {
      let localRule = {
          ord: rule.ord,
          precedenceRule: rule.precedenceRule,
          deliveryMapping: ''
      };
      // agreed
      if(rule.precedenceRule.id == 1) {
          localRule.deliveryMapping = 'agreedQuantity';
      }
      // seller
      if(rule.precedenceRule.id == 2) {
          localRule.deliveryMapping = 'sellerQuantity';
      }
      // buyer
      if(rule.precedenceRule.id == 3) {
          localRule.deliveryMapping = 'buyerQuantity';
      }

      this.finalQuantityRules.push(localRule);
    });
    this.finalQuantityRules = _.orderBy(this.finalQuantityRules, [ 'ord' ], [ 'asc' ]);


    // buyer and seller is the same across products, se all of them to first product buyer & seller
    this.setBuyerAndSellerAcrossProducts();
    // when create delivery form order, buyer and seller are not set
    // show & hide fields
    this.formValues.temp.isShowQuantityReconciliationSection = response.data.isShowQuantityReconciliationSection;
    this.formValues.temp.isShowDeliveryEmailToLabsButton = response.data.isShowDeliveryEmailToLabsButton;
    this.formValues.temp.hiddenFields = {};
    response.data.hiddenFields.forEach((val, key) => {
      if (val.id == 1) {
        this.formValues.temp.hiddenFields.buyerQty = val.hidden;
      }
      if (val.id == 2) {
        this.formValues.temp.hiddenFields.sellerQty = val.hidden;
      }
      if (val.id == 3) {
        this.formValues.temp.hiddenFields.agreedQty = val.hidden;
      }
      if (val.id == 4) {
        this.formValues.temp.hiddenFields.pricingDate = val.hidden;
      }
    });

    this.toleranceLimits = {};
    if(typeof response.data.minToleranceLimit == 'number') {
      this.toleranceLimits.minToleranceLimit = response.data.minToleranceLimit;
    }
    if(typeof response.data.maxToleranceLimit == 'number') {
      this.toleranceLimits.maxToleranceLimit = response.data.maxToleranceLimit;
    }
    console.log(this.toleranceLimits);
  }

  setBuyerAndSellerAcrossProducts() {
    if (typeof this.formValues.deliveryProducts == 'undefined') {
      this.formValues.deliveryProducts = [];
    }
    this.formValues.deliveryProducts.forEach((value, index) => {
      if (value.buyerQuantityType) {
          this.formValues.temp.buyerPrecedenceRule = value.buyerQuantityType;
      }
      if (value.sellerQuantityType) {
          this.formValues.temp.sellerPrecedenceRule = value.sellerQuantityType;
      }
    });
    this.formValues.deliveryProducts.forEach((value, index) => {
        value.buyerQuantityType = this.formValues.temp.buyerPrecedenceRule;
        value.sellerQuantityType = this.formValues.temp.sellerPrecedenceRule;
    });
  }

  ngOnDestroy(): void {

  }
  
  public detectChanges(form: any):void {
    console.log('form values : ', form);
    this.formValues = form;
    this.changeDetectorRef.detectChanges();
  }



  openRaiseClaimDialog(raiseClaimData: any): void {
    const dialogRef = this.dialog.open(RaiseClaimModalComponent, {
      width: '600px',
      data:  { availableClaimTypes: raiseClaimData, deliveryProducts: this.formValues.deliveryProducts }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
    });
  }

  raiseNewClaim() {
    if (typeof this.raiseClaimInfo.allSpecParams == 'undefined' || this.raiseClaimInfo.allSpecParams == null) {
      this.toastrService.error('Claim can not be raised for this product!');
      return;
    }
    console.log('this.raiseClaimInfo', this.raiseClaimInfo);
    this.CM.availableClaimTypes = [];
    const claimType = {
      displayName: '',
      claim: {},
      specParams: [],
    };
    console.log('this.CM.listsCache.ClaimType', this.CM.listsCache.ClaimType);
    this.CM.listsCache.ClaimType.forEach((val, ind) => {
      // only allow these 3 types of claim
      if (val.id != 1 && val.id != 3 && val.id != 6 && val.id != 2) {
        return;
      }
      const params = [];
      this.raiseClaimInfo.allSpecParams.forEach((paramVal, paramKey) => {
        paramVal.claimTypes.forEach((element, key) => {
            if (element.id == val.id) {
                paramVal.disabled = 'false';
                params.push({...paramVal});
            }
        });
      });
      console.log(params);
      const claimType = {
        claim: val,
        specParams: [...params],
        disabled: false,
        displayName: null,
        id: null,
        isTypeSelected: false
      };
      claimType.disabled = true;
      if (params.length > 0) {
          claimType.disabled = false;
      }
      if (this.formValues.feedback) {
        if (this.formValues.feedback.hasLetterOfProtest && this.formValues.feedback.hasLetterOfProtest.id == 1) {
          claimType.disabled = false;
        }
      }
      if (val.name == 'Quantity') {
        const claim1: any = {};
        claim1.claim = { ... val };
        claim1.specParams = [... params];
        claim1.disabled = claimType.disabled;
        claim1.displayName = 'Overstated Density';
        claim1.id = 1;
        claim1.isTypeSelected = false;
        this.CM.availableClaimTypes.push({ ... claim1});
        const claim2 : any = {};
        claim2.claim = { ... val };
        claim2.specParams = [];
        claim2.disabled = false;
        if (typeof this.formValues.temp.variances != 'undefined') {
            if (typeof this.formValues.temp.variances[`product_${ this.CM.selectedProduct}`] == 'undefined' || this.formValues.temp.variances[`product_${ this.CM.selectedProduct}`] == null) {
              claim2.disabled = true;
            }
        } else {
          claim2.disabled = true;
        }
        claim2.displayName = 'Quantity Variance';
        claim2.id = 1;
        claim2.isTypeSelected = false;
        this.CM.availableClaimTypes.push({ ...claim2 });
      }
      if (val.name == 'Compliance') {
        claimType.displayName = 'Sulphur Variance';
        claimType.id = 3;
        this.CM.availableClaimTypes.push(Object.assign({}, claimType));
      }
      if (val.name == 'Quality') {
        claimType.displayName = 'Quality';
        claimType.id = 2;
        this.CM.availableClaimTypes.push(Object.assign({}, claimType));
      }
      if (val.name == 'Others') {
        claimType.displayName = 'Letter of Protest Claim';
        claimType.id = 4;
        this.CM.availableClaimTypes.push(Object.assign({}, claimType));
      }
    });
    this.raiseClaimInfo.currentSpecParamIds = [];
    console.log('this.CM.availableClaimTypes', this.CM.availableClaimTypes);
    this.openRaiseClaimDialog(this.CM.availableClaimTypes);
  }



  public getSelectedProduct(selectedProduct: any):void {
    console.log('Selected product ', selectedProduct);
    this.selectedProductIndex = selectedProduct;
    const product = this.formValues.deliveryProducts[this.selectedProductIndex];
    if (product.qualityParameters) {
      this.getClaimInfo([...product.qualityParameters], product.id);
    }
  }  

  getClaimInfo(specParams, prodId) {
    this.raiseClaimInfo = {};
    this.raiseClaimInfo.allSpecParams = [...specParams];
    this.raiseClaimInfo.productId = prodId;
    console.log(this.raiseClaimInfo);
  }

  splitDeliveries() {
    const dialogRef = this.dialog.open(SplitDeliveryModalComponent, {
      width: '600px',
      data:  { formValues: this.formValues, uoms: this.uoms }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
    });
  }

 

  save() {
    let hasMandatoryFields = this.validateRequiredFields();
    if (hasMandatoryFields) {
      return;
    }
    let id = parseFloat(this.entityId);
    if (!parseFloat(this.entityId)) {
      this.spinner.show();
      this.deliveryService
      .saveDeliveryInfo(this.formValues)
      .pipe(
          finalize(() => {
            this.isLoading = true;
          })
      )
      .subscribe((result: any) => {
          if (typeof result == 'string') {
            console.log('eroare');
            this.spinner.hide();
            this.toastrService.error(result);
          } else {
            console.log('success');
            this.toastrService.success('Report saved successfully');
            let navBar = {
              'deliveryId': result
            };
            this.navBarService
            .getNavBarIdsList(navBar)
            .pipe(
              finalize(() => {
                this.isLoading = true;
                //this.spinner.hide();
              })
            )
            .subscribe(res => {
              console.log(res);
              this.navBar = res;
              this.router
              .navigate([
                KnownPrimaryRoutes.Delivery,
                `${KnownDeliverylRoutes.Delivery}`,
                result,
                KnownDeliverylRoutes.DeliveryDetails
              ])
              .then(() => {
                this.deliveryService
                .loadDeliverytDetails(result)
                .pipe(
                  finalize(() => {
                    this.isLoading = true;
                    this.spinner.hide();
                  })
                )
                .subscribe((data: any) => {
                      console.log(res);
                      this.navBar = res;
                      console.log(this.formValues);
                      console.log(data);
                      this.formValues = _.merge(this.formValues, data);
                      console.log(this.formValues);
                      if (typeof this.formValues.deliveryStatus != 'undefined') {
                        if (this.formValues.deliveryStatus.name) {
                            this.statusColorCode = this.getColorCodeFromLabels(this.formValues.deliveryStatus, this.scheduleDashboardLabelConfiguration);
                            console.log(this.statusColorCode)
                        }
                      }
                  });
                })
            });

          }
      });
    } else {
      this.spinner.show();
      this.deliveryService
      .updateDeliveryInfo(this.formValues)
      .pipe(
          finalize(() => {
            this.isLoading = true;
          })
      )
      .subscribe((result: any) => {
          if (typeof result == 'string') {
            console.log('eroare');
            this.spinner.hide();
            this.toastrService.error(result);
          } else {
            console.log('success');
            this.toastrService.success('Delivery saved successfully');
            this.router
              .navigate([
                KnownPrimaryRoutes.Delivery,
                `${KnownDeliverylRoutes.Delivery}`,
                result.id,
                KnownDeliverylRoutes.DeliveryDetails
              ])
              .then(() => {
                this.deliveryService
                  .loadDeliverytDetails(result.id)
                  .pipe(
                    finalize(() => {
                      this.isLoading = true;
                      this.spinner.hide();
                    })
                  )
                  .subscribe((data: any) => {
                    console.log(this.formValues);
                    console.log(data);
                    this.formValues = _.merge(this.formValues, data);
                    console.log(this.formValues);
                  })
              });
          }
       });
    }
  }

  
  verify() {
    this.spinner.show();
    this.deliveryService
      .verifyDelivery(this.formValues)
      .pipe(
        finalize(() => {
          this.isLoading = true;
        })
      )
      .subscribe((response: any) => {
        if (response == 'Error, could not verify the delivery') {
          this.toastrService.error('Delivery verification failed!');
          this.spinner.hide();

        } else {
          console.log('success');
          this.toastrService.success('Verify success!');
          this.router
            .navigate([
              KnownPrimaryRoutes.Delivery,
              `${KnownDeliverylRoutes.Delivery}`,
              this.entityId,
              KnownDeliverylRoutes.DeliveryDetails
            ])
            .then(() => {
              this.deliveryService
                .loadDeliverytDetails(parseFloat(this.entityId))
                .pipe(
                  finalize(() => {
                    this.isLoading = true;
                    this.spinner.hide();
                  })
                )
                .subscribe((data: any) => {
                  console.log(this.formValues);
                  console.log(data);
                  this.formValues = _.merge(this.formValues, data);
                  console.log(this.formValues);
                  if (typeof this.formValues.deliveryStatus != 'undefined') {
                    if (this.formValues.deliveryStatus.name) {
                        this.statusColorCode = this.getColorCodeFromLabels(this.formValues.deliveryStatus, this.scheduleDashboardLabelConfiguration);
                        console.log(this.statusColorCode)
                    }
                  } 
                });
            });
        }
      }, error => {
        this.spinner.hide();
        console.error(error);
      });
  }


  revertVerify() {
    let payload = {
      "DeliveryId": this.formValues.id
    }
    this.spinner.show();
    this.deliveryService
      .revertVerifyDelivery(payload)
      .pipe(
        finalize(() => {
          this.isLoading = true;
        })
      )
      .subscribe((response: any) => {
        if (response == 'Error, could not revert verify the delivery') {
          this.spinner.hide();
          this.toastrService.error('Could not get Revert Verify!');
        } else {
          console.log('success');
          this.toastrService.success('Revert Verify success!');
          this.router
            .navigate([
              KnownPrimaryRoutes.Delivery,
              `${KnownDeliverylRoutes.Delivery}`,
              this.entityId,
              KnownDeliverylRoutes.DeliveryDetails
            ])
            .then(() => {
              this.deliveryService
                .loadDeliverytDetails(parseFloat(this.entityId))
                .pipe(
                  finalize(() => {
                    this.isLoading = true;
                    this.spinner.hide();
                  })
                )
                .subscribe((data: any) => {
                  console.log(this.formValues);
                  console.log(data);
                  this.formValues = _.merge(this.formValues, data);
                  console.log(this.formValues);
                  if (typeof this.formValues.deliveryStatus != 'undefined') {
                    if (this.formValues.deliveryStatus.name) {
                        this.statusColorCode = this.getColorCodeFromLabels(this.formValues.deliveryStatus, this.scheduleDashboardLabelConfiguration);
                        console.log(this.statusColorCode)
                    }
                  }
                })
            });
        }
        
      }, error => {
        this.spinner.hide();
        console.error(error);
      });
  }

  validateRequiredFields() {
    let requiredFields = 'Please fill in required fields:';
    if (!this.formValues.deliveryDate) {
      requiredFields += ' Delivery Date';
    }
    if (!this.formValues.bdnDate) {
      requiredFields +=  ' Bdn Date';
    }
    if (this.formValues.deliveryProducts) {
      for (let i = 0; i < this.formValues.deliveryProducts.length; i++) {
        if (!this.formValues.deliveryProducts[i].bdnQuantityAmount) {
          requiredFields  +=  ' Product ' + (i + 1) + ' BDN quantity ' + "\n";
        }
      }
    } 
    
    this.buttonClicked = true;
    this.eventsSubject2.next(this.buttonClicked);
    if (requiredFields != 'Please fill in required fields:') {
      this.toastrService.error(requiredFields);
      return true;
    }
    return false;
  }

  
}
