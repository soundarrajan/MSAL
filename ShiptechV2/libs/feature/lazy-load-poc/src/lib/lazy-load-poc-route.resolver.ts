import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { delay, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class LazyLoadPocRouteResolver implements Resolve<any> {
  constructor() {}

  resolve(): Observable<any> {
    return of(true).pipe(
      delay(5000),
      tap(() => {})
    );
  }
}
