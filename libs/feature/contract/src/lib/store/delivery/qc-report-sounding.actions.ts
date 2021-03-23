import { TODO } from '@shiptech/core/utils/type-definitions';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { nullable } from '@shiptech/core/utils/nullable';

export class LoadSoundingReportListAction {
  static readonly type = '[QC.Report.Sounding] Load Sounding Report List';

  constructor(public reportId: number, public gridInfo: IServerGridInfo) {}

  public log(): any {
    return {
      reportId: this.reportId,
      skip: nullable(nullable(this.gridInfo).pagination).skip,
      take: nullable(nullable(this.gridInfo).pagination).take
    };
  }
}

export class LoadSoundingReportListSuccessfulAction {
  static readonly type =
    '[QC.Report.Sounding] Load Sounding Report List Successful';

  constructor(public dto: TODO) {}
}

export class LoadSoundingReportListFailedAction {
  static readonly type = '[QC.Report.Sounding] Load Sounding Report Failed';

  constructor(public reportId: number) {}

  public log(): any {
    return {
      reportId: this.reportId
    };
  }
}
