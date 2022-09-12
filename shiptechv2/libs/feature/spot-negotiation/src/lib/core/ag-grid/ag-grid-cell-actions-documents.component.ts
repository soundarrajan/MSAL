import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';

import { SpotNegotiationService } from '../../services/spot-negotiation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { IDocumentsDeleteRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { ModuleError } from '../../views/main/details/components/negotiation-documents/error-handling/module-error';
import { FileSaverService } from 'ngx-filesaver';
import { IDocumentsUpdateNotesRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto';

@Component({
  selector: 'ag-grid-cell-renderer',
  template: `
    <div *ngIf="params.type === 'row-remove-icon-with-checkbox'">
      <div class="remove-icon-with-checkbox" (click)="deleteDocument()"></div>
    </div>
    <div *ngIf="params.type === 'download'">
      <div class="download-icon" (click)="downloadDocument()"></div>
    </div>
    <div *ngIf="params.type === 'document-name-download'">
      <div (click)="downloadDocument()" matTooltip="{{ params.value }}">
        {{ params.value }}
      </div>
    </div>
    <div
      *ngIf="params.type === 'dashed-border-notes'"
      class="dashed-border-note"
    >
      <div class="dashed-border-notes">
        <input
          matInput
          [(ngModel)]="docNotes"
          matTooltip="{{ docNotes }}"
          autocomplete="off"
          (blur)="updateNotes()"
        />
      </div>
    </div>
  `
})
export class AGGridCellActionsDocumentsComponent
  implements ICellRendererAngularComp {
  docNotes: string;
  public params: any;
  public popupOpen: boolean;
  constructor(
    private _FileSaverService: FileSaverService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public router: Router,
    public dialog: MatDialog,
    private spotNegotiationService: SpotNegotiationService,
    private confirmationService: ConfirmationService,
    private appErrorHandler: AppErrorHandler
  ) {}

  agInit(params: any): void {
    this.params = params;
    if (this.params.type === 'dashed-border-notes') {
      this.docNotes = this.params.data?.notes;
    }
  }

  refresh(): boolean {
    return false;
  }

  deleteDocument(): void {
    let rowData = this.params.node.data;
    let id = this.params.node.data.id;
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to delete the document ?',
      accept: () => {
        const request: IDocumentsDeleteRequest = { id };
        this.spotNegotiationService.deleteDocument(request).subscribe(
          () => {
            this.toastr.success('Delete done');
            this.params.api.applyTransaction({ remove: [rowData] });
          },
          () => {
            this.appErrorHandler.handleError(ModuleError.DeleteDocumentFailed);
          }
        );
      }
    });
  }

  downloadDocument(): void {
    let id = this.params.node.data.id;
    let name = this.params.node.data.name;
    const request = {
      Payload: { Id: id }
    };
    this.spinner.show();
    this.spotNegotiationService.downloadDocument(request).subscribe(
      response => {
        this.spinner.hide();
        this._FileSaverService.save(response, name);
      },
      () => {
        this.spinner.hide();
        this.appErrorHandler.handleError(ModuleError.DocumentDownloadError);
      }
    );
  }

  updateNotes(): void {
    if (this.params.node.data.notes !== this.docNotes) {
      let id = this.params.node.data.id;
      const request: IDocumentsUpdateNotesRequest = {
        id: id,
        notes: this.docNotes
      };
      let rowData = this.params.node.data;
      rowData.notes = this.docNotes;
      this.spinner.show();
      this.spotNegotiationService.updateNotes(request).subscribe(
        response => {
          this.spinner.hide();
          this.params.api.applyTransaction({ update: [rowData] });
          this.toastr.success('Successfully updated note');
        },
        () => {
          this.spinner.hide();
          this.appErrorHandler.handleError(
            ModuleError.UpdateNotesDocumentFailed
          );
        }
      );
    }
  }
}
