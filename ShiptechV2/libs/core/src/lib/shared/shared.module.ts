import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlDecodeReadonly } from '@shiptech/core/pipes/htmlDecode/html-decode-readonly.pipe';
import { HtmlDecode } from '@shiptech/core/pipes/htmlDecode/html-decode.pipe';

@NgModule({
  declarations: [HtmlDecodeReadonly, HtmlDecode],
  imports: [
    CommonModule
  ],
  exports: [HtmlDecodeReadonly, HtmlDecode]
})
export class SharedModule { }
