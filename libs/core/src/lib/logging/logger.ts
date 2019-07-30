import { JL } from 'jsnlog';
import { MonoTypeOperatorFunction } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { serializeException } from './serialize-exception';

export enum LogLevel {
  Trace = 1000,
  Debug = 2000,
  Info = 3000,
  Warn = 4000,
  Error = 5000,
  Fatal = 6000
}

export interface ILogItem {
  exception?: any;
  messageTemplate: string;
  args: any[];
  enrich: any;
  level: LogLevel;
}

export type IGetDynamicEnrichParams = () => Record<string, any>;

export class Logger {
  protected dynamicEnrichParams = {};

  constructor(protected jsnLogger: JL.JSNLogLogger, protected enrich?: Record<string, any>, getDynamicEnrichParams?: IGetDynamicEnrichParams) {
    if (getDynamicEnrichParams) {
      this.dynamicEnrichParams = getDynamicEnrichParams();
    }
  }

  trace(messageTemplate: string, ...args: any[]): Logger {
    this.log(LogLevel.Trace, null, messageTemplate, args);
    return this;
  }

  trace$<T>(messageTemplate: string, ...args: any[]): MonoTypeOperatorFunction<T> {
    return tap<T>(() => this.trace(messageTemplate, args));
  }

  debug(messageTemplate: string, ...args: any[]): Logger {
    this.log(LogLevel.Debug, null, messageTemplate, args);
    return this;
  }

  debug$<T>(messageTemplate: string, ...args: any[]): MonoTypeOperatorFunction<T> {
    return tap<T>(() => this.debug(messageTemplate, args));
  }

  info(messageTemplate: string, ...args: any[]): Logger {
    this.log(LogLevel.Info, null, messageTemplate, args);
    return this;
  }

  info$<T>(messageTemplate: string, args?: (payload: T) => any[]): MonoTypeOperatorFunction<T>;
  info$<T>(messageTemplate: string, ...args: any[]): MonoTypeOperatorFunction<T> {
    return tap<T>(payload => this.info.apply(this, [messageTemplate, ...(args.length === 0 ? [] : args[0](payload))]));
  }

  warn(messageTemplate: string, ...args: any[]): Logger {
    this.log(LogLevel.Warn, null, messageTemplate, args);
    return this;
  }

  warn$<T>(messageTemplate: string, ...args: any[]): MonoTypeOperatorFunction<T> {
    return tap<T>(() => this.warn(messageTemplate, args));
  }

  error(messageTemplate: string, ...args: any[]): Logger {
    this.log(LogLevel.Error, null, messageTemplate, args);
    return this;
  }

  error$<T>(messageTemplate: string, ...args: any[]): MonoTypeOperatorFunction<T> {
    return tap<T>(() => this.error(messageTemplate, args));
  }

  fatal(messageTemplate: string, ...args: any[]): Logger {
    this.log(LogLevel.Fatal, null, messageTemplate, args);

    return this;
  }

  fatal$<T>(messageTemplate: string, ...args: any[]): MonoTypeOperatorFunction<T> {
    return tap<T>(() => this.fatal(messageTemplate, args));
  }

  fatalException(exception: any, messageTemplate: string, ...args: any[]): Logger {
    this.log(LogLevel.Fatal, exception, messageTemplate, args);
    return this;
  }

  fatalException$<T>(exception: any, messageTemplate: string, ...args: any[]): MonoTypeOperatorFunction<T> {
    return tap<T>(() => this.fatalException$(exception, messageTemplate, args));
  }

  log(level: LogLevel, exception: any, messageTemplate: string, args: any[]): Logger {
    const model: ILogItem = {
      messageTemplate,
      args,
      enrich: { ...this.enrich, ...this.dynamicEnrichParams },
      level
    };

    if (exception) {
      model.exception = serializeException(exception);

      if (exception.data) {
        model.exception.__dataType = exception.data.constructor.name;
      }
    }

    // Note: Do not pass exception to JSNlog because it uses a different log message format.
    this.jsnLogger.log(level, model);
    return this;
  }

  log$<T>(level: LogLevel, exception: any, messageTemplate: string, args: any[]): MonoTypeOperatorFunction<T> {
    return tap<T>(() => this.log(level, exception, messageTemplate, args));
  }
}

// tslint:disable-next-line:no-empty-interface
export interface ILogger extends Logger {}
