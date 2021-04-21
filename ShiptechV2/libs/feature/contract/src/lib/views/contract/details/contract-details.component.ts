import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { EntityStatusService } from '@shiptech/core/ui/components/entity-status/entity-status.service';
import { BehaviorSubject, empty, Observable, Subject } from 'rxjs';
import { catchError, filter, finalize, map, scan, skip, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { DecimalPipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReconStatusLookup } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import { StatusLookup } from '@shiptech/core/lookups/known-lookups/status/status-lookup.service';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MyMonitoringService } from '../../service/logging.service';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { BdnInformationApiService } from '@shiptech/core/delivery-api/bdn-information/bdn-information-api.service';
import { IDeliveryTenantSettings } from '../../../core/settings/delivery-tenant-settings';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import _ from 'lodash';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { NavBarApiService } from '@shiptech/core/services/navbar/navbar-api.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { throws } from 'assert';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ContractService } from '../../../services/contract.service';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { KnownContractRoutes } from '../../../known-contract.routes';
import { ExtendContractModalComponent } from './components/extend-contract-modal/extend-contract-modal.component';
import { Title } from '@angular/platform-browser';

interface DialogData {
  email: string;
}


@Component({
  selector: 'shiptech-port-call',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.scss'],
  providers: [ConfirmationService, DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractDetailsComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject();

  private quantityPrecision: number;

  entityId: number;
  entityName: string;
  isLoading: boolean;
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
  email: string;
  selectedProductIndex: any = 0;
  raiseClaimInfo: any;
  CM: any = {
    'listsCache': {
      'ClaimType': []
    },
    'selectedProduct': 0
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
  tenantConfiguration: any;
  staticLists: any;
  companyList: any;
  sellerList: any;
  agreementTypeList: any;
  paymentTermList: any;
  incotermList: any;
  applyToList: any;
  contractualQuantityOptionList: any;
  uomList: any;
  productMasterList: any;
  locationMasterList: any;
  generalTenantSettings: IGeneralTenantSettings;
  uomMassList: any;
  uomVolumeList: any;
  contractConversionFactorOptions: any;
  specParameterList: any;
  formulaTypeList: any;
  systemInstumentList: any;
  marketPriceList: any;
  formulaPlusMinusList: any;
  formulaFlatPercentageList: any;
  currencyList: any;
  formulaOperationList: any;
  marketPriceTypeList: any;
  formulaFunctionList: any;
  pricingScheduleList: any;
  holidayRuleList: any;
  pricingSchedulePeriodList: any;
  eventList: any;
  dayOfWeekList: any;
  businessCalendarList: any;
  formulaEventIncludeList: any;
  quantityTypeList: any;
  productList: any;
  locationList: any;
  additionalCostList: any;
  costTypeList: any;
  appId: string;
  screenId: string;
  selectedTabIndex: number;

  constructor(
    private formBuilder: FormBuilder,
    private entityStatus: EntityStatusService,
    private router: Router,
    private location: Location,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService,
    private reconStatusLookups: ReconStatusLookup,
    private tenantSettingsService: TenantSettingsService,
    private statusLookup: StatusLookup,
    private myMonitoringService: MyMonitoringService,
    public bdnInformationService: BdnInformationApiService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private navBarService: NavBarApiService,
    @Inject(DecimalPipe) private _decimalPipe,
    private tenantService: TenantFormattingService,
    private loadingBar: LoadingBarService,
    private titleService: Title
    ) {
    this.formValues = {
      name: null,
      company: null,
      evergreen: false,
      seller: null,
      agreementType: null,
      paymentTerm: null,
      incoterm: null,
      status: null,
      summary: {},
      createdOn: null,
      products: []

    };
    this.entityName = 'Contract';
    this.appId = 'contracts';
    this.screenId = 'contract';
    this.generalTenantSettings = tenantSettingsService.getGeneralTenantSettings();
    this.quantityPrecision = this.generalTenantSettings.defaultValues.quantityPrecision;
    this.adminConfiguration = tenantSettingsService.getModuleTenantSettings<
          IGeneralTenantSettings
        >(TenantSettingsModuleName.General);
    this.quantityFormat = '1.' + this.tenantService.quantityPrecision + '-' + this.tenantService.quantityPrecision;
    console.log(this.deliverySettings);
    //this.loadingBar.start();
  }


  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this._destroy$)).subscribe(params => {
      this.entityId = parseFloat(params.contractId);
    });
    this.route.data.subscribe(data => {
      if (localStorage.getItem(`${this.appId + this.screenId }_copy`)) {
        console.log('copy contract');
        this.isLoading = true;
        this.setFormValuesAfterCopyContract();
      }
      console.log(data);
      this.tenantConfiguration = data.tenantConfiguration;
      this.scheduleDashboardLabelConfiguration = data.scheduleDashboardLabelConfiguration;
      console.log(this.scheduleDashboardLabelConfiguration);
      if (data.contract) {
        this.formValues = data.contract;
        if (this.entityId) {
          this.titleService.setTitle('Contract' + ' - ' + this.formValues.name);
        } 
        if (typeof this.formValues.status != 'undefined') {
          if (this.formValues.status.name) {
              this.statusColorCode = this.getColorCodeFromLabels(this.formValues.status, this.scheduleDashboardLabelConfiguration);
          }
        }
      } else {
        if (!this.formValues.applyTo) {
        	this.formValues.applyTo = { id:3 };
        }
      }


      this.staticLists = data.staticLists;
      this.locationMasterList = data.locationList;
      this.productMasterList = data.productList;
      this.agreementTypeList = data.agreementTypeList;
      this.uomList = this.setListFromStaticLists('Uom');
      this.companyList = this.setListFromStaticLists('Company');
      this.sellerList = this.setListFromStaticLists('Seller');
      this.paymentTermList = this.setListFromStaticLists('PaymentTerm');
      this.incotermList = this.setListFromStaticLists('Incoterm');
      this.applyToList = this.setListFromStaticLists('ApplyTo');
      this.contractualQuantityOptionList = this.setListFromStaticLists('ContractualQuantityOption');
      this.uomMassList = this.setListFromStaticLists('UomMass');
      this.uomVolumeList = this.setListFromStaticLists('UomVolume');
      this.contractConversionFactorOptions = this.setListFromStaticLists('ContractConversionFactorOptions');
      this.specParameterList = this.setListFromStaticLists('SpecParameter');
      this.formulaTypeList = this.setListFromStaticLists('FormulaType');
      this.systemInstumentList = this.setListFromStaticLists('SystemInstrument');
      this.marketPriceList = this.setListFromStaticLists('MarketPriceType');
      this.formulaPlusMinusList = this.setListFromStaticLists('FormulaPlusMinus');
      this.formulaFlatPercentageList = this.setListFromStaticLists('FormulaFlatPercentage');
      this.currencyList = this.setListFromStaticLists('Currency');
      this.formulaOperationList = this.setListFromStaticLists('FormulaOperation');
      this.formulaFunctionList = this.setListFromStaticLists('FormulaFunction');
      this.marketPriceTypeList = this.setListFromStaticLists('MarketPriceType');
      this.pricingScheduleList = this.setListFromStaticLists('PricingSchedule');
      this.holidayRuleList = this.setListFromStaticLists('HolidayRule');
      this.pricingSchedulePeriodList = this.setListFromStaticLists('PricingSchedulePeriod');
      this.eventList = this.setListFromStaticLists('Event');
      this.dayOfWeekList = this.setListFromStaticLists('DayOfWeek');
      this.businessCalendarList = this.setListFromStaticLists('BusinessCalendar');
      this.formulaEventIncludeList = this.setListFromStaticLists('FormulaEventInclude');
      this.quantityTypeList = this.setListFromStaticLists('QuantityType');
      this.productList = this.setListFromStaticLists('Product');
      this.locationList = this.setListFromStaticLists('Location');
      this.additionalCostList = this.setListFromStaticLists('AdditionalCost');
      this.costTypeList = this.setListFromStaticLists('CostType');

      var defaultUom = this.generalTenantSettings.tenantFormats.uom;
      var defaultQuantityType = this.contractualQuantityOptionList[0];
      let firstEntry = {
          contractualQuantityOption: defaultQuantityType,
          minContractQuantity: null,
          maxContractQuantity: null,
          convertedMaxContractQuantity: null,
          uom: defaultUom,
          tolerance: null,
          id: 0
      };
      if (typeof this.formValues.details == 'undefined') {
        this.formValues.details = [ firstEntry ];
      }

      
      console.log(this.staticLists);
    });
  }

  setListFromStaticLists(name) {
    let findList = _.find(this.staticLists, function(object) {
      return object.name == name;
    });
    if (findList != -1) {
      return findList?.items;
    }
  }


  getColorCodeFromLabels(statusObj, labels) {
    for(let i = 0; i < labels.length; i++) {
      if (statusObj) {
        if(statusObj.id === labels[i].id && statusObj.transactionTypeId === labels[i].transactionTypeId) {
            return labels[i].code;
        }
      }
    }
  }

  setFormValuesAfterCopyContract() {
    var contractId = localStorage.getItem(`${this.appId + this.screenId }_copy`);
    localStorage.removeItem(`${this.appId + this.screenId }_copy`);
    console.log("id", contractId);
    this.contractService
    .loadContractDetails(parseFloat(contractId))
    .pipe(
      finalize(() => {
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      })
    )
    .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.toastr.error(result);
        } else {
          console.log('Copy field');
          console.log(result);
          this.formValues = _.cloneDeep(result);
          this.formValues.lastModifiedBy = null;
          this.formValues.lastModifiedByUser = null;
          this.formValues.lastModifiedOn = null;
          this.formValues.id = 0;
          if (typeof this.formValues.name != 'undefined') {
            this.formValues.name = null;
          }
          if (this.formValues.conversionFactor) {
            this.formValues.conversionFactor.id = 0;
          }
          this.formValues.status = null;
          this.formValues.details.forEach((v, k) => {
            v.id = 0;
          });
          this.formValues.products.forEach((v, k) => {
            v.id = 0;
            v.details.forEach((v1, k1) => {
              v1.id = 0;
            });
            v.additionalCosts.forEach((v1, k1) => {
              v1.id = 0;
            });
            v.conversionFactors.forEach((v1, k1) => {
              v1.id = 0;
              if (v1.contractProduct) {
                v1.contractProduct.id = 0;
              }
              if (v1.contractProductId) {
                v1.contractProductId = 0;
              }
            });
            v.formula = null;
            v.mtmFormula = null;
            v.price = null;
            v.mtmPrice = null;
          });
          this.formValues.summary.plannedQuantity = 0;
          this.formValues.summary.utilizedQuantity = 0;
          this.formValues.summary.availableQuantity = this.formValues.summary.contractedQuantity;
          this.formValues.summary.copiedContract = true;
          this.formValues.createdBy = null;
          this.formValues.hasInvoicedOrder = false;
          console.log(this.formValues);
          this.changeDetectorRef.detectChanges();
          this.toastr.info('Formula and MTM Formula was reset for all products');
          this.toastr.success('Entity copied');
        }
     });
  }


  convertDecimalSeparatorStringToNumber(number) {
    var numberToReturn = number;
    var decimalSeparator, thousandsSeparator;
    if (typeof number == 'string') {
        if (number.indexOf(',') != -1 && number.indexOf('.') != -1) {
          if (number.indexOf(',') > number.indexOf('.')) {
            decimalSeparator = ',';
            thousandsSeparator = '.';
          } else {
            thousandsSeparator = ',';
            decimalSeparator = '.';
          }
          numberToReturn = parseFloat(number.split(decimalSeparator)[0].replace(new RegExp(thousandsSeparator, 'g'), '')) + parseFloat(`0.${number.split(decimalSeparator)[1]}`);
        } else {
          numberToReturn = parseFloat(number);
        }
    }
    if (isNaN(numberToReturn)) {
      numberToReturn = 0;
    }
    return parseFloat(numberToReturn);
  }

  saveContract() {
    let hasTotalContractualQuantity = false;
    if (!this.formValues.products) {
      this.toastr.error('You must add at least one product in the contract');
      return;
    }
    // check for product location to be obj
    let notValidLocation = false;
    this.formValues.products.forEach((val, key) => {
      if(typeof val.location != 'object') {
        var keyno = key + 1;
        this.toastr.error(`Please select a valid location for product ${ keyno }.`);
        notValidLocation = true;
      } else if (val.isFormula == true && typeof val.formula != 'object') {
        var keyno = key + 1;
        this.toastr.error(`Please select a valid Formula for Product ${ keyno }.`);
        notValidLocation = true;
      }
    });

    if(notValidLocation) {
      return;
    }
    if (this.formValues.products.length == 0) {
      this.toastr.error('You must add at least one product in the contract');
      return;
    }

    let minQuyanityValidationError = false;
    this.formValues.details.forEach((v, k) => {
      if (typeof v != 'undefined') {
        if(typeof v.contractualQuantityOption != 'undefined') {
          if (v.contractualQuantityOption.name == 'TotalContractualQuantity') {
            hasTotalContractualQuantity = true;
          }
        }
        if (v.minContractQuantity && v.maxContractQuantity) {
          if (this.convertDecimalSeparatorStringToNumber(v.minContractQuantity) > this.convertDecimalSeparatorStringToNumber(v.maxContractQuantity)) {
            minQuyanityValidationError = true;
          }
        }
      }
    });

    if (minQuyanityValidationError) {
      this.toastr.error('Min Quantity must be smaller that Max Quantity ');
      return;
    }
    if (!hasTotalContractualQuantity) {
      this.toastr.error('TotalContractualQuantity option is required in Contractual Quantity section');
      return;
    }

    let message = 'Please fill in required fields:';
    if (!this.formValues.name) {
      message += ' Name,';
    }
    if (!this.formValues.seller || (this.formValues.seller && !this.formValues.seller.name)) {
      message += ' Seller,';
    }
    if (!this.formValues.company) {
      message += ' Company,';
    }
    if (!this.formValues.agreementType) {
      message += ' Agreement Type,';
    }
    if (!this.formValues.incoterm) {
      message += ' Delivery Term,';
    }
    if (!this.formValues.validFrom) {
      message += ' Start Date,';
    }
    if (!this.formValues.validTo) {
      message += ' End Date,';
    }

    this.buttonClicked = true;
    this.eventsSubject2.next(this.buttonClicked);

    if (message != 'Please fill in required fields:') {
      this.toastr.error(message);
      return;
    }
    let additionalCost = [];
    let additionalCostRequired = [];
    for (let i = 0; i < this.formValues.products.length; i++) {
        for (let j = 0; j < this.formValues.products[i].additionalCosts.length; j++) {
            if (!this.formValues.products[i].additionalCosts[j].isDeleted) {
                let amount = parseInt(this.formValues.products[i].additionalCosts[j].amount);
                if (amount < 0 && !this.formValues.products[i].additionalCosts[j].isAllowingNegativeAmmount) {
                    additionalCost.push(this.formValues.products[i].additionalCosts[j].additionalCost.name);
                }
                if (!this.formValues.products[i].additionalCosts[j].additionalCost) {
                  additionalCostRequired.push('Item Name');
                } 
                if (!this.formValues.products[i].additionalCosts[j].costType) {
                  additionalCostRequired.push('Type');
                } 
                if (!this.formValues.products[i].additionalCosts[j].amount) {
                  additionalCostRequired.push('Amount');
                }
            }
        }
    }

    additionalCostRequired =_.uniq(additionalCostRequired);
    let additionalCostRequiredString = '';
    for (let i = 0; i < additionalCostRequired.length; i++) {
      additionalCostRequiredString += additionalCostRequired[i] + ',';
    }
    if (additionalCostRequiredString[additionalCostRequiredString.length - 1] == ',') {
      additionalCostRequiredString =  additionalCostRequiredString.substring(0,  additionalCostRequiredString.length - 1);
    }

    if (additionalCostRequiredString != ''  && additionalCostRequired.length > 1) {
      this.toastr.error('Please fill in required fields: ' + additionalCostRequiredString);
      return;
    }
    if (additionalCostRequiredString != '' && additionalCostRequired.length == 1) {
      this.toastr.error('Please fill in required fields: ' + additionalCostRequiredString);
      return;
    }

    additionalCost = _.uniq(additionalCost);
    let additionalCostString = '';
    for (let i = 0; i < additionalCost.length; i++) {
      additionalCostString += additionalCost[i] + ',';
    }
    if (additionalCostString[additionalCostString.length - 1] == ',') {
      additionalCostString =  additionalCostString.substring(0,  additionalCostString.length - 1);
    }
    if (additionalCostString != ''  && additionalCost.length > 1) {
      this.toastr.warning('The additional costs ' + additionalCostString + ' does not allow negative amounts!');
      return;
    }
    if (additionalCostString != '' && additionalCost.length == 1) {
      this.toastr.warning('The additional cost ' + additionalCostString + ' does not allow negative amounts!');
      return;
    }

    let id = this.entityId;
    if (!id) {
      this.spinner.show();
      this.contractService
      .createContract(this.formValues)
      .pipe(
          finalize(() => {
            this.buttonClicked = false;
            this.eventsSubject2.next(this.buttonClicked);
          })
      )
      .subscribe((result: any) => {
          if (typeof result == 'string') {
            this.spinner.hide();
            this.toastr.error(result);
          } else {
            this.spinner.hide();
            this.isLoading = true;
            this.toastr.success('Contract saved successfully');
            this.router
            .navigate([
              KnownPrimaryRoutes.Contract,
              `${KnownPrimaryRoutes.Contract}`,
              result.id,
              KnownContractRoutes.ContractDetails
            ])
            .then(() => {
              this.isLoading = false;
            });
          }
      });
    } else {
      this.spinner.show();
      this.contractService
      .updateContract(this.formValues)
      .pipe(
          finalize(() => {
            this.buttonClicked = false;
            this.eventsSubject2.next(this.buttonClicked);
          })
      )
      .subscribe((result: any) => {
          if (typeof result == 'string') {
            this.spinner.hide();
            this.toastr.error(result);
          } else {
            this.toastr.success('Contract saved successfully');
            this.contractService
              .loadContractDetails(this.formValues.id)
              .pipe(
                finalize(() => {
                  this.spinner.hide();
                })
              )
              .subscribe((data: any) => {
                this.formValues = _.cloneDeep(data);
                this.eventsSubject3.next(0);
                if (typeof this.formValues.status != 'undefined') {
                  if (this.formValues.status.name) {
                    this.statusColorCode = this.getColorCodeFromLabels(this.formValues.status, this.scheduleDashboardLabelConfiguration);
                  }
                }
                this.changeDetectorRef.detectChanges();
              });
          }
       });
    }
  }

  confirmContract() {
    this.buttonClicked = true;
    this.eventsSubject2.next(this.buttonClicked);
    this.spinner.show();
    this.contractService
    .confirmContract(this.formValues)
    .pipe(
        finalize(() => {
          this.buttonClicked = false;
          this.eventsSubject2.next(this.buttonClicked);
        })
    )
    .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.spinner.hide();
          this.toastr.error(result);
        } else {
          this.toastr.success('Contract confirmed!');
          this.contractService
            .loadContractDetails(this.formValues.id)
            .pipe(
              finalize(() => {
                this.spinner.hide();
              })
            )
            .subscribe((data: any) => {
              this.formValues = _.cloneDeep(data);
              if (typeof this.formValues.status != 'undefined') {
                if (this.formValues.status.name) {
                  this.statusColorCode = this.getColorCodeFromLabels(this.formValues.status, this.scheduleDashboardLabelConfiguration);
                }
              }
            });
        }
    });
  }

  undoContract() {
    this.spinner.show();
    this.contractService
    .undoConfirmContract(this.formValues)
    .pipe(
        finalize(() => {

        })
    )
    .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.spinner.hide();
          this.toastr.error(result);
        } else {
          this.toastr.success('Contract unconfirmed!');
          this.contractService
            .loadContractDetails(this.formValues.id)
            .pipe(
              finalize(() => {
                this.spinner.hide();
              })
            )
            .subscribe((data: any) => {
              this.formValues = _.cloneDeep(data);
              if (typeof this.formValues.status != 'undefined') {
                if (this.formValues.status.name) {
                  this.statusColorCode = this.getColorCodeFromLabels(this.formValues.status, this.scheduleDashboardLabelConfiguration);
                }
              }
            });
        }
     });
  }

  deleteContract() {
    this.spinner.show();
    this.contractService
    .deleteContract(this.formValues)
    .pipe(
        finalize(() => {

        })
    )
    .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.spinner.hide();
          this.toastr.error(result);
        } else {
          this.toastr.success('Contract deleted!');
          this.contractService
            .loadContractDetails(this.formValues.id)
            .pipe(
              finalize(() => {
                this.spinner.hide();
              })
            )
            .subscribe((data: any) => {
              this.formValues = _.cloneDeep(data);
              if (typeof this.formValues.status != 'undefined') {
                if (this.formValues.status.name) {
                  this.statusColorCode = this.getColorCodeFromLabels(this.formValues.status, this.scheduleDashboardLabelConfiguration);
                }
              }
            });
        }
     });
  }

  extendContract() {
    const dialogRef = this.dialog.open(ExtendContractModalComponent, {
      width: '600px',
      data:  { formValues: this.formValues}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("close extend pop-up");
        this.formValues = result;
      }
    });
  }

  copyContract() {
    localStorage.setItem(`${this.appId + this.screenId }_copy`, this.entityId.toString());
    this.router
      .navigate([
        KnownPrimaryRoutes.Contract,
        `${KnownContractRoutes.Contract}`,
        0,
        KnownContractRoutes.ContractDetails
      ])
      .then(() => {
        console.log("copy contract");
      });

  }

  ngOnDestroy(): void {

  }

  
}
