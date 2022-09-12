import { Directive, OnDestroy } from '@angular/core';
import {
  filter,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  AgGridConditionTypeEnum,
  TypedOptionsFactory
} from '@shiptech/core/ui/components/ag-grid/type.definition';
import { AgGridAngular } from '@ag-grid-community/angular';

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
            map(() => this.agGrid.columnApi.getAllColumns())
          )
        ),
        filter(columns => (columns ?? [])?.length > 0),
        tap(columns => {
          columns
            .filter(s => s.isFilterAllowed())
            .forEach(col => {
              const filterApi = <
                {
                  providedFilterParams: { filterOptions: (string | object)[] };
                  setParams: Function;
                  eType1: HTMLElement;
                  eType2: HTMLElement;
                  ePanelFrom1: HTMLElement;
                  ePanelFrom2: HTMLElement;
                  ePanelTo1: HTMLElement;
                  ePanelTo2: HTMLElement;
                  optionsFactory: TypedOptionsFactory;
                }
              >(this.agGrid.api.getFilterInstance(col) as unknown);

              filterApi.providedFilterParams.filterOptions = [
                ...(filterApi.providedFilterParams.filterOptions ??
                  filterApi.optionsFactory.getFilterOptions()),
                {
                  displayKey: AgGridConditionTypeEnum.NULL,
                  displayName: 'Is empty',
                  hideFilterInput: true,
                  test: (filterValue: any, cellValue: any) =>
                    cellValue === undefined || cellValue === null
                },
                {
                  displayKey: AgGridConditionTypeEnum.NOT_NULL,
                  displayName: 'Is not empty',
                  hideFilterInput: true,
                  test: (filterValue: any, cellValue: any) =>
                    cellValue !== undefined && cellValue !== null
                }
              ];

              // Note: Workaround bug in ag-grid where the filter ui elements are not cleared before setting new ones (every time you setParams it appends)
              if (filterApi.eType1) filterApi.eType1.innerHTML = '';
              if (filterApi.eType2) filterApi.eType2.innerHTML = '';
              if (filterApi.ePanelFrom1) filterApi.ePanelFrom1.innerHTML = '';
              if (filterApi.ePanelFrom2) filterApi.ePanelFrom2.innerHTML = '';
              if (filterApi.ePanelTo1) filterApi.ePanelTo1.innerHTML = '';
              if (filterApi.ePanelTo2) filterApi.ePanelTo2.innerHTML = '';
              // filterApi.setParams(filterApi.providedFilterParams);
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
