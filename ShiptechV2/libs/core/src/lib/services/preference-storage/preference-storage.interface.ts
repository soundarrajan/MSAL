import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface IPreferenceStorage {
  get<T>(key: string): Observable<T>;

  getMultiple<T>(keys: string[]): Observable<T[]>;

  set(key: string, value: any): Observable<any>;

  remove(key: string): Observable<any>;

  removeAll(): Observable<any>;
}

export const PREFERENCE_STORAGE = new InjectionToken<IPreferenceStorage>('IPreferenceStorage');
