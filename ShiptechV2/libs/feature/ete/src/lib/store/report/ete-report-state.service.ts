import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {IEteState} from '../ete-state.service';
import {isAction} from '@shiptech/core/utils/ngxs-utils';
import {
  LoadReportDetailsAction,
  LoadReportDetailsFailedAction,
  LoadReportDetailsSuccessfulAction
} from './ete-report-details.actions';
import {nameof} from '@shiptech/core/utils/type-definitions';
import {keyBy} from 'lodash';
import {EteReportStateModel, IEteReportState} from './ete-report-state.model';
import {QcVesselResponsesStateModel} from './details/qc-vessel-responses.state';
import {QcProductTypeListItemStateModel} from './details/qc-product-type-list-item-state.model';
import {EteReportDetailsModel} from './details/ete-report-details.model';
import {TenantSettingsState} from '@shiptech/core/store/states/tenant/tenant-settings.state';
import {Injectable} from '@angular/core';
import {fromLegacyLookup} from '@shiptech/core/lookups/utils';
import {StatusLookupEnum} from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';

@State<IEteReportState>({
  name: nameof<IEteState>('report'),
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  defaults: EteReportState.default
})
@Injectable({
  providedIn: 'root'
})
export class EteReportState {
  static default = new EteReportStateModel();

  constructor(
    private store: Store
  ) {
  }

  @Selector([EteReportState])
  static isBusy(state: IEteReportState): boolean {
    const isBusy = [
      state.details?._isLoading,
      state.details?.isSaving,
      state.details?.isVerifying,
      state.details?.isRevertVerifying,
      state.details?.isUpdatingPortCallBtn
    ];
    return isBusy.some(s => s);
  }

  @Selector([EteReportState])
  static isVerified(state: IEteReportState): boolean {
    return state?.details?.status?.name === StatusLookupEnum.Verified;
  }

  @Selector([EteReportState.isBusy, EteReportState.isVerified])
  static isReadOnly(isBusy: boolean, isVerified: boolean): boolean {
    return isBusy || isVerified;
  }

  @Selector([EteReportState])
  static isNew(state: IEteReportState): boolean {
    return state.details?.isNew;
  }

  @Selector([EteReportState])
  static hasChanges(state: IEteReportState): boolean {
    return state.details?.hasChanges;
  }

  @Selector([EteReportState])
  static nbOfMatched(state: IEteReportState): number {
    return state.details?.surveyHistory?.nbOfMatched;
  }

  @Selector([EteReportState])
  static nbOfMatchedWithinLimit(state: IEteReportState): number {
    return state.details?.surveyHistory?.nbOfMatchedWithinLimit;
  }

  @Selector([EteReportState])
  static nbOfNotMatched(state: IEteReportState): number {
    return state.details?.surveyHistory?.nbOfNotMatched;
  }

  @Action(LoadReportDetailsAction)
  loadPortCallDetails(
    {getState, patchState}: StateContext<IEteReportState>,
    {reportId}: LoadReportDetailsAction
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

  @Action([LoadReportDetailsSuccessfulAction, LoadReportDetailsFailedAction])
  loadReportDetailsFinished(
    {getState, patchState}: StateContext<IEteReportState>,
    action: LoadReportDetailsSuccessfulAction | LoadReportDetailsFailedAction
  ): void {
    const state = getState();
    // Note: We could have use also TenantSettingService
    const defaultUom = fromLegacyLookup(
      this.store.selectSnapshot(TenantSettingsState.general).tenantFormats.uom
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
        details: new EteReportDetailsModel({
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

}
