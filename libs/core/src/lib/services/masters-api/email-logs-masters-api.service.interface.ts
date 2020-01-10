import { Observable } from "rxjs";
import { IEmailLogsMastersRequest, IEmailLogsMastersResponse } from "./dtos/email-logs.dto";

export interface IEmailLogsMastersApiService {
  getEmailLogs(request: IEmailLogsMastersRequest): Observable<IEmailLogsMastersResponse>;
}
