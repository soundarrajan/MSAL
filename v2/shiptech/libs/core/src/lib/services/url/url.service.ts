import { Inject, Injectable } from '@angular/core';
import { ILogger } from '@shiptech/core/logging/logger';
import { LoggerFactory } from '@shiptech/core/logging/logger-factory.service';
import { AppConfig } from '@shiptech/core/config/app-config';
import { APP_BASE_HREF } from '@angular/common';
import { KnownQuantityControlRoutes } from '../../../../../feature/quantity-control/src/lib/known-quantity-control.routes';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { environment } from '@shiptech/environment';
import { toQueryString } from '@shiptech/core/utils/QueryString';

@Injectable({
  providedIn: 'root'
})
// noinspection JSUnusedGlobalSymbols
export class UrlService {
  private logger: ILogger;

  private readonly baseOrigin: string;

  constructor(
    private appConfig: AppConfig,
    loggerFactory: LoggerFactory,
    @Inject(APP_BASE_HREF) private baseHref: string
  ) {
    this.logger = loggerFactory.createLogger(UrlService.name);

    if (!environment.production) {
      this.baseOrigin =
        appConfig.baseOrigin || new URL(window.location.href).origin;
    } else {
      this.baseOrigin = new URL(window.location.href).origin;
    }
  }

  public editRequest(requestId: string | number): string {
    return `${this.baseOrigin}/#/edit-request/${requestId}`;
  }

  public getRuntimeSettings(): string {
    return `${this.baseHref}assets/config/settings.runtime.json`;
  }

  public getLegacySettings(): string {
    var hostName = window.location.hostname;
    var config = "/config/" + hostName + ".json"
    if (["localhost"].indexOf(hostName) != -1) {
        config = "/config/config.json";
    }
    return config;
  }

  public offer(requestId: string | number): string {
    return `${this.baseOrigin}/#/group-of-requests/${requestId}`;
  }

  public editOrder(orderId: string | number): string {
    return `${this.baseOrigin}/#/edit-order/${orderId}`;
  }

  public editReport(reportId: string | number): string {
    return `${this.baseOrigin}/v2/quantity-control/report/${reportId}/details`;
  }

  public editDelivery(deliveryId: string | number): string {
    return `${this.baseOrigin}/#/delivery/delivery/edit/${deliveryId}`;
  }

  public portCallDetails(portCallId: string | number): string {
    return `${this.baseHref}${KnownPrimaryRoutes.QuantityControl}/${KnownQuantityControlRoutes.Report}/${portCallId}`;
  }

  public editLabResults(labId: string | number): string {
    return `${this.baseOrigin}/#/labs/labresult/edit/${labId}`;
  }

  public editInvoice(invoiceId: string | number): string {
    return `${this.baseOrigin}/v2/invoices/edit/${invoiceId}`;
  }

  public editReconListOrder(orderId: string | number): string {
    return `${this.baseOrigin}/#/recon/reconlist/edit/${orderId}`;
  }

  public editClaim(claimId: string | number): string {
    return `${this.baseOrigin}/#/claims/claim/edit/${claimId}`;
  }

  public newClaim(orderProductId?: number, orderId?: number): string {
    return `${this.baseOrigin}/#/claims/claim/edit/?orderId=${orderId}&orderProductId=${orderProductId}`;
  }

  previewEmail(queryParams: Record<string, any>): string {
    return `${this.baseOrigin}/#/preview-email?${toQueryString(queryParams)}`;
  }

  editEmail(emailId: number): string {
    return `${this.baseOrigin}/#/masters/emaillogs/edit/${emailId}`;
  }

  editContract(contractId: number): string {
    return `${this.baseOrigin}/#/contracts/contract/edit/${contractId}`;
  }
}
