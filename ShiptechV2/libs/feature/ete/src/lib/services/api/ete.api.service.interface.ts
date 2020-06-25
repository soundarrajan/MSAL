import {Observable} from 'rxjs';
import {
  IEteReportDetailsRequest,
  IEteReportDetailsResponse
} from './request-response/ete-details-by-id.request-response';

export interface IEteApiService {

  getReportDetails(
    request: IEteReportDetailsRequest
  ): Observable<IEteReportDetailsResponse>;

}
