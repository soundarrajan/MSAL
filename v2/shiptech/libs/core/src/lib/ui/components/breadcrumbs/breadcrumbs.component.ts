import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { MenuItem } from "primeng/primeng";
import { AppConfig } from "@shiptech/core/config/app-config";

@Component({
  selector: "shiptech-breadcrumbs",
  template: `
    <div fxLayout="row" fxLayoutAlign="start center" class="breadcrumbs-container">
      <p-breadcrumb fxFlex="auto" [model]="breadcrumbs" [home]="{ routerLink: '/', icon: 'fa fa-home'}"></p-breadcrumb>
    </div>
  `,
  styleUrls: ["./breadcrumbs.scss"],
  encapsulation: ViewEncapsulation.None
})

export class BreadcrumbComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();

  private ROUTE_DATA_BREADCRUMB: string = "breadcrumb";
  private ROUTE_DATA_BREADCRUMB_URL: string = "breadcrumbUrl";

  // All the breadcrumbs
  public breadcrumbs: MenuItem[];

  public constructor(private activatedRoute: ActivatedRoute,
                     private router: Router,
                     private appConfig: AppConfig) {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd
      ),
      takeUntil(this._destroy$)
    ).subscribe(() => {
      this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
    });
  }

  public ngOnInit(): void {
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = "", breadcrumbs: MenuItem[] = []): MenuItem[] {

    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }

    const child = children[0];
    const routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");
    if (routeURL !== "") {
      url += `/${routeURL}`;
    }
    const newBreadCrumb: MenuItem = {};
    newBreadCrumb.target = this.appConfig.openLinksInNewTab ? "_blank" : "_self";
    newBreadCrumb.routerLink = url;
    const data = child.snapshot.routeConfig.data;
    if (data) {
      if (data[this.ROUTE_DATA_BREADCRUMB]) {
        if (data[this.ROUTE_DATA_BREADCRUMB_URL]) {
          newBreadCrumb.url = data[this.ROUTE_DATA_BREADCRUMB_URL];
        }
        newBreadCrumb.label = data[this.ROUTE_DATA_BREADCRUMB];
        breadcrumbs.push(newBreadCrumb);
      }
    }

    return this.createBreadcrumbs(child, url, breadcrumbs);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
