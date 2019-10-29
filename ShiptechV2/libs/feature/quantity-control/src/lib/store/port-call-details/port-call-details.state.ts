import { Action, createSelector, Select, Selector, State, StateContext } from '@ngxs/store';
import { IQuantityControlState } from '../quantity-control.state';
import { IPortCallDetailsState } from './port-call-details-state.model';
import { isAction } from '@shiptech/core/utils/ngxs-utils';
import {
  LoadPortCallDetailsAction,
  LoadPortCallDetailsFailedAction,
  LoadPortCallDetailsSuccessfulAction
} from './port-call-details.actions';
import { nameof } from '@shiptech/core/utils/type-definitions';
import _ from 'lodash';

@State<IPortCallDetailsState>({
  name: nameof<IQuantityControlState>('portCallDetails')
})
export class PortCallDetailsState {

  @Select()
  static getPortCallsProductTypesIds(state: IPortCallDetailsState): unknown[] {
    return state.products;
  }

  @Selector([PortCallDetailsState.getPortCallsProductTypesIds])
  static getSelectedPurchaseDeliveries(state: IPortCallDetailsState, productTypesIds: number[]): unknown[] {
    return productTypesIds.map(productTypeId => state.productsById[productTypeId]);
  }

  static getPortCallsProductTypeById(productTypeId: string): (...args: any[]) => unknown {
    return createSelector(
      [PortCallDetailsState],
      (state: IPortCallDetailsState) => state.productsById[productTypeId]
    );
  }

  @Action(LoadPortCallDetailsAction)
  loadPortCallDetails({ getState, patchState }: StateContext<IPortCallDetailsState>, { portCallId }: LoadPortCallDetailsAction): void {
    patchState({
      _isLoading: true,
      _hasLoaded: false,
      portCallId: portCallId
    });
  }

  @Action([LoadPortCallDetailsSuccessfulAction, LoadPortCallDetailsFailedAction])
  loadPortCallDetailsFinished({ getState, patchState }: StateContext<IPortCallDetailsState>, action: LoadPortCallDetailsSuccessfulAction | LoadPortCallDetailsFailedAction): void {
    if (isAction(action, LoadPortCallDetailsSuccessfulAction)) {
      const state = getState();
      const success = <LoadPortCallDetailsSuccessfulAction>action;

      patchState({
        _isLoading: false,
        _hasLoaded: true,
        portCallId: success.dto.portCallId,
        products: success.dto.productTypes.map(productType => productType.productTypeId),
        productsById: _.keyBy(success.dto.productTypes, productType => productType.productTypeId)
        // TODO: load other props
      });
    } else if (isAction(action, LoadPortCallDetailsFailedAction)) {
      patchState({
        _isLoading: false,
        _hasLoaded: false,
        portCallId: undefined
      });
    }
  }
}
