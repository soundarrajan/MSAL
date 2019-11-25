export enum QuantityMatchStatusEnum {
  Matched = 'Matched',
  WithinLimit = 'WithinLimit',
  NotMatched = 'Unmatched'
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
