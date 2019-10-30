import { BaseSubState } from '../models/base.sub-state';

export class QcEmailLogItemState {
}

export class QcEmailLogState extends BaseSubState {
  items: QcEmailLogItemState[];
}

export interface IQcEmailLogState extends QcEmailLogState {
}
