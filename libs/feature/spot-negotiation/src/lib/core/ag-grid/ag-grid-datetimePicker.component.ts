import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  Renderer2
} from '@angular/core';

import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'ag-grid-datetimepicker-cell',
  template: `
    <div #container tabindex="0" (keydown)="onKeyDown($event)" *ngIf="show">
      <div class="editbubble dateTime-picker">
        <mat-form-field class="no-shadow-form">
          <input matInput [matDatepicker]="picker" style="display:none;" />
          <mat-datepicker-toggle
            matSuffix
            [for]="picker"
            id="trigger"
            #trigger
            style="display:none;"
          ></mat-datepicker-toggle>
          <mat-datepicker
            id="noshadow"
            #picker
            class="custom-calendar"
          ></mat-datepicker>
        </mat-form-field>
        <input
          placeholder=""
          [(ngModel)]="dateTime"
          [owlDateTimeTrigger]="timer"
          [owlDateTime]="timer"
          class="timer-trigger"
        />
        <owl-date-time
          #timer
          [pickerType]="'timer'"
          panelClass="timer-picker"
          class="timer-pick"
          (afterPickerClosed)="closed()"
        ></owl-date-time>
        <div
          class="btn-block"
          style="position:absolute; bottom: 12px;left: 0;border-top: 1px solid rgba(0,0,0,.12);padding-top: 7px;"
        >
          <button
            mat-button
            style="position: relative;top: 3px;float: left;left: 22px;"
          >
            CANCEL
          </button>
          <button
            class="blue-button"
            mat-button
            style="width:100px;position: relative;top: 3px;float: right;right: 22px;"
          >
            PROCEED
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .timer-trigger {
        position: absolute;
        left: -10px;
      }
      .owl-dt-popup-container {
        position: absolute !important;
        top: 275px !important;
        left: -113px !important;
        width: 300px !important;
      }

      .editbubble {
        position: static;
        padding: 10px;
        width: 300px;
        height: 503px;
      }

      .mat-datepicker-content {
        box-shadow: none !important;
      }
      .md-select-menu-container {
        z-index: 104;
      }
      input {
        width: 75px;
        border: none;
        box-shadow: 0px 2px 0px 0px #eaecee;
      }
      input:focus {
        box-shadow: 0px 2px 0px 0px #74cdea;
        border-bottom: none;
      }
      select {
        border: 0;
        outline: 0;
        background-color: transparent;
        box-shadow: 0px 2px 0px 0px #eaecee;
        margin-bottom: -4px;
        padding-bottom: 4px;
        margin-left: 20px;
      }
      select:focus {
        box-shadow: 0px 2px 0px 0px #74cdea;
        border: 0;
      }
      .btn-container {
        margin: 10px;
      }
    `
  ]
})
export class AGGridDateTimePickerComponent
  implements ICellEditorAngularComp, AfterViewInit {
  private params: any;
  public show: boolean = true;
  public dateTime: any;
  constructor(public el: ElementRef, private renderer: Renderer2) {}

  @ViewChild('container', { read: ViewContainerRef }) public container;
  @ViewChild('unitSelect') mySelect;
  //@ViewChild('noShadow-datepicker') picker;
  //@ViewChild('trigger', {static: true, read: ElementRef}) trigger: ElementRef;

  //@ViewChild('trigger') trigger: ElementRef<HTMLElement>;
  //@ViewChild('inputTrigger') private elementRef: ElementRef;
  @ViewChild('picker') picker;
  @ViewChild('timer') timer;

  public value: string;
  public unit: string;

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    this.picker.open();
    this.timer.open();
    setTimeout(() => {
      //this.container.element.nativeElement.focus();
    });
    document
      .getElementsByClassName('mat-datepicker-content')[0]
      .classList.add('parent-datepicker');
    // document.getElementsByClassName("custom-datepicker")[0].parentElement.style.boxShadow='none';
    // var overlay = document.getElementsByClassName("custom-datepicker")[0].parentElement.parentElement.parentElement.parentElement;
    // overlay.style.width='0';
    // let el: HTMLElement = this.trigger.nativeElement;
    // el.click();
    // setTimeout(function() {
    //     this.trigger.nativeElement.click();
    //     this.trigger.triggerEventHandler('click', null);
    //   }, 1000);
    //     let el: HTMLElement = this.trigger.nativeElement;
    //   el.click();
    //document.getElementById("trigger").click();
    //this.renderer.appendChild(this.container.nativeElement, this.timer.nativeElement)
  }

  agInit(params: any): void {
    //this.picker.open();

    this.params = params;
    this.setValue(params.value.split(' ')[0]);
    this.setUnit(params.value.split(' ')[1]);
    // noShadow();
    //this.fileInput.nativeElement.click()
    //alert("");

    // setTimeout(function() {
    //   this.trigger.nativeElement.click();
    //   this.trigger.triggerEventHandler('click', null);
    // }, 1000);
    //     let el: HTMLElement = this.trigger.nativeElement;
    //   el.click();
    //document.getElementById("trigger").click();
  }

  getValue(): any {
    //this.params.api.stopEditing(false);
    // return false;

    //this.params.api.stopEditing(true);

    return this.value;
  }

  isPopup(): boolean {
    return true;
  }

  setValue(val: string): void {
    this.value = val;
  }

  setUnit(unit: string): void {
    this.unit = unit;
  }

  toggleData(): void {}

  onSave() {
    // if(this.value!="" && this.unit!=""){
    //     this.setValue(this.value+","+this.unit);
    //     this.params.api.stopEditing();
    // }
    // this.params.api.stopEditing(true);
  }

  onCancel() {
    // this.params.api.stopEditing(true);
  }

  onKeyDown(event): void {
    let key = event.which || event.keyCode;
    if (
      key == 37 || // left
      key == 39
    ) {
      // right
      // this.toggleData();
      // event.stopPropagation();
      this.onSave();
    }
  }

  onEnter(evt) {
    if (evt.source.selected) {
      // evt.stopPropagation();
      // this.onSave();
    }
  }

  destroy() {}

  closed() {
    this.show = false;
    this.picker.close();
  }
}
