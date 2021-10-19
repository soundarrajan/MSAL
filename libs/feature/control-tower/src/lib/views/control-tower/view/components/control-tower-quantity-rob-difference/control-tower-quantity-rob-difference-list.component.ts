import {
  ChangeDetectionStrategy,
  Component,
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

@Component({
  selector: 'shiptech-control-tower-quantity-rob-difference-list',
  templateUrl: './control-tower-quantity-rob-difference-list.component.html',
  providers: [ControlTowerQuantityRobDifferenceListGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlTowerQuantityRobDifferenceListComponent
  implements OnInit, OnDestroy {
  @Select(ControlTowerQuantityRobDifferenceListState.totalCount)
  totalCount$: Observable<number>;
  @ViewChild('popup', { static: false }) popupTemplate: TemplateRef<any>;
  public controlTowerQuantityRobDifferenceListServerKeys = ControlTowerQuantityRobDifferenceListColumnServerKeys;
  @Input() theme: boolean;
  @Input() newScreen: boolean;

  private _destroy$ = new Subject();

  public switchTheme: boolean = true;
  public gridTitle = 'ROB Difference';
  public toggleNewFilter: boolean = true;
  public toggleMASFilter: boolean = true;
  public toggleResolvedFilter: boolean = true;
  public rowCount: Number;
  public rowSelection;

  private _autocompleteType: any;
  autocompleteOrders: string;

  constructor(
    public gridViewModel: ControlTowerQuantityRobDifferenceListGridViewModel,
    public appConfig: AppConfig,
    private urlService: UrlService,
    public dialog: MatDialog
  ) {
    this.autocompleteOrders = knownMastersAutocomplete.products;
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
      // this.gridViewModel.updateValues(ev, result);

      // rowNode.setDataValue('invoiceStatus', {
      //   transactionTypeId: 5,
      //   id: 27,
      //   name: 'Discrepancy',
      //   internalName: null,
      //   displayName: 'Discrepancy',
      //   collectionName: null,
      //   customNonMandatoryAttribute1: null,
      //   isDeleted: false,
      //   modulePathUrl: null,
      //   clientIpAddress: null,
      //   userAction: null
      // });
      // console.log(rowNode);
    });
  }

  filterGridNew(statusName: string): void {
    console.log(this.gridTitle);
    if (this.toggleNewFilter) {
      this.gridViewModel.filterByStatus(statusName);
    } else {
      this.gridViewModel.filterByStatus('');
    }
    this.toggleNewFilter = !this.toggleNewFilter;
    this.toggleMASFilter = true;
    this.toggleResolvedFilter = true;
  }

  filterGridMAS(statusName: string): void {
    if (this.toggleMASFilter) {
      this.gridViewModel.filterByStatus(statusName);
    } else {
      this.gridViewModel.filterByStatus('');
    }
    this.toggleMASFilter = !this.toggleMASFilter;
    this.toggleNewFilter = true;
    this.toggleResolvedFilter = true;
  }

  filterGridResolved(statusName: string): void {
    if (this.toggleResolvedFilter) {
      this.gridViewModel.filterByStatus(statusName);
    } else {
      this.gridViewModel.filterByStatus('');
    }
    this.toggleResolvedFilter = !this.toggleResolvedFilter;
    this.toggleNewFilter = true;
    this.toggleMASFilter = true;
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
      let beValue = moment(value).format('YYYY-MM-DD[T]00:00');
      return moment(value).format('YYYY-MM-DD[T]00:00');
    } else {
      return null;
    }
  }
}
