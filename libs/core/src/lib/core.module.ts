import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCoreModule } from './modules/app-core.module';
import { CopyToClipboardDirective } from './ui/directives/copy-to-clipboard.directive';

@NgModule({
  imports: [
    CommonModule,
    AppCoreModule
  ],
  declarations: [CopyToClipboardDirective],
  exports: [
    AppCoreModule,
    CopyToClipboardDirective
  ]
})
export class CoreModule {}
