import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmailTemplatePageModule} from 'email-template-editor-ckeditor';
import {ModuleLoggerFactory} from "../../../quantity-control/src/lib/core/logging/module-logger-factory";
import {environment} from "@shiptech/environment";
import {EteModuleResolver} from "./ete-route.resolver";
import {ETE_API_SERVICE, EteApi} from './services/api/ete-api.service';
import {EteApiMock} from './services/api/ete-api-mock.service';
import {MainEteComponent} from "./views/main-ete.component";
import {EteEditComponent} from "./views/ete-edit/ete-edit.component";
import {EteRoutingModule} from "./ete-routing.module";
import {UIModule} from "@shiptech/core/ui/ui.module";

@NgModule({
  imports: [
    CommonModule,
    UIModule,
    EmailTemplatePageModule,
    EteRoutingModule
  ],
  declarations: [
    MainEteComponent,
    EteEditComponent,
  ],
  exports: [MainEteComponent],
  providers: [
    ModuleLoggerFactory,
    EteModuleResolver,
    {
      provide: ETE_API_SERVICE,
      useClass: environment.production
        ? EteApi
        : EteApiMock
    }
  ]
})
export class EteModule {
}
