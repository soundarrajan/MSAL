export interface IUserSettingsRequest {
  keys: string[];
}

export interface IUserSettingByKeyRequest {
  key: string;
}

export interface IUserSettingResponse {
  value: any;
}

export interface IUpsertUserSettingRequest {
  key: string;
  value: string;
}

export interface IUpsertUserSettingResponse {}

export interface IDeleteUserSettingRequest {
  key: string;
}

export interface IDeleteUserSettingResponse {}

export interface IPurgeUserSettingsRequest {}

export interface IPurgeUserSettingsResponse {}
