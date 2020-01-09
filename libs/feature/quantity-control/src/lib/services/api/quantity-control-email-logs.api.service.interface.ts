import { Observable } from "rxjs";
import { IGetQcEmailLogsRequest, IGetQcEmailLogsResponse } from "./request-response/qc-emails-list.request-response";

export interface IQuantityControlEmailLogsApiService {
  getEmailLogs(request: IGetQcEmailLogsRequest): Observable<IGetQcEmailLogsResponse>;
}
