import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injectable,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { AppConfig } from '@shiptech/core/config/app-config';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { RowstatusOnchangeQuantityrobdiffPopupComponent } from '@shiptech/core/ui/components/designsystem-v2/rowstatus-onchange-quantityrobdiff-popup/rowstatus-onchange-quantityrobdiff-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import {
  knowMastersAutocompleteHeaderName,
  knownMastersAutocomplete
} from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { ControlTowerListState } from 'libs/feature/control-tower/src/lib/store/control-tower-general-list/control-tower-general-list.state';
import { ControlTowerQuantityRobDifferenceListColumnServerKeys } from './list-columns/control-tower-quantity-rob-difference-list.columns';
import { ControlTowerQuantityRobDifferenceListGridViewModel } from './view-model/control-tower-quantity-rob-difference-grid.view-model';
import { SelectorComponent } from '@shiptech/core/ui/components/master-selector/selector/selector.component';
import { ControlTowerQuantitySupplyDifferenceListGridViewModel } from './view-model/control-tower-quantity-supply-difference-grid.view-model';
import { ControlTowerQuantitySupplyDifferenceListColumnServerKeys } from './list-columns/control-tower-quantity-supply-difference-list.columns';
import { ControlTowerQuantityClaimsListGridViewModel } from './view-model/control-tower-quantity-claims-grid.view-model';
import { ControlTowerQualityClaimsListGridViewModel } from './view-model/control-tower-quality-claims-grid.view-model';
import { ControlTowerQualityClaimsListColumnServerKeys } from './list-columns/control-tower-quality-claims-list.columns';
import { ControlTowerQuantityClaimsListColumnServerKeys } from './list-columns/control-tower-quantity-claims-list.columns';

export const PICK_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
  parse: {
    dateInput: 'DD MMM YYYY'
  }
};

@Injectable()
export class CustomDateAdapter extends MomentDateAdapter {
  public format(value: moment.Moment, displayFormat: string): string {
    if (value === null || value === undefined) return '';
    let currentFormat = PICK_FORMATS.display.dateInput;
    let hasDayOfWeek;
    if (currentFormat.startsWith('DDD ')) {
      hasDayOfWeek = true;
      currentFormat = currentFormat.split('DDD ')[1];
    }
    currentFormat = currentFormat.replace(/d/g, 'D');
    currentFormat = currentFormat.replace(/y/g, 'Y');
    currentFormat = currentFormat.split(' HH:mm')[0];
    let formattedDate = moment.utc(value).format(currentFormat);
    if (hasDayOfWeek) {
      formattedDate = `${moment.utc(value).format('ddd')} ${formattedDate}`;
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
    const elem = moment.utc(value, currentFormat);
    return value ? elem : null;
  }
}

@Component({
  selector: 'shiptech-control-tower-general-view-list',
  templateUrl: './control-tower-general-view-list.component.html',
  providers: [
    ControlTowerQuantityRobDifferenceListGridViewModel,
    ControlTowerQuantitySupplyDifferenceListGridViewModel,
    ControlTowerQuantityClaimsListGridViewModel,
    ControlTowerQualityClaimsListGridViewModel,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlTowerGeneralListComponent implements OnInit, OnDestroy {
  @Select(ControlTowerListState.firstStatusCount)
  firstStatusCount$: Observable<number>;
  @Select(ControlTowerListState.secondStatusCount)
  secondStatusCount$: Observable<number>;
  @Select(ControlTowerListState.thirdStatusCount)
  thirdStatusCount$: Observable<number>;
  @ViewChild('popup', { static: false }) popupTemplate: TemplateRef<any>;
  @Input() theme: boolean;
  @Input() newScreen: boolean;

  @Input() gridId: string = '';
  @Input() groupId: string = '';
  elementId = 'qc-report-list';
  private _destroy$ = new Subject();

  public switchTheme: boolean = true;
  public gridTitle = 'ROB Difference';

  public rowCount: Number;
  public rowSelection;

  private _autocompleteType: any;
  autocompleteOrders: string;
  controlTowerListServerKeys: any;

  get selectorType(): string {
    return this._selectorType;
  }

  @Input() set selectorType(value: string) {
    this._selectorType = value;
    this.setGridModelType();

    if (this.gridViewModel.isReady) {
      this.gridViewModel.gridOptions.api.purgeServerSideCache();
    }
  }

  @Input() _selectorType: string;

  gridViewModel: any;

  constructor(
    public appConfig: AppConfig,
    private urlService: UrlService,
    public dialog: MatDialog,
    @Inject(MAT_DATE_FORMATS) private dateFormats,
    private format: TenantFormattingService,
    private injector: Injector
  ) {
    this.autocompleteOrders = knownMastersAutocomplete.products;
    this.dateFormats.display.dateInput = this.format.dateFormat;
    this.dateFormats.parse.dateInput = this.format.dateFormat;
    PICK_FORMATS.display.dateInput = this.format.dateFormat;
  }

  setGridModelType() {
    switch (this.selectorType) {
      case 'Quantity ROB Difference': {
        this.gridViewModel = this.injector.get(
          ControlTowerQuantityRobDifferenceListGridViewModel
        );
        this.controlTowerListServerKeys = ControlTowerQuantityRobDifferenceListColumnServerKeys;
        break;
      }
      case 'Quantity Supply Difference': {
        this.gridViewModel = this.injector.get(
          ControlTowerQuantitySupplyDifferenceListGridViewModel
        );
        this.controlTowerListServerKeys = ControlTowerQuantitySupplyDifferenceListColumnServerKeys;
        break;
      }
      case 'Quantity Claims': {
        this.gridViewModel = this.injector.get(
          ControlTowerQuantityClaimsListGridViewModel
        );
        this.controlTowerListServerKeys = ControlTowerQuantitySupplyDifferenceListColumnServerKeys;
        break;
      }
      case 'Quality Claims': {
        this.gridViewModel = this.injector.get(
          ControlTowerQualityClaimsListGridViewModel
        );
        this.controlTowerListServerKeys = ControlTowerQuantityClaimsListColumnServerKeys;
        break;
      }

      default:
        throwError("Hasn't defined the selector type");
    }
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  openEditOrder(orderId: number): void {
    window.open(
      this.urlService.editOrder(orderId),
      this.appConfig.openLinksInNewTab ? '_blank' : '_self'
    );
  }

  openEditLab(labId: number): void {
    window.open(
      this.urlService.editLabResults(labId),
      this.appConfig.openLinksInNewTab ? '_blank' : '_self'
    );
  }

  openEditClaim(claimId: number): void {
    window.open(
      this.urlService.editClaim(claimId),
      this.appConfig.openLinksInNewTab ? '_blank' : '_self'
    );
  }

  openEditDelivery(deliveryId: number): void {
    window.open(
      this.urlService.editDelivery(deliveryId),
      this.appConfig.openLinksInNewTab ? '_blank' : '_self'
    );
  }

  openEditInvoice(invoiceId: number): void {
    window.open(
      this.urlService.editInvoice(invoiceId),
      this.appConfig.openLinksInNewTab ? '_blank' : '_self'
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public onrowClicked(ev) {
    if (
      this.selectorType == 'Quantity ROB Difference' ||
      this.selectorType == 'Quantity Supply Difference'
    ) {
      //console.log("hhhhhhhhh");
      const index = ev.rowIndex;
      const rowNode = ev.node;
      //alert(index);
      const dialogRef = this.dialog.open(
        RowstatusOnchangeQuantityrobdiffPopupComponent,
        {
          width: '382px',
          height: 'auto',
          maxHeight: '536px',
          backdropClass: 'dark-popupBackdropClass',
          panelClass: this.theme ? 'dark-theme' : 'light-theme',
          data: { title: 'Claims', id: 'Claim Id' }
        }
      );

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        console.log(ev);
        this.gridViewModel.updateValues(ev, result);
      });
    }
  }

  getHeaderNameSelector(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.products:
        return knowMastersAutocompleteHeaderName.products;
      default:
        return knowMastersAutocompleteHeaderName.products;
    }
  }

  formatDateForBe(value) {
    if (value) {
      let beValue = moment.utc(value).format('YYYY-MM-DD');
      return moment.utc(value).format('YYYY-MM-DD');
    } else {
      return null;
    }
  }
}
function defined(
  arg0: string,
  t: any,
  defined: any,
  the: any,
  selector: any,
  type: any,
  arg6: string
) {
  throw new Error('Function not implemented.');
}
