import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { GridOptions } from 'ag-grid-community';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { SpotNegotiationStoreModel } from 'libs/feature/spot-negotiation/src/lib/store/spot-negotiation.store';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EmailPreviewPopupComponent } from '../spot-negotiation-popups/email-preview-popup/email-preview-popup.component';

@Component({
  selector: 'app-negotiation-report',
  templateUrl: './negotiation-report.component.html',
  styleUrls: ['./negotiation-report.component.css']
})
export class NegotiationReportComponent implements OnInit {
  generalTenantSettings: any;
  reportUrl: any = '';
  tenantConfiguration: any;

  constructor(
    public dialog: MatDialog,
    private spotNegotiationService: SpotNegotiationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private store: Store,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.store.subscribe(({ spotNegotiation }) => {
      this.tenantConfiguration = spotNegotiation.tenantConfigurations;
      console.log(this.tenantConfiguration);
      this.reportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.tenantConfiguration.reportUrl
      );
      this.changeDetectorRef.detectChanges();
    });
  }

  transform() {}
}
