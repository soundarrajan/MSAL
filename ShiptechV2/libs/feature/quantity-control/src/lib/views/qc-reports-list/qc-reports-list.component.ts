import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { QcReportsListGridViewModel } from './view-model/qc-reports-list-grid.view-model';
import { MessageBoxService } from '@shiptech/core/ui/components/message-box/message-box.service';
import { QcReportsListViewModel } from './view-model/qc-reports-list.view-model';
import { Observable, Subject } from 'rxjs';
import { KnownQuantityControlRoutes } from '../../known-quantity-control.routes';
import { QcReportsListState } from '../../store/reports-list/qc-reports-list.state';
import { IQcReportListSummaryState } from '../../store/reports-list/qc-report-list-summary/qc-report-list-summary.state';
import { Select } from '@ngxs/store';

@Component({
  selector: 'shiptech-port-calls-list',
  templateUrl: './qc-reports-list.component.html',
  styleUrls: ['./qc-reports-list.component.scss'],
  providers: [QcReportsListGridViewModel, QcReportsListViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QcReportsListComponent implements OnInit, OnDestroy {

  @Select(QcReportsListState.getReportsListSummary) summary$: Observable<IQcReportListSummaryState>;

  public reportDetailsRoutePath = `../${KnownQuantityControlRoutes.Report}`;
  knownRoutes = KnownQuantityControlRoutes;

  @ViewChild('popup', {static: false}) popupTemplate: TemplateRef<any>;
  private _destroy$ = new Subject();

  constructor(public viewModel: QcReportsListViewModel, private messageBox: MessageBoxService) {
  }

  onPageChange(page: number): void {
    this.viewModel.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.viewModel.gridViewModel.pageSize = pageSize;
  }

  showModal(data: any): void {
    this.messageBox.displayDialog({data, width: '500px', height: '600px'}, this.popupTemplate);
  }

  watchVesselWithId(vesselId: number): void {
    alert('Not implemented');
  }

  raiseClaim(): void {
    alert('Not implemented');
  }

  verifyVessels(): void {
    alert('Not implemented');
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
