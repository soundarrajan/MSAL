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
import { query } from '@angular/animations';
import _ from 'lodash';

export class DeliveryAutocompleteComponent implements AfterViewInit, OnDestroy {
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;

  @Input() field: string = nameof<IDisplayLookupDto>('name');
  @Input() dataKey: string = nameof<IDisplayLookupDto>('id');
  @Input() filterType: AgGridKnownFilterTypes = AgGridKnownFilterTypes.Text;
  @Input() filterOp: ServerGridConditionFilterEnum =
    ServerGridConditionFilterEnum.STARTS_WITH;

  suggestions: IDisplayLookupDto[];
  oldSuggestions: IDisplayLookupDto[];
  documentTypes: any;

  @ContentChild(AutoComplete, { static: true }) autoComplete: AutoComplete;
  protected _destroy$ = new Subject();

  private filter$ = new Subject<string>();

  constructor(protected changeDetectorRef: ChangeDetectorRef) {
    this.filter$
      .pipe(
        switchMap(query => this.getFilterResults(query)),
        tap(results => {
          if (window.location.pathname.includes('documents')) {
            this.oldSuggestions = results || [];
            this.documentTypes = this.getDocumentTypes();
            this.suggestions = [];
            for (let i = 0; i < this.oldSuggestions.length; i++) {
              let object = this.oldSuggestions[i];
              let findElement = this.documentTypes.find((item: any) => {
                return item.name == object.name;
              });
              if (findElement) {
                this.suggestions.push(this.oldSuggestions[i]);
              }
            }
          } else {
            const  decodeHtmlEntity = function(str) {
              return str.replace(/&#(\d+);/g, function(match, dec) {
                  return String.fromCharCode(dec);
              });
            };
            for (let i = 0; i < results.length; i++) {
              results[i].name =  decodeHtmlEntity(_.unescape(results[i].name));
              results[i].displayName =  decodeHtmlEntity(_.unescape(results[i].displayName));
            }
            this.suggestions = results || [];
          }
         
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

  protected getDocumentTypes(): Observable<any> {
    return of([]);
  }
}
