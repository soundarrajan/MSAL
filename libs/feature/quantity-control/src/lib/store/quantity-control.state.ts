import { State } from '@ngxs/store';
import { PortCallsListState } from './port-call-list/port-calls-list.state';
import { IPortCallDetailsState} from './port-call-details/port-call-details-state.model';
import { PortCallDetailsState } from './port-call-details/port-call-details.state';

@State<IQuantityControlState>({
  name: 'quantityControl',
  children: [PortCallsListState, PortCallDetailsState]
})
export class QuantityControlState {}

export interface IQuantityControlState {
  portCallDetails: IPortCallDetailsState;
  portCallsList: Record<number, unknown>;
}

