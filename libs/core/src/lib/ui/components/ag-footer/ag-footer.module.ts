import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgFooterComponent } from "@shiptech/core/ui/components/ag-footer/ag-footer.component";
import { AgPagingModule } from "@shiptech/core/ui/components/ag-paging/ag-paging.module";

@NgModule({
  imports: [
    CommonModule,
    AgPagingModule
  ],
  declarations: [
    AgFooterComponent
  ],
  exports: [
    AgFooterComponent
  ]
})
export class AgFooterModule {
}
