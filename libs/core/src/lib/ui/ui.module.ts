import { NgModule } from '@angular/core';
import { CopyToClipboardDirective } from './directives/copy-to-clipboard.directive';
import { AgGridExternalSearchDirective } from './directives/ag-external-search.directive';
import { MaterialModule } from './material.module';
import { LayoutMainModule } from '@shiptech/core/ui/layout/main/layout-main.module';
import { LayoutMainComponent } from '@shiptech/core/ui/layout/main/layout-main.component';

@NgModule({
  imports: [
    MaterialModule,
    LayoutMainModule,
  ],
  declarations: [
    CopyToClipboardDirective,
    AgGridExternalSearchDirective
  ],
  exports: [
    CopyToClipboardDirective,
    AgGridExternalSearchDirective,
    LayoutMainComponent
  ]
})
export class UIModule {
}
