/* tslint:disable:no-console */
import * as JLModule from 'jsnlog';
import { JL } from 'jsnlog';
import { ILogItem } from '../logger';
import { JSNLogAppender } from './jsnlog-appender.interface';

const msgExtractArgsRegex = new RegExp(/(?<!{){(?!{).*?(?<!})}(?!})/g);

// Note: Tested with the following formats
// this.logger.debug('Load purchase product {ProductId} availability for {PurchaseId} and {SaleId}', pair.purchaseProductId,  pair.purchaseId, pair.saleId);
// this.logger.debug('Load purchase product {ProductId} with destruct', pair.purchaseProductId,  { ...pair, destructure: true});
// this.logger.debug('Load purchase product {ProductId} with {@pair}', pair.purchaseProductId,  pair);
// this.logger.debug('Less args {ProductId} with {SaleId}', pair.purchaseProductId);
// this.logger.debug('More args {ProductId} with {SaleId}', pair.purchaseProductId, 1, 2, 3);
// this.logger.debug('test');
// this.logger.fatalException({ msg: 'exception occurred', stackTrace: 'someStack'}, 'some message template', 1, 2);

/**
 Called by a logger to log a log item.
 If in response to this call one or more log items need to be processed
 (eg., sent to the server), this method calls this.sendLogItems
 with an array with all items to be processed.
 Note that the name and parameters of this function must match those of the log function of
 a Winston transport object, so that users can use these transports as appenders.
 That is why there are many parameters that are not actually used by this function.
 level - string with the level ("trace", "debug", etc.) Only used by Winston transports.
 msg - human readable message. Undefined if the log item is an object. Only used by Winston transports.
 meta - log object. Always defined, because at least it contains the logger name. Only used by Winston transports.
 callback - function that is called when the log item has been logged. Only used by Winston transports.
 levelNbr - level as a number. Not used by Winston transports.
 message - log item. If the user logged an object, this is the JSON string.  Not used by Winston transports.
 loggerName: name of the logger.  Not used by Winston transports.
 */
export class StructuredConsoleAppender implements JSNLogAppender {
  private fallBackAppender: JSNLogAppender;

  constructor(public appenderName: string) {
    this.fallBackAppender = JL.createConsoleAppender(
      `${appenderName}-fallback`
    ) as JSNLogAppender;
  }

  sendBatch(): void {}

  setOptions(options: JL.JSNLogAppenderOptions): JL.JSNLogAppender {
    // super.setOptions(options);
    return this;
  }

  /**
   Called by a logger to log a log item.
   If in response to this call one or more log items need to be processed
   (eg., sent to the server), this method calls this.sendLogItems
   with an array with all items to be processed.
   Note that the name and parameters of this function must match those of the log function of
   a Winston transport object, so that users can use these transports as appenders.
   That is why there are many parameters that are not actually used by this function.
   level - string with the level ("trace", "debug", etc.) Only used by Winston transports.
   msg - human readable message. Undefined if the log item is an object. Only used by Winston transports.
   meta - log object. Always defined, because at least it contains the logger name. Only used by Winston transports.
   callback - function that is called when the log item has been logged. Only used by Winston transports.
   levelNbr - level as a number. Not used by Winston transports.
   message - log item. If the user logged an object, this is the JSON string.  Not used by Winston transports.
   loggerName: name of the logger.  Not used by Winston transports.
   */
  public log(
    level: string,
    msg: string,
    meta: ILogItem,
    callback: () => void,
    levelNbr: number,
    message: string,
    loggerName: string
  ): void {
    try {
      this.handleLog(level, msg, meta, callback, levelNbr, message, loggerName);
    } catch (e) {
      console.error(`${StructuredConsoleAppender.name} log failure: %o`, e);
      this.fallBackAppender.log(
        level,
        msg,
        meta,
        callback,
        levelNbr,
        message,
        loggerName
      );
    }
  }

  private handleLog(
    level: string,
    msg: string,
    meta: ILogItem,
    callback: () => void,
    levelNbr: number,
    message: string,
    loggerName: string
  ): void {
    // Note: if there is an exception, jsnlog passes a different format in meta param
    // Note: Left here as a reminder but we "disabled" this by adding the exception to the args.
    const logItem = meta['logData'] || meta;

    // Note: JSNLog has changed log format and we don't know how to handle it
    if (!logItem) {
      this.fallBackAppender.log(
        level,
        msg,
        meta,
        callback,
        levelNbr,
        message,
        loggerName
      );
      return;
    }

    // Do not send logs, if JL.enabled is set to false
    // If enabled is not null or undefined, then if it is false, then return false
    // Note that undefined==null (!)

    // Note: This crap is taken from: https://github.com/mperdeck/jsnlog.js/blob/master/jsnlog.ts
    // Note: We really need to find another js logger
    // @ts-ignore
    const isEnabled = JLModule.JL.enabled;
    if (!(isEnabled == null)) {
      if (!isEnabled) {
        return;
      }
    }

    const consoleLogArgs = [];
    let consoleLogMessage = '';
    let props = { ...logItem.enrich, loggerName: loggerName || 'RootLogger' };

    if (typeof logItem.messageTemplate === 'string') {
      let i = 0;
      consoleLogMessage = logItem.messageTemplate.replace(
        msgExtractArgsRegex,
        (match: string) => {
          const arg = logItem.args[i];
          const renderArgsJson = match.includes('@');

          // Note: More arguments then named args present, e.g logger.info("some log {test1} and {test2}", 1)
          if (i >= logItem.args.length) {
            return '';
          }
          i++;
          // Note: match comes as {arg1} or {arg1:format}
          const argName: string = match.slice(1, -1).split(':')[0];

          // Note: Discard empty named args, e.g {}
          if (!argName) {
            return '';
          }

          props[argName] = arg;

          if (renderArgsJson) {
            consoleLogArgs.push(arg);
            return '%o';
          } else {
            if (typeof arg === 'string') {
              return `'${arg}'`;
            }

            return arg === null
              ? '(null)'
              : arg === undefined
              ? '(undefined)'
              : arg.toString();
          }
        }
      );
    } else {
      consoleLogMessage = '%o';
      consoleLogArgs.push(logItem.args);
    }

    // Note: Added additional property check, args props can be undefined
    logItem.args
      .filter(s => s && s.destructure === true)
      .forEach(o => (props = { ...props, ...o }));

    if (logItem.exception) {
      props.exception = logItem.exception;
    }

    let color = 'color: black;';
    let writeConsole = console.log;

    if (logItem.level <= JL.getDebugLevel()) {
      color = 'color: gray;';
      // eslint-disable-next-line no-console
      writeConsole = console.debug;
    } else if (logItem.level <= JL.getInfoLevel()) {
      color = 'color: black;';
      // eslint-disable-next-line no-console
      writeConsole = console.info;
    } else if (logItem.level <= JL.getWarnLevel()) {
      color = 'color: #d2d201;';
      writeConsole = console.warn;
    } else {
      color = 'color: red;';
      writeConsole = console.error;
    }

    console.groupCollapsed(
      ...['%c' + consoleLogMessage, color, ...consoleLogArgs]
    );
    writeConsole(props);
    console.groupEnd();
  }
}
