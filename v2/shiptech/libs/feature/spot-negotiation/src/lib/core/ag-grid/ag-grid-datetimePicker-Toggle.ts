import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
//import { JsonSchemaFormService } from '../../JSONSchemaForm/json-schema-form.service';
//import { AppContext } from '@techoil/core';

import * as _moment from 'moment';
import { MatMenuTrigger } from '@angular/material/menu';
const moment = _moment;
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-date-time-toggle',
  template: `
    <div
      (click)="$event.stopPropagation(); picker.open()"
      style="cursor:pointer;float: left;position:relative;font-size: 12px;color: #ffffff;
  font-weight: 500;"
    >
      <div style="cursor:pointer;float: left;width: 90px;margin-top: 8px;">
        <input
          style="cursor:pointer;width:65px;float:left;height: 17px !important;text-align:left;"
          matInput
          class="date-trigger"
          [formControl]="initialDate"
          [ngModel]="initialDate.value"
          [matDatepicker]="picker"
          (dateChange)="dateChanged($event)"
          #datetrigger
        />
        <div
          style="height:15px;float:right;line-height:15px;width:30px;position: absolute;
    right: -1px;"
        >
          {{ timeValue }}
        </div>
      </div>
    </div>
    <mat-datepicker-toggle matSuffix [for]="picker">
      <mat-icon matDatepickerToggleIcon class="mini-dateIcon"></mat-icon>
    </mat-datepicker-toggle>
    <mat-datepicker
      [panelClass]="
        dark ? 'new-datepicker datepicker-darktheme' : 'new-datepicker'
      "
      #picker
      (opened)="opened()"
    ></mat-datepicker>

    <input
      #timepicker
      [(ngModel)]="timerValue"
      (dateTimeChange)="onChange($event)"
      [owlDateTimeTrigger]="dt"
      [owlDateTime]="dt"
      style="position: relative;top: -19px;
               width: 100px;visibility:hidden;border: none"
    />
    <div class="time-pick-container">
      <owl-date-time
        [pickerType]="'timer'"
        #dt
        [panelClass]="
          dark ? ['timerPanelClass', 'darktheme'] : 'timerPanelClass'
        "
        (afterPickerClosed)="timepickerClosed()"
        (afterPickerOpen)="timepickerOpened()"
      ></owl-date-time>
    </div>
  `
})
export class AgGridDatetimePickerToggleComponent
  implements ICellEditorAngularComp, AfterViewInit {
  private params: any;
  public matDate = new Date();
  // matDate.setValue('1/1/2021');
  valueField: any;
  oldCellValue: string;
  timeValue: any = '12:12';
  timerValue: any;
  newFormattedValue: string;
  matDateFieldWidth = '100px';
  initialDate = new FormControl(new Date());
  public dateTime;
  @Input() dark: any;
  constructor() {
    //this.appContext = appContext || AppContext.instance;
  }
  @ViewChild('dateInputFlde', { read: ViewContainerRef }) public input;
  @ViewChild('picker') picker;
  @ViewChild('dt') dt;
  @ViewChild('timepicker') timepicker: ElementRef<HTMLElement>;
  @ViewChild('datetrigger') datetrigger: ElementRef<HTMLElement>;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @Output() onDatePicked = new EventEmitter();
  agInit(params: any): void {
    this.params = params;
    this.valueField = '12/12/2018 10:10';
    this.oldCellValue = params.value;
    this.initialDate.setValue(new Date(this.valueField));
    this.timeValue = this.valueField.slice(-6);
    //var timervalue = this.timeValue;
    //console.log(this.timeValue);
    var showTime = this.timeValue.split(':');
    this.timerValue = new Date(0, 0, 0, showTime[0], showTime[1]);
    //console.log(this.timerValue);
    // let d = new Date(this.valueField);
    // let h = (d.getHours()<10?'0':'') + d.getHours();
    // let m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    // let i = h + ':' + m;
    // this.timeValue = i;
    this.newFormattedValue = params.value;
    this.matDateFieldWidth = params.matDateFieldWidth - 16 + 'px';
  }

  onChange(event) {
    //alert("");
    //console.log(event.value);
    this.timeValue = event.value.getHours() + ':' + event.value.getMinutes();
    let h = (event.value.getHours() < 10 ? '0' : '') + event.value.getHours();
    let m =
      (event.value.getMinutes() < 10 ? '0' : '') + event.value.getMinutes();
    this.timeValue = h + ':' + m;
    //this.timeValue = "10:15";
  }
  dateChanged(event) {
    const closeFn = this.picker.close;
    this.picker.close = () => {};
    this.picker[
      '_popupComponentRef'
    ].instance._calendar.monthView._createWeekCells();
    setTimeout(() => {
      this.picker.close = closeFn;
    });
  }

  timepickerClosed() {
    //alert("");
    //var elements = document.getElementsByClassName('owl-dt-control')[1] as HTMLElement;
    //console.log(elements[1]);
    //elements.click();
    //alert(this.timeValue);
    this.onDatePicked.emit({ date: this.initialDate, time: this.timeValue });
  }

  timepickerOpened() {
    /*var arrowclick = document.getElementsByClassName('owl-dt-control-arrow-button');
    let i;
    for (i = 0; i < arrowclick.length; i++) {
      arrowclick[i].addEventListener("click",function() {
        var elements = document.getElementsByClassName('owl-dt-control')[1] as HTMLElement;
        //console.log(elements[1]);
        elements.click();
        event.stopPropagation();
        //this.dt.open();
        });
    }*/
    var div = document.createElement('div');
    div.classList.add('calendar-picker-toggle');
    //div.classList.add("calendar-picker-toggless");
    div.onclick = () => {
      //alert("blabla");
      //this.picker.open();
      //this.trigger.openMenu();
      //this.time.open();
      //this.timepicker.nativeElement.click();
      var elements = document.getElementsByClassName(
        'owl-dt-control'
      )[1] as HTMLElement;
      //console.log(elements[1]);
      //elements.click();
      this.dt.close();
      this.picker.open();
      //   setTimeout(() => {
      //   let el: HTMLElement = this.datetrigger.nativeElement;
      //   el.click();
      //  })
      //  setTimeout(() => {
      //   let el1: HTMLElement = this.timepicker.nativeElement;
      //   el1.click();
      //   },3000)
    };
    //setTimeout(() => {
    var element = document.getElementsByClassName('owl-dt-container-inner');
    element[0].appendChild(div);
    //})
  }

  opened() {
    var div = document.createElement('div');
    div.classList.add('time-picker-toggle');
    var div1 = document.createElement('div');
    div1.classList.add('time-picker-toggle-container');
    div1.appendChild(div);
    div.onclick = () => {
      //alert("blabla");
      this.picker.close();
      //this.trigger.openMenu();
      //this.time.open();
      let el: HTMLElement = this.timepicker.nativeElement;
      el.click();
    };

    if (this.dark) {
      var element = document.getElementsByTagName('mat-datepicker-content');
      element[0].classList.add('darktheme');
      element[0].appendChild(div1);
    } else {
      //setTimeout(() => {
      var element = document.getElementsByTagName('mat-datepicker-content');
      element[0].appendChild(div1);
    }
    //})
  }

  getValue(): any {
    this.valueField = this.initialDate.value;
    // adjust 0 before single digit date
    let date = ('0' + this.valueField.getDate()).slice(-2);

    // current month
    let month = ('0' + (this.valueField.getMonth() + 1)).slice(-2);

    // current year
    let year = this.valueField.getFullYear();
    if (this.timeValue) {
      return month + '/' + date + '/' + year + ' ' + this.timeValue;
      //return( month + "/" + date+ "/" + year);
    } else return month + '/' + date + '/' + year;
    //return(this.valueField.getMonth()+'/'+this.valueField.getDate()+'/'+this.valueField.getFullYear()+" "+this.timeValue.getHours()+":"+this.timeValue.getMinutes())
    // .format(this.appContext.tenantSettingsContext.dateTimeFormat)
    // .substring(0, 19);
  }

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    //this.matDate.setValue('1/1/2021');
    setTimeout(() => {
      //this.input.element.nativeElement.focus();
      //this.picker.open();
    });
  }

  getDateValue(event: MatDatepickerInputEvent<Date>) {
    alert('');
    // this.newFormattedValue =
    //   moment
    //     .utc(event.value)
    //     .local()
    //     .format(this.appContext.tenantSettingsContext.dateFormat) +
    //   ' ' +
    //   this.oldCellValue.substring(11, 16);
  }
  onBlur(): any {
    var selectedCell = this.params.column.colId;
    //this.params.data[selectedCell] = moment(this.valueField).format(this.appContext.tenantSettingsContext.dateTimeFormat).substring(0, 19);
    //this.objJSF.send('refreshSelectedRow');
  }

  pickerOpen() {
    //alert("");
    this.picker.open();
  }
}
