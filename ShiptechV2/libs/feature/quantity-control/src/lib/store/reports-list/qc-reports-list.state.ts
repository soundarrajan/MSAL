import { State } from '@ngxs/store';
import { IQuantityControlState } from '../quantity-control.state';
import { IQcReportsListState, QcReportsListStateModel } from './qc-reports-list.state.model';
import { nameof } from '@shiptech/core/utils/type-definitions';

@State<IQcReportsListState>({
  name: nameof<IQuantityControlState>('portCallsList'),
  defaults: QcReportsListState.default
})
export class QcReportsListState {
  public static default: QcReportsListStateModel = new QcReportsListStateModel();
}
