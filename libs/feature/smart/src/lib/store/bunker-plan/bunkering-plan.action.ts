
import { ISaveBunkeringPlan } from './bunkering-plan.model';

  
export class SaveBunkeringPlanAction{
  static readonly type = '[BplanData] Save' ;

  constructor(public payload: ISaveBunkeringPlan[]){

  }
}


export class UpdateBunkeringPlanAction{
  static readonly type = '[BplanData] Test' ;

  constructor(public payload: any, public type: string, public detail_no: number){

  }
}