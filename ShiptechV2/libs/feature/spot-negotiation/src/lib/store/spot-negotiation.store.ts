import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  AddRow,
  RemoveRow,
  AddSelectedRow,
  SetSelectedRow,
  SetStaticLists,
  SetCounterpartyList,
  SetLocations,
  SetGroupOfRequestsId,
  SetRequests,
  SetCurrentRequest,
  SetCurrentRequestSmallInfo,
  AddCounterpartyToLocations
} from './actions/ag-grid-row.action';

// Delete this;
const demoData = [
  {
    name: 'Total Marine Fuel',
    counterpartytype: 'seller',
    operator: '',
    mail: 'mail-active',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '$500.00',
    offPrice1: '100.00',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: '',
    check2: '',
    check3: '',
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'Yes',
    commentIcon: 'Yes'
  },
  {
    name: 'Mitsui & co petroleum',
    counterpartytype: 'broker',
    mail: 'mail-inactive',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '550.00',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: '',
    check2: '',
    check3: '',
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'Yes',
    commentIcon: ''
  },
  {
    name: 'Phillip 66',
    counterpartytype: 'physicalsupplier',
    mail: 'mail-none',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '0',
    offPrice2: '',
    offPrice3: '',
    tPr: '',
    amt: '',
    diff: '',
    check: '',
    check1: '',
    check2: '',
    check3: '',
    mj: '',
    mj1: '',
    tco: '',
    ediff: '',
    tco1: '',
    ediff1: '',
    infoIcon: 'Yes',
    commentIcon: 'No',
    isQuote: 'No quote'
  },
  {
    name: 'Total Marine Fuel',
    counterpartytype: 'seller',
    mail: 'mail-active',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '-',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: '',
    check2: '',
    check3: '',
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'No',
    commentIcon: 'Yes'
  },
  {
    name: 'Total Marine Fuel',
    counterpartytype: 'broker',
    mail: 'mail-inactive',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '-',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: 'preferred',
    check2: '',
    check3: '',
    preferred: true,
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'No',
    commentIcon: 'No'
  },
  {
    name: 'Total Marine Fuel',
    counterpartytype: 'physicalsupplier',
    mail: 'mail-active',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '-',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: '',
    check2: 'preferred',
    check3: '',
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'No',
    commentIcon: 'No'
  },
  {
    name: 'Total Marine Fuel',
    counterpartytype: 'seller',
    mail: 'mail-inactive',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '-',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: '',
    check2: '',
    check3: 'preferred',
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'No',
    commentIcon: 'Yes'
  },
  {
    name: 'Total Marine Fuel',
    counterpartytype: 'physicalsupplier',
    mail: 'mail-active',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '-',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: '',
    check2: '',
    check3: '',
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'No',
    commentIcon: 'None'
  },
  {
    name: 'Total Marine Fuel',
    counterpartytype: 'broker',
    mail: 'mail-inactive',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '-',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: '',
    check2: '',
    check3: '',
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'No',
    commentIcon: 'Yes'
  },
  {
    name: 'Total Marine Fuel',
    counterpartytype: 'seller',
    mail: 'mail-none',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '-',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: '',
    check2: '',
    check3: '',
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'No',
    commentIcon: 'No'
  },
  {
    name: 'Total Marine Fuel',
    counterpartytype: 'physicalsupplier',
    mail: 'mail-active',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '-',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: '',
    check2: '',
    check3: '',
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'No',
    commentIcon: 'Yes'
  },
  {
    name: 'Total Marine Fuel',
    counterpartytype: 'broker',
    mail: 'mail-inactive',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '-',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: '',
    check2: '',
    check3: '',
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'No',
    commentIcon: 'Yes'
  },
  {
    name: 'Total Marine Fuel',
    counterpartytype: 'seller',
    mail: 'mail-none',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '-',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: '',
    check2: '',
    check3: '',
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'No',
    commentIcon: 'No'
  },
  {
    name: 'Total Marine Fuel',
    counterpartytype: 'physicalsupplier',
    mail: 'mail-active',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '-',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: '',
    check2: '',
    check3: '',
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'No',
    commentIcon: ''
  },
  {
    name: 'Total Marine Fuel',
    counterpartytype: 'broker',
    mail: 'mail-none',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '-',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: '',
    check2: '',
    check3: '',
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'No',
    commentIcon: 'No'
  },
  {
    name: 'Total Marine Fuel',
    counterpartytype: 'physicalsupplier',
    mail: 'mail-inactive',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '-',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: '',
    check2: '',
    check3: '',
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'No',
    commentIcon: 'Yes'
  },
  {
    name: 'Total Marine Fuel',
    counterpartytype: 'seller',
    mail: 'mail-active',
    genRating: '4.2',
    genPrice: '$9.4',
    portRating: '4.2',
    portPrice: '$9.8',
    phySupplier: 'Add P. supplier',
    totalOffer: '-',
    offPrice1: '-',
    offPrice2: '-',
    offPrice3: '-',
    tPr: '-',
    amt: '-',
    diff: '-',
    check: '',
    check1: '',
    check2: '',
    check3: '',
    mj: '41',
    mj1: '41',
    tco: '4,48,152.00',
    ediff: '1.19',
    tco1: '4,48,152.00',
    ediff1: '1.19',
    infoIcon: 'No',
    commentIcon: 'Yes'
  }
];
export class SpotNegotiationStoreModel {
  staticLists: any;
  counterpartyList:any;
  // Delete this
  rows: any;
  selectedRows: any;
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
    // Clean after we get full request info on locations.
    this.rows = [];
    this.selectedRows = [];
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
    rows: demoData,
    selectedRows: [],
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

  // AG GRID ROWS
  @Selector()
  static getRows(state: SpotNegotiationStoreModel) {
    return state.rows;
  }

  @Selector()
  static getSelectedRows(state: SpotNegotiationStoreModel) {
    return state.selectedRows;
  }

  // Add a new row
  @Action(AddRow)
  add(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: AddRow
  ) {
    const state = getState();

    const futureRows = [...state.rows, payload];

    patchState({
      rows: futureRows
    });
  }

  // Add a new row
  @Action(AddSelectedRow)
  addSelectedRow(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: AddSelectedRow
  ): any {
    const state = getState();
    const futureRows = [...state.selectedRows, payload];

    patchState({
      selectedRows: futureRows
    });
  }
  // Set  selected rows
  @Action(SetSelectedRow)
  setSelectedRow(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: SetSelectedRow
  ): any {
    const state = getState();

    const futureRows = payload;

    patchState({
      selectedRows: futureRows
    });
  }

  // Remove a row
  @Action(RemoveRow)
  remove(
    { getState, patchState }: StateContext<SpotNegotiationStoreModel>,
    { payload }: RemoveRow
  ): any {
    const state = getState();
    const futureRows = state.rows.filter((e: any) => e.id != payload);

    patchState({
      rows: futureRows
    });
  }
}
