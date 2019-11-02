import { BaseModel } from '../models/base.sub-state';

export class QcAuditLogItemState {
}

export class QcAuditLogModel extends BaseModel {
  items: QcAuditLogItemState[];
}

export interface IQcAuditLogState extends QcAuditLogModel {
}
