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

export const PICK_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

export class PickDateAdapter extends NativeDateAdapter {
  format(value: Date, displayFormat: string): string {
    if (value === null || value === undefined) return undefined;
    return moment(value).format(dateTimeAdapter.fromDotNet(displayFormat));
  }
}

@Component({
  selector: 'shiptech-product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [OrderListGridViewModel, 
              DialogService, 
              ConfirmationService,
              {provide: DateAdapter, useClass: PickDateAdapter},
              {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS}]
})
export class ProductQuantityComponent implements OnInit{
  switchTheme;
  autocompleteProducts: knownMastersAutocomplete;
  physicalSupplierList: any[];
  autocompletePhysicalSupplier: knownMastersAutocomplete;
  qualityMatchList: any[];
  toleranceLimits: any;
  _autocompleteType: string;
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
     
  @Input() formValues: any;

  @Input() prodOrderInTemp: any;

  @Input('deliveryProductIndex') set _setDeliveryProductIndex(deliveryProductIndex) { 
    if (!deliveryProductIndex) {
      return;
    } 
    this.deliveryProductIndex = deliveryProductIndex;
    if (this.formValues.temp.deliverysummary) {
      if (this.formValues.deliveryProducts[this.deliveryProductIndex] && !this.formValues.deliveryProducts[this.deliveryProductIndex].quantityHeader) {
        this.formValues.deliveryProducts[this.deliveryProductIndex].quantityHeader = {};
      }
      this.formQuantityHeaders(this.formValues.deliveryProducts[this.deliveryProductIndex].orderProductId, 
                              this.formValues.deliveryProducts[this.deliveryProductIndex].quantityHeader.ccaiDelivered);
    }
    if (this.formValues.deliveryProducts[this.deliveryProductIndex] && !this.formValues.deliveryProducts[this.deliveryProductIndex].quantityHeader) {
      this.formValues.deliveryProducts[this.deliveryProductIndex].quantityHeader = {};
    }
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
    private changeDetectorRef: ChangeDetectorRef,
    private deliveryService: DeliveryService,
    @Inject(MAT_DATE_FORMATS) private dateFormats,
    public format: TenantFormattingService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService

  ) {
    this.autocompleteProducts = knownMastersAutocomplete.products;
    this.autocompletePhysicalSupplier = knownMastersAutocomplete.physicalSupplier;
    this.dateFormats.display.dateInput = this.format.dateFormat;
  }

  ngOnInit(){  
    this.entityName = 'Delivery';
    this.getQualityMatchList();
  }

  async getQualityMatchList() {
    this.qualityMatchList = await this.legacyLookupsDatabase.getQualityMatchList();
    console.log(this.qualityMatchList);
  }



  formQuantityHeaders(orderProdId, ccaiDelivered) {
    if (typeof this.formValues.temp.deliverysummary.products == 'undefined') {
      this.formValues.temp.deliverysummary.products = [];
    }
    // returns index based on prodId
    this.formValues.temp.deliverysummary.products.forEach((summaryProd, idx) => {
      if (summaryProd.id == orderProdId) {
        if (!ccaiDelivered) {
            summaryProd.ccaiDelivered = '';
            summaryProd.ccaiVariance = '';
        } else {
            summaryProd.ccaiDelivered = ccaiDelivered;
            summaryProd.ccaiVariance = this.calculatCccaiVariance(summaryProd.ccai, summaryProd.ccaiDelivered);
        }
        this.prodOrderInTemp = idx;
      }
   });
  }

  calculatCccaiVariance(offered, delivered) {
    if (offered && delivered) {
        return offered - delivered;
    }
    return;
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
  }


  // Only Number
  keyPressNumber(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (inp == '.' || inp == ',') {
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
