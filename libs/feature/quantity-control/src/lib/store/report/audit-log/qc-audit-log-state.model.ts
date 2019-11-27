import { BaseModel } from '../models/base.sub-state';

export class QcAuditLogItemState {
}

export class QcAuditLogStateModel extends BaseModel {
  items: QcAuditLogItemState[];
}

export interface IQcAuditLogState extends QcAuditLogStateModel {
}
