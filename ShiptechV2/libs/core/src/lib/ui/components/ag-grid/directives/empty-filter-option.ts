import { Directive, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { filter, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OptionsFactory } from 'ag-grid-community/dist/lib/filter/provided/optionsFactory';
import { AgGridConditionTypeEnum } from '@shiptech/core/ui/components/ag-grid/type.definition';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'ag-grid-angular[appAgGridEmptyFilterOption]'
})
export class AgGridEmptyFilterOptionDirective implements OnDestroy {

  private _destroy$: Subject<any> = new Subject();

  constructor(private agGrid: AgGridAngular) {
    // Note: The gridApi is set on GridReady we have to wait for that event and then start

    // Note: The columns might be set later then grid ready, or they can be updated even later on as part of the business logic
    this.agGrid.gridReady
      .pipe(
        switchMap(() =>
          this.agGrid.newColumnsLoaded.pipe(
            startWith(this.agGrid.columnApi.getAllColumns()),
            map(() => this.agGrid.columnApi.getAllColumns()))
        ),
        filter(columns => (columns ?? [])?.length > 0),
        tap(columns => {
          columns.filter(s => s.isFilterAllowed()).forEach(col => {
            const filterApi = <{
              providedFilterParams: { filterOptions: (string | object)[] },
              setParams: Function,
              eType1: HTMLSelectElement,
              eType2: HTMLSelectElement,
              optionsFactory: OptionsFactory
            }>(this.agGrid.api.getFilterInstance(col) as unknown);

            filterApi.providedFilterParams.filterOptions = [...(filterApi.providedFilterParams.filterOptions ?? filterApi.optionsFactory.getFilterOptions()), {
              displayKey: AgGridConditionTypeEnum.NULL,
              displayName: 'Is empty',
              hideFilterInput: true,
              test: (filterValue: any, cellValue: any) => cellValue === undefined || cellValue === null
            }];

            // Note: Workaround bug in ag-grid where the filter dropdown are not cleared before setting new ones
            filterApi.eType1.innerHTML = '';
            filterApi.eType2.innerHTML = '';

            filterApi.setParams(filterApi.providedFilterParams);
          });
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
