import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  loggingLevel: LoggingLevel = LoggingLevel.None;
  constructor() { }
}

export class LoggingLevel {
  public static None = 'None';
  public static Verbose = 'Verbose';
  public static Info = 'Info';
  public static Warnings = 'Warnings';
  public static Errors = 'Errors';
}
