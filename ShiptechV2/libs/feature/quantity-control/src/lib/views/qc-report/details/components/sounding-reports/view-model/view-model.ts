import { Injectable } from '@angular/core';
import { QcSoundingReportListGridViewModel } from './grid-view-model';

@Injectable({
  providedIn: 'root'
})
export class SoundingReportListViewModel {
  constructor(public gridViewModel: QcSoundingReportListGridViewModel) {
  }
}
