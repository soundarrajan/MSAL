import { Component, Output, EventEmitter } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';


@Component({
  selector: 'app-table-legend',
  templateUrl: './table-legend.component.html',
  styleUrls: ['./table-legend.component.scss'],
  providers: [{ provide: CdkStepper, useExisting: TableLegendComponent }]
})
export class TableLegendComponent extends CdkStepper {

  @Output() closeHelp = new EventEmitter();
  onClick(index: number): void {
    this.selectedIndex = index; 
  }

}
