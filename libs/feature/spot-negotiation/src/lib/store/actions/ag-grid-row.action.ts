export class SetStaticLists {
  static readonly type = '[Static Lists] Set';

  constructor(public payload: any) {}
}

export class SetCounterpartyList {
  static readonly type = '[Counterparty List] Set';

  constructor(public payload: any) {}
}

export class SetLocationsRows{
  static readonly type = '[Locations] Set';

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
