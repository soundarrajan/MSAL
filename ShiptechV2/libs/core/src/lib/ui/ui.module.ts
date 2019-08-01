import { NgModule } from '@angular/core';
import { CopyToClipboardDirective } from './directives/copy-to-clipboard.directive';
import { AgGridExternalSearchDirective } from './directives/ag-external-search.directive';

@NgModule({
  declarations: [
    CopyToClipboardDirective,
    AgGridExternalSearchDirective
  ],
  exports: [
    CopyToClipboardDirective,
    AgGridExternalSearchDirective
  ]
})
export class UIModule {
}
