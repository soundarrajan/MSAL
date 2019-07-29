import { Injectable } from '@angular/core';
import { IPreferenceStorage } from './preference-storage.interface';
import { defer, EMPTY, Observable, of, throwError } from 'rxjs';
import { ApiCall } from '../../utils/decorators/api-call.decorator';

@Injectable({
  providedIn: 'root'
})
export class LocalPreferenceService implements IPreferenceStorage {
  @ApiCall()
  get<T>(key: string): Observable<T> {
    return defer(() => {
      try {
        return of(JSON.parse(localStorage.getItem(key)));
      } catch (e) {
        return throwError(e);
      }
    });
  }

  // NOTE: this need further testing
  @ApiCall()
  getMultiple<T = string>(keys: string[]): Observable<T[]> {
    return defer(() => {
      try {
        const items: T[] = [];
        keys.forEach(key => {
          items.push(JSON.parse(localStorage.getItem(key)));
        });
        return of(items);
      } catch (e) {
        return throwError(e);
      }
    });
  }

  @ApiCall()
  remove(key: string): Observable<any> {
    return defer(() => {
      try {
        localStorage.removeItem(key);
        return EMPTY;
      } catch (e) {
        return throwError(e);
      }
    });
  }

  @ApiCall()
  removeAll(): Observable<any> {
    return defer(() => {
      try {
        localStorage.clear();
        return EMPTY;
      } catch (e) {
        return throwError(e);
      }
    });
  }

  @ApiCall()
  set(key: string, value: any): Observable<any> {
    return defer(() => {
      try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        return EMPTY;
      } catch (e) {
        return throwError(e);
      }
    });
  }
}
