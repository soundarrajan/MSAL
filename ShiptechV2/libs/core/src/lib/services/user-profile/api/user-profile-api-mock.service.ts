import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiCall, ApiCallForwardTo } from '../../../utils/decorators/api-call.decorator';
import { ObservableException } from '../../../utils/decorators/observable-exception.decorator';
import { Store } from '@ngxs/store';
import { IUserProfileApi, IUserProfileApiResponse } from '@shiptech/core/services/user-profile/api/user-profile-api.interface';
import { UserProfileApi } from '@shiptech/core/services/user-profile/api/user-profile-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileApiMock implements IUserProfileApi {
  @ApiCallForwardTo() realService: UserProfileApi;

  constructor(private store: Store, realService: UserProfileApi) {
    this.realService = realService;
  }

  @ObservableException()
  @ApiCall()
  get(): Observable<IUserProfileApiResponse> {
    return of({
      payload: {
        id: 1,
        username: 'mock-user@shiptech.com',
        displayName: 'Mock User'
      }
    });
  }
}
