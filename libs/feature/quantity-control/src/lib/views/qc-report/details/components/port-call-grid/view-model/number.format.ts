import { InjectionToken } from '@angular/core';

export class NumberFormat {
  minIntegerDigits: number = 1;
  minFractionDigits: number = 3;
  maxFractionDigits: number = 5;
}

export interface INumberFormat extends NumberFormat {
}

export const NUMBER_FORMAT = new InjectionToken<INumberFormat>('NUMBER_FORMAT');
