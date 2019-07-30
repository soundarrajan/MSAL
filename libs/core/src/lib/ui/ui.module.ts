import { NgModule } from '@angular/core';
import { CopyToClipboardDirective } from './directives/copy-to-clipboard.directive';

@NgModule({
  declarations: [
    CopyToClipboardDirective
  ],
  exports: [
    CopyToClipboardDirective
  ]
})
export class UIModule {
}
