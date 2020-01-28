import { NgModule } from "@angular/core";
import { BreadcrumbComponent } from "./breadcrumbs.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { PrimeNGModule } from "../../primeng.module";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({

  declarations: [
    BreadcrumbComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    PrimeNGModule,
    FlexLayoutModule
  ],
  exports: [BreadcrumbComponent]
})
export class BreadcrumbsModule {
  constructor() {
  }

}

