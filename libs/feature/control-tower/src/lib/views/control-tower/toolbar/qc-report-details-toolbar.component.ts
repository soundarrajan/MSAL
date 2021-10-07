import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { KnownControlTowerRoutes } from '../../../control-tower.routes';
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
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'shiptech-qc-report-details-toolbar',
  templateUrl: './qc-report-details-toolbar.component.html',
  styleUrls: ['./qc-report-details-toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class QcReportDetailsToolbarComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Select(QcReportState.isBusy) isBusy$: Observable<boolean>;
  public menuItems: MenuItem[];

  @ViewChild(TabMenu, { static: false }) tabMenu: TabMenu;

  private _destroy$ = new Subject();

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this._destroy$)).subscribe(params => {
      const reportId = params.reportId;
      const disabled = reportId === '0';
      const routeLinkToReportDetails = [
        '/',
        KnownPrimaryRoutes.QuantityControl,
        KnownControlTowerRoutes.Report,
        reportId
      ];
      this.menuItems = [
        {
          label: 'Main Page',
          routerLink: [
            ...routeLinkToReportDetails,
            KnownControlTowerRoutes.ReportDetails
          ],
          routerLinkActiveOptions: { exact: true }
        },
        {
          label: 'Documents',
          routerLink: [
            ...routeLinkToReportDetails,
            KnownControlTowerRoutes.ReportDocumentsPath
          ],
          routerLinkActiveOptions: { exact: true },
          disabled
        },
        {
          label: 'Email Log',
          routerLink: [
            ...routeLinkToReportDetails,
            KnownControlTowerRoutes.ReportEmailLogPath
          ],
          routerLinkActiveOptions: { exact: true },
          disabled
        },
        {
          label: 'Audit Log',
          routerLink: [
            ...routeLinkToReportDetails,
            KnownControlTowerRoutes.ReportAuditPath
          ],
          routerLinkActiveOptions: { exact: true },
          disabled
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
