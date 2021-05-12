import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { IBunkeringPlanApiService } from './api/bunkering-plan.api.service.interface';
import { BehaviorSubject } from 'rxjs';




export namespace BunkeringPlanApiPaths{
    export const getBunkeringPlanDetails = () => `api/BOPS/bunkerplan/getBunkerPlanDetail`;
    export const getBunkeringPlanIdAndStatus = () => `api/BOPS/bunkerplan/getBunkerPlanInitial` ;
    export const saveBunkeringPlanDetails = () => `api/BOPS/bunkerplan/updateBunkerPlan`;
}

@Injectable({
  providedIn: 'root'
})
export class BunkeringPlanService{

  private changeCurrentROBObj$ = new BehaviorSubject<boolean>(false);
  _changeCurrentROBObj$ = this.changeCurrentROBObj$.asObservable();

  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_BOPS;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  @ObservableException()
  getBunkeringPlanDetails(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${BunkeringPlanApiPaths.getBunkeringPlanDetails()}`,
      { payload: request }
    );
  }

  @ObservableException()
getBunkerPlanIdAndStatus(request: any): Observable<any> {
  return this.http.post<any>(
    `${this._apiUrl}/${BunkeringPlanApiPaths.getBunkeringPlanIdAndStatus()}`,
    { payload: request }
  )
}

@ObservableException()
  saveBunkeringPlanDetails(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${BunkeringPlanApiPaths.saveBunkeringPlanDetails()}`,
      { payload: request }
    );
  }

  setchangeCurrentROBObj(data) {
    this.changeCurrentROBObj$.next(data);
}
}



export const BUNKERING_PLAN_API_SERVICE = new InjectionToken<
  IBunkeringPlanApiService
>('BUNKERING_PLAN_API_SERVICE');

