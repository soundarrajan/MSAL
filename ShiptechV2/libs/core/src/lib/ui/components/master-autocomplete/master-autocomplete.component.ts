import {
  AfterViewInit,
  ChangeDetectorRef,
  ContentChild,
  Input,
  OnDestroy
} from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { AgGridKnownFilterTypes } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { ServerGridConditionFilterEnum } from '@shiptech/core/grid/server-grid/server-grid-condition-filter.enum';
import { AutoComplete } from 'primeng/autocomplete';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

export class MasterAutocompleteComponent implements AfterViewInit, OnDestroy {
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;

  @Input() field: string = nameof<IDisplayLookupDto>('name');
  @Input() dataKey: string = nameof<IDisplayLookupDto>('id');
  @Input() filterType: AgGridKnownFilterTypes = AgGridKnownFilterTypes.Text;
  @Input() filterOp: ServerGridConditionFilterEnum =
    ServerGridConditionFilterEnum.STARTS_WITH;

  suggestions: IDisplayLookupDto[];

  @ContentChild(AutoComplete, { static: true }) autoComplete: AutoComplete;
  protected _destroy$ = new Subject();

  private filter$ = new Subject<string>();

  constructor(protected changeDetectorRef: ChangeDetectorRef) {
    this.filter$
      .pipe(
        switchMap(query => this.getFilterResults(query)),
        tap(results => {
          this.suggestions = results || [];
          this.changeDetectorRef.markForCheck();
        }),
        takeUntil(this._destroy$)
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    if (!this.autoComplete) {
      throw Error(
        `${this.constructor.name} requires a content child of type ${AutoComplete.name}`
      );
    }
  }

  filter(query: string): void {
    this.filter$.next(query);
  }

  selectorSelectionChange(
    selection: IDisplayLookupDto | IDisplayLookupDto[]
  ): void {
    if (selection === null || selection === undefined)
      // eslint-disable-next-line no-unused-expressions
      this.autoComplete?.selectItem(undefined);
    // eslint-disable-next-line no-unused-expressions
    else this.autoComplete?.selectItem(selection, false);
  }

  ngOnDestroy(): void {
    this.filter$.complete();

    this._destroy$.next();
    this._destroy$.complete();
  }

  protected getFilterResults(query: string): Observable<IDisplayLookupDto[]> {
    return of([]);
  }
}
