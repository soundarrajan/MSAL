import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { IQuantityControlState } from '../quantity-control.state';
import { isAction } from '@shiptech/core/utils/ngxs-utils';
import {
  LoadReportDetailsAction,
  LoadReportDetailsFailedAction,
  LoadReportDetailsSuccessfulAction
} from './qc-report-details.actions';
import { nameof } from '@shiptech/core/utils/type-definitions';
import _ from 'lodash';
import { IQcReportState, QcReportStateModel } from './qc-report.state.model';
import { QcVesselResponseBaseStateModel, QcVesselResponseSludgeStateModel } from './details/qc-vessel-response.state';
import { QcProductTypeListItemState } from './details/qc-product-type-list-item.state';
import { UpdateProductTypeAction } from './details/update-product-type.actions';

@State<IQcReportState>({
  name: nameof<IQuantityControlState>('report'),
  defaults: QcReportState.default
})
export class QcReportState {

  static default = new QcReportStateModel();

  @Selector()
  static getPortCallsProductTypesIds(state: IQcReportState): unknown[] {
    return state.details.productTypes;
  }

  @Selector()
  static getSludgeVesselResponse(state: IQcReportState): QcVesselResponseSludgeStateModel {
    return state.details.vesselResponse.sludge;
  }

  @Selector()
  static getBunkerVesselResponse(state: IQcReportState): QcVesselResponseBaseStateModel {
    return state.details.vesselResponse.bunker;
  }

  @Selector()
  static getReportComment(state: IQcReportState): string {
    return state.details.comment;
  }

  @Selector()
  static getPortCallReportProductTypes(state: IQcReportState): QcProductTypeListItemState[] {
    return state.details.productTypes.map(productTypeId => state.details.productTypesById[productTypeId]);
  }

  static getPortCallsProductTypeById(productTypeId: string): (...args: any[]) => QcProductTypeListItemState {
    return createSelector(
      [QcReportState],
      (state: IQcReportState) => state.details.productTypesById[productTypeId]
    );
  }

  @Action(LoadReportDetailsAction)
  loadPortCallDetails({ getState, patchState }: StateContext<IQcReportState>, { reportId }: LoadReportDetailsAction): void {
    const state = getState();
    patchState({
      details: {
        ...state.details,
        _isLoading: true,
        _hasLoaded: false,
        id: reportId
      }
    });
  }

  @Action(UpdateProductTypeAction)
  updateProductType({ getState, patchState }: StateContext<IQcReportState>, { productTypeId, productType }: UpdateProductTypeAction): void {
    const state = getState();
    if (!state.details.productTypesById[productTypeId]) {
      return;
    }

    patchState({
      details: {
        ...state.details,
        productTypesById: {
          ...state.details.productTypesById,
          [productTypeId]: {
            ...state.details.productTypesById[productTypeId],
            ...productType
          }
        }
      }
    });
  }

  @Action([LoadReportDetailsSuccessfulAction, LoadReportDetailsFailedAction])
  loadPortCallDetailsFinished({ getState, patchState }: StateContext<IQcReportState>, action: LoadReportDetailsSuccessfulAction | LoadReportDetailsFailedAction): void {
    const state = getState();
    if (isAction(action, LoadReportDetailsSuccessfulAction)) {
      const success = <LoadReportDetailsSuccessfulAction>action;

      patchState({
        details: {
          ...state.details,
          _isLoading: false,
          _hasLoaded: true,
          id: success.dto.id,
          portCallId: success.dto.portCallId,
          productTypes: success.dto.productTypes.map(productType => productType.productTypeId),
          productTypesById: _.keyBy((success.dto.productTypes || []).map(productType => new QcProductTypeListItemState(productType)),
            productType => productType.productTypeId),
          // TODO: load other props
          comment: success.dto.comment,
          vesselResponse: success.dto.vesselResponses
        }
      });
    } else if (isAction(action, LoadReportDetailsFailedAction)) {
      patchState({
        details: {
          ...state.details,
          _isLoading: false,
          _hasLoaded: false,
          id: undefined
        }
      });
    }
  }
}
