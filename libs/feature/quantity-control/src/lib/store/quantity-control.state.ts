import { State } from '@ngxs/store';
import { QcReportsListState } from './reports-list/qc-reports-list.state';
import { IQcReportViewState } from './report-view/qc-report-details.state.model';
import { QcReportDetailsState } from './report-view/qc-report-details.state';

@State<IQuantityControlState>({
  name: 'quantityControl',
  children: [QcReportsListState, QcReportDetailsState]
})
export class QuantityControlState {}

export interface IQuantityControlState {
  portCallDetails: IQcReportViewState;
  portCallsList: Record<number, unknown>;
}

