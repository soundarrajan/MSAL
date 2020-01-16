import {ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Subject} from "rxjs";
import {DocumentsGridViewModel} from "./view-model/documents-grid-view-model.service";
import {AppError} from "@shiptech/core/error-handling/app-error";
import {DOCUMENTS_API_SERVICE} from "@shiptech/core/services/masters-api/documents-api.service";
import {IDocumentsApiService} from "@shiptech/core/services/masters-api/documents-api.service.interface";
import {AppErrorHandler} from "@shiptech/core/error-handling/app-error-handler";
import {IDocumentsUpdateIsVerifiedRequest} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto";
import {IDocumentsDeleteRequest} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto";
import {IDocumentsUpdateNotesRequest} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto";
import {FileUpload} from "primeng/fileupload";
import {IDisplayLookupDto} from "@shiptech/core/lookups/display-lookup-dto.interface";
import {IDocumentsCreateUploadRequest} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-create-upload.dto";

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
  private selectedDocumentType: IDisplayLookupDto;

  @ViewChild('uploadComponent', {static: false}) uploadedFiles: FileUpload;


  get entityId(): number {
    return this._entityId;
  }

  get entityName(): string {
    return this._entityName;
  }

  @Input() set entityId(value: number) {
    this._entityId = value;
    this.gridViewModel.entityId = this.entityId;
  }

  @Input() set entityName(value: string) {
    this._entityName = value;
    this.gridViewModel.entityName = this.entityName;
  }

  constructor(public gridViewModel: DocumentsGridViewModel,
              @Inject(DOCUMENTS_API_SERVICE) private mastersApi: IDocumentsApiService,
              private appErrorHandler: AppErrorHandler) {
  }

  ngOnInit(): void {
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  uploadFile(event: FileUpload): void {
    console.log("on custom upload", event);
    if (!this.selectedDocumentType) {
      this.appErrorHandler.handleError(AppError.DocumentTypeNotSelected);
      this.clearUploadedFiles();
    } else {
      const request: FormData =
      {
        // file: event.files[0],
        // request: {
        //   name: event.files[0].name,
        //   documentType: this.selectedDocumentType,
        //   size: event.files[0].size,
        //   fileType: event.files[0].type,
        //   transactionType: {
        //     id: this.entityId,
        //     name: this.entityName
        //   }
        // }
      }
      this.mastersApi.uploadFile(request).subscribe(() => {

      }, () => {
        this.appErrorHandler.handleError(AppError.UploadDocumentFailed);
        this.clearUploadedFiles();
      }, () => {
        this.gridViewModel.gridOptions.api.purgeServerSideCache([]);
      })
    }
  }

  documentTypeSelection(event: IDisplayLookupDto): void {
    this.selectedDocumentType = event;
  }

  checkDocumentTypeSelected(): boolean {
    return Object.values(this.selectedDocumentType).every((value: string | number) => value);
  }

  clearUploadedFiles(): void {
    this.uploadedFiles.clear();
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
      () => {
      },
      () => {
        this.appErrorHandler.handleError(AppError.UpdateIsVerifiedDocumentFailed);
      }, () => {
        this.gridViewModel.gridOptions.api.purgeServerSideCache([]);
      });
  }

  updateNotesDocument(id: number, notes: string): void {
    const request: IDocumentsUpdateNotesRequest = {
      id,
      notes
    };
    this.mastersApi.updateNotesDocument(request).subscribe(
      () => {
      },
      () => {
        this.appErrorHandler.handleError(AppError.UpdateNotesDocumentFailed);
      }, () => {
        this.gridViewModel.gridOptions.api.purgeServerSideCache([]);
      });
  }

  deleteDocument(id: number): void {
    const request: IDocumentsDeleteRequest = {
      id
    };
    this.mastersApi.deleteDocument(request).subscribe(
      response => {
      },
      () => {
        this.appErrorHandler.handleError(AppError.DeleteDocumentFailed);
      }, () => {
        this.gridViewModel.gridOptions.api.purgeServerSideCache([]);
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
