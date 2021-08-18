import { Injectable } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { environment } from '@shiptech/environment';
import { AppConfig } from '@shiptech/core/config/app-config';
@Injectable({
    providedIn: 'root'
  })

export class MyMonitoringService {
  appInsights: ApplicationInsights;
  constructor(private appConfig: AppConfig) {
    const configInstrumentationKey = this.appConfig.v1.INSTRUMENTATION_KEY;
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: configInstrumentationKey,
        enableAutoRouteTracking: true // option to log all route changes
      }
    });
    this.appInsights.loadAppInsights();
  }

  logPageView(name?: string, url?: string) { // option to call manually
    this.appInsights.trackPageView({
      name: name,
      uri: url
    });
  }

  startTrackEvent(url?: string) {
      this.appInsights.startTrackEvent(url);
  }

  stopTrackEvent(url?: string) {
      this.appInsights.stopTrackEvent(url, { type: 'PAGE LOAD TIME' });
  }

  logEvent(name: string, properties?: { [key: string]: any }) {
    this.appInsights.trackEvent({ name: name}, properties);
  }

  logMetric(name: string, average: number, properties?: { [key: string]: any }) {
    this.appInsights.trackMetric({ name: name, average: average }, properties);
  }

  logException(exception: Error, severityLevel?: number) {
    this.appInsights.trackException({ exception: exception, severityLevel: severityLevel });
  }

  logTrace(message: string, properties?: { [key: string]: any }) {
    this.appInsights.trackTrace({ message: message}, properties);
  }
}