import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppConfig } from '@shiptech/core/config/app-config';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'shiptech-breadcrumbs',
  template: `
    <div
      fxLayout="row"
      fxLayoutAlign="start center"
      class="breadcrumbs-container"
      [ngClass]="{'remove-container': delivery}"
    >
      <p-breadcrumb fxFlex="auto" [model]="breadcrumbs"></p-breadcrumb>
    </div>
  `,
  styleUrls: ['./breadcrumbs.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  delivery: any = false;
  @Input('delivery') set _setDelivery(delivery) { 
    if (!delivery) {
      return;
    } 
    this.delivery = delivery;
  }
  // All the breadcrumbs
  public breadcrumbs: MenuItem[];
  private _destroy$ = new Subject();

  private ROUTE_DATA_BREADCRUMB: string = 'breadcrumb';
  private ROUTE_DATA_BREADCRUMB_URL: string = 'breadcrumbUrl';
  private ROUTE_DATA_BREADCRUMB_ICON: string = 'breadcrumbIcon';

  public constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private appConfig: AppConfig
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      });
  }

  public ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: MenuItem[] = []
  ): MenuItem[] {
    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }

    const child = children[0];
    const routeURL: string = child.snapshot.url
      .map(segment => segment.path)
      .join('/');
    if (routeURL !== '') {
      url += `/${routeURL}`;
    }
    const newBreadCrumb: MenuItem = {};
    newBreadCrumb.target = this.appConfig.openLinksInNewTab
      ? '_blank'
      : '_self';
    newBreadCrumb.routerLink = url;
    const data = child.snapshot.routeConfig.data;
    if (data) {
      if (data[this.ROUTE_DATA_BREADCRUMB]) {
        if (data[this.ROUTE_DATA_BREADCRUMB_URL]) {
          newBreadCrumb.url = data[this.ROUTE_DATA_BREADCRUMB_URL];
        }
        if (data[this.ROUTE_DATA_BREADCRUMB_ICON]) {
          newBreadCrumb.icon = data[this.ROUTE_DATA_BREADCRUMB_ICON];
        }
        newBreadCrumb.label = data[this.ROUTE_DATA_BREADCRUMB];
        breadcrumbs.push(newBreadCrumb);
      }
    }
    if (this.router.url.includes('email-template-editor')) {
      breadcrumbs[0].label = 'Admin';
      breadcrumbs[0].url = '/#/admin/configuration/edit/1';
    }

    if (this.router.url.includes('delivery/delivery')) {
      breadcrumbs[0].url = '/#/delivery/delivery';
    }

    if (this.router.url.includes('contracts/contract')) {
      breadcrumbs[0].url = '/#/contracts/contract';
    }

    return this.createBreadcrumbs(child, url, breadcrumbs);
  }
}
