import { Injectable } from '@angular/core';
import { QcSurveyHistoryListGridViewModel } from './qc-survey-history-list-grid.view-model';

@Injectable({
  providedIn: 'root'
})
export class QcSurveyHistoryListViewModel {
  constructor(public gridViewModel: QcSurveyHistoryListGridViewModel) {
  }
}
