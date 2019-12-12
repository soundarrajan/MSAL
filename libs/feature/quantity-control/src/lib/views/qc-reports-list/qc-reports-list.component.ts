import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { QcReportsListGridViewModel } from './view-model/qc-reports-list-grid.view-model';
import { MessageBoxService } from '@shiptech/core/ui/components/message-box/message-box.service';
import { Observable, Subject } from 'rxjs';
import { KnownQuantityControlRoutes } from '../../known-quantity-control.routes';
import { QcReportsListState } from '../../store/reports-list/qc-reports-list.state';
import { Select } from '@ngxs/store';
import { QcReportService } from '../../services/qc-report.service';
import { ToastrService } from 'ngx-toastr';
import { IQcReportsListItemDto } from '../../services/api/dto/qc-reports-list-item.dto';
import { TypedRowNode } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { SurveyStatusLookups } from '../../services/survey-status-lookups';
import { RowNode } from 'ag-grid-community';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'shiptech-port-calls-list',
  templateUrl: './qc-reports-list.component.html',
  styleUrls: ['./qc-reports-list.component.scss'],
  providers: [QcReportsListGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QcReportsListComponent implements OnInit, OnDestroy {

  @Select(QcReportsListState.nbOfMatched) nbOfMatched$: Observable<number>;
  @Select(QcReportsListState.nbOfMatchedWithinLimit) nbOfMatchedWithinLimit$: Observable<number>;
  @Select(QcReportsListState.nbOfNotMatched) nbOfNotMatched$: Observable<number>;

  public reportDetailsRoutePath = `../${KnownQuantityControlRoutes.Report}`;
  knownRoutes = KnownQuantityControlRoutes;

  @ViewChild('popup', { static: false }) popupTemplate: TemplateRef<any>;
  private _destroy$ = new Subject();

  constructor(public gridViewModel: QcReportsListGridViewModel,
              private messageBox: MessageBoxService,
              private reportService: QcReportService,
              private toastr: ToastrService,
              private surveyStatusLookups: SurveyStatusLookups,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  showModal(data: any): void {
    this.messageBox.displayDialog({ data, width: '500px', height: '600px' }, this.popupTemplate);
  }

  newReport(): void {
    this.router.navigate([this.reportDetailsRoutePath, 0], {relativeTo: this.activatedRoute});
  }

  verifyVessels(): void {
    const gridApi = this.gridViewModel.gridOptions.api;

    const selectedReports: TypedRowNode<IQcReportsListItemDto>[] = gridApi.getSelectedNodes() || [];

    if (!selectedReports.length) {
      this.toastr.warning('Please select at least one report.');
      return;
    }

    const reportIds = selectedReports.map(rowNode => rowNode.data.id);

    this.reportService.verifyVesselReports$(reportIds)
      .subscribe(() => {
        selectedReports.forEach(r => r.data.surveyStatus = this.surveyStatusLookups.verified);
        gridApi.redrawRows({
          rowNodes: selectedReports as RowNode[]
        });

        this.toastr.success(`Report(s) have been marked for verification.`);
      });
  }

  sendEmail(): void {
    const gridApi = this.gridViewModel.gridOptions.api;

    const selectedReports = gridApi.getSelectedNodes() || [];

    if (selectedReports.length !== 1) {
      this.toastr.warning('Please select one report.');
      return;
    }

    alert('Redirect to E-mail Preview');
  }

  ngOnInit(): void {
  }

  verifySludgeReport(item: IQcReportsListItemDto, isChecked: boolean): void {
    this.reportService.markSludgeVerification$(item.id, isChecked).subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
