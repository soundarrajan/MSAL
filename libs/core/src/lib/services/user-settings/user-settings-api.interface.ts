import { Observable } from 'rxjs';
import {
  IDeleteUserSettingRequest,
  IDeleteUserSettingResponse,
  IPurgeUserSettingsRequest,
  IPurgeUserSettingsResponse,
  IUpsertUserSettingRequest,
  IUpsertUserSettingResponse,
  IUserSettingByKeyRequest,
  IUserSettingResponse
} from './request-response';

export interface IUserSettingsApiService {
  getByKey(request: IUserSettingByKeyRequest): Observable<IUserSettingResponse>;

  save(request: IUpsertUserSettingRequest): Observable<IUpsertUserSettingResponse>;

  delete(request: IDeleteUserSettingRequest): Observable<IDeleteUserSettingResponse>;

  purge(request: IPurgeUserSettingsRequest): Observable<IPurgeUserSettingsResponse>;
}
