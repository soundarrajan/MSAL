import { IQcEventLogListItemDto } from '../../../../services/api/dto/qc-event-log-list-item.dto';

export class QcLoadEventsLogAction {
  static readonly type = '[Qc.Report.Details] - Load Events Log';

  constructor() {}

  public log(): any {
    return {};
  }
}

export class QcLoadEventsLogSuccessfulAction {
  static readonly type = '[Qc.Report.Details] - Load Events Log Successful';

  constructor(public items: IQcEventLogListItemDto[]) {}

  public log(): any {
    return {
      itemsCount: (this.items || []).length
    };
  }
}

export class QcLoadEventsLogFailedAction {
  static readonly type = '[Qc.Report.Details] - Load Events Log Failed';

  constructor() {}
}

export class QcAddEventLogAction {
  static readonly type = '[Qc.Report.Details] - Add Event Log';

  constructor(public eventDetails?: string) {}

  public log(): any {
    return {
      eventDetails: this.eventDetails
    };
  }
}

export class QcRemoveEventLogAction {
  static readonly type = '[Qc.Report.Details] - Remove Event Log';

  constructor(public id: number) {}

  public log(): any {
    return {
      id: this.id
    };
  }
}

export class QcUpdateEventLogAction {
  static readonly type = '[Qc.Report.Details] - Update Event Log';

  constructor(public id: number, public eventDetails: string) {}

  public log(): any {
    return {
      id: this.id,
      eventDetails: this.eventDetails
    };
  }
}
