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
import { BehaviorSubject, Observable, pipe, Subject, Subscription } from 'rxjs';
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
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { IDeliveryTenantSettings } from 'libs/feature/delivery/src/lib/core/settings/delivery-tenant-settings';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';

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
  selector: 'shiptech-product-quality',
  templateUrl: './product-quality.component.html',
  styleUrls: ['./product-quality.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [OrderListGridViewModel, 
              DialogService, 
              ConfirmationService,
              {provide: DateAdapter, useClass: PickDateAdapter},
              {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS}]
})
export class ProductQualityComponent extends DeliveryAutocompleteComponent
  implements OnInit{
  switchTheme;
  autocompleteProducts: knownMastersAutocomplete;
  physicalSupplierList: any[];
  autocompletePhysicalSupplier: knownMastersAutocomplete;
  qualityMatchList: any[];
  formValues: any;
  toleranceLimits: any;
  _autocompleteType: string;
  raiseClaimInfo: any;
  isAnalysedOnDateInvalid: boolean;
  quantityFormat: string;
  @Input() set autocompleteType(value: string) {
    this._autocompleteType = value;
  }

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
     
  @Input('formValues') set _setFormValues(formValues) { 
    if (!formValues) {
      return;
    } 
    this.formValues = formValues;
  }

  @Input('deliveryProductIndex') set _setDeliveryProductIndex(deliveryProductIndex) { 
    if (!deliveryProductIndex) {
      return;
    } 
    this.deliveryProductIndex = deliveryProductIndex;
  }

  @Input('toleranceLimits') set _setToleranceLimits(toleranceLimits) { 
    if (!toleranceLimits) {
      return;
    } 
    this.toleranceLimits = toleranceLimits;
  }

 
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
  @Input() vesselId: number;
  @Input() data;
  autocompleteVessel: knownMastersAutocomplete;
  _entityId: number;
  _entityName: string;
  deliveryProductIndex: any;
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
    public format: TenantFormattingService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    iconRegistry: MatIconRegistry, 
    private tenantService: TenantFormattingService,
    sanitizer: DomSanitizer,
    @Inject(DecimalPipe) private _decimalPipe

  ) {
    super(changeDetectorRef);
    iconRegistry.addSvgIcon(
      'data-picker-gray',
      sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxMyAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik05Ljc0OTk2IDUuODUwMUg4LjQ0OTk1VjcuMTUwMTFIOS43NDk5NlY1Ljg1MDFaIiBmaWxsPSIjMzY0MTUwIi8+DQo8cGF0aCBkPSJNNy4xNDk5OCA1Ljg1MDFINS44NDk5OFY3LjE1MDExSDcuMTQ5OThWNS44NTAxWiIgZmlsbD0iIzM2NDE1MCIvPg0KPHBhdGggZD0iTTQuNTUwMDIgNS44NTAxSDMuMjVWNy4xNTAxMUg0LjU1MDAyVjUuODUwMVoiIGZpbGw9IiMzNjQxNTAiLz4NCjxwYXRoIGQ9Ik0xMS4wNSAxLjMwMDAxSDEwLjRWMEg5LjA5OTk4VjEuMzAwMDFIMy44OTk5N1YwSDIuNTk5OTZWMS4zMDAwMUgxLjk0OTk3QzEuMjI4NDcgMS4zMDAwMSAwLjY1NjQ4NCAxLjg4NTAxIDAuNjU2NDg0IDIuNjAwMDJMMC42NDk5NjMgMTEuN0MwLjY0OTk2MyAxMi40MTUgMS4yMjg0NyAxMyAxLjk0OTk3IDEzSDExLjA1QzExLjc2NSAxMyAxMi4zNSAxMi40MTUgMTIuMzUgMTEuN1YyLjU5OTk5QzEyLjM1IDEuODg1MDEgMTEuNzY1IDEuMzAwMDEgMTEuMDUgMS4zMDAwMVpNMTEuMDUgMTEuN0gxLjk0OTk3VjQuNTQ5OTlIMTEuMDVWMTEuN1oiIGZpbGw9IiMzNjQxNTAiLz4NCjwvc3ZnPg0K'));
    iconRegistry.addSvgIcon(
      'data-picker-white',
      sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTMiIHZpZXdCb3g9IjAgMCAxMyAxMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik05Ljc0OTk2IDUuODUwMUg4LjQ0OTk1VjcuMTUwMTFIOS43NDk5NlY1Ljg1MDFaIiBmaWxsPSIjMzY0MTUwIi8+DQo8cGF0aCBkPSJNNy4xNDk5OCA1Ljg1MDFINS44NDk5OFY3LjE1MDExSDcuMTQ5OThWNS44NTAxWiIgZmlsbD0iIzM2NDE1MCIvPg0KPHBhdGggZD0iTTQuNTUwMDIgNS44NTAxSDMuMjVWNy4xNTAxMUg0LjU1MDAyVjUuODUwMVoiIGZpbGw9IiMzNjQxNTAiLz4NCjxwYXRoIGQ9Ik0xMS4wNSAxLjMwMDAxSDEwLjRWMEg5LjA5OTk4VjEuMzAwMDFIMy44OTk5N1YwSDIuNTk5OTZWMS4zMDAwMUgxLjk0OTk3QzEuMjI4NDcgMS4zMDAwMSAwLjY1NjQ4NCAxLjg4NTAxIDAuNjU2NDg0IDIuNjAwMDJMMC42NDk5NjMgMTEuN0MwLjY0OTk2MyAxMi40MTUgMS4yMjg0NyAxMyAxLjk0OTk3IDEzSDExLjA1QzExLjc2NSAxMyAxMi4zNSAxMi40MTUgMTIuMzUgMTEuN1YyLjU5OTk5QzEyLjM1IDEuODg1MDEgMTEuNzY1IDEuMzAwMDEgMTEuMDUgMS4zMDAwMVpNMTEuMDUgMTEuN0gxLjk0OTk3VjQuNTQ5OTlIMTEuMDVWMTEuN1oiIGZpbGw9IiMzNjQxNTAiLz4NCjwvc3ZnPg0K'));
    this.autocompleteProducts = knownMastersAutocomplete.products;
    this.autocompletePhysicalSupplier = knownMastersAutocomplete.physicalSupplier;
    this.dateFormats.display.dateInput = this.format.dateFormat;
    this.dateFormats.parse.dateInput = this.format.dateFormat;
    PICK_FORMATS.display.dateInput = this.format.dateFormat;
    this.quantityFormat = '1.' + this.tenantService.quantityPrecision + '-' + this.tenantService.quantityPrecision;

  }

  ngOnInit(){  
    this.entityName = 'Delivery';
    this.eventsSubscription = this.events.subscribe((data) => this.setDeliveryForm(data));
    console.log('index');
    console.log(this.deliveryProductIndex);
    const product = this.formValues.deliveryProducts[this.deliveryProductIndex];
    this.getClaimInfo(product.qualityParameters, product.id);
    this.getQualityMatchList();
  }

  getClaimInfo(specParams, prodId) {
    this.raiseClaimInfo = {};
    this.raiseClaimInfo.allSpecParams = specParams;
    this.raiseClaimInfo.productId = prodId;
    console.log(this.raiseClaimInfo);
  }

  setDeliveryForm(form){
    if (!form) {
      return;
    }
    console.log('aici');
    this.formValues = form;
    console.log(this.formValues);
    //this.changeDetectorRef.detectChanges();
  }

  async getQualityMatchList() {
    this.qualityMatchList = await this.legacyLookupsDatabase.getQualityMatchList();
    console.log(this.qualityMatchList);
  }

  ngAfterViewInit() {

  }

  setQualityMatch(bdn, survey, min, max) {
      if (typeof bdn == 'string' && bdn == '' || bdn == null) {
          return;
      }
      if (typeof survey == 'string' && survey == '' || survey == null) {
          return;
      }
      if (isNaN(bdn)) {
          return;
      }
      if (isNaN(survey)) {
          return;
      }
      let variance = survey - bdn;
      // logic -> passed for exact match, failed otherwise
      if (variance == 0) {
          return this.qualityMatchList[0];
      }
      return this.qualityMatchList[1];
  };

  
 

  onChange($event, field) {
    if ($event.value) {
      let beValue = `${moment($event.value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
      if (field == 'analysedOnDate') {
        this.isAnalysedOnDateInvalid = false;
      }
      console.log(beValue);
    } else {
      if (field == 'analysedOnDate') {
        this.isAnalysedOnDateInvalid = true;
      } 
      this.toastr.error('Please enter the correct format');
    }

  }

  formatDateForBe(value) {
    let beValue = `${moment(value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`;
    return `${moment(value).format('YYYY-MM-DDTHH:mm:ss') }+00:00`
  }


  quantityFormatValue(value) {
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    if (plainNumber) {
      if(this.tenantService.quantityPrecision == 0) {
        return plainNumber;
      } else{
        return this._decimalPipe.transform(plainNumber, this.quantityFormat);
      }
    }
  }
  
}
