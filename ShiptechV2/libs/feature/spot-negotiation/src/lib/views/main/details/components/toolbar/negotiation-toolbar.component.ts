import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { KnownSpotNegotiationRoutes } from 'libs/feature/spot-negotiation/src/lib/known-spot-negotiation.routes';

@Component({
  selector: 'shiptech-negotiation-toolbar',
  templateUrl: './negotiation-toolbar.component.html',
  styleUrls: ['./negotiation-toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class NegotiationToolbarComponent
  implements OnInit, OnDestroy, AfterViewInit {
  public menuItems: any[];
  activeTab: any;

  @Input('activeTab') set _setActiveTab(activeTab) {
    this.activeTab = activeTab;
  }
  @ViewChild(TabMenu, { static: false }) tabMenu: TabMenu;

  private _destroy$ = new Subject();
  baseOrigin: string;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.baseOrigin = new URL(window.location.href).origin;
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this._destroy$)).subscribe(params => {
      const negotiationId = params.spotNegotiationId;
      const disabled = negotiationId === '0';
      this.menuItems = [
        {
          label: 'Negotiation',
          url: parseFloat(negotiationId)
            ? `${this.baseOrigin}/v2/group-of-requests/${negotiationId}`
            : null,
          routerLinkActiveOptions: { exact: true },
          disabled,
          styleClass: 'tab',
          activeTab: false
        },
        {
          label: 'Report',
          url: parseFloat(negotiationId)
            ? `${this.baseOrigin}/v2/group-of-requests/${negotiationId}/report`
            : null,
          routerLinkActiveOptions: { exact: true },
          disabled,
          styleClass: 'tab',
          activeTab: this.activeTab == 'report' ? true : false
        },
        {
          label: 'Documents',
          url: parseFloat(negotiationId)
            ? `${this.baseOrigin}/v2/group-of-requests/${negotiationId}/documents`
            : null,
          routerLinkActiveOptions: { exact: true },
          disabled,
          styleClass: 'tab',
          activeTab: this.activeTab == 'documents' ? true : false
        },
        {
          label: 'Email Log',
          url: parseFloat(negotiationId)
            ? `${this.baseOrigin}/v2/group-of-requests/${negotiationId}/email-log`
            : null,
          routerLinkActiveOptions: { exact: true },
          disabled,
          styleClass: 'tab',
          activeTab: this.activeTab == 'email' ? true : false
        }
      ];
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
