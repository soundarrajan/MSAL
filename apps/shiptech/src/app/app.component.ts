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
export class AppComponent implements OnInit{
  @HostBinding('@.disabled')
  public animationsDisabled = true;
  title = 'Shiptech';
  isProduction = environment.production;
  public isLoading = true;

  constructor(private router: Router,
              changeDetector: ChangeDetectorRef,
              private titleService: Title,
              private activatedRoute: ActivatedRoute) {
    router.events.subscribe(
      (event: RouterEvent): void => {
        if ((event instanceof NavigationEnd) || (event instanceof NavigationCancel) || (event instanceof NavigationError)) {
          this.isLoading = false;
          changeDetector.markForCheck();
        }
      }
    );
  }

  ngOnInit(): void {
    const onNavigationEnd = this.router.events.pipe(filter(event => event instanceof NavigationEnd));

    // Change page title on navigation based on route data
    onNavigationEnd.pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        switchMap(route => route.data)
      )
      .subscribe(event => {
        const title = event.title;
        if (title) {
          this.titleService.setTitle(event.title);
        }
      });
  }
}
