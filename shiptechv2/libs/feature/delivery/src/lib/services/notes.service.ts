import { Inject, Injectable, OnDestroy } from '@angular/core';
import { DeliveryApi, DELIVERY_API_SERVICE } from './api/delivery-api';
import { defer, Observable, of, throwError } from 'rxjs';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { EMPTY$ } from '@shiptech/core/utils/rxjs-operators';
import { IQcVesselPortCallDto } from './api/dto/qc-vessel-port-call.interface';
import { map } from 'rxjs/operators';

@Injectable()


export class NotesService  {
  objNotes:any = [];
  constructor(private deliveryApi: DeliveryApi) {  }

  @ObservableException()
  saveDeliveryInfo(formValues: any): Observable<unknown>  {
    return this.deliveryApi.saveNotesDelivery(formValues);
  }
}
