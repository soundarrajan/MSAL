import { FormControl } from '@angular/forms';
import { merge, Observable, of, Subject } from 'rxjs';
import { ILookupDto } from './lookup-dto.interface';
import { LookupDataSource } from './lookup-data-source.interface';
import {
  catchError,
  debounceTime,
  defaultIfEmpty,
  exhaustMap,
  filter,
  first,
  scan,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';
import { takeWhileInclusive } from 'rxjs-take-while-inclusive';
import { LookupFilter, LookupsDefaultPageSize } from './lookup-filter';
import { OnDestroy } from '@angular/core';

export class TypeAheadViewModel<TLookup = ILookupDto> implements OnDestroy {
  selectedItem: TLookup;
  selectedControl: FormControl;
  items$: Observable<TLookup[]>;
  externalFilterItems$ = new Subject();
  isLoadingItems = false;
  isLoadingItemsSlow = false;
  loadMoreItems$ = new Subject();

  constructor(
    selectedItem: TLookup,
    lookupDataSource: LookupDataSource<TLookup>
  ) {
    this.selectedControl = new FormControl();
    this.selectedItem = selectedItem;

    // Note: We let the async pipe subscribe tot this.p
    this.items$ = merge(
      this.externalFilterItems$,
      this.selectedControl.valueChanges
    ).pipe(
      // Note: When the user types something, the value is of type string
      // Note: when the user selects an option from the dropdown, the value is an object ILookupDto
      // Note: so we want to perform the api Search only when the user types
      startWith(''), // Note: We need to have some options in order for the Panel to show
      filter(c => typeof c === 'string'),
      debounceTime(200),
      // Note: There are 2 stream here: the search text changes stream and the loadMoreItems$ (raised by directive at 80% scroll)
      // Note: On every search text change, we issue a backend request starting with the first page
      // Note: While the backend is processing our request we ignore any other NextPage emits (exhaustMap).
      // Note: If in this time the search text changes, we don't need those results anymore (switchMap)
      switchMap(startsWith => {
        // Note: Reset the page with every new search text
        let currentPage = 1;
        return this.loadMoreItems$.pipe(
          startWith(currentPage),
          // Note: Notify that we started to load items
          tap(() => {
            this.isLoadingItems = true;
            this.isLoadingItemsSlow = false;
          }),
          // Note: We do not want to show a loading progress bar if the request completes very fast
          // Note: If this finishes after the server response isLoadingItems will be false.
          tap(() =>
            setTimeout(() => {
              if (this.isLoadingItems) {
                this.isLoadingItemsSlow = true;
              }
            }, 200)
          ),
          // Note: Until the backend responds, ignore NextPage requests.
          exhaustMap(() =>
            lookupDataSource(this.getFilterModel(startsWith, currentPage)).pipe(
              // Note: Make sure the DS completes!
              // Note: ExhaustMap Op will only allow other calls if inner obs completes or errors
              catchError(() => of([])),
              defaultIfEmpty([]),
              first()
            )
          ),
          tap(() => {
            this.isLoadingItems = false;
            this.isLoadingItemsSlow = false;
            currentPage++;
          }),
          // Note: This is a custom operator because we also need the last emitted value.
          // Note: Stop if there are no more pages, or no results at all for the current search text.
          takeWhileInclusive(results => results && results.length > 0),
          scan((allItems, newItems) => allItems.concat(newItems), [])
          // Note: Done loading items or next pages
        );
      })
    );

    this.reset();
  }

  reset(): void {
    this.selectedControl.setValue(this.selectedItem);
  }

  // noinspection JSUnusedGlobalSymbols
  filterItems(startsWiths: string = ''): void {
    this.externalFilterItems$.next(startsWiths);
  }

  loadMoreItems(): void {
    this.loadMoreItems$.next();
  }

  // noinspection JSMethodCanBeStatic
  getItemDisplayName(item?: ILookupDto): string | undefined {
    return item ? item.name : undefined;
  }

  validateItemOrReset(): void {
    // Note: If there was a item already selected, the user deleted all text, reset to original value.
    if (
      !this.selectedControl ||
      !this.selectedControl.value ||
      typeof this.selectedControl.value === 'string'
    ) {
      this.reset();
    }
  }

  ngOnDestroy(): void {
    this.externalFilterItems$.complete();
    this.loadMoreItems$.complete();
  }

  // noinspection JSMethodCanBeStatic
  private getFilterModel(startsWith: string, page: number): LookupFilter {
    return new LookupFilter({
      startsWith,
      page,
      pageSize: LookupsDefaultPageSize
    });
  }
}
