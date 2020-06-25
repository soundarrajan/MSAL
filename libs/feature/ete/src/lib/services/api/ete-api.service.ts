import {Injectable, InjectionToken} from '@angular/core';
import {IEteApiService} from './ete.api.service.interface';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {
  IEteReportDetailsRequest,
  IEteReportDetailsResponse
} from './request-response/ete-details-by-id.request-response';
import {AppConfig} from '@shiptech/core/config/app-config';
import {ObservableException} from '@shiptech/core/utils/decorators/observable-exception.decorator';
import {ApiCallUrl} from '@shiptech/core/utils/decorators/api-call.decorator';

export namespace RobApiPaths {
  export const getReportDetails = () => `api/quantityControlReport/details`;
}

@Injectable({
  providedIn: 'root'
})
export class EteApi implements IEteApiService {
  @ApiCallUrl()
  private _apiUrl = this.appConfig.robApi;

  @ApiCallUrl()
  private _apiUrlMasters = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  @ObservableException()
  getReportDetails(
    request: IEteReportDetailsRequest
  ): Observable<IEteReportDetailsResponse> {
    return this.http.post<IEteReportDetailsResponse>(
      `${this._apiUrl}/${RobApiPaths.getReportDetails()}`,
      {payload: request}
    );
  }

}

export const ETE_API_SERVICE = new InjectionToken<IEteApiService>('QUANTITY_CONTROL_API_SERVICE');
