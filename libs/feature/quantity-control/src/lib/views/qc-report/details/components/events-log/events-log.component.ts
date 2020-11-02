import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core';
import { EventsLogGridViewModel } from './view-model/events-log-grid.view-model';
import { IQcEventsLogItemState } from '../../../../../store/report/details/qc-events-log-state.model';
import { Select } from '@ngxs/store';
import { QcReportService } from '../../../../../services/qc-report.service';
import { Observable, Subject } from 'rxjs';
import { QcReportState } from '../../../../../store/report/qc-report.state';
import { ToastrService } from 'ngx-toastr';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'shiptech-events-log',
  templateUrl: './events-log.component.html',
  styleUrls: ['./events-log.component.scss'],
  providers: [EventsLogGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class EventsLogComponent implements OnInit, OnDestroy {
  @Select(QcReportState.isReadOnly) isReadOnly$: Observable<boolean>;
  @ViewChild('somePopup', { read: ElementRef, static: false }) somePopup: ElementRef

  private _destroy$ = new Subject();

  constructor(
    public gridViewModel: EventsLogGridViewModel,
    private detailsService: QcReportService,
    private toastr: ToastrService,
    private eRef: ElementRef
  ) {
  }

  ngOnInit(): void {}

  update(item: IQcEventsLogItemState, newEventDetails: string): void {
    this.detailsService.updateEventLog(item.id, newEventDetails);
  }

  remove(item: IQcEventsLogItemState): void {
    this.detailsService.removeEventLog(item.id);
  }

  add(): void {
    if (this.gridViewModel.gridOptions.api.isAnyFilterPresent()) {
      this.toastr.info(
        'Events grid has an active filter, new rows may not appear.'
      );
    }

    this.detailsService.addEventLog();
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(this.eRef.nativeElement.contains(event.target)) {
      if (event.target.innerHTML === 'Reset Filter' || event.target.innerHTML === 'Apply Filter') {
        const test = document.querySelectorAll<HTMLElement>('.ag-menu');
        test[0].style.display = 'none';
      }
     
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
