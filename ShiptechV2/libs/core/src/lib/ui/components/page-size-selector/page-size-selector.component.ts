import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng';

export interface IPageSizeOption {
  size: number;
  name: string;
}

@Component({
  selector: 'app-page-size-selector',
  templateUrl: './page-size-selector.component.html',
  styleUrls: ['./page-size-selector.component.scss']
})
export class PageSizeSelectorComponent implements OnInit {
  @Input() options: number[];
  @Input() selectedOption: number;
  @Output() selectedOptionChange = new EventEmitter<number>();

  get formattedOptions():SelectItem[] {
    return (this.options || []).map(option => ({label: option.toString(), value: option}))
  }
  constructor() {}

  ngOnInit(): void {}

  emitSelectionChange(selected: any): void {
    this.selectedOptionChange.emit(selected);
  }

  compareFn(optionOne: IPageSizeOption, optionTwo: IPageSizeOption): boolean {
    return optionOne.size === optionTwo.size;
  }
}
