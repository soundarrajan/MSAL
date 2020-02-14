import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { KnownQuantityControlRoutes } from '../../../../../known-quantity-control.routes';
import { Observable, Subject } from 'rxjs';
import { QcSurveyHistoryListGridViewModel } from './view-model/qc-survey-history-list-grid.view-model';
import { Select, Store } from '@ngxs/store';
import { QcReportState } from '../../../../../store/report/qc-report.state';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { ReconStatusLookup } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import { IReconStatusLookupDto } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'shiptech-survey-report-history',
  templateUrl: './survey-report-history.component.html',
  styleUrls: ['./survey-report-history.component.scss'],
  providers: [QcSurveyHistoryListGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SurveyReportHistoryComponent implements OnInit, OnDestroy {
  public reportDetailsRoutePath = `/${KnownPrimaryRoutes.QuantityControl}/${KnownQuantityControlRoutes.Report}`;

  @Select(QcReportState.nbOfMatched) nbOfMatched$: Observable<number>;
  @Select(QcReportState.nbOfMatchedWithinLimit)
  nbOfMatchedWithinLimit$: Observable<number>;
  @Select(QcReportState.nbOfNotMatched) nbOfNotMatched$: Observable<number>;

  matchStatus$: Observable<IReconStatusLookupDto>;

  knownRoutes = KnownQuantityControlRoutes;

  @ViewChild('popup', { static: false }) popupTemplate: TemplateRef<any>;
  private _destroy$ = new Subject();

  constructor(
    public gridViewModel: QcSurveyHistoryListGridViewModel,
    private store: Store,
    public reconStatusLookups: ReconStatusLookup
  ) {
    this.matchStatus$ = this.store
      .select(QcReportState.matchStatus)
      .pipe(map(s => reconStatusLookups.toReconStatus(s)));
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
