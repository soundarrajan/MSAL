import { map } from 'rxjs/operators';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  SetStaticLists,
  SetCounterpartyList,
  SetLocationsRows,
  AddCounterpartyToLocations,
  AddRequest,
  DelinkRequest,
  EditLocationRow,
  SetLocationsRowsPriceDetails,
  SelectSeller,
  DeleteSeller,
  SetLocations,
  EditLocations,
  EditCounterpartyList,
  RemoveCounterparty,
  SetRequestList,
  SetLocationsRowsOriData,
  AppendCounterpartyList,
  SetPhysicalSupplierCounterpartyList,
  AppendRequestList,
  AppendPhysicalSupplierCounterpartyList,
  UpdateRequest,
  UpdateSpecificRequests,
  AppendLocationsRowsOriData,
  RemoveLocationsRowsOriData,
  UpdateAdditionalCostList
} from './actions/ag-grid-row.action';

import {
  SetRequestGroupId,
  SetCurrentRequest,
  SetCurrentRequestSmallInfo,
  SetAvailableContracts,
  SetRequests,
  SetTenantConfigurations,
  SetCounterparties
} from './actions/request-group-actions';
import _ from 'lodash';

export class SpotNegotiationStoreModel {
  staticLists: any;
  counterpartyList: any;
  physicalSupplierCounterpartyList: any;
  requestList: any;
  counterparties: any;
  // Until here
  groupOfRequestsId: number | null;
  locations: Array<any>;
  locationsRows: Array<any>;
  locationsRowsPriceDetails: Array<any>;
  selectedSellerList: Array<any>;
  additionalCost: Array<any>;
  availableTermContracts: Array<any>;
  LocationsOriData: Array<any>;
  sellerRating: Array<any>;
  commentsForCurrentRequest: Array<any>;
  sellerComments: Array<any>;
  currentRequest: object | null;
  currentRequestSmallInfo: object | null;
  availableContracts: object | null;
  requests: Array<any>;
  formulaPricingDetails: object | null;
  tenantConfigurations: object | null;
  marketPriceHistory: object | null;
  offerPriceHistory: object | null;
  additionalCostList: Array<any>;

  constructor() {
    // Initialization inside the constructor
    this.staticLists = {};
    this.counterpartyList = {};
    this.physicalSupplierCounterpartyList = {};
    this.counterparties = {};
    this.requestList = {};
    this.locations = [];
    this.selectedSellerList = [];
    this.locationsRows = [];
    this.locationsRowsPriceDetails = [];
    this.additionalCost = [];
    this.sellerRating = [];
    this.availableTermContracts = [];
    this.currentRequestSmallInfo = null;
    this.currentRequest = null;
    this.formulaPricingDetails = null;
    this.tenantConfigurations = null;
    this.marketPriceHistory = null;
    this.commentsForCurrentRequest = [];
    this.sellerComments = [];
    this.LocationsOriData = [];
    this.requests = [];
    this.groupOfRequestsId = null;
    this.offerPriceHistory = null;
    this.additionalCostList = [];
  }
}

@State<SpotNegotiationStoreModel>({
  name: 'spotNegotiation',
  defaults: {
    groupOfRequestsId: null,
    currentRequestSmallInfo: null,
    availableContracts: null,
    locations: [],
    requests: [],
    commentsForCurrentRequest: [],
    selectedSellerList: [],
    currentRequest: null,
    locationsRows: [],
    locationsRowsPriceDetails: [],
    additionalCost: [],
    availableTermContracts: [],
    formulaPricingDetails: {},
    tenantConfigurations: {},
    sellerRating: [],
    offerPriceHistory: {},
    sellerComments: [],
    marketPriceHistory: {},
    staticLists: [],
    LocationsOriData: [],
    counterpartyList: [],
    physicalSupplierCounterpartyList: [],
    requestList: [],
    counterparties: [],
    additionalCostList: []
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

  @Action(SetAvailableContracts)
  SetAvailableContracts(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetAvailableContracts
  ): any {
    patchState({
      availableContracts: payload
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
  // Requests
  @Action(SetRequests)
  setRequests(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetRequests
  ): void {
    patchState({
      requests: payload
    });
  }
  // Tenant Configuration
  @Action(SetTenantConfigurations)
  setTenantConfigurations(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetTenantConfigurations
  ): void {
    patchState({
      tenantConfigurations: payload
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

  @Action(EditLocations)
  EditLocations(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: EditLocations
  ) {
    patchState({
      locations: getState().locations.map(row => {
        if (row.id === payload.id) {
          return payload;
        }
        return row;
      })
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

  //// action to set full list of look up counterparties from cache
  @Action(SetCounterpartyList)
  SetCounterparties(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetCounterpartyList
  ): void {
    patchState({
      counterpartyList: payload
    });
  }

  @Action(SetCounterparties)
  SetLookupCounterparties(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetCounterparties
  ): void {
    patchState({
      counterparties: payload
    });
  }

  @Action(SetRequestList)
  SetRequestList(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetRequestList
  ): void {
    patchState({
      requestList: payload
    });
  }

  //Append Request List
  @Action(AppendRequestList)
  AppendRequestList(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: AppendRequestList
  ) {
    const state = getState();
    var rqust = [...state.requestList, ...payload];
    patchState({
      requestList: rqust
    });
  }

  @Action(EditCounterpartyList)
  EditCounterpartyList(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: EditCounterpartyList
  ) {
    patchState({
      counterpartyList: getState().counterpartyList.map(row => {
        if (row.id === payload.id) {
          return payload;
        }
        return row;
      })
    });
  }

  //Append CounterParty List
  @Action(AppendCounterpartyList)
  AppendCounterpartyList(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: AppendCounterpartyList
  ) {
    const state = getState();
    var ctpys = [...state.counterpartyList, ...payload];
    patchState({
      counterpartyList: ctpys
    });
  }

  //Add Physical Sypplier Counterparty List
  @Action(SetPhysicalSupplierCounterpartyList)
  SetPhysicalSupplierCounterparties(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetPhysicalSupplierCounterpartyList
  ): void {
    patchState({
      physicalSupplierCounterpartyList: payload
    });
  }

  //Append Physical Sypplier Counterparty List
  @Action(AppendPhysicalSupplierCounterpartyList)
  AppendPhysicalSupplierCounterpartyList(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: AppendPhysicalSupplierCounterpartyList
  ) {
    const state = getState();
    var ctpys = [...state.physicalSupplierCounterpartyList, ...payload];
    patchState({
      physicalSupplierCounterpartyList: ctpys
    });
  }

  @Action(AppendLocationsRowsOriData)
  AppendLocationsRowsOriData (
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: AppendLocationsRowsOriData
  ) {
    const state = getState();
    var ctpys = [...state.LocationsOriData, ...payload];
    patchState({
      LocationsOriData: ctpys
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
  @Action(SetLocationsRowsOriData)
  SetLocationsRowsOriData(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetLocationsRowsOriData
  ): void {
    patchState({
      LocationsOriData: payload
    });
  }

  @Action(RemoveLocationsRowsOriData)
  RemoveLocationsRowsOriData(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: RemoveLocationsRowsOriData
  ) {
    patchState({
      LocationsOriData: getState().LocationsOriData.filter(
        row => row.id !== payload.rowId
      )
    });
  }
  // Rows lists
  @Action(SetLocationsRowsPriceDetails)
  SetLocationsRowsPriceDetails(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetLocationsRowsPriceDetails
  ) {
    patchState({
      locationsRowsPriceDetails: payload
    });
  }

// Rows lists
@Action(EditLocationRow)
EditLocationRow(
  { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
  { payload }: EditLocationRow
) {
  let currentLocRows = payload;
  let locs = getState().locationsRows;
  let upaLocations = locs.map(row => {
    let payRows: any;
    if(currentLocRows instanceof Object && row.id === currentLocRows.id)
      return currentLocRows;
    else if(currentLocRows instanceof Array){
      payRows =  currentLocRows?.find(x => x.id === row.id);
      if (payRows) {
        return payRows;
      }
    }
    return row;
  });

   patchState({
    locationsRows: upaLocations
  });
}


  @Action(SelectSeller)
  addUser(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SelectSeller
  ) {
    const state = getState();
    const selectedSellerList = [...state.selectedSellerList];
    patchState({
      selectedSellerList: [...state.selectedSellerList, payload]
    });
  }

  @Action(DeleteSeller)
  deleteUser(
    { getState, setState }: StateContext<SpotNegotiationStoreModel>,
    { RequestLocationSellerId }: DeleteSeller
  ) {
    const state = getState();
    const filteredArray = state.selectedSellerList.filter(
      item => item.RequestLocationSellerId !== RequestLocationSellerId
    );
    setState({
      ...state,
      selectedSellerList: filteredArray
    });
  }

  @Action(RemoveCounterparty)
  removeCounterparty(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: RemoveCounterparty
  ) {
    patchState({
      locationsRows: getState().locationsRows.filter(
        row => row.id !== payload.rowId
      )
    });
  }

  // Rows lists
  @Action(AddRequest)
  AddRequest(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: AddRequest
  ) {
    const state = getState();
    var ctpys = [...state.requests, ...payload];
    patchState({
      requests: ctpys
    });
  }

  // update requests
  @Action(UpdateRequest)
  UpdateRequest(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: UpdateRequest
  ) {
    const state = getState();
    patchState({
      //currentRequestSmallInfo: payload.filter(e=> e.id === state.currentRequestSmallInfo['id'])[0],
      requests: payload
    });
  }

  // update additional cost list
  @Action(UpdateAdditionalCostList)
  UpdateAdditionalCostList(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: UpdateAdditionalCostList
  ) {
    patchState({
      additionalCostList: payload
    });
  }

  // update specific requests
  @Action(UpdateSpecificRequests)
  UpdateSpecificRequests(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: UpdateSpecificRequests
  ) {
    const state = getState();
    var requestList = [...state.requests];
    for (let i = 0; i < payload.length; i++) {
      let findRequestIndex = _.findIndex(requestList, function(request) {
        return request.id == payload[i].id;
      });
      if (findRequestIndex != -1) {
        requestList[findRequestIndex] = _.cloneDeep(payload[i]);
      }
    }

    patchState({
      requests: requestList
    });
  }

  /* delink Request */
  @Action(DelinkRequest)
  DelinkRequest(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: DelinkRequest
  ) {
    const state = getState();
    patchState({
      requests: state.requests.filter(e => e.id != payload),
      locationsRows: state.locationsRows.filter(e => e.requestId != payload)
    });
  }
  // Rows lists
  @Action(AddCounterpartyToLocations)
  AddCounterpartyToLocations(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: AddCounterpartyToLocations
  ) {
    const state = getState();
    payload.map(c => {
      if (c.requestOffers == undefined) {
        var payloadReq = state.requests.find(x => x.id === c.requestId);
        if (payloadReq && payloadReq.requestLocations) {
          var reqLocation = payloadReq.requestLocations.find(
            y => y.locationId === c.locationId
          );
        }
        if (reqLocation && reqLocation.requestProducts) {
          for (
            let index = 0;
            index < reqLocation.requestProducts.length;
            index++
          ) {
            let indx = index + 1;
            let val = 'checkProd' + indx;
            c[val] = c.isSelected;
          }
        }
      }
    });
    var ctpys = [...state.locationsRows, ...payload];

    patchState({
      locationsRows: ctpys
    });
  }

  @Selector()
  static locationRows(state: SpotNegotiationStoreModel) {
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

  @Selector()
  static selectedSellers(state: SpotNegotiationStoreModel) {
    return state.locationsRows.filter(
      row =>
        row.requestId === state.currentRequestSmallInfo['id'] && row.isSelected
    );
    // return (reqLocationId: number) =>
    //     state.locationsRows.filter(row=> row.requestId === state.currentRequestSmallInfo['id'] &&
    //       row.isSelected && row.requestLocationId === reqLocationId);
  }
}
