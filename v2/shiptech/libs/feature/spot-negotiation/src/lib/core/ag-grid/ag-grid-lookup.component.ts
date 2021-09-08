import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'numeric-cell',
  template: `
    <mat-form-field style="width:185px">
      <input
        matInput
        [placeholder]="this.placeHolder"
        name="{{ this.inputElId }}"
        id="{{ this.inputElId }}"
        (input)="checkAutoComplete($event)"
        [matAutocomplete]="auto"
        [(ngModel)]="valueField"
        [value]="valueField"
        #input
      />
    </mat-form-field>

    <mat-autocomplete
      #auto="matAutocomplete"
      [displayWith]="displayFn.bind(this)"
      class="dark-autocomplete"
      style="margin-top: 5px;"
    >
      <mat-option
        *ngFor="let item of this.selectList"
        matTooltip="{{ item }}"
        (onSelectionChange)="updateValueFromSelectionChange($event)"
        [value]="item[controlName]"
      >
        {{ item }}</mat-option
      >
    </mat-autocomplete>
  `
})
export class AgGridLookupEditor
  implements ICellEditorAngularComp, AfterViewInit {
  private params: any;
  public value: number;
  private cancelBeforeStart: boolean = false;

  @ViewChild('input', { read: ViewContainerRef }) public input;

  oldCellValue: string;
  valueField: string;
  controlName = undefined;
  controlId = undefined;
  TenantId = 1;
  selectList: string[] = ['One', 'Two', 'Three'];
  placeHolder = '';
  urlActionCode = undefined;
  inputElId = 'test';
  isValueSelectedFromDropdown = false;

  agInit(params: any): void {
    this.params = params;
    this.valueField = params.value;
    this.oldCellValue = params.value;
    console.log('Calling lookup editor');
  }

  getValue(): any {
    if (this.isValueSelectedFromDropdown == true) return this.valueField;
    else return this.oldCellValue;
  }

  isCancelBeforeStart(): boolean {
    return this.cancelBeforeStart;
  }

  // will reject the number if it greater than 1,000,000
  // not very practical, but demonstrates the method.
  isCancelAfterEnd(): boolean {
    return false;
  }

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    setTimeout(() => {
      this.input.element.nativeElement.focus();
    });
  }

  /* =================================================== */

  constructor() {}

  updateValueFromSelectionChange(event) {
    this.valueField = event.source.value;
    this.isValueSelectedFromDropdown = true;
  }

  /**
   * The function called when the autocomplete event of the matInput is fired
   * @param event
   */
  public checkAutoComplete(event) {
    if (event.target.value.length > 1) {
      this.buildSRCForAutoComplete(event.target.value, event.target);
    }
  }

  /**
   * The function called when the displayWith attribute is being binded
   * @param valueToBeDisplayed
   */
  displayFn(valueToBeDisplayed: string) {
    let retVal;
    if (this.selectList != undefined) {
      retVal = this.selectList.find(x => x === valueToBeDisplayed);
    }
    return retVal ? retVal.name : valueToBeDisplayed;
  }
  /**
   * The Function Called to create the source for the autocomplete
   * @param valuetosearch
   * @param target
   */
  buildSRCForAutoComplete(valuetosearch, target): any {}
}
