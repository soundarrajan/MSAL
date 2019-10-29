import { Action, createSelector, Select, Selector, State, StateContext } from '@ngxs/store';
import { IQuantityControlState } from '../quantity-control.state';
import { IQcReportViewState } from './qc-report-view.state.model';
import { isAction } from '@shiptech/core/utils/ngxs-utils';
import {
  LoadReportViewAction,
  LoadReportViewFailedAction,
  LoadReportViewSuccessfulAction
} from './qc-report-view.actions';
import { nameof } from '@shiptech/core/utils/type-definitions';
import _ from 'lodash';

@State<IQcReportViewState>({
  name: nameof<IQuantityControlState>('portCallDetails')
})
export class QcReportViewState {

  @Select()
  static getPortCallsProductTypesIds(state: IQcReportViewState): unknown[] {
    return state.products;
  }

  @Selector([QcReportViewState.getPortCallsProductTypesIds])
  static getSelectedPurchaseDeliveries(state: IQcReportViewState, productTypesIds: number[]): unknown[] {
    return productTypesIds.map(productTypeId => state.productsById[productTypeId]);
  }

  static getPortCallsProductTypeById(productTypeId: string): (...args: any[]) => unknown {
    return createSelector(
      [QcReportViewState],
      (state: IQcReportViewState) => state.productsById[productTypeId]
    );
  }

  @Action(LoadReportViewAction)
  loadPortCallDetails({ getState, patchState }: StateContext<IQcReportViewState>, { reportId }: LoadReportViewAction): void {
    patchState({
      _isLoading: true,
      _hasLoaded: false,
      portCallId: reportId
    });
  }

  @Action([LoadReportViewSuccessfulAction, LoadReportViewFailedAction])
  loadPortCallDetailsFinished({ getState, patchState }: StateContext<IQcReportViewState>, action: LoadReportViewSuccessfulAction | LoadReportViewFailedAction): void {
    if (isAction(action, LoadReportViewSuccessfulAction)) {
      const state = getState();
      const success = <LoadReportViewSuccessfulAction>action;

      patchState({
        _isLoading: false,
        _hasLoaded: true,
        portCallId: success.dto.portCallId,
        products: success.dto.productTypes.map(productType => productType.productTypeId),
        productsById: _.keyBy(success.dto.productTypes, productType => productType.productTypeId)
        // TODO: load other props
      });
    } else if (isAction(action, LoadReportViewFailedAction)) {
      patchState({
        _isLoading: false,
        _hasLoaded: false,
        portCallId: undefined
      });
    }
  }
}
