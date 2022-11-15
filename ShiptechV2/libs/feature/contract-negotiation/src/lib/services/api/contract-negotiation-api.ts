import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { catchError, map } from 'rxjs/operators';
import { IContractNegotiationApiService } from './contract-negotiation.api.service.interface';
import { IContractRequestDetailDto } from '../../data-models/contract-request-detail.dto';

export const apiPaths = {
  tenantConfiguration: `Groups/getTenantConfiguration`,
  staticLists: `api/infrastructure/static/lists`,
  createContractRequest: `api/ContractRequest/create`,
};

@Injectable({
  providedIn: 'root'
})
export class ContractNegotiationApi implements IContractNegotiationApiService {

  @ApiCallUrl()
  private _infrastructureApiUrl = this.appConfig.v1.API
    .BASE_URL_DATA_INFRASTRUCTURE;

  @ApiCallUrl()
  private _negotiationApiUrl = this.appConfig.v1.API.BASE_URL_DATA_NEGOTIATION;

  @ApiCallUrl()
  private _masterApiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  @ApiCallUrl()
  private _sellerApiUrl = this.appConfig.v1.API.BASE_URL_DATA_SELLERRATING;

  @ApiCallUrl()
  private _shitechApiUrl = this.appConfig.v1.API.BASE_URL;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  handleErrorMessage(body: any) {
    return of(
      body instanceof HttpErrorResponse && body.status != 401
        ? body.error.ErrorMessage
          ? body.error.ErrorMessage
          : (body.error.errors)? body.error.errors : body.error.errorMessage
        : { message: 'Unauthorized' }
    );
  }

  @ObservableException()
  getTenantConfiguration(): Observable<any> {
    return this.http
      .get<any>(
        `${this._negotiationApiUrl}/${apiPaths.tenantConfiguration}`
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getStaticLists(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._infrastructureApiUrl}/${apiPaths.staticLists}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  /**
  * Create new contract request
  * @param {*} {requestPayload<IContractRequestDetailDto>}
  * @return {*}  {Observable<any>}
  * @memberof ContractNegotiationApi
  */
  @ObservableException()
  createContractRequest(requestPayload: IContractRequestDetailDto): Observable<IContractRequestDetailDto> {
    return this.http
      .post<any>(
        `${this._shitechApiUrl}/${apiPaths.createContractRequest}`,
        requestPayload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

}

export const CONTRACT_NEGOTIATION_API_SERVICE = new InjectionToken<
  IContractNegotiationApiService
>('CONTRACT_NEGOTIATION_API_SERVICE');
