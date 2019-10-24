import { ModuleWithProviders, NgModule } from '@angular/core';
import { USER_SETTINGS_API_SERVICE, UserSettingsApiService } from './user-settings/user-settings-api.service';
import { UserSettingsApiServiceMock } from './user-settings/user-settings-api.service.mock';
import { getDefaultStorage, PREFERENCE_STORAGE } from './preference-storage/preference-storage.interface';
import { environment } from '@shiptech/environment';
import {
  ENTITY_RELATED_LINKS_API,
  EntityRelatedLinksApi
} from '@shiptech/core/services/entity-related-links/api/entity-related-links-api';
import { EntityRelatedLinksApiMock } from '@shiptech/core/services/entity-related-links/api/entity-related-links-api.mock';
import {
  TENANT_SETTINGS_API,
  TenantSettingsApi
} from '@shiptech/core/services/tenant-settings/api/tenant-settings-api';
import { TenantSettingsApiMock } from '@shiptech/core/services/tenant-settings/api/tenant-settings-api.mock';
import { RouteReuseStrategy } from '@angular/router';
import { AppRouteReuseStrategy } from '../route/app-route-reuse.strategy';
import { ROUTES_TO_CACHE } from '@shiptech/core/route/routes-to-reuse.token';

@NgModule({
  imports: [],
  declarations: [],
  exports: []
})
export class AppServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppServicesModule,
      providers: [
        {
          provide: USER_SETTINGS_API_SERVICE,
          useClass: UserSettingsApiService // TODO: refactor into proper service and serviceApi the mock will use localStorage // environment.production ? UserSettingsApiService : UserSettingsApiServiceMock
        },
        UserSettingsApiService,
        UserSettingsApiServiceMock,
        {
          provide: PREFERENCE_STORAGE,
          useFactory: getDefaultStorage,
          deps: [USER_SETTINGS_API_SERVICE]
        },
        {
          provide: ENTITY_RELATED_LINKS_API,
          useClass: environment.production ? EntityRelatedLinksApi : EntityRelatedLinksApiMock
        },
        {
          provide: TENANT_SETTINGS_API,
          useClass: environment.production ? TenantSettingsApi : TenantSettingsApiMock
        },
        {
          provide: RouteReuseStrategy,
          useClass: AppRouteReuseStrategy
        },
        // Note: Providing ROUTES_TO_CACHE to avoid RouteReuseStrategy crash because of null token
        {
          provide: ROUTES_TO_CACHE,
          useValue: [],
          multi: true
        }
      ]
    };
  };
}
