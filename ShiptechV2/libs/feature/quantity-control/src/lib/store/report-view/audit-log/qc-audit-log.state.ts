import { BaseSubState } from '../models/base.sub-state';

export class QcAuditLogItemState {
}

export class QcAuditLogState extends BaseSubState {
  items: QcAuditLogItemState[];
}

export interface IQcAuditLogState extends QcAuditLogState {
}
