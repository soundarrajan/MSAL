export interface ILoggingService {
  logPageView(name?: string, url?: string): any;
  startTrackEvent(url?: string): any;
  stopTrackEvent(url?: string): any;
  logEvent(name: string, properties?: { [key: string]: any }): any;

  logMetric(
    name: string,
    average: number,
    properties?: { [key: string]: any }
  ): any;

  logException(exception: Error, severityLevel?: number): any;
  logTrace(message: string, properties?: { [key: string]: any }): any;
}
