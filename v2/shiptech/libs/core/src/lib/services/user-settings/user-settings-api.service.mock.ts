import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  IDeleteUserSettingRequest,
  IDeleteUserSettingResponse,
  IPurgeUserSettingsRequest,
  IPurgeUserSettingsResponse,
  IUpsertUserSettingRequest,
  IUpsertUserSettingResponse,
  IUserSettingByKeyRequest,
  IUserSettingResponse,
  IUserSettingsRequest
} from './request-response';
import { IUserSettingsApiService } from './user-settings-api.interface';
import { UserSettingsApiService } from './user-settings-api.service';
import { ApiCall, ApiCallForwardTo } from '../../utils/decorators/api-call.decorator';
import { IPreferenceStorage } from '../preference-storage/preference-storage.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsApiServiceMock implements IUserSettingsApiService, IPreferenceStorage {
  @ApiCallForwardTo() realService: UserSettingsApiService;

  constructor(realService: UserSettingsApiService) {
    this.realService = realService;
  }

  @ApiCall()
  delete(request: IDeleteUserSettingRequest): Observable<IDeleteUserSettingResponse> {
    return of({
      success: true
    });
  }

  @ApiCall()
  purge(request: IPurgeUserSettingsRequest): Observable<IPurgeUserSettingsResponse> {
    return of({
      success: true
    });
  }

  @ApiCall()
  getByKey(request: IUserSettingByKeyRequest): Observable<IUserSettingResponse> {
    return of();
  }

  @ApiCall()
  getList(request: IUserSettingsRequest): Observable<IUserSettingResponse> {
    return of();
  }

  @ApiCall()
  save(request: IUpsertUserSettingRequest): Observable<IUpsertUserSettingResponse> {
    return of({
      success: true
    });
  }

  @ApiCall()
  get<T>(key: string): Observable<T> {
    return this.getByKey({ key }).pipe(map(response => <T>response.value[key]));
  }

  @ApiCall()
  // NOTE: this need further testing
  getMultiple<T>(keys: string[]): Observable<T[]> {
    return this.getList({ keys }).pipe(map(response => <T[]>response.value));
  }

  @ApiCall()
  remove(key: string): Observable<any> {
    return this.delete({ key });
  }

  @ApiCall()
  removeAll(): Observable<any> {
    return this.purge({});
  }

  @ApiCall()
  set(key: string, value: any): Observable<any> {
    return this.save({ key, value: typeof value === 'string' ? value : JSON.stringify(value) });
  }
}
