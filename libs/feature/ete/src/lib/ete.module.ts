import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTemplatePageModule } from 'email-template-editor-ckeditor';
import { MainEteComponent } from './views/main-ete.component';
import { EteEditComponent } from './views/ete-edit/ete-edit.component';
import { EteRoutingModule } from './ete-routing.module';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { ModuleLoggerFactory } from './core/logging/module-logger-factory';
import { AuthenticationModule } from '@shiptech/core/authentication/authentication.module';

@NgModule({
  imports: [
    CommonModule,
    UIModule,
    EmailTemplatePageModule,
    AuthenticationModule.forFeature(),
    EteRoutingModule
  ],
  declarations: [MainEteComponent, EteEditComponent],
  exports: [MainEteComponent],
  providers: [ModuleLoggerFactory]
})
export class EteModule {}
