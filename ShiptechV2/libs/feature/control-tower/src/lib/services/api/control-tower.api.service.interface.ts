import { Observable } from 'rxjs';
import {
  IGetControlTowerListRequest,
  IGetControlTowerQualityClaimsListResponse,
  IGetControlTowerQuantityClaimsListResponse,
  IGetControlTowerQuantityRobDifferenceListResponse,
  IGetControlTowerQuantitySupplyDifferenceListResponse,
  IgetControlTowerQualityClaimsListExportUrlResponse,
  IGetControlTowerResidueSludgeDifferenceListResponse,
  IControlTowerSaveNotesItemDto,
  IControlTowerGetMyNotesDto,
  IControlTowerGetFilteredNotesDto
} from './dto/control-tower-list-item.dto';

export interface IControlTowerApiService {
  getControlTowerQuantityRobDifferenceList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQuantityRobDifferenceListResponse>;

  getControlTowerQuantityRobDifferenceListExportUrl(): string;

  getQuantityResiduePopUp(request: any);

  saveQuantityResiduePopUp(request: any);

  getControlTowerQuantitySupplyDifferenceList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQuantitySupplyDifferenceListResponse>;

  getControlTowerQuantitySupplyDifferenceListExportUrl(): string;

  getControlTowerResidueSludgeDifferenceList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerResidueSludgeDifferenceListResponse>;

  getControlTowerResidueSludgeDifferenceListExportUrl(): string;

  getResiduePopUp(request: any);

  saveResiduePopUp(request: any);

  getControlTowerQuantityClaimsList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQuantityClaimsListResponse>;

  getControlTowerQuantityClaimsListExportUrl(): string;

  getControlTowerQualityClaimsList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQualityClaimsListResponse>;

  getControlTowerQualityClaimsListExportUrl(): string;

  getMyNotes(request: IControlTowerGetMyNotesDto): any;

  getFilteredNotes(request: IControlTowerGetFilteredNotesDto): any;

  getNoteById(request: any): any;

  saveControlTowerNote(request: IControlTowerSaveNotesItemDto): any;
}
