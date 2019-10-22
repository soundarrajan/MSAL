import { ApiServiceSettingsComponent, IApiService } from './api-service-settings/api-service-settings.component';

export enum ApiServiceState {
  real = 'Real',
  mock = 'Mock',
  mixed = 'Mixed'
}

export class ApiServiceModel implements IApiService {
  id: string;
  displayName: string;
  instance: any;
  isRealService: boolean;
  suppressUrls?: boolean;
  localApiUrl?: string;
  devApiUrl?: string;
  qaApiUrl?: string;
  component?: ApiServiceSettingsComponent;

  constructor(apiService: Partial<IApiService> = {}) {
    Object.assign(this, apiService);
  }
}
