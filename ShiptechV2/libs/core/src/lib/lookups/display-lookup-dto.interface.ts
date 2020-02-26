import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';

export interface IDisplayLookupDto<TId = number, TName = string>
  extends ILookupDto<TId, TName> {
  id: TId;
  name: TName;
  displayName: string;
}

export interface IVesselToWatchLookupDto extends IDisplayLookupDto {
  vesselToWatchFlag: boolean;
}
