export class SetCurrentRequestSmallInfo {
  static readonly type = '[Current Request Small Info] Set';
  constructor(public payload: any) {}
}

export class SetTenantConfigurations {
  static readonly type = '[TenantConfigurations] Set';

  constructor(public payload: any) {}
}