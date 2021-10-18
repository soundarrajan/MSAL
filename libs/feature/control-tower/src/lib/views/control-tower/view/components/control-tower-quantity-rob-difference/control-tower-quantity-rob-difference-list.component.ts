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

  constructor(
    public gridViewModel: ControlTowerQuantityRobDifferenceListGridViewModel,
    public appConfig: AppConfig,
    private urlService: UrlService,
    public dialog: MatDialog
  ) {}

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

  public newFilters() {
    console.log(this.gridViewModel);
    this.gridViewModel.filterByStatus();
    // this.gridViewModel.serverSideGetRows(this.gridViewModel);
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
}
