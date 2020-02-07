import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CompleteListGridViewModel } from './view-model/invoice-complete-list-grid.view-model';
import { Subject } from 'rxjs';
import { AppConfig } from '@shiptech/core/config/app-config';
import { UrlService } from '@shiptech/core/services/url/url.service';

@Component({
  selector: 'shiptech-invoice-complete-list',
  templateUrl: './invoice-complete-list.component.html',
  providers: [CompleteListGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceCompleteListComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();

  constructor(public gridViewModel: CompleteListGridViewModel,
              public appConfig: AppConfig,
              private urlService: UrlService
  ) {
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  openEditOrder(orderId: number): void {
    window.open(this.urlService.editOrder(orderId), this.appConfig.openLinksInNewTab ? '_blank' : '_self');
  }

  openEditDelivery(deliveryId: number): void {
    window.open(this.urlService.editDelivery(deliveryId), this.appConfig.openLinksInNewTab ? '_blank' : '_self');
  }

  openEditInvoice(invoiceId: number): void {
    window.open(this.urlService.editInvoice(invoiceId), this.appConfig.openLinksInNewTab ? '_blank' : '_self');
  }

  openEditContract(contractId: number): void {
    window.open(this.urlService.editContract(contractId), this.appConfig.openLinksInNewTab ? '_blank' : '_self');
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
