import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  SetStaticLists,
  SetCounterpartyList,
  SetLocationsRows,
  AddCounterpartyToLocations,
  EditLocationRow,
  SetLocations
} from './actions/ag-grid-row.action';

import {
  SetRequestGroupId,
  SetCurrentRequest,
  SetCurrentRequestSmallInfo
} from './actions/request-group-actions';

export class SpotNegotiationStoreModel {
  staticLists: any;
  counterpartyList: any;
  // Until here
  groupOfRequestsId: number | null;
  locations: Array<any>;
  locationsRows: Array<any>;
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
    this.locations = [];
    this.locationsRows = [];
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
    locations: [],
    commentsForCurrentRequest: [],
    currentRequest: null,
    locationsRows: [],
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

  @Action(SetLocations)
  setLocations(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetLocations
  ): void {
    patchState({
      locations: payload
    });
  }

  // Group Of Requests Id
  @Action(SetRequestGroupId)
  setRequestGroupId(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetRequestGroupId
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
  @Action(SetLocationsRows)
  SetLocationsRows(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetLocationsRows
  ) {
    patchState({
      locationsRows: payload
    });
  }

  // Rows lists
  @Action(EditLocationRow)
  EditLocationRow(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: EditLocationRow
  ) {
    patchState({
      locationsRows: getState().locationsRows.map(row => {
        if (row.id === payload.id) {
          return payload;
        }
        return row;
      })
    });
  }

  // Rows lists
  @Action(AddCounterpartyToLocations)
  AddCounterpartyToLocations(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: AddCounterpartyToLocations
  ) {
    const state = getState();
    var ctpys = [...state.locationsRows, ...payload];

    patchState({
      locationsRows: ctpys
    });
  }

  @Selector()
  static getLocations(state: SpotNegotiationStoreModel) {
    return state.locationsRows;
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
