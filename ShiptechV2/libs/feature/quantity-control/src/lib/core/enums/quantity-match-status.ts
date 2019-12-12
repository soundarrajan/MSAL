import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export enum QuantityMatchStatusEnum {
  Matched = 'Matched',
  WithinLimit = 'WithinLimit',
  NotMatched = 'NotMatched'
}

export enum QuantityMatchStatusLabelEnum {
  Matched = 'Matched',
  WithinLimit = 'Within Limit',
  NotMatched = 'Not Matched'
}

export const QuantityMatchStatusEnumMap: Record<QuantityMatchStatusEnum, QuantityMatchStatusLabelEnum> = {
  [QuantityMatchStatusEnum.Matched]: QuantityMatchStatusLabelEnum.Matched,
  [QuantityMatchStatusEnum.WithinLimit]: QuantityMatchStatusLabelEnum.WithinLimit,
  [QuantityMatchStatusEnum.NotMatched]: QuantityMatchStatusLabelEnum.NotMatched
};

export const MatchedQuantityStatus: IDisplayLookupDto = {
  id: 0,
  name: QuantityMatchStatusEnum.Matched,
  displayName: QuantityMatchStatusEnumMap[QuantityMatchStatusEnum.Matched]
};


export const WithinLimitQuantityStatus: IDisplayLookupDto = {
  id: 1,
  name: QuantityMatchStatusEnum.WithinLimit,
  displayName: QuantityMatchStatusEnumMap[QuantityMatchStatusEnum.WithinLimit]
};

export const NotMatchedQuantityStatus: IDisplayLookupDto = {
  id: 2,
  name: QuantityMatchStatusEnum.NotMatched,
  displayName: QuantityMatchStatusEnumMap[QuantityMatchStatusEnum.NotMatched]
};


