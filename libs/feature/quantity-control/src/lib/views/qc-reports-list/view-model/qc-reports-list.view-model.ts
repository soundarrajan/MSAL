import { Injectable } from '@angular/core';
import { QcReportsListGridViewModel } from './qc-reports-list-grid.view-model';

@Injectable({
  providedIn: 'root'
})
export class QcReportsListViewModel {
  constructor(public gridViewModel: QcReportsListGridViewModel) {
  }
}
