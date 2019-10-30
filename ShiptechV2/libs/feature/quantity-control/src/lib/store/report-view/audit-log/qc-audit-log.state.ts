import { BaseSubState } from '../models/base.sub-state';

export class QcAuditLogState extends BaseSubState {
  items: QcAuditLogItemState[];
}

export interface IQcAuditLogState extends QcAuditLogState {
}

export class QcAuditLogItemState {

}
