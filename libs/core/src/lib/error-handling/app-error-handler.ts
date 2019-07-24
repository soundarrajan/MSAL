import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { AppError, IAppError } from './app-error';
import { AppErrorHandlingStrategy } from './app-error-handling-strategy';
import { ApiError } from './api/api-error';
import { AppContext } from '../app-context';
import { ToastrLogComponent } from './toastr-log/toastr-log.component';
import { Logger } from '../logging/logger';
import { ILoggerSettings, LOGGER_SETTINGS, RootLogger } from '../logging/logger-factory.service';

@Injectable({
  providedIn: 'root'
})
export class AppErrorHandler implements ErrorHandler {
  constructor(@Inject(Injector) private injector: Injector, private appContext: AppContext, private logger: Logger, @Inject(LOGGER_SETTINGS) private loggerSettings: ILoggerSettings) {
    // TODO: There can be only one ErrorHandler per Angular app. In order to have app handler per module
    //       the Web.deployment app needs to catch all errors and based on type, route them to appropriate
    //       module error handler.
    //       Note: Currently this AppErrorHandler is instantiated twice (one the injected toaster is undefined)
    //       Note: and the other time, toastr is injected correctly (probably because of lazy loaded module)
    //       Note: Right now if LookupService throws an error when getting terminals, the error is not shown.

    // Note: Sometimes appContext, logger are null, depending on where angular crashes.
    this.appContext = appContext || AppContext.instance;
    this.logger = logger || RootLogger;
    this.loggerSettings = loggerSettings || { developmentMode: false };
  }

  // Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
  // TODO: The above comment does not seem right.
  private get toastr(): ToastrService {
    return this.injector.get(ToastrService);
  }

  handleError(error: any): void {
    const toastrLogConfig: Partial<IndividualConfig> = {
      disableTimeOut: true,
      closeButton: true,
      tapToDismiss: false,
      toastComponent: ToastrLogComponent,
      enableHtml: true,
      onActivateTick: true
    };

    // Unknown Application Errors
    if (!(error instanceof AppError) && !(error instanceof ApiError)) {
      // App does not know how to handleError this type of error so Angular can pick it up

      if (this.toastr) {
        // Note: Most of the times the error handler runs outside of the angular zone. Pass onActivateTick: true
        this.toastr.error(AppError.Unknown.message, null, toastrLogConfig);
      }

      // Note: There isn't much we can do now.
      this.logger.fatalException(error, 'Unknown Javascript error. See props for details.');

      throw error;
    }

    if (error instanceof ApiError) {
      // App does not know how to handleError this type of error so Angular can pick it up
      error = AppError.UnknownServerErrorWithData(error);
    }
    // Add default values
    const appError = new AppError(error);

    if (this.isSuppressed(appError)) {
      return;
    }

    if (appError.treatAsWarning) {
      this.logger.info('User warning {Warning}', appError.message);
    } else {
      this.logger.fatalException(appError, 'Unhandled App Error has occurred. See props for details.');
    }

    const showToastr = appError.treatAsWarning ? this.toastr.warning : this.toastr.error;
    // Note: Most of the times the error handler runs outside oif the angular zone. Pass onActivateTick: true
    showToastr.apply(this.toastr, [appError.message, null, toastrLogConfig]);
  }

  private isSuppressed(appError: IAppError): boolean {
    if (appError.handleStrategy === AppErrorHandlingStrategy.Suppress) {
      this.logger.debug('Suppressed error message: {message}', appError.message, { appError, destructure: true });
      return true;
    }

    return false;
  }
}
