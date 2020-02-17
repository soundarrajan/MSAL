import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObservableException } from '../../../utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '../../../utils/decorators/api-call.decorator';
import { LoggerFactory } from '../../../logging/logger-factory.service';
import { AppConfig } from '../../../config/app-config';
import { ApiServiceBase } from '@shiptech/core/api/api-base.service';
import {
  IUserProfileApi,
  IUserProfileApiResponse
} from '@shiptech/core/services/user-profile/api/user-profile-api.interface';

export namespace UserProfileApiPaths {
  export const get = () => `api/admin/user/info`;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileApi extends ApiServiceBase implements IUserProfileApi {
  @ApiCallUrl()
  protected _apiUrl: string = this.appConfig.v1.API.BASE_URL_DATA_ADMIN;

  constructor(
    private http: HttpClient,
    private appConfig: AppConfig,
    loggerFactory: LoggerFactory
  ) {
    super(http, loggerFactory.createLogger(UserProfileApi.name));
  }

  @ObservableException()
  public get(): Observable<IUserProfileApiResponse> {
    return this.http.post<IUserProfileApiResponse>(
      `${this._apiUrl}/${UserProfileApiPaths.get()}`,
      {
        payload: true
      }
    );
  }
}

export const USER_PROFILE_API = new InjectionToken<IUserProfileApi>(
  'IUserProfileApi'
);
