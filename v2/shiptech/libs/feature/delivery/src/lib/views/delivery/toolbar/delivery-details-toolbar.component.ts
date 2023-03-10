import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { KnownDeliverylRoutes } from '../../../known-delivery.routes';
import { MenuItem } from 'primeng/api';
import { TabMenu } from 'primeng/tabmenu';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationError,
  Router
} from '@angular/router';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, finalize, takeUntil } from 'rxjs/operators';
import { NavBarApiService } from '@shiptech/core/services/navbar/navbar-api.service';
import { NavBar } from '../../../services/api/request-response/nav-bar-request-response';
import { AppConfig } from '@shiptech/core/config/app-config';
import { environment } from '@shiptech/environment';

@Component({
  selector: 'shiptech-delivery-details-toolbar',
  templateUrl: './delivery-details-toolbar.component.html',
  styleUrls: ['./delivery-details-toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DeliveryDetailsToolbarComponent
  implements OnInit, OnDestroy, AfterViewInit {
  navBar: any;
  deliveryId: any;
  navigationItems: any[];
  activeItemId: string;
  @Input('navBar') set _setNavBar(navBar) {
    if (!navBar) {
      return;
    }
    this.navBar = navBar;
    let params = {
      deliveryId: this.deliveryId
    };
    if (this.deliveryId) {
      this.setNavIds(params, this.navBar);
      this.createNavigationItems(this.navBar);
      this.markNavigationItems();
    }
  }

  public menuItems: MenuItem[];
  public deliveryTabs: MenuItem[];
  private navBarList: NavBar;

  @ViewChild(TabMenu, { static: false }) tabMenu: TabMenu;

  private _destroy$ = new Subject();
  private readonly baseOrigin: string;
  private isLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navBarService: NavBarApiService,
    private appConfig: AppConfig,
    private chRef: ChangeDetectorRef
  ) {
    this.baseOrigin = new URL(window.location.href).origin;
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this._destroy$)).subscribe(params => {
      let navBar = {
        deliveryId: params.deliveryId
      };
      this.activeItemId = 'delivery';
      this.deliveryId = params.deliveryId;
      this.setNavIds(params, this.navBar);
      this.createNavigationItems(this.navBar);
      this.markNavigationItems();
    });
  }

  setNavIds(params: any, navBarList: NavBar) {
    const deliveryId = params.deliveryId;
    const disabled = deliveryId === '0';
    const routeLinkToReportDetails = [
      '/',
      KnownPrimaryRoutes.Delivery,
      KnownDeliverylRoutes.Delivery,
      deliveryId
    ];
    this.menuItems = [
      {
        label: 'Main Page',
        routerLink: [
          ...routeLinkToReportDetails,
          KnownDeliverylRoutes.DeliveryDetails
        ],
        routerLinkActiveOptions: { exact: true },
        styleClass: 'details-tab'
      },
      {
        label: 'Documents',
        url: parseFloat(deliveryId)
          ? `${this.baseOrigin}/#/delivery/delivery/documents/${deliveryId}`
          : null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'tab'
      },
      {
        label: 'Audit Log',
        url: parseFloat(deliveryId)
          ? `${this.baseOrigin}/#/delivery/delivery/audit/${deliveryId}`
          : null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'tab'
      },
      {
        label: 'Email Log',
        url: parseFloat(deliveryId)
          ? `${this.baseOrigin}/#/delivery/delivery/email-log/${deliveryId}`
          : null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'tab'
      },
      {
        label: 'Seller Rating',
        url: null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'tab'
      }
    ];
    this.chRef.detectChanges();
  }

  createNavigationItems(payload) {
    // indexStatus = calculate if is previous, current or next
    if (typeof payload != 'undefined') {
    }

    var navigationItems = [
      {
        id: 'request',
        displayName: 'Request',
        url:
          typeof payload != 'undefined' && payload.requestId
            ? `${this.baseOrigin}/#/edit-request/${payload.requestId}`
            : '',
        entityId:
          typeof payload != 'undefined' && payload.requestId
            ? payload.requestId
            : '',
        indexStatus: null,
        hidden: false
      },
      {
        id: 'rfq',
        displayName:
          typeof payload != 'undefined' && payload.hasQuote ? 'Offer' : 'RFQ',
        url:
          typeof payload != 'undefined' && payload.requestGroupId
            ? `${this.baseOrigin}/#/group-of-requests/${payload.requestGroupId}`
            : '',
        entityId:
          typeof payload != 'undefined' && payload.requestGroupId
            ? payload.requestGroupId
            : '',
        indexStatus: null,
        hidden: false
      },
      {
        id: 'order',
        displayName: 'Order',
        url:
          typeof payload != 'undefined' && payload.orderId
            ? `${this.baseOrigin}/#/edit-order/${payload.orderId}`
            : '',
        entityId:
          typeof payload != 'undefined' && payload.orderId
            ? payload.orderId
            : '',
        indexStatus: null,
        hidden: false
      }
    ];
    var shiptechLiteTransactions;
    if (typeof payload != 'undefined' && payload.invoiceClaimDetailId) {
      shiptechLiteTransactions = [
        {
          id: 'contract',
          displayName: 'Contract',
          url:
            typeof payload != 'undefined' && payload.contractId
              ? `${this.baseOrigin}/v2/contracts/contract/${payload.contractId}/details`
              : '',
          entityId:
            typeof payload != 'undefined' && payload.contractId
              ? payload.contractId
              : '',
          indexStatus: null
        },
        {
          id: 'delivery',
          displayName: 'Delivery',
          url:
            typeof payload != 'undefined' && payload.deliveryId
              ? `${this.baseOrigin}/v2/delivery/delivery/${payload.deliveryId}/details`
              : '',
          entityId:
            typeof payload != 'undefined' && payload.deliveryId
              ? payload.deliveryId
              : '',
          indexStatus: null,
          hidden: false
        },
        {
          id: 'labs',
          displayName: 'Labs',
          url:
            typeof payload != 'undefined' && payload.labId
              ? `${this.baseOrigin}/#/labs/labresult/edit/${payload.labId}`
              : '',
          entityId:
            typeof payload != 'undefined' && payload.labId ? payload.labId : '',
          indexStatus: null,
          hidden: false
        },
        {
          id: 'claims',
          displayName: 'Claims',
          url:
            typeof payload != 'undefined' && payload.claimId
              ? `${this.baseOrigin}/#/claims/claim/edit/${payload.claimId}`
              : '',
          entityId:
            typeof payload != 'undefined' && payload.claimId
              ? payload.claimId
              : '',
          indexStatus: null,
          hidden: false
        },
        {
          id: 'invoices',
          displayName: 'Invoices',
          url:
            typeof payload != 'undefined' && payload.invoiceId
              ? `${this.baseOrigin}/v2/invoices/edit/${payload.invoiceId}`
              : '',
          entityId:
            typeof payload != 'undefined' && payload.invoiceId
              ? payload.invoiceId
              : '',
          indexStatus: null,
          hidden: false
        },
        {
          id: 'recon',
          displayName: 'Recon',
          url:
            typeof payload != 'undefined' && payload.orderId
              ? `${this.baseOrigin}/#/recon/reconlist/edit/${payload.orderId}`
              : '',
          entityId:
            typeof payload != 'undefined' && payload.orderId
              ? payload.orderId
              : '',
          indexStatus: null,
          hidden: false
        }
      ];
    } else {
      shiptechLiteTransactions = [
        {
          id: 'contract',
          displayName: 'Contract',
          url:
            typeof payload != 'undefined' && payload.contractId
              ? `${this.baseOrigin}/v2/contracts/contract/${payload.contractId}/details`
              : '',
          entityId:
            typeof payload != 'undefined' && payload.contractId
              ? payload.contractId
              : '',
          indexStatus: null
        },
        {
          id: 'delivery',
          displayName: 'Delivery',
          url:
            typeof payload != 'undefined' && payload.deliveryId
              ? `${this.baseOrigin}/v2/delivery/delivery/${payload.deliveryId}/details`
              : '',
          entityId:
            typeof payload != 'undefined' && payload.deliveryId
              ? payload.deliveryId
              : '',
          indexStatus: null,
          hidden: false
        },
        {
          id: 'labs',
          displayName: 'Labs',
          url:
            typeof payload != 'undefined' && payload.labId
              ? `${this.baseOrigin}/#/labs/labresult/edit/${payload.labId}`
              : '',
          entityId:
            typeof payload != 'undefined' && payload.labId ? payload.labId : '',
          indexStatus: null,
          hidden: false
        },
        {
          id: 'claims',
          displayName: 'Claims',
          url:
            typeof payload != 'undefined' && payload.claimId
              ? `${this.baseOrigin}/#/claims/claim/edit/${payload.claimId}`
              : '',
          entityId:
            typeof payload != 'undefined' && payload.claimId
              ? payload.claimId
              : '',
          indexStatus: null,
          hidden: false
        },
        {
          id: 'invoices',
          displayName: 'Invoices',
          url:
            typeof payload != 'undefined' && payload.invoiceId
              ? `${this.baseOrigin}/v2/invoices/edit/${payload.invoiceId}`
              : '',
          entityId:
            typeof payload != 'undefined' && payload.invoiceId
              ? payload.invoiceId
              : '',
          indexStatus: null,
          hidden: false
        },
        {
          id: 'recon',
          displayName: 'Recon',
          url:
            typeof payload != 'undefined' && payload.orderId
              ? `${this.baseOrigin}/#/recon/reconlist/edit/${payload.orderId}`
              : '',
          entityId:
            typeof payload != 'undefined' && payload.orderId
              ? payload.orderId
              : '',
          indexStatus: null,
          hidden: false
        }
      ];
    }
    this.navigationItems = [...navigationItems, ...shiptechLiteTransactions];
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

  ngAfterViewInit(): void {
    // Note: Workaround for p-tabMenu incorrectly setting the the active tab when navigation is cancelled (guards, unsaved changes, etc)
    // Note: See https://github.com/primefaces/primeng/issues/2681
    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationCancel ||
            event instanceof NavigationError
        ),
        takeUntil(this._destroy$)
      )
      .subscribe(() => (this.tabMenu.activeItem = undefined));
  }
}
