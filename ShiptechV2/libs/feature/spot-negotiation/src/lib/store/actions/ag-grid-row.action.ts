export class SetStaticLists {
  static readonly type = '[Static Lists] Set';

  constructor(public payload: any) {}
}

export class SetCounterpartyList {
  static readonly type = '[CounterpartyList] Set';

  constructor(public payload: any) {}
}
export class AddRequest {
  static readonly type = '[AddRequest] Add';

  constructor(public payload: any) {}
}
export class UpdateRequest {
  static readonly type = '[UpdateRequest] Edit';

  constructor(public payload: any) {}
}

export class UpdateAdditionalCostList {
  static readonly type = '[UpdateAdditionalCostList] Edit';

  constructor(public payload: any) {}
}

export class UpdateSpecificRequests {
  static readonly type = '[UpdateSpecificRequests] Edit';

  constructor(public payload: any) {}
}
export class DelinkRequest {
  static readonly type = '[DelinkRequest] Set';

  constructor(public payload: any) {}
}
export class SetRequestList {
  static readonly type = '[Request List] Set';

  constructor(public payload: any) {}
}
export class EditCounterpartyList {
  static readonly type = '[CounterpartyList] Edit';

  constructor(public payload: any) {}
}

export class AppendCounterpartyList {
  static readonly type = '[CounterpartyList] Append';

  constructor(public payload: any) {}
}

export class AppendRequestList {
  static readonly type = '[RequestList] Append';

  constructor(public payload: any) {}
}

export class SetPhysicalSupplierCounterpartyList {
  static readonly type = '[PhysicalSupplierCounterpartyList] Set';

  constructor(public payload: any) {}
}

export class AppendPhysicalSupplierCounterpartyList {
  static readonly type = '[PhysicalSupplierCounterpartyList] Append';

  constructor(public payload: any) {}
}

export class SetLocations {
  static readonly type = '[Locations] Set';

  constructor(public payload: any) {}
}
export class EditLocations {
  static readonly type = '[Locations] Edit';

  constructor(public payload: any) {}
}
export class SetLocationsRows {
  static readonly type = '[LocationsRows] Set';

  constructor(public payload: any) {}
}

export class SetNetEnergySpecific {
  static readonly type = '[NetEnergySpecific] Set';

  constructor(public payload: any) {}
}

export class SetOfferPriceFormulaId {
  static readonly type = '[SetOfferPriceFormulaId] Set';

  constructor(public payload: any) {}
}

export class SetLocationsRowsOriData {
  static readonly type = '[LocationsRowsOriData] Set';

  constructor(public payload: any) {}
}
export class AppendLocationsRowsOriData {
  static readonly type = '[LocationsRowsOriData] Append';

  constructor(public payload: any) {}
}
export class RemoveLocationsRowsOriData {
  static readonly type = '[LocationsRowsOriData] Remove';

  constructor(public payload: any) {}
}
export class SetLocationsRowsPriceDetails {
  static readonly type = '[LocationsRowsPriceDetails] Set';

  constructor(public payload: any) {}
}
export class EditLocationRow {
  static readonly type = '[Locations] Edit';

  constructor(public payload: any) {}
}

export class AddCounterpartyToLocations {
  static readonly type = '[Counterparty] Add';

  constructor(public payload: any) {}
}

export class gridColumnState {
  static readonly type = '[gridColumnState] Add';
  constructor(public payload: any) {}
}

export class RemoveCounterparty {
  static readonly type = '[Counterparty] Remove';

  constructor(public payload: any) {}
}
export class SelectSeller {
  static readonly type = '[SelectedSellerList] Add';

  constructor(public payload: any) {}
}
export class DeleteSeller {
  static readonly type = '[SelectedSellerList] Delete';

  constructor(public RequestLocationSellerId: number) {}
}

export class setFormulaList {
  static readonly type = '[SetFormulaList] Add';

  constructor(public payload: any) {}
}

export class EvaluatePrice {
  static readonly type = '[EvaluatePrice] Set';

  constructor(public payload: any) {}
}