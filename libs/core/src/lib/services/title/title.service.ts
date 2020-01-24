import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map, switchMap, takeUntil, tap } from "rxjs/operators";

@Injectable()
export class TitleService implements OnDestroy {

  private _title$ = new BehaviorSubject<string>("");
  private _destroy$ = new Subject();

  constructor(private titleService: Title,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

    // Change page title on navigation based on route data
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.snapshot;
      }),
      filter(route => route.outlet === 'primary'),
      tap(title => this.title = title.data.title),
      takeUntil(this._destroy$)
    ).subscribe();
  }

  get title(): string {
    return this._title$.getValue();
  }

  set title(value: string) {
    this._title$.next(value);
    this.titleService.setTitle(value);
  }

  getSubject(): Observable<string> {
    return this._title$.asObservable();
  }

  ngOnDestroy(): void {
    this._title$.complete();
    this._destroy$.next();
    this._destroy$.complete();
  }
}
