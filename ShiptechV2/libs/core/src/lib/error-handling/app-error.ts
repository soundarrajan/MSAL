import { AppErrorHandlingStrategy } from './app-error-handling-strategy';
import { AppErrorCode } from './app-error-codes';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';

export interface IAppError<T = any> {
  readonly message?: string;
  readonly handleStrategy?: AppErrorHandlingStrategy;
  readonly treatAsWarning: boolean;
  readonly code: number;
  readonly data?: T;
}

export class AppError<T = any> implements IAppError {
  static readonly Unknown: AppError = new AppError();
  static readonly UnknownServerError: AppError = new AppError({ code: AppErrorCode.ServerUnknown });
  static readonly Unauthorized: AppError = new AppError({ message: 'You do not have sufficient privileges to perform the requested action.' });
  static readonly FailedToSaveUserSettings = new AppError({
    code: AppErrorCode.FailedToSaveUserSettings,
    message: 'Could not save User Settings.'
  });
  static readonly FailedToLoadUserSettings = new AppError({
    code: AppErrorCode.FailedToLoadUserSettings,
    message: 'Could not load User Settings.'
  });
  static readonly FailedToPurgeUserSettings = new AppError({
    code: AppErrorCode.FailedToPurgeUserSettings,
    message: 'Could not purge User Settings.'
  });

  static readonly LoadUserProfileFailed = new AppError({
    code: AppErrorCode.LoadUserProfileFailed,
    message: 'Could not load user profile.'
  });

  static readonly GeneralTenantSettingsNotLoaded = new AppError({
    code: AppErrorCode.GeneralTenantSettingsNotLoaded,
    message: 'Could not load user profile.'
  });

  readonly code: number;
  readonly data?: T;
  readonly handleStrategy: AppErrorHandlingStrategy;
  readonly message: string;
  readonly treatAsWarning: boolean;

  constructor({ code, data, handleStrategy, treatAsWarning, message }: Partial<IAppError> = {}) {
    this.code = code || AppErrorCode.Unknown;
    this.data = data;
    this.handleStrategy = handleStrategy || AppErrorHandlingStrategy.Toastr;
    this.treatAsWarning = treatAsWarning || false;
    this.message = message || `An unknown error has occurred. Please refresh the page and try again.`;
  }

  static GridPreferenceRestore(gridName: string): AppError {
    return new AppError({
      code: AppErrorCode.GridPreferenceRestore,
      treatAsWarning: true,
      message: `Preference for grid '${gridName}' could not be restored.`
    });
  }

  static UnknownWithData<T = any>(data: T): AppError<T> {
    return new AppError<T>({ data });
  }

  static UnknownServerErrorWithData<T = any>(data: T): AppError<T> {
    return new AppError<T>({ code: AppErrorCode.ServerUnknown, data });
  }


  static LoadTenantSettingsFailed<T = any>(moduleName: TenantSettingsModuleName): AppError<T> {
    return new AppError({
      code: AppErrorCode.TenantSettingsFailedToLoad,
      message: `Tenant settings failed to load for ${moduleName} module.`
    });
  };

  static MissingLookupKey<T = any>(lookupType: string, key: string): AppError<T> {
    return new AppError({
      code: AppErrorCode.MissingLookupKey,
      message: `Lookup '${lookupType}' is missing key '${key}'.`
    });
  }

  static ModuleTenantSettingsNotLoaded<T = any>(moduleName: TenantSettingsModuleName): AppError<T> {
    return new AppError({
      code: AppErrorCode.ModuleTenantSettingsNotLoaded,
      message: `Tenant settings failed to load for ${moduleName} module.`
    });
  };

  static FailedToLoadMastersData<T = any>(masterName: string): AppError<T> {
    return new AppError({
      code: AppErrorCode.FailedToLoadMastersData,
      message: `Could not load ${masterName} master data. Please retry.`
    });
  };
}
