import {
  ChangeDetectionStrategy,
  Component,
  Inject
} from '@angular/core';
import _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Optional } from '@ag-grid-enterprise/all-modules';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

@Component({
  selector: 'remove-counterparty-confirmation',
  templateUrl: './remove-counterparty-confirmation.html',
  styleUrls: ['./remove-counterparty-confirmation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoveCounterpartyComponent {
  constructor(
    public format: TenantFormattingService,
    public dialogRef: MatDialogRef<RemoveCounterpartyComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeClick(): void {
    this.dialogRef.close();
  }
  confirm(value: boolean): void {
    this.dialogRef.close(value);
  }
}
