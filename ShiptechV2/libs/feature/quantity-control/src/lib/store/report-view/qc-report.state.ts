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
import {
  LoadSoundingReportListAction,
  LoadSoundingReportListFailedAction,
  LoadSoundingReportListSuccessfulAction
} from './qc-report-sounding.actions';

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

  @Action(LoadSoundingReportListAction)
  loadSoundingReports({ getState, patchState }: StateContext<IQcReportState>, {gridInfo}: LoadSoundingReportListAction): void {
    const state = getState();
    patchState({
      details: {
        ...state.details,
        soundingReports: {
          _hasLoaded: false,
          _isLoading: true,
          gridInfo: gridInfo,
          items: [],
          itemsById: undefined,
        }
      }
    });
  }

  @Action([LoadSoundingReportListSuccessfulAction, LoadSoundingReportListFailedAction])
  loadSoundingReportFinished({ getState, patchState }: StateContext<IQcReportState>, action: LoadSoundingReportListSuccessfulAction | LoadSoundingReportListFailedAction): void {
    const state = getState();
    if (isAction(action, LoadSoundingReportListSuccessfulAction)) {

      patchState({
        details: {
          ...state.details,
          soundingReports: {
            ...state.details.soundingReports,
            _hasLoaded: true,
            _isLoading: false,
            items: [], // TODO
            itemsById: {} // TODO
          }
        }
      });
    } else if (isAction(action, LoadSoundingReportListFailedAction)) {
      patchState({
        details: {
          ...state.details,
          soundingReports: {
            ...state.details.soundingReports,
            _hasLoaded: false,
            _isLoading: false,
            items: undefined,
            itemsById: undefined
          }
        }
      });
    }
  }

}
