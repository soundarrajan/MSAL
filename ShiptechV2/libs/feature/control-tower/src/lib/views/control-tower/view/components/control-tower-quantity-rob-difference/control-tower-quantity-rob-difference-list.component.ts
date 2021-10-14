import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig } from '@shiptech/core/config/app-config';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { ControlTowerQuantityRobDifferenceListGridViewModel } from './view-model/control-tower-quantity-rob-difference-grid.view-model';
import { InvoiceListColumnServerKeys } from './view-model/control-tower-quantity-rob-difference-list.columns';


@Component({
  selector: 'shiptech-control-tower-quantity-rob-difference-list',
  templateUrl: './control-tower-quantity-rob-difference-list.component.html',
  providers: [ControlTowerQuantityRobDifferenceListGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlTowerQuantityRobDifferenceListComponent implements OnInit, OnDestroy {
  @ViewChild('popup', { static: false }) popupTemplate: TemplateRef<any>;
  invoiceListServerKeys = InvoiceListColumnServerKeys;
  private _destroy$ = new Subject();

  constructor(
    public gridViewModel: ControlTowerQuantityRobDifferenceListGridViewModel,
    public appConfig: AppConfig,
    private urlService: UrlService
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

  newFilters() {
    console.log(this.gridViewModel);
    this.gridViewModel.filterByStatus();
    // this.gridViewModel.serverSideGetRows(this.gridViewModel);
  }
}
