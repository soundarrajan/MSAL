import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { KnownQuantityControlRoutes } from '../../../../../known-quantity-control.routes';
import { Observable, Subject } from 'rxjs';
import { QcSurveyHistoryListGridViewModel } from './view-model/qc-survey-history-list-grid.view-model';
import { Select } from '@ngxs/store';
import { QcReportState } from '../../../../../store/report/qc-report.state';

@Component({
  selector: 'shiptech-survey-report-history',
  templateUrl: './survey-report-history.component.html',
  styleUrls: ['./survey-report-history.component.scss'],
  providers: [QcSurveyHistoryListGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyReportHistoryComponent implements OnInit, OnDestroy {

  public reportDetailsRoutePath = `../${KnownQuantityControlRoutes.Report}`;

  @Select(QcReportState.nbOfMatched) nbOfMatched$: Observable<number>;
  @Select(QcReportState.nbOfMatchedWithinLimit) nbOfMatchedWithinLimit$: Observable<number>;
  @Select(QcReportState.nbOfNotMatched) nbOfNotMatched$: Observable<number>;

  knownRoutes = KnownQuantityControlRoutes;

  @ViewChild('popup', { static: false }) popupTemplate: TemplateRef<any>;
  private _destroy$ = new Subject();

  constructor(public gridViewModel: QcSurveyHistoryListGridViewModel) {
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
