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
import { QcReportState } from '../../../store/report/qc-report.state';
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
  @Input('navBar') set _setNavBar(navBar) { 
    if (!navBar) {
      return;
    } 
    this.navBar = navBar;
    if (this.deliveryId) {
      this.setNavIds(this.deliveryId, this.navBar);
    }
  }
  
  @Select(QcReportState.isBusy) isBusy$: Observable<boolean>;
  public menuItems: MenuItem[];
  public deliveryTabs: MenuItem[];
  private navBarList: NavBar;

  @ViewChild(TabMenu, { static: false }) tabMenu: TabMenu;

  private _destroy$ = new Subject();
  private readonly baseOrigin: string;
  private isLoading: boolean;

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private navBarService: NavBarApiService, 
              private appConfig: AppConfig,
              private chRef: ChangeDetectorRef) {
    if (!environment.production) {
      this.baseOrigin =
        appConfig.baseOrigin || new URL(window.location.href).origin;
    } else {
      this.baseOrigin = new URL(window.location.href).origin;
    }
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this._destroy$)).subscribe(params => {
      let navBar = {
        'deliveryId': params.deliveryId
      };
      this.deliveryId = params.deliveryId;
      this.setNavIds(params, this.navBar);
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
        label: 'Request',
        routerLink: typeof navBarList != 'undefined' && navBarList.requestId ? `${this.baseOrigin}/#/edit-request/${ navBarList.requestId}` : null,
        routerLinkActiveOptions: { exact: true },
        styleClass: 'delivery-menu-tab request'
      },
      {
        label: 'Contract',
        routerLink: typeof navBarList != 'undefined' && navBarList.contractId ? `${this.baseOrigin}/#/contracts/contract/edit/${ navBarList.contractId}` : null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'delivery-menu-tab contract'
      },
      {
        label: 'RFQ',
        routerLink: typeof navBarList != 'undefined' && navBarList.requestGroupId ? `${this.baseOrigin}/#/group-of-requests/${ navBarList.requestGroupId}` : null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'delivery-menu-tab rfq'
      },
      {
        label: 'Order',
        routerLink: typeof navBarList != 'undefined' && navBarList.orderId ? `${this.baseOrigin}/#/edit-order/${ navBarList.orderId}` : null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'delivery-menu-tab order'
      },
      {
        label: 'Delivery',
        routerLink: typeof navBarList != 'undefined' && navBarList.deliveryId ? `${this.baseOrigin}/#/delivery/delivery/edit/${ navBarList.deliveryId}` : null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'delivery-active-tab delivery'
      },
      {
        label: 'Lab',
        routerLink: typeof navBarList != 'undefined' && navBarList.labId ? `${this.baseOrigin}/#/labs/labresult/edit/${ navBarList.labId}` : null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'delivery-menu-tab lab'
      },
      {
        label: 'Claims',
        routerLink: typeof navBarList != 'undefined' && navBarList.claimId ? `${this.baseOrigin}/#/claims/claim/edit/${ navBarList.claimId}` : null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'delivery-menu-tab claims'
      },
      {
        label: 'Invoices',
        routerLink: typeof navBarList != 'undefined' && navBarList.invoiceId ? `${this.baseOrigin}/#/invoices/claims/edit/${ navBarList.invoiceId}` : null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'delivery-menu-tab invoices'
      },
      {
        label: 'Recon',
        routerLink: typeof navBarList != 'undefined' && navBarList.orderId ? `${this.baseOrigin}/#/recon/reconlist/edit/${ navBarList.orderId}` : null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'delivery-menu-tab recon'
      }
    ];
    this.deliveryTabs = [
      {
        label: 'Details',
        routerLink: [
          ...routeLinkToReportDetails,
          KnownDeliverylRoutes.DeliveryDetails
        ],
        routerLinkActiveOptions: { exact: true },
        styleClass: 'details-tab'
      },
      {
        label: 'Documents',
        routerLink: parseFloat(deliveryId) ? `${this.baseOrigin}/#/delivery/delivery/documents/${deliveryId}` : null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'tab'
      },
      {
        label: 'Audit Log',
        routerLink: parseFloat(deliveryId) ? `${this.baseOrigin}/#/delivery/delivery/audit/${deliveryId}` : null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'tab'
      },
      {
        label: 'Email Log',
        routerLink: parseFloat(deliveryId) ? `${this.baseOrigin}/#/delivery/delivery/email-log/${deliveryId}` : null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'tab'
      },
      {
        label: 'Seller Rating',
        routerLink: null,
        routerLinkActiveOptions: { exact: true },
        disabled,
        styleClass: 'tab'
      }
    ];
    this.chRef.detectChanges();
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
