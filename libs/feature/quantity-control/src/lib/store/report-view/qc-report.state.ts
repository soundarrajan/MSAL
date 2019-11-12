import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { IQuantityControlState } from '../quantity-control.state';
import { isAction } from '@shiptech/core/utils/ngxs-utils';
import {
  LoadReportDetailsAction,
  LoadReportDetailsFailedAction,
  LoadReportDetailsSuccessfulAction
} from './qc-report-details.actions';
import { nameof, Omit } from '@shiptech/core/utils/type-definitions';
import _ from 'lodash';
import { IQcReportState, QcReportStateModel } from './qc-report.state.model';
import {
  QcVesselResponseBaseStateItem,
  QcVesselResponseCategoriesState,
  QcVesselResponseSludgeCategoriesState,
  QcVesselResponseSludgeStateItem
} from './details/qc-vessel-responses.state';
import { QcProductTypeListItemStateModel } from './details/qc-product-type-list-item-state.model';
import { UpdateProductTypeAction } from './details/actions/update-product-type.actions';
import { Decimal } from 'decimal.js';
import {
  SwitchActiveBunkerResponseAction,
  SwitchActiveSludgeResponseAction,
  UpdateActiveBunkerVesselResponseAction,
  UpdateActiveSludgeVesselResponseAction
} from './details/actions/qc-vessel-response.actions';
import { UpdateQcReportComment } from './details/actions/qc-comment.action';
import { IQcReportDetailsState } from './details/qc-report-details.model';
import { IQcUomState, QcUomStateModel } from './models/uom.state';
import {
  SwitchUomForDeliveredQuantityAction,
  SwitchUomForRobAfterDelivery,
  SwitchUomForRobBeforeDeliveryAction
} from './details/actions/qc-uom.actions';
import {
  QcAddEventLogAction,
  QcLoadEventsLogAction,
  QcLoadEventsLogFailedAction,
  QcLoadEventsLogSuccessfulAction,
  QcRemoveEventLogAction,
  QcUpdateEventLogAction
} from './details/actions/qc-events-log.action';
import { IQcEventsLogItemState, QcEventsLogItemStateModel } from './details/qc-events-log-state.model';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';

@State<IQcReportState>({
  name: nameof<IQuantityControlState>('report'),
  defaults: QcReportState.default
})
export class QcReportState {

  static default = new QcReportStateModel();

  @Selector()
  static getReportDetails(state: IQcReportState): IQcReportDetailsState {
    return state.details;
  }

  @Selector()
  static getReportDetailsRobUomBeforeDelivery(state: IQcReportState): IQcUomState {
    return state.details.robBeforeDeliveryUom;
  }

  @Selector()
  static getReportDetailsRobUomAfterDelivery(state: IQcReportState): IQcUomState {
    return state.details.robAfterDeliveryUom;
  }

  @Selector()
  static getReportDetailsDeliveredQtyUom(state: IQcReportState): IQcUomState {
    return state.details.deliveredQtyUom;
  }

  @Selector()
  static getPortCallsProductTypesIds(state: IQcReportState): unknown[] {
    return state.details.productTypes;
  }

  @Selector()
  static getPortCallReportProductTypes(state: IQcReportState): Record<number, QcProductTypeListItemStateModel> {
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

  @Selector([
    (state: IAppState) => state.quantityControl.report.details.eventsLog.itemsById,
    (state: IAppState) => state.quantityControl.report.details.eventsLog.items
  ])
  static eventLogsItems(itemsById: Record<number, IQcEventsLogItemState>, items: number[]): IQcEventsLogItemState[] {
    return (items || []).map(i => (itemsById || {})[i]);
  }

  static getPortCallsProductTypeById(productTypeId: string): (...args: any[]) => QcProductTypeListItemStateModel {
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

    const productType = state.details.productTypesById[productTypeId];
    const conversionRate = (<Decimal>productType.original[prop]).div(productType[prop]);

    patchState({
      details: {
        ...state.details,
        productTypesById: {
          ...state.details.productTypesById,
          [productTypeId]: {
            ...productType,
            original: {
              ...productType.original,
              [prop]: new Decimal(value).mul(conversionRate)
            },
            [prop]: new Decimal(value)
          }
        }
      }
    });
  }

  @Action(UpdateActiveSludgeVesselResponseAction)
  updateSludgeVesselResponse({ getState, patchState }: StateContext<IQcReportState>, { prop, value }: UpdateActiveSludgeVesselResponseAction): void {
    const state = getState();

    const activeCategoryId = state.details.vesselResponse.sludge.activeCategoryId;
    patchState({
      details: {
        ...state.details,
        vesselResponse: {
          ...state.details.vesselResponse,
          sludge: {
            ...state.details.vesselResponse.sludge,
            categories: {
              ...state.details.vesselResponse.sludge.categories,
              [activeCategoryId]: {
                ...state.details.vesselResponse.sludge.categories[activeCategoryId],
                [prop]: value
              }
            }
          }
        }
      }
    });
  }

  @Action(SwitchActiveSludgeResponseAction)
  switchActiveSludgeVesselResponse({ getState, patchState }: StateContext<IQcReportState>, { categoryId }: SwitchActiveSludgeResponseAction): void {
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

  @Action(UpdateActiveBunkerVesselResponseAction)
  updateBunkerVesselResponse({ getState, patchState }: StateContext<IQcReportState>, { prop, value }: UpdateActiveBunkerVesselResponseAction): void {
    const state = getState();

    const activeCategoryId = state.details.vesselResponse.bunker.activeCategoryId;
    patchState({
      details: {
        ...state.details,
        vesselResponse: {
          ...state.details.vesselResponse,
          bunker: {
            ...state.details.vesselResponse.bunker,
            categories: {
              ...state.details.vesselResponse.bunker,
              [activeCategoryId]: {
                ...state.details.vesselResponse.bunker.categories[activeCategoryId],
                [prop]: value
              }
            }
          }
        }
      }
    });
  }

  @Action(SwitchActiveBunkerResponseAction)
  switchActiveBunkerVesselResponse({ getState, patchState }: StateContext<IQcReportState>, { categoryId }: SwitchActiveBunkerResponseAction): void {
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

  @Action([SwitchUomForRobBeforeDeliveryAction, SwitchUomForRobAfterDelivery, SwitchUomForDeliveredQuantityAction])
  switchUom({ getState, patchState }: StateContext<IQcReportState>, action: SwitchUomForRobBeforeDeliveryAction | SwitchUomForRobAfterDelivery | SwitchUomForDeliveredQuantityAction): void {
    const state = getState();

    if (isAction(action, SwitchUomForRobBeforeDeliveryAction)) {
      patchState({
          details: {
            ...state.details,
            robBeforeDeliveryUom: { ...action.uom },
            productTypesById: ConvertProductTypeValues(
              state.details.productTypesById,
              ['robBeforeDeliveryLogBookROB', 'robBeforeDeliveryMeasuredROB'],
              action.uom.conversionRate)
          }
        }
      );
    }

    if (isAction(action, SwitchUomForRobAfterDelivery)) {
      patchState({
          details: {
            ...state.details,
            productTypesById: ConvertProductTypeValues(
              state.details.productTypesById,
              ['robAfterDeliveryLogBookROB', 'robAfterDeliveryMeasuredROB'],
              action.uom.conversionRate),
            robAfterDeliveryUom: { ...action.uom }
          }
        }
      );
    }

    if (isAction(action, SwitchUomForDeliveredQuantityAction)) {
      patchState({
          details: {
            ...state.details,
            productTypesById: ConvertProductTypeValues(
              state.details.productTypesById,
              ['deliveredQuantityBdnQty', 'deliveredQuantityMessuredDeliveredQuantity'],
              action.uom.conversionRate),
            deliveredQtyUom: { ...action.uom }
          }
        }
      );
    }
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
      const vesselResponses = success.dto.vesselResponses;

      const sludgeResponseCategories = vesselResponses.sludge.map(sludgeResponse => new QcVesselResponseSludgeStateItem(sludgeResponse));
      const bunkerResponseCategories = vesselResponses.bunker.map(bunkerResponse => new QcVesselResponseBaseStateItem(bunkerResponse));
      patchState({
        details: {
          ...state.details,
          _isLoading: false,
          _hasLoaded: true,
          id: success.dto.id,
          portCallId: success.dto.portCallId,
          productTypes: success.dto.productTypes.map(productType => productType.productTypeId),
          productTypesById: _.keyBy((success.dto.productTypes || []).map(productType => new QcProductTypeListItemStateModel(productType)),
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
          },
          nbOfCliams: success.dto.nbOfCliams,
          nbOfDeliveries: success.dto.nbOfDeliveries,
          robBeforeDeliveryUom: new QcUomStateModel(success.dto.uoms.robBeforeDeliveryUom),
          robAfterDeliveryUom: new QcUomStateModel(success.dto.uoms.robAfterDeliveryUom),
          deliveredQtyUom: new QcUomStateModel(success.dto.uoms.deliveredQtyUom)
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

  @Action(QcLoadEventsLogAction)
  loadEventsLog({ getState, patchState }: StateContext<IQcReportState>, action: QcLoadEventsLogAction): void {
    const state = getState();

    patchState({
      details: {
        ...state.details,
        eventsLog: {
          ...state.details.eventsLog,
          _isLoading: true,
          _hasLoaded: false
        }
      }
    });
  }

  @Action([QcLoadEventsLogSuccessfulAction, QcLoadEventsLogFailedAction])
  loadEventsLogFinished({ getState, patchState }: StateContext<IQcReportState>, action: QcLoadEventsLogSuccessfulAction | QcLoadEventsLogFailedAction): void {
    const state = getState();
    if (isAction(action, QcLoadEventsLogSuccessfulAction)) {
      const success = <QcLoadEventsLogSuccessfulAction>action;

      patchState({
        details: {
          ...state.details,
          eventsLog: {
            ...state.details.eventsLog,
            items: (success.items || []).map(e => e.id),
            itemsById: _.keyBy((success.items || []).map(e => new QcEventsLogItemStateModel(e)), e => e.id),
            _isLoading: false,
            _hasLoaded: true
          }
        }
      });
    } else if (isAction(action, QcLoadEventsLogFailedAction)) {
      patchState({
        details: {
          ...state.details,
          eventsLog: {
            ...state.details.eventsLog,
            _isLoading: false,
            _hasLoaded: false
          }
        }
      });
    }
  }

  @Action(QcAddEventLogAction)
  addEventLogAction({ getState, patchState }: StateContext<IQcReportState>, { eventDetails }: QcAddEventLogAction): void {
    const state = getState();

    const newEventLogId = -Math.random();

    patchState({
      details: {
        ...state.details,
        eventsLog: {
          ...state.details.eventsLog,
          items: [...state.details.eventsLog.items, newEventLogId],
          itemsById: {
            ...state.details.eventsLog.itemsById,
            [newEventLogId]: new QcEventsLogItemStateModel({
              id: newEventLogId,
              eventDetails: eventDetails,
              isNew: true
            })
          }
        }
      }
    });
  }

  @Action(QcRemoveEventLogAction)
  removeEventLogAction({ getState, patchState }: StateContext<IQcReportState>, { id }: QcRemoveEventLogAction): void {
    const state = getState();

    const { [id]: __, ...itemsById } = state.details.eventsLog.itemsById;
    const items = _.remove(state.details.eventsLog.items, i => i !== id);

    patchState({
      details: {
        ...state.details,
        eventsLog: {
          ...state.details.eventsLog,
          items: items,
          itemsById: itemsById
        }
      }
    });
  }

  @Action(QcUpdateEventLogAction)
  updateEventLogAction({ getState, patchState }: StateContext<IQcReportState>, { id, eventDetails }: QcUpdateEventLogAction): void {
    const state = getState();

    patchState({
      details: {
        ...state.details,
        eventsLog: {
          ...state.details.eventsLog,
          itemsById: {
            ...state.details.eventsLog.itemsById,
            [id]: {
              ...state.details.eventsLog.itemsById[id],
              eventDetails: eventDetails,
              isNew: true
            }
          }
        }
      }
    });
  }

}

export function ConvertProductTypeValues(productTypesMap: Record<number, QcProductTypeListItemStateModel>,
                                         propsToConvert: (keyof Omit<QcProductTypeListItemStateModel, 'productTypeName' | 'productTypeId' | 'original'>)[],
                                         conversionRate: number): Record<number, QcProductTypeListItemStateModel> {
  const convertedProductTypes = _.values(productTypesMap).map(productType => {
    const convertedProductType = { ...productType };
    propsToConvert.forEach(prop => {
      convertedProductType[prop] = convertedProductType.original[prop].mul(conversionRate);
    });
    return convertedProductType;
  });

  return _.keyBy(convertedProductTypes, nameof<QcProductTypeListItemStateModel>('productTypeId'));
}
