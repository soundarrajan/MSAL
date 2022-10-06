import { Observable } from 'rxjs';
import {
  INavBarRequest,
  INavBarResponse
} from './navbar-response';

export interface INavBarApiService {
  getNavBarIdsList(request: INavBarRequest): Observable<INavBarResponse>;

}
