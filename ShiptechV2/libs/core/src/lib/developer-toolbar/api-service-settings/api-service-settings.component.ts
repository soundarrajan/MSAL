import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { getApiCallUrlValue, IMethodApiCallSettings } from '@shiptech/core/utils/decorators/api-call.decorator';
import { RANDOM_DELAY } from '@shiptech/core/utils/decorators/api-call-settings';
import { Observable, Subscription } from 'rxjs';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { DeveloperToolbarService } from '@shiptech/core/developer-toolbar/developer-toolbar.service';
import { IApiService } from '@shiptech/core/developer-toolbar/api-service-settings/api-service.interface';
import { IApiServiceSettings } from '@shiptech/core/developer-toolbar/api-service-settings/api-service-settings.inteface';
import { ServiceStatusesEnum } from '@shiptech/core/developer-toolbar/api-service-settings/service-statuses.enum';
import {MatCheckboxChange} from "@angular/material/checkbox";

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
      this.devService.saveApiSettings(this.apiService.id, this.getCurrentSettingsForSaving());
    });
  }

  get persistSettings(): boolean {
    return this._persistSettings;
  }

  @Input()
  set persistSettings(value: boolean) {
    this._persistSettings = value;

    if (this.apiService) {
      this.devService.saveApiSettings(this.apiService.id, this.getCurrentSettingsForSaving());
    } else {
      if (this.apiService) {
        this.devService.deleteApiSettings(this.apiService.id);
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
      this.devService.deleteApiSettings(this.apiService.id);
    }

    const storedSettings = this.devService.getApiSettings(this.apiService.id);

    this.loadApiCallSettings();
    this.originalSettingsJson = JSON.stringify(this.getCurrentSettingsForSaving());

    this.applySettings(storedSettings);
    this.devService.saveApiSettings(this.apiService.id, this.getCurrentSettingsForSaving());
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

  constructor(private devService: DeveloperToolbarService) {
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

    this.devService.saveApiSettings(this.apiService.id, this.getCurrentSettingsForSaving());
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

    this.devService.saveApiSettings(this.apiService.id, this.getCurrentSettingsForSaving());
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

    this.devService.saveApiSettings(this.apiService.id, this.getCurrentSettingsForSaving());
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
      this.selectedDelayAll = this.methods.length > 0 && allSameDelay ? this.methods[0].settings.delay : undefined;
    }

    this.devService.saveApiSettings(this.apiService.id, this.getCurrentSettingsForSaving());
  }

  cannedResponseChanged(): void {
    this.devService.saveApiSettings(this.apiService.id, this.getCurrentSettingsForSaving());
  }

  /**
   * Loads all api call settings for services metadata
   */
  private loadApiCallSettings(): void {
    this.methods = this.devService.getApiCallMetadata(this.apiService.instance);
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

    this.devService.patchCallSettings(this.methods, settings.methodSettings);

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

    this.overrideAllUrls = this.methods.length > 0 && allSameValue ? this.methods[0].settings.apiUrl : undefined;
    this.devService.saveApiSettings(this.apiService.id, this.getCurrentSettingsForSaving());
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
