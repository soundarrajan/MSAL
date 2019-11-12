import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventsLogGridViewModel } from './view-model/events-log-grid.view-model';
import { IQcEventsLogItemState } from '../../../../../store/report-view/details/qc-events-log-state.model';
import { Store } from '@ngxs/store';
import { QcReportDetailsService } from '../../../../../services/qc-report-details.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'shiptech-events-log',
  templateUrl: './events-log.component.html',
  styleUrls: ['./events-log.component.scss'],
  providers: [EventsLogGridViewModel]
})
export class EventsLogComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject();

  constructor(public gridViewModel: EventsLogGridViewModel,
              private detailsService: QcReportDetailsService) {
  }

  ngOnInit(): void {
  }

  updateEventDetails(item: IQcEventsLogItemState, newEventDetails: string): void {
    this.detailsService.updateEventLog(item.id, newEventDetails);
  }

  remove(item: IQcEventsLogItemState): void {
    this.detailsService.removeEventLog(item.id);
  }

  add(): void {
    this.detailsService.addEventLog();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
