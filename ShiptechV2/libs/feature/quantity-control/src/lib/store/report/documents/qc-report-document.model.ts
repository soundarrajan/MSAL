import { BaseModel } from '../models/base.sub-state';
import { IServerGridInfo } from "@shiptech/core/grid/server-grid/server-grid-request-response";
import { DefaultPageSize } from "@shiptech/core/ui/components/ag-grid/base.grid-view-model";

export class QcDocumentsListItemState {
}

export class QcReportDocumentModel extends BaseModel {
  payload: QcDocumentsListItemState[];
  gridInfo: IServerGridInfo = { pagination: { skip: 0, take: DefaultPageSize } };

  matchedCount: number;
}

export interface IQcReportDocumentState extends QcReportDocumentModel {
}
