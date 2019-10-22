import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import {
  API_CALL_KEY,
  getApiCallUrlValue,
  IMethodApiCallSettings
} from '../../../../../../libs/core/src/lib/utils/decorators/api-call.decorator';
import { MatCheckboxChange } from '@angular/material';
import { ICannedResponse, RANDOM_DELAY } from '../../../../../../libs/core/src/lib/utils/decorators/api-call-settings';
import { Observable, Subscription } from 'rxjs';
import { ILookupDto } from '../../../../../../libs/core/src/lib/lookups/lookup-dto.interface';
import * as _ from 'lodash';

export const DEV_SETTINGS_STORAGE_PREFIX = 'DeveloperToolbar_';
export const DelayOptions = [
  { id: 0, name: 'None' },
  { id: RANDOM_DELAY, name: 'Random 50-300 ms' },
  { id: 150, name: '150 ms' },
  { id: 300, name: '300 ms' },
  { id: 500, name: '500 ms' },
  { id: 1000, name: '1 sec' },
  { id: 2000, name: '2 sec' },
  { id: 5000, name: '5 sec' },
  { id: 10000, name: '10 sec' },
  { id: 30000, name: '30 sec' }
];

export interface IApiService {
  id: string;
  displayName: string;
  instance: any;
  isRealService: boolean;
  suppressUrls?: boolean;
  localApiUrl?: string;
  devApiUrl?: string;
  qaApiUrl?: string;
}

export enum ServiceStatusesEnum {
  Mock = 'mock',
  Real = 'real',
  Mixed = 'mixed'
}

export interface IApiServiceSettings {
  id: string;
  selectedMethodName: string;
  methodSettings: IMethodApiCallSettings[];
}

@Component({
  selector: 'app-api-service-settings',
  templateUrl: './api-service-settings.component.html',
  styleUrls: ['./api-service-settings.component.scss']
})
export class ApiServiceSettingsComponent implements OnDestroy {
  private _reset$: Observable<any>;
  private _resetSubscription: Subscription;
  private _apiService: IApiService;
  private _persistSettings: boolean;
  private originalSettingsJson: string;

  @Input() set reset$(value: Observable<any>) {
    this._reset$ = value;

    if (this._resetSubscription) {
      this._resetSubscription.unsubscribe();
      this._resetSubscription = undefined;
    }

    this._resetSubscription = this._reset$.subscribe(() => {
      const settings = <IApiServiceSettings>JSON.parse(this.originalSettingsJson);
      this.applySettings(settings);
      this.saveSettings();
    });
  }

  get persistSettings(): boolean {
    return this._persistSettings;
  }

  @Input()
  set persistSettings(value: boolean) {
    this._persistSettings = value;

    if (this.apiService) {
      this.saveSettings();
    } else {
      if (this.apiService) {
        sessionStorage.removeItem(`${DEV_SETTINGS_STORAGE_PREFIX}_${this.apiService.id}`);
      }
    }
  }

  get apiService(): IApiService {
    return this._apiService;
  }

  @Input()
  set apiService(value: IApiService) {
    this._apiService = value;

    if (!this.persistSettings) {
      sessionStorage.removeItem(`${DEV_SETTINGS_STORAGE_PREFIX}_${this.apiService.id}`);
    }

    const storedSettings = this.getSettingsFromStorage();

    this.loadApiCallSettings();
    this.originalSettingsJson = JSON.stringify(this.getCurrentSettingsForSaving());

    this.applySettings(storedSettings);
    this.saveSettings();
  }

  @Output() settingsChanged = new EventEmitter<IApiServiceSettings>();

  delayOptions: ILookupDto[] = DelayOptions;

  selectedMethod: IMethodApiCallSettings;
  methods: IMethodApiCallSettings[];
  isRealService: boolean;
  suppressUrls: boolean;
  selectedDelayAll = 0;

  forwardAllToReal = true;
  indeterminateForwardAll: boolean;

  throwErrorForAll: boolean;
  indeterminateThrowErrorAll: boolean;
  overrideAllUrls: string;

  constructor() {
  }

  /**
   * Set all api methods to forward call to real service implementation
   * @param checkboxChange
   */
  changeForwardCallToForAll(checkboxChange: MatCheckboxChange): void {
    this.methods.forEach(method => (method.settings.forwardToReal = checkboxChange.checked));

    if (checkboxChange.checked) {
      this.selectedDelayAll = 0;
      this.changeDelayAll(0);
    } else {
      this.selectedDelayAll = RANDOM_DELAY;
      this.changeDelayAll(RANDOM_DELAY);
    }

    this.saveSettings();
    this.updateForwardAllToReal();
  }

  /**
   * Detect if all api call settings have the same value for forwardToReal
   */
  updateForwardAllToReal(): void {
    const checkState = (test: boolean) => this.methods.every(method => method.settings.forwardToReal === test);

    const allReal = checkState(true);
    const allMocked = checkState(false);

    this.forwardAllToReal = allReal;
    this.indeterminateForwardAll = !allReal && !allMocked;

    this.saveSettings();
  }

  public getServiceStatus(): string {
    const checkState = (test: boolean) => this.methods.every(method => method.settings.forwardToReal === test);

    const allReal = checkState(true);
    const allMocked = checkState(false);

    if (allReal) {
      return ServiceStatusesEnum.Real;
    }
    if (allMocked) {
      return ServiceStatusesEnum.Mock;
    }
    if (!allReal && !allMocked) {
      return ServiceStatusesEnum.Mixed;
    }
  }

  /**
   * Set all api methods to throw mock errors
   * @param checkboxChange
   */
  changeThrowErrorToForAll(checkboxChange: MatCheckboxChange): void {
    this.methods.forEach(method => (method.settings.throwError = checkboxChange.checked));

    // Mote: update indeterminate state
    this.updateThrowErrorForAll();
  }

  /**
   *  Detect if all api call settings have the same value for throwError
   */
  updateThrowErrorForAll(): void {
    const checkState = (test: boolean) => this.methods.every(method => method.settings.throwError === test);

    const allThrow = checkState(true);
    const allNotThrow = checkState(false);

    this.throwErrorForAll = allThrow;
    this.indeterminateThrowErrorAll = !allThrow && !allNotThrow;

    this.saveSettings();
  }

  /**
   *  Set all api @param methods to delay their responses
   * @param delay
   */
  changeDelayAll(delay: number): void {
    this.methods.forEach(method => (method.settings.delay = delay));

    this.updateDelayAll();
  }

  /**
   *  Detect if all api call settings have the same value for delay
   */
  updateDelayAll(): void {
    const allSameDelay = this.methods.every((method, i, arr) => method.settings.delay === arr[0].settings.delay);

    if (this.methods.length) {
      this.selectedDelayAll = allSameDelay ? this.methods[0].settings.delay : undefined;
    }

    this.saveSettings();
  }

  cannedResponseChanged(): void {
    this.saveSettings();
  }

  /**
   * Loads all api call settings for services metadata
   */
  private loadApiCallSettings(): void {
    this.methods = this.getApiCallMetadata(this.apiService.instance);
    this.selectedMethod = this.methods[0];
    this.isRealService = this.apiService.isRealService;
    this.suppressUrls = this.apiService.suppressUrls;

    this.methods.forEach(method => (method.settings.apiUrl = getApiCallUrlValue(this.apiService.instance, true)));

    this.syncIndeterminate();
  }

  /**
   * Apply via patching current settings.
   * @param settings
   */
  private applySettings(settings: IApiServiceSettings): void {
    if (!settings || !settings.methodSettings || settings.methodSettings.length === 0) {
      return;
    }

    this.patchCallSettings(this.methods, settings.methodSettings);

    // Note: Try to find if this api method still exists. Storage settings may have stale, old data
    const devSelectedRackApiCall = this.methods.find(s => s.name === settings.selectedMethodName);
    this.selectedMethod = devSelectedRackApiCall || this.selectedMethod;
    this.syncIndeterminate();
  }

  private syncIndeterminate(): void {
    // Note: sync all indeterminate states
    this.updateDelayAll();
    this.updateForwardAllToReal();
    this.updateThrowErrorForAll();
    this.updateOverrideAll();
  }

  /**
   * Get all MethodApiCallSettings from a service
   * @param source
   */
  private getApiCallMetadata(source: any): IMethodApiCallSettings[] {
    // Note: Only level of inherited methods
    return [...Object.getOwnPropertyNames(Object.getPrototypeOf(source)), ... Object.keys(Object.getPrototypeOf(source))]
      .map(key => <IMethodApiCallSettings>Reflect.getMetadata(API_CALL_KEY, source, key))
      .filter(m => m);
  }

  /**
   * Patch a set of MethodApiCall settings from another a source
   * @param toSettings
   * @param fromSettings
   */
  private patchCallSettings(toSettings: IMethodApiCallSettings[], fromSettings: IMethodApiCallSettings[]): void {
    toSettings.forEach(toMethod => {
      // Note: If method does not exist anymore, skip it. Storage may have an old version
      const fromMethod = fromSettings.find(f => f.name === toMethod.name);
      if (!fromMethod) {
        return;
      }

      // Note: Check is stored nextResponse still exists. Storage may have an old cannedResponse name.
      const toNextResponse = toMethod.settings.cannedResponses.find(c => c.name === (fromMethod.settings.nextResponse || <ICannedResponse>{}).name);

      // Note: Skip cannedResponses and nextResponse. These need to be fresh and checked if they still exist.
      // noinspection JSUnusedLocalSymbols
      const { cannedResponses, nextResponse, ...otherSettings } = fromMethod.settings;

      Object.assign(toMethod.settings, { ...otherSettings });
      toMethod.settings.nextResponse = toNextResponse || toMethod.settings.nextResponse;
    });
  }

  private getSettingsFromStorage(): IApiServiceSettings {
    const storedSettingsJson = sessionStorage.getItem(`${DEV_SETTINGS_STORAGE_PREFIX}_${this.apiService.id}`);

    if (!storedSettingsJson) {
      return;
    }
    return JSON.parse(storedSettingsJson);
  }

  private saveSettings(): void {
    if (!this.persistSettings) {
      return;
    }

    const settings = this.getCurrentSettingsForSaving();
    this.settingsChanged.emit(settings);

    sessionStorage.setItem(`${DEV_SETTINGS_STORAGE_PREFIX}_${this.apiService.id}`, JSON.stringify(settings));
  }

  private getCurrentSettingsForSaving(): IApiServiceSettings {
    return {
      id: this.apiService.id,
      selectedMethodName: (this.selectedMethod || <IMethodApiCallSettings>{}).name,
      methodSettings: this.methods
    };
  }

  /**
   *  Detect if all api call settings have the same value for delay
   */
  updateOverrideAll(): void {
    const allSameValue = this.methods.every((method, i, arr) => method.settings.apiUrl === arr[0].settings.apiUrl);

    this.overrideAllUrls = allSameValue ? this.methods[0].settings.apiUrl : undefined;
    this.saveSettings();
  }

  changeOverrideAllUrls(baseUrl: string): void {
    this.methods.forEach(method => (method.settings.apiUrl = baseUrl));
    this.updateOverrideAll();
  }

  ngOnDestroy(): void {
    if (this._resetSubscription) {
      this._resetSubscription.unsubscribe();
      this._resetSubscription = undefined;
    }
  }

  forwardToRealChanged($event: MatCheckboxChange): void {
    if ($event.checked) {
      this.selectedMethod.settings.delay = 0;
      this.updateDelayAll();
    } else {
      this.selectedMethod.settings.delay = RANDOM_DELAY;
      this.updateDelayAll();
    }
  }

}
