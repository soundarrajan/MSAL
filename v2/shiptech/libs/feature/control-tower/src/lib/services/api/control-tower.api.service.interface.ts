import { Observable } from 'rxjs';
import {
  IGetControlTowerQuantityRobDifferenceListRequest,
  IGetControlTowerQuantityRobDifferenceListResponse
} from './dto/control-tower-list-item.dto';

export interface IControlTowerApiService {
  getControlTowerQuantityRobDifferenceList(
    request: IGetControlTowerQuantityRobDifferenceListRequest
  ): Observable<IGetControlTowerQuantityRobDifferenceListResponse>;

  getControlTowerQuantityRobDifferenceListExportUrl(): string;
}
