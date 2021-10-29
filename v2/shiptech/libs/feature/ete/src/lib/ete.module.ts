import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTemplatePageModule } from 'email-template-editor-ckeditor';
import { MainEteComponent } from './views/main-ete.component';
import { EteEditComponent } from './views/ete-edit/ete-edit.component';
import { EteRoutingModule } from './ete-routing.module';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { ModuleLoggerFactory } from './core/logging/module-logger-factory';
import { AuthenticationMsalModule } from '@shiptech/core/authentication/authentication-msal.module';
import { AuthenticationAdalModule } from '@shiptech/core/authentication/authentication-adal.module';
import { environment } from '@shiptech/environment';

@NgModule({
  imports: [
    CommonModule,
    UIModule,
    EmailTemplatePageModule,
    !window.location.hostname.includes('cma')
      ? AuthenticationMsalModule.forFeature()
      : AuthenticationAdalModule.forFeature(),
    EteRoutingModule
  ],
  declarations: [MainEteComponent, EteEditComponent],
  exports: [MainEteComponent],
  providers: [ModuleLoggerFactory]
})
export class EteModule {}
