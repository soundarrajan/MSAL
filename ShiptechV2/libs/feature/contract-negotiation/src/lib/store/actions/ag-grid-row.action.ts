export class ContractRequest {
  static readonly type = '[ContractRequest] Set';
  constructor(public payload: any) {}
}
export class updateCounterpartyList {
  static readonly type = '[updateCounterpartyList] Update';
  constructor(public payload: any) {}
}
