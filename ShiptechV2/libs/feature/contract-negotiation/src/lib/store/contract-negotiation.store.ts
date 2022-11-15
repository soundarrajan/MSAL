
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ContractRequest } from './actions/ag-grid-row.action';

@State<ContractNegotiationStoreModel>({
  name: 'contractNegotiation',
  defaults: {
    ContractRequest : null
  }
})

export class ContractNegotiationStoreModel {
  
  constructor() {
    // Initialization inside the constructor 
  }
    
  @Action(ContractRequest)
  ContractRequest(
    { getState, patchState }: StateContext<any>,
    { payload }: ContractRequest
  ): any {
    patchState({
      ContractRequest: payload
    });
  }

}
