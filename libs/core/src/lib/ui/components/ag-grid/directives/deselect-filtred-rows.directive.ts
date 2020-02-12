import { Directive, OnDestroy } from '@angular/core';
import { GridApi, RowNode } from '@ag-grid-community/core';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { AgGridEventsEnum, fromGridEvent } from '@shiptech/core/ui/components/ag-grid/ag-grid.events';
import { nameof } from '@shiptech/core/utils/type-definitions';
import {AgGridAngular} from "@ag-grid-community/angular";

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'ag-grid-angular[appDeselectFilteredRows]'
})
export class AgGridDeselectFilteredRowsDirective implements OnDestroy {
  private gridApi: GridApi;
  private _destroy$: Subject<any> = new Subject();

  constructor(private agGrid: AgGridAngular) {
    // Note: The gridApi is set on GridReady we have to wait for that event and then start
    this.agGrid.gridReady
      .pipe(
        tap(() => (this.gridApi = this.agGrid.api)),
        switchMap(() => fromGridEvent(this.gridApi, AgGridEventsEnum.filterChanged)),
        tap(() => {
          const selectedAfterFilter = [];
          this.gridApi.forEachNodeAfterFilter(node => {
            if (node.isSelected()) {
              selectedAfterFilter.push(node);
            }
          });

          _.pullAllBy(this.gridApi.getSelectedNodes(), selectedAfterFilter, nameof<RowNode>('id')).forEach(node => this.gridApi.deselectNode(node));
        }),

        takeUntil(this._destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
