import { Observable } from 'rxjs';
import {
  IGetControlTowerListRequest,
  IGetControlTowerQualityClaimsListResponse,
  IGetControlTowerQuantityClaimsListResponse,
  IGetControlTowerQuantityRobDifferenceListResponse,
  IGetControlTowerQuantitySupplyDifferenceListResponse,
  IgetControlTowerQualityClaimsListExportUrlResponse,
} from './dto/control-tower-list-item.dto';

export interface IControlTowerApiService {
  getControlTowerQuantityRobDifferenceList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQuantityRobDifferenceListResponse>;
    
  getControlTowerQuantityRobDifferenceListExportUrl(): string;
  
  getQuantityResiduePopUp(
    request: any
  );
  
  saveQuantityResiduePopUp(
    request: any
  );
    
  getControlTowerQuantitySupplyDifferenceList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQuantitySupplyDifferenceListResponse>;
      
  getControlTowerQuantitySupplyDifferenceListExportUrl(): string;
  getControlTowerQuantityClaimsList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQuantityClaimsListResponse>;
        
  getControlTowerQuantityClaimsListExportUrl(): string;
        
  getControlTowerQualityClaimsList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQualityClaimsListResponse>;
  
  getControlTowerQualityClaimsListExportUrl(): string;
}
