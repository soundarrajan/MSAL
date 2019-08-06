import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from '@shiptech/core/ui/components/message-box/dialog/alert-pop-up/alert-dialog.component';
import { ConfirmationDialogComponent } from '@shiptech/core/ui/components/message-box/dialog/confirmation-pop-up/confirmation-dialog.component';
import { DefaultDialogComponent } from '@shiptech/core/ui/components/message-box/dialog/default-pop-up/default-dialog.component';
import { MessageBoxService } from '@shiptech/core/ui/components/message-box/message-box.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    AlertDialogComponent,
    ConfirmationDialogComponent,
    DefaultDialogComponent
  ],
  providers: [
    MessageBoxService
  ],
  exports: [
    AlertDialogComponent,
    ConfirmationDialogComponent,
    DefaultDialogComponent
  ],
  entryComponents: [
    AlertDialogComponent,
    ConfirmationDialogComponent,
    DefaultDialogComponent
  ]
})
export class MessageBoxModule {
}
