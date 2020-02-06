import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {AppConfig} from '@shiptech/core/config/app-config';
import {ReconStatusLookup} from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import {InvoiceListGridViewModel} from "./view-model/invoice-list-grid-view-model.service";
import {UrlService} from "@shiptech/core/services/url/url.service";

@Component({
  selector: 'shiptech-invoice-list',
  templateUrl: './invoice-list.component.html',
  providers: [InvoiceListGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceListComponent implements OnInit, OnDestroy {

  @ViewChild('popup', {static: false}) popupTemplate: TemplateRef<any>;
  private _destroy$ = new Subject();

  constructor(public gridViewModel: InvoiceListGridViewModel,
              public appConfig: AppConfig,
              public reconStatusLookups: ReconStatusLookup,
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

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
