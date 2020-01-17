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
  ModuleTenantSettingsNotLoaded = 106,
  MissingLookupKey = 107,
  FailedToLoadMastersData = 108,

  LoadUserProfileFailed = 200,

  LoadEmailLogsFailed = 300,
  LoadAuditLogFailed = 400,
  LoadDocumentsFailed = 500,
  DeleteDocumentFailed = 501,
  UpdateIsVerifiedDocumentFailed = 502,
  UpdateNotesDocumentFailed = 503,
  UploadDocumentFailed = 504,
  DocumentTypeNotSelected = 505
}
