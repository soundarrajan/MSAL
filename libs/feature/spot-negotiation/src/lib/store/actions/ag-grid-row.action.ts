export class SetCurrentRequestSmallInfo {
  static readonly type = '[Current Request Small Info] Set';

  constructor(public payload: any) {}
}
export class SetCurrentRequest {
  static readonly type = '[Current Request] Set';

  constructor(public payload: any) {}
}
export class SetRequests {
  static readonly type = '[Requests] Set';

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
export class SetRowsList {
  static readonly type = '[Rows Lists] Set';

  constructor(public payload: any) {}
}
export class AddRow {
  static readonly type = '[Row] Add';

  constructor(public payload: any) {}
}
export class AddSelectedRow {
  static readonly type = '[Selected Rows] Add';
  constructor(public payload: any) {}
}
export class SetSelectedRow {
  static readonly type = '[Selected Rows] Set';
  constructor(public payload: any) {}
}

export class RemoveSelectedRow {
  static readonly type = '[Selected Row] Remove';
  constructor(public payload: any) {}
}

export class RemoveRow {
  static readonly type = '[Row] Remove';

  constructor(public payload: any) {}
}
export class ResetRow {
  static readonly type = '[Row] Remove';

  constructor(public payload: any) {}
}
