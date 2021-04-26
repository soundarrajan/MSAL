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
import _ from 'lodash';

export class QcReportDetailsModel {
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

  constructor(props: Partial<IQcReportDetailsState> = {}) {
    const  decodeHtmlEntity = function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
          return String.fromCharCode(dec);
      });
    };
    if (props) {
      props.comment = props.comment ? decodeHtmlEntity(_.unescape(props.comment)) : '';
    }
    if (props.vesselResponse) {
      props.vesselResponse.sludge.description = props.vesselResponse.sludge.description ? decodeHtmlEntity(_.unescape(props.vesselResponse.sludge.description)) : '';
      props.vesselResponse.bunker.description = props.vesselResponse.bunker.description ? decodeHtmlEntity(_.unescape(props.vesselResponse.bunker.description)) : '';
    }
    if (props.uoms){
      for (let i = 0; i < props.uoms.length; i++) {
        props.uoms[i].name =  decodeHtmlEntity(_.unescape(props.uoms[i].name));
        props.uoms[i].displayName = decodeHtmlEntity(_.unescape(props.uoms[i].displayName));
      }
    }
    if (props.vessel) {
      props.vessel.name = decodeHtmlEntity(_.unescape(props.vessel.name));
    }
    Object.assign(this, props);
  }

}

export interface IQcReportDetailsState extends QcReportDetailsModel {}
