import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppConfig } from '@shiptech/core/config/app-config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private settings: any;
  private http: HttpClient;

  constructor(
    private readonly httpHandler: HttpBackend,
    private appConfig: AppConfig
  ) {
    this.http = new HttpClient(httpHandler);
  }

  init(endpoint: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http
        .get(endpoint)
        .pipe(map(result => result))
        .subscribe(
          value => {
            this.settings = value;
            localStorage.setItem('config', JSON.stringify(value));

            resolve(true);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  getConfigValue() {
    console.log(this.settings);
    return this.settings;
  }
}

export function configApplication(
  configService: ConfigService
): () => Promise<any> {
  const promise = configService.init('config/config.json').then(value => {
    console.log('finished getting configurations dynamically.');
  });
  return () => promise;
}
