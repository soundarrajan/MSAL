import { State } from '@ngxs/store';
import { PortCallsListState } from './port-call-list/port-calls-list.state';
import { IPortCallState} from './port-call/port-call.state.model';
import { PortCallState } from './port-call/port-call.state';

@State<IQuantityControlState>({
  name: 'quantityControl',
  children: [PortCallsListState, PortCallState]
})
export class QuantityControlState {}

export interface IQuantityControlState {
  portCall: IPortCallState;
  portCallsList: Record<number, unknown>;
}

