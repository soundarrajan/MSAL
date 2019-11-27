import { BaseModel } from '../models/base.sub-state';

export class QcDocumentsListItemState {
}

export class QcDocumentsModel extends BaseModel {
  items: QcDocumentsListItemState[];
}

export interface IQcDocumentsState extends QcDocumentsModel {
}
