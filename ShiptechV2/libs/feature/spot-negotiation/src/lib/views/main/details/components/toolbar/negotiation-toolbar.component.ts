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
import { MenuItem } from 'primeng/api';
import { TabMenu } from 'primeng/tabmenu';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationError,
  Router
} from '@angular/router';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { KnownSpotNegotiationRoutes } from 'libs/feature/spot-negotiation/src/lib/known-spot-negotiation.routes';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SetTenantConfigurations } from 'libs/feature/spot-negotiation/src/lib/store/actions/request-group-actions';
import _ from 'lodash';

@Component({
  selector: 'shiptech-negotiation-toolbar',
  templateUrl: './negotiation-toolbar.component.html',
  styleUrls: ['./negotiation-toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NegotiationToolbarComponent
  implements OnInit, OnDestroy, AfterViewInit {
  public menuItems: any[];
  activeTab: any;
  negotiationId: any;
  disabled: boolean;
  tenantConfiguration: any;

  @Input('activeTab') set _setActiveTab(activeTab) {
    this.activeTab = activeTab;
  }
  @ViewChild(TabMenu, { static: false }) tabMenu: TabMenu;

  private _destroy$ = new Subject();
  baseOrigin: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotNegotiationService: SpotNegotiationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private store: Store,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.baseOrigin = new URL(window.location.href).origin;
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this._destroy$)).subscribe(params => {
      this.negotiationId = params.spotNegotiationId;
      this.disabled = this.negotiationId === '0';
      this.createMenuItems();
    });
    this.getTenantConfiguration();
  }

  getTenantConfiguration(): void {
    const response = this.spotNegotiationService.getTenantConfiguration();
    response.subscribe((res: any) => {
      if (res.error) {
        this.toastr.error(res.error);
        return;
      } else {
        console.log(res);
        // Populate Store

        this.store.dispatch(
          new SetTenantConfigurations(res.tenantConfiguration)
        );
        this.tenantConfiguration = _.cloneDeep(res.tenantConfiguration);
        this.createMenuItems();
      }
    });
  }

  createMenuItems() {
    const routeLinkToNegotiationDetails = [
      '/',
      KnownPrimaryRoutes.SpotNegotiation,
      this.negotiationId
    ];
    let disabled = !this.tenantConfiguration?.isNegotiationReport;
    this.menuItems = [
      {
        label: 'Main Page',
        routerLink: [
          ...routeLinkToNegotiationDetails,
          KnownSpotNegotiationRoutes.details
        ],
        routerLinkActiveOptions: { exact: true }
      },
      {
        label: 'Report',
        routerLink: disabled
          ? null
          : [
              ...routeLinkToNegotiationDetails,
              KnownSpotNegotiationRoutes.reportPath
            ],
        routerLinkActiveOptions: { exact: true },
        disabled
      },
      {
        label: 'Documents',
        routerLink: [
          ...routeLinkToNegotiationDetails,
          KnownSpotNegotiationRoutes.documentsPath
        ],
        routerLinkActiveOptions: { exact: true }
      },
      {
        label: 'Email Log',
        routerLink: [
          ...routeLinkToNegotiationDetails,
          KnownSpotNegotiationRoutes.emailLog
        ],
        routerLinkActiveOptions: { exact: true }
      }
    ];
    this.changeDetectorRef.detectChanges();
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
