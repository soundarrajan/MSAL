import {Injectable} from '@angular/core';
import {IEteApiService} from './ete.api.service.interface';
import {Observable, of} from 'rxjs';
import {
  IEteReportDetailsRequest,
  IEteReportDetailsResponse
} from './request-response/ete-details-by-id.request-response';
import {EteApi} from './ete-api.service';
import {getQcReportDetailsCall} from './mock/ete-report-details.mock';
import {ApiCall, ApiCallForwardTo} from '@shiptech/core/utils/decorators/api-call.decorator';

@Injectable({
  providedIn: 'root'
})
export class EteApiMock implements IEteApiService {
  @ApiCallForwardTo() realService: EteApi;

  constructor(realService: EteApi) {
    this.realService = realService;
  }

  @ApiCall()
  getReportDetails(
    request: IEteReportDetailsRequest
  ): Observable<IEteReportDetailsResponse> {
    return of(getQcReportDetailsCall(request.id));
  }

}
