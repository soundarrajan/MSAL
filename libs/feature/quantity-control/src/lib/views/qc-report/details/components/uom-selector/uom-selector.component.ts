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
  public selectedOption: SelectItem;

  @Output() public selectionChanged = new EventEmitter<ILookupDto>();

  @Input('uoms') set _options(options: ILookupDto[]) {
    if (!options) {
      return;
    }
    this.options = options.map(value => ({ label: value.name, value: value.id }));
  }

  @Input('selectedUom') set _selectedOption(option: ILookupDto) {
    if (!option) {
      return;
    }
    this.selectedOption = { label: option.name, value: option.name };
  }

  constructor() {
  }

  onSelectionChanged(selectedId: number): void {
    const { value, label } = this.options.find(option => option.value === selectedId);
    this.selectionChanged.next({ id: value, name: label });
  }

}
