import { ChangeDetectionStrategy, Component, Inject, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-confirmation-pop-up',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent implements OnInit {
  title: string = 'Confirm';
  message: string = 'Do you want to confirm this action?';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private domSanitizer: DomSanitizer, public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {}

  ngOnInit(): void {
    if (this.data) {
      this.title = this.data.title;
      this.message = this.domSanitizer.sanitize(SecurityContext.HTML, this.data.message) || 'Invalid message';
    }
  }

  closePopUp(): any {
    this.dialogRef.close();
  }

  confirm(value: boolean): void {
    this.dialogRef.close(value);
  }
}
