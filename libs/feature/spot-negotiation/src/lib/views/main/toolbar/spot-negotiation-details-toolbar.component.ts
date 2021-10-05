import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';


@Component({
  selector: 'shiptech-negotiation-details-toolbar',
  templateUrl: './spot-negotiation-details-toolbar.component.html',
  styleUrls: ['./spot-negotiation-details-toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class NegotiationDetailsToolbarComponent implements OnInit {
  navBar: any;
  navigationItems: any;
  activeItemId: string;
  private _destroy$ = new Subject();
  private readonly baseOrigin: string;

  @Input('navBar') set _setNavBar(navBar: any) {
    if (!navBar) {
      return;
    }
    this.navBar = navBar;
  }

  constructor(private chRef: ChangeDetectorRef) {
    this.baseOrigin = new URL(window.location.href).origin;
  }

  ngOnInit(): void {
    this.activeItemId = 'rfq';

    this.createNavigationItems(this.navBar);
    this.markNavigationItems();
  }

  createNavigationItems(payload: any) {
    // indexStatus = calculate if is previous, current or next
    if (typeof payload != 'undefined') {
      var navigationItems = [
        {
          id: 'request',
          displayName: 'Request',
          url: payload.requestId ? `${this.baseOrigin}/#/edit-request/${payload.requestId}` : '',
          entityId: payload.requestId ? payload.requestId : '',
          indexStatus: null,
          hidden: false
        },
        {
          id: 'rfq',
          displayName: payload.hasQuote ? 'Offer' : 'RFQ',
          url: payload.requestGroupId ? `${this.baseOrigin}/v2/group-of-requests/${payload.requestGroupId}/details` : '',
          entityId: payload.requestGroupId ? payload.requestGroupId : '',
          indexStatus: null,
          hidden: false
        },
        {
          id: 'order',
          displayName: 'Order',
          url: payload.orderId ? `${this.baseOrigin}/#/edit-order/${payload.orderId}` : '',
          entityId: payload.orderId ? payload.orderId : '',
          indexStatus: null,
          hidden: false
        },
        {
          id: 'contract',
          displayName: 'Contract',
          url: payload.contractId ? `${this.baseOrigin}/v2/contracts/contract/${payload.contractId}/details` : '',
          entityId: payload.contractId ? payload.contractId: '',
          indexStatus: null
        },
        {
          id: 'delivery',
          displayName: 'Delivery',
          url: payload.deliveryId ? `${this.baseOrigin}/v2/delivery/delivery/${payload.deliveryId}/details`: '',
          entityId: payload.deliveryId ? payload.deliveryId: '',
          indexStatus: null,
          hidden: false
        },
        {
          id: 'labs',
          displayName: 'Labs',
          url: payload.labId ? `${this.baseOrigin}/#/labs/labresult/edit/${payload.labId}` : '',
          entityId: payload.labId ? payload.labId : '',
          indexStatus: null,
          hidden: false
        },
        {
          id: 'claims',
          displayName: 'Claims',
          url: payload.claimId ? `${this.baseOrigin}/#/claims/claim/edit/${payload.claimId}` : '',
          entityId: payload.claimId ? payload.claimId : '',
          indexStatus: null,
          hidden: false
        },
        {
          id: 'invoices',
          displayName: 'Invoices',
          url: payload.invoiceId ? `${this.baseOrigin}/v2/invoices/edit/${payload.invoiceId}` : '',
          entityId: payload.invoiceId ? payload.invoiceId : '',
          indexStatus: null,
          hidden: false
        },
        {
          id: 'recon',
          displayName: 'Recon',
          url: payload.orderId ? `${this.baseOrigin}/#/recon/reconlist/edit/${payload.orderId}` : '',
          entityId: payload.orderId ? payload.orderId : '',
          indexStatus: null,
          hidden: false
        }
      ];
    }

    this.navigationItems = [...navigationItems];
    this.chRef.detectChanges();
  }

  markNavigationItems() {
    let activeItemIndex = -1;
    this.navigationItems.forEach((itemVal, itemKey) => {
      if (itemVal.id == this.activeItemId) {
        itemVal.indexStatus = 'navigationBar-active';
        activeItemIndex = itemKey;
      }
    });
    this.navigationItems.forEach((itemVal, itemKey) => {
      if (itemKey < activeItemIndex) {
        itemVal.indexStatus = 'navigationBar-previous';
      }
      if (itemKey > activeItemIndex) {
        itemVal.indexStatus = 'navigationBar-next';
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
