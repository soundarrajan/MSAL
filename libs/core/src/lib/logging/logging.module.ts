import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { ILoggerSettings, LOGGER_SETTINGS, LoggerFactory, LoggerSettings, RootLogger } from '../logging/logger-factory.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Logger } from '../logging/logger';
import { JL } from 'jsnlog';
import * as jsonCycle from 'json-cycle';
import { LoggingInterceptor } from '../interceptors/logging-http-interceptor.service';

export const LOGGER_CONFIG = new InjectionToken<ILoggerSettings>('LOGGER_CONFIG');

JL.setOptions({
  // Note: Prevent errors from cycle json
  serialize: (object: any) => jsonCycle.stringify(object)
});

export function LoggerSettingsFactory(settings: ILoggerSettings): Object {
  return Object.assign(LoggerSettings, settings);
}

@NgModule({
  providers: [
    {
      provide: LOGGER_SETTINGS,
      useFactory: LoggerSettingsFactory,
      deps: [LOGGER_CONFIG]
    },
    LoggerFactory,
    {
      provide: Logger,
      useValue: RootLogger
    },
    //TODO: Setup backend for serilog
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: CorrelationIdHttpInterceptor,
    //   multi: true
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptor,
      multi: true
    }
  ]
})
export class LoggingModule {
  public static forRoot(settings: ILoggerSettings): ModuleWithProviders {
    return {
      ngModule: LoggingModule,
      providers: [
        {
          provide: LOGGER_CONFIG,
          useValue: settings
        }
      ]
    };
  }
}
