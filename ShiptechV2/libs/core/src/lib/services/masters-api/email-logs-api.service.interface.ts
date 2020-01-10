import { Observable } from "rxjs";
import { IEmailLogsRequest, IEmailLogsResponse } from "./dtos/email-logs.dto";

export interface IEmailLogsApiService {
  getEmailLogs(request: IEmailLogsRequest): Observable<IEmailLogsResponse>;
}
