import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  HostListener
} from '@angular/core';
import { EventsLogGridViewModel } from './view-model/events-log-grid.view-model';
import { IQcEventsLogItemState } from '../../../../../store/report/details/qc-events-log-state.model';
import { Select } from '@ngxs/store';
import { QcReportService } from '../../../../../services/qc-report.service';
import { Observable, Subject } from 'rxjs';
import { QcReportState } from '../../../../../store/report/qc-report.state';
import { ToastrService } from 'ngx-toastr';

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
  private _destroy$ = new Subject();

  constructor(
    public gridViewModel: EventsLogGridViewModel,
    private detailsService: QcReportService,
    private toastr: ToastrService
  ) {}

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

  @HostListener('click')
  clickInside($event) {
    if (this.gridViewModel.actionsColumn.cellRendererParams.ngTemplate._projectedViews) {
      if (this.gridViewModel.actionsColumn.cellRendererParams.ngTemplate._projectedViews.length) {
        let element = document.querySelector<HTMLElement>("#quantityControlEventsLog > .ag-root-wrapper > :not(.ag-theme-balham) + .ag-theme-balham > .ag-menu ");
        if (element) {
          element.style.marginTop = this.gridViewModel.actionsColumn.cellRendererParams.ngTemplate._projectedViews.length == 1 ? "-80px" : "-" + (this.gridViewModel.actionsColumn.cellRendererParams.ngTemplate._projectedViews.length * 42 + 30) + "px";
        }
      }

    }
    
  }
  

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
