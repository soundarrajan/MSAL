import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { Observable } from 'rxjs';
import { ObservableException } from '../../utils/decorators/observable-exception.decorator';
import { CommonApiService } from './common-api.service';
import { LoggerFactory } from '@shiptech/core/logging/logger-factory.service';
import _ from 'lodash';
import { ILocationListResponse, IProductListResponse } from './common.api.service.interface';
import { IDocumentsCreateUploadRequest, IDocumentsCreateUploadResponse } from '../masters-api/request-response-dtos/documents-dtos/documents-create-upload.dto';
import { IDocumentsUpdateNotesRequest, IDocumentsUpdateNotesResponse } from '../masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto';
import { IDocumentsDeleteRequest, IDocumentsDeleteResponse } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto';
import { IDocumentsDownloadRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-download.dto';

@Injectable()
export class CommonService extends BaseStoreService implements OnDestroy {
  constructor(protected store: Store, loggerFactory: LoggerFactory, private commonApiService: CommonApiService) {
    super(store, loggerFactory.createLogger(CommonService.name));
  }

  /**
   * @param payload
   */
  @ObservableException()
  getDocumentTypeList(payload: any): Observable<unknown> {
    return this.commonApiService.getDocumentTypeList(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  getDocuments(payload: any): Observable<unknown> {
    return this.commonApiService.getDocuments(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  uploadFile(payload: IDocumentsCreateUploadRequest): Observable<IDocumentsCreateUploadResponse> {
    return this.commonApiService.uploadFile(payload);
  }

  @ObservableException()
  getSellerRatingforNegotiation(payload: any): Observable<unknown> {
    return this.commonApiService.getSellerRatingforNegotiation(payload);
  }

  @ObservableException()
  getProductsList(payload: any): Observable<IProductListResponse> {
    return this.commonApiService.getProductList(payload);
  }

  @ObservableException()
  getLocationsList(payload: any): Observable<ILocationListResponse> {
    return this.commonApiService.getLocationList(payload);
  }

  @ObservableException()
  getMasterListData(items: any): Observable<any> {
    let db;
    let dbReq = indexedDB.open('Shiptech', 10);
    return new Observable(observer => {
      dbReq.onsuccess = function() {
        db = dbReq.result;
        let response: any;
        let returnArr: any;
        var objectStore;
        var objectStoreRequest;
        var transaction = db.transaction(['listsCache'], 'readonly');
        objectStore = transaction.objectStore('listsCache');
        objectStoreRequest = objectStore.getAll();
        objectStoreRequest.onsuccess = function(event) {
          response = event.target.result[0].data;
          if (response) {
            returnArr = _.pick(response, items);
            observer.next(returnArr);
            observer.complete();
          }
        };
      };
      dbReq.onerror = function(event) {
        alert('error opening database ' + event.target);
      };
    });
  }

  /**
   * @param payload
   */
  @ObservableException()
  updateNotes(payload: IDocumentsUpdateNotesRequest): Observable<IDocumentsUpdateNotesResponse> {
    return this.commonApiService.updateNotes(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  downloadDocument(payload: IDocumentsDownloadRequest): Observable<Blob> {
    return this.commonApiService.downloadDocument(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  deleteDocument(payload: IDocumentsDeleteRequest): Observable<IDocumentsDeleteResponse> {
    return this.commonApiService.deleteDocument(payload);
  }
  ngOnDestroy(): void {
    super.onDestroy();
  }
}
