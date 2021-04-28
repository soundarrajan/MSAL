import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';

export interface IBunkeringPlanApiService {

}

export const BUNKER_PLAN_API_SERVICE = new InjectionToken<
IBunkeringPlanApiService
>('BUNKER_PLAN_API_SERVICE');