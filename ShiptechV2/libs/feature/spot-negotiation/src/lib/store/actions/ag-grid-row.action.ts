export class AddRow {
  static readonly type = '[Row] Add';

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
