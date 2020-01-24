import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map, switchMap, takeUntil } from "rxjs/operators";

@Injectable()
export class TitleService implements OnDestroy {

  private _title$ = new BehaviorSubject('');
  private _destroy$ = new Subject();

  constructor(private titleService: Title,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

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
      switchMap(route => route.data),
      takeUntil(this._destroy$)
    )
      .subscribe(event => {
        const title = event.title;
        if (title) {
          this.setSubject(title);
        }
      });
  }

  getSubject(): Observable<string> {
    return this._title$.asObservable();
  }

  setSubject(value: string): void {
    this._title$.next(value);
    this.titleService.setTitle(value);
  }

  ngOnDestroy(): void {
    this._title$.complete();
    this._destroy$.next();
    this._destroy$.complete();
  }
}
