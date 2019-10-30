import { Component, OnInit } from '@angular/core';
import { KnownQuantityControlRoutes } from '../../../known-quantity-control.routes';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';

@Component({
  selector: 'shiptech-qc-report-details-toolbar',
  templateUrl: './qc-report-details-toolbar.component.html',
  styleUrls: ['./qc-report-details-toolbar.component.css']
})
export class QcReportDetailsToolbarComponent implements OnInit {

  public menuItems: MenuItem[];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // Note: ReportId is set by QcReportDetailsRouteResolver
    const reportId = this.route.snapshot.data[KnownQuantityControlRoutes.ReportIdParam];
    const routeLinkToReportDetails = ['/', KnownPrimaryRoutes.QuantityControl, KnownQuantityControlRoutes.ReportDetails, reportId];

    this.menuItems = [
      {
        label: 'Main Page',
        routerLink: routeLinkToReportDetails,
        routerLinkActiveOptions: { exact: true }
      },
      {
        label: 'Documents',
        routerLink: [...routeLinkToReportDetails, KnownQuantityControlRoutes.ReportDocumentsPath],
        routerLinkActiveOptions: { exact: true }
      },
      {
        label: 'E-mail Log',
        routerLink: [...routeLinkToReportDetails, KnownQuantityControlRoutes.ReportEmailLogPath],
        routerLinkActiveOptions: { exact: true }
      },
      {
        label: 'Audit Log',
        routerLink: [...routeLinkToReportDetails, KnownQuantityControlRoutes.ReportAuditPath],
        routerLinkActiveOptions: { exact: true }
      },
    ];
  }

}
