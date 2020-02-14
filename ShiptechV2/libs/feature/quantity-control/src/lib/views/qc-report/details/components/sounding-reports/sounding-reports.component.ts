import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { QcSoundingReportListGridViewModel } from './view-model/grid-view-model';
import { Subject } from 'rxjs';

@Component({
  selector: 'shiptech-sounding-reports',
  templateUrl: './sounding-reports.component.html',
  styleUrls: ['./sounding-reports.component.scss'],
  providers: [QcSoundingReportListGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoundingReportsComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject();

  constructor(public gridViewModel: QcSoundingReportListGridViewModel) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
