import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export interface IQcVesselResponsesDto {
  categories: IDisplayLookupDto[];
  sludge?: IQcVesselSludgeResponseDto;
  bunker?: IQcVesselBunkerResponseDto;
}

export interface IQcVesselBunkerResponseDto {
  activeCategory: IDisplayLookupDto;
  description: string;
}

export interface IQcVesselSludgeResponseDto {
  activeCategory: IDisplayLookupDto;
  description: string;
  sludge?: number;
  sludgeVerified?: boolean;
}
