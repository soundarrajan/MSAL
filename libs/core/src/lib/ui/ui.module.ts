import { NgModule } from '@angular/core';
import { CopyToClipboardDirective } from './directives/copy-to-clipboard.directive';
import { AgGridExternalSearchDirective } from './directives/ag-external-search.directive';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    MaterialModule
  ],
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
