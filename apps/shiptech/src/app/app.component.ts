import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, Router, RouterEvent} from '@angular/router';

@Component({
  selector: 'shiptech-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  @HostBinding('@.disabled')
  public animationsDisabled = true;
  title = 'Shiptech';
  public isLoading = true;

  constructor(router: Router, changeDetector: ChangeDetectorRef) {
    router.events.subscribe(
      (event: RouterEvent): void => {
        if ((event instanceof NavigationEnd) || (event instanceof NavigationCancel) || (event instanceof NavigationError)) {
          this.isLoading = false;
          changeDetector.markForCheck();
        }
      }
    );
  }
}
