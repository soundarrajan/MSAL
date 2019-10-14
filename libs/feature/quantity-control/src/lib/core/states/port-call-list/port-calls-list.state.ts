import { State } from '@ngxs/store';
import { nameof } from '@shiptech/core';
import { IQuantityControlState } from '../quantity-control.state';
import { IPortCallsList, PortCallsListStateModel } from './port-calls-list.state.model';

@State<IPortCallsList>({
  name: nameof<IQuantityControlState>('portCallsList'),
  defaults: PortCallsListState.default
})
export class PortCallsListState {
  public static default: PortCallsListStateModel = new PortCallsListStateModel();
}
