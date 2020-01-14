import { IQcVesselResponsesState } from './qc-vessel-responses.state';
import { IQcEventsLogState, QcEventsLogStateModel } from './qc-events-log-state.model';
import { IQcProductTypeListItemState } from './qc-product-type-list-item-state.model';
import { IQcSurveyHistoryState, QcSurveyHistoryStateModel } from './qc-survey-history-state.model';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IQcVesselPortCall } from '../../../guards/qc-vessel-port-call.interface';
import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';

export class QcReportDetailsModel {
  isNew: boolean;
  id: number;
  portCall: IQcVesselPortCall;
  vessel: IDisplayLookupDto;
  status: IStatusLookupDto;

  uoms: IDisplayLookupDto[];
  productTypes: number[];
  productTypesById: Record<number, IQcProductTypeListItemState>;
  eventsLog: IQcEventsLogState = new QcEventsLogStateModel();
  surveyHistory: IQcSurveyHistoryState = new QcSurveyHistoryStateModel();

  robBeforeDeliveryUom: IDisplayLookupDto;
  robAfterDeliveryUom: IDisplayLookupDto;
  deliveredQtyUom: IDisplayLookupDto;

  nbOfClaims: number;
  nbOfDeliveries: number;

  comment: string;
  vesselResponse: IQcVesselResponsesState;

  emailTransactionTypeId: number;

  entityTransactionType: IDisplayLookupDto;

  isSaving = false;
  isRaisingClaim: boolean;
  isVerifying: boolean;
  isRevertVerifying: boolean;
  isUpdatingPortCallBtn: boolean;
  hasChanges: boolean;

  _hasLoaded: boolean;
  _isLoading: boolean;

  constructor(props: Partial<IQcReportDetailsState> = {}) {
    Object.assign(this, props);
  }
}

export interface IQcReportDetailsState extends QcReportDetailsModel {
}
