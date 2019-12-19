import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { IDateAngularComp } from 'ag-grid-angular';
import { IDateParams } from 'ag-grid-community';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ag-date-picker',
  template: `
    <p-calendar [(ngModel)]="date" showTime="true" hourFormat="24" showButtonBar="true" appendTo="body" panelStyleClass="ag-custom-component-popup" [locale]="locale"></p-calendar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgDatePickerComponent implements IDateAngularComp {

  public date: Date;
  private params: IDateParams;
  private picker: any;

  public locale: any = {
    firstDayOfWeek: 1,
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'dd/mm/yyyy',
    weekHeader: 'Wk'
  };

  constructor(private changeDetector: ChangeDetectorRef) {
  }

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
  }
}
