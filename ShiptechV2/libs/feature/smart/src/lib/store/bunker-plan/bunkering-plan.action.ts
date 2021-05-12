
import { SaveBunkeringPlanModel, CurrentROBModel } from './bunkering-plan.model';

  
export class SaveBunkeringPlanAction{
  static readonly type = '[BplanData] Save' ;

  constructor(public payload: SaveBunkeringPlanModel[]){

  }
}


export class UpdateBunkeringPlanAction{
  static readonly type = '[BplanData] Test' ;

  constructor(public payload: any, public type: string, public detail_no: number){

  }
}

export class SaveCurrentROBAction{
  static readonly type = '[Current ROB] Save';
  
  constructor(public payload: CurrentROBModel){

  }
}

export class UpdateCurrentROBAction{
  static readonly type = '[Current ROB] Update';

  constructor(public value: number, public column: string){

  }
}