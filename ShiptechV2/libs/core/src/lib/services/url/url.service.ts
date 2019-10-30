import { Inject, Injectable } from '@angular/core';
import { ILogger } from '@shiptech/core/logging/logger';
import { LoggerFactory } from '@shiptech/core/logging/logger-factory.service';
import { AppConfig } from '@shiptech/core/config/app-config';
import { APP_BASE_HREF } from '@angular/common';
import { KnownQuantityControlRoutes } from '../../../../../feature/quantity-control/src/lib/known-quantity-control.routes';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';

@Injectable({
  providedIn: 'root'
})
// noinspection JSUnusedGlobalSymbols
export class UrlService {
  private logger: ILogger;

  constructor(private appConfig: AppConfig,
              loggerFactory: LoggerFactory,
              @Inject(APP_BASE_HREF) private baseHref: string) {
    this.logger = loggerFactory.createLogger(UrlService.name);
  }

  public editRequest(requestId: string | number): string {
    return `/#/edit-request/${(requestId)}`;
  }

  public getRuntimeSettings(): string {
    return `${this.baseHref}assets/config/settings.runtime.json`;
  }

  public getLegacySettings(): string {
    return `/config/defaultConfig.json`;
  }

  public offer(requestId: string | number): string {
    return `/#/group-of-requests/${(requestId)}`;
  }

  public editOrder(orderId: string | number): string {
    return `/#/edit-order/${(orderId)}`;
  }

  public editDelivery(deliveryId: string | number): string {
    return `/#/delivery/delivery/edit/${(deliveryId)}`;
  }

  public portCallDetails(portCallId: string | number): string {
    return `${this.baseHref}${KnownPrimaryRoutes.QuantityControl}/${KnownQuantityControlRoutes.Report}/${(portCallId)}`;
  }

  public editLabResults(labId: string | number): string {
    return `/#/labs/labresult/edit/${(labId)}`;
  }

  public editInvoice(invoiceId: string | number): string {
    return `/#/invoices/invoice/edit/${(invoiceId)}`;
  }

  public editReconListOrder(orderId: string | number): string {
    return `/#/recon/reconlist/edit/${(orderId)}`;
  }

  public editClaim(claimId: string | number): string {
    return `/#/claims/edit/${claimId}`;
  }
}
