import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ISaveVesselData } from './../shared-model/vessel-data-model';
import { SaveBunkeringPlanModel,AddCurrentBunkeringPlanModel, CurrentROBModel } from './bunkering-plan.model';
import { SaveBunkeringPlanAction, UpdateBunkeringPlanAction, AddCurrentBunkeringPlanAction, UpdateCurrentBunkeringPlanAction,SaveCurrentROBAction, UpdateCurrentROBAction, UpdateBplanTypeAction,saveVesselDataAction,
         GeneratePlanAction, SaveScrubberReadyAction } from './bunkering-plan.action';



export class SaveBunkeringPlanStateModel{
  BPlanData : SaveBunkeringPlanModel[];
}

export class SaveScrubberReadyStateModel{
  hsfoHeader : string;
}

export class SaveVessleDataStateModel{
  vesselData : ISaveVesselData;
}

export class AddCurrentBunkeringPlanStateModel{
  CurrentBplanData : AddCurrentBunkeringPlanModel[];
}

@State <SaveBunkeringPlanStateModel>({
  name : 'SaveBunkeringPlan',
  defaults : {
    BPlanData: []
  }
})

@Injectable()
export class SaveBunkeringPlanState{

  @Selector([SaveBunkeringPlanState])
  static getSaveBunkeringPlanData(state: SaveBunkeringPlanStateModel):SaveBunkeringPlanModel[]{
    return state?.BPlanData
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
        vesselId: state.vesselData?.vesselId,
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


@State <AddCurrentBunkeringPlanStateModel>({
  name : 'AddCurrentBunkeringPlan',
  defaults : {
    CurrentBplanData: []
  }
})

@Injectable()
export class AddCurrentBunkeringPlanState{

  // @Selector([AddCurrentBunkeringPlanState])
  // static getCurrentBunkeringPlanData(state: AddCurrentBunkeringPlanStateModel):AddCurrentBunkeringPlanModel[]{
  //   return state?.CurrentBplanData
  // }

  // @Selector([AddCurrentBunkeringPlanState])
  // static getFirstCurrentBunkeringPlanData(state: AddCurrentBunkeringPlanStateModel):AddCurrentBunkeringPlanModel{
  //   return state?.CurrentBplanData[0];
  // }

  @Selector([AddCurrentBunkeringPlanState])
  static getCBPhsfo05_stock(state: AddCurrentBunkeringPlanStateModel):any{
    return state?.CurrentBplanData[0]?.hsfo05_stock;
  }

  @Action(AddCurrentBunkeringPlanAction)
  save({getState, patchState}: StateContext<AddCurrentBunkeringPlanStateModel>, {payload}:AddCurrentBunkeringPlanAction){
    const state = getState();
    patchState({
      ...state,
      CurrentBplanData : [...payload]
    })
  }

  // @Action(UpdateCurrentBunkeringPlanAction)
  // update({getState, patchState}: StateContext<AddCurrentBunkeringPlanStateModel>, {payload, type, detail_no}:UpdateCurrentBunkeringPlanAction){
  //   const state = getState();
  //   let BPlanData = JSON.parse(JSON.stringify(state.CurrentBplanData));
  //   let BPlanDataIndex = BPlanData.findIndex(data => data.detail_no == detail_no)
  //   switch(type){
  //     case 'hsfo_max_lift':{
  //                             BPlanData[BPlanDataIndex].hsfo_max_lift = payload;
  //                             break;
  //                           }
  //     case 'hsfo_estimated_consumption':{
  //                                         BPlanData[BPlanDataIndex].hsfo_estimated_consumption = payload;
  //                                         break;
  //                                       }
  //     case 'hsfo_safe_port':{
  //                             BPlanData[BPlanDataIndex].hsfo_safe_port = payload;
  //                             break;
  //                           }
  //     case 'hsfo05_stock':{
  //                           BPlanData[BPlanDataIndex].hsfo05_stock = payload;
  //                           break;
  //                         }
  //     case 'hsfo_soa':{
  //                           BPlanData[BPlanDataIndex].hsfo_soa = payload;
  //                           break;
  //                         }                    
  //     case 'eca_estimated_consumption':{
  //                                         BPlanData[BPlanDataIndex].eca_estimated_consumption = payload;
  //                                         break;
  //                                       }
  //     case 'eca_safe_port':{
  //                             BPlanData[BPlanDataIndex].eca_safe_port = payload;
  //                             break;
  //                           }
  //     case 'ulsfo_max_lift':{
  //                             BPlanData[BPlanDataIndex].ulsfo_max_lift = payload;
  //                             break;
  //                           }
  //     case 'ulsfo_estimated_lift':{
  //                             BPlanData[BPlanDataIndex].ulsfo_estimated_lift = payload;
  //                             break;
  //                           }
  //     case 'ulsfo_soa':{
  //                             BPlanData[BPlanDataIndex].ulsfo_soa = payload;
  //                             break;
  //                           }
  //     case 'lsdis_max_lift':{
  //                             BPlanData[BPlanDataIndex].lsdis_max_lift = payload;
  //                             break;
  //                           }
  //     case 'lsdis_estimated_consumption':{
  //                                         BPlanData[BPlanDataIndex].lsdis_estimated_consumption = payload;
  //                                         break;
  //                                       }
  //     case 'lsdis_safe_port':{
  //                               BPlanData[BPlanDataIndex].lsdis_safe_port = payload;
  //                               break;
  //                             }
  //     case 'lsdis_estimated_lift':{
  //                               BPlanData[BPlanDataIndex].lsdis_estimated_lift = payload;
  //                               break;
  //                             }
  //     case 'lsdis_as_eca':{
  //                               BPlanData[BPlanDataIndex].lsdis_as_eca = payload;
  //                               break;
  //                             }
  //     case 'lsdis_soa':{
  //                               BPlanData[BPlanDataIndex].lsdis_soa = payload;
  //                               break;
  //                             }
  //   }
    
  //   patchState({
  //     ...state,
  //     CurrentBplanData: BPlanData
      
  //   })
  // }
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
  value : any;
}

@State <GeneratePlanStateModel>({
  name : 'GeneratePlan',
  defaults : {
    value: 0
  }
})
@Injectable()
export class GeneratePlanState{

  @Selector([GeneratePlanState])
  static getBplanType(state: GeneratePlanStateModel ):any{
    return state?.value;
  }

  @Action(GeneratePlanAction)
  saveBplanType({getState, patchState}: StateContext<GeneratePlanStateModel>, {value}:GeneratePlanAction){
    const state = getState();
    patchState({
      ...state,
      value : value
    })
  }
}
