import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { IBunkeringPlanApiService } from './api/bunkering-plan.api.service.interface';




export namespace BunkeringPlanApiPaths{
    export const getBunkeringPlanDetails = () => `api/BOPS/bunkerplan/getBunkerPlanDetail`;
    export const getBunkeringPlanIdAndStatus = () => `api/BOPS/bunkerplan/getBunkerPlanInitial` ;
}

@Injectable({
  providedIn: 'root'
})
export class BunkeringPlanService{

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
}



export const BUNKERING_PLAN_API_SERVICE = new InjectionToken<
  IBunkeringPlanApiService
>('BUNKERING_PLAN_API_SERVICE');

