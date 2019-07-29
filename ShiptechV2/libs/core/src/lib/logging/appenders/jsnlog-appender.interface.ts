import { JL } from 'jsnlog';
import { ILogItem } from '../logger';

export interface JSNLogAppender extends JL.JSNLogAppender {
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
  log(level: string, msg: string, meta: ILogItem, callback: () => void, levelNbr: number, message: string, loggerName: string): void;
}
