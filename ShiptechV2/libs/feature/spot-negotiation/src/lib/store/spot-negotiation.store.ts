import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  SetStaticLists,
  SetCounterpartyList,
  SetLocations,
  SetGroupOfRequestsId,
  SetRequests,
  SetCurrentRequest,
  SetCurrentRequestSmallInfo,
  AddCounterpartyToLocations
} from './actions/ag-grid-row.action';

export class SpotNegotiationStoreModel {
  staticLists: any;
  counterpartyList:any;
  // Until here
  groupOfRequestsId: number | null;
  requests: Array<any>;
  locations: Array<any>;
  additionalCost: Array<any>;
  availableTermContracts: Array<any>;
  sellerRating: Array<any>;
  commentsForCurrentRequest: Array<any>;
  sellerComments: Array<any>;
  currentRequest: object | null;
  currentRequestSmallInfo: object | null;
  formulaPricingDetails: object | null;
  marketPriceHistory: object | null;
  offerPriceHistory: object | null;

  constructor() {
    // Initialization inside the constructor
    this.staticLists = {};
    this.counterpartyList = {};
    this.requests = [];
    this.locations = [];
    this.additionalCost = [];
    this.sellerRating = [];
    this.availableTermContracts = [];
    this.currentRequestSmallInfo = null;
    this.currentRequest = null;
    this.formulaPricingDetails = null;
    this.marketPriceHistory = null;
    this.commentsForCurrentRequest = [];
    this.sellerComments = [];
    this.groupOfRequestsId = null;
    this.offerPriceHistory = null;
  }
}

@State<SpotNegotiationStoreModel>({
  name: 'spotNegotiation',
  defaults: {
    groupOfRequestsId: null,
    currentRequestSmallInfo: null,
    requests: [],
    commentsForCurrentRequest: [],
    currentRequest: null,
    locations: [],
    additionalCost: [],
    availableTermContracts: [],
    formulaPricingDetails: {},
    sellerRating: [],
    offerPriceHistory: {},
    sellerComments: [],
    marketPriceHistory: {},
    staticLists: [],
    counterpartyList: []
  }
})
export class SpotNegotiationStore {
  // Requests
  @Action(SetCurrentRequestSmallInfo)
  setCurrentRequestSmallInfo(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetCurrentRequestSmallInfo
  ): any {
    patchState({
      currentRequestSmallInfo: payload
    });
  }

  // Requests
  @Action(SetCurrentRequest)
  setCurrentRequest(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetCurrentRequest
  ): void {
    patchState({
      currentRequest: payload
    });
  }

  @Action(SetRequests)
  setRequests(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetRequests
  ): void {
    patchState({
      requests: payload
    });
  }

  // Group Of Requests Id
  @Action(SetGroupOfRequestsId)
  setGroupOfRequestsId(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetGroupOfRequestsId
  ): void {
    patchState({
      groupOfRequestsId: payload
    });
  }
  // Static lists
  @Action(SetStaticLists)
  setStaticLists(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetStaticLists
  ): void {
    patchState({
      staticLists: payload
    });
  }

  @Action(SetCounterpartyList)
  SetCounterparties(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetCounterpartyList
  ): void {
    patchState({
      counterpartyList: payload
    });
  }

  // Rows lists
  @Action(SetLocations)
  SetLocations(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetLocations
  ) {
    patchState({
      locations: payload
    });
  }

    // Rows lists
    @Action(AddCounterpartyToLocations)
    AddCounterpartyToLocations(
      { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
      { payload }: AddCounterpartyToLocations
    ) {
      const state = getState();
      var ctpys = [...state.locations, ...payload];

      patchState({
        locations:  ctpys
      });
    }

  @Selector()
  static getStaticList(state: SpotNegotiationStoreModel) {
    return state.staticLists;
  }

  @Selector()
  static getCounterpartyList(state: SpotNegotiationStoreModel) {
    return state.counterpartyList;
  }

}
