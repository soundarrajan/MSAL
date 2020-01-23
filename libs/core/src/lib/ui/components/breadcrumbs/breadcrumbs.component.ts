import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, takeUntil } from "rxjs/operators";
import { IBreadcrumb } from "./breadcrumbs.model";
import { BreadcrumbsService } from "./breadcrumbs.service";
import { Subject } from "rxjs";
import { MenuItem } from "primeng/primeng";
import { isNull, isUndefined } from "lodash";

@Component({
  selector: "shiptech-breadcrumbs",
  template: `
    <div fxLayout="row" fxLayoutAlign="start center" class="breadcrumbs-container">
      <p-breadcrumb fxFlex="auto" [model]="breadcrumbs" [home]="{ routerLink: '/', icon: 'fa fa-home'}"></p-breadcrumb>
      <router-outlet class="breadcrumbs-right" fxFlex="initial" fxLayoutAlign="end start"
                     name="breadcrumbs-right"></router-outlet>
    </div>
  `,
  styleUrls: ["./breadcrumbs.scss"],
  encapsulation: ViewEncapsulation.None
})

export class BreadcrumbComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();

  private ROUTE_DATA_BREADCRUMB: string = "breadcrumb";

  // All the breadcrumbs
  public breadcrumbs: MenuItem[];

  public constructor(private breadcrumbService: BreadcrumbsService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd
      ),
      takeUntil(this._destroy$)
    ).subscribe(event => {
      this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
    });
  }

  public hasParams(breadcrumb: IBreadcrumb): any {
    return Object.keys(breadcrumb.params).length ? [breadcrumb.url, breadcrumb.params] : [breadcrumb.url];
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
      if (url !== "") {
        url += `/`;
      }
      url += `${routeURL}`;
    }

    const label = child.snapshot.data[this.ROUTE_DATA_BREADCRUMB];
    if (!isUndefined(label) && !isNull(label)) {
      breadcrumbs.push({ label, url });
    }

    return this.createBreadcrumbs(child, url, breadcrumbs);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
