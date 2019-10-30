import { BaseSubState } from '../models/base.sub-state';

export class QcDocumentsListItemState {
}

export class QcDocumentsState extends BaseSubState {
  items: QcDocumentsListItemState[];
}

export interface IQcDocumentsState extends QcDocumentsState {
}
