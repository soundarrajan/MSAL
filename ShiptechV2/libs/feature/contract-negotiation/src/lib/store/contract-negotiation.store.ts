
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ContractRequest,updateCounterpartyList } from './actions/ag-grid-row.action';
import { SetTenantConfigurations } from './actions/request-group-actions';
@State<ContractNegotiationStoreModel>({
  name: 'contractNegotiation',
  
})

export class ContractNegotiationStoreModel {
  tenantConfigurations: object | null;
  constructor() {
    // Initialization inside the constructor 
  }
    
  @Action(ContractRequest)
  ContractRequest(
    { getState, patchState }: StateContext<any>,
    { payload }: ContractRequest
  ): any {
    payload[0].locations.sort((a,b) => (a['location-name'] > b['location-name']) ? 1 : ((b['location-name'] > a['location-name']) ? -1 : 0))
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

  // Tenant Configuration
  @Action(SetTenantConfigurations)
  setTenantConfigurations(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetTenantConfigurations
  ): void {
    patchState({
      tenantConfigurations: payload
    });
  }

}
