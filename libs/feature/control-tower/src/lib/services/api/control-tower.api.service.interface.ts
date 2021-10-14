import { Observable } from 'rxjs';
import {
  IGetControlTowerQuantityRobDifferenceListRequest,
  IGetControlTowerQuantityRobDifferenceListResponse
} from './dto/control-tower-list-item.dto';

export interface IControlTowerApiService {
  getInvoiceList(
    request: IGetControlTowerQuantityRobDifferenceListRequest
  ): Observable<IGetControlTowerQuantityRobDifferenceListResponse>;

  getInvoiceListExportUrl(): string;
}
