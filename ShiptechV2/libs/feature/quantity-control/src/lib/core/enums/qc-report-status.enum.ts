export enum QcReportStatusEnum {
  New = 'New',
  Pending = 'Pending',
  Verify = 'Verify'
}

export enum QcReportStatusLabelEnum {
  New = 'New',
  Pending = 'Pending',
  Verify = 'Verify'
}

export const QuantityMatchStatusEnumMap: Record<QcReportStatusEnum, QcReportStatusLabelEnum> = {
  [QcReportStatusEnum.New]: QcReportStatusLabelEnum.New,
  [QcReportStatusEnum.Pending]: QcReportStatusLabelEnum.Pending,
  [QcReportStatusEnum.Verify]: QcReportStatusLabelEnum.Verify
};
