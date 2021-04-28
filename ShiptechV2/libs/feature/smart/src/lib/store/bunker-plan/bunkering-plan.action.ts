import { IBunkeringPlanDetailsInterface } from '../../services/api/dto/bunkering-plan-details.interface';

export class LoadBunkeringPlanDetailsAction {
    static readonly type = '[Bunkering.Plan.Details] Load Bunkering Plan Details';
  
    constructor(public vesselImo: number) {}
  
    
}
  
export class LoadBunkeringPlanDetailsSuccessfulAction {
    static readonly type = '[Bunkering.Plan.Details] Load Bunkering Plan Details Successful';
  
    constructor(
      public bunkeringPlanDetails: IBunkeringPlanDetailsInterface
    ) {}
  
}

export class LoadBunkeringPlanDetailsFailedAction {
    static readonly type = '[Bunkering.Plan.Details] Load Bunkering Plan Details Failed';
  
    constructor() {}
  
    
  }