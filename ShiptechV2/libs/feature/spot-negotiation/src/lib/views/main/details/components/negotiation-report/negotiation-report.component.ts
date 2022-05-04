import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { SetTenantConfigurations } from 'libs/feature/spot-negotiation/src/lib/store/actions/request-group-actions';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private store: Store
  ) {}
  ngOnInit(): void {
    this.getTenantConfiguration();
  }

  getTenantConfiguration(): void {
    const response = this.spotNegotiationService.getTenantConfiguration();
    response.subscribe((res: any) => {
      if (res?.message == 'Unauthorized') {
        return;
      }
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
