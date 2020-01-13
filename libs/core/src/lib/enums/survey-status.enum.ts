export enum SurveyStatusLabelEnum {
  Verified = 'Verified',
  Pending = 'Pending',
  New = 'New'
}

export enum SurveyStatusEnum {
  Verified = 'Verified',
  Pending = 'Pending', // Not the real value
  New = 'New' // Not the real value
}

export const SurveyStatusEnumMap: Record<SurveyStatusEnum, SurveyStatusLabelEnum> = {
  [SurveyStatusEnum.Verified]: SurveyStatusLabelEnum.Verified,
  [SurveyStatusEnum.Pending]: SurveyStatusLabelEnum.Pending,
  [SurveyStatusEnum.New]: SurveyStatusLabelEnum.New
};
