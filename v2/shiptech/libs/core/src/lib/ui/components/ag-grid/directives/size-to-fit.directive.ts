import { Directive, OnDestroy } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AgGridGeneralMenuItemsStorage } from '@shiptech/core/ui/components/ag-grid/directives/general-menu-items-storage.service';
import { AgGridAngular } from '@ag-grid-community/angular';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'ag-grid-angular[appAgGridSizeToFit]'
})
export class AgGridSizeToFitDirective implements OnDestroy {
  private _destroy$: Subject<any> = new Subject();

  constructor(
    private agGrid: AgGridAngular,
    private generalMenuItems: AgGridGeneralMenuItemsStorage
  ) {
    generalMenuItems.menuItems.set(this.agGrid, [
      ...(generalMenuItems.menuItems.get(this.agGrid) ?? []),
      {
        name: 'Size To Fit',
        action: () => this.agGrid.api.sizeColumnsToFit()
      }
    ]);

    this.agGrid.gridReady
      .pipe(
        tap(
          () =>
            (this.agGrid.gridOptions.getMainMenuItems = params => [
              ...(params.defaultItems ?? []),
              ...(generalMenuItems.menuItems.get(this.agGrid) ?? [])
            ])
        ),
        takeUntil(this._destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.generalMenuItems.menuItems.delete(this.agGrid);
    this._destroy$.next();
    this._destroy$.complete();
  }
}
