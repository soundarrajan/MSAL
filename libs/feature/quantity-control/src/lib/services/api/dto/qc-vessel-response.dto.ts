import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';

export interface IQcVesselResponsesDto {
  sludge: IQcVesselSludgeResponseDto[];
  bunker: IQcVesselResponseDto[];
}

export interface IQcVesselResponseDto {
  category: ILookupDto;
  description: string;
}

export interface IQcVesselSludgeResponseDto extends IQcVesselResponseDto {
  sludge?: number;
  sludgeVerified?: boolean;
}
