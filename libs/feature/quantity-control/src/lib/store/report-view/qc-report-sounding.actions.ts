import { TODO } from '@shiptech/core/utils/type-definitions';

export class LoadSoundingReportListAction {
  static readonly type = '[QC.Report.Sounding] Load Sounding Report List';

  constructor(public reportId: number) {
  }

  public log(): any {
    return {
      reportId: this.reportId
    };
  }
}

export class LoadSoundingReportListSuccessfulAction {
  static readonly type = '[QC.Report.Sounding] Load Sounding Report List Successful';

  constructor(public dto: TODO) {
  }
}

export class LoadSoundingReportListFailedAction {
  static readonly type = '[QC.Report.Sounding] Load Sounding Report Failed';

  constructor(public reportId: number) {
  }

  public log(): any {
    return {
      reportId: this.reportId
    };
  }
}
