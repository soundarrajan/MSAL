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
import {
  QcVesselResponseBaseStateItem,
  QcVesselResponseCategoriesState,
  QcVesselResponseSludgeCategoriesState,
  QcVesselResponseSludgeStateItem
} from './details/qc-vessel-responses.state';
import { QcProductTypeListItemState } from './details/qc-product-type-list-item.state';
import { UpdateProductTypeAction } from './details/actions/update-product-type.actions';
import { Decimal } from 'decimal.js';
import {
  SwitchActiveBunkerResponse,
  SwitchActiveSludgeResponse,
  UpdateActiveBunkerVesselResponse,
  UpdateActiveSludgeVesselResponse
} from './details/actions/qc-vessel-response.actions';
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
  static getSludgeVesselResponse(state: IQcReportState): QcVesselResponseSludgeCategoriesState {
    return state.details.vesselResponse.sludge;
  }

  @Selector()
  static getSludgeVesselResponseActiveCategoryId(state: IQcReportState): number {
    return state.details.vesselResponse.sludge.activeCategoryId;
  }

  @Selector()
  static getBunkerVesselResponse(state: IQcReportState): QcVesselResponseCategoriesState {
    return state.details.vesselResponse.bunker;
  }

  @Selector()
  static getBunkerVesselResponseActiveCategoryId(state: IQcReportState): number {
    return state.details.vesselResponse.bunker.activeCategoryId;
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

  @Action(UpdateActiveSludgeVesselResponse)
  updateSludgeVesselResponse({ getState, patchState }: StateContext<IQcReportState>, { prop, value }: UpdateActiveSludgeVesselResponse): void {
    const state = getState();

    const activeCategoryId = state.details.vesselResponse.sludge.activeCategoryId;
    patchState({
      details: {
        ...state.details,
        vesselResponse: {
          ...state.details.vesselResponse,
          sludge: {
            ...state.details.vesselResponse.sludge,
            [activeCategoryId]: {
              ...state.details.vesselResponse.sludge.categories[activeCategoryId],
              [prop]: value
            }
          }
        }
      }
    });
  }

  @Action(SwitchActiveSludgeResponse)
  switchActiveSludgeVesselResponse({ getState, patchState }: StateContext<IQcReportState>, { categoryId }: SwitchActiveSludgeResponse): void {
    const state = getState();

    patchState({
      details: {
        ...state.details,
        vesselResponse: {
          ...state.details.vesselResponse,
          sludge: {
            ...state.details.vesselResponse.sludge,
            activeCategoryId: categoryId
          }
        }
      }
    });
  }

  @Action(UpdateActiveBunkerVesselResponse)
  updateBunkerVesselResponse({ getState, patchState }: StateContext<IQcReportState>, { prop, value }: UpdateActiveBunkerVesselResponse): void {
    const state = getState();

    const activeCategoryId = state.details.vesselResponse.bunker.activeCategoryId;
    patchState({
      details: {
        ...state.details,
        vesselResponse: {
          ...state.details.vesselResponse,
          bunker: {
            ...state.details.vesselResponse.bunker,
            [activeCategoryId]: {
              ...state.details.vesselResponse.bunker.categories[activeCategoryId],
              [prop]: value
            }
          }
        }
      }
    });
  }

  @Action(SwitchActiveBunkerResponse)
  switchActiveBunkerVesselResponse({ getState, patchState }: StateContext<IQcReportState>, { categoryId }: SwitchActiveBunkerResponse): void {
    const state = getState();

    patchState({
      details: {
        ...state.details,
        vesselResponse: {
          ...state.details.vesselResponse,
          bunker: {
            ...state.details.vesselResponse.bunker,
            activeCategoryId: categoryId
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

      const sludgeResponseCategories = success.dto.vesselResponses.sludge.map(sludgeResponse => new QcVesselResponseSludgeStateItem(sludgeResponse));
      const bunkerResponseCategories = success.dto.vesselResponses.bunker.map(bunkerResponse => new QcVesselResponseBaseStateItem(bunkerResponse));
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
          vesselResponse: {
            ...state.details.vesselResponse,
            sludge: {
              ...state.details.vesselResponse.sludge,
              categories: _.keyBy(sludgeResponseCategories, response => response.id),
              activeCategoryId: (_.first(bunkerResponseCategories) || {} as QcVesselResponseBaseStateItem).id
            },
            bunker: {
              ...state.details.vesselResponse.bunker,
              categories: _.keyBy(bunkerResponseCategories, response => response.id),
              activeCategoryId: (_.first(bunkerResponseCategories) || {} as QcVesselResponseBaseStateItem).id
            }
          }
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
