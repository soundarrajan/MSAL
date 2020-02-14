import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  get title(): string {
    return this._title$.getValue();
  }

  set title(value: string) {
    this._browserTitle.setTitle(value);
    this._title$.next(value);
  }
  public title$: Observable<string>;
  private _title$: BehaviorSubject<string>;

  constructor(router: Router, private _browserTitle: Title) {
    this._title$ = new BehaviorSubject<string>(_browserTitle.getTitle());
    this.title$ = this._title$.asObservable();

    router.events
      .pipe(
        // Note: ActivationEnd event is raised for each route/child route in descending order, e.g childLevel2, childLevel1, root; childLevel2 is leaf root
        filter(
          event =>
            event instanceof ActivationEnd &&
            event.snapshot.firstChild === null &&
            event.snapshot.outlet === 'primary'
        ),
        map((event: ActivationEnd) => event.snapshot.data ?? {}),
        tap(routeData => (this.title = routeData.title))
      )
      .subscribe();
  }
}
