import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {nameof} from '@shiptech/core/utils/type-definitions';
import {LegacyLookupsDatabase} from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import {Observable, throwError} from 'rxjs';
import {ServerGridConditionFilterEnum} from '@shiptech/core/grid/server-grid/server-grid-condition-filter.enum';
import {IDisplayLookupDto} from '@shiptech/core/lookups/display-lookup-dto.interface';
import {fromPromise} from 'rxjs/internal-compatibility';
import {MasterAutocompleteComponent} from '@shiptech/core/ui/components/master-autocomplete/master-autocomplete.component';

@Component({
  selector: 'shiptech-documents-autocomplete',
  templateUrl: './documents-autocomplete.component.html',
  styleUrls: ['./documents-autocomplete.component.scss'],
  exportAs: 'documentsMasterAutocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsAutocompleteComponent extends MasterAutocompleteComponent {

  constructor(private legacyLookupsDatabase: LegacyLookupsDatabase, changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }

  protected getFilterResults(query: string): Observable<IDisplayLookupDto[]> {
    // Note: Dexie.js is not efficient with filter or contains like, because it executes the lambda for each row.
    return this.filterOp === ServerGridConditionFilterEnum.STARTS_WITH
      ? fromPromise(this.legacyLookupsDatabase.documentType.where(this.field).startsWithIgnoreCase(query).toArray())
      : throwError(`${DocumentsAutocompleteComponent.name} supports only ${ServerGridConditionFilterEnum.STARTS_WITH} values for ${nameof<DocumentsAutocompleteComponent>('field')}`);
  }

}
