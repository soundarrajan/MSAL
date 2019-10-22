import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { ApiServiceModel } from '@shiptech/core/developer-toolbar/api-service.model';

@Injectable({
  providedIn: 'root'
})
export class DeveloperToolbarService {

  public apiServices$ = new ReplaySubject<ApiServiceModel[]>(1);
  private _apiServices:ApiServiceModel[] = [];
  private _destroy$ = new Subject();

  constructor() {
  }

  public registerApi(apiModel: ApiServiceModel): void {
    this.apiServices$.next([...this._apiServices, apiModel]);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
