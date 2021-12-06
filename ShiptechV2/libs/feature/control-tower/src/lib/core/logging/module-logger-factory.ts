import { Injectable } from '@angular/core';
import {
  ILoggerFactory,
  LoggerFactory
} from '@shiptech/core/logging/logger-factory.service';
import { AppContext } from '@shiptech/core/app-context/app-context';

@Injectable({
  providedIn: 'root'
})
export class ModuleLoggerFactory extends LoggerFactory
  implements ILoggerFactory {
  constructor(appContext: AppContext) {
    super(appContext);

    this.enrich = { ...this.enrich, clientModule: 'QualityControlModule' };
  }
}
