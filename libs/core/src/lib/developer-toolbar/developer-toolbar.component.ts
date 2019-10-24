import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import {
  DEV_SETTINGS_STORAGE_PREFIX,
  ServiceStatusesEnum
} from './api-service-settings/api-service-settings.component';
import { ApiServiceModel } from './api-service.model';
import { Router } from '@angular/router';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { UserSettingsApiServiceMock } from '@shiptech/core/services/user-settings/user-settings-api.service.mock';
import { DeveloperToolbarService } from '@shiptech/core/developer-toolbar/developer-toolbar.service';
import { EntityRelatedLinksApiMock } from '@shiptech/core/services/entity-related-links/api/entity-related-links-api.mock';
import { AppConfig } from '@shiptech/core';
import { UserSettingsApiService } from '@shiptech/core/services/user-settings/user-settings-api.service';
import { EntityRelatedLinksService } from '@shiptech/core/services/entity-related-links/entity-related-links.service';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { TenantSettingsApiMock } from '@shiptech/core/services/tenant-settings/api/tenant-settings-api.mock';

@Component({
  selector: 'app-developer-toolbar',
  templateUrl: './developer-toolbar.component.html',
  styleUrls: ['./developer-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeveloperToolbarComponent implements OnInit, OnDestroy {
  apiServices: ApiServiceModel[];
  reset$ = new Subject();
  displayedServiceIndex: number = 0;

  keepSettings: boolean;
  private _destroy$ = new Subject();
  private devApiBase;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private router: Router,
    private devService: DeveloperToolbarService,
    private userSettingsApiServiceMock: UserSettingsApiServiceMock,
    private entityRelatedLinksApiMock: EntityRelatedLinksApiMock,
    private tenantSettingsApiMock: TenantSettingsApiMock,
    private appConfig: AppConfig
  ) {

    this.devService.apiServices$.pipe(
      tap(services => this.apiServices = services),
      takeUntil(this._destroy$)
    ).subscribe();

    this.devService.registerApi(
      {
        id: UserSettingsApiService.name,
        displayName: 'User Settings Api',
        instance: this.userSettingsApiServiceMock,
        isRealService: false,
        localApiUrl: 'http://localhost:44398',
        devApiUrl: this.appConfig.userSettingsApi,
        qaApiUrl: this.appConfig.userSettingsApi
      });

    this.devService.registerApi(
      {
        id: EntityRelatedLinksService.name,
        displayName: 'Entity Related Links Service',
        instance: this.entityRelatedLinksApiMock,
        isRealService: false,
        localApiUrl: 'http://localhost:44398',
        devApiUrl: this.appConfig.v1.API.BASE_URL_DATA_INFRASTRUCTURE,
        qaApiUrl: this.appConfig.v1.API.BASE_URL_DATA_INFRASTRUCTURE
      });

    this.devService.registerApi(
      {
        id: TenantSettingsService.name,
        displayName: 'Tenant Settings Service',
        instance: this.tenantSettingsApiMock,
        isRealService: false,
        localApiUrl: 'http://localhost:44398',
        devApiUrl: this.appConfig.v1.API.BASE_URL_DATA_ADMIN,
        qaApiUrl: this.appConfig.v1.API.BASE_URL_DATA_ADMIN
      });

    this.keepSettings = Object.keys(sessionStorage).filter(key => key.startsWith(DEV_SETTINGS_STORAGE_PREFIX)).length > 0;
  }

  ngOnInit(): void {
  }

  /**
   * Adds current dev settings in Storage or removes it.
   * @param checkboxChange
   */
  changeKeepSettings(value: boolean): void {
    this.keepSettings = value;

    if (!value) {
      Object.keys(sessionStorage)
        .filter(key => key.startsWith(DEV_SETTINGS_STORAGE_PREFIX))
        .forEach(key => sessionStorage.removeItem(key));
    }
  }

  // /**
  //  * Reset settings to original settings when component loaded. Usually these are the actual settings set via @ApiCall decorator
  //  */
  public resetSettings(): void {
    this.reset$.next();
  }

  public purgePreferences(): void {
    this.userSettingsApiServiceMock
      .removeAll()
      .pipe(finalize(() => window.location.reload()))
      .subscribe();
  }

  public openDialog(content: TemplateRef<any>): void {
    this.dialog.open(content, {
      height: '700px',
      width: '1000px'
    });
  }

  allUseReal(): boolean {
    return this.apiServices.filter(s => !!s.component).every(s => s.component.getServiceStatus() === ServiceStatusesEnum.Real);
  }

  refreshRoute(): void {
    const currentRoute = this.router.url;

    if (currentRoute === '/') {
      return;
    }

    this.router.navigateByUrl('/').then(() => {
      setTimeout(() => {
        this.router.navigateByUrl(currentRoute);
      }, 500);
    });
  }

  ngOnDestroy(): void {
    this.reset$.complete();
    this._destroy$.next();
    this._destroy$.complete();
  }
}
