import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shiptech/core/ui/material.module';
import { ToastrLogComponent } from '@shiptech/core/error-handling/toastr-log/toastr-log.component';
import { ToastrModule } from 'ngx-toastr';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { UIModule } from '@shiptech/core/ui/ui.module';

@NgModule({
  declarations: [ToastrLogComponent],
  providers: [{ provide: ErrorHandler, useClass: AppErrorHandler }],
  imports: [CommonModule, MaterialModule, UIModule, ToastrModule],
  entryComponents: [ToastrLogComponent]
})
export class AppErrorHandlingModule {
  constructor() {}
}
