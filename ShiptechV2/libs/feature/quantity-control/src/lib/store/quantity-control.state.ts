import { State } from '@ngxs/store';
import { QcReportsListState } from './reports-list/qc-reports-list.state';
import { IQcReportDetailsState } from './report-view/qc-report-details.state.model';
import { QcReportDetailsState } from './report-view/qc-report-details.state';

@State<IQuantityControlState>({
  name: 'quantityControl',
  children: [QcReportsListState, QcReportDetailsState]
})
export class QuantityControlState {}

export interface IQuantityControlState {
  portCallDetails: IQcReportDetailsState;
  portCallsList: Record<number, unknown>;
}

