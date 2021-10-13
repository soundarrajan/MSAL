import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { MessageBoxService } from '@shiptech/core/ui/components/message-box/message-box.service';
import { Observable, Subject } from 'rxjs';
import { Select } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { TypedRowNode } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { StatusLookup } from '@shiptech/core/lookups/known-lookups/status/status-lookup.service';
import { RowNode } from '@ag-grid-community/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ReconStatusLookup } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import { StatusLookupEnum } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { QcReportsListState } from 'libs/feature/quantity-control/src/lib/store/reports-list/qc-reports-list.state';
import { KnownControlTowerRoutes } from 'libs/feature/control-tower/src/lib/control-tower.routes';
import { QcReportService } from 'libs/feature/control-tower/src/lib/services/qc-report.service';
import { IQcReportsListItemDto } from 'libs/feature/control-tower/src/lib/services/api/dto/qc-reports-list-item.dto';
import { ControlTowerQuantityRobDifferenceListGridViewModel } from './view-model/control-tower-quantity-rob-difference-list-grid.view-model';
import { ControlTowerQuantityRobDifferenceListColumnServerKeys } from './view-model/control-tower-quantity-rob-difference-list.columns';

@Component({
  selector: 'shiptech-control-tower-quantity-rob-difference-list',
  templateUrl: './control-tower-quantity-rob-difference-list.component.html',
  styleUrls: ['./control-tower-quantity-rob-difference-list.component.scss'],
  providers: [ControlTowerQuantityRobDifferenceListGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlTowerQuantityRobDifferenceListComponent
  implements OnInit, OnDestroy {
  @Select(QcReportsListState.nbOfMatched) nbOfMatched$: Observable<number>;
  @Select(QcReportsListState.nbOfMatchedWithinLimit)
  nbOfMatchedWithinLimit$: Observable<number>;
  @Select(QcReportsListState.nbOfNotMatched) nbOfNotMatched$: Observable<
    number
  >;

  public reportDetailsRoutePath = `../${KnownControlTowerRoutes.Report}`;
  knownRoutes = KnownControlTowerRoutes;
  qcReportListServerKeys = ControlTowerQuantityRobDifferenceListColumnServerKeys;

  @ViewChild('popup', { static: false }) popupTemplate: TemplateRef<any>;
  private _destroy$ = new Subject();

  constructor(
    public gridViewModel: ControlTowerQuantityRobDifferenceListGridViewModel,
    public appConfig: AppConfig,
    public reconStatusLookups: ReconStatusLookup,
    private messageBox: MessageBoxService,
    private reportService: QcReportService,
    private toastr: ToastrService,
    private surveyStatusLookups: StatusLookup,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  showModal(data: any): void {
    this.messageBox.displayDialog(
      { data, width: '500px', height: '600px' },
      this.popupTemplate
    );
  }

  newReport(): void {
    this.router.navigate([this.reportDetailsRoutePath, 0], {
      relativeTo: this.activatedRoute
    });
  }

  verifyVessels(): void {
    const gridApi = this.gridViewModel.gridOptions.api;

    const selectedReports: TypedRowNode<IQcReportsListItemDto>[] =
      gridApi.getSelectedNodes() || [];

    if (!selectedReports.length) {
      this.toastr.warning('Please select at least one report.');
      return;
    }

    const reportIds = selectedReports.map(rowNode => rowNode.data.id);

    this.reportService.verifyVesselReports$(reportIds).subscribe(() => {
      gridApi.deselectAll();
      selectedReports.forEach(r =>
        r.updateData({
          ...r.data,
          surveyStatus: this.surveyStatusLookups.verified
        })
      );

      // Note: Force redraw of checkbox.
      gridApi.redrawRows({
        rowNodes: selectedReports as RowNode[]
      });

      this.toastr.success(`Report(s) have been marked for verification.`);
    });
  }

  openEmailPreview(): void {
    const gridApi = this.gridViewModel.gridOptions.api;

    const selectedReports: TypedRowNode<IQcReportsListItemDto>[] =
      gridApi.getSelectedNodes() || [];

    if (selectedReports.length !== 1) {
      this.toastr.warning('Please select one report.');
      return;
    }

    this.reportService
      .previewEmail$(
        selectedReports[0].data.id,
        selectedReports[0].data.emailTransactionTypeId
      )
      .subscribe();
  }

  ngOnInit(): void {}

  shouldShow(data: any): boolean {
    return data?.surveyStatus?.name !== StatusLookupEnum.Verified;
  }

  verifySludgeReport(item: IQcReportsListItemDto, isChecked: boolean): void {
    this.reportService.markSludgeVerification$(item.id, isChecked).subscribe();
  }

  print(): void {
    window.print();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  newFilters() {
    console.log(this.gridViewModel);
    this.gridViewModel.filterByStatus();
    // this.gridViewModel.serverSideGetRows(this.gridViewModel);
  }
}
