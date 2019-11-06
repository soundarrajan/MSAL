import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { KnownQuantityControlRoutes } from '../../../../../known-quantity-control.routes';
import { Subject } from 'rxjs';
import { QcSurveyHistoryListViewModel } from './view-model/qc-survey-history-list-view-model';
import { QcSurveyHistoryListGridViewModel } from './view-model/qc-survey-history-list-grid.view-model';

@Component({
  selector: 'shiptech-survey-report-history',
  templateUrl: './survey-report-history.component.html',
  styleUrls: ['./survey-report-history.component.css'],
  providers: [QcSurveyHistoryListGridViewModel, QcSurveyHistoryListViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyReportHistoryComponent implements OnInit, OnDestroy {

  public reportDetailsRoutePath = `../${KnownQuantityControlRoutes.Report}`;
  knownRoutes = KnownQuantityControlRoutes;

  @ViewChild('popup', { static: false }) popupTemplate: TemplateRef<any>;
  private _destroy$ = new Subject();

  constructor(public viewModel: QcSurveyHistoryListViewModel) {
  }

  onPageChange(page: number): void {
    this.viewModel.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.viewModel.gridViewModel.pageSize = pageSize;
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
