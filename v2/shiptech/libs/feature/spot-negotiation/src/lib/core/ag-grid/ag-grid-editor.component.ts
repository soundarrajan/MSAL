import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'ag-grid-editor-cell',
  template: `
    <div
      #container
      tabindex="0"
      (keydown)="onKeyDown($event)"
      (click)="$event.stopPropagation()"
    >
      <div class="editbubble">
        <span>
          <input type="text" [(ngModel)]="value" />
          <select placeholder="Select" [(ngModel)]="unit" name="unit">
            <option value="GAL">GAL</option>
            <option value="MT">MT</option>
            <option value="BBL">BBL</option>
          </select>
        </span>
        <div class="btn-container">
          <a class="btn" (click)="onCancel()">Cancel</a>
          <a class="btn" (click)="onSave()">Save</a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .editbubble {
        position: static;
        width: 201px;
        height: 85px;
        padding: 10px;
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
export class AGGridEditorComponent
  implements ICellEditorAngularComp, AfterViewInit {
  private params: any;
  @ViewChild('container', { read: ViewContainerRef }) public container;
  @ViewChild('unitSelect') mySelect;
  public value: string;
  public unit: string;

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    setTimeout(() => {
      this.container.element.nativeElement.focus();
    });
  }

  agInit(params: any): void {
    this.params = params;
    this.setValue(params.value.split(' ')[0]);
    this.setUnit(params.value.split(' ')[1]);
  }

  getValue(): any {
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

  toggleData(): void {
    // this.setValue(this.value);
    if (this.value != '' && this.unit != '') {
      this.setValue(this.value + ',' + this.unit);
      this.params.api.stopEditing();
    }
  }

  onSave() {
    if (this.value != '' && this.unit != '') {
      this.setValue(this.value + ',' + this.unit);
      this.params.api.stopEditing();
    }
    this.params.api.stopEditing(true);
  }

  onCancel() {
    this.params.api.stopEditing(true);
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
      this.onSave();
    }
  }
}
