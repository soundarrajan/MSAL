import { Component, HostBinding } from '@angular/core';
import { AdalService } from 'adal-angular4';
import { AuthConfig } from '../../../../libs/core/src/lib/authentication/auth.config';

@Component({
  selector: 'shiptech-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('@.disabled')
  public animationsDisabled = true;
  title = 'shiptech';
  constructor(private adal: AdalService, private authConfig: AuthConfig) {
    this.adal.init(authConfig.adalConfig);
    this.adal.handleWindowCallback();
  }
}
