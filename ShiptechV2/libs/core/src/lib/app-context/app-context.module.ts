import { ModuleWithProviders, NgModule } from '@angular/core';
import { AppContext, SESSION_ID } from './app-context';
import { tap } from 'rxjs/operators';
import { copyToClipboardCtrlAltE } from '../utils/clipboard.utils';
import { ToastrService } from 'ngx-toastr';

// Note: Workaround angular aot: Function calls are not supported in decorators
export function sessionIdFactory(appContext: AppContext): string {
  return appContext.sessionId;
}

// Note: Workaround angular aot: Function calls are not supported in decorators
export function appContextFactory(): AppContext {
  return AppContext.instance;
}

@NgModule()
export class AppContextModule {
  constructor(private toastr: ToastrService) {
    copyToClipboardCtrlAltE()
      .pipe(tap(() => toastr.info('Tracking Id has been copied to clipboard')))
      .subscribe();
  }

  static forRoot(): ModuleWithProviders <any> {
    return {
      ngModule: AppContextModule,
      providers: [
        {
          provide: AppContext,
          useFactory: appContextFactory
        },
        {
          provide: SESSION_ID,
          useFactory: sessionIdFactory,
          deps: [AppContext]
        },
        ToastrService
      ]
    };
  }
}
