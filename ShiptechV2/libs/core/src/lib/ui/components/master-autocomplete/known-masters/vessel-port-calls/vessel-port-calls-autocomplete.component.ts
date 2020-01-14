import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input } from '@angular/core';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IVesselPortCallMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/vessel-port-call';
import { IVesselMastersApi, VESSEL_MASTERS_API_SERVICE } from '@shiptech/core/services/masters-api/vessel-masters-api.service.interface';
import { ShiptechGridFilterOperators } from '@shiptech/core/grid/server-grid/server-grid-condition-filter.enum';
import { DefaultPageSize } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ServerGridSortParametersEnum } from '@shiptech/core/grid/server-grid/server-grid-sort-parameters.enum';
import { MasterAutocompleteComponent } from '@shiptech/core/ui/components/master-autocomplete/master-autocomplete.component';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

@Component({
  selector: 'shiptech-vessel-port-calls-master-autocomplete',
  templateUrl: './vessel-port-calls-autocomplete.component.html',
  styleUrls: ['./vessel-port-calls-autocomplete.component.scss'],
  exportAs: 'vesselPortCallsMasterAutocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VesselPortCallsAutocompleteComponent extends MasterAutocompleteComponent {
  @Input() vesselId: number;

  constructor(@Inject(VESSEL_MASTERS_API_SERVICE) private mastersApi: IVesselMastersApi, changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);

    this.field = nameof<IVesselPortCallMasterDto>('portCallId');
    this.dataKey = nameof<IVesselPortCallMasterDto>('portCallId');
  }

  protected getFilterResults(query: string): Observable<IDisplayLookupDto[]> {

    return this.mastersApi.getVesselPortCalls({
      id: this.vesselId,
      pagination: { skip: 0, take: DefaultPageSize },
      sortList: {
        sortList: [{
          columnValue: this.field,
          sortIndex: 0,
          sortParameter: ServerGridSortParametersEnum.asc
        }]
      },
      pageFilters: {
        filters: [{
          columnType: this.filterType,
          columnValue: this.field,
          conditionValue: this.filterOp,
          filterOperator: ShiptechGridFilterOperators.AND,
          values: [query]
        }]
      }
    }).pipe(map(response => response.items));
  }


}
