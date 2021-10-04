export class SetCurrentRequestSmallInfo {
  static readonly type = '[Current Request Small Info] Set';

  constructor(public payload: any) {}
}
export class SetCurrentRequest {
  static readonly type = '[Current Request] Set';

  constructor(public payload: any) {}
}
export class SetRequestGroupId {
  static readonly type = '[SetRequestGroupId] Set';

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
export class AddCounterpartyToLocations{
  static readonly type = '[Add Counterparty] Add';

  constructor(public payload: any) {}
}
