import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { SoundingReportListViewModel } from './view-model/view-model';
import { QcSoundingReportListGridViewModel } from './view-model/grid-view-model';
import { Subject } from 'rxjs';
import { QcSoundingReportDetailsGridViewModel } from './view-model/details-grid-view-model';

@Component({
  selector: 'shiptech-sounding-reports',
  templateUrl: './sounding-reports.component.html',
  styleUrls: ['./sounding-reports.component.scss'],
  providers: [QcSoundingReportListGridViewModel, SoundingReportListViewModel, QcSoundingReportDetailsGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoundingReportsComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject();

  constructor(public viewModel: SoundingReportListViewModel) {
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
