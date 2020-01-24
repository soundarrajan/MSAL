import { Injectable, Injector, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map, takeUntil, tap } from "rxjs/operators";

@Injectable()
export class TitleService implements OnDestroy {

  private _title$ = new BehaviorSubject<string>("");
  private _destroy$ = new Subject();

  private get _router(): Router {
    return this._injector.get(Router);
  }

  private get _activatedRoute(): ActivatedRoute {
    return this._injector.get(ActivatedRoute);
  }

  private get _titleService(): Title {
    return this._injector.get(Title);
  }

  constructor(private _injector: Injector) {
  }

  get title(): string {
    return this._title$.getValue();
  }

  set title(value: string) {
    this._title$.next(value);
    this._titleService.setTitle(value);
  }

  getSubject(): Observable<string> {
    return this._title$.asObservable();
  }

  initApp(): Observable<any> {
    // Change page title on navigation based on route data
    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this._activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.snapshot;
      }),
      filter(route => route.outlet === "primary"),
      tap(title => this.title = title.data.title),
      takeUntil(this._destroy$)
    ).subscribe();

    return of(undefined);
  }

  ngOnDestroy(): void {
    this._title$.complete();
    this._destroy$.next();
    this._destroy$.complete();
  }
}

export function titleInitializer(titleService: TitleService): () => Promise<any> {
  return () => titleService.initApp().toPromise();
}
