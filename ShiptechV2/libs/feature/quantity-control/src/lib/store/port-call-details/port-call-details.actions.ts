import { IPortCallDto } from '../../services/api/dto/port-call.dto';
import { nullable } from '@shiptech/core/utils/nullable';

export class LoadPortCallDetailsAction {
  static readonly type = '[Settings] Load Port Call Details';

  constructor(public portCallId: string) {
  }

  public log(): any {
    return {
      portCallId: this.portCallId
    };
  }
}

export class LoadPortCallDetailsSuccessfulAction {
  static readonly type = '[Settings] Load Port Call Details Successful';

  constructor(public portCallId: string, public dto: IPortCallDto) {
  }

  public log(): any {
    return {
      portCallId: this.portCallId,
      vesselName: nullable(this.dto).vesselName,
      status: nullable(this.dto).status
    };
  }
}

export class LoadPortCallDetailsFailedAction {
  static readonly type = '[Settings] Load Port Call Details Failed';

  constructor(public portCallId: string) {
  }

  public log(): any {
    return {
      portCallId: this.portCallId
    };
  }
}
