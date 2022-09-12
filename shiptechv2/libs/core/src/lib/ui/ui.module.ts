import { NgModule } from '@angular/core';
import { CopyToClipboardDirective } from './directives/copy-to-clipboard.directive';
import { AgGridExternalSearchDirective } from './directives/ag-external-search.directive';
import { MaterialModule } from './material.module';
import { LayoutMainModule } from '@shiptech/core/ui/layout/main/layout-main.module';
import { LayoutMainComponent } from '@shiptech/core/ui/layout/main/layout-main.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AutosizeDirective } from '@shiptech/core/ui/directives/autosize.directive';

@NgModule({
  imports: [
    MaterialModule,
    LayoutMainModule
  ],
  declarations: [
    CopyToClipboardDirective,
    AgGridExternalSearchDirective,
    AutosizeDirective
  ],
  exports: [
    CopyToClipboardDirective,
    AgGridExternalSearchDirective,
    AutosizeDirective,
    LayoutMainComponent,
    FlexLayoutModule
  ]
})
export class UIModule {}
