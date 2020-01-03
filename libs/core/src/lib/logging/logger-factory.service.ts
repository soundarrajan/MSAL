import { Injectable, InjectionToken } from '@angular/core';
import { JL } from 'jsnlog';
import { ReplaySubject } from 'rxjs';
import { ILogger, Logger } from './logger';
import { AppContext } from '../app-context/app-context';
import { LazyAjaxAppender } from './appenders/lazy-ajax.appender';
import { KnownHeadersEnum } from './known-headers.enum';
import { StructuredConsoleAppender } from './appenders/structured-console.appender';

export interface ILoggerFactory {
  createLogger(name: string): ILogger;
}

export interface ILoggerSettings {
  developmentMode: boolean;
  serverSideUrl?: string;
}

export const LOGGER_SETTINGS = new InjectionToken<ILoggerSettings>('LoggerSettings');
export const LoggerSettings: ILoggerSettings = {
  developmentMode: false
};

const rootAjaxAppenderReady = new ReplaySubject<JL.JSNLogAjaxAppenderOptions>(1);
const rootAjaxAppender = new LazyAjaxAppender('GlobalAjaxAppender', rootAjaxAppenderReady);

function createRootLogger(): JL.JSNLogLogger {
  const logger = JL();

  // TODO: Disabled until we have a backend service which saves logs
  // logger.setOptions({
  //   appenders: [rootAjaxAppender]
  // });

  return logger;
}

const locationEnrich = () => ({ host: location.host, path: location.pathname });

const jsnLogLogger: JL.JSNLogLogger = createRootLogger();
export const RootLogger = new Logger(jsnLogLogger, {}, locationEnrich);

@Injectable()
export class LoggerFactory implements ILoggerFactory {
  protected enrich?: Record<string, any>;

  constructor(protected appContext: AppContext) {}

  public init(settings: ILoggerSettings): void {
    if (settings.developmentMode) {
      jsnLogLogger.setOptions({
        //appenders: [new StructuredConsoleAppender('StructuredConsole'), rootAjaxAppender]
        appenders: [new StructuredConsoleAppender('StructuredConsole')]
      });
    }

    // rootAjaxAppenderReady.next({
    //   bufferSize: 20,
    //   storeInBufferLevel: 1000,
    //   level: JL.getAllLevel(),
    //   sendWithBufferLevel: 6000,
    //   url: `${settings.serverSideUrl}/logger`,
    //   beforeSend: (xhr: XMLHttpRequest) => {
    //     xhr.setRequestHeader(KnownHeadersEnum.CorrelationId, this.appContext.sessionId);
    //     xhr.setRequestHeader(KnownHeadersEnum.TenantId, this.appContext.authContext.tenantId || '');
    //     xhr.setRequestHeader(KnownHeadersEnum.UserId, this.appContext.authContext.userId || '');
    //   }
    // });
  }

  public createLogger(name: string, enrich?: Record<string, any>): ILogger {
    return new Logger(JL(name), { ...this.enrich }, locationEnrich);
  }
}

// NOTE : Before JsnLog this kind of errors were not handled and the were just ignored
// NOTE : These errors were not displayed in console
// NOTE : JsnLog if it doesn't find any handler for window.onerror it adds it's own handler
// NOTE : The handler added by JsnLog doesn't have a proper message format for the error

window.onerror = (error: any, url: any, lineNumber: any, column: any, errorObj: any) => {
  if (!LoggerSettings.developmentMode) {
    // Use errorMsg.message if available, so Angular 4 template errors will be logged.
    RootLogger.error('Browser error {ErrorMessage} occurred', error ? (<any>error).message || error : '', {
      lineNumber,
      column,
      errorObj,
      errorMsg: error,
      destructure: true
    });
  }

  // Tell browser to run its own error handler as well
  return false;
};

// Deal with unhandled exceptions thrown in promises
(<any>window).onunhandledrejection = function(event: any): void {
  if (!LoggerSettings.developmentMode) {
    RootLogger.error('Browser error in Promise has occurred. Reason: {Reason}', event.reason ? event.reason.message : event.message || null);
  }
};
