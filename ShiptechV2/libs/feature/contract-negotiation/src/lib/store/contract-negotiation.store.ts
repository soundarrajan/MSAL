import { map } from 'rxjs/operators';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  SetStaticLists,
  SetCounterpartyList,
  SetLocationsRows,
  SetNetEnergySpecific,
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
  UpdateAdditionalCostList,
  SetOfferPriceFormulaId,
  setFormulaList,
  EvaluatePrice
} from './actions/ag-grid-row.action';

import {
  SetRequestGroupId,
  SetQuoteDateAndTimeZoneId,
  SetCurrentRequest,
  SetCurrentRequestSmallInfo,
  SetAvailableContracts,
  SetRequests,
  SetTenantConfigurations,
  SetCounterparties
} from './actions/request-group-actions';
import _ from 'lodash';

export class ContractNegotiationStoreModel {
  staticLists: any;
  counterpartyList: any;
  physicalSupplierCounterpartyList: any;
  requestList: any;
  counterparties: any;
  // Until here
  groupOfRequestsId: number | null;
  quoteDateByGroup: Date | null;
  quoteTimeZoneIdByGroup: number | null;
  locations: Array<any>;
  locationsRows: Array<any>;
  netEnergySpecific: Array<any>;
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
  formulaList : any;
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
    this.netEnergySpecific=[];
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
    this.formulaList = {};
    this.quoteTimeZoneIdByGroup=null;
    this.quoteDateByGroup=null;
  }
}

@State<ContractNegotiationStoreModel>({
  name: 'contractNegotiation',
  defaults: {
    groupOfRequestsId: null,
    quoteTimeZoneIdByGroup:null,
    quoteDateByGroup:null,
    currentRequestSmallInfo: null,
    availableContracts: null,
    locations: [],
    requests: [],
    commentsForCurrentRequest: [],
    selectedSellerList: [],
    currentRequest: null,
    locationsRows: [],
    netEnergySpecific:[],
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
    additionalCostList: [],
    formulaList:{}
  }
})
export class SpotNegotiationStore {
  // Requests
  @Action(SetCurrentRequestSmallInfo)
  setCurrentRequestSmallInfo(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetCurrentRequestSmallInfo
  ): any {
    patchState({
      currentRequestSmallInfo: payload
    });
  }

  @Action(SetAvailableContracts)
  SetAvailableContracts(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetAvailableContracts
  ): any {
    patchState({
      availableContracts: payload
    });
  }

  // Requests
  @Action(SetCurrentRequest)
  setCurrentRequest(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetCurrentRequest
  ): void {
    patchState({
      currentRequest: payload
    });
  }
  // Requests
  @Action(SetRequests)
  setRequests(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetRequests
  ): void {
    patchState({   
      requests: payload
    });
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

  @Action(SetLocations)
  setLocations(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetLocations
  ): void {
    patchState({
      locations: payload
    });
  }

  @Action(EditLocations)
  EditLocations(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
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
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetRequestGroupId
  ): void {
    patchState({
      groupOfRequestsId: payload
    });
  }
  // Group Of QuoteByDate and timeZoneId
  @Action(SetQuoteDateAndTimeZoneId)
  SetQuoteDateAndTimeZoneId(
    { patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetQuoteDateAndTimeZoneId
  ): void {
    patchState({
      quoteDateByGroup:payload?.quoteByDate,
      quoteTimeZoneIdByGroup:payload?.quoteByTimeZoneId
    });
  }
  // Static lists
  @Action(SetStaticLists)
  setStaticLists(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetStaticLists
  ): void {
    patchState({
      staticLists: payload
    });
  }

  //// action to set full list of look up counterparties from cache
  @Action(SetCounterpartyList)
  SetCounterparties(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetCounterpartyList
  ): void {
    patchState({
      counterpartyList: payload
    });
  }

  @Action(SetCounterparties)
  SetLookupCounterparties(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetCounterparties
  ): void {
    patchState({
      counterparties: payload
    });
  }

  @Action(SetRequestList)
  SetRequestList(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetRequestList
  ): void {
    patchState({
      requestList: payload
    });
  }

  //Append Request List
  @Action(AppendRequestList)
  AppendRequestList(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
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
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
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
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
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
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetPhysicalSupplierCounterpartyList
  ): void {
    patchState({
      physicalSupplierCounterpartyList: payload
    });
  }

  //Append Physical Sypplier Counterparty List
  @Action(AppendPhysicalSupplierCounterpartyList)
  AppendPhysicalSupplierCounterpartyList(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
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
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
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
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetLocationsRows
  ) {
    patchState({
      locationsRows: payload
    });
  }
  @Action(SetLocationsRowsOriData)
  SetLocationsRowsOriData(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetLocationsRowsOriData
  ): void {
    patchState({
      LocationsOriData: payload
    });
  }

  @Action(RemoveLocationsRowsOriData)
  RemoveLocationsRowsOriData(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
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
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetLocationsRowsPriceDetails
  ) {
    patchState({
      locationsRowsPriceDetails: payload
    });
  }

  @Action(setFormulaList)
  setFormulaList(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: setFormulaList
  ) {
    patchState({
      formulaList: payload
    });
  }

// Rows lists
@Action(EditLocationRow)
EditLocationRow(
  { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
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
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
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
    { getState, setState }: StateContext<ContractNegotiationStoreModel>,
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
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
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
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
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
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
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
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: UpdateAdditionalCostList
  ) {
    patchState({
      additionalCostList: payload
    });
  }

  // update specific requests
  @Action(UpdateSpecificRequests)
  UpdateSpecificRequests(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
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
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
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
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
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
    let sort_ctpys = ctpys.sort((a, b) => {
      let nameA = a.sellerCounterpartyName;
      let nameB = b.sellerCounterpartyName;
      return nameA.localeCompare(nameB);
  });
    patchState({
      locationsRows: sort_ctpys
    });
  }

  @Action(SetOfferPriceFormulaId)
  SetOfferPriceFormulaId(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetOfferPriceFormulaId
  ) {
    let locRows = getState().locationsRows;
    const locationRows = _.cloneDeep(locRows);
    locationRows.forEach(locs =>{
       if(locs.requestOffers){
        locs.requestOffers.forEach(req =>{
          if(req.id === payload.RequestOfferId){
            req.isFormulaPricing = true;
            req.offerPriceFormulaId = payload.priceConfigurationId
          }
        })
       }
    });
    patchState({
      locationsRows: locationRows
    });
  }

  @Action(EvaluatePrice)
  EvaluateOfferPrice(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetOfferPriceFormulaId
  ) {
    let locRows = getState().locationsRows;
    const locationRows = _.cloneDeep(locRows);
    locationRows.forEach(locs =>{
       if(locs.requestOffers){
        locs.requestOffers.forEach(req=>{
          payload.forEach(x=>{
            if(req.id === x.requestOfferId){
              req.price = x.price;
            }
          })
        });
       }
    });
    patchState({
      locationsRows: locationRows
    });
  }
  @Action(SetNetEnergySpecific)
  SetNetEnergySpecific(
    { getState, patchState }: StateContext<ContractNegotiationStoreModel>,
    { payload }: SetNetEnergySpecific
  ) {
    patchState({
      netEnergySpecific: payload
    });
  }

  @Selector()
  static locationRows(state: ContractNegotiationStoreModel) {
    return state.locationsRows;
  }

  @Selector()
  static getStaticList(state: ContractNegotiationStoreModel) {
    return state.staticLists;
  }

  @Selector()
  static getCounterpartyList(state: ContractNegotiationStoreModel) {
    return state.counterpartyList;
  }

  @Selector()
  static selectedSellers(state: ContractNegotiationStoreModel) {
    return state.locationsRows.filter(
      row =>
        row.requestId === state.currentRequestSmallInfo['id'] && row.isSelected
    );
    // return (reqLocationId: number) =>
    //     state.locationsRows.filter(row=> row.requestId === state.currentRequestSmallInfo['id'] &&
    //       row.isSelected && row.requestLocationId === reqLocationId);
  }
}
