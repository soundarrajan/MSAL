import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injectable,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppConfig } from '@shiptech/core/config/app-config';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { ControlTowerQuantityRobDifferenceListGridViewModel } from './view-model/control-tower-quantity-rob-difference-grid.view-model';
import { RowstatusOnchangeQuantityrobdiffPopupComponent } from '@shiptech/core/ui/components/designsystem-v2/rowstatus-onchange-quantityrobdiff-popup/rowstatus-onchange-quantityrobdiff-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ControlTowerQuantityRobDifferenceListColumnServerKeys } from './view-model/control-tower-quantity-rob-difference-list.columns';
import { Select } from '@ngxs/store';
import { ControlTowerQuantityRobDifferenceListState } from 'libs/feature/control-tower/src/lib/store/control-tower-quantity-rob-difference-list/control-tower-quantity-rob-difference-list.state';
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
  selector: 'shiptech-control-tower-quantity-rob-difference-list',
  templateUrl: './control-tower-quantity-rob-difference-list.component.html',
  providers: [
    ControlTowerQuantityRobDifferenceListGridViewModel,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlTowerQuantityRobDifferenceListComponent
  implements OnInit, OnDestroy {
  @Select(ControlTowerQuantityRobDifferenceListState.newCount)
  newCount$: Observable<number>;
  @Select(ControlTowerQuantityRobDifferenceListState.masCount)
  markAsSeenCount$: Observable<number>;
  @Select(ControlTowerQuantityRobDifferenceListState.resolvedCount)
  resolvedCount$: Observable<number>;
  @ViewChild('popup', { static: false }) popupTemplate: TemplateRef<any>;
  public controlTowerQuantityRobDifferenceListServerKeys = ControlTowerQuantityRobDifferenceListColumnServerKeys;
  @Input() theme: boolean;
  @Input() newScreen: boolean;

  private _destroy$ = new Subject();

  public switchTheme: boolean = true;
  public gridTitle = 'ROB Difference';

  public rowCount: Number;
  public rowSelection;

  private _autocompleteType: any;
  autocompleteOrders: string;

  constructor(
    public gridViewModel: ControlTowerQuantityRobDifferenceListGridViewModel,
    public appConfig: AppConfig,
    private urlService: UrlService,
    public dialog: MatDialog,
    @Inject(MAT_DATE_FORMATS) private dateFormats,
    private format: TenantFormattingService
  ) {
    this.autocompleteOrders = knownMastersAutocomplete.products;
    this.dateFormats.display.dateInput = this.format.dateFormat;
    this.dateFormats.parse.dateInput = this.format.dateFormat;
    PICK_FORMATS.display.dateInput = this.format.dateFormat;
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
