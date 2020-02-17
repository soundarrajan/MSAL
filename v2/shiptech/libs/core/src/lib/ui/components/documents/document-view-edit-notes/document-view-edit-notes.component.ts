import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { IDocumentsUpdateNotesRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto';
import { ModuleError } from '@shiptech/core/ui/components/documents/error-handling/module-error';
import { DOCUMENTS_API_SERVICE } from '@shiptech/core/services/masters-api/documents-api.service';
import { IDocumentsApiService } from '@shiptech/core/services/masters-api/documents-api.service.interface';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { ToastrService } from 'ngx-toastr';
import { IDocumentsItemDto } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'shiptech-document-view-edit-notes',
  templateUrl: './document-view-edit-notes.component.html',
  styleUrls: ['./document-view-edit-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentViewEditNotesComponent implements OnInit {
  public isReadOnly: boolean;
  data: IDocumentsItemDto;
  notes: string;

  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    @Inject(DOCUMENTS_API_SERVICE) private mastersApi: IDocumentsApiService,
    private appErrorHandler: AppErrorHandler,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.data = this.config.data;
    this.notes = this.config.data.notes;
    this.isReadOnly = false;
  }

  save(): void {
    if (this.notes !== this.data.notes) {
      this.isReadOnly = true;
      this.data.notes = this.notes;
      const request: IDocumentsUpdateNotesRequest = {
        id: this.data.id,
        notes: this.data.notes
      };
      this.mastersApi.updateNotesDocument(request).subscribe(
        () => {
          this.isReadOnly = false;
          this.toastrService.success('Successfully updated note');
          this.dialogRef.close(this.data);
        },
        () => {
          this.appErrorHandler.handleError(
            ModuleError.UpdateNotesDocumentFailed
          );
          this.dialogRef.close(this.data);
        }
      );
    } else {
      this.dialogRef.close(this.data);
    }
  }
}
