import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from "./request-response.quantity-control.model";
import { IServerGridInfo } from "@shiptech/core/grid/server-grid/server-grid-request-response";
import { IQcDocumentsItemDto } from "../dto/qc-document.dto";

export interface IGetQcDocumentsListRequest extends IBaseQuantityControlRequest, IServerGridInfo {
}

export interface IGetQcDocumentsListResponse extends IBaseQuantityControlResponse {
  payload: IQcDocumentsItemDto[];
  nbOfMatched: number;
  nbOfMatchedWithinLimit: number;
  nbOfNotMatched: number;
}
