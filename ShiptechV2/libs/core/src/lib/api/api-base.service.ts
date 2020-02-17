import { HttpClient } from '@angular/common/http';
import { Logger } from '@shiptech/core/logging/logger';
import { IShiptechApiRequest } from '@shiptech/core/api/api.model';

export abstract class ApiServiceBase {
  protected constructor(
    protected httpClient: HttpClient,
    protected logger: Logger
  ) {}

  protected Request<T>(payload: T): IShiptechApiRequest<T> {
    return {
      payload
    };
  }
}
