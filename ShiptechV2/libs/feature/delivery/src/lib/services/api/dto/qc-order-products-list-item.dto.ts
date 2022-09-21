import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export interface IQcOrderProductsListItemDto {
  id: number;
  order: IDisplayLookupDto;
  counterparty: IDisplayLookupDto;
  product: IDisplayLookupDto;
  uom: IDisplayLookupDto;
  confirmedQty: number;
}
