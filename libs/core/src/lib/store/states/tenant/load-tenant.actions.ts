import { IModuleTenantSettings, TenantSettingsModuleName } from './tenant.settings.interface';

export class LoadTenantSettingsAction {
  static readonly type = '[Settings] Load Tenant Settings';

  constructor(public moduleName: TenantSettingsModuleName) {
  }

  public log(): any {
    return {
      moduleName: this.moduleName
    };
  }
}

export class LoadTenantSettingsSuccessfulAction {
  static readonly type = '[Settings] Load Tenant Settings Successful';

  constructor(public moduleName: TenantSettingsModuleName, public settings: IModuleTenantSettings) {
  }

  public log(): any {
    return {
      moduleName: this.moduleName
    };
  }
}

export class LoadTenantSettingsFailedAction {
  static readonly type = '[Settings] Load Tenant Failed';

  constructor(public moduleName: TenantSettingsModuleName) {
  }

  public log(): any {
    return {
      moduleName: this.moduleName
    };
  }
}
