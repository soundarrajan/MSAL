import { Directive, OnDestroy } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';

@Directive({
  selector: 'ag-grid-angular[appAgGridSizeToFit]'
})
export class AgGridSizeToFitDirective implements OnDestroy {
  private _destroy$: Subject<any> = new Subject();

  constructor(private agGrid: AgGridAngular) {
    if (agGrid) {
      this.agGridOptionsChange();
    }
  }

  agGridOptionsChange(): void {
    this.agGrid.gridReady
      .pipe(
        tap(() => this.loadNewMenuItems()),
        takeUntil(this._destroy$)
      )
      .subscribe();
  }

  loadNewMenuItems(): void {
    if (this.agGrid.gridOptions) {
      this.agGrid.gridOptions.getMainMenuItems = params => this.getMainMenuItems(params);
    }
  }

  getMainMenuItems(params: any): any {
    const colMenuItems = params.defaultItems.slice(0);
    colMenuItems.push({
      name: 'Size to fit',
      action: () => this.agGrid.api.sizeColumnsToFit()
    });
    return colMenuItems;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
