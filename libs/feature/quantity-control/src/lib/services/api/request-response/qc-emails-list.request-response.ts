import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from "./request-response.quantity-control.model";
import { IServerGridInfo } from "@shiptech/core/grid/server-grid/server-grid-request-response";
import { IQcEmailLogsItemDto } from "../dto/qc-emails-list-item.dto";

export interface IGetQcEmailLogsRequest extends IBaseQuantityControlRequest, IServerGridInfo {
}

export interface IGetQcEmailLogsResponse extends IBaseQuantityControlResponse {
  payload: IQcEmailLogsItemDto[];
  matchedCount: number;
}
