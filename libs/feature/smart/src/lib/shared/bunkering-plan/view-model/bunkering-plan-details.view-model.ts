import { Injectable } from '@angular/core';
import { IBunkeringPlanDetailsInterface } from '../../../services/api/dto/bunkering-plan-details.interface';


@Injectable()
export class BunkeringPlanDetailsViewModel {
    
    operator_ack : boolean;
    portCode : string;
    
    hsfoMaxLift : number;
    hsfoEstdSoa : number;
    hsfoEstdCons : number;
    hsfoConfPlanLift : number;
    hsfoSafePort : number;
    
    ecaEstdCons : number;
    ecaSafePort : number;
    
    ulsfoMaxLift : number;
    ulsfoEstdSoa : number;
    ulsfoConfPlanLift : number;
    
    lsdisMaxLift : number;
    lsdisEstdSoa : number;
    lsdisEstdCons : number;
    lsdisConfPlanLift : number;
    lsdisSafePort : number;

    totalMinSod : number;
    totalMinSodPort : string;
    totalMinSodComments : string;
    minHsfoSod : number;
    minHsfoSodPort : string;
    minHsfoSodComment : string;
    minEcaBunkerSod : number;
    minEcaBunkerSodPort : string;
    minEcaBunkerSodComment : string; 
    totalMaxSod : number;
    totalMaxSodPort : string;
    totalMaxSodComment : string;    
    hsdisConfReqLift : number;
    businessAddress : string;
    minSoa : boolean;
    minSoaPort : string;
    minSoaComment : string;
    reqCreated : boolean;
    confirmedByVessel : boolean;
    confirmedByBox : boolean;
    
    constructor(
      item: IBunkeringPlanDetailsInterface
    ) {
      this.operator_ack = item.operator_ack;
      this.portCode = item.port;

      this.hsfoMaxLift = item.hsfo_max_lift;
      this.hsfoEstdSoa = item.hsfo_estd_soa;
      this.hsfoEstdCons = item.hsfo_estd_cons;
      this.hsfoConfPlanLift = item.hasfo_plan_lift;
      this.hsfoSafePort = item.hsfo_safe_port;

      this.ecaEstdCons = item.seca_estd_cons;
      this.ecaSafePort = item.seca_safe_port;

      this.ulsfoMaxLift = item.ulsfo_max_lift_wo;
      this.ulsfoEstdSoa = item.ulsfo_estd_soa;
      this.ulsfoConfPlanLift = item.ulsfo_plan_lift;

      this.lsdisMaxLift = item.lsdis_max_lift;
      this.lsdisEstdSoa = item.lsdis_estd_soa;
      this.lsdisEstdCons = item.lsdis_estd_cons;
      this.lsdisConfPlanLift = item.lsdis_plan_lift;
      this.lsdisSafePort = item.lsdis_safe_port;

      this.totalMinSod = item.total_min_sod.value;
      this.totalMinSodPort = item.total_min_sod.port;
      this.totalMinSodComments = item.total_min_sod.comments;
      this.minHsfoSod = item.min_hsfo_sod.value;
      this.minHsfoSodPort = item.min_hsfo_sod.port;
      this.minHsfoSodComment = item.min_hsfo_sod.comments;
      this.minEcaBunkerSod = item.min_eca_bunker_sod.value;
      this.minEcaBunkerSodPort = item.min_eca_bunker_sod.port;
      this.minEcaBunkerSodComment = item.min_eca_bunker_sod.comments;
      this.totalMaxSod = item.total_max_sod.value;
      this.totalMaxSodPort = item.total_max_sod.port;
      this.totalMaxSodComment = item.total_max_sod.comments;
      this.hsdisConfReqLift = item.req_lift;
      this.businessAddress = item.email;
      this.minSoa = item.min_soa.value;
      this.minSoaPort = item.min_soa.port;
      this.minSoaComment = item.min_soa.comments;
      this.reqCreated = item.req_created;
      this.confirmedByVessel = item.confirmed_by_vessel;
      this.confirmedByBox = item.confirmed_by_box;
  
      
    }
  }