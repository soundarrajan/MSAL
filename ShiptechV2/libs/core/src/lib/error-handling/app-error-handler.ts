import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { AppError, IAppError } from './app-error';
import { AppErrorHandlingStrategy } from './app-error-handling-strategy';
import { ApiError } from './api/api-error';
import { AppContext } from '../app-context/app-context';
import { ToastrLogComponent } from './toastr-log/toastr-log.component';
import { Logger } from '../logging/logger';
import {
  ILoggerSettings,
  LOGGER_SETTINGS,
  RootLogger
} from '../logging/logger-factory.service';

@Injectable({
  providedIn: 'root'
})
export class AppErrorHandler implements ErrorHandler {
  constructor(
    @Inject(Injector) private injector: Injector,
    private appContext: AppContext,
    private logger: Logger,
    @Inject(LOGGER_SETTINGS) private loggerSettings: ILoggerSettings
  ) {
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

    let unwrappedError = this.tryUnwrapAngularPromiseError(error);

    // Unknown Application Errors
    if (
      !(unwrappedError instanceof AppError) &&
      !(unwrappedError instanceof ApiError)
    ) {
      // App does not know how to handleError this type of unwrappedError so Angular can pick it up

      if (this.toastr && parseInt(localStorage.getItem("authorization"), 10)) {
        // Note: Most of the times the unwrappedError handler runs outside of the angular zone. Pass onActivateTick: true
        this.toastr.error(AppError.Unknown.message, null, toastrLogConfig);
      }

      // Note: There isn't much we can do now.
      this.logger.fatalException(
        unwrappedError,
        'Unknown Javascript unwrappedError. See props for details.'
      );

      throw unwrappedError;
    }

    if (unwrappedError instanceof ApiError) {
      // App does not know how to handleError this type of unwrappedError so Angular can pick it up
      unwrappedError = AppError.UnknownServerErrorWithData(unwrappedError);
    }
    // Add default values
    const appError = new AppError(unwrappedError);

    if (this.isSuppressed(appError)) {
      return;
    }

    if (appError.treatAsWarning) {
      this.logger.info('User warning {Warning}', appError.message);
    } else {
      this.logger.fatalException(
        appError,
        'Unhandled App Error has occurred. See props for details.'
      );
    }
    
    if (this.toastr && parseInt(localStorage.getItem("authorization"), 10) == 0) {
      return;
    }

    const showToastr = appError.treatAsWarning
      ? this.toastr.warning
      : this.toastr.error;
    // Note: Most of the times the unwrappedError handler runs outside oif the angular zone. Pass onActivateTick: true
    showToastr.apply(this.toastr, [appError.message, null, toastrLogConfig]);
  }

  private isSuppressed(appError: IAppError): boolean {
    if (appError.handleStrategy === AppErrorHandlingStrategy.Suppress) {
      this.logger.debug(
        'Suppressed error message: {message}',
        appError.message,
        { appError, destructure: true }
      );
      return true;
    }

    return false;
  }

  /**
   * Note: In case we end up with a resolved promise error like, this happens for angular built in promise methods e.g APP_INITIALIZER
   * Sample:
   * {
   *   promise: ZoneAwarePromise {__zone_symbol__state: 0, __zone_symbol__value: ModuleError}
   *   rejection: ModuleError {code: 3000, data: undefined ..}
   *   zone: Zone {_parent: Zone, _name: "angular", _properties: {…}, _zoneDelegate: ZoneDelegate}
   *   message: "Uncaught (in promise): ModuleError: {"code":3000,"handleStrategy" ... "
   *   stack: "Error: Uncaught (in promise): ModuleError: {"code":3000,"handleStrategy":0, ... }
   *   __proto__: Object
   * }
   * @param error angular error
   */
  private tryUnwrapAngularPromiseError(error: any): any {
    if (
      error &&
      error.promise &&
      error.promise instanceof Promise &&
      error.rejection
    ) {
      return error.rejection;
    }

    return error;
  }
}
