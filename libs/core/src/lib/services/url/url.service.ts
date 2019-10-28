import { Injectable } from '@angular/core';
import { ILogger } from '@shiptech/core/logging/logger';
import { LoggerFactory } from '@shiptech/core/logging/logger-factory.service';
import { AppConfig } from '@shiptech/core/config/app-config';

@Injectable({
  providedIn: 'root'
})
// noinspection JSUnusedGlobalSymbols
export class UrlService {
  private logger: ILogger;

  constructor(private appConfig: AppConfig, loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.createLogger(UrlService.name);
  }


  editRequest(requestId: number): string {
    return `/#/edit-request/${(requestId)}`;
  }
}
