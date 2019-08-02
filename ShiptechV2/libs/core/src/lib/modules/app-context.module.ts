import { NgModule } from '@angular/core';
import { AppContext, SESSION_ID } from '../app-context';
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
// TODO: Shouldn't this be forRoot, so there is only one instance even for lazy loaded? Find out other places where forRoot might be needed.
@NgModule({
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
})
export class AppContextModule {
  constructor(private toastr: ToastrService) {
    copyToClipboardCtrlAltE()
      .pipe(tap(() => toastr.info('Tracking Id has been copied to clipboard')))
      .subscribe();
  }
}
