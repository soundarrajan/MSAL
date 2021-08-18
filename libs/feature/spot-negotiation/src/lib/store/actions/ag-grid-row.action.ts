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
