import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { Select, Store } from '@ngxs/store';
import { QcReportState } from '../../../store/report/qc-report.state';
import { BehaviorSubject, empty, Observable, Subject } from 'rxjs';
import { QcReportService } from '../../../services/qc-report.service';
import { NotesService } from '../../../services/notes.service';
import {
  catchError,
  filter,
  finalize,
  map,
  scan,
  skip,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
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
import { DecimalPipe, Location } from '@angular/common';
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
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm
} from '@angular/forms';
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
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { throws } from 'assert';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ProductListColumnServerKeys } from '@shiptech/core/ui/components/master-selector/view-models/product-model/product-list.columns';
import { Title } from '@angular/platform-browser';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { RemoveDeliveryModalComponent } from './components/remove-delivery-modal/remove-delivery-modal.component';

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
  private _destroy$ = new Subject();

  private quantityPrecision: number;
  @Select(UserProfileState) usernameobj$: Observable<object>;
  @Select(UserProfileState.username) username$: Observable<string>;
  entityId: string;
  entityName: string;
  isLoading: boolean = false;
  orderNumberOptions: any;
  eventsSubject: Subject<any> = new Subject<any>();
  eventsSubject2: Subject<any> = new Subject<any>();
  eventsSubject3: Subject<any> = new Subject<any>();
  eventsSubject4: Subject<any> = new Subject<any>();
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
  activeNotesState: boolean = false;
  email: string;
  selectedProductIndex: any = 0;
  raiseClaimInfo: any;
  CM: any = {
    listsCache: {
      ClaimType: []
    },
    selectedProduct: 0
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
  conversionInfoData: any = [];
  quantityFormat: string;
  openedScreenLoaders: number = 0;
  uomVolume: any;
  uomMass: any;
  pumpingRateUom: any;
  sampleSource: any;

  constructor(
    private formBuilder: FormBuilder,
    private entityStatus: EntityStatusService,
    private store: Store,
    private router: Router,
    private location: Location,
    private reportService: QcReportService,
    private NotesService: NotesService,
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
    private navBarService: NavBarApiService,
    @Inject(DecimalPipe) private _decimalPipe,
    private tenantService: TenantFormattingService,
    private loadingBar: LoadingBarService,
    private titleService: Title
  ) {
    this.formValues = {
      sellerName: '',
      port: '',
      OrderBuyer: '',
      surveyorName: '',
      bdnInformation: '',
      orderNumber: '',
      deliveryDate: '',
      order: null,
      barge: null,
      bdnDate: '',
      berthingTime: '',
      bargeAlongside: '',
      deliveryStatus: '',
      info: {},
      DeliveryNotes: {},
      temp: {
        orderedProducts: {},
        deliverysummary: {},
        deliveryProducts: [],
        buyerPrecedenceRule: {},
        sellerPrecedenceRule: {},
        finalQtyPrecedenceLogicRules: {},
        isShowQuantityReconciliationSection: {},
        isShowDeliveryEmailToLabsButton: {},
        hiddenFields: {},
        savedProdForCheck: {}
      },
      deliveryProducts: [],
      feedback: {}
    };

    this.entityName = 'Delivery';
    const generalTenantSettings = tenantSettingsService.getGeneralTenantSettings();
    this.quantityPrecision =
      generalTenantSettings.defaultValues.quantityPrecision;
    this.deliverySettings = tenantSettingsService.getModuleTenantSettings<
      IDeliveryTenantSettings
    >(TenantSettingsModuleName.Delivery);
    this.adminConfiguration = tenantSettingsService.getModuleTenantSettings<
      IGeneralTenantSettings
    >(TenantSettingsModuleName.General);
    this.quantityFormat =
      '1.' +
      this.tenantService.quantityPrecision +
      '-' +
      this.tenantService.quantityPrecision;
    //this.loadingBar.start();
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this._destroy$)).subscribe(params => {
      this.entityId = params.deliveryId;
    });
    this.route.data.subscribe(data => {
      if (localStorage.getItem('parentSplitDelivery')) {
        this.isLoading = true;
        this.openedScreenLoaders = 0;
        this.buttonClicked = false;
        this.eventsSubject2.next(this.buttonClicked);
        this.initSplitDelivery();
      }
      if (localStorage.getItem('deliveriesFromOrder')) {
        this.isLoading = true;
        this.openedScreenLoaders = 0;
        this.createDeliveryWithMultipleProductsFromOrdersToBeDeliveriesList();
      }
      if (localStorage.getItem('deliveryFromOrder')) {
        this.isLoading = true;
        this.openedScreenLoaders = 0;
        this.createDeliveryWithOneProductFromOrdersToBeDeliveriesList();
      }
      this.orderNumberOptions = data.orderNumbers;
      if (data.delivery) {
        this.formValues = data.delivery;
        if (
          this.formValues.deliveryNotes != undefined &&
          this.formValues.deliveryNotes != null &&
          this.formValues.deliveryNotes.length > 0
        ) {
          this.activeNotesState = true;
        }
        if (this.formValues?.info?.request) {
          this.titleService.setTitle(
            'Delivery' +
              ' - ' +
              'REQ ' +
              this.formValues.info.request.id +
              ' - ' +
              this.formValues.info.vesselName
          );
        } else {
          this.titleService.setTitle(
            'Delivery' +
              ' - ' +
              this.formValues.order.name +
              ' - ' +
              this.formValues.info.vesselName
          );
        }

        this.setQuantityFormatValues();
        this.decodeFields();
      }
      if (
        typeof this.formValues.feedback == 'undefined' ||
        !this.formValues.feedback
      ) {
        this.formValues.feedback = {};
      }
      this.uoms = data.uoms;
      this.deliveryFeedback = data.deliveryFeedback;
      this.satisfactionLevel = data.satisfactionLevel;
      this.bargeList = data.bargeList;
      this.navBar = data.navBar;
      this.CM.listsCache.ClaimType = data.claimType;
      this.quantityCategory = data.quantityCategory;
      this.scheduleDashboardLabelConfiguration =
        data.scheduleDashboardLabelConfiguration;
      this.pumpingRateUom = data.pumpingRateUom;
      this.uomMass = data.uomMass;
      this.uomVolume = data.uomVolume;
      this.sampleSource = data.sampleSource;
      if (this.formValues.order && this.formValues.order.id) {
        // this.isLoading = true;
        this.openedScreenLoaders = 0;
        this.getDeliveryOrderSummary(this.formValues.order.id);
        this.getRelatedDeliveries(this.formValues.order.id);
      }

      const deliveryData = {
        data: this.deliverySettings
      };
      this.setDeliverySettings(deliveryData);
      if (this.formValues.deliveryProducts[this.selectedProductIndex]) {
        const product = this.formValues.deliveryProducts[
          this.selectedProductIndex
        ];
        if (product.qualityParameters) {
          this.getClaimInfo([...product.qualityParameters], product.id);
        }
      }

      if (this.formValues.deliveryProducts) {
        this.formValues.deliveryProducts.forEach((product, key) => {
          this.initGetConversionInfo(product.product.id, key);
        });
      }
    });

    //this.changeDetectorRef.detectChanges();
  }

  initSplitDelivery() {
    this.formValues = {
      sellerName: '',
      port: '',
      OrderBuyer: '',
      surveyorName: '',
      bdnInformation: '',
      orderNumber: '',
      deliveryDate: '',
      order: null,
      barge: null,
      bdnDate: '',
      berthingTime: '',
      bargeAlongside: '',
      deliveryStatus: '',
      info: {},
      temp: {
        orderedProducts: {},
        deliverysummary: {},
        deliveryProducts: [],
        buyerPrecedenceRule: {},
        sellerPrecedenceRule: {},
        finalQtyPrecedenceLogicRules: {},
        isShowQuantityReconciliationSection: {},
        isShowDeliveryEmailToLabsButton: {},
        hiddenFields: {},
        savedProdForCheck: {}
      },
      deliveryProducts: [],
      feedback: {}
    };
    let data = JSON.parse(localStorage.getItem('parentSplitDelivery'));
    localStorage.removeItem('parentSplitDelivery');
    this.formValues.order = data.order;
    this.formValues.info = data.info;
    if (typeof this.formValues.deliveryProducts == 'undefined') {
      this.formValues.deliveryProducts = [];
    }
    data.deliveryProducts.forEach((val, key) => {
      this.formValues.deliveryProducts.push({
        product: val.product,
        id: val.id,
        orderedProduct: val.orderedProduct,
        orderProductId: val.orderProductId
      });
    });
    this.formValues.splittedDeliveryId = data.splitDelivery.splittedDeliveryId;
    // set confirmed amount
    this.formValues.deliveryProducts.forEach((deliveryProd, _) => {
      data.splitDelivery.items.forEach((splitProd, key) => {
        if (splitProd.orderProductId == deliveryProd.orderProductId) {
          deliveryProd.confirmedQuantityAmount =
            splitProd.remainingConfirmedAmount;
          deliveryProd.confirmedQuantityUom = splitProd.remainingConfirmedUom;
        }
      });
    });
    // set quality & qty params
    data.temp.deliverysummary.products.forEach((summaryProd, _) => {
      this.formValues.deliveryProducts.forEach((deliveryProd, key) => {
        if (summaryProd.id == deliveryProd.orderProductId) {
          deliveryProd.orderProductId = summaryProd.id;
          deliveryProd.productType = { ...summaryProd.productType };
          deliveryProd.productTypeId = summaryProd.productType.id;

          const orderProductId = summaryProd.id;
          const orderProductSpecGroupId = summaryProd.specGroup.id;

          var dataForInfo = {
            Payload: {
              Filters: [
                {
                  ColumnName: 'OrderProductId',
                  Value: orderProductId
                },
                {
                  ColumnName: 'SpecGroupId',
                  Value: orderProductSpecGroupId
                }
              ]
            }
          };
          this.openedScreenLoaders += 1;
          this.deliveryService
            .loadDeliverySpecParameters(dataForInfo)
            .pipe(
              finalize(() => {
                this.openedScreenLoaders -= 1;
                if (!this.openedScreenLoaders) {
                  this.isLoading = false;
                }
              })
            )
            .subscribe((response: any) => {
              deliveryProd.qualityParameters = response;
              if (deliveryProd.qualityParameters) {
                deliveryProd.qualityParameters.forEach(
                  (productParameter, key1) => {
                    productParameter.specParameter.name = this.decodeSpecificField(
                      productParameter.specParameter.name
                    );
                  }
                );
              }
              this.changeDetectorRef.detectChanges();
            });

          this.openedScreenLoaders += 1;
          this.deliveryService
            .loadDeliveryQuantityParameters(dataForInfo)
            .pipe(
              finalize(() => {
                this.openedScreenLoaders -= 1;
                if (!this.openedScreenLoaders) {
                  this.isLoading = false;
                }
              })
            )
            .subscribe((response: any) => {
              deliveryProd.quantityParameters = response;
              this.changeDetectorRef.detectChanges();
            });
        }
      });
    });
  }

  ChangedValueFun(event) {
    this.formValues.deliveryNotes = event;
  }

  /* END SELCTIONS FOR RAISE CLAIM IN DELIVERY*/
  /* delivery quantity variance and status calculations*/
  initGetConversionInfo(productID, productIdx) {
    if (typeof this.formValues.temp.variances == 'undefined') {
      this.formValues.temp.variances = [];
    }
    //this.openedScreenLoaders += 1;
    this.deliveryService
      .loadConversionInfo(productID)
      .pipe(
        finalize(() => {
          //this.openedScreenLoaders -= 1;
          if (!this.openedScreenLoaders) {
            //this.isLoading = false;
          }
        })
      )
      .subscribe(response => {
        this.formValues.temp.variances[`product_${productIdx}`] = null;
        this.conversionInfoData[productIdx] = response;
        this.calculateVarianceAndReconStatus(productIdx);
        this.eventsSubject3.next(this.conversionInfoData);
        this.changeDetectorRef.detectChanges();
      });
  }

  setQuantityFormat(value) {
    let viewValue = `${value}`;
    let plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
    return plainNumber;
  }

  calculateVarianceAndReconStatus(productIdx) {
    // function called for all quantities, call here calculate final quantity
    this.calculateFinalQuantity(productIdx);
    let confirmedQuantityUom,
      vesselQuantityUom,
      bdnQuantityUom,
      vesselFlowMeterQuantityUom,
      surveyorQuantityUom;
    let conversionInfo = this.conversionInfoData[productIdx];
    let activeProduct = this.formValues.deliveryProducts[productIdx];
    // get fields values and uom
    activeProduct.confirmedQuantityUom == null
      ? (confirmedQuantityUom = null)
      : (confirmedQuantityUom = activeProduct.confirmedQuantityUom.name);
    activeProduct.vesselQuantityUom == null
      ? (vesselQuantityUom = null)
      : (vesselQuantityUom = activeProduct.vesselQuantityUom.name);
    activeProduct.bdnQuantityUom == null
      ? (bdnQuantityUom = null)
      : (bdnQuantityUom = activeProduct.bdnQuantityUom.name);
    activeProduct.vesselFlowMeterQuantityUom == null
      ? (vesselFlowMeterQuantityUom = null)
      : (vesselFlowMeterQuantityUom =
          activeProduct.vesselFlowMeterQuantityUom.name);
    // activeProduct.bargeFlowMeterQuantityUom == null ? bargeFlowMeterQuantityUom = null : bargeFlowMeterQuantityUom = activeProduct.bargeFlowMeterQuantityUom.name;
    activeProduct.surveyorQuantityUom == null
      ? (surveyorQuantityUom = null)
      : (surveyorQuantityUom = activeProduct.surveyorQuantityUom.name);
    let Confirm = {
      val: this.setQuantityFormat(activeProduct.confirmedQuantityAmount),
      uom: confirmedQuantityUom
    };
    let Vessel = {
      val: this.setQuantityFormat(activeProduct.vesselQuantityAmount),
      uom: vesselQuantityUom
    };
    let Bdn = {
      val: this.setQuantityFormat(activeProduct.bdnQuantityAmount),
      uom: bdnQuantityUom
    };
    let VesselFlowMeter = {
      val: this.setQuantityFormat(activeProduct.vesselFlowMeterQuantityAmount),
      uom: vesselFlowMeterQuantityUom
    };
    // BargeFlowMeter = {
    //     'val': activeProduct.bargeFlowMeterQuantityAmount,
    //     'uom': bargeFlowMeterQuantityUom
    // };
    let Surveyor = {
      val: this.setQuantityFormat(activeProduct.surveyorQuantityAmount),
      uom: surveyorQuantityUom
    };
    let currentFieldValues = {
      Confirm: Confirm,
      Vessel: Vessel,
      Bdn: Bdn,
      VesselFlowMeter: VesselFlowMeter,
      Surveyor: Surveyor
    };
    // "BargeFlowMeter": BargeFlowMeter,
    let fieldUoms = {
      Confirm: 'confirmedQuantityUom',
      Vessel: 'vesselQuantityUom',
      Bdn: 'bdnQuantityUom',
      VesselFlowMeter: 'vesselFlowMeterQuantityUom',
      Surveyor: 'surveyorQuantityUom'
    };
    // "BargeFlowMeter": 'bargeFlowMeterQuantityUom',
    let convertedFields: any = {};
    let baseUom: any = {};
    let convFact = 1;
    if (typeof conversionInfo == 'undefined') {
      conversionInfo = {};
    }
    if (
      productIdx == 0 &&
      typeof this.formValues.temp.variances == 'undefined'
    ) {
      this.formValues.temp.variances = [];
    }
    if (
      this.formValues.deliveryProducts[productIdx].sellerQuantityType &&
      typeof this.formValues.deliveryProducts[productIdx].sellerQuantityType
        .name != 'undefined'
    ) {
      let uomObjId =
        fieldUoms[
          this.formValues.deliveryProducts[productIdx].sellerQuantityType.name
        ];
      baseUom = this.formValues.deliveryProducts[productIdx][uomObjId];
    }
    if (!baseUom) {
      this.formValues.temp.variances[`uom_${productIdx}`] = null;
      this.formValues.temp.variances[`product_${productIdx}`] = null;
      this.setVarianceColor(productIdx);
      // return;
    }

    const currentFieldValuesProps = Object.keys(currentFieldValues);
    for (let fieldKey of currentFieldValuesProps) {
      const fieldVal = currentFieldValues[fieldKey];
      conversionInfo.uomConversionFactors.forEach((factVal, factKey) => {
        if (fieldVal.uom == factVal.sourceUom.name) {
          const convertedValue = fieldVal.val * factVal.conversionFactor;
          convertedFields[fieldKey] = convertedValue;
        }
      });
    }
    if (baseUom && conversionInfo.toleranceQuantityUom) {
      if (baseUom.name != conversionInfo.toleranceQuantityUom.name) {
        conversionInfo.uomConversionFactors.forEach((factVal, factKey) => {
          if (baseUom.name == factVal.sourceUom.name) {
            convFact = factVal.conversionFactor;
          }
        });
      } else {
        convFact = 1;
      }
    }

    this.formValues.temp.variances[`mfm_product_${productIdx}`] = null;
    this.formValues.temp.variances[`mfm_uom_${productIdx}`] = null;
    if (
      activeProduct.vesselFlowMeterQuantityUom &&
      activeProduct.bdnQuantityUom &&
      activeProduct.bdnQuantityAmount &&
      activeProduct.vesselFlowMeterQuantityAmount
    ) {
      let mfm_baseUom = activeProduct.vesselFlowMeterQuantityUom;
      if (mfm_baseUom && conversionInfo.toleranceQuantityUom) {
        if (mfm_baseUom.name != conversionInfo.toleranceQuantityUom.name) {
          conversionInfo.uomConversionFactors.forEach((factVal, factKey) => {
            if (mfm_baseUom.name == factVal.sourceUom.name) {
              var mfm_convFact = factVal.conversionFactor;
            }
          });
        } else {
          var mfm_convFact = 1;
        }
        var mfm_qty = convertedFields.VesselFlowMeter;
        var bdn_qty = convertedFields.Bdn;
        var variance = mfm_qty - bdn_qty;
        var mfm_variance = (mfm_qty - bdn_qty) / mfm_convFact;
        this.formValues.temp.variances[
          `mfm_product_${productIdx}`
        ] = this._decimalPipe.transform(mfm_variance, this.quantityFormat);
        this.formValues.temp.variances[`mfm_uom_${productIdx}`] =
          mfm_baseUom.name;
      }
    }

    if (!activeProduct.buyerQuantityType) {
      return;
    }
    if (!activeProduct.sellerQuantityType) {
      return;
    }
    var buyerOption = activeProduct.buyerQuantityType.name;
    var sellerOption = activeProduct.sellerQuantityType.name;
    var buyerConvertedValue = convertedFields[buyerOption];
    var sellerConvertedValue = convertedFields[sellerOption];
    if (!sellerConvertedValue || !buyerConvertedValue) {
      variance = null;
      this.formValues.temp.variances[`product_${productIdx}`] = variance;
      this.setVarianceColor(productIdx);
    } else {
      // this is where variance is calculated. rn it's buyer - seler (15/08)
      variance = buyerConvertedValue - sellerConvertedValue;

      //
      var varianceDisplay = variance / convFact;
      this.formValues.temp.variances[
        `product_${productIdx}`
      ] = this._decimalPipe.transform(varianceDisplay, this.quantityFormat);
      this.formValues.temp.variances[`uom_${productIdx}`] = baseUom.name;
      this.setVarianceColor(productIdx);
    }
    if (typeof this.formValues.temp.reconStatus == 'undefined') {
      this.formValues.temp.reconStatus = [];
    }
    if (variance != null) {
      if (conversionInfo.quantityReconciliation.name == 'Flat') {
        if (variance < conversionInfo.minToleranceLimit) {
          this.formValues.temp.reconStatus[`product_${productIdx}`] = 1; // Matched Green
        }
        if (
          variance > conversionInfo.minToleranceLimit &&
          variance < conversionInfo.maxToleranceLimit
        ) {
          this.formValues.temp.reconStatus[`product_${productIdx}`] = 2; // Unmatched Amber
        }
        if (variance > conversionInfo.maxToleranceLimit) {
          this.formValues.temp.reconStatus[`product_${productIdx}`] = 3; // Unmatched Red
        }
      } else {
        var minValue =
          (conversionInfo.minToleranceLimit *
            this.formValues.deliveryProducts[productIdx]
              .confirmedQuantityAmount) /
          100;
        var maxValue =
          (conversionInfo.maxToleranceLimit *
            this.formValues.deliveryProducts[productIdx]
              .confirmedQuantityAmount) /
          100;
        if (variance < minValue) {
          this.formValues.temp.reconStatus[`product_${productIdx}`] = 1; // Matched Green
        }
        if (variance > minValue && variance < maxValue) {
          this.formValues.temp.reconStatus[`product_${productIdx}`] = 2; // Unmatched Amber
        }
        if (variance > maxValue) {
          this.formValues.temp.reconStatus[`product_${productIdx}`] = 3; // Unmatched Red
        }
      }
    } else {
      this.formValues.temp.reconStatus[`product_${productIdx}`] = null;
    }

    // Update buyer & seller amount and uom
    this.setBuyerSellerQuantityAndUom('buyer');
    this.setBuyerSellerQuantityAndUom('seller');
  }

  setBuyerSellerQuantityAndUom(qtyToChange) {
    if (qtyToChange == 'seller') {
      let sellerQty = this.formValues.temp.sellerPrecedenceRule.name;
      if (sellerQty == 'Surveyor') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityUom = this.formValues.deliveryProducts[
            key
          ].surveyorQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].surveyorQuantityAmount;
        });
      }
      if (sellerQty == 'Bdn') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityUom = this.formValues.deliveryProducts[
            key
          ].bdnQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].bdnQuantityAmount;
        });
      }
      if (sellerQty == 'Vessel') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityUom = this.formValues.deliveryProducts[
            key
          ].vesselQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].vesselQuantityAmount;
        });
      }
      if (sellerQty == 'VesselFlowMeter') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityUom = this.formValues.deliveryProducts[
            key
          ].vesselFlowMeterQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].vesselFlowMeterQuantityAmount;
        });
      }
      if (sellerQty == 'Confirm') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityUom = this.formValues.deliveryProducts[
            key
          ].confirmedQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].sellerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].confirmedQuantityAmount;
        });
      }
    }

    if (qtyToChange == 'buyer') {
      let buyerQty = this.formValues.temp.buyerPrecedenceRule.name;
      if (buyerQty == 'Surveyor') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityUom = this.formValues.deliveryProducts[
            key
          ].surveyorQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].surveyorQuantityAmount;
        });
      }
      if (buyerQty == 'Bdn') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityUom = this.formValues.deliveryProducts[
            key
          ].bdnQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].bdnQuantityAmount;
        });
      }
      if (buyerQty == 'Vessel') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityUom = this.formValues.deliveryProducts[
            key
          ].vesselQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].vesselQuantityAmount;
        });
      }
      if (buyerQty == 'VesselFlowMeter') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityUom = this.formValues.deliveryProducts[
            key
          ].vesselFlowMeterQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].vesselFlowMeterQuantityAmount;
        });
      }
      if (buyerQty == 'Confirm') {
        this.formValues.deliveryProducts.forEach((val, key) => {
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityUom = this.formValues.deliveryProducts[
            key
          ].confirmedQuantityUom;
          this.formValues.deliveryProducts[
            key
          ].buyerQuantityAmount = this.formValues.deliveryProducts[
            key
          ].confirmedQuantityAmount;
        });
      }
    }

    // function called for all quantities, call here calculate final quantity
    this.calculateFinalQuantity(this.selectedProductIndex);
  }

  calculateFinalQuantity(productIdx) {
    if (typeof productIdx == 'undefined') {
      return;
    }
    if (typeof this.formValues.deliveryProducts[productIdx] == 'undefined') {
      return;
    }
    let dataSet = false;

    // rules are in order, check for each if quantity exists and set that
    // if not, go on
    for (let i = 0; i < this.finalQuantityRules.length; i++) {
      let rule = this.finalQuantityRules[i];
      if (
        typeof this.formValues.deliveryProducts[productIdx][
          `${rule.deliveryMapping}Uom`
        ] != 'undefined' &&
        this.formValues.deliveryProducts[productIdx][
          `${rule.deliveryMapping}Amount`
        ] != '' &&
        this.formValues.deliveryProducts[productIdx][
          `${rule.deliveryMapping}Amount`
        ] != null
      ) {
        // quantity exists, set it
        this.formValues.deliveryProducts[
          productIdx
        ].finalQuantityUom = this.formValues.deliveryProducts[productIdx][
          `${rule.deliveryMapping}Uom`
        ];
        this.formValues.deliveryProducts[
          productIdx
        ].finalQuantityAmount = this.formValues.deliveryProducts[productIdx][
          `${rule.deliveryMapping}Amount`
        ];
        dataSet = true;
      }
      if (dataSet) {
        break;
      } // break loop
    }

    if (!dataSet) {
      this.formValues.deliveryProducts[productIdx].finalQuantityUom = null;
      this.formValues.deliveryProducts[productIdx].finalQuantityAmount = null;
    }
  }

  setVarianceColor(idx) {
    // debugger
    if (typeof this.formValues.temp.variances[`color_${idx}`] == 'undefined') {
      this.formValues.temp.variances[`color_${idx}`] = '';
    }
    if (
      typeof this.formValues.temp.variances[`mfm_color_${idx}`] == 'undefined'
    ) {
      this.formValues.temp.variances[`mfm_color_${idx}`] = '';
    }

    if (this.formValues.temp.variances[`product_${idx}`] != null) {
      // new color code
      // 1. If the variance is Negative value and exceeds Max tolerance, then display the “Variance Qty” value field in “Red” colour
      // 2. If the variance is Negative value and less than Max tolerance, then display the “Variance Qty” value field in “Amber” colour
      // 3. If the variance is Positive value, then display the “Variance Qty” value field in “Green” colour

      if (parseFloat(this.formValues.temp.variances[`product_${idx}`]) < 0) {
        // 1 or 2
        if (
          Math.abs(
            parseFloat(this.formValues.temp.variances[`product_${idx}`])
          ) < parseFloat(this.toleranceLimits.maxToleranceLimit)
        ) {
          this.formValues.temp.variances[`color_${idx}`] = 'amber';
        }

        if (
          Math.abs(
            parseFloat(this.formValues.temp.variances[`product_${idx}`])
          ) >= parseFloat(this.toleranceLimits.maxToleranceLimit)
        ) {
          this.formValues.temp.variances[`color_${idx}`] = 'red';
        }
      } else {
        this.formValues.temp.variances[`color_${idx}`] = 'green';
      }
    } else {
      // if variance is null, set color to white
      this.formValues.temp.variances[`color_${idx}`] = 'white';
    }

    if (this.formValues.temp.variances[`mfm_product_${idx}`] != null) {
      if (
        parseFloat(this.formValues.temp.variances[`mfm_product_${idx}`]) < 0
      ) {
        if (
          Math.abs(
            parseFloat(this.formValues.temp.variances[`mfm_product_${idx}`])
          ) <= parseFloat(this.toleranceLimits.maxToleranceLimit)
        ) {
          this.formValues.temp.variances[`mfm_color_${idx}`] = 'amber';
        }

        if (
          Math.abs(
            parseFloat(this.formValues.temp.variances[`mfm_product_${idx}`])
          ) > parseFloat(this.toleranceLimits.maxToleranceLimit)
        ) {
          this.formValues.temp.variances[`mfm_color_${idx}`] = 'red';
        }
      } else {
        this.formValues.temp.variances[`mfm_color_${idx}`] = 'green';
      }
    } else {
      // if variance is null, set color to white
      this.formValues.temp.variances[`mfm_color_${idx}`] = 'white';
    }
  }

  createDeliveryWithOneProductFromOrdersToBeDeliveriesList() {
    let data = JSON.parse(localStorage.getItem('deliveryFromOrder'));
    localStorage.removeItem('deliveryFromOrder');
    this.formValues.order = data.order;
    this.formValues.surveyor = data.surveyor;
    if (typeof this.formValues.deliveryProducts == 'undefined') {
      this.formValues.deliveryProducts = [];
    }

    this.formValues.deliveryProducts.push({
      orderedProduct: data.product,
      product: data.product,
      confirmedQuantityAmount: data.confirmedQuantityAmount,
      confirmedQuantityUom: data.confirmedQuantityUom,
      productTypeId: data.productType.id,
      orderProductId: data.orderProductId
    });
    // add quality and quantity params for product
    const orderProductId = data.orderProductId;
    const orderProductSpecGroupId = data.specGroup.id;
    const dataForInfo = {
      Payload: {
        Filters: [
          {
            ColumnName: 'OrderProductId',
            Value: orderProductId
          },
          {
            ColumnName: 'SpecGroupId',
            Value: orderProductSpecGroupId
          }
        ]
      }
    };
    this.openedScreenLoaders += 1;
    this.deliveryService
      .loadDeliverySpecParameters(dataForInfo)
      .pipe(
        finalize(() => {
          this.openedScreenLoaders -= 1;
          if (!this.openedScreenLoaders) {
            this.isLoading = false;
          }
        })
      )
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastrService.error(response);
        } else {
          this.formValues.deliveryProducts[0].qualityParameters = response;
          if (this.formValues.deliveryProducts[0].qualityParameters) {
            this.formValues.deliveryProducts[0].qualityParameters.forEach(
              (productParameter, key1) => {
                productParameter.specParameter.name = this.decodeSpecificField(
                  productParameter.specParameter.name
                );
              }
            );
          }
          this.changeDetectorRef.detectChanges();
        }
      });
    this.openedScreenLoaders += 1;
    this.deliveryService
      .loadDeliveryQuantityParameters(dataForInfo)
      .pipe(
        finalize(() => {
          this.openedScreenLoaders -= 1;
          if (!this.openedScreenLoaders) {
            this.isLoading = false;
          }
        })
      )
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastrService.error(response);
        } else {
          this.formValues.deliveryProducts[0].quantityParameters = response;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  createDeliveryWithMultipleProductsFromOrdersToBeDeliveriesList() {
    this.isLoading = true;
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
          Filters: [
            {
              ColumnName: 'OrderProductId',
              Value: orderProductId
            },
            {
              ColumnName: 'SpecGroupId',
              Value: orderProductSpecGroupId
            }
          ]
        }
      };
      this.openedScreenLoaders += 1;
      this.deliveryService
        .loadDeliverySpecParameters(dataForInfo)
        .pipe(
          finalize(() => {
            this.openedScreenLoaders -= 1;
            if (!this.openedScreenLoaders) {
              this.isLoading = false;
            }
          })
        )
        .subscribe((response: any) => {
          if (typeof response == 'string') {
            this.toastrService.error(response);
          } else {
            this.formValues.deliveryProducts[key].qualityParameters = response;
            if (this.formValues.deliveryProducts[key].qualityParameters) {
              this.formValues.deliveryProducts[key].qualityParameters.forEach(
                (productParameter, key1) => {
                  productParameter.specParameter.name = this.decodeSpecificField(
                    productParameter.specParameter.name
                  );
                }
              );
            }
            this.changeDetectorRef.detectChanges();
          }
        });

      this.openedScreenLoaders += 1;
      this.deliveryService
        .loadDeliveryQuantityParameters(dataForInfo)
        .pipe(
          finalize(() => {
            this.openedScreenLoaders -= 1;
            if (!this.openedScreenLoaders) {
              this.isLoading = false;
            }
          })
        )
        .subscribe((response: any) => {
          if (typeof response == 'string') {
            this.toastrService.error(response);
          } else {
            this.formValues.deliveryProducts[key].quantityParameters = response;
            this.changeDetectorRef.detectChanges();
          }
        });
    });
  }

  getDeliveryOrderSummary(orderId: number) {
    this.openedScreenLoaders += 1;
    this.deliveryService
      .loadDeliveryOrderSummary(orderId)
      .pipe(
        finalize(() => {
          this.openedScreenLoaders -= 1;
          if (!this.openedScreenLoaders) {
            this.isLoading = false;
          }
        })
      )
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastrService.error(response);
        } else {
          if (typeof this.formValues.temp == 'undefined') {
            this.formValues.temp = {};
          }
          this.formValues.info.vesselName = response.vesselName;
          this.formValues.info.locationName = response.location;
          this.formValues.info.eta = response.eta;
          this.formValues.info.etb = response.etb;
          this.formValues.temp.deliverysummary = response;
          if (!parseFloat(this.entityId)) {
            // new delivery
            // also set pricing date for delivery to delivery date if null
            this.formValues.deliveryProducts.forEach((deliveryProd, _) => {
              this.formValues.temp.deliverysummary.products.forEach(
                (summaryProd, _) => {
                  if (summaryProd.id == deliveryProd.orderProductId) {
                    if (summaryProd.pricingDate != null) {
                      deliveryProd.pricingDate = summaryProd.pricingDate;
                    } else {
                      deliveryProd.pricingDate = this.formValues.temp.deliverysummary.deliveryDate;
                    }
                    if (summaryProd.convFactorOptions) {
                      deliveryProd.convFactorOptions =
                        summaryProd.convFactorOptions;
                    }
                    if (summaryProd.convFactorMassUom != null) {
                      deliveryProd.convFactorMassUom =
                        summaryProd.convFactorMassUom;
                    }
                    if (summaryProd.convFactorValue != null) {
                      deliveryProd.convFactorValue =
                        summaryProd.convFactorValue;
                    }
                    if (summaryProd.convFactorVolumeUom != null) {
                      deliveryProd.convFactorVolumeUom =
                        summaryProd.convFactorVolumeUom;
                    }
                  }
                }
              );
            });
            if (this.deliverySettings.deliveryDateFlow.internalName == 'Yes') {
              this.formValues.deliveryDate = this.formValues.temp.deliverysummary.deliveryDate;
            }
          }
          if (typeof this.formValues.deliveryStatus != 'undefined') {
            if (this.formValues.deliveryStatus.name) {
              this.statusColorCode = this.getColorCodeFromLabels(
                this.formValues.deliveryStatus,
                this.scheduleDashboardLabelConfiguration
              );
            }
          }

          if (this.formValues?.info?.request) {
            this.titleService.setTitle(
              'Delivery' +
                ' - ' +
                'REQ ' +
                this.formValues.info.request.id +
                ' - ' +
                this.formValues.info.vesselName
            );
          } else {
            this.titleService.setTitle(
              'Delivery' +
                ' - ' +
                this.formValues.order.name +
                ' - ' +
                this.formValues.info.vesselName
            );
          }
          // this.orderProductsByProductType('summaryProducts');
          if (this.formValues.deliveryProducts) {
            this.setProductsPhysicalSupplier();
            this.setQtyUoms();
          }
          this.changeDetectorRef.detectChanges();
          this.eventsSubject.next(this.formValues);
        }
      });
  }

  setProductsPhysicalSupplier() {
    this.formValues.deliveryProducts.forEach((deliveryProd, _) => {
      this.formValues.temp.deliverysummary.products.forEach(
        (summaryProd, key) => {
          if (deliveryProd.orderProductId == summaryProd.id) {
            if (!deliveryProd.physicalSupplier && !this.formValues.id) {
              deliveryProd.physicalSupplier = summaryProd.physicalSupplier;
            }
          }
        }
      );
    });
  }

  setQtyUoms() {
    this.formValues.deliveryProducts.forEach((deliveryProd, _) => {
      this.formValues.temp.deliverysummary.products.forEach(
        (summaryProd, key) => {
          if (summaryProd.id == deliveryProd.orderProductId) {
            if (!deliveryProd.surveyorQuantityUom) {
              deliveryProd.surveyorQuantityUom =
                summaryProd.orderedQuantity.uom;
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
              deliveryProd.vesselFlowMeterQuantityUom =
                summaryProd.orderedQuantity.uom;
            }
            if (!deliveryProd.finalQuantityUom) {
              deliveryProd.finalQuantityUom = summaryProd.orderedQuantity.uom;
            }
          }
        }
      );
    });
  }

  getColorCodeFromLabels(statusObj, labels) {
    for (let i = 0; i < labels.length; i++) {
      if (statusObj) {
        if (
          statusObj.id === labels[i].id &&
          statusObj.transactionTypeId === labels[i].transactionTypeId
        ) {
          return labels[i].code;
        }
      }
    }
  }

  getRelatedDeliveries(orderId: number) {
    this.relatedDeliveries = [];
    this.openedScreenLoaders += 1;
    let duplicate = false;
    this.deliveryService
      .loadDeliveryInfoForOrder(orderId)
      .pipe(
        finalize(() => {
          this.openedScreenLoaders -= 1;
          if (!this.openedScreenLoaders) {
            this.isLoading = false;
          }
        })
      )
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastrService.error(response);
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
    this.formValues.temp.buyerPrecedenceRule =
      response.data.buyerPrecedenceLogicRules[0].precedenceRule;
    this.formValues.temp.sellerPrecedenceRule =
      response.data.sellerPrecedenceLogicRules[0].precedenceRule;

    // final quantity defaultation rules
    // form local finalQuantityRules, include delivery mapping
    this.formValues.temp.finalQtyPrecedenceLogicRules =
      response.data.finalQtyPrecedenceLogicRules;
    this.finalQuantityRules = [];
    this.formValues.temp.finalQtyPrecedenceLogicRules.forEach((rule, _) => {
      let localRule = {
        ord: rule.ord,
        precedenceRule: rule.precedenceRule,
        deliveryMapping: ''
      };
      // agreed
      if (rule.precedenceRule.id == 1) {
        localRule.deliveryMapping = 'agreedQuantity';
      }
      // seller
      if (rule.precedenceRule.id == 2) {
        localRule.deliveryMapping = 'sellerQuantity';
      }
      // buyer
      if (rule.precedenceRule.id == 3) {
        localRule.deliveryMapping = 'buyerQuantity';
      }

      this.finalQuantityRules.push(localRule);
    });
    this.finalQuantityRules = _.orderBy(
      this.finalQuantityRules,
      ['ord'],
      ['asc']
    );

    // buyer and seller is the same across products, se all of them to first product buyer & seller
    this.setBuyerAndSellerAcrossProducts();
    // when create delivery form order, buyer and seller are not set
    // show & hide fields
    this.formValues.temp.isShowQuantityReconciliationSection =
      response.data.isShowQuantityReconciliationSection;
    this.formValues.temp.isShowDeliveryEmailToLabsButton =
      response.data.isShowDeliveryEmailToLabsButton;
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
    if (typeof response.data.minToleranceLimit == 'number') {
      this.toleranceLimits.minToleranceLimit = response.data.minToleranceLimit;
    }
    if (typeof response.data.maxToleranceLimit == 'number') {
      this.toleranceLimits.maxToleranceLimit = response.data.maxToleranceLimit;
    }
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

  ngOnDestroy(): void {}

  public detectChanges(form: any): void {
    this.formValues = form;
    this.changeDetectorRef.detectChanges();
  }

  openRaiseClaimDialog(raiseClaimData: any): void {
    const dialogRef = this.dialog.open(RaiseClaimModalComponent, {
      width: '600px',
      data: {
        availableClaimTypes: raiseClaimData,
        deliveryProducts: this.formValues.deliveryProducts,
        raiseClaimInfo: this.raiseClaimInfo,
        selectedProductIndex: this.selectedProductIndex,
        formValues: this.formValues,
        CM: this.CM
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
    });
  }

  raiseNewClaim() {
    if (
      typeof this.raiseClaimInfo.allSpecParams == 'undefined' ||
      this.raiseClaimInfo.allSpecParams == null
    ) {
      this.toastrService.error('Claim can not be raised for this product!');
      return;
    }
    this.CM.availableClaimTypes = [];
    const claimType = {
      displayName: '',
      claim: {},
      specParams: []
    };
    this.CM.listsCache.ClaimType.forEach((val, ind) => {
      // only allow these 3 types of claim
      if (val.id != 1 && val.id != 3 && val.id != 6 && val.id != 2) {
        return;
      }
      const params = [];
      this.raiseClaimInfo.allSpecParams.forEach((paramVal, paramKey) => {
        if (paramVal.claimTypes) {
          paramVal.claimTypes.forEach((element, key) => {
            if (element.id == val.id) {
              paramVal.disabled = 'false';
              params.push({ ...paramVal });
            }
          });
        }
      });
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
        if (
          this.formValues.feedback.hasLetterOfProtest &&
          this.formValues.feedback.hasLetterOfProtest.id == 1
        ) {
          claimType.disabled = false;
        }
      }
      if (val.name == 'Quantity') {
        const claim1: any = {};
        claim1.claim = { ...val };
        claim1.specParams = [...params];
        claim1.disabled = claimType.disabled;
        claim1.displayName = 'Overstated Density';
        claim1.id = 1;
        claim1.isTypeSelected = false;
        this.CM.availableClaimTypes.push({ ...claim1 });
        const claim2: any = {};
        claim2.claim = { ...val };
        claim2.specParams = [];
        claim2.disabled = false;
        if (typeof this.formValues.temp.variances != 'undefined') {
          if (
            typeof this.formValues.temp.variances[
              `product_${this.CM.selectedProduct}`
            ] == 'undefined' ||
            this.formValues.temp.variances[
              `product_${this.CM.selectedProduct}`
            ] == null
          ) {
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
    this.openRaiseClaimDialog(this.CM.availableClaimTypes);
  }

  public getSelectedProduct(selectedProduct: any): void {
    this.selectedProductIndex = parseFloat(selectedProduct);
    this.CM.selectedProduct = selectedProduct;
    const product = this.formValues.deliveryProducts[this.selectedProductIndex];
    if (product.qualityParameters) {
      this.getClaimInfo([...product.qualityParameters], product.id);
    }
  }

  getClaimInfo(specParams, prodId) {
    this.raiseClaimInfo = {};
    this.raiseClaimInfo.allSpecParams = [...specParams];
    this.raiseClaimInfo.productId = prodId;
  }

  splitDeliveries() {
    const dialogRef = this.dialog.open(SplitDeliveryModalComponent, {
      width: '600px',
      data: { formValues: this.formValues, uoms: this.uoms }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
    });
  }

  save() {
    this.setReconMatchIdBasedOnProductVarianceColor();
    let Isvalid = false;
    let product;
    let hasMandatoryFields = this.validateRequiredFields();
    if (hasMandatoryFields) {
      return;
    }
    this.formValues.deliveryProducts.forEach((deliveryProd, key) => {
      if (deliveryProd != null) {
        deliveryProd.qualityParameters.forEach((qualityParameter, key) => {
          if (
            qualityParameter.isDisplayedInDelivery == true &&
            qualityParameter.isMandatoryInDelivery == true &&
            (qualityParameter.bdnValue == null ||
              qualityParameter.bdnValue == '' ||
              qualityParameter.bdnValue == 0)
          ) {
            Isvalid = true;
            product = deliveryProd.product.name;
            this.buttonClicked = true;
            this.eventsSubject2.next(this.buttonClicked);
          }
        });
      }
    });
    if (Isvalid) {
      this.toastrService.error(
        `Please fill the required ${product} -bdn value...`
      );
      return;
    }
    //setTimeout(() => {
    this.saveDelivery();
    //}, 300);
  }

  saveDelivery() {
    let id = parseFloat(this.entityId);
    if (!parseFloat(this.entityId)) {
      (<any>window).startCreateDeliveryTime = Date.now();
      this.spinner.show();
      this.deliveryService
      .saveDeliveryInfo(this.formValues)
      .pipe(
        finalize(() => {
          this.buttonClicked = false;
          this.eventsSubject2.next(this.buttonClicked);
        })
        )
        .subscribe((result: any) => {
          if (typeof result == 'string') {
            this.spinner.hide();
            this.toastrService.error(result);
          } else {
            this.spinner.hide();
            //this.isLoading = true;
            this.decodeFields();
            this.toastrService.success('Delivery saved successfully');
            this.router
            .navigate([
              KnownPrimaryRoutes.Delivery,
              `${KnownDeliverylRoutes.Delivery}`,
              result,
              KnownDeliverylRoutes.DeliveryDetails
            ])
            .then(() => {
              this.myMonitoringService.logMetric('Create ' + (<any>window).location.href, Date.now() - (<any>window).startCreateDeliveryTime, (<any>window).location.href);        
            });
          }
        });
      } else {
        (<any>window).startUpdateDeliveryTime = Date.now();
      this.spinner.show();
      this.deliveryService
			.updateDeliveryInfo(this.formValues)
			.pipe(
        finalize(() => {
          this.buttonClicked = false;
					this.eventsSubject2.next(this.buttonClicked);
				})
        )
        .subscribe((result: any) => {
					if (typeof result == 'string') {
            this.spinner.hide();
            this.toastrService.error(result);
            this.myMonitoringService.logMetric('Update ' + (<any>window).location.href, Date.now() - (<any>window).startUpdateDeliveryTime, (<any>window).location.href);        
          } else {
            this.toastrService.success('Delivery saved successfully');
            this.deliveryService
						.loadDeliverytDetails(result.id)
						.pipe(
              finalize(() => {
                this.spinner.hide();
                this.myMonitoringService.logMetric('Update ' + (<any>window).location.href, Date.now() - (<any>window).startUpdateDeliveryTime, (<any>window).location.href);        
							})
              )
              .subscribe((data: any) => {
								this.formValues.sampleSources = data.sampleSources;
                this.formValues = _.merge(this.formValues, data);
                if (typeof this.formValues.deliveryStatus != 'undefined') {
                  if (this.formValues.deliveryStatus.name) {
										this.statusColorCode = this.getColorCodeFromLabels(
                      this.formValues.deliveryStatus,
                      this.scheduleDashboardLabelConfiguration
                    );
                  }
                }
                this.setQuantityFormatValues();
                this.decodeFields();
              });
          }
        });
    }
  }

  setReconMatchIdBasedOnProductVarianceColor() {
    this.formValues.deliveryProducts.forEach((product, k) => {
      if (this.formValues.temp.variances) {
        let getColor = this.formValues.temp.variances['color_' + k];
        console.log(getColor);
        if (getColor == 'amber') {
          product.reconMatch = {
            id: 3
          };
        } else if (getColor == 'green') {
          product.reconMatch = {
            id: 1
          };
        } else {
          product.reconMatch = {
            id: 2
          };
        }
      }
    });
  }

  verify() {
    let hasFinalQuantityError = false;
    this.formValues.deliveryProducts.forEach((product, k) => {
      if (!product.finalQuantityAmount) {
        hasFinalQuantityError = true;
        this.toastrService.error(
          `Please make sure that Quantity to be invoiced for ${product.product.name} is computed based on seller/buyer quantity`
        );
      }
    });
    if (hasFinalQuantityError) {
      return;
    }
    let hasMandatoryFields = this.validateRequiredFields();
    if (hasMandatoryFields) {
      return;
    }
    this.spinner.show();
    this.deliveryService
      .verifyDelivery(this.formValues)
      .pipe(
        finalize(() => {
          this.buttonClicked = false;
          this.eventsSubject2.next(this.buttonClicked);
        })
      )
      .subscribe(
        (response: any) => {
          if (response == 'Error, could not verify the delivery') {
            this.toastrService.error('Delivery verification failed!');
            this.spinner.hide();
          } else {
            this.toastrService.success('Verify success!');
            this.deliveryService
              .loadDeliverytDetails(parseFloat(this.entityId))
              .pipe(
                finalize(() => {
                  this.spinner.hide();
                })
              )
              .subscribe((data: any) => {
                this.formValues = _.merge(this.formValues, data);
                this.setQuantityFormatValues();
                this.decodeFields();
                if (typeof this.formValues.deliveryStatus != 'undefined') {
                  if (this.formValues.deliveryStatus.name) {
                    this.statusColorCode = this.getColorCodeFromLabels(
                      this.formValues.deliveryStatus,
                      this.scheduleDashboardLabelConfiguration
                    );
                  }
                }
              });
          }
        },
        error => {
          this.spinner.hide();
          console.error(error);
        }
      );
  }

  revertVerify() {
    let hasMandatoryFields = this.validateRequiredFields();
    if (hasMandatoryFields) {
      return;
    }
    let payload = {
      DeliveryId: this.formValues.id
    };
    this.spinner.show();
    this.deliveryService
      .revertVerifyDelivery(payload)
      .pipe(
        finalize(() => {
          this.buttonClicked = false;
          this.eventsSubject2.next(this.buttonClicked);
        })
      )
      .subscribe(
        (response: any) => {
          if (response == 'Error, could not revert verify the delivery') {
            this.spinner.hide();
            this.toastrService.error('Could not get Revert Verify!');
          } else {
            this.toastrService.success('Revert Verify success!');
            this.deliveryService
              .loadDeliverytDetails(parseFloat(this.entityId))
              .pipe(
                finalize(() => {
                  this.spinner.hide();
                })
              )
              .subscribe((data: any) => {
                this.formValues = _.merge(this.formValues, data);
                this.setQuantityFormatValues();
                this.decodeFields();
                if (typeof this.formValues.deliveryStatus != 'undefined') {
                  if (this.formValues.deliveryStatus.name) {
                    this.statusColorCode = this.getColorCodeFromLabels(
                      this.formValues.deliveryStatus,
                      this.scheduleDashboardLabelConfiguration
                    );
                  }
                }
              });
          }
        },
        error => {
          this.spinner.hide();
          console.error(error);
        }
      );
  }

  validateRequiredFields() {
    let requiredFields = 'Please fill in required fields: ';
    if (!this.formValues.deliveryDate) {
      requiredFields += 'Delivery Date';
    }
    if (!this.formValues.bdnDate) {
      requiredFields +=
        (requiredFields.indexOf('Delivery') ? ',' : '') + ' Bdn Date. ';
    }
    if (this.formValues.deliveryProducts) {
      for (let i = 0; i < this.formValues.deliveryProducts.length; i++) {
        let productFields = '';
        if (!this.formValues.deliveryProducts[i].bdnQuantityAmount) {
          productFields = ' BDN Quantity';
        }
        if (
          this.formValues.deliveryProducts[i].deliveredVolume &&
          !this.formValues.deliveryProducts[i].deliveredVolumeUom
        ) {
          productFields +=
            (productFields === '' ? '' : ',') + ' Delivered Quantity Uom';
        }
        if (productFields != '') {
          requiredFields +=
            this.formValues.deliveryProducts[i].product.name +
            (i + 1) +
            '-' +
            productFields +
            '.\n';
        }
      }
    }

    this.buttonClicked = true;
    this.eventsSubject2.next(this.buttonClicked);
    if (requiredFields != 'Please fill in required fields: ') {
      this.toastrService.error(requiredFields);
      return true;
    }
    return false;
  }

  getOrderNumberChanged(value) {
    this.eventsSubject4.next(value);
  }

  setQuantityFormatValues() {
    if (this.formValues.deliveryProducts) {
      this.formValues.deliveryProducts.forEach((product, key) => {
        if (product.confirmedQuantityAmount) {
          product.confirmedQuantityAmount = this.quantityFormatValue(
            product.confirmedQuantityAmount
          );
        }
        if (product.bdnQuantityAmount) {
          product.bdnQuantityAmount = this.quantityFormatValue(
            product.bdnQuantityAmount
          );
        }
        if (product.vesselQuantityAmount) {
          product.vesselQuantityAmount = this.quantityFormatValue(
            product.vesselQuantityAmount
          );
        }
        if (product.surveyorQuantityAmount) {
          product.surveyorQuantityAmount = this.quantityFormatValue(
            product.surveyorQuantityAmount
          );
        }
        if (product.vesselFlowMeterQuantityAmount) {
          product.vesselFlowMeterQuantityAmount = this.quantityFormatValue(
            product.vesselFlowMeterQuantityAmount
          );
        }
        if (product.finalQuantityAmount) {
          product.finalQuantityAmount = this.quantityFormatValue(
            product.finalQuantityAmount
          );
        }
        if (product.agreedQuantityAmount) {
          product.agreedQuantityAmount = this.quantityFormatValue(
            product.agreedQuantityAmount
          );
        }
        if (product.quantityParameters) {
          product.quantityParameters.forEach((productQuantity, key2) => {
            if (productQuantity.bdn) {
              productQuantity.bdn = this.quantityFormatValue(
                productQuantity.bdn
              );
            }
          });
        }
        if (product.quantityHeader) {
          if (product.quantityHeader.ccaiDelivered) {
            product.quantityHeader.ccaiDelivered = this.quantityFormatValue(
              product.quantityHeader.ccaiDelivered
            );
          }
        }
      });
    }
  }

  quantityFormatValue(value) {
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    let number = parseFloat(plainNumber);
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

  decodeFields() {
    if (this.formValues.deliveryProducts.length) {
      this.formValues.deliveryProducts.forEach((product, key) => {
        if (product.qualityHeader) {
          if (product.qualityHeader.comments) {
            product.qualityHeader.comments = this.decodeSpecificField(
              product.qualityHeader.comments
            );
          }
        }
        if (product.quantityHeader) {
          if (product.quantityHeader.comments) {
            product.quantityHeader.comments = this.decodeSpecificField(
              product.quantityHeader.comments
            );
          }
        }
        if (product.qualityParameters) {
          product.qualityParameters.forEach((productParameter, key1) => {
            productParameter.specParameter.name = this.decodeSpecificField(
              productParameter.specParameter.name
            );
          });
        }
      });
    }
  }

  decodeSpecificField(modelValue) {
    let decode = function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
    };
    return decode(_.unescape(modelValue));
  }

  notesUpdate() {
    console.log('Mouse out notes section');
    let findNotesWithIdZero = _.filter(this.formValues.deliveryNotes, function(
      object
    ) {
      return object.id == 0;
    });

    if (findNotesWithIdZero && findNotesWithIdZero.length) {
      this.autoSave();
    }
  }

  autoSave() {
    if (parseFloat(this.entityId)) {
      let payload = {
        DeliveryId: parseFloat(this.entityId),
        DeliveryNotes: this.formValues.deliveryNotes
      };
      this.deliveryService
        .notesAutoSave(payload)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          })
        )
        .subscribe((result: any) => {
          if (typeof result == 'string') {
            this.spinner.hide();
            this.toastrService.error(result);
          } else {
            console.log(result);
            this.formValues.deliveryNotes = _.cloneDeep(result);
            this.changeDetectorRef.detectChanges();
          }
        });
    }
  }

  deleteDelivery() {
    const dialogRef = this.dialog.open(RemoveDeliveryModalComponent, {
      width: '600px',
      data: {
        deliveryId: this.formValues.id,
        relatedDeliveries: this.relatedDeliveries
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
