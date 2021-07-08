import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ISaveVesselData } from './../shared-model/vessel-data-model';
import { SaveBunkeringPlanModel,CurrentROBModel } from './bunkering-plan.model';
import { SaveBunkeringPlanAction, UpdateBunkeringPlanAction, SaveCurrentROBAction, UpdateCurrentROBAction, UpdateBplanTypeAction,saveVesselDataAction,
         GeneratePlanAction, SaveScrubberReadyAction, ImportGsisAction, GeneratePlanProgressAction, SendPlanAction, ImportGsisProgressAction, newVesselPlanAvailableAction } from './bunkering-plan.action';



export class SaveBunkeringPlanStateModel{
  BPlanData : SaveBunkeringPlanModel[];
}

export class SaveScrubberReadyStateModel{
  hsfoHeader : string;
}

export class SaveVessleDataStateModel{
  vesselData : ISaveVesselData;
}

@State <SaveBunkeringPlanStateModel>({
  name : 'SaveBunkeringPlan',
  defaults : {
    BPlanData: []
  }
})
//This state is meant to store values required to SAVE Current bunkering plan
@Injectable()
export class SaveBunkeringPlanState{

  @Selector([SaveBunkeringPlanState])
  static getBunkeringPlanData(state: SaveBunkeringPlanStateModel):SaveBunkeringPlanModel[]{
    return state?.BPlanData
  }

  @Selector([SaveBunkeringPlanState])
  static getCBPhsfo05_stock(state: SaveBunkeringPlanStateModel):any{
    return state?.BPlanData[0]?.hsfo05_stock;
  }

  @Selector([SaveBunkeringPlanState])
  static getSaveBunkeringPlanData(state: SaveBunkeringPlanStateModel):SaveBunkeringPlanModel[]{
    let data = [];
    let params = state?.BPlanData;
    params.forEach(bPlan =>{  
      data.push({
          plan_id: bPlan.plan_id,
          detail_no: bPlan.detail_no,
          port_id: bPlan.port_id,
          service_code: bPlan.service_code,
          operator_ack: bPlan.operator_ack,
          hsfo_max_lift: bPlan.hsfo_max_lift,
          hsfo_estimated_consumption: bPlan.hsfo_estimated_consumption,
          hsfo_estimated_lift: bPlan.hsfo_estimated_lift,
          hsfo_safe_port: bPlan.hsfo_safe_port,
          hsfo_soa: bPlan.hsfo_soa,
          eca_estimated_consumption: bPlan.eca_estimated_consumption,
          eca_safe_port: bPlan.eca_safe_port,
          ulsfo_estimated_lift: bPlan.ulsfo_estimated_lift,
          ulsfo_max_lift: bPlan.ulsfo_max_lift,
          ulsfo_soa: bPlan.ulsfo_soa,
          lsdis_max_lift: bPlan.lsdis_max_lift,
          lsdis_estimated_consumption: bPlan.lsdis_estimated_consumption,
          lsdis_estimated_lift: bPlan.lsdis_estimated_lift,
          lsdis_safe_port: bPlan.lsdis_safe_port,
          lsdis_soa: bPlan.lsdis_soa,
          hsfo_min_sod: bPlan.hsfo_min_sod,
          eca_min_sod: bPlan.eca_min_sod,
          min_sod: bPlan.min_sod,
          max_sod: bPlan.max_sod,
          hsdis_estimated_lift: bPlan.hsdis_estimated_lift,
          business_address: bPlan.business_address,
          is_min_soa: bPlan.is_min_soa,
          min_soa_comment: bPlan.min_soa_comment,
          min_sod_comment: bPlan.min_sod_comment,
          hsfo_sod_comment: bPlan.hsfo_sod_comment,
          eca_sod_comment: bPlan.eca_sod_comment,
          max_sod_comment: bPlan.max_sod_comment
      }) ;

    })
    return data;
  }

  @Action(SaveBunkeringPlanAction)
  save({getState, patchState}: StateContext<SaveBunkeringPlanStateModel>, {payload}:SaveBunkeringPlanAction){
    const state = getState();
    patchState({
      // BPlanData:[...state.BPlanData,...payload]
      ...state,
      BPlanData : [...payload]
    })
  }

  @Selector([SaveBunkeringPlanState])
  static getUpdateBunkeringPlanData(state: SaveBunkeringPlanStateModel):any{
    return state?.BPlanData[0]?.hsfo_max_lift;
  }

  @Action(UpdateBunkeringPlanAction)
  update({getState, patchState}: StateContext<SaveBunkeringPlanStateModel>, {payload, type, detail_no}:UpdateBunkeringPlanAction){
    const state = getState();
    let BPlanData = JSON.parse(JSON.stringify(state.BPlanData));
    let BPlanDataIndex = BPlanData.findIndex(data => data.detail_no == detail_no)
    switch(type){

      case 'operator_ack':{
                              BPlanData[BPlanDataIndex].operator_ack = payload;
                              break;
                            }
      case 'hsfo_max_lift':{
                              BPlanData[BPlanDataIndex].hsfo_max_lift = payload;
                              break;
                            }
      case 'hsfo_estimated_consumption':{
                                          BPlanData[BPlanDataIndex].hsfo_estimated_consumption = payload;
                                          break;
                                        }
      case 'hsfo_safe_port':{
                              BPlanData[BPlanDataIndex].hsfo_safe_port = payload;
                              break;
                            }
      case 'hsfo_soa':{ if(BPlanData[BPlanDataIndex]?.hsfo_soa)
                        BPlanData[BPlanDataIndex].hsfo_soa = payload;
                        break;
                      }
      case 'hsfo05_stock':{
                              BPlanData[BPlanDataIndex].hsfo05_stock = payload;
                              break;
                          }
      case 'eca_estimated_consumption':{
                                          BPlanData[BPlanDataIndex].eca_estimated_consumption = payload;
                                          break;
                                        }
      case 'eca_safe_port':{
                              BPlanData[BPlanDataIndex].eca_safe_port = payload;
                              break;
                            }
      case 'ulsfo_max_lift':{
                              BPlanData[BPlanDataIndex].ulsfo_max_lift = payload;
                              break;
                            }
      case 'ulsfo_estimated_lift':{
                                    BPlanData[BPlanDataIndex].ulsfo_estimated_lift = payload;
                                    break;
                                  }
      case 'ulsfo_soa':{  if(BPlanData[BPlanDataIndex].ulsfo_soa)
                          BPlanData[BPlanDataIndex].ulsfo_soa = payload;
                          break;
                        }

      case 'lsdis_max_lift':{
                              BPlanData[BPlanDataIndex].lsdis_max_lift = payload;
                              break;
                            }
      case 'lsdis_estimated_consumption':{
                                          BPlanData[BPlanDataIndex].lsdis_estimated_consumption = payload;
                                          break;
                                        }
      case 'lsdis_safe_port':{
                                BPlanData[BPlanDataIndex].lsdis_safe_port = payload;
                                break;
                              }
      case 'lsdis_as_eca':{
                            BPlanData[BPlanDataIndex].lsdis_as_eca = payload;
                            break;
                          }
                          
      case 'lsdis_soa':{  if(BPlanData[BPlanDataIndex].lsdis_soa)
                          BPlanData[BPlanDataIndex].lsdis_soa = payload;
                          break;
                        }
      case 'hsfo_min_sod':{
                            BPlanData[BPlanDataIndex].hsfo_min_sod = payload;
                            break;
                          }
      case 'eca_min_sod':{
                            BPlanData[BPlanDataIndex].eca_min_sod = payload;
                            break;
                          }
      case 'min_sod':{
                        BPlanData[BPlanDataIndex].min_sod = payload;
                        break;
                      }
      case 'max_sod':{
                        BPlanData[BPlanDataIndex].max_sod = payload;
                        break;
                      }
      case 'hsdis_estimated_lift':{
                                      BPlanData[BPlanDataIndex].hsdis_estimated_lift = payload;
                                      break;
                                  }
      case 'business_address':{
                                BPlanData[BPlanDataIndex].business_address = payload;
                                break;
                              }
      case 'is_min_soa':{
                          BPlanData[BPlanDataIndex].is_min_soa = payload;
                          break;
                        }
      case 'min_soa_comment':{
                                BPlanData[BPlanDataIndex].min_soa_comment = payload;
                                break;
                              }
      case 'min_sod_comment':{
                                BPlanData[BPlanDataIndex].min_sod_comment = payload;
                                break;
                              }
      case 'hsfo_sod_comment':{
                                BPlanData[BPlanDataIndex].hsfo_sod_comment = payload;
                                break;
                              }
      case 'eca_sod_comment':{
                                BPlanData[BPlanDataIndex].eca_sod_comment = payload;
                                break; 
                              }
      case 'max_sod_comment':{
                                BPlanData[BPlanDataIndex].max_sod_comment = payload;
                                break;
                              }
    }
    
    patchState({
      ...state,
      BPlanData: BPlanData
      
    })
  }

  @Selector()
  static getVesselData(state: SaveVessleDataStateModel):any{
    return state?.vesselData;
  }

  @Action(saveVesselDataAction)
  saveVesselData({getState, patchState}: StateContext<SaveVessleDataStateModel>, {payload}:saveVesselDataAction){
    const state = getState();
    let vesselRef;
    if(payload?.vesselId) {
      vesselRef = {
        vesselId: payload.vesselId,
        vesselRef: state.vesselData?.vesselRef,
        planId: payload.planId,
        userRole: state.vesselData?.userRole
      }
    } else if(payload?.userRole) {
      vesselRef = {
        vesselId: state.vesselData?.vesselId,
        vesselRef: state.vesselData?.vesselRef,
        planId: state.vesselData?.planId,
        userRole: payload?.userRole
      }
    } else if(payload?.vesselRef) {
      vesselRef = {
        vesselId: payload.vesselRef?.id,
        vesselRef: payload.vesselRef,
        planId: state.vesselData?.planId,
        userRole: state.vesselData?.userRole
      }
    }
    
    patchState({
      ...state,
      vesselData : vesselRef
    })
  }

  @Selector()
  static getHsfoHeaderData(state: SaveScrubberReadyStateModel):any{
    return state?.hsfoHeader;
  }

  @Action(SaveScrubberReadyAction)
  saveHsfoHeader({getState, patchState}: StateContext<SaveScrubberReadyStateModel>,{payload}:SaveScrubberReadyAction){
    const state = getState();
    patchState({
      ...state,
      hsfoHeader : payload
    })
  }

}

export class SaveCurrentROBStateModel{
  CurrentROBObj : CurrentROBModel;
}

@State <SaveCurrentROBStateModel>({
  name : 'SaveCurrentROBObj',
  defaults : {
    CurrentROBObj: {'3.5 QTY': null, '0.5 QTY': null, 'ULSFO': null, 'LSDIS': null, 'HSDIS': null, 'hsfoTankCapacity': null, 'ulsfoTankCapacity': null, 'lsdisTankCapacity': null, 'hsdisTankCapacity': null}
  }
})

@Injectable()
export class SaveCurrentROBState{

  @Selector([SaveCurrentROBState])
  static saveCurrentROB(state: SaveCurrentROBStateModel ):CurrentROBModel{
    return state?.CurrentROBObj;
  }

  @Action(SaveCurrentROBAction)
  saveCurrentROB({getState, patchState}: StateContext<SaveCurrentROBStateModel>, {payload}:SaveCurrentROBAction){
    const state = getState();
    patchState({
      ...state,
      CurrentROBObj : payload
    })
  }

  @Action(UpdateCurrentROBAction)
  updateCurrentROB({getState, patchState}: StateContext<SaveCurrentROBStateModel>, {value, column}:UpdateCurrentROBAction){
    const state = getState();
    let CurrentROBObjData = JSON.parse(JSON.stringify(state.CurrentROBObj));
    CurrentROBObjData[column] = value;
    patchState({
      ...state,
      CurrentROBObj : CurrentROBObjData
    })
  }

}

export class UpdateBplanTypeStateModel{
  BplanType : string;
}

@State <UpdateBplanTypeStateModel>({
  name : 'GetBplanType',
  defaults : {
    BplanType: ''
  }
})
@Injectable()
export class UpdateBplanTypeState{

  @Selector([UpdateBplanTypeState])
  static getBplanType(state: UpdateBplanTypeStateModel ):string{
    return state?.BplanType;
  }

  @Action(UpdateBplanTypeAction)
  saveBplanType({getState, patchState}: StateContext<UpdateBplanTypeStateModel>, {value}:UpdateBplanTypeAction){
    const state = getState();
    patchState({
      ...state,
      BplanType : value
    })
  }
}

export class GeneratePlanStateModel{
  generatePlan : any;
  genInProgress : any;
  importGsis : any;
  importInProgress : any;
  sendPlan : any;
  isNewVesselPlanAvailable : any;
}

@State <GeneratePlanStateModel>({
  name : 'GeneratePlan',
  defaults : {
    generatePlan : 0,
    genInProgress : 0,
    importGsis : 0,
    importInProgress : 0,
    sendPlan : 0,
    isNewVesselPlanAvailable : 'N'
  }
})
@Injectable()
export class GeneratePlanState{

  @Selector([GeneratePlanState])
  static getGeneratePlan(state: GeneratePlanStateModel ):any{
    return state?.generatePlan;
  }

  @Selector([GeneratePlanState])
  static getProgressOfGeneratePlan(state: GeneratePlanStateModel ):any{
    return state?.genInProgress;
  }

  @Selector([GeneratePlanState])
  static getImportGsis(state: GeneratePlanStateModel ):any{
    return state?.importGsis;
  }

  @Selector([GeneratePlanState])
  static getImportGsisProgress(state: GeneratePlanStateModel ):any{
    return state?.importInProgress;
  }

  @Selector([GeneratePlanState])
  static getSendPlan(state: GeneratePlanStateModel ):any{
    return state?.sendPlan;
  }

  @Selector([GeneratePlanState])
  static getIsNewVesselPlanAvailable(state: GeneratePlanStateModel ):any{
    return state?.isNewVesselPlanAvailable;
  }

  @Action(GeneratePlanAction)
  saveGeneratePlan({getState, patchState}: StateContext<GeneratePlanStateModel>, {value}:GeneratePlanAction){
    const state = getState();
    patchState({
      ...state,
      generatePlan : value
    })
  }

  @Action(GeneratePlanProgressAction)
  saveProgressGeneratePlan({getState, patchState}: StateContext<GeneratePlanStateModel>, {value}:GeneratePlanProgressAction){
    const state = getState();
    patchState({
      ...state,
      genInProgress : value
    })
  }

  @Action(ImportGsisAction)
  saveImportGsis({getState, patchState}: StateContext<GeneratePlanStateModel>, {value}:ImportGsisAction){
    const state = getState();
    patchState({
      ...state,
      importGsis : value
    })
  }

  @Action(ImportGsisProgressAction)
  saveImportGsisProgress({getState, patchState}: StateContext<GeneratePlanStateModel>, {value}:ImportGsisProgressAction){
    const state = getState();
    patchState({
      ...state,
      importInProgress : value
    })
  }

  @Action(SendPlanAction)
  saveSendPlan({getState, patchState}: StateContext<GeneratePlanStateModel>, {value}:SendPlanAction){
    const state = getState();
    patchState({
      ...state,
      sendPlan : value
    })
  }

  @Action(newVesselPlanAvailableAction)
  isNewVesselPlanAvailable({getState, patchState}: StateContext<GeneratePlanStateModel>, {value}:newVesselPlanAvailableAction){
    const state = getState();
    patchState({
      ...state,
      isNewVesselPlanAvailable : value
    })
  }
}
