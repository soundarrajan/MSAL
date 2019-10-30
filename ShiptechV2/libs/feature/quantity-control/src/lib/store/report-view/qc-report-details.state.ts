import { Action, createSelector, Select, Selector, State, StateContext } from '@ngxs/store';
import { IQuantityControlState } from '../quantity-control.state';
import { IQcReportDetailsState } from './qc-report-details.state.model';
import { isAction } from '@shiptech/core/utils/ngxs-utils';
import {
  LoadReportDetailsAction,
  LoadReportDetailsFailedAction,
  LoadReportDetailsSuccessfulAction
} from './qc-report-details.actions';
import { nameof } from '@shiptech/core/utils/type-definitions';
import _ from 'lodash';

@State<IQcReportDetailsState>({
  name: nameof<IQuantityControlState>('portCallDetails')
})
export class QcReportDetailsState {

  @Select()
  static getPortCallsProductTypesIds(state: IQcReportDetailsState): unknown[] {
    return state.productTypes;
  }

  @Selector([QcReportDetailsState.getPortCallsProductTypesIds])
  static getSelectedPurchaseDeliveries(state: IQcReportDetailsState, productTypesIds: number[]): unknown[] {
    return productTypesIds.map(productTypeId => state.productTypesById[productTypeId]);
  }

  static getPortCallsProductTypeById(productTypeId: string): (...args: any[]) => unknown {
    return createSelector(
      [QcReportDetailsState],
      (state: IQcReportDetailsState) => state.productTypesById[productTypeId]
    );
  }

  @Action(LoadReportDetailsAction)
  loadPortCallDetails({ getState, patchState }: StateContext<IQcReportDetailsState>, { reportId }: LoadReportDetailsAction): void {
    patchState({
      _isLoading: true,
      _hasLoaded: false,
      id: reportId
    });
  }

  @Action([LoadReportDetailsSuccessfulAction, LoadReportDetailsFailedAction])
  loadPortCallDetailsFinished({ getState, patchState }: StateContext<IQcReportDetailsState>, action: LoadReportDetailsSuccessfulAction | LoadReportDetailsFailedAction): void {
    if (isAction(action, LoadReportDetailsSuccessfulAction)) {
      const state = getState();
      const success = <LoadReportDetailsSuccessfulAction>action;

      patchState({
        _isLoading: false,
        _hasLoaded: true,
        id: success.dto.id,
        productTypes: success.dto.productTypes.map(productType => productType.productTypeId),
        productTypesById: _.keyBy(success.dto.productTypes, productType => productType.productTypeId)
        // TODO: load other props
      });
    } else if (isAction(action, LoadReportDetailsFailedAction)) {
      patchState({
        _isLoading: false,
        _hasLoaded: false,
        id: undefined
      });
    }
  }
}
