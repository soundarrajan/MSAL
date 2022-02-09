import { HttpParams } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { GridOptions } from 'ag-grid-community';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { SetTenantConfigurations } from 'libs/feature/spot-negotiation/src/lib/store/actions/request-group-actions';
import { SpotNegotiationStoreModel } from 'libs/feature/spot-negotiation/src/lib/store/spot-negotiation.store';
import _ from 'lodash';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EmailPreviewPopupComponent } from '../spot-negotiation-popups/email-preview-popup/email-preview-popup.component';

@Component({
  selector: 'app-negotiation-report',
  templateUrl: './negotiation-report.component.html',
  styleUrls: ['./negotiation-report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NegotiationReportComponent implements OnInit {
  generalTenantSettings: any;
  reportUrl: any = '';
  tenantConfiguration: any;
  negotiationReportUrl: any;

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
    this.getTenantConfiguration();
  }

  getTenantConfiguration(): void {
    const response = this.spotNegotiationService.getTenantConfiguration();
    response.subscribe((res: any) => {
      if (res.error) {
        this.toastr.error(res.error);
        return;
      } else {
        // Populate Store

        this.store.dispatch(
          new SetTenantConfigurations(res.tenantConfiguration)
        );
        this.tenantConfiguration = _.cloneDeep(res.tenantConfiguration);
        this.negotiationReportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.tenantConfiguration.negotiationReportUrl
        );
      }
    });
  }

  transform() {}
}
