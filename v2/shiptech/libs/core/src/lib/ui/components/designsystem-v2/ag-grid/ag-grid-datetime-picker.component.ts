import { AfterViewInit, Component, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import * as _moment from 'moment';
import { MatMenuTrigger } from '@angular/material/menu';
const moment = _moment;
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-date-cell-editor',
  template: `
  <div (click)="picker.open()">
	<div class="d-flex align-items-start justify-content-between">

		<input
      matInput
      class="date-trigger"
      [matDatepicker]= "picker"
      (dateChange)="dateChanged($event)"
      #datetrigger
      [formControl]="initialDate" style="width:80px;">

		<input #timepicker matInput
      [owlDateTimeTrigger]="dateInputField" [value]="currentDate | dateFilter:dateFormat" class="date-trigger" style="width:40px;">
      
		<mat-datepicker-toggle [for]="picker">
			<mat-icon matDatepickerToggleIcon [svgIcon]="'data-picker-gray'">
			</mat-icon>
		</mat-datepicker-toggle>
		<mat-datepicker panelClass="new-datepicker" #picker (opened)="opened()"></mat-datepicker>

    <input
    class="shadow-input"
    [(ngModel)]="currentDate"
    [owlDateTime]="dateInputField"
    (dateTimeChange)="onChange($event)">

		<div class="time-pick-container">
			<owl-date-time [pickerType]="'timer'" #dateInputField panelClass="timerPanelClass"
				(afterPickerClosed)="timepickerClosed()" (afterPickerOpen)="timepickerOpened()"></owl-date-time>
		</div>
	</div>
</div>

  `
})
export class AgGridDatetimePickerV2Component implements ICellEditorAngularComp {
  private params: any;
  timerValue: any;
  initialDate = new FormControl();
  dateFormat = "HH:mm"
  // formatList = [
  //   'y/M/d',
  //   'y/MM/d',
  //   'dd-MM-yy',
  //   'hh:mm MM/dd/yyyy', 
  //   'hh:mm MM/dd/yyyy', 
  //   'hh:mm:ss MM/dd/yy',
  //   'HH:mm:ss MM/dd/yy',
  //   'hh:mm:ss MMM/dd/yy',
  //   'hh:mm:ss MMMM/dd/yy',
  //   'hh:mm:ss MMMM/d/yy',
  //   'hh:mm:ss MMMM/dd/yyyy',
  //   'M-dd-yy h:mm'
  //   ];
  currentDate = new Date();
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'data-picker-gray',
      sanitizer.bypassSecurityTrustResourceUrl('../assets/customicons/calendar-dark.svg'));
  }
  @ViewChild('picker') picker;
  @ViewChild('datetrigger') datetrigger: ElementRef<HTMLElement>;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('timepicker') timepicker: ElementRef<HTMLElement>;
  @ViewChild('dateInputField') dateInputField;

  agInit(params: any): void {
    this.params = params;
    this.initialDate.setValue(new Date(this.params.value));
  }

  dateChanged(event) {
  }
  getValue(): any {
  }
  timepickerClosed() {
  }

  timepickerOpened() {

    var div = document.createElement("div");
    div.classList.add("calendar-picker-toggle");
    div.onclick = () => {
      var elements = document.getElementsByClassName('owl-dt-control')[1] as HTMLElement;
      elements.click();
      this.dateInputField.close();
      this.picker.open();
    };
    var element = document.getElementsByClassName('owl-dt-container-inner');
    element[0].appendChild(div);


  }

  opened() {

    var div = document.createElement("div");
    div.classList.add("time-picker-toggle");
    var div1 = document.createElement("div");
    div1.classList.add("time-picker-toggle-container");
    div1.appendChild(div);
    div.onclick = () => {
      this.picker.close();
      let el: HTMLElement = this.timepicker.nativeElement;
      el.click();
    };
    var element = document.getElementsByTagName('mat-datepicker-content');
    element[0].appendChild(div1);

  }
  onChange(event) {
  }
}
