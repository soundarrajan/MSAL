import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TitleService } from "@shiptech/core/services/title/title.service";

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [TitleService]
})
export class TitleModule {
}
