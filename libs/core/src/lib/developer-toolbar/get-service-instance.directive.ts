import { Directive, Input } from '@angular/core';
import { ApiServiceModel } from './api-service.model';
import { ApiServiceSettingsComponent } from './api-service-settings/api-service-settings.component';

@Directive({
  selector: '[appGetServiceInstance]'
})
export class GetServiceInstanceDirective {
  constructor(public component: ApiServiceSettingsComponent) {}

  @Input('appGetServiceInstance') set _serviceConfig(service: ApiServiceModel) {
    if (this.component.apiService.id === service.id) {
      service.component = this.component;
    }
  }
}
