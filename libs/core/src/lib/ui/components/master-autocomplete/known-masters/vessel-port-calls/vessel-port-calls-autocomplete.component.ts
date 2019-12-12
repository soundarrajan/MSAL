import { AfterViewInit, Component, ContentChild, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AutoComplete } from 'primeng';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IVesselPortCallMasterDto } from '@shiptech/core/services/masters-api/dtos/vessel-port-call';
import { IVesselMastersApi, VESSEL_MASTERS_API_SERVICE } from '@shiptech/core/services/masters-api/vessel-masters-api.service.interface';
import { KnownFilterTypes } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { ServerGridConditionFilterEnum, ShiptechGridFilterOperators } from '@shiptech/core/grid/server-grid/server-grid-condition-filter.enum';
import { DefaultPageSize } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ServerGridSortParametersEnum } from '@shiptech/core/grid/server-grid/server-grid-sort-parameters.enum';

@Component({
  selector: 'shiptech-vessel-port-calls-master-autocomplete',
  templateUrl: './vessel-port-calls-autocomplete.component.html',
  styleUrls: ['./vessel-port-calls-autocomplete.component.scss'],
  exportAs: 'vesselPortCallsMasterAutocomplete'
})
export class VesselPortCallsAutocompleteComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  private _destroy$ = new Subject();

  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;

  @Input() vesselId: number;

  @Input() field: keyof IVesselPortCallMasterDto = nameof<IVesselPortCallMasterDto>('portCallId');
  @Input() dataKey: keyof IVesselPortCallMasterDto = nameof<IVesselPortCallMasterDto>('id');
  @Input() filterField: keyof IVesselPortCallMasterDto = nameof<IVesselPortCallMasterDto>('portCallId');
  @Input() filterType: KnownFilterTypes = KnownFilterTypes.Text;
  @Input() filterOp: ServerGridConditionFilterEnum = ServerGridConditionFilterEnum.STARTS_WITH;

  @ContentChild(AutoComplete, { static: true }) autoComplete: AutoComplete;

  constructor(@Inject(VESSEL_MASTERS_API_SERVICE) private mastersApi: IVesselMastersApi) {
  }

  ngOnInit(): void {
    this.autoComplete.disabled = this.disabled;
    this.autoComplete.readonly = this.readonly;
    this.autoComplete.field = this.field;
    this.autoComplete.dataKey = this.dataKey;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.autoComplete) {
      const disabledChange = changes[nameof<VesselPortCallsAutocompleteComponent>('disabled')];
      const readonlyChange = changes[nameof<VesselPortCallsAutocompleteComponent>('readonly')];
      const fieldChange = changes[nameof<VesselPortCallsAutocompleteComponent>('field')];
      const dataKeyChange = changes[nameof<VesselPortCallsAutocompleteComponent>('dataKey')];

      if (disabledChange) this.autoComplete.disabled = disabledChange.currentValue;
      if (readonlyChange) this.autoComplete.readonly = readonlyChange.currentValue;
      if (fieldChange) this.autoComplete.readonly = fieldChange.currentValue;
      if (dataKeyChange) this.autoComplete.readonly = dataKeyChange.currentValue;
    }
  }

  ngAfterViewInit(): void {
    if (!this.autoComplete) {
      throw Error(`${VesselPortCallsAutocompleteComponent.name} requires a content child of type ${AutoComplete.name}`);
    }

    // TODO: Handle call fails
    this.autoComplete.completeMethod.pipe(
      switchMap((event: { query: string }) => this.mastersApi.getVesselPortCalls({
        id: this.vesselId,
        pagination: { skip: 0, take: DefaultPageSize },
        sortList: [{
          columnValue: this.filterField,
          sortIndex: 0,
          sortParameter: ServerGridSortParametersEnum.asc
        }],
        pageFilters: {
          filters: [{
            columnType: this.filterType,
            columnValue: this.filterField,
            conditionValue: this.filterOp,
            filterOperator: ShiptechGridFilterOperators.AND,
            values: [event.query]
          }]
        }
      })),
      map(response => response.items),
      tap(results => this.autoComplete.suggestions = results || []),
      takeUntil(this._destroy$)
    ).subscribe();
  }

  selectorSelectionChange(portCall: IVesselPortCallMasterDto | IVesselPortCallMasterDto[]): void {
    if (portCall === null || portCall === undefined)
      this.autoComplete.selectItem(undefined);
    else
      this.autoComplete.selectItem(portCall, false);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
