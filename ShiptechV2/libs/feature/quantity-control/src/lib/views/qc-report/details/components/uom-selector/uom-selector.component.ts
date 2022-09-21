import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'shiptech-uom-selector',
  templateUrl: './uom-selector.component.html',
  styleUrls: ['./uom-selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UomSelectorComponent {
  @Input('uoms') set _options(options: IDisplayLookupDto[]) {
    if (!options) {
      return;
    }
    this.options = options.map(value => ({
      label: value.displayName,
      value: value.id
    }));
    this.originalOptions = options;
  }

  @Input('selectedUom') set _selectedOption(option: IDisplayLookupDto) {
    if (!option) {
      return;
    }
    this.selectedOptionId = option.id;
  }
  public options: SelectItem[];
  public selectedOptionId: number;

  @Output() public selectionChanged = new EventEmitter<IDisplayLookupDto>();
  @Input() public disabled = false;

  private originalOptions: IDisplayLookupDto[];

  constructor() {}

  onSelectionChanged(selectedId: number): void {
    this.selectionChanged.next(
      this.originalOptions.find(option => option.id === selectedId)
    );
  }
}
