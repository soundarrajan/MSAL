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
import { InvoiceListGridViewModel } from './view-model/invoice-list-grid.view-model';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { InvoiceListColumnServerKeys } from '../view-model/invoice-list.columns';

@Component({
  selector: 'shiptech-control-tower-invoice-list',
  templateUrl: './control-tower-invoice-list.component.html',
  providers: [InvoiceListGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlTowerInvoiceListComponent implements OnInit, OnDestroy {
  @ViewChild('popup', { static: false }) popupTemplate: TemplateRef<any>;
  invoiceListServerKeys = InvoiceListColumnServerKeys;
  private _destroy$ = new Subject();

  constructor(
    public gridViewModel: InvoiceListGridViewModel,
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
