import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { MenuItemDef } from 'ag-grid-community';


@Injectable({
  providedIn: 'root'
})
export class AgGridGeneralMenuItemsStorage implements OnDestroy {
  private _destroy$: Subject<any> = new Subject();
  menuItems = new WeakMap<AgGridAngular, MenuItemDef[]>();

  constructor() {
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
