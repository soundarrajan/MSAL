import { State } from '@ngxs/store';
import { nameof } from '@shiptech/core';
import { IQuantityControlState } from '../quantity-control.state';
import { IPortCallState } from './port-call.state.model';

@State<IPortCallState>({
  name: nameof<IQuantityControlState>('portCall')
})
export class PortCallState {
}
