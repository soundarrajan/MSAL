import { Injectable } from '@angular/core';
import { ILoggerFactory, LoggerFactory } from '../../../../../../core/src/lib/logging/logger-factory.service';
import { AppContext } from '@shiptech/core';

@Injectable()
export class ModuleLoggerFactory extends LoggerFactory implements ILoggerFactory {
  constructor(appContext: AppContext) {
    super(appContext);

    this.enrich = { ...this.enrich, clientModule: 'QualityControlModule' };
  }
}
