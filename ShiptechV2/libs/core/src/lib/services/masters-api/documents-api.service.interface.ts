import { Observable } from "rxjs";
import { IEmailLogsRequest, IEmailLogsResponse } from "./request-response-dtos/email-logs.dto";
import { IGetDocumentsListRequest, IGetDocumentsListResponse } from "@shiptech/core/services/masters-api/request-response-dtos/document.dto";

export interface IDocumentsApiService {
  getEmailLogs(request: IGetDocumentsListRequest): Observable<IGetDocumentsListResponse>;
}
