import { AfterViewInit, Component, ContentChild, EventEmitter, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AutoComplete } from 'primeng/primeng';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Subject } from 'rxjs';
import { IVesselMasterDto } from '@shiptech/core/services/masters-api/dtos/vessel';
import { KnownFilterTypes } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { ServerGridConditionFilterEnum } from '@shiptech/core/grid/server-grid/server-grid-condition-filter.enum';

@Component({
  selector: 'shiptech-vessel-master-autocomplete',
  templateUrl: './vessel-autocomplete.component.html',
  styleUrls: ['./vessel-autocomplete.component.scss'],
  exportAs: 'vesselMasterAutocomplete'
})
export class VesselAutocompleteComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  private _destroy$ = new Subject();

  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;

  @Input() field: keyof IVesselMasterDto = nameof<IVesselMasterDto>('name');
  @Input() dataKey: keyof IVesselMasterDto = nameof<IVesselMasterDto>('id');
  @Input() filterField: keyof IVesselMasterDto = nameof<IVesselMasterDto>('name');
  @Input() filterType: KnownFilterTypes = KnownFilterTypes.Text;
  @Input() filterOp: ServerGridConditionFilterEnum = ServerGridConditionFilterEnum.STARTS_WITH;

  @Input() suggestions: IVesselMasterDto[];
  @Input() completeMethod: EventEmitter<any>; // TODO fix any

  @ContentChild(AutoComplete, { static: true }) autoComplete: AutoComplete;

  constructor(private legacyLookupsDatabase: LegacyLookupsDatabase) {
  }

  ngOnInit(): void {
    this.autoComplete.disabled = this.disabled;
    this.autoComplete.readonly = this.readonly;
    this.autoComplete.field = this.field;
    this.autoComplete.dataKey = this.dataKey;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.autoComplete) {
      const disabledChange = changes[nameof<VesselAutocompleteComponent>('disabled')];
      const readonlyChange = changes[nameof<VesselAutocompleteComponent>('readonly')];
      const fieldChange = changes[nameof<VesselAutocompleteComponent>('field')];
      const dataKeyChange = changes[nameof<VesselAutocompleteComponent>('dataKey')];

      if (disabledChange) this.autoComplete.disabled = disabledChange.currentValue;
      if (readonlyChange) this.autoComplete.readonly = readonlyChange.currentValue;
      if (fieldChange) this.autoComplete.readonly = fieldChange.currentValue;
      if (dataKeyChange) this.autoComplete.readonly = dataKeyChange.currentValue;
    }
  }

  ngAfterViewInit(): void {
    if (!this.autoComplete) {
      throw Error(`${VesselAutocompleteComponent.name} requires a content child of type ${AutoComplete.name}`);
    }

    this.autoComplete.completeMethod.pipe(
      switchMap((event: { query: string }) =>
        fromPromise(this.legacyLookupsDatabase.vessel.filter(v => {
          const fieldValue = this.field !== null && this.field!== undefined ? v?.[this.field] : v;
          switch (this.filterOp) {
            case ServerGridConditionFilterEnum.CONTAINS:
              return fieldValue?.toLowerCase()?.indexOf(event.query.toLowerCase()) >= 0;
            case ServerGridConditionFilterEnum.STARTS_WITH:
              return fieldValue?.toLowerCase()?.startsWith(event.query.toLowerCase());
            default:
              throw Error(`${VesselAutocompleteComponent.name} supports only ${ServerGridConditionFilterEnum.STARTS_WITH}, ${ServerGridConditionFilterEnum.CONTAINS} values for ${nameof<VesselAutocompleteComponent>('filterField')}`);
          }
        }).toArray())),
      tap(results => this.autoComplete.suggestions = results || []),
      takeUntil(this._destroy$)
    ).subscribe();
  }

  selectorSelectionChange(vessel: IVesselMasterDto): void {
    if (vessel === null || vessel === undefined)
      this.autoComplete.selectItem(undefined);
    else
      this.autoComplete.selectItem(vessel, false);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
