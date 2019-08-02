import { HttpClient } from '@angular/common/http';

export abstract class ApiServiceBase {
  protected constructor(protected httpClient: HttpClient) {}
}
