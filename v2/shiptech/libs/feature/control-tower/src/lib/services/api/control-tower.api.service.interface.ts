import { Observable } from 'rxjs';
import {
  IGetControlTowerListRequest,
  IGetControlTowerQualityClaimsListResponse,
  IGetControlTowerQuantityClaimsListResponse,
  IGetControlTowerQuantityRobDifferenceListResponse,
  IGetControlTowerQuantitySupplyDifferenceListResponse,
  IgetControlTowerQualityClaimsListExportUrlResponse,
  IGetControlTowerResidueSludgeDifferenceListResponse,
  IGetControlTowerQualityLabsListResponse,
  IControlTowerSaveNotesItemDto,
  IControlTowerGetMyNotesDto,
  IControlTowerGetFilteredNotesDto,
  IGetControlTowerResidueEGCSDifferenceListResponse
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

  getControlTowerResidueEGCSDifferenceList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerResidueEGCSDifferenceListResponse>;

  getControlTowerResidueEGCSDifferenceListExportUrl(): string;

  getResiduePopUp(request: any);

  saveResiduePopUp(request: any);

  getQualityLabsPopUp(request: any);

  saveQualityLabsPopUp(request: any);

  getControlTowerQuantityClaimsList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQuantityClaimsListResponse>;

  getControlTowerQuantityClaimsListExportUrl(): string;

  getControlTowerQualityClaimsList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQualityClaimsListResponse>;

  getControlTowerQualityClaimsListExportUrl(): string;

  getControlTowerQualityLabsList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQualityLabsListResponse>;

  getControlTowerQualityLabsListExportUrl(): string;

  getNotes(request: IControlTowerGetMyNotesDto, view: any): any;

  getFilteredNotes(request: IControlTowerGetFilteredNotesDto, view: any): any;

  saveControlTowerNote(request: IControlTowerSaveNotesItemDto, view: any): any;

  /* Default Filters counts */
  getQualityClaimCounts(request: any): any;
  getqualityLabCounts(request: any): any;

  getRobDifferenceFiltersCount(request: any): any;
  getSupplyDifferenceFiltersCount(request: any): any;
  getQuantityClaimCounts(request: any): any;

  getSludgeDifferenceFiltersCount(request: any): any;
  getEGCSDifferenceFiltersCount(request: any): any;

  getQualityViewCounts(request: any): any;
  getQuantityViewCounts(request: any): any;
  getResidueViewCounts(request: any): any;
  /* END Default Filters counts */
}
