import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyToClipboardDirective } from './directives/copy-to-clipboard.directive';
import { AgGridExternalSearchDirective } from './directives/ag-external-search.directive';
import { MaterialModule } from './material.module';
import { LayoutMainModule } from '@shiptech/core/ui/layout/main/layout-main.module';
import { LayoutMainComponent } from '@shiptech/core/ui/layout/main/layout-main.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AutosizeDirective } from '@shiptech/core/ui/directives/autosize.directive';
import { TwoDigitDecimaNumberDirective } from '@shiptech/core/ui/directives/two-digit-decimal-number.directive';

@NgModule({
  imports: [
    MaterialModule,
    LayoutMainModule,
    CommonModule
  ],
  declarations: [
    CopyToClipboardDirective,
    AgGridExternalSearchDirective,
    AutosizeDirective,
    TwoDigitDecimaNumberDirective
  ],
  exports: [
    CopyToClipboardDirective,
    AgGridExternalSearchDirective,
    AutosizeDirective,
    TwoDigitDecimaNumberDirective,
    LayoutMainComponent,
    FlexLayoutModule
  ]
})
export class UIModule {}
