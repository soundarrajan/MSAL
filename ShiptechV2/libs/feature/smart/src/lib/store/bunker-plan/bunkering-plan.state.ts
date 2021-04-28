import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { IBunkeringPlanDetailsState, BunkeringPlanDetailsModel } from './bunkering-plan.model';
import { LoadBunkeringPlanDetailsAction } from './bunkering-plan.action';

export class BunkeringPlanDetailsStateModel{
    // details : IBunkeringPlanDetailsState = new BunkeringPlanDetailsModel()
    bplandetails : IBunkeringPlanDetailsState = new BunkeringPlanDetailsModel;
}
@State<BunkeringPlanDetailsStateModel>({
    // name: nameof<IQuantityControlState>('report'),
    name: 'B plan',
    defaults: BunkeringPlanDetailsState.default
  })

@Injectable()
export class BunkeringPlanDetailsState {
  static default = new BunkeringPlanDetailsStateModel();

  constructor(
    private store: Store,
    ) {}

    @Selector()
    static getBunkeringPlandDetails(state: BunkeringPlanDetailsStateModel) {
    return state.bplandetails
    }

    @Action([LoadBunkeringPlanDetailsAction])
    loadBunkeringPlanDetails(
      { getState, patchState }: StateContext<IBunkeringPlanDetailsState>,
      {vesselImo} : LoadBunkeringPlanDetailsAction
    ): void {
      const state = getState();
  
    //  patchState({
    //     bplandetails: {
    //       ...state.prop
    //     }
    //   });
    }

}