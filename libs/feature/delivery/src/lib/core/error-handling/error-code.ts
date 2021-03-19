export enum ErrorCode {
  Unknown = 0,

  LoadReportListFailed = 100,

  LoadPortCallDetailsFailed = 1000,
  InvalidPortCallId = 1001,
  PortCallNotFound = 1002,
  SaveReportDetailsFailed = 1003,
  VerifyReportFailed = 1004,
  RevertVerifyReportFailed = 1005,
  LoadPortCallBtnFailed = 1006,

  LoadPortCallListFailed = 3000,
  LoadEventsLogFailed = 3100,
  LoadReportSurveyHistoryFailed = 3200,

  PortCallIsRequired = 3201,
  VesselIsRequired = 3202,
  UpdateVesselToWatch = 3203,
  EventNotesAreRequired = 3204
}
