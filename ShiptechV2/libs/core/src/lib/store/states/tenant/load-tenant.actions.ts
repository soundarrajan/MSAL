import { ITenantSettings } from './tenant.settings.interface';

export class LoadTenantSettingsAction {
  static readonly type = '[Settings] Load Tenant Settings';

  constructor(public moduleName: string) {
  }
}

export class LoadTenantSettingsSuccessfulAction {
  static readonly type = '[Settings] Load Tenant Successful';

  constructor(public moduleName: string, public tenantSettings: ITenantSettings) {
  }
}

export class LoadTenantSettingsFailedAction {
  static readonly type = '[Settings] Load Tenant Failed';

  constructor(public moduleName: string) {
  }
}
