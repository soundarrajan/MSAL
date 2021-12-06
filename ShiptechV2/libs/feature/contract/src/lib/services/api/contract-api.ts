import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';

import { IDeliveryApiService } from './delivery.api.service.interface';
import {
  IDeliveryConversionInfoResponse,
  IDeliveryDetailsRequest,
  IDeliveryDetailsResponse,
  IDeliveryInfoForOrderResponse,
  IDeliveryOrderSummaryResponse,
  IDeliveryQuantityParametersResponse,
  IDeliverySpecParametersResponse,
  IOrderResponse
} from './request-response/delivery-by-id.request-response';
import { catchError, map } from 'rxjs/operators';
import { IContractApiService } from './contract.api.service.interface';

export namespace ContractApiPaths {
  export const getContractDetails = () => `api/contract/contract/get`;
  export const getTenantConfiguration = () =>
    `api/admin/tenantConfiguration/get`;
  export const getStaticLists = () => `api/infrastructure/static/lists`;
  export const getCounterparty = () => `api/masters/counterparties/get`;
  export const getAgreementType = () =>
    `api/masters/agreementType/individualLists`;
  export const getAgreementTypeById = () => `api/masters/agreementtype/get`;
  export const getLocationList = () => `api/masters/locations/list`;
  export const getProductList = () => `api/masters/products/list`;
  export const specGroupGetByProduct = () =>
    `api/masters/specGroups/getByProduct`;
  export const specGroupsGetByProduct = () =>
    `api/masters/specGroups/getAllByProduct`;
  export const getSpecForProcurement = () =>
    `api/contract/contract/getSpecParameterForContractProduct`;
  export const getSpecParameterById = () => `api/masters/specparameters/get`;
  export const saveSpecParameterForContractProduct = () =>
    `api/contract/contract/saveSpecParameterForContractProduct`;
  export const getProdDefaultConversionFactors = () =>
    `api/masters/products/getProdDefaultConversionFactors`;
  export const saveConversionFactorsForContractProduct = () =>
    `api/contract/contract/saveConversionFactorsForContractProduct`;
  export const getFormulaById = () => `api/masters/formulas/get`;
  export const saveFormula = () => `api/masters/formulas/create`;
  export const updateFormula = () => `api/masters/formulas/update`;
  export const getContractFormulaList = () =>
    `api/masters/formulas/listMasters`;
  export const getAdditionalCostsComponentTypes = () =>
    `api/masters/additionalcosts/listApps`;
  export const createContract = () => `api/contract/contract/create`;
  export const updateContract = () => `api/contract/contract/update`;
  export const confirmContract = () => `api/contract/contract/confirm`;
  export const undoConfirmContract = () => `api/contract/contract/undo`;
  export const cancelContract = () => `api/contract/contract/cancel`;
  export const extendContract = () => `api/contract/contract/extend`;
  export const deleteContract = () => `api/contract/contract/delete`;
  export const getContractFormulas = () =>
    `api/contract/contract/getContractFormulas`;
  export const getAdditionalCostsPerPort = () =>
    `api/masters/additionalcosts/listforlocation`;
  export const getProductById = () => `/api/masters/products/get`;
  export const listProductTypeGroupsDefaults = () =>
    `/api/masters/products/listProductTypeGroupsDefaults`;
}

@Injectable({
  providedIn: 'root'
})
export class ContractApi implements IContractApiService {
  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_CONTRACTS;

  @ApiCallUrl()
  private _procurementApiUrl = this.appConfig.v1.API.BASE_URL_DATA_PROCUREMENT;

  @ApiCallUrl()
  private _adminApiUrl = this.appConfig.v1.API.BASE_URL_DATA_ADMIN;

  @ApiCallUrl()
  private _infrastructureApiUrl = this.appConfig.v1.API
    .BASE_URL_DATA_INFRASTRUCTURE;

  @ApiCallUrl()
  private _masterApiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  @ObservableException()
  getContractDetails(request: any): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._apiUrl}/${ContractApiPaths.getContractDetails()}`,
        { payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getTenantConfiguration(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._adminApiUrl}/${ContractApiPaths.getTenantConfiguration()}`,
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

  @ObservableException()
  getStaticLists(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._infrastructureApiUrl}/${ContractApiPaths.getStaticLists()}`,
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

  @ObservableException()
  getCounterparty(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${ContractApiPaths.getCounterparty()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getAgreementType(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${ContractApiPaths.getAgreementType()}`,
        request
      )
      .pipe(
        map((body: any) => body.payload.contractAgreementTypesList),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getAgreementTypeById(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${ContractApiPaths.getAgreementTypeById()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getLocationList(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${ContractApiPaths.getLocationList()}`,
        request
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getProductList(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${ContractApiPaths.getProductList()}`,
        request
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getSpecGroupGetByProduct(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${ContractApiPaths.specGroupGetByProduct()}`,
        request
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getSpecGroupsGetByProduct(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${ContractApiPaths.specGroupsGetByProduct()}`,
        request
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getSpecForProcurement(request: any): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._apiUrl}/${ContractApiPaths.getSpecForProcurement()}`,
        request
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getSpecParameterById(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${ContractApiPaths.getSpecParameterById()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  saveSpecParameterForContractProduct(
    request: any
  ): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${
          this._apiUrl
        }/${ContractApiPaths.saveSpecParameterForContractProduct()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getProdDefaultConversionFactors(
    request: any
  ): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${
          this._masterApiUrl
        }/${ContractApiPaths.getProdDefaultConversionFactors()}`,
        request
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getFormulaById(request: any): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._masterApiUrl}/${ContractApiPaths.getFormulaById()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  saveFormula(request: any): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._masterApiUrl}/${ContractApiPaths.saveFormula()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.upsertedId),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  updateFormula(request: any): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._masterApiUrl}/${ContractApiPaths.updateFormula()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getContractFormulaList(request: any): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._masterApiUrl}/${ContractApiPaths.getContractFormulaList()}`,
        request
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getAdditionalCostsComponentTypes(
    request: any
  ): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${
          this._masterApiUrl
        }/${ContractApiPaths.getAdditionalCostsComponentTypes()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  saveConversionFactorsForContractProduct(
    request: any
  ): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${
          this._apiUrl
        }/${ContractApiPaths.saveConversionFactorsForContractProduct()}`,
        request
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  createContract(request: any): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._apiUrl}/${ContractApiPaths.createContract()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  updateContract(request: any): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._apiUrl}/${ContractApiPaths.updateContract()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  confirmContract(request: any): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._apiUrl}/${ContractApiPaths.confirmContract()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  undoConfirmContract(request: any): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._apiUrl}/${ContractApiPaths.undoConfirmContract()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  cancelContract(request: any): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._apiUrl}/${ContractApiPaths.cancelContract()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error && body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : null
          )
        )
      );
  }

  @ObservableException()
  extendContract(request: any): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._apiUrl}/${ContractApiPaths.extendContract()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  deleteContract(request: any): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._apiUrl}/${ContractApiPaths.deleteContract()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getContractFormulas(request: any): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._apiUrl}/${ContractApiPaths.getContractFormulas()}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getAdditionalCostsPerPort(
    request: any
  ): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._masterApiUrl}/${ContractApiPaths.getAdditionalCostsPerPort()}`,
        request
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  getProductById(request: any): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${this._masterApiUrl}/${ContractApiPaths.getProductById()}`,
        request
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  listProductTypeGroupsDefaults(
    request: any
  ): Observable<IDeliveryDetailsResponse> {
    return this.http
      .post<IDeliveryDetailsResponse>(
        `${
          this._masterApiUrl
        }/${ContractApiPaths.listProductTypeGroupsDefaults()}`,
        request
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }
}

export const CONTRACT_API_SERVICE = new InjectionToken<IContractApiService>(
  'CONTRACT_API_SERVICE'
);
