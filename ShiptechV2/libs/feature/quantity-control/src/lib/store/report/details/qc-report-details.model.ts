import { IQcVesselResponsesState } from './qc-vessel-responses.state';
import { IQcEventsLogState, QcEventsLogStateModel } from './qc-events-log-state.model';
import { IQcProductTypeListItemState, QcProductTypeListItemStateModel } from './qc-product-type-list-item-state.model';
import { IQcSurveyHistoryState, QcSurveyHistoryStateModel } from './qc-survey-history-state.model';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export class QcReportDetailsModel {
  id: number;
  portCallId: string;
  vesselId: number;
  vesselName: string;
  voyageReference: string;
  vesselVoyageDetailId: number;
  status: IDisplayLookupDto;

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

  isSaving = false;
  isRaisingClaim: boolean;
  isVerifying: boolean;
  isRevertVerifying: boolean;
  hasChanges: boolean;

  _hasLoaded: boolean;
  _isLoading: boolean;
}

export interface IQcReportDetailsState extends QcReportDetailsModel {
}
