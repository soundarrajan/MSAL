import { Attribute, Directive, Input, OnDestroy, Optional, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { SearchBoxComponent } from '../components/search-box/search-box.component';
import * as postal from 'postal';
import { PostalChannelsEnum } from '../../../../../feature/quality-control/src/lib/core/postal/channels.postal';
import { tap } from 'rxjs/operators';


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'shiptech-search-box[AgGridExternalSearch], ag-grid-angular[AgGridExternalSearch]'
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
    console.log('Search box id', this.gridId);
    this.searchBox.valueChanged.pipe(
      tap(value => postal.publish({
        channel: PostalChannelsEnum.Search,
        topic: this.gridId,
        data: value
      }))
    ).subscribe()
  }

  processAgGridEvents(): void {
    console.log('Grid id', this.elementId);
    postal.subscribe({
      channel: PostalChannelsEnum.Search,
      topic: this.elementId,
      callback: data => {
        console.log('Data from grid', data, this.agGrid);
        this.onSearch(data);
        // this.agGrid.api.purgeServerSideCache();
      }
    })
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
