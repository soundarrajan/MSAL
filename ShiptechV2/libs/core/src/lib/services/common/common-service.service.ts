import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { Observable } from 'rxjs';
import { ObservableException } from '../../utils/decorators/observable-exception.decorator';

import { CommonApiService } from './common-api.service';
import { LoggerFactory } from '@shiptech/core/logging/logger-factory.service';
import _ from 'lodash';
import { ILocationListResponse, IProductListResponse } from './common.api.service.interface';

@Injectable()
export class CommonService extends BaseStoreService implements OnDestroy {

  constructor(
    protected store: Store,
    loggerFactory: LoggerFactory,
    private commonApiService: CommonApiService
  ) {
    super(store, loggerFactory.createLogger(CommonService.name));
  }

  @ObservableException()
  getSellerRatingforNegotiation(payload: any): Observable<unknown>{
    return this.commonApiService.getSellerRatingforNegotiation(payload);
  }

  @ObservableException()
  getProductsList(payload: any): Observable<IProductListResponse>{
    return this.commonApiService.getProductList(payload)  ;
  }

  @ObservableException()
  getLocationsList(payload: any): Observable<ILocationListResponse>{
    return this.commonApiService.getLocationList(payload);
  }

  @ObservableException()
  getMasterListData(items: any): Observable<any> {
    let db;
    let dbReq = indexedDB.open('Shiptech', 10);
    return new Observable((observer) => {
      dbReq.onsuccess = function() {
          db = dbReq.result;
          let response: any;
          let returnArr: any;
          var objectStore;
          var objectStoreRequest;
          var transaction = db.transaction(['listsCache'], 'readonly');
          objectStore = transaction.objectStore("listsCache");
          objectStoreRequest = objectStore.getAll();
          objectStoreRequest.onsuccess = function(event){
              response = event.target.result[0].data;
              if (response) {
                  returnArr = _.pick(response, items);
                  observer.next(returnArr);
                  observer.complete();
              }
          }
      }
      dbReq.onerror = function(event) {
        alert('error opening database ' + event.target);
      }
    })
  }

  ngOnDestroy(): void {
      super.onDestroy();
  }
}