import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Select, Store } from '@ngxs/store';
import {
  SelectSeller,
  EditLocationRow
} from '../../store/actions/ag-grid-row.action';
import { SpotNegotiationService } from '../../services/spot-negotiation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { IDocumentsDeleteRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { ModuleError } from '../../views/main/details/components/negotiation-documents/error-handling/module-error';
// import { ChangeLogPopupComponent } from '../dialog-popup/change-log-popup/change-log-popup.component';

// Not found
// import { OperationalAmountDialog } from 'src/app/movements/popup-screens/operational-amount.component';

@Component({
  selector: 'ag-grid-cell-renderer',
  template: `
    <div *ngIf="params.type === 'row-remove-icon-with-checkbox'">
      <div class="remove-icon-with-checkbox" (click)="deleteDocument()"></div>
    </div>
    <div *ngIf="params.type === 'download'">
      <div class="download-icon"></div>
    </div>
    <div *ngIf="params.type === 'checkbox-selection'">
      <mat-checkbox
        class="grid-checkbox test22"
        [checked]="params.value"
        (click)="selectCounterParties(params)"
      ></mat-checkbox>
    </div>
  `
})
export class AGGridCellActionsDocumentsComponent
  implements ICellRendererAngularComp {
  public params: any;
  public popupOpen: boolean;
  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public router: Router,
    public dialog: MatDialog,
    private store: Store,
    private changeDetector: ChangeDetectorRef,
    private spotNegotiationService: SpotNegotiationService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private appErrorHandler: AppErrorHandler
  ) {}

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  deleteDocument(): void {
    let rowData = [];
    this.params.api.forEachNode(node => rowData.push(node.data));
    const index = this.params.node.rowIndex;
    let id = this.params.node.data.id;
    let newData = [];
    newData = rowData.splice(index, 1);
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to delete the document ?',
      accept: () => {
        const request: IDocumentsDeleteRequest = { id };
        this.spotNegotiationService.deleteDocument(request).subscribe(
          () => {
            this.toastr.success('Delete done');
            this.params.api.applyTransaction({ remove: newData });
          },
          () => {
            this.appErrorHandler.handleError(ModuleError.DeleteDocumentFailed);
          }
        );
      }
    });
  }

  navigateTo(e) {
    this.params.onClick(this.params);
  }
}
