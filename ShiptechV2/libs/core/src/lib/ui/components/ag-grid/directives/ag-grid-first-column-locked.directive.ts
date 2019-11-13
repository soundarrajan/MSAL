import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Column } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';

@Directive({
  selector: 'ag-grid-angular[appAgGridFirstColumnLocked]'
})
export class AgGridFirstColumnLockedDirective implements OnDestroy {
  private _destroy$: Subject<any> = new Subject();

  constructor(private agGrid: AgGridAngular) {
    if (agGrid) {
      this.agGridOptionsChange();
    }
  }

  agGridOptionsChange(): void {
    this.agGrid.gridReady
      .pipe(
        tap(() => this.firstColumnLocked()),
        takeUntil(this._destroy$)
      )
      .subscribe();
  }

  firstColumnLocked(): void {
    if (this.agGrid.gridOptions) {
      this.agGrid.gridOptions.onColumnPinned = event => this.onColumnPinned(event);
    }
  }

  onColumnPinned(event: any): void {
    const allCols = event.columnApi.getAllGridColumns();
    const allFixedCols = allCols.filter((col: Column) => {
      return col.isLockPosition();
    });
    const allNonFixedCols = allCols.filter((col: Column) => {
      return !col.isLockPosition();
    });
    const pinnedCount = allNonFixedCols.filter((col: Column) => {
      return col.getPinned() === 'left';
    }).length;
    const pinFixed = pinnedCount > 0;
    event.columnApi.setColumnsPinned(allFixedCols, pinFixed);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
