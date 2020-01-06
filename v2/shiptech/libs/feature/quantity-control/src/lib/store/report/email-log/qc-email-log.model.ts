import { BaseModel } from '../models/base.sub-state';

export class QcEmailLogItemState {
}

export class QcEmailLogModel extends BaseModel {
  items: QcEmailLogItemState[];
}

export interface IQcEmailLogState extends QcEmailLogModel {
}
