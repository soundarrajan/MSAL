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
import { UpdateProductTypeAction } from './details/actions/update-product-type.actions';
import { Decimal } from 'decimal.js';
import { UpdateBunkerVesselResponse, UpdateSludgeVesselResponse } from './details/actions/qc-vessel-response.actions';
import { UpdateQcReportComment } from './details/actions/qc-comment.action';

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
  static getPortCallReportProductTypes(state: IQcReportState): Record<number, QcProductTypeListItemState> {
    return state.details.productTypesById;
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
  updateProductType({ getState, patchState }: StateContext<IQcReportState>, { productTypeId, prop, value }: UpdateProductTypeAction): void {
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
            [prop]: new Decimal(value)
          }
        }
      }
    });
  }

  @Action(UpdateSludgeVesselResponse)
  updateSludgeVesselResponse({ getState, patchState }: StateContext<IQcReportState>, { prop, value }: UpdateSludgeVesselResponse): void {
    const state = getState();
    patchState({
      details: {
        ...state.details,
        vesselResponse: {
          ...state.details.vesselResponse,
          sludge: {
            ...state.details.vesselResponse.sludge,
            [prop]: value
          }
        }
      }
    });
  }

  @Action(UpdateBunkerVesselResponse)
  updateBunkerVesselResponse({ getState, patchState }: StateContext<IQcReportState>, { prop, value }: UpdateBunkerVesselResponse): void {
    const state = getState();
    patchState({
      details: {
        ...state.details,
        vesselResponse: {
          ...state.details.vesselResponse,
          bunker: {
            ...state.details.vesselResponse.bunker,
            [prop]: value
          }
        }
      }
    });
  }


  @Action(UpdateQcReportComment)
  updateQcReportComment({ getState, patchState }: StateContext<IQcReportState>, { comment }: UpdateQcReportComment): void {
    const state = getState();
    patchState({
      details: {
        ...state.details,
        comment
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
