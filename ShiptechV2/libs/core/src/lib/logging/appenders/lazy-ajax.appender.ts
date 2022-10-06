import { JL } from 'jsnlog';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';

// Note: Doing this because of log method that is not exported from JSNLog
export interface ILazyJSNLogAjaxAppender extends JL.JSNLogAjaxAppender {
  log?(
    level: string,
    msg: string,
    meta: any,
    callback: () => void,
    levelNbr: number,
    message: string,
    loggerName: string
  ): void;

  log?(...args: any[]): void;
}

export class LazyAjaxAppender implements JL.JSNLogAjaxAppender {
  private ajaxAppender: ILazyJSNLogAjaxAppender;
  private isReady = false;
  private bufferedLogs = [];

  constructor(name: string, ready$: Observable<JL.JSNLogAjaxAppenderOptions>) {
    this.ajaxAppender = JL.createAjaxAppender(name);

    ready$
      .pipe(
        first(),
        tap(ajaxOptions => {
          this.isReady = true;
          this.setOptions(ajaxOptions);
          this.sendBufferedLogs();
        })
      )
      .subscribe();
  }

  sendBatch(): void {
    if (!this.isReady) {
      return;
    }

    this.ajaxAppender.sendBatch();
  }

  sendBufferedLogs(): void {
    this.bufferedLogs.forEach(log => this.log(...log));
    this.bufferedLogs = [];
  }
  setOptions(options: JL.JSNLogAjaxAppenderOptions): JL.JSNLogAjaxAppender;
  setOptions(options: JL.JSNLogAppenderOptions): JL.JSNLogAppender;
  setOptions(
    options: JL.JSNLogAjaxAppenderOptions | JL.JSNLogAppenderOptions
  ): JL.JSNLogAjaxAppender | JL.JSNLogAppender {
    return this.ajaxAppender.setOptions(options);
  }

  public log(...args: any[]): void {
    if (!this.isReady) {
      this.bufferedLogs.push(args);
    } else {
      this.ajaxAppender.log(...args);
    }
  }
}
