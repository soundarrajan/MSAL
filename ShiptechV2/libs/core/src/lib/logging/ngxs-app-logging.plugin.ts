import { Inject, Injectable } from '@angular/core';
import { NgxsNextPluginFn, NgxsPlugin } from '@ngxs/store/src/symbols';
import { NGXS_LOGGER_PLUGIN_OPTIONS, NgxsLoggerPluginOptions } from '@ngxs/logger-plugin';
import { ILoggerSettings, LOGGER_SETTINGS, LoggerFactory } from './logger-factory.service';
import { getActionTypeFromInstance } from '@ngxs/store';
import { ILogger } from './logger';

@Injectable()
export class NgxsAppLoggingPlugin implements NgxsPlugin {
  localOpts: NgxsLoggerPluginOptions;
  private logger: ILogger;

  constructor(@Inject(NGXS_LOGGER_PLUGIN_OPTIONS) _options: NgxsLoggerPluginOptions, private loggerFactory: LoggerFactory, @Inject(LOGGER_SETTINGS) private loggerSettings: ILoggerSettings) {
    this.localOpts = _options;
    this.logger = loggerFactory.createLogger('NgxsLoggingService');
  }

  handle(state: any, event: any, next: NgxsNextPluginFn): any {
    const actionName = getActionTypeFromInstance(event);
    // Note: Use structured logging format!
    // Note: What else we can add here?
    if (!this.loggerSettings.developmentMode) {
      // Note: For production, we always log, because console is disabled and logs are sent to the server
      const time = new Date();
      const formattedTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}.${time.getMilliseconds()}`;

      if (typeof event.log === 'function') {
        try {
          this.logger.info('action {Action} with {@ActionArgs} @ {time}', actionName, event.log(), formattedTime);
        } catch (e) {
          this.logger.fatalException(e, 'Failed to log ng-xs action {Action}', actionName);
        }
      } else {
        this.logger.info('action {Action} @ {time}', actionName, formattedTime);
      }
    }

    return next(state, event);
  }
}
