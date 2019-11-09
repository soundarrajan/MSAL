import { ModuleWithProviders, NgModule } from '@angular/core';
import { USER_SETTINGS_API_SERVICE, UserSettingsApiService } from './user-settings/user-settings-api.service';
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
} from '@shiptech/core/services/tenant-settings/api/tenant-settings-api.service';
import { TenantSettingsApiMock } from '@shiptech/core/services/tenant-settings/api/tenant-settings-api-mock.service';
import { RouteReuseStrategy } from '@angular/router';
import { AppRouteReuseStrategy } from '../route/app-route-reuse.strategy';
import { ROUTES_TO_CACHE } from '@shiptech/core/route/routes-to-reuse.token';
import { USER_PROFILE_API, UserProfileApi } from '@shiptech/core/services/user-profile/api/user-profile-api.service';
import { UserProfileApiMock } from '@shiptech/core/services/user-profile/api/user-profile-api-mock.service';
import { LOOKUPS_API_SERVICE, LookupsApiService } from '@shiptech/core/services/lookups-api/lookups-api.service';
import { LookupsApiServiceMock } from '@shiptech/core/services/lookups-api/lookups-api.service.mock';

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
          provide: USER_PROFILE_API,
          useClass: environment.production ? UserProfileApi : UserProfileApiMock
        },
        {
          provide: LOOKUPS_API_SERVICE,
          useClass: environment.production ? LookupsApiService : LookupsApiServiceMock
        },
        {
          provide: RouteReuseStrategy,
          useClass: AppRouteReuseStrategy
        },
        // Note: Providing/Initializing ROUTES_TO_CACHE to avoid RouteReuseStrategy crash because of null token
        {
          provide: ROUTES_TO_CACHE,
          useValue: [],
          multi: true
        }
      ]
    };
  };
}
