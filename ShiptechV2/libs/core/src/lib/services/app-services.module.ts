import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  USER_SETTINGS_API_SERVICE,
  UserSettingsApiService
} from './user-settings/user-settings-api.service';
import {
  getDefaultStorage,
  PREFERENCE_STORAGE
} from './preference-storage/preference-storage.interface';
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
import {
  USER_PROFILE_API,
  UserProfileApi
} from '@shiptech/core/services/user-profile/api/user-profile-api.service';
import { UserProfileApiMock } from '@shiptech/core/services/user-profile/api/user-profile-api-mock.service';
import { VesselMastersApiMock } from '@shiptech/core/services/masters-api/vessel-masters-api.service.mock';
import { VESSEL_MASTERS_API_SERVICE } from '@shiptech/core/services/masters-api/vessel-masters-api.service.interface';
import { VesselMastersApi } from '@shiptech/core/services/masters-api/vessel-masters-api.service';
import { UserSettingsApiServiceMock } from '@shiptech/core/services/user-settings/user-settings-api.service.mock';
import {
  EMAIL_LOGS_API_SERVICE,
  EmailLogsApi
} from '@shiptech/core/services/masters-api/email-logs-api.service';
import {
  AUDIT_LOG_API_SERVICE,
  AuditLogApi
} from '@shiptech/core/services/admin-api/audit-log-api.service';
import { AuditLogApiMock } from '@shiptech/core/services/admin-api/audit-log-api.service.mock';
import { EmailLogsApiMock } from './masters-api/email-logs-api.service.mock';
import {
  DOCUMENTS_API_SERVICE,
  DocumentsApi
} from '@shiptech/core/services/masters-api/documents-api.service';
import { DocumentsApiMock } from '@shiptech/core/services/masters-api/documents-api.service.mock';
import {
  EXPORT_API_SERVICE,
  ExportApiService
} from '@shiptech/core/ui/components/export/api/export-api.service';
import { ExportApiServiceMock } from '@shiptech/core/ui/components/export/api/export-api.service.mock';
import {
  APP_INSIGHTS_SERVICE,
  MyMonitoringService
} from './app-insights/logging.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: []
})
export class AppServicesModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: AppServicesModule,
      providers: [
        {
          provide: USER_SETTINGS_API_SERVICE,
          useClass: environment.production
            ? UserSettingsApiService
            : UserSettingsApiServiceMock
        },
        {
          provide: PREFERENCE_STORAGE,
          useFactory: getDefaultStorage,
          deps: [USER_SETTINGS_API_SERVICE]
        },
        {
          provide: ENTITY_RELATED_LINKS_API,
          useClass: environment.production
            ? EntityRelatedLinksApi
            : EntityRelatedLinksApiMock
        },
        {
          provide: TENANT_SETTINGS_API,
          useClass: environment.production
            ? TenantSettingsApi
            : TenantSettingsApiMock
        },
        {
          provide: USER_PROFILE_API,
          useClass: environment.production ? UserProfileApi : UserProfileApiMock
        },
        {
          provide: VESSEL_MASTERS_API_SERVICE,
          useClass: environment.production
            ? VesselMastersApi
            : VesselMastersApiMock
        },
        {
          provide: EMAIL_LOGS_API_SERVICE,
          useClass: environment.production ? EmailLogsApi : EmailLogsApiMock
        },
        {
          provide: AUDIT_LOG_API_SERVICE,
          useClass: environment.production ? AuditLogApi : AuditLogApiMock
        },
        {
          provide: DOCUMENTS_API_SERVICE,
          useClass: environment.production ? DocumentsApi : DocumentsApiMock
        },
        {
          provide: EXPORT_API_SERVICE,
          useClass: environment.production ? ExportApiService : ExportApiService
        },
        {
          provide: APP_INSIGHTS_SERVICE,
          useClass: environment.production
            ? MyMonitoringService
            : MyMonitoringService
        },
        // {
        //   provide: RouteReuseStrategy,
        //   useClass: AppRouteReuseStrategy
        // },
        // Note: Providing/Initializing ROUTES_TO_CACHE to avoid RouteReuseStrategy crash because of null token
        {
          provide: ROUTES_TO_CACHE,
          useValue: [],
          multi: true
        }
      ]
    };
  }
}
