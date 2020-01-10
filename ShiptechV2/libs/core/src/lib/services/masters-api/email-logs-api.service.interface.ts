import { Observable } from "rxjs";
import { IEmailLogsRequest, IEmailLogsResponse } from "./request-response-dtos/email-logs.dto";

export interface IEmailLogsApiService {
  getEmailLogs(request: IEmailLogsRequest, emailTransactionTypeId: number, reportId: number): Observable<IEmailLogsResponse>;
}
