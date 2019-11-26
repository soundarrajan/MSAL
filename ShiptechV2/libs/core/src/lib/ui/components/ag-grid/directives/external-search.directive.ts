import { Attribute, Directive, Input, OnDestroy, Optional, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { SearchBoxComponent } from '../../search-box/search-box.component';
import * as postal from 'postal';
import { PostalChannelsEnum } from '../../../../../../../feature/quantity-control/src/lib/core/postal/channels.postal';
import { tap } from 'rxjs/operators';


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'shiptech-search-box[appExternalSearch], ag-grid-angular[appExternalSearch]'
})
export class AgGridExternalSearchDirective implements OnDestroy {
  private _destroy$: Subject<any> = new Subject();
  @Input() gridId: string;
  @Input() onSearch: (value: string) => void;

  constructor(
    @Attribute('id') private elementId: string,
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
    this.searchBox.valueChanged.pipe(
      tap(value => postal.publish({
        channel: PostalChannelsEnum.Search,
        topic: this.gridId,
        data: value
      }))
    ).subscribe()
  }

  processAgGridEvents(): void {
    postal.subscribe({
      channel: PostalChannelsEnum.Search,
      topic: this.elementId,
      callback: data => this.onSearch(data)
    })
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
