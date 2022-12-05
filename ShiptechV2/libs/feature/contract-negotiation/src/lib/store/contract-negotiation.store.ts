
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ContractRequest,updateCounterpartyList } from './actions/ag-grid-row.action';

@State<ContractNegotiationStoreModel>({
  name: 'contractNegotiation',
  
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

  @Action(updateCounterpartyList)
  updateCounterpartyList(
    { getState, patchState }: StateContext<ContractRequest>,
  ): any{
    const state = getState();
    console.log(updateCounterpartyList);
    // patchState({
    //   ContractRequest: 'payload'
    // });
  }

}
