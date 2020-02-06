import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';

export interface ICompleteListItemDto {
  id: number;
  nbOfMatched: number;
  nbOfMatchedWithinLimit: number;
  nbOfNotMatched: number;
  portCallId: string;
  portName: string;


  order: ILookupDto;
  orderProductId: number;
}

export interface IGetInvoiceCompletesListRequest extends IServerGridInfo {
}

export interface IGetInvoiceCompletesListResponse {
  items: ICompleteListItemDto[];
  totalCount: number;
  nbOfMatched: number;
  nbOfMatchedWithinLimit: number;
  nbOfNotMatched: number;
}
