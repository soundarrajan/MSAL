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
import { Observable, of, throwError } from 'rxjs';
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
import {
  knowMastersAutocompleteHeaderName,
  knownMastersAutocomplete
} from '@shiptech/core/ui/components/master-autocomplete/masters-autocomplete.enum';
import { DefaultPageSize } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ServerGridSortParametersEnum } from '@shiptech/core/grid/server-grid/server-grid-sort-parameters.enum';
import { catchError, finalize, map } from 'rxjs/operators';
import { IVesselPortCallMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/vessel-port-call';
import { AppConfig } from '@shiptech/core/config/app-config';
import { HttpClient } from '@angular/common/http';
import { ServerQueryFilter } from '@shiptech/core/grid/server-grid/server-query.filter';
const routes = {
  getDocumentsType: (serverUrl: string) => serverUrl  + '/api/masters/documenttype/list',

};
@Component({
  selector: 'shiptech-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  exportAs: 'MasterAutocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent extends MasterAutocompleteComponent
  implements OnInit {
  private _documentTypes: any;
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
  private _TRANSACTION_TYPE_ID: number = 46;
  protected _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;


  constructor(
    @Inject(VESSEL_MASTERS_API_SERVICE) private mastersApi: IVesselMastersApi,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    changeDetectorRef: ChangeDetectorRef,
    private appConfig: AppConfig,
    private httpClient: HttpClient
  ) {
    super(changeDetectorRef);
  }

  getHeaderNameSelector(): string {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.documents:
        return knowMastersAutocompleteHeaderName.documents;
      case knownMastersAutocomplete.vessel:
        return knowMastersAutocompleteHeaderName.vessel;
      case knownMastersAutocomplete.vesselPort:
        return knowMastersAutocompleteHeaderName.vesselPort;
      default:
        return knowMastersAutocompleteHeaderName.documents;
    }
  }

  ngOnInit(): void {
    if (this.autocompleteType === knownMastersAutocomplete.vesselPort) {
      this.field = nameof<IVesselPortCallMasterDto>('portCallId');
      this.dataKey = nameof<IVesselPortCallMasterDto>('portCallId');
    }
    const filters: ServerQueryFilter[] = [
      {
        columnName: 'ReferenceNo',
        value: this.entityId.toString(10)
      },
      {
        columnName: 'TransactionTypeId',
        value: this._TRANSACTION_TYPE_ID.toString(10)
      },

    ];   
    let payload = {
      'filters': [],
      'pageFilters': {
        'filters': []
      },
      'pagination': {
        'take': 999999,
        'skip': 0
      }
      
    };
    payload.filters = filters; 
    this.getDocumentsType(this._apiUrl, payload)
    .pipe(
        finalize(() => {
        })
    )
    .subscribe((result: any) => {
      this._documentTypes = result;
     });
  }
  protected getDocumentTypes(): Observable<any> {
    return this._documentTypes;
  }


  protected getFilterResults(query: string): Observable<IDisplayLookupDto[]> {
    switch (this._autocompleteType) {
      case knownMastersAutocomplete.documents: {
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
      }
      case knownMastersAutocomplete.vessel: {
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
      }
      case knownMastersAutocomplete.vesselPort: {
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
      }
      default:
        throwError(
          `${MasterAutocompleteComponent.name} hasn't defined the autocomplete type`
        );
    }
  }

  getDocumentsType(serverUrl: string, payload: any): Observable<any> {
    return this.httpClient.post(routes.getDocumentsType(serverUrl),{'payload': payload}).pipe(
      map((body: any) => body.payload),
      catchError(() => of('Error, could not load the template'))
    );
  }
}
