export class SetCurrentRequestSmallInfo {
  static readonly type = '[Current Request Small Info] Set';

  constructor(public payload: any) {}
}
export class SetCurrentRequest {
  static readonly type = '[Current Request] Set';

  constructor(public payload: any) {}
}
export class SetLocations {
  static readonly type = '[Locations] Set';

  constructor(public payload: any) {}
}
export class SetGroupOfRequestsId {
  static readonly type = '[SetGroupOfRequestsId] Set';

  constructor(public payload: any) {}
}
export class SetStaticLists {
  static readonly type = '[Static Lists] Set';

  constructor(public payload: any) {}
}

export class SetCounterpartyList {
  static readonly type = '[Counterparty List] Set';

  constructor(public payload: any) {}
}

export class SetLocationsRows{
  static readonly type = '[LocationsRows] Set';

  constructor(public payload: any) {}
}
export class EditLocationRow{
  static readonly type = '[Locations] Edit';

  constructor(public payload: any) {}
}

export class AddCounterpartyToLocations{
  static readonly type = '[Counterparty] Add';

  constructor(public payload: any) {}
}
