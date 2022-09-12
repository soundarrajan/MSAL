import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuItemDef } from '@ag-grid-community/core';
import { AgGridAngular } from '@ag-grid-community/angular';

@Injectable({
  providedIn: 'root'
})
export class AgGridGeneralMenuItemsStorage implements OnDestroy {
  menuItems = new WeakMap<AgGridAngular, MenuItemDef[]>();
  private _destroy$: Subject<any> = new Subject();

  constructor() {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
