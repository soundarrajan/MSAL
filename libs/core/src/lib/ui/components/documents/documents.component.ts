import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { DocumentsGridViewModel } from "./view-model/documents-grid-view-model.service";
import { AppError } from "@shiptech/core/error-handling/app-error";
import { DOCUMENTS_API_SERVICE } from "@shiptech/core/services/masters-api/documents-api.service";
import { IDocumentsApiService } from "@shiptech/core/services/masters-api/documents-api.service.interface";
import { AppErrorHandler } from "@shiptech/core/error-handling/app-error-handler";
import { IDocumentsUpdateIsVerifiedRequest } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto";
import { IDocumentsDeleteRequest } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto";
import { ConfirmationService, DialogService } from "primeng/primeng";
import { IDocumentsItemDto } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto";
import { DocumentViewEditNotesComponent } from "@shiptech/core/ui/components/documents/document-view-edit-notes/document-view-edit-notes.component";
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
  }

  @Input() set entityName(value: string) {
    this._entityName = value;
    this.gridViewModel.entityName = this.entityName;
  }

  constructor(public gridViewModel: DocumentsGridViewModel,
              @Inject(DOCUMENTS_API_SERVICE) private mastersApi: IDocumentsApiService,
              private appErrorHandler: AppErrorHandler,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  downloadDocument(id: number): void{
    window.open(this.mastersApi.downloadDocument(id));
  }

  updateIsVerifiedDocument(item: IDocumentsItemDto, isChecked: boolean): void {
    const request: IDocumentsUpdateIsVerifiedRequest = {
      id: item.id,
      isVerified: isChecked
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
    const ref = this.dialogService.open(DocumentViewEditNotesComponent, {
      data: {
        comment: notes
      },
      width: '580px',
      showHeader: true,
      header: 'Comments',
    });
    ref.onClose.subscribe((comment: string) => {
        console.log(comment);
        if(comment && comment !== notes){
          const request: IDocumentsUpdateNotesRequest = {
            id,
            notes: comment
          };
          this.mastersApi.updateNotesDocument(request).subscribe(
            response => {},
            () => {
              this.appErrorHandler.handleError(AppError.UpdateNotesDocumentFailed);
            },()=>{
              this.gridViewModel.gridOptions.api.purgeServerSideCache([]);
            });
        }
    });

  }

  deleteDocument(id: number): void{
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to delete the document ?',
      accept: () => {
        const request: IDocumentsDeleteRequest = { id };
        this.mastersApi.deleteDocument(request).subscribe(
          response => {},
          () => {
            this.appErrorHandler.handleError(AppError.DeleteDocumentFailed);
          },()=>{
            this.gridViewModel.gridOptions.api.purgeServerSideCache([]);
          });
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
