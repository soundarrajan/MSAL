import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { DocumentsGridViewModel } from "./view-model/documents-grid-view-model.service";
import { AppError } from "@shiptech/core/error-handling/app-error";
import { DOCUMENTS_MASTERS_API_SERVICE } from "@shiptech/core/services/masters-api/documents-api.service";
import { IDocumentsApiService } from "@shiptech/core/services/masters-api/documents-api.service.interface";
import { AppErrorHandler } from "@shiptech/core/error-handling/app-error-handler";
import { IDocumentsUpdateIsVerifiedRequest } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto";
import { IDocumentsDeleteRequest } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto";
import { IDocumentsUpdateNotesRequest } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto";

@Component({
  selector: "shiptech-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.scss"],
  providers: [DocumentsGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  private _entityId: number;
  private _entityName: string;

  get entityId(): number {
    return this._entityId;
  }

  get entityName(): string {
    return this._entityName;
  }

  @Input() set entityId(value: number) {
    this._entityId = value;
    this.gridViewModel.entityId = this.entityId;

    if (this.gridViewModel.isReady) {
      this.gridViewModel.gridOptions.api.purgeServerSideCache();
    }
  }

  @Input() set entityName(value: string) {
    this._entityName = value;
    this.gridViewModel.entityName = this.entityName;

    if (this.gridViewModel.isReady) {
      this.gridViewModel.gridOptions.api.purgeServerSideCache();
    }
  }

  constructor(public gridViewModel: DocumentsGridViewModel,
              @Inject(DOCUMENTS_MASTERS_API_SERVICE) private mastersApi: IDocumentsApiService,
              private appErrorHandler: AppErrorHandler) {
  }

  ngOnInit(): void {
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  updateIsVerifiedDocument(id: number, isVerified: boolean): void {
    const request: IDocumentsUpdateIsVerifiedRequest = {
      id,
      isVerified: !isVerified
    };
    this.mastersApi.updateIsVerifiedDocument(request).subscribe(
      response => {},
      () => {
        this.appErrorHandler.handleError(AppError.UpdateIsVerifiedDocumentFailed);
      },()=>{
        this.gridViewModel.gridOptions.api.purgeServerSideCache([]);
      });
  }

  updateNotesDocument(id: number, notes: string): void {
    const request: IDocumentsUpdateNotesRequest = {
      id,
      notes
    };
    this.mastersApi.updateNotesDocument(request).subscribe(
      response => {},
      () => {
        this.appErrorHandler.handleError(AppError.UpdateNotesDocumentFailed);
      },()=>{
        this.gridViewModel.gridOptions.api.purgeServerSideCache([]);
      });
  }
  deleteDocument(id: number): void{
    const request: IDocumentsDeleteRequest = {
      id
    };
    this.mastersApi.deleteDocument(request).subscribe(
      response => {},
      () => {
        this.appErrorHandler.handleError(AppError.DeleteDocumentFailed);
      },()=>{
        this.gridViewModel.gridOptions.api.purgeServerSideCache([]);
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
