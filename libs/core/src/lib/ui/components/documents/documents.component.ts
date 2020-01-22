import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { DocumentsGridViewModel } from "./view-model/documents-grid-view-model.service";
import { DOCUMENTS_API_SERVICE } from "@shiptech/core/services/masters-api/documents-api.service";
import { IDocumentsApiService } from "@shiptech/core/services/masters-api/documents-api.service.interface";
import { AppErrorHandler } from "@shiptech/core/error-handling/app-error-handler";
import { IDocumentsUpdateIsVerifiedRequest } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto";
import { IDocumentsDeleteRequest } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto";
import { ConfirmationService, DialogService } from "primeng/primeng";
import { IDocumentsItemDto } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto";
import { DocumentViewEditNotesComponent } from "@shiptech/core/ui/components/documents/document-view-edit-notes/document-view-edit-notes.component";
import { FileUpload } from "primeng/fileupload";
import { IDisplayLookupDto } from "@shiptech/core/lookups/display-lookup-dto.interface";
import { IDocumentsCreateUploadRequest } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-create-upload.dto";
import { ToastrService } from "ngx-toastr";
import { DocumentsAutocompleteComponent } from "@shiptech/core/ui/components/master-autocomplete/known-masters/documents/documents-autocomplete.component";
import { FileSaverService } from "ngx-filesaver";
import { ModuleError } from "@shiptech/core/ui/components/documents/error-handling/module-error";
import { values } from "lodash";

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

  @ViewChild("uploadComponent", { static: false }) uploadedFiles: FileUpload;
  @ViewChild("documentsAutoComplete", { static: false }) inputAutoComplete: DocumentsAutocompleteComponent;


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
              private appErrorHandler: AppErrorHandler,
              private toastrService: ToastrService,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService,
              private _FileSaverService: FileSaverService
  ) {
  }

  ngOnInit(): void {
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  uploadFile(event: FileUpload): void {
    if (!this.selectedDocumentType || !this.checkDocumentTypeSelected()) {
      this.appErrorHandler.handleError(ModuleError.DocumentTypeNotSelected);
      this.clearUploadedFiles();
    } else {
      const requestPayload: IDocumentsCreateUploadRequest = {
        Payload: {
          name: event.files[0].name,
          documentType: this.selectedDocumentType,
          size: event.files[0].size,
          fileType: event.files[0].type,
          referenceNo: this.entityId,
          transactionType: {
            id: 0,
            name: this.entityName
          }
        }
      };
      const formRequest: FormData = new FormData();
      formRequest.append("file", event.files[0]);
      formRequest.append("request", JSON.stringify(requestPayload));
      this.mastersApi.uploadFile(formRequest).subscribe(() => {
        this.toastrService.success("Document saved !");
      }, () => {
        this.appErrorHandler.handleError(ModuleError.UploadDocumentFailed);
        this.clearUploadedFiles();
        this.inputAutoComplete.resetInputSelection();
      }, () => {
        this.gridViewModel.gridOptions.api.purgeServerSideCache([]);
        this.clearUploadedFiles();
        this.inputAutoComplete.resetInputSelection();
      });
    }
  }

  checkDocumentTypeSelected(): boolean {
    return values(this.selectedDocumentType).every((value: string | number) => value);
  }

  documentTypeSelection(event: IDisplayLookupDto): void {
    this.selectedDocumentType = event;
  }

  clearUploadedFiles(): void {
    this.uploadedFiles.clear();
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  downloadDocument(id: number, name: string): void {
    const request = {
      Payload: id
    };
    this.mastersApi.downloadDocument(request).subscribe((response) => {
      this._FileSaverService.save(response, name);
    }, () => {
      this.appErrorHandler.handleError(ModuleError.DocumentDownloadError);
    });
  }

  updateIsVerifiedDocument(item: IDocumentsItemDto, isChecked: boolean): void {
    const request: IDocumentsUpdateIsVerifiedRequest = {
      id: item.id,
      isVerified: isChecked
    };
    this.mastersApi.updateIsVerifiedDocument(request).subscribe(
      () => {
      },
      () => {
        this.appErrorHandler.handleError(ModuleError.UpdateIsVerifiedDocumentFailed);
        item.isVerified = !isChecked;
        this.gridViewModel.gridOptions.api.getRowNode(item.id.toString(10)).setData(item);
        this.gridViewModel.gridOptions.api.redrawRows({ rowNodes: [this.gridViewModel.gridOptions.api.getRowNode(item.id.toString(10))] });
      });
  }

  updateNotesDocument(item: IDocumentsItemDto): void {
    const ref = this.dialogService.open(DocumentViewEditNotesComponent, {
      data: item,
      width: "580px",
      showHeader: true,
      header: "Comments"
    });
    ref.onClose.subscribe((newItem: IDocumentsItemDto) => {
      if (newItem) {
        this.gridViewModel.gridOptions.api.getRowNode(newItem.id.toString(10)).setData(newItem);
      }
    });
  }

  deleteDocument(id: number): void {
    this.confirmationService.confirm({
      header: "Confirm",
      message: "Are you sure you want to delete the document ?",
      accept: () => {
        const request: IDocumentsDeleteRequest = { id };
        this.mastersApi.deleteDocument(request).subscribe(
          () => {
            this.gridViewModel.gridOptions.api.purgeServerSideCache([]);
          },
          () => {
            this.appErrorHandler.handleError(ModuleError.DeleteDocumentFailed);
          });
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
