import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { IQuantityControlState } from '../quantity-control.state';
import { isAction } from '@shiptech/core/utils/ngxs-utils';
import {
  LoadReportDetailsAction,
  LoadReportDetailsFailedAction,
  LoadReportDetailsSuccessfulAction,
  ResetQcReportDetailsStateAction
} from './qc-report-details.actions';
import { nameof } from '@shiptech/core/utils/type-definitions';
import _ from 'lodash';
import { IQcReportState, QcReportStateModel } from './qc-report.state.model';
import { QcVesselResponsesStateModel } from './details/qc-vessel-responses.state';
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
import { QcReportDetailsModel } from './details/qc-report-details.model';
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
import {
  QcSaveReportDetailsAction,
  QcSaveReportDetailsFailedAction,
  QcSaveReportDetailsSuccessfulAction
} from './details/actions/save-report.actions';
import {
  QcVerifyReportAction,
  QcVerifyReportFailedAction,
  QcVerifyReportSuccessfulAction
} from './details/actions/verify-report.actions';
import {
  LoadReportSurveyHistoryAction,
  LoadReportSurveyHistoryFailedAction,
  LoadReportSurveyHistorySuccessfulAction
} from './qc-report-survey-history.actions';
import { EntityStatus } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

@State<IQcReportState>({
  name: nameof<IQuantityControlState>('report'),
  defaults: QcReportState.default
})
export class QcReportState {

  static default = new QcReportStateModel();

  private verifiedStatus: Promise<IDisplayLookupDto>;

  constructor(private legacyLookupsDatabase: LegacyLookupsDatabase) {
    this.verifiedStatus = this.legacyLookupsDatabase.status.filter(s => s.name === EntityStatus.Verified).first();
  }

  @Selector()
  static isBusy(state: IQcReportState): boolean {
    const isBusy = [
      state.details._isLoading,
      state.details.isSaving,
      state.details.isVerifying
    ];
    return isBusy.some(s => s);
  }

  @Selector()
  static hasUnsavedChanges(state: IQcReportState): boolean {
    return state.details.hasChanges;
  }

  @Selector()
  static reportDetailsId(state: IQcReportState): number {
    return state.details.id;
  }

  @Selector()
  static canSave(): boolean {
    return true;
  }


  @Selector()
  static eventLogsItemsById(state: IQcReportState): Record<number, IQcEventsLogItemState> {
    return state.details?.eventsLog?.itemsById;
  }

  @Selector()
  static eventLogsItemIds(state: IQcReportState): number[] {
    return state.details?.eventsLog?.items;
  }

  @Selector([QcReportState.eventLogsItemsById, QcReportState.eventLogsItemIds])
  static eventLogsItems(itemsById: Record<number, IQcEventsLogItemState>, items: number[]): IQcEventsLogItemState[] {
    return (items || []).map(i => itemsById?.[i]);
  }

  static getPortCallsProductTypeById(productTypeId: string): (...args: any[]) => QcProductTypeListItemStateModel {
    return createSelector(
      [QcReportState],
      (state: IQcReportState) => state.details.productTypesById[productTypeId]
    );
  }

  @Selector()
  static nbOfMatched(state: IQcReportState): number {
    return state.details.surveyHistory.nbOfMatched;
  }

  @Selector()
  static nbOfMatchedWithinLimit(state: IQcReportState): number {
    return state.details.surveyHistory.nbOfMatchedWithinLimit;
  }

  @Selector()
  static nbOfNotMatched(state: IQcReportState): number {
    return state.details.surveyHistory.nbOfNotMatched;
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

    patchState({
      details: {
        ...state.details,
        hasChanges: true,
        productTypesById: {
          ...state.details.productTypesById,
          [productTypeId]: {
            ...productType,
            [prop]: value
          }
        }
      }
    });
  }

  @Action(UpdateActiveSludgeVesselResponseAction)
  updateSludgeVesselResponse({ getState, patchState }: StateContext<IQcReportState>, { prop, value }: UpdateActiveSludgeVesselResponseAction): void {
    const state = getState();

    patchState({
      details: {
        ...state.details,
        hasChanges: true,
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

  @Action(SwitchActiveSludgeResponseAction)
  switchActiveSludgeVesselResponse({ getState, patchState }: StateContext<IQcReportState>, { category }: SwitchActiveSludgeResponseAction): void {
    const state = getState();

    patchState({
      details: {
        ...state.details,
        hasChanges: true,
        vesselResponse: {
          ...state.details.vesselResponse,
          sludge: {
            ...state.details.vesselResponse.sludge,
            activeCategory: category
          }
        }
      }
    });
  }

  @Action(UpdateActiveBunkerVesselResponseAction)
  updateBunkerVesselResponse({ getState, patchState }: StateContext<IQcReportState>, { prop, value }: UpdateActiveBunkerVesselResponseAction): void {
    const state = getState();

    patchState({
      details: {
        ...state.details,
        hasChanges: true,
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

  @Action(SwitchActiveBunkerResponseAction)
  switchActiveBunkerVesselResponse({ getState, patchState }: StateContext<IQcReportState>, { category }: SwitchActiveBunkerResponseAction): void {
    const state = getState();

    patchState({
      details: {
        ...state.details,
        hasChanges: true,
        vesselResponse: {
          ...state.details.vesselResponse,
          bunker: {
            ...state.details.vesselResponse.bunker,
            activeCategory: category
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
            robBeforeDeliveryUom: { ...action.uom }
          }
        }
      );
    }

    if (isAction(action, SwitchUomForRobAfterDelivery)) {
      patchState({
          details: {
            ...state.details,
            robAfterDeliveryUom: { ...action.uom }
          }
        }
      );
    }

    if (isAction(action, SwitchUomForDeliveredQuantityAction)) {
      patchState({
          details: {
            ...state.details,
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
        hasChanges: true,
        comment: comment
      }
    });
  }

  @Action([LoadReportDetailsSuccessfulAction, LoadReportDetailsFailedAction])
  loadReportDetailsFinished({ getState, patchState }: StateContext<IQcReportState>, action: LoadReportDetailsSuccessfulAction | LoadReportDetailsFailedAction): void {
    const state = getState();
    if (isAction(action, LoadReportDetailsSuccessfulAction)) {
      const success = <LoadReportDetailsSuccessfulAction>action;

      const detailsDto = success.dto;
      const productTypesMap = _.keyBy((detailsDto.productTypeCategories || []).map(productType => new QcProductTypeListItemStateModel(productType)), s => s.id);

      patchState({
        details: {
          ...state.details,
          _isLoading: false,
          _hasLoaded: true,
          id: detailsDto.id,
          status: detailsDto.status,
          vesselId: detailsDto.vesselId,
          vesselName: detailsDto.vesselName,
          voyageReference: detailsDto.voyageReference,
          vesselVoyageDetailId: detailsDto.vesselVoyageDetailId,
          portCallId: detailsDto.portCallId,
          productTypes: detailsDto.productTypeCategories.map(productType => productType.id),
          productTypesById: productTypesMap,
          uoms: detailsDto.uoms.options,
          comment: detailsDto.comment,
          vesselResponse: new QcVesselResponsesStateModel(detailsDto.vesselResponses),
          nbOfClaims: detailsDto.nbOfClaims,
          nbOfDeliveries: detailsDto.nbOfDeliveries,
          robBeforeDeliveryUom: detailsDto.uoms.robBeforeDeliveryUom,
          robAfterDeliveryUom: detailsDto.uoms.robAfterDeliveryUom,
          deliveredQtyUom: detailsDto.uoms.deliveredQtyUom
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
  loadEventsLog({ getState, patchState }: StateContext<IQcReportState>, __: QcLoadEventsLogAction): void {
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
        hasChanges: true,
        eventsLog: {
          ...state.details.eventsLog,
          items: [...(state.details.eventsLog.items || []), newEventLogId],
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
        hasChanges: true,
        eventsLog: {
          ...state.details.eventsLog,
          items: items,
          deletedItemIds: [...(state.details.eventsLog.deletedItemIds ?? []), id],
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
        hasChanges: true,
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

  @Action(QcSaveReportDetailsAction)
  saveReportDetailsAction({ getState, patchState }: StateContext<IQcReportState>, __: QcSaveReportDetailsAction): void {
    const state = getState();

    patchState({
      details: {
        ...state.details,
        isSaving: true
      }
    });
  }

  @Action([QcSaveReportDetailsSuccessfulAction, QcSaveReportDetailsFailedAction])
  saveReportDetailsSuccessfulAction({ getState, patchState }: StateContext<IQcReportState>, action: QcSaveReportDetailsSuccessfulAction | QcSaveReportDetailsFailedAction): void {
    const state = getState();
    if (isAction(action, QcSaveReportDetailsSuccessfulAction)) {
      patchState({
        details: {
          ...state.details,
          hasChanges: false,
          isSaving: false
        }
      });
    } else if (isAction(action, QcSaveReportDetailsFailedAction)) {
      patchState({
        details: {
          ...state.details,
          isSaving: false
        }
      });
    }
  }

  @Action(ResetQcReportDetailsStateAction)
  resetQcReportDetailsStateAction({ patchState }: StateContext<IQcReportState>, __: ResetQcReportDetailsStateAction): void {
    patchState({
      details: new QcReportDetailsModel()
    });
  }

  @Action([QcVerifyReportAction, QcVerifyReportSuccessfulAction, QcVerifyReportFailedAction])
  async verifyReportAction({ getState, patchState }: StateContext<IQcReportState>, action: QcVerifyReportAction | QcVerifyReportSuccessfulAction | QcVerifyReportFailedAction): Promise<void> {
    const state = getState();

    if (isAction(action, QcVerifyReportAction)) {
      patchState({
        details: { ...state.details, isVerifying: true }
      });
    } else {
      patchState({
        details: {
          ...state.details,
          status: await this.verifiedStatus,
          isVerifying: false
        }
      });
    }

  }

  @Action(LoadReportSurveyHistoryAction)
  loadReportSurveyHistoryAction({ getState, patchState }: StateContext<IQcReportState>, { serverGridInfo }: LoadReportSurveyHistoryAction): void {
    const state = getState();
    patchState(
      {
        details: {
          ...state.details,
          surveyHistory: {
            ...state.details.surveyHistory,
            gridInfo: serverGridInfo,
            _isLoading: false,
            _hasLoaded: true
          }
        }
      });
  }

  @Action([LoadReportSurveyHistorySuccessfulAction, LoadReportSurveyHistoryFailedAction])
  loadReportSurveyHistoryActionFinished({ getState, patchState }: StateContext<IQcReportState>, action: LoadReportSurveyHistorySuccessfulAction | LoadReportSurveyHistoryFailedAction): void {
    const state = getState();

    if (isAction(action, LoadReportSurveyHistorySuccessfulAction)) {
      const { nbOfMatched, nbOfMatchedWithinLimit, nbOfNotMatched, totalItems } = <LoadReportSurveyHistorySuccessfulAction>action;
      patchState({
        details: {
          ...state.details,
          surveyHistory: {
            ...state.details.surveyHistory,
            _isLoading: false,
            _hasLoaded: true,
            nbOfMatched,
            nbOfMatchedWithinLimit,
            nbOfNotMatched,
            totalItems
          }
        }
      });
    } else if (isAction(action, LoadReportSurveyHistoryFailedAction)) {
      patchState({
        details: {
          ...state.details,
          surveyHistory: {
            ...state.details.surveyHistory,
            _isLoading: false,
            _hasLoaded: false
          }
        }
      });
    }
  }
}
