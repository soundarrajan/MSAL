import { Directive, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { ITemplateRendererParams } from './ag-cell-template.component';
import { ITypedCellRendererColDef } from '../type.definition';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[appAgCellTemplate]'
})
export class AgCellTemplateDirective implements OnChanges {
  @Input() columnDef: ITypedCellRendererColDef<ITemplateRendererParams> | ITypedCellRendererColDef<ITemplateRendererParams>[];

  constructor(public template: TemplateRef<any>) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.columnDef) {
      return;
    }

    if (Array.isArray(this.columnDef)) {
      this.columnDef.forEach(colDef => {
        colDef.cellRendererParams = colDef.cellRendererParams || {};
        colDef.cellRendererParams.ngTemplate = this.template;
      });
    } else {
      this.columnDef.cellRendererParams = this.columnDef.cellRendererParams || {};
      this.columnDef.cellRendererParams.ngTemplate = this.template;
    }
  }
}
