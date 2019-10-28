import { Observable } from 'rxjs';

export interface UserProfileDto {
  displayName: string;
  id: number;
  username: string;
}

export interface IUserProfileApiResponse {
  payload: UserProfileDto;
}

export interface IUserProfileApi {
  get(): Observable<IUserProfileApiResponse>;
}
