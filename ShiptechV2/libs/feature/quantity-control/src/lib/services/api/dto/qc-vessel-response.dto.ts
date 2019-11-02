export interface IQcVesselResponsesDto {
  sludge: IQcVesselSludgeResponseDto;
  bunker: IQcVesselResponseDto;
}

export interface IQcVesselResponseDto {
  categoryId: number;
  categoryName: string;
  description: string;
}

export interface IQcVesselSludgeResponseDto extends IQcVesselResponseDto {
  sludge?: number;
  sludgeVerified?: boolean;
}
