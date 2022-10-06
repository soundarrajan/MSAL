import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { ColDef } from '@ag-grid-community/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[appAgColumnHeaderTemplate]'
})
export class AgColumnHeaderTemplateDirective implements OnChanges {
  // Note: Consider refactor to accept multiple columnDefs
  @Input() columnDef: ColDef | ColDef[];

  constructor(public template: TemplateRef<any>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.columnDef) {
      return;
    }

    if (Array.isArray(this.columnDef)) {
      this.columnDef.forEach(colDef => {
        colDef.headerComponentParams = colDef.headerComponentParams || {};
        colDef.headerComponentParams.ngTemplate = this.template;
      });
    } else {
      this.columnDef.headerComponentParams =
        this.columnDef.headerComponentParams || {};
      this.columnDef.headerComponentParams.ngTemplate = this.template;
    }
  }
}
