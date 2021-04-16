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

  constructor(
    private formBuilder: FormBuilder,
    private entityStatus: EntityStatusService,
    private router: Router,
    private location: Location,
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
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private navBarService: NavBarApiService,
    @Inject(DecimalPipe) private _decimalPipe,
    private tenantService: TenantFormattingService,
    private loadingBar: LoadingBarService
    ) {
    this.formValues = {
      'name': '',
      'seller': '',
      'company': '',
      'surveyorName': '',
      'bdnInformation': '',
      'orderNumber': '',
      'deliveryDate': '',
      'order': null,
      'barge': null,
      'bdnDate': '',
      'berthingTime': '',
      'bargeAlongside': '',
      'deliveryStatus': '',
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
    this.generalTenantSettings = tenantSettingsService.getGeneralTenantSettings();
    this.quantityPrecision = this.generalTenantSettings.defaultValues.quantityPrecision;
    this.deliverySettings = tenantSettingsService.getModuleTenantSettings<
            IDeliveryTenantSettings
          >(TenantSettingsModuleName.Delivery);
    this.adminConfiguration = tenantSettingsService.getModuleTenantSettings<
          IGeneralTenantSettings
        >(TenantSettingsModuleName.General);
    this.quantityFormat = '1.' + this.tenantService.quantityPrecision + '-' + this.tenantService.quantityPrecision;
    console.log(this.deliverySettings);
    //this.loadingBar.start();
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this._destroy$)).subscribe(params => {
      this.entityId = parseFloat(params.contractId);
    });
    this.route.data.subscribe(data => {
        console.log(data);
      this.tenantConfiguration = data.tenantConfiguration;
      if (data.contract) {
        this.formValues = data.contract;
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

  
}
