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
  ChangeDetectorRef
} from '@angular/core';
import { Select } from '@ngxs/store';
import { QcReportService } from '../../../../../services/qc-report.service';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { QcReportState } from '../../../../../store/report/qc-report.state';
import { ToastrService } from 'ngx-toastr';
import { finalize, map, scan, startWith, timeout } from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BdnInformationApiService } from '@shiptech/core/services/delivery-api/bdn-information/bdn-information-api.service';
import { TransactionForSearch } from 'libs/feature/delivery/src/lib/services/api/request-response/bdn-information';
import { DocumentsGridViewModel } from '@shiptech/core/ui/components/documents/view-model/documents-grid-view-model.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ModuleError } from '@shiptech/core/ui/components/documents/error-handling/module-error';
import { IDocumentsCreateUploadDetailsDto, IDocumentsCreateUploadDto } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-create-upload.dto';
import { IDocumentsDeleteRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto';
import { IDocumentsItemDto } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto';
import { DocumentViewEditNotesComponent } from '@shiptech/core/ui/components/documents/document-view-edit-notes/document-view-edit-notes.component';
import { IDocumentsUpdateIsVerifiedRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto';
import { IDisplayLookupDto, IOrderLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { knowMastersAutocompleteHeaderName, knownMastersAutocomplete } from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { FileSaverService } from 'ngx-filesaver';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { DOCUMENTS_API_SERVICE } from '@shiptech/core/services/masters-api/documents-api.service';
import { IDocumentsApiService } from '@shiptech/core/services/masters-api/documents-api.service.interface';
import { FileUpload } from 'primeng/fileupload';
import { OrderListGridViewModel } from '@shiptech/core/ui/components/delivery/view-model/order-list-grid-view-model.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { DeliveryAutocompleteComponent } from '../delivery-autocomplete/delivery-autocomplete.component';
import { AppConfig } from '@shiptech/core/config/app-config';
import { HttpClient } from '@angular/common/http';
import { IVesselMastersApi, VESSEL_MASTERS_API_SERVICE } from '@shiptech/core/services/masters-api/vessel-masters-api.service.interface';
import { DeliveryService } from 'libs/feature/delivery/src/lib/services/delivery.service';
import { DeliveryInfoForOrder, DeliveryProduct, DeliveryProductDto, IDeliveryInfoForOrderDto, OrderInfoDetails } from 'libs/feature/delivery/src/lib/services/api/dto/delivery-details.dto';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import moment from 'moment';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { IDeliveryTenantSettings } from 'libs/feature/delivery/src/lib/core/settings/delivery-tenant-settings';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { IGeneralTenantSettings } from '@shiptech/core/services/tenant-settings/general-tenant-settings.interface';
import { NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

  
export const PICK_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
  parse: {
    dateInput: 'DD MMM YYYY'
  }
};

export class PickDateAdapter extends NativeDateAdapter {
  format(value: Date, displayFormat: string): string {
    if (value === null || value === undefined) return '';
    let currentFormat = displayFormat;
    let hasDayOfWeek;
    if (currentFormat.startsWith('DDD ')) {
        hasDayOfWeek = true;
        currentFormat = currentFormat.split('DDD ')[1];
    }
    currentFormat = currentFormat.replace(/d/g, 'D');
    currentFormat = currentFormat.replace(/y/g, 'Y');
    currentFormat = currentFormat.split(' HH:mm')[0];
    let formattedDate = moment(value).format(currentFormat);
    if (hasDayOfWeek) {
      formattedDate = `${moment(value).format('ddd') } ${ formattedDate}`;
    }
    return formattedDate;
  }

  parse(value) {
    // We have no way using the native JS Date to set the parse format or locale, so we ignore these
    // parameters.
    let currentFormat = PICK_FORMATS.display.dateInput;
    let hasDayOfWeek;
    if (currentFormat.startsWith('DDD ')) {
        hasDayOfWeek = true;
        currentFormat = currentFormat.split('DDD ')[1];
    }
    currentFormat = currentFormat.replace(/d/g, 'D');
    currentFormat = currentFormat.replace(/y/g, 'Y');
    currentFormat = currentFormat.split(' HH:mm')[0];
    let elem = moment(value, currentFormat);
    let date = elem.toDate();
    return value ? date : null;
  }

}


@Component({
  selector: 'shiptech-bdn-additional-information',
  templateUrl: './bdn-additional-information.component.html',
  styleUrls: ['./bdn-additional-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [OrderListGridViewModel, 
              DialogService, 
              ConfirmationService,
              {provide: DateAdapter, useClass: PickDateAdapter},
              {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS}]
})
export class BdnAdditionalInformationComponent extends DeliveryAutocompleteComponent
  implements OnInit{
  @Input() data;
  switchTheme;
  deliverySettings: any;
  adminConfiguration: any;
  deliveryFeedbackList$: any[];
  deliveryFeedback: any;
  satisfactionLevel: any;
  isBargePumpingRateStartTimeInvalid: boolean;
  isBargePumpingRateEndTimeInvalid: boolean;

  @Input('satisfactionLevel') set _setSatisfactionLevel(satisfactionLevel) { 
    if (!satisfactionLevel) {
      return;
    } 
    this.satisfactionLevel = satisfactionLevel;
  }
  
  @Input('deliveryFeedback') set _setDeliveryFeedback(deliveryFeedback) { 
    if (!deliveryFeedback) {
      return;
    } 
    this.deliveryFeedback = deliveryFeedback;
  }
  
  @Input('model') set _setFormValues(formValues) { 
    if (!formValues) {
      return;
    } 
    this.formValues = formValues;
    this.changeDetectorRef.detectChanges();
  }
  
  @Input('finalQuantityRules') set _setFinalQuantityRules(finalQuantityRules) { 
    if (!finalQuantityRules) {
      return;
    } 
    this.finalQuantityRules = finalQuantityRules;
    this.changeDetectorRef.detectChanges();
  }

  @Input('toleranceLimits') set _setToleranceLimits(toleranceLimits) { 
    if (!toleranceLimits) {
      return;
    } 
    this.toleranceLimits = toleranceLimits;
    this.changeDetectorRef.detectChanges();
  }

  states: string[] = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas'
  ];
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;

  deliveryFormSubject: Subject<any> = new Subject<any>();
  toleranceLimits: any;
  formValues: any;
  openedScreenLoaders: number = 0;
  finalQuantityRules: any;
  constructor(
    public gridViewModel: OrderListGridViewModel,
    public bdnInformationService: BdnInformationApiService,
    @Inject(VESSEL_MASTERS_API_SERVICE) private mastersApi: IVesselMastersApi,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private appConfig: AppConfig,
    private httpClient: HttpClient,
    changeDetectorRef: ChangeDetectorRef,
    private deliveryService: DeliveryService,
    @Inject(MAT_DATE_FORMATS) private dateFormats,
    private format: TenantFormattingService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private tenantSettingsService: TenantSettingsService,
    @Inject(NGX_MAT_DATE_FORMATS) private dateTimeFormats,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer

  ) {
    super(changeDetectorRef);
    iconRegistry.addSvgIcon(
      'data-picker-gray',
      sanitizer.bypassSecurityTrustResourceUrl('../../../../../../../../../../assets/layout/images/pages/calendar-dark.svg'));
    iconRegistry.addSvgIcon(
      'data-picker-white',
      sanitizer.bypassSecurityTrustResourceUrl('../../../../../../../../../../assets/layout/images/pages/calendar-dark.svg'));
    this.deliverySettings = tenantSettingsService.getModuleTenantSettings<
                          IDeliveryTenantSettings
                        >(TenantSettingsModuleName.Delivery);
    this.adminConfiguration = tenantSettingsService.getModuleTenantSettings<
                      IGeneralTenantSettings
                    >(TenantSettingsModuleName.General);
    this.dateFormats.display.dateInput = this.format.dateFormat;
    this.dateFormats.parse.dateInput = this.format.dateFormat;
    PICK_FORMATS.display.dateInput = this.format.dateFormat;
  }

  ngOnInit(){  
    this.eventsSubscription = this.events.subscribe((data) => this.setDeliveryForm(data));
    this.getDeliveryFeedbackList();
    //this.getTimeBetweenDates(this.formValues.bargePumpingRateStartTime, this.formValues.bargePumpingRateEndTime);
  }

  setDeliveryForm(form){
    if (!form) {
      return;
    }
    console.log('aici');
    console.log(form);
    this.formValues = form;
    this.deliveryFormSubject.next(form);
    this.changeDetectorRef.detectChanges();
  }

  async getDeliveryFeedbackList() {
    this.deliveryFeedbackList$ = await this.legacyLookupsDatabase.getDeliveryFeedbackList();
  }

  compareUomObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  onChange($event, field) {
    if ($event.value) {
      let beValue = `${moment($event.value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
      if (field == 'bargePumpingRateStartTime') {
        this.isBargePumpingRateStartTimeInvalid = false;
      } else if (field == 'bargePumpingRateEndTime') {
        this.isBargePumpingRateEndTimeInvalid = false;
      }
      console.log(beValue);
    } else {
      if (field == 'bargePumpingRateStartTime') {
        this.isBargePumpingRateStartTimeInvalid = true;
      } else if (field == 'bargePumpingRateEndTime') {
        this.isBargePumpingRateEndTimeInvalid = true;
      }
      this.toastr.error('Please enter the correct format');
    }

    if (moment.utc(this.formValues.bargePumpingRateEndTime).isBefore(moment.utc(this.formValues.bargePumpingRateStartTime))) {
      let errorMessage = 'Pumping Start must be lower or equal to Pumping End.';
      this.isBargePumpingRateStartTimeInvalid = true;
      this.isBargePumpingRateEndTimeInvalid = true;
      this.toastr.error(errorMessage);
    }  else {
      this.isBargePumpingRateStartTimeInvalid = false;
      this.isBargePumpingRateEndTimeInvalid = false;
    }

  }

  formatDateForBe(value) {
    let beValue = `${moment(value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
    return `${moment(value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`
  }

  getTimeBetweenDates(start, end) {
    if (!start) {
      return;
    }
    if (!end) {
      return;
    }
    let startDate, endDate, timeBetween, minutes, mins, hours;
    startDate = new Date(start);
    endDate = new Date(end);
    timeBetween = Math.abs(endDate.getTime() - startDate.getTime());
    if (endDate < startDate) {
      timeBetween = Math.abs(startDate.getTime() - endDate.getTime());
    }
    minutes = 0.001 * timeBetween / 60;
    mins = minutes % 60;
    hours = (minutes - mins) / 60;
    hours = hours < 10 ? `0${ hours}` : hours;
    mins = mins < 10 ? `0${ mins}` : mins;
    var result = `${hours }:${ mins}`;
    if (result.indexOf('NaN') != -1) {
      result = null;
    }
    if (endDate < startDate) {
      this.formValues.pumpingDuration = `-${ result}`;
      return;
    }
    this.formValues.pumpingDuration = result;
  }

  getTimeBetweenBerthinAndBargeDates(start, end) {
    if (!start) {
      return;
    }
    if (!end) {
      return;
    }
    let startDate, endDate, timeBetween, minutes, mins, hours;
    startDate = new Date(start);
    endDate = new Date(end);
    timeBetween = Math.abs(endDate.getTime() - startDate.getTime());
    if (endDate < startDate) {
      timeBetween = Math.abs(startDate.getTime() - endDate.getTime());
    }
    minutes = 0.001 * timeBetween / 60;
    mins = minutes % 60;
    hours = (minutes - mins) / 60;
    hours = hours < 10 ? `0${ hours}` : hours;
    mins = mins < 10 ? `0${ mins}` : mins;
    var result = `${hours }:${ mins}`;
    if (result.indexOf('NaN') != -1) {
      result = null;
    }
    if (endDate < startDate) {
      this.formValues.bargeDelay = `-${ result}`;
      return;
    }
    this.formValues.bargeDelay = result;

  }


 
  

  ngAfterViewInit(): void {
  
  }

 

  
}
