import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  HostListener,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  Inject,
  ChangeDetectorRef,
  Injectable,
  InjectionToken,
  Optional,
  ViewChildren
} from '@angular/core';
import { Select } from '@ngxs/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { finalize, map, scan, startWith, timeout } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BdnInformationApiService } from '@shiptech/core/services/delivery-api/bdn-information/bdn-information-api.service';
import { TransactionForSearch } from 'libs/feature/delivery/src/lib/services/api/request-response/bdn-information';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { IDisplayLookupDto, IOrderLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { knowMastersAutocompleteHeaderName, knownMastersAutocomplete } from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { OrderListGridViewModel } from '@shiptech/core/ui/components/delivery/view-model/order-list-grid-view-model.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { DeliveryAutocompleteComponent } from '../delivery-autocomplete/delivery-autocomplete.component';
import { AppConfig } from '@shiptech/core/config/app-config';
import { HttpClient } from '@angular/common/http';
import { IVesselMastersApi, VESSEL_MASTERS_API_SERVICE } from '@shiptech/core/services/masters-api/vessel-masters-api.service.interface';
import { DeliveryInfoForOrder, IDeliveryInfoForOrderDto, OrderInfoDetails } from 'libs/feature/delivery/src/lib/services/api/dto/delivery-details.dto';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import moment, { Moment, MomentFormatSpecification, MomentInput } from 'moment';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { IDeliveryTenantSettings } from 'libs/feature/delivery/src/lib/core/settings/delivery-tenant-settings';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import _ from 'lodash';
import { NgxMatDateAdapter, NgxMatDateFormats, NgxMatNativeDateAdapter, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ContractService } from 'libs/feature/contract/src/lib/services/contract.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { DecimalPipe, KeyValue } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { MatMenuTrigger } from '@angular/material/menu';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ProductSpecGroupModalComponent } from '../product-spec-group-modal/product-spec-group-modal.component';
import { OVERLAY_KEYBOARD_DISPATCHER_PROVIDER_FACTORY } from '@angular/cdk/overlay/dispatchers/overlay-keyboard-dispatcher';
import { MatCheckboxChange } from '@angular/material/checkbox';



@Component({
  selector: 'shiptech-event-based-continuous',
  templateUrl: './event-based-continuous.component.html',
  styleUrls: ['./event-based-continuous.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [OrderListGridViewModel, 
              DialogService, 
              ConfirmationService]
})
export class EventBasedContinuous extends DeliveryAutocompleteComponent
  implements OnInit{
  switchTheme; //false-Light Theme, true- Dark Theme
  _entityId: number;
  _entityName: string;
  formValues: any;
  formulaFlatPercentageList: any;
  systemInstumentList: any;
  formulaPlusMinusList: any;
  marketPriceList: any;
  currencyList: any;
  formulaOperationList: any;
  formulaFunctionList: any;
  marketPriceTypeList: any;
  pricingSchedulePeriodList: any;
  eventList: any;
  dayOfWeekList: any;
  holidayRuleList: any;
  isValidFromDateInvalid: boolean;
 


  get entityId(): number {
    return this._entityId;
  }

  get entityName(): string {
    return this._entityName;
  }

  @Input() set entityId(value: number) {
    this._entityId = value;
    this.gridViewModel.entityId = this.entityId;
  }

  @Input() set entityName(value: string) {
    this._entityName = value;
    this.gridViewModel.entityName = this.entityName;
  }
     
  @Input() vesselId: number;


  @Input('model') set _setFormValues(formValues) { 
    if (!formValues) {
      return;
    } 
    this.formValues = formValues;
  }

  @Input('formulaFlatPercentageList') set _setFormulaFlatPercentageList(formulaFlatPercentageList) { 
    if (!formulaFlatPercentageList) {
      return;
    } 
    this.formulaFlatPercentageList = formulaFlatPercentageList;
  }

  @Input('systemInstumentList') set _setSystemInstumentList(systemInstumentList) { 
    if (!systemInstumentList) {
      return;
    } 
    this.systemInstumentList = systemInstumentList;
  }

  @Input('formulaPlusMinusList') set _setFormulaPlusMinusList(formulaPlusMinusList) { 
    if (!formulaPlusMinusList) {
      return;
    } 
    this.formulaPlusMinusList = formulaPlusMinusList;
  }

  @Input('marketPriceList') set _setMarketPriceList(marketPriceList) { 
    if (!marketPriceList) {
      return;
    } 
    this.marketPriceList = marketPriceList;
  }

  
  @Input('currencyList') set _setCurrencyList(currencyList) { 
    if (!currencyList) {
      return;
    } 
    this.currencyList = currencyList;
  }


  @Input('formulaOperationList') set _setFormulaOperationList(formulaOperationList) { 
    if (!formulaOperationList) {
      return;
    } 
    this.formulaOperationList = formulaOperationList;
  }

  
  @Input('formulaFunctionList') set _setFormulaFunctionList(formulaFunctionList) { 
    if (!formulaFunctionList) {
      return;
    } 
    this.formulaFunctionList = formulaFunctionList;
  }

  @Input('marketPriceTypeList') set _setMarketPriceTypeList(marketPriceTypeList) { 
    if (!marketPriceTypeList) {
      return;
    } 
    this.marketPriceTypeList = marketPriceTypeList;
  }
  

  @Input('pricingSchedulePeriodList') set _setPricingSchedulePeriodList(pricingSchedulePeriodList) { 
    if (!pricingSchedulePeriodList) {
      return;
    } 
    this.pricingSchedulePeriodList = pricingSchedulePeriodList;
  }

  @Input('eventList') set _setEventList(eventList) { 
    if (!eventList) {
      return;
    } 
    this.eventList = eventList;
  }

  
  @Input('dayOfWeekList') set _setDayOfWeekList(dayOfWeekList) { 
    if (!dayOfWeekList) {
      return;
    } 
    this.dayOfWeekList = dayOfWeekList;
  }

  @Input('holidayRuleList') set _setHolidayRuleList(holidayRuleList) { 
    if (!holidayRuleList) {
      return;
    } 
    this.holidayRuleList = holidayRuleList;
  }



  @Input() events: Observable<void>;


  expandPricingDayCalendar: any = false;
  expandEventDayCalendar: any = false;



  constructor(
    public gridViewModel: OrderListGridViewModel,
    @Inject(VESSEL_MASTERS_API_SERVICE) private mastersApi: IVesselMastersApi,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private appConfig: AppConfig,
    private httpClient: HttpClient,
    changeDetectorRef: ChangeDetectorRef,
    private contractService: ContractService,
    @Inject(MAT_DATE_FORMATS) private dateFormats,
    @Inject(NGX_MAT_DATE_FORMATS) private dateTimeFormats,
    private format: TenantFormattingService,
    private tenantSettingsService: TenantSettingsService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    iconRegistry: MatIconRegistry, 
    public dialog: MatDialog, 
    @Inject(DecimalPipe) private _decimalPipe,
    private tenantService: TenantFormattingService,
    sanitizer: DomSanitizer,
    private overlayContainer: OverlayContainer) {
    super(changeDetectorRef);
  }

  ngOnInit(){ 
    this.entityName = 'Contract';
    //this.eventsSubscription = this.events.subscribe((data) => this.setContractForm(data));

  }

  setContractForm(form) {
    this.formValues = form;
    console.log(this.formValues);
  }



  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  originalOrder = (a: KeyValue<number, any>, b: KeyValue<number, any>): number => {
    return 0;
  }

  displayFn(value): string {
    return value && value.name ? value.name : '';
  }




  calendarOptionChange(ob: MatCheckboxChange, object, id, name) {
    console.log("checked: " + ob.checked);
    if (ob.checked) {
      if (typeof object == 'undefined') {
        object = {
          'id': id,
          'name': name
        }
        this.changeDetectorRef.detectChanges();
      }
      object.id = id;
      object.name = name;
    }
  }


  defaultHolidayRuleDays(event) {
    console.log(event);
    if (this.formValues.pricingScheduleOptionEventBasedContinuous.period.id != 4) {
      this.formValues.pricingScheduleOptionEventBasedContinuous.sundayHolidayRule = this.holidayRuleList[2];
      this.formValues.pricingScheduleOptionEventBasedContinuous.mondayHolidayRule = this.holidayRuleList[2];
      this.formValues.pricingScheduleOptionEventBasedContinuous.tuesdayHolidayRule = this.holidayRuleList[2];
      this.formValues.pricingScheduleOptionEventBasedContinuous.wednesdayHolidayRule = this.holidayRuleList[2];
      this.formValues.pricingScheduleOptionEventBasedContinuous.thursdayHolidayRule = this.holidayRuleList[2];
      this.formValues.pricingScheduleOptionEventBasedContinuous.fridayHolidayRule = this.holidayRuleList[2];
      this.formValues.pricingScheduleOptionEventBasedContinuous.saturdayHolidayRule = this.holidayRuleList[2];
    } else {
      this.formValues.pricingScheduleOptionEventBasedContinuous.sundayHolidayRule = this.holidayRuleList[0];
      this.formValues.pricingScheduleOptionEventBasedContinuous.mondayHolidayRule = this.holidayRuleList[0];
      this.formValues.pricingScheduleOptionEventBasedContinuous.tuesdayHolidayRule = this.holidayRuleList[0];
      this.formValues.pricingScheduleOptionEventBasedContinuous.wednesdayHolidayRule = this.holidayRuleList[0];
      this.formValues.pricingScheduleOptionEventBasedContinuous.thursdayHolidayRule = this.holidayRuleList[0];
      this.formValues.pricingScheduleOptionEventBasedContinuous.fridayHolidayRule = this.holidayRuleList[0];
      this.formValues.pricingScheduleOptionEventBasedContinuous.saturdayHolidayRule = this.holidayRuleList[0];
    }
  }


 




  ngAfterViewInit(): void {
  
  }
}

