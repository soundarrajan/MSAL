import { State } from '@ngxs/store';
import { QcReportsListState } from './reports-list/qc-reports-list.state';
import { QcReportState } from './report-view/qc-report.state';
import { IQcReportState } from './report-view/qc-report.state.model';

@State<IQuantityControlState>({
  name: 'quantityControl',
  children: [QcReportsListState, QcReportState]
})
export class QuantityControlState {
}

export interface IQuantityControlState {
  report: IQcReportState;
  portCallsList: Record<number, unknown>;
}

