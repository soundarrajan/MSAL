import {
  Attribute,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output
} from '@angular/core';
import { Subject } from 'rxjs';
import { SearchBoxComponent } from '../components/search-box/search-box.component';
import * as postal from 'postal';
import { PostalChannelsEnum } from '../../../../../feature/quantity-control/src/lib/core/postal/channels.postal';
import { tap } from 'rxjs/operators';
import { AgGridAngular } from '@ag-grid-community/angular';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector:
    // tslint:disable-next-line:directive-selector
    'shiptech-search-box[appExternalSearch], ag-grid-angular[appExternalSearch]',
  exportAs: 'search-id'
})
export class AgGridExternalSearchDirective implements OnDestroy {
  @Input() gridId: string;
  @Output() search = new EventEmitter<string>();
  private _destroy$: Subject<any> = new Subject();

  private _agGridSubscription: ISubscriptionDefinition<any>;

  constructor(
    @Attribute('id') public id: string,
    @Optional() private agGrid: AgGridAngular,
    @Optional() private searchBox: SearchBoxComponent
  ) {
    if (searchBox) {
      this.processSearchBoxEvents();
    }
    if (agGrid) {
      this.processAgGridEvents();
    }
  }

  processSearchBoxEvents(): void {
    this.searchBox.search
      .pipe(
        tap(value =>
          postal.publish({
            channel: PostalChannelsEnum.Search,
            topic: this.gridId,
            data: value
          })
        )
      )
      .subscribe();
  }

  processAgGridEvents(): void {
    this._agGridSubscription = postal.subscribe({
      channel: PostalChannelsEnum.Search,
      topic: this.id,
      callback: data => this.search.next(data)
    });
  }

  ngOnDestroy(): void {
    // eslint-disable-next-line no-unused-expressions
    this._agGridSubscription?.unsubscribe();

    this._destroy$.next();
    this._destroy$.complete();
  }
}
