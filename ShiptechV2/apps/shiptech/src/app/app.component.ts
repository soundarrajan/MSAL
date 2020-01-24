import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit } from "@angular/core";
import { environment } from '@shiptech/environment';
import { ActivatedRoute, NavigationCancel, NavigationEnd, NavigationError, Router, RouterEvent } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'shiptech-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent{
  @HostBinding('@.disabled')
  public animationsDisabled = true;
  title = 'Shiptech';
  isProduction = environment.production;
  public isLoading = true;

  constructor(private router: Router,
              changeDetector: ChangeDetectorRef) {
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
