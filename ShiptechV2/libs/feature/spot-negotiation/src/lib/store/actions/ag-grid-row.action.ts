export class SetStaticLists {
  static readonly type = '[Static Lists] Set';

  constructor(public payload: any) {}
}

export class SetCounterpartyList {
  static readonly type = '[Counterparty List] Set';

  constructor(public payload: any) {}
}

export class SetLocations {
  static readonly type = '[Locations] Set';

  constructor(public payload: any) {}
}
export class SetLocationsRows{
  static readonly type = '[LocationsRows] Set';

  constructor(public payload: any) {}
}
export class SetLocationsRowsPriceDetails{
  static readonly type = '[LocationsRowsPriceDetails] Set';

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
export class SelectSeller {  
  static readonly type = '[SelectedSellerList] Add';  

  constructor(public payload: any ) {  
  }  
}  
export class DeleteSeller {  
  static readonly type = '[SelectedSellerList] Delete';  

  constructor(public RequestLocationSellerId: number) {  
  }  
}   
