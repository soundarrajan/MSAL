import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';

@Component({
  selector: 'shiptech-uom-selector',
  templateUrl: './uom-selector.component.html',
  styleUrls: ['./uom-selector.component.css']
})
export class UomSelectorComponent {
  public options: SelectItem[];
  public selectedOptionId: number;

  private originalOptions: ILookupDto[];

  @Output() public selectionChanged = new EventEmitter<ILookupDto>();

  @Input('uoms') set _options(options: ILookupDto[]) {
    if (!options) {
      return;
    }
    this.options = options.map(value => ({ label: value.name, value: value.id }));
    this.originalOptions = options;
  }

  @Input('selectedUom') set _selectedOption(option: ILookupDto) {
    if (!option) {
      return;
    }
    this.selectedOptionId = option.id;
  }

  constructor() {
  }

  onSelectionChanged(selectedId: number): void {
    this.selectionChanged.next(this.originalOptions.find(option => option.id === selectedId));
  }

}
