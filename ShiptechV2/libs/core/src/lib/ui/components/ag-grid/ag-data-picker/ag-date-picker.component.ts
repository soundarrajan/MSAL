import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild
} from '@angular/core';
import { IDateParams } from '@ag-grid-community/core';
import { Calendar } from 'primeng/calendar';
import { IDateAngularComp } from '@ag-grid-community/angular';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-date-picker',
  template: `
    <div style="margin: auto">
      <p-calendar
        [(ngModel)]="date"
        (onSelect)="calendar.hideOverlay(); onSelect($event)"
        #calendar
        showTime="true"
        hourFormat="24"
        appendTo="body"
        panelStyleClass="ag-custom-component-popup"
        [showIcon]="true"
        [locale]="locale"
      ></p-calendar>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgDatePickerComponent implements IDateAngularComp, AfterViewInit {
  @ViewChild(Calendar, { static: false }) calendar: Calendar;

  public date: Date;

  public locale: any = {
    firstDayOfWeek: 1,
    dayNames: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    monthNamesShort: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'dd/mm/yyyy',
    weekHeader: 'Wk'
  };
  private params: IDateParams;

  constructor(private changeDetector: ChangeDetectorRef) {}

  refresh(params: IDateParams): boolean {
    return true;
  }

  agInit(params: IDateParams): void {
    this.params = params;
  }

  getDate(): Date {
    return this.date;
  }

  setDate(date: Date): void {
    this.date = date || null;
    this.calendar.hideOverlay();

    this.changeDetector.markForCheck();
  }

  ngAfterViewInit(): void {}

  onSelect(date: Date): void {
    this.params.onDateChanged();
  }
}
