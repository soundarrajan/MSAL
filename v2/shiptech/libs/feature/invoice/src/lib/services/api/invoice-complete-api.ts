import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { IInvoiceCompleteApiService } from './invoice-complete.api.service.interface';
import {
  IGetInvoiceCompletesListRequest,
  IGetInvoiceCompletesListResponse
} from './dto/invoice-complete-list-item.dto';
import {
  IGetInvoiceListRequest,
  IGetInvoiceListResponse
} from './dto/invoice-list-item.dto';
import {
  IInvoiceDetailsItemRequest,
  IInvoiceDetailsItemResponse,
  INewInvoiceDetailsItemRequest
} from './dto/invoice-details-item.dto';
import { catchError, map } from 'rxjs/operators';

export namespace InvoiceApiPaths {
  export const getCompletesList = () => `api/invoice/completeViewList`;
  export const getInvoicesList = () => `api/invoice/list`;
  export const getCompletesListExport = () => 'api/invoice/exportCompleteView';
  export const getInvoicesListExport = () => `api/invoice/export`;
  export const getInvoiceItem = () => `api/invoice/get`;
  export const getPhysicalInvoice = () => `api/invoice/getPhysicalDocument`;
  export const getNewInvoiceItem = () => `api/invoice/newFromDelivery`;
  export const getFinalInvoiceDueDates = () =>
    `/api/invoice/finalInvoiceDueDates`;
  export const getDefaultValues = () => `api/invoice/getDefaultValues`;
  export const createInvoiceItem = () => `api/invoice/create`;
  export const updateInvoiceItem = () => `api/invoice/update`;
  export const productListOnInvoice = () =>
    `api/invoice/deliveriesToBeInvoicedList`;
  export const submitapproval = () => `api/invoice/submitForApproval`;
  export const cancelInvoiceItem = () => `api/invoice/cancel`;
  export const acceptInvoiceItem = () => `api/invoice/accept`;
  export const revertInvoiceItem = () => `api/invoice/revert`;
  export const rejectInvoiceItem = () => `api/invoice/reject`;
  export const approveInvoiceItem = () => `api/invoice/approve`;
  export const submitForReview = () => `api/invoice/submitForReview`;
  export const getStaticLists = () => `api/infrastructure/static/lists`;
  export const getUomConversionFactor = () =>
    `api/masters/uoms/convertQuantity`;
  export const calculateProductRecon = () => `api/invoice/invoiceproduct`;
  export const addTransaction = () => `api/invoice/deliveriesToBeInvoicedList`;
  export const totalConversion = () => `api/invoice/totalConversion`;
  export const getAdditionalCostsComponentTypes = () =>
    `api/masters/additionalcosts/listApps`;
  export const getApplyForList = () => `api/invoice/getApplicableProducts`;
  export const calculateCostRecon = () => `/api/invoice/invoicecost`;
  export const getBankAccountNumber = () =>
    `/api/invoice/getAccountNumberCounterpartylist`;
  export const getTenantConfiguration = () =>
    `api/admin/tenantConfiguration/get`;
  // export const notesAutoSave = () => `api/invoice/autosave`;
  export const createCreditNoteInvoiceFromClaim = () =>
    `api/invoice/newFromClaim`;
  export const createPreClaimCreditNote = () => `api/invoice/newPreclaimCN`;
  export const getAdditionalCostsPerPort = () =>
    `api/masters/additionalcosts/listforlocation`;
  export const getRangeTotalAdditionalCosts = () =>
    `api/procurement/order/getRangeTotalAdditionalCosts`;
  export const getPaymentTermList = () => `api/masters/paymentterm/list`;
  export const getCompanyList = () => `api/masters/companies/list`;
  export const getCustomerList = () => `api/masters/counterparties/listByTypes`;
  export const getPaybleToList = () => `api/masters/counterparties/listByTypes`;
  export const getWorkingDueDate = () => `api/invoice/workingDueDate`;
  export const getDueDateWithoutSave = () => `api/invoice/dueDateWithoutSave`;
  export const notesAutoSave = () => `api/procurement/order/autosave`;
  export const getOrderNotes = () => `api/procurement/order/getNotes`;
  export const exchangeRatesConvert = () => `api/masters/exchangeRates/convert`;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceCompleteApi implements IInvoiceCompleteApiService {
  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_INVOICES;

  @ApiCallUrl()
  private _infrastructureApiUrl = this.appConfig.v1.API
    .BASE_URL_DATA_INFRASTRUCTURE;

  @ApiCallUrl()
  private _masterUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  @ApiCallUrl()
  private _reconUrl = this.appConfig.v1.API.BASE_URL_DATA_RECON;

  @ApiCallUrl()
  private _adminApiUrl = this.appConfig.v1.API.BASE_URL_DATA_ADMIN;

  @ApiCallUrl()
  private _procurementApiUrl = this.appConfig.v1.API.BASE_URL_DATA_PROCUREMENT;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  @ObservableException()
  getReportList(
    request: IGetInvoiceCompletesListRequest
  ): Observable<IGetInvoiceCompletesListResponse> {
    return this.http.post<IGetInvoiceCompletesListResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.getCompletesList()}`,
      { payload: request }
    );
  }

  @ObservableException()
  getInvoiceList(
    request: IGetInvoiceListRequest
  ): Observable<IGetInvoiceListResponse> {
    return this.http.post<IGetInvoiceListResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.getInvoicesList()}`,
      { payload: request }
    );
  }

  getReportListExportUrl(): string {
    return `${this._apiUrl}/${InvoiceApiPaths.getCompletesListExport()}`;
  }

  getInvoiceListExportUrl(): string {
    return `${this._apiUrl}/${InvoiceApiPaths.getInvoicesListExport()}`;
  }

  @ObservableException()
  getInvoicDetails(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.getInvoiceItem()}`, {
        payload: request
      })
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

  getPhysicalInvoice(request: any) {
    return this.http.post(
      `${this._apiUrl}/${InvoiceApiPaths.getPhysicalInvoice()}`,
      { Payload: request },
      { responseType: 'arraybuffer' }
    );
  }

  @ObservableException()
  getNewInvoicDetails(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.getNewInvoiceItem()}`, {
        payload: request
      })
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
  createInvoice(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.createInvoiceItem()}`, {
        payload: request
      })
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
  updateInvoice(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.updateInvoiceItem()}`, {
        payload: request
      })
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error
              ? body.error.ErrorMessage && body.error.Reference
                ? body.error.ErrorMessage + ' ' + body.error.Reference
                : body.error.errorMessage + ' ' + body.error.reference
              : ''
          )
        )
      );
  }

  @ObservableException()
  productListOnInvoice(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.productListOnInvoice()}`, {
        payload: request
      })
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
  approveInvoiceItem(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.approveInvoiceItem()}`, {
        payload: request
      })
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error
              ? body.error.ErrorMessage && body.error.Reference
                ? body.error.ErrorMessage + ' ' + body.error.Reference
                : body.error.errorMessage + ' ' + body.error.reference
              : ''
          )
        )
      );
  }

  @ObservableException()
  submitapproval(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.submitapproval()}`, {
        payload: request
      })
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error
              ? body.error.ErrorMessage && body.error.Reference
                ? body.error.ErrorMessage + ' ' + body.error.Reference
                : body.error.errorMessage + ' ' + body.error.reference
              : ''
          )
        )
      );
  }

  @ObservableException()
  cancelInvoiceItem(request: number): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.cancelInvoiceItem()}`, {
        payload: { id: request }
      })
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error
              ? body.error.ErrorMessage && body.error.Reference
                ? body.error.ErrorMessage + ' ' + body.error.Reference
                : body.error.errorMessage + ' ' + body.error.reference
              : ''
          )
        )
      );
  }

  @ObservableException()
  acceptInvoiceItem(request: number): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.acceptInvoiceItem()}`, {
        payload: { id: request }
      })
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error
              ? body.error.ErrorMessage && body.error.Reference
                ? body.error.ErrorMessage + ' ' + body.error.Reference
                : body.error.errorMessage + ' ' + body.error.reference
              : ''
          )
        )
      );
  }

  @ObservableException()
  revertInvoiceItem(request: number): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.revertInvoiceItem()}`, {
        payload: { id: request }
      })
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error
              ? body.error.ErrorMessage && body.error.Reference
                ? body.error.ErrorMessage + ' ' + body.error.Reference
                : body.error.errorMessage + ' ' + body.error.reference
              : ''
          )
        )
      );
  }

  @ObservableException()
  rejectInvoiceItem(request: number): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.rejectInvoiceItem()}`, {
        payload: { id: request }
      })
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error
              ? body.error.ErrorMessage && body.error.Reference
                ? body.error.ErrorMessage + ' ' + body.error.Reference
                : body.error.errorMessage + ' ' + body.error.reference
              : ''
          )
        )
      );
  }

  @ObservableException()
  submitForReview(request: number): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.submitForReview()}`, {
        payload: { id: request }
      })
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error
              ? body.error.ErrorMessage && body.error.Reference
                ? body.error.ErrorMessage + ' ' + body.error.Reference
                : body.error.errorMessage + ' ' + body.error.reference
              : ''
          )
        )
      );
  }

  @ObservableException()
  getStaticLists(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._infrastructureApiUrl}/${InvoiceApiPaths.getStaticLists()}`,
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
  getUomConversionFactor(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterUrl}/${InvoiceApiPaths.getUomConversionFactor()}`,
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
  calculateProductRecon(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.calculateProductRecon()}`, {
        payload: request
      })
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
  calculateCostRecon(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.calculateCostRecon()}`, {
        payload: request
      })
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
  addTransaction(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.addTransaction()}`, request)
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
  computeInvoiceTotalConversion(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.totalConversion()}`, {
        payload: request
      })
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
  getAdditionalCostsComponentTypes(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${
          this._masterUrl
        }/${InvoiceApiPaths.getAdditionalCostsComponentTypes()}`,
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
  getFinalInvoiceDueDates(
    request: any
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http
      .post<IInvoiceDetailsItemResponse>(
        `${this._apiUrl}/${InvoiceApiPaths.getFinalInvoiceDueDates()}`,
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
  getDefaultValues(request: any): Observable<any> {
    return this.http
      .post<IInvoiceDetailsItemResponse>(
        `${this._apiUrl}/${InvoiceApiPaths.getDefaultValues()}`,
        { payload: request }
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
  getBankAccountNumber(request: any): Observable<IInvoiceDetailsItemResponse> {
    return this.http
      .post<IInvoiceDetailsItemResponse>(
        `${this._apiUrl}/${InvoiceApiPaths.getBankAccountNumber()}`,
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
      .post<IInvoiceDetailsItemResponse>(
        `${this._adminApiUrl}/${InvoiceApiPaths.getTenantConfiguration()}`,
        { payload: request }
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
  getApplyForList(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.getApplyForList()}`, {
        Payload: request
      })
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
  notesAutoSave(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._procurementApiUrl}/${InvoiceApiPaths.notesAutoSave()}`,
        {
          payload: request
        }
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
  createCreditNoteFromInvoiceClaims(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._apiUrl}/${InvoiceApiPaths.createCreditNoteInvoiceFromClaim()}`,
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
  getAdditionalCostsPerPort(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterUrl}/${InvoiceApiPaths.getAdditionalCostsPerPort()}`,
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
  createPreClaimCreditNote(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._apiUrl}/${InvoiceApiPaths.createPreClaimCreditNote()}`,
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
  getRangeTotalAdditionalCosts(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${
          this._procurementApiUrl
        }/${InvoiceApiPaths.getRangeTotalAdditionalCosts()}`,
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
  getPaymentTermList(request: any): Observable<any> {
    const requestUrl = `${
      this._masterUrl
    }/${InvoiceApiPaths.getPaymentTermList()}`;
    return this.http.post(requestUrl, request).pipe(
      map((body: any) => body.payload),
      catchError(() => of('Error, could not load the payment list'))
    );
  }

  @ObservableException()
  getCompanyList(request: any): Observable<any> {
    const requestUrl = `${this._masterUrl}/${InvoiceApiPaths.getCompanyList()}`;
    return this.http.post(requestUrl, request).pipe(
      map((body: any) => body.payload),
      catchError(() => of('Error, could not load the company list'))
    );
  }

  @ObservableException()
  getCustomerList(request: any): Observable<any> {
    const requestUrl = `${
      this._masterUrl
    }/${InvoiceApiPaths.getCustomerList()}`;
    return this.http.post(requestUrl, request).pipe(
      map((body: any) => body.payload),
      catchError(() => of('Error, could not load the customer list'))
    );
  }

  @ObservableException()
  getPaybleToList(request: any): Observable<any> {
    const requestUrl = `${
      this._masterUrl
    }/${InvoiceApiPaths.getPaybleToList()}`;
    return this.http.post(requestUrl, request).pipe(
      map((body: any) => body.payload),
      catchError(() => of('Error, could not load the payable to list'))
    );
  }

  @ObservableException()
  getWorkingDueDate(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.getWorkingDueDate()}`, {
        payload: request
      })
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
  getDueDateWithoutSave(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._apiUrl}/${InvoiceApiPaths.getDueDateWithoutSave()}`, {
        payload: request
      })
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
  getOrderNotes(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._procurementApiUrl}/${InvoiceApiPaths.getOrderNotes()}`,
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
  exchangeRatesConvert(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterUrl}/${InvoiceApiPaths.exchangeRatesConvert()}`,
        request
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
}

export const INVOICE_COMPLETE_API_SERVICE = new InjectionToken<
  IInvoiceCompleteApiService
>('INVOICE_COMPLETE_API_SERVICE');
