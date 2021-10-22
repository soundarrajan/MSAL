import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { IQuantityControlState } from '../quantity-control.state';
import { isAction } from '@shiptech/core/utils/ngxs-utils';
import {
  LoadReportDetailsAction,
  LoadReportDetailsFailedAction,
  LoadReportDetailsSuccessfulAction,
  ResetQcReportDetailsStateAction
} from './qc-report-details.actions';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { keyBy, filter, values } from 'lodash';
import { IQcReportState, QcReportStateModel } from './qc-report.state.model';
import { QcVesselResponsesStateModel } from './details/qc-vessel-responses.state';
import {
  IQcProductTypeListItemState,
  QcProductTypeListItemStateModel
} from './details/qc-product-type-list-item-state.model';
import { UpdateProductTypeAction } from './details/actions/update-product-type.actions';
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
import {
  IQcEventsLogItemState,
  QcEventsLogItemStateModel
} from './details/qc-events-log-state.model';
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
import {
  QcRevertVerifyReportAction,
  QcRevertVerifyReportFailedAction,
  QcRevertVerifyReportSuccessfulAction
} from './details/actions/revert-verify-report.actions';
import { StatusLookup } from '@shiptech/core/lookups/known-lookups/status/status-lookup.service';
import { IDeliveryTenantSettings } from '../../core/settings/delivery-tenant-settings';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { TenantSettingsState } from '@shiptech/core/store/states/tenant/tenant-settings.state';
import {
  UpdateQcReportPortCall,
  UpdateQcReportVessel
} from './details/actions/qc-vessel.action';
import { Injectable } from '@angular/core';
import { fromLegacyLookup } from '@shiptech/core/lookups/utils';
import {
  QcClearPortCallBdnAction,
  QcUpdatePortCallAction,
  QcUpdatePortCallFailedAction,
  QcUpdatePortCallSuccessfulAction
} from './details/actions/update-port-call-bdn.actions';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { ReconStatusLookupEnum } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.enum';
import { StatusLookupEnum } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import {
  UpdateVesselToWatchAction,
  UpdateVesselToWatchFailedAction,
  UpdateVesselToWatchSuccessfulAction
} from './details/actions/update-vessel-to-watch.action';

@State<IQcReportState>({
  name: nameof<IQuantityControlState>('report'),
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  defaults: QcReportState.default
})
@Injectable()
export class QcReportState {
  static default = new QcReportStateModel();

  constructor(
    private store: Store,
    private surveyStatusLookups: StatusLookup
  ) {}

  @Selector([QcReportState])
  static isBusy(state: IQcReportState): boolean {
    const isBusy = [
      state.details?._isLoading,
      state.details?.isSaving,
      state.details?.isVerifying,
      state.details?.isRevertVerifying,
      state.details?.isUpdatingPortCallBtn
    ];
    return isBusy.some(s => s);
  }

  @Selector([QcReportState])
  static isVerified(state: IQcReportState): boolean {
    return state?.details?.status?.name === StatusLookupEnum.Verified;
  }

  @Selector([QcReportState.isBusy, QcReportState.isVerified])
  static isReadOnly(isBusy: boolean, isVerified: boolean): boolean {
    return isBusy || isVerified;
  }

  @Selector([QcReportState])
  static isNew(state: IQcReportState): boolean {
    return state.details?.isNew;
  }

  @Selector([QcReportState])
  static hasChanges(state: IQcReportState): boolean {
    return state.details?.hasChanges;
  }

  @Selector([QcReportState])
  static reportDetailsId(state: IQcReportState): number {
    return state.details?.id;
  }

  @Selector([QcReportState])
  static eventLogsItemsById(
    state: IQcReportState
  ): Record<number, IQcEventsLogItemState> {
    return state.details?.eventsLog?.itemsById;
  }

  @Selector([QcReportState])
  static eventLogsItemIds(state: IQcReportState): number[] {
    return state.details?.eventsLog?.items;
  }

  @Selector([QcReportState.eventLogsItemsById, QcReportState.eventLogsItemIds])
  static eventLogsItems(
    itemsById: Record<number, IQcEventsLogItemState>,
    items: number[]
  ): IQcEventsLogItemState[] {
    return (items || []).map(i => itemsById?.[i]);
  }

  @Selector([QcReportState])
  static productTypesById(
    state: IQcReportState
  ): Record<number, IQcProductTypeListItemState> {
    return state.details?.productTypesById;
  }

  @Selector([QcReportState])
  static productTypesIds(state: IQcReportState): number[] {
    return state.details?.productTypes;
  }

  @Selector([QcReportState.productTypesById, QcReportState.productTypesIds])
  static productTypes(
    itemsById: Record<number, IQcProductTypeListItemState>,
    items: number[]
  ): IQcProductTypeListItemState[] {
    return (items || []).map(i => itemsById?.[i]);
  }

  @Selector([QcReportState])
  static nbOfMatched(state: IQcReportState): number {
    return state.details?.surveyHistory?.nbOfMatched;
  }

  @Selector([QcReportState])
  static nbOfMatchedWithinLimit(state: IQcReportState): number {
    return state.details?.surveyHistory?.nbOfMatchedWithinLimit;
  }

  @Selector([QcReportState])
  static nbOfNotMatched(state: IQcReportState): number {
    return state.details?.surveyHistory?.nbOfNotMatched;
  }

  static getMatchStatus(
    left: number,
    right: number,
    minTolerance: number,
    maxTolerance: number
  ): ReconStatusLookupEnum | undefined {
    if (
      left === null ||
      left === undefined ||
      right === null ||
      right === undefined
    )
      return undefined;

    const diff = Math.abs(left - right);

    if (diff >= maxTolerance) return ReconStatusLookupEnum.NotMatched;
    if (diff <= minTolerance) return ReconStatusLookupEnum.Matched;
    return ReconStatusLookupEnum.WithinLimit;
  }

  static getMatchStatusForRobBeforeDiffAndDeliveredDiff(
    left: number,
    right: number,
    tolerance: number
  ): ReconStatusLookupEnum | undefined {
    if (
      left === null ||
      left === undefined ||
      right === null ||
      right === undefined
    )
      return undefined;

    const diff = Math.abs(left - right);

    if (diff > tolerance) return ReconStatusLookupEnum.NotMatched;
    if (diff <= tolerance) return ReconStatusLookupEnum.Matched;
  }

  static getMatchStatusForRobAfterDiff(
    left: number,
    right: number,
    tolerance: number
  ): ReconStatusLookupEnum | undefined {
    if (
      left === null ||
      left === undefined ||
      right === null ||
      right === undefined
    )
      return undefined;

    const diff = Math.abs(left - right);

    if (diff != 0) return ReconStatusLookupEnum.NotMatched;
    if (diff == tolerance) return ReconStatusLookupEnum.Matched;
  }

  @Selector([
    QcReportState.productTypes,
    TenantSettingsState.byModule<IDeliveryTenantSettings>(
      TenantSettingsModuleName.Delivery
    )
  ])
  static matchStatus(
    items: IQcProductTypeListItemState[],
    deliverySettings: IDeliveryTenantSettings
  ): ReconStatusLookupEnum | undefined {
    // Note: This method is called very often, so we specifically use another selector and we don't insert state!!

    const robTolerance = deliverySettings.robTolerance;
    const bdnTolerance = deliverySettings.maxToleranceLimit;
    let hasWithinLimit = false;
    let atleastOneItemHasStatus = false;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const robBeforeDiff = QcReportState.getMatchStatusForRobBeforeDiffAndDeliveredDiff(
        item.robBeforeDeliveryLogBookROB,
        item.robBeforeDeliveryMeasuredROB,
        robTolerance
      );
      const deliveredDiff = QcReportState.getMatchStatusForRobBeforeDiffAndDeliveredDiff(
        item.deliveredQuantityBdnQty,
        item.measuredDeliveredQty,
        bdnTolerance
      );
      const robAfterDiff = !item.isSludge
        ? QcReportState.getMatchStatusForRobAfterDiff(
            item.robAfterDeliveryLogBookROB,
            item.robAfterDeliveryMeasuredROB,
            0
          )
        : undefined;

      if (!robBeforeDiff && !deliveredDiff && !robAfterDiff) continue;

      atleastOneItemHasStatus = true;

      if (
        robBeforeDiff === ReconStatusLookupEnum.NotMatched ||
        deliveredDiff === ReconStatusLookupEnum.NotMatched ||
        robAfterDiff === ReconStatusLookupEnum.NotMatched
      )
        return ReconStatusLookupEnum.NotMatched;

      if (
        robBeforeDiff === ReconStatusLookupEnum.WithinLimit ||
        deliveredDiff === ReconStatusLookupEnum.WithinLimit ||
        robAfterDiff === ReconStatusLookupEnum.WithinLimit
      )
        hasWithinLimit = true;
    }

    // Note: For new, there is nothing yet filled in so we don't show a status.
    if (!atleastOneItemHasStatus) return undefined;

    return hasWithinLimit
      ? ReconStatusLookupEnum.WithinLimit
      : ReconStatusLookupEnum.Matched;
  }

  @Action(LoadReportDetailsAction)
  loadPortCallDetails(
    { getState, patchState }: StateContext<IQcReportState>,
    { reportId }: LoadReportDetailsAction
  ): void {
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
  updateProductType(
    { getState, patchState }: StateContext<IQcReportState>,
    { productTypeId, prop, value }: UpdateProductTypeAction
  ): void {
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
  updateSludgeVesselResponse(
    { getState, patchState }: StateContext<IQcReportState>,
    { prop, value }: UpdateActiveSludgeVesselResponseAction
  ): void {
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
  switchActiveSludgeVesselResponse(
    { getState, patchState }: StateContext<IQcReportState>,
    { category }: SwitchActiveSludgeResponseAction
  ): void {
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
  updateBunkerVesselResponse(
    { getState, patchState }: StateContext<IQcReportState>,
    { prop, value }: UpdateActiveBunkerVesselResponseAction
  ): void {
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
  switchActiveBunkerVesselResponse(
    { getState, patchState }: StateContext<IQcReportState>,
    { category }: SwitchActiveBunkerResponseAction
  ): void {
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

  @Action([
    SwitchUomForRobBeforeDeliveryAction,
    SwitchUomForRobAfterDelivery,
    SwitchUomForDeliveredQuantityAction
  ])
  switchUom(
    { getState, patchState }: StateContext<IQcReportState>,
    action:
      | SwitchUomForRobBeforeDeliveryAction
      | SwitchUomForRobAfterDelivery
      | SwitchUomForDeliveredQuantityAction
  ): void {
    const state = getState();

    if (isAction(action, SwitchUomForRobBeforeDeliveryAction)) {
      patchState({
        details: {
          ...state.details,
          robBeforeDeliveryUom: { ...action.uom }
        }
      });
    }

    if (isAction(action, SwitchUomForRobAfterDelivery)) {
      patchState({
        details: {
          ...state.details,
          robAfterDeliveryUom: { ...action.uom }
        }
      });
    }

    if (isAction(action, SwitchUomForDeliveredQuantityAction)) {
      patchState({
        details: {
          ...state.details,
          deliveredQtyUom: { ...action.uom }
        }
      });
    }
  }

  @Action(UpdateQcReportComment)
  updateQcReportComment(
    { getState, patchState }: StateContext<IQcReportState>,
    { comment }: UpdateQcReportComment
  ): void {
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
  loadReportDetailsFinished(
    { getState, patchState }: StateContext<IQcReportState>,
    action: LoadReportDetailsSuccessfulAction | LoadReportDetailsFailedAction
  ): void {
    const state = getState();
    // Note: We could have use also TenantSettingService
    const defaultUom = fromLegacyLookup(
      this.store.selectSnapshot(TenantSettingsState.general).tenantFormats.uom
    );
    const robToleranceUom = fromLegacyLookup(
      this.store.selectSnapshot(TenantSettingsState.delivery).robToleranceUom
    );

    if (isAction(action, LoadReportDetailsSuccessfulAction)) {
      const success = <LoadReportDetailsSuccessfulAction>action;

      const detailsDto = success.dto;
      const productTypesMap = keyBy(
        (detailsDto.productTypeCategories || []).map(
          productTypeItem =>
            new QcProductTypeListItemStateModel(
              productTypeItem,
              detailsDto.sludgeProductType.id === productTypeItem.productType.id
            )
        ),
        s => s.productType.id
      );

      patchState({
        details: new QcReportDetailsModel({
          isNew: !success.reportId,
          _isLoading: false,
          _hasLoaded: true,
          id: detailsDto.id,
          status: detailsDto.status,
          vessel: detailsDto.vessel || undefined, // Note: BE returns null, we want to stay consistent and not trigger any selectors
          portCall: detailsDto.portCall || undefined, // Note: BE returns null, we want to stay consistent and not trigger any selectors
          productTypes: detailsDto.productTypeCategories.map(
            c => c.productType.id
          ),
          hasSentEmail: detailsDto.hasSentEmail,
          productTypesById: productTypesMap,
          uoms: detailsDto.uoms.options,
          comment: detailsDto.comments,
          vesselResponse: new QcVesselResponsesStateModel(
            detailsDto.vesselResponses
          ),
          nbOfClaims: detailsDto.nbOfClaims,
          nbOfDeliveries: detailsDto.nbOfDeliveries,
          robBeforeDeliveryUom:
            detailsDto.uoms.robBeforeDeliveryUom ?? defaultUom,
          robAfterDeliveryUom:
            detailsDto.uoms.robAfterDeliveryUom ?? defaultUom,
          deliveredQtyUom: detailsDto.uoms.deliveredQtyUom ?? defaultUom,
          emailTransactionTypeId: detailsDto.emailTransactionTypeId
        })
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
  loadEventsLog(
    { getState, patchState }: StateContext<IQcReportState>,
    __: QcLoadEventsLogAction
  ): void {
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
  loadEventsLogFinished(
    { getState, patchState }: StateContext<IQcReportState>,
    action: QcLoadEventsLogSuccessfulAction | QcLoadEventsLogFailedAction
  ): void {
    const state = getState();
    if (isAction(action, QcLoadEventsLogSuccessfulAction)) {
      const success = <QcLoadEventsLogSuccessfulAction>action;

      patchState({
        details: {
          ...state.details,
          eventsLog: {
            ...state.details.eventsLog,
            items: (success.items || []).map(e => e.id),
            itemsById: keyBy(
              (success.items || []).map(e => new QcEventsLogItemStateModel(e)),
              e => e.id
            ),
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
  addEventLogAction(
    { getState, patchState }: StateContext<IQcReportState>,
    { eventDetails }: QcAddEventLogAction
  ): void {
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
              createdBy: this.store.selectSnapshot(UserProfileState.user),
              isNew: true
            })
          }
        }
      }
    });
  }

  @Action(QcRemoveEventLogAction)
  removeEventLogAction(
    { getState, patchState }: StateContext<IQcReportState>,
    { id }: QcRemoveEventLogAction
  ): void {
    const state = getState();

    const { [id]: __, ...itemsById } = state.details.eventsLog.itemsById;
    const items = filter(state.details.eventsLog.items, i => i !== id);

    patchState({
      details: {
        ...state.details,
        hasChanges: true,
        eventsLog: {
          ...state.details.eventsLog,
          items: items,
          // Note: deletedItemIds will be sent to server, if the user creates and deletes notes without saving, we don't want to send these to the BE
          deletedItemIds: !(
            state.details.eventsLog.itemsById[id]?.isNew ?? true
          )
            ? [...(state.details.eventsLog.deletedItemIds ?? []), id]
            : state.details.eventsLog.deletedItemIds,
          itemsById: itemsById
        }
      }
    });
  }

  @Action(QcUpdateEventLogAction)
  updateEventLogAction(
    { getState, patchState }: StateContext<IQcReportState>,
    { id, eventDetails }: QcUpdateEventLogAction
  ): void {
    const state = getState();
    const isNewValue = !!state.details.eventsLog.items.find(
      x => x === id && id < 0
    );
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
              isNew: isNewValue
            }
          }
        }
      }
    });
  }

  @Action(QcSaveReportDetailsAction)
  saveReportDetailsAction(
    { getState, patchState }: StateContext<IQcReportState>,
    __: QcSaveReportDetailsAction
  ): void {
    const state = getState();

    patchState({
      details: {
        ...state.details,
        isSaving: true
      }
    });
  }

  @Action([
    QcSaveReportDetailsSuccessfulAction,
    QcSaveReportDetailsFailedAction
  ])
  saveReportDetailsSuccessfulAction(
    { getState, patchState }: StateContext<IQcReportState>,
    action:
      | QcSaveReportDetailsSuccessfulAction
      | QcSaveReportDetailsFailedAction
  ): void {
    const state = getState();
    if (isAction(action, QcSaveReportDetailsSuccessfulAction)) {
      const success = <QcSaveReportDetailsSuccessfulAction>action;

      // Note: For New Reports we need to save the id of each product type row. This id is not used in front-end, we track by productTypes.productType.id, it's used in backend to update rows in db
      const productTypes = values(state.details.productTypesById).map(p => ({
        ...state.details.productTypesById[p.productType.id],
        id:
          success.productTypes.find(s => s.productType.id === p.productType.id)
            ?.id ?? p.id
      }));

      patchState({
        details: {
          ...state.details,
          id: success.reportId,
          isNew: false,
          productTypesById: keyBy(productTypes, s => s.productType.id),
          emailTransactionTypeId: success.emailTransactionTypeId,
          hasChanges: false,
          isSaving: false,
          eventsLog: {
            ...state.details.eventsLog,
            itemsById: keyBy(
              values(state.details.eventsLog.itemsById).map(
                s => <IQcEventsLogItemState>{ ...s, isNew: false }
              ),
              s => s.id
            ),
            deletedItemIds: undefined
          }
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
  resetQcReportDetailsStateAction(
    { patchState }: StateContext<IQcReportState>,
    __: ResetQcReportDetailsStateAction
  ): void {
    patchState({
      details: new QcReportDetailsModel()
    });
  }

  @Action(UpdateVesselToWatchAction)
  updateVesselToWatchAction(
    { getState, patchState }: StateContext<IQcReportState>,
    __: UpdateVesselToWatchAction
  ): void {
    const state = getState();
    patchState({
      details: {
        ...state.details,
        hasChanges: true
      }
    });
  }

  @Action(UpdateVesselToWatchSuccessfulAction)
  updateVesselToWatchActionSuccessful(
    { getState, patchState }: StateContext<IQcReportState>,
    { newVessel }: UpdateVesselToWatchSuccessfulAction
  ): void {
    const state = getState();
    patchState({
      details: {
        ...state.details,
        vessel: newVessel,
        hasChanges: false
      }
    });
  }

  @Action(UpdateVesselToWatchFailedAction)
  updateVesselToWatchFailed(
    { getState, patchState }: StateContext<IQcReportState>,
    __: UpdateVesselToWatchAction
  ): void {
    const state = getState();
    patchState({
      details: {
        ...state.details,
        hasChanges: false
      }
    });
  }

  @Action([
    QcVerifyReportAction,
    QcVerifyReportSuccessfulAction,
    QcVerifyReportFailedAction
  ])
  verifyReportAction(
    { getState, patchState }: StateContext<IQcReportState>,
    action:
      | QcVerifyReportAction
      | QcVerifyReportSuccessfulAction
      | QcVerifyReportFailedAction
  ): void {
    const state = getState();

    if (isAction(action, QcVerifyReportAction)) {
      patchState({
        details: { ...state.details, isVerifying: true }
      });
    } else {
      patchState({
        details: {
          ...state.details,
          status: this.surveyStatusLookups.verified,
          isVerifying: false
        }
      });
    }
  }

  @Action([
    QcRevertVerifyReportAction,
    QcRevertVerifyReportSuccessfulAction,
    QcRevertVerifyReportFailedAction
  ])
  revertVerifyReportAction(
    { getState, patchState }: StateContext<IQcReportState>,
    action:
      | QcRevertVerifyReportAction
      | QcRevertVerifyReportSuccessfulAction
      | QcRevertVerifyReportFailedAction
  ): void {
    const state = getState();

    if (isAction(action, QcRevertVerifyReportAction)) {
      patchState({
        details: { ...state.details, isRevertVerifying: true }
      });
    } else {
      patchState({
        details: {
          ...state.details,
          status: state.details.hasSentEmail
            ? this.surveyStatusLookups.pending
            : this.surveyStatusLookups.new,
          isRevertVerifying: false
        }
      });
    }
  }

  @Action(UpdateQcReportVessel)
  updateQcReportVessel(
    { getState, patchState }: StateContext<IQcReportState>,
    { vessel }: UpdateQcReportVessel
  ): void {
    const state = getState();
    patchState({
      details: {
        ...state.details,
        hasChanges: true,
        vessel: vessel,
        portCall: undefined
      }
    });
  }

  @Action(UpdateQcReportPortCall)
  updateQcReportPortCall(
    { getState, patchState }: StateContext<IQcReportState>,
    { portCall }: UpdateQcReportPortCall
  ): void {
    const state = getState();
    patchState({
      details: {
        ...state.details,
        hasChanges: true,
        portCall: portCall
      }
    });
  }

  @Action(LoadReportSurveyHistoryAction)
  loadReportSurveyHistoryAction(
    { getState, patchState }: StateContext<IQcReportState>,
    { serverGridInfo }: LoadReportSurveyHistoryAction
  ): void {
    const state = getState();
    patchState({
      details: {
        ...state.details,
        surveyHistory: {
          ...state.details.surveyHistory,
          gridInfo: serverGridInfo,
          _isLoading: true,
          _hasLoaded: false
        }
      }
    });
  }

  @Action([
    LoadReportSurveyHistorySuccessfulAction,
    LoadReportSurveyHistoryFailedAction
  ])
  loadReportSurveyHistoryActionFinished(
    { getState, patchState }: StateContext<IQcReportState>,
    action:
      | LoadReportSurveyHistorySuccessfulAction
      | LoadReportSurveyHistoryFailedAction
  ): void {
    const state = getState();

    if (isAction(action, LoadReportSurveyHistorySuccessfulAction)) {
      const {
        nbOfMatched,
        nbOfMatchedWithinLimit,
        nbOfNotMatched,
        totalCount
      } = <LoadReportSurveyHistorySuccessfulAction>action;
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
            totalCount: totalCount
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

  @Action([QcClearPortCallBdnAction])
  clearPortCallBdnAction(
    { getState, patchState }: StateContext<IQcReportState>,
    _: QcClearPortCallBdnAction
  ): void {
    const state = getState();

    const productTypesById = { ...state.details.productTypesById };

    values(productTypesById).forEach(p => {
      const productType = productTypesById[p.productType.id];

      productTypesById[p.productType.id] = {
        ...productType,
        deliveredQuantityBdnQty: undefined
      };
    });

    patchState({
      details: {
        ...state.details,
        productTypesById: productTypesById,
        nbOfClaims: undefined,
        nbOfDeliveries: undefined
      }
    });
  }

  @Action([
    QcUpdatePortCallAction,
    QcUpdatePortCallSuccessfulAction,
    QcUpdatePortCallFailedAction
  ])
  updatePortCallBdnActionFinished(
    { getState, patchState }: StateContext<IQcReportState>,
    action:
      | QcUpdatePortCallAction
      | QcUpdatePortCallSuccessfulAction
      | QcUpdatePortCallFailedAction
  ): void {
    const state = getState();

    if (isAction(action, QcUpdatePortCallSuccessfulAction)) {
      const success = <QcUpdatePortCallSuccessfulAction>action;

      const productTypesById = { ...state.details.productTypesById };

      (success.productTypes ?? []).forEach(p => {
        const productType = productTypesById[p.productType.id];
        if (!productType) return;

        productTypesById[p.productType.id] = {
          ...productType,
          deliveredQuantityBdnQty: p.bdnQuantity
        };
      });

      patchState({
        details: {
          ...state.details,
          isUpdatingPortCallBtn: false,
          productTypesById: productTypesById,
          nbOfClaims: success.nbOfClaims,
          nbOfDeliveries: success.nbOfDeliveries
        }
      });
    } else if (isAction(action, QcUpdatePortCallAction)) {
      patchState({
        details: {
          ...state.details,
          isUpdatingPortCallBtn: true
        }
      });
    } else if (isAction(action, QcUpdatePortCallFailedAction)) {
      patchState({
        details: {
          ...state.details,
          isUpdatingPortCallBtn: false
        }
      });
    }
  }
}
