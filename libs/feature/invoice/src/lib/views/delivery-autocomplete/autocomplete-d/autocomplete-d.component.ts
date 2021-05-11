import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
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
import { catchError, finalize, map, startWith } from 'rxjs/operators';
import { IVesselPortCallMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/vessel-port-call';
import { AppConfig } from '@shiptech/core/config/app-config';
import { HttpClient } from '@angular/common/http';
import { ServerQueryFilter } from '@shiptech/core/grid/server-grid/server-query.filter';
import { DeliveryAutocompleteComponent } from '../delivery-autocomplete.component';
import { FormControl } from '@angular/forms';


export interface User {
  name: string;
}

@Component({
  selector: 'shiptech-autocomplete-d',
  templateUrl: './autocomplete-d.component.html',
  styleUrls: ['./autocomplete-d.component.scss'],
  exportAs: 'MasterDAutocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AutocompleteDComponent extends DeliveryAutocompleteComponent
  implements OnInit {
  private _documentTypes: any;
  inputModel: any;
  selectedOptionId: any;
  options1: any;
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
  @Input('options') set _options(options) {  
    if (!options) {
      return;
    }
    this.options1 = options;
  }

  @Input('selectedOption') set _selectedOption(option) {
    if (!option) {
      return;
    }
    this.selectedOptionId = option.id;
  }

  @Input('model') set _setInputModel(model) { 
    if (!model) {
      return;
    } 
    this.inputModel = model;
  }

  @Input('label') set setLabel(label) { 
    if (!label) {
      return;
    }  
    this.inputLabel = label;
  }

  @Output() changeInput = new EventEmitter<string>();


  myControl = new FormControl();
  options: User[] = [
    {name: 'Mary'},
    {name: 'Shelley'},
    {name: 'Igor'}
  ];
  filteredOptions: Observable<User[]>;
  inputLabel: string;
   
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
      case knownMastersAutocomplete.orders:
        return knowMastersAutocompleteHeaderName.orders;
      default:
        return knowMastersAutocompleteHeaderName.orders;
    }
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.options.slice())
    );
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }


  
  onModelChanged(value: string): void {
    // this.inputModel = value;
     this.changeInput.next(value)
   }
}
