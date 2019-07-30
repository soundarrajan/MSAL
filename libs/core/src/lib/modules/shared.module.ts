import { NgModule } from '@angular/core';
import { CopyToClipboardDirective } from '@shiptech/core';

@NgModule({
  declarations: [
    CopyToClipboardDirective
  ],
  exports: [
    CopyToClipboardDirective
  ]
})
export class SharedModule {
}
