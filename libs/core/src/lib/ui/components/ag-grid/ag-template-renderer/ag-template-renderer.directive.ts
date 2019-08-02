import { Directive, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { ITemplateRendererParams } from './ag-template-renderer.component';
import { TypedColDef } from '../type.definition';

@Directive({
  selector: '[appTemplateRenderer]'
})
export class AgTemplateRendererDirective implements OnChanges {
  @Input() columnDef: TypedColDef<ITemplateRendererParams> | TypedColDef<ITemplateRendererParams>[];

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
