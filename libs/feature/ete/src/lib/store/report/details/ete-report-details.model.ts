import { IQcVesselResponsesState } from './qc-vessel-responses.state';
import {
  IQcEventsLogState,
  QcEventsLogStateModel
} from './qc-events-log-state.model';
import { IQcProductTypeListItemState } from './qc-product-type-list-item-state.model';
import {
  IQcSurveyHistoryState,
  QcSurveyHistoryStateModel
} from './qc-survey-history-state.model';
import {
  IDisplayLookupDto,
  IVesselToWatchLookupDto
} from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IQcVesselPortCallDto } from '../../../services/api/dto/qc-vessel-port-call.interface';
import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';

export class EteReportDetailsModel {
  isNew: boolean;
  id: number;
  portCall: IQcVesselPortCallDto;
  vessel: IVesselToWatchLookupDto;
  status: IStatusLookupDto;

  hasSentEmail: boolean;

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

  isSaving = false;
  isRaisingClaim: boolean;
  isVerifying: boolean;
  isRevertVerifying: boolean;
  isUpdatingPortCallBtn: boolean;
  hasChanges: boolean;

  _hasLoaded: boolean;
  _isLoading: boolean;

  constructor(props: Partial<IEteReportDetailsState> = {}) {
    Object.assign(this, props);
  }
}

export interface IEteReportDetailsState extends EteReportDetailsModel {}
