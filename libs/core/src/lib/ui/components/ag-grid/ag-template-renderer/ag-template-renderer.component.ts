import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ColDef, Column, ICellRendererParams } from 'ag-grid-community';

export interface ITemplateRendererParams extends Partial<ICellRendererParams> {
  ngTemplate?: TemplateRef<any>;
}

@Component({
  selector: 'app-template-renderer',
  template: `
    <ng-container *ngTemplateOutlet="template; context: templateContext"></ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgTemplateRendererComponent implements ICellRendererAngularComp {
  template: TemplateRef<any>;
  templateContext: { $implicit: any; params: ITemplateRendererParams; data: any; value: any; valueFormatted: string; columnDef: ColDef; column: Column };

  constructor(private changeDetector: ChangeDetectorRef) {}

  refresh(params: ITemplateRendererParams): boolean {
    this.templateContext = {
      $implicit: params.data,
      params,
      data: params.data,
      value: params.value,
      valueFormatted: params.valueFormatted,
      columnDef: params.colDef,
      column: params.column
    };
    this.changeDetector.markForCheck();
    return true;
  }

  agInit(params: ITemplateRendererParams): void {
    this.template = params.ngTemplate;
    this.refresh(params);
  }
}
