import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit
} from '@angular/core';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { Observable, throwError } from 'rxjs';
import {
  ServerGridConditionFilterEnum,
  ShiptechGridFilterOperators
} from '@shiptech/core/grid/server-grid/server-grid-condition-filter.enum';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { fromPromise } from 'rxjs/internal-compatibility';
import { MasterAutocompleteComponent } from '@shiptech/core/ui/components/master-autocomplete/master-autocomplete.component';
import {
  IVesselMastersApi,
  VESSEL_MASTERS_API_SERVICE
} from '@shiptech/core/services/masters-api/vessel-masters-api.service.interface';
import { knownMastersAutocomplete } from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { DefaultPageSize } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ServerGridSortParametersEnum } from '@shiptech/core/grid/server-grid/server-grid-sort-parameters.enum';
import { map } from 'rxjs/operators';
import { IVesselPortCallMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/vessel-port-call';

@Component({
  selector: 'shiptech-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  exportAs: 'MasterAutocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent extends MasterAutocompleteComponent
  implements OnInit {
  get entityId(): number {
    return this._entityId;
  }

  get entityName(): string {
    return this._entityName;
  }

  get autocompleteType(): string {
    return this._autocompleteType;
  }

  @Input() set entityId(value: number) {
    this._entityId = value;
  }

  @Input() set entityName(value: string) {
    this._entityName = value;
  }

  @Input() set autocompleteType(value: string) {
    this._autocompleteType = value;
  }
  @Input() vesselId: number;
  private _entityId: number;
  private _entityName: string;
  private _autocompleteType: string;

  constructor(
    @Inject(VESSEL_MASTERS_API_SERVICE) private mastersApi: IVesselMastersApi,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(changeDetectorRef);
  }

  ngOnInit(): void {
    if (this.autocompleteType === knownMastersAutocomplete.vesselPort) {
      this.field = nameof<IVesselPortCallMasterDto>('portCallId');
      this.dataKey = nameof<IVesselPortCallMasterDto>('portCallId');
    }
  }

  protected getFilterResults(query: string): Observable<IDisplayLookupDto[]> {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.documents:
        return this.filterOp === ServerGridConditionFilterEnum.STARTS_WITH
          ? fromPromise(
              this.legacyLookupsDatabase.documentType
                .where(this.field)
                .startsWithIgnoreCase(query)
                .toArray()
            )
          : throwError(
              `${MasterAutocompleteComponent.name} supports only ${
                ServerGridConditionFilterEnum.STARTS_WITH
              } values for ${nameof<MasterAutocompleteComponent>('field')}`
            );
      case knownMastersAutocomplete.vessel:
        return this.filterOp === ServerGridConditionFilterEnum.STARTS_WITH
          ? fromPromise(
              this.legacyLookupsDatabase.vessel
                .where(this.field)
                .startsWithIgnoreCase(query)
                .toArray()
            )
          : throwError(
              `${MasterAutocompleteComponent.name} supports only ${
                ServerGridConditionFilterEnum.STARTS_WITH
              } values for ${nameof<MasterAutocompleteComponent>('field')}`
            );
      case knownMastersAutocomplete.vesselPort:
        return this.mastersApi
          .getVesselPortCalls({
            id: this.vesselId,
            pagination: { skip: 0, take: DefaultPageSize },
            sortList: {
              sortList: [
                {
                  columnValue: this.field,
                  sortIndex: 0,
                  sortParameter: ServerGridSortParametersEnum.asc
                }
              ]
            },
            pageFilters: {
              filters: [
                {
                  columnType: this.filterType,
                  columnValue: this.field,
                  conditionValue: this.filterOp,
                  filterOperator: ShiptechGridFilterOperators.AND,
                  values: [query]
                }
              ]
            }
          })
          .pipe(map(response => response.items));
      default:
        throwError(
          `${MasterAutocompleteComponent.name} hasn't defined the autocomplete type`
        );
    }
  }
}
