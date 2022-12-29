import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { TitleModule } from '../services/title/title.module';

export interface IDisplayLookupDto<TId = number, TName = string>
  extends ILookupDto<TId, TName> {
  id: TId;
  name: TName;
  displayName: string;
}

export interface IDisplayLookupCurrencyDto<TId = number, TName = string>
  extends ILookupDto<TId, TName> {
  id: TId;
  name: TName;
  displayName: string;
  code: string;
}

export interface IVesselToWatchLookupDto extends IDisplayLookupDto {
  vesselToWatchFlag: boolean;
}

export interface IOrderLookupDto extends IDisplayLookupDto {
  order: {
    id: number;
    name: string;
  };
}

export interface IProductLookupDto extends IDisplayLookupDto {
  productTypeId: number;
  defaultSpecGroupId: number
}

export interface IProductTypeLookupDto extends IDisplayLookupDto {
  productTypeGroupId: number;
}

export interface IProductTypeGroupLookupDto extends IDisplayLookupDto {
  defaultUomId: number;
}

export interface ISpecGroupLookupDto extends IDisplayLookupDto {
  productId: number;
}
