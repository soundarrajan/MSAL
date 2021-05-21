import { ISaveVesselData } from './../shared-model/vessel-data-model';
import { SaveBunkeringPlanModel, AddCurrentBunkeringPlanModel, CurrentROBModel } from './bunkering-plan.model';

  
export class SaveBunkeringPlanAction{
  static readonly type = '[BplanData] Save' ;

  constructor(public payload: SaveBunkeringPlanModel[]){

  }
}

export class SaveScrubberReadyAction{
  static readonly type = '[ScrubberReady] Save';

  constructor(public payload: string){

  }
}


export class UpdateBunkeringPlanAction{
  static readonly type = '[BplanData] Update' ;

  constructor(public payload: any, public type: string, public detail_no: number){

  }
}

export class AddCurrentBunkeringPlanAction{
  static readonly type = '[CurrentBplanData] Add';

  constructor(public payload: AddCurrentBunkeringPlanModel[]){

  }
}

export class UpdateCurrentBunkeringPlanAction{
  static readonly type = '[CurrentBplanData] Update' ;

  constructor(public payload: any, public type: string, public detail_no: number){

  }
}

export class saveVesselDataAction{
  static readonly type = '[VesselData] Save' ;

  constructor(public payload: ISaveVesselData){

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

export class UpdateBplanTypeAction{
  static readonly type = '[Bplan Type] Update';
  
  constructor(public value: string){

  }
}

export class GeneratePlanAction{
  static readonly type = '[Plan] Generate';

  constructor(public value: any){

  }
}
