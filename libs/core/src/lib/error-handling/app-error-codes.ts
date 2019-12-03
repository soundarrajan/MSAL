export enum AppErrorCode {
  ServerUnknown = -1,
  Unknown = 0,

  /* General */
  GridPreferenceRestore = 100,
  TenantSettingsFailedToLoad = 101,
  FailedToSaveUserSettings = 102,
  FailedToLoadUserSettings = 103,
  FailedToPurgeUserSettings = 104,
  GeneralTenantSettingsNotLoaded = 105,
  MissingLookupKey = 106,

  LoadUserProfileFailed = 200
}
