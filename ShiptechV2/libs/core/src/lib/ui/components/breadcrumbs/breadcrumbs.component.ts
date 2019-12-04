import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { IBreadcrumb } from './breadcrumbs.model';
import { BreadcrumbsService } from './breadcrumbs.service';
import { MenuItem } from 'primeng/primeng';
import { Subject } from 'rxjs';


@Component({
  selector: 'shiptech-breadcrumbs',
  template: `
      <div fxLayout="row" fxLayoutAlign="start center" class="breadcrumbs-container">
          <p-breadcrumb fxFlex="auto" [model]="breadcrumbs" [home]="{icon: 'fa fa-home'}"></p-breadcrumb>
          <router-outlet class="breadcrumbs-right" fxFlex="initial" fxLayoutAlign="end start"
                         name="breadcrumbs-right"></router-outlet>
      </div>
  `,
  styleUrls: ['./breadcrumbs.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BreadcrumbComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();

  private ROUTE_DATA_BREADCRUMB: string = 'breadcrumb';
  private ROUTE_PARAM_BREADCRUMB: string = 'breadcrumb';
  private PREFIX_BREADCRUMB: string = 'prefixBreadcrumb';

  // The breadcrumbs of the current route
  private currentBreadcrumbs: IBreadcrumb[];
  // All the breadcrumbs
  public breadcrumbs: MenuItem[];

  public constructor(private breadcrumbService: BreadcrumbsService, private activatedRoute: ActivatedRoute, private router: Router) {
    breadcrumbService.get().pipe(takeUntil(this._destroy$)).subscribe((breadcrumbs: IBreadcrumb[]) => {
      this.breadcrumbs = breadcrumbs.map(breadcrumb => ({ label: breadcrumb.label, routerLink: breadcrumb.url }));
    });
  }

  public hasParams(breadcrumb: IBreadcrumb): any {
    return Object.keys(breadcrumb.params).length ? [breadcrumb.url, breadcrumb.params] : [breadcrumb.url];
  }


  public ngOnInit(): void {
    if (this.router.navigated) {
      this.generateBreadcrumbTrail();
    }
    ;

    // subscribe to the NavigationEnd event
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd
      ),
      takeUntil(this._destroy$)
    ).subscribe(event => {
      this.generateBreadcrumbTrail();
    });
  }

  private generateBreadcrumbTrail(): void {
    // reset currentBreadcrumbs
    this.currentBreadcrumbs = [];


    // get the root of the current route
    let currentRoute: ActivatedRoute = this.activatedRoute.root;


    // set the url to an empty string
    let url: string = '';

    // iterate from activated route to children
    while (currentRoute.children.length > 0) {
      const childrenRoutes: ActivatedRoute[] = currentRoute.children;
      let breadCrumbLabel: string = '';

      // iterate over each children
      childrenRoutes.forEach(route => {
        // Set currentRoute to this route
        currentRoute = route;
        // Verify this is the primary route
        if (route.outlet !== PRIMARY_OUTLET) {
          return;
        }
        const hasData = (route.routeConfig && route.routeConfig.data);
        const hasDynamicBreadcrumb: boolean = route.snapshot.params.hasOwnProperty(this.ROUTE_PARAM_BREADCRUMB);

        if (hasData || hasDynamicBreadcrumb) {
          /*
          Verify the custom data property "breadcrumb"
          is specified on the route or in its parameters.

          Route parameters take precedence over route data
          attributes.
          */
          if (hasDynamicBreadcrumb) {
            breadCrumbLabel = route.snapshot.params[this.ROUTE_PARAM_BREADCRUMB].replace(/_/g, ' ');
          } else if (route.snapshot.data.hasOwnProperty(this.ROUTE_DATA_BREADCRUMB)) {
            breadCrumbLabel = route.snapshot.data[this.ROUTE_DATA_BREADCRUMB];
          }
          // Get the route's URL segment
          const routeURL: string = route.snapshot.url.map(segment => segment.path).join('/');
          url += `/${routeURL}`;
          // Cannot have parameters on a root route
          if (routeURL.length === 0) {
            route.snapshot.params = {};
          }
          // Add breadcrumb
          const breadcrumb: IBreadcrumb = {
            label: breadCrumbLabel,
            params: route.snapshot.params,
            url: url
          };
          // Add the breadcrumb as 'prefixed'. It will appear before all breadcrumbs
          if (route.snapshot.data.hasOwnProperty(this.PREFIX_BREADCRUMB)) {
            this.breadcrumbService.storePrefixed(breadcrumb);
          } else {
            this.currentBreadcrumbs.push(breadcrumb);
          }
        }
      });
      this.breadcrumbService.store(this.currentBreadcrumbs);
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
