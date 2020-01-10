import {BaseModel} from '../models/base.sub-state';
import {IServerGridInfo} from "@shiptech/core/grid/server-grid/server-grid-request-response";
import {DefaultPageSize} from "@shiptech/core/ui/components/ag-grid/base.grid-view-model";

export class QcAuditLogItemState {
}

export class QcAuditLogModel extends BaseModel {
  payload: QcAuditLogItemState[];

  gridInfo: IServerGridInfo = {pagination: {skip: 0, take: DefaultPageSize}};
  matchedCount: number;

}

export interface IQcAuditLogState extends QcAuditLogModel {
}
