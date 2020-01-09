import { BaseModel } from '../models/base.sub-state';
import {IServerGridInfo} from "@shiptech/core/grid/server-grid/server-grid-request-response";
import {DefaultPageSize} from "@shiptech/core/ui/components/ag-grid/base.grid-view-model";

export class QcAuditLogItemState {
}

export class QcAuditLogStateModel extends BaseModel {
  gridInfo: IServerGridInfo = { pagination: { skip: 0, take: DefaultPageSize }};

  constructor(state: Partial<QcAuditLogStateModel> = {}) {
    super();
    Object.assign(this, state);
  }
}

export interface IQcAuditLogState extends QcAuditLogStateModel {
}
