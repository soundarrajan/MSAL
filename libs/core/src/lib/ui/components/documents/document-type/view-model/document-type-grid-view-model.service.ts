import {IDocumentsItemDto} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto";
import {ChangeDetectorRef, Inject, Injectable} from "@angular/core";
import {BaseGridViewModel} from "@shiptech/core/ui/components/ag-grid/base.grid-view-model";
import {AgColumnPreferencesService} from "@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service";
import {LoggerFactory} from "@shiptech/core/logging/logger-factory.service";
import {TenantFormattingService} from "@shiptech/core/services/formatting/tenant-formatting.service";
import {DOCUMENTS_API_SERVICE} from "@shiptech/core/services/masters-api/documents-api.service";
import {IDocumentsApiService} from "@shiptech/core/services/masters-api/documents-api.service.interface";
import {AppErrorHandler} from "@shiptech/core/error-handling/app-error-handler";

function model(prop: keyof IDocumentsItemDto): keyof IDocumentsItemDto {
  return prop;
}

@Injectable()
export class DocumentTypeGridViewModel extends BaseGridViewModel {
  constructor(columnPreferences: AgColumnPreferencesService,
              changeDetector: ChangeDetectorRef,
              loggerFactory: LoggerFactory,
              private format: TenantFormattingService,
              @Inject(DOCUMENTS_API_SERVICE) private documentsApi: IDocumentsApiService,
              private appErrorHandler: AppErrorHandler) {
    super("documents-grid", columnPreferences, changeDetector, loggerFactory.createLogger(DocumentTypeGridViewModel.name));
  }
}
