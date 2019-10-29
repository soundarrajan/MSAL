import { State } from '@ngxs/store';
import { QcReportsListState } from './reports-list/qc-reports-list.state';
import { IQcReportViewState } from './report-view/qc-report-view.state.model';
import { QcReportViewState } from './report-view/qc-report-view.state';

@State<IQuantityControlState>({
  name: 'quantityControl',
  children: [QcReportsListState, QcReportViewState]
})
export class QuantityControlState {}

export interface IQuantityControlState {
  portCallDetails: IQcReportViewState;
  portCallsList: Record<number, unknown>;
}

