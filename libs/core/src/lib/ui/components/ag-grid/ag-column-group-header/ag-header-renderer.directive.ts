import { Directive, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { ColGroupDef } from 'ag-grid-community';

@Directive({
  selector: '[appHeaderRenderer]'
})
export class AgHeaderRendererDirective implements OnChanges {
  // Note: Consider refactor to accept multiple columnDefs
  @Input() columnDef: ColGroupDef | ColGroupDef[];

  constructor(public template: TemplateRef<any>) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.columnDef) {
      return;
    }

    if (Array.isArray(this.columnDef)) {
      this.columnDef.forEach(colDef => {
        colDef.headerGroupComponentParams = colDef.headerGroupComponentParams || {};
        colDef.headerGroupComponentParams.ngTemplate = this.template;
      });
    } else {
      this.columnDef.headerGroupComponentParams = this.columnDef.headerGroupComponentParams || {};
      this.columnDef.headerGroupComponentParams.ngTemplate = this.template;
    }
  }
}
