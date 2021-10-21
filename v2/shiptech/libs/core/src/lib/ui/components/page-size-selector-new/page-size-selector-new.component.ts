import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { SelectItem } from 'primeng/api';
import { MatSelect } from '@angular/material/select';
export interface IPageSizeOption {
  size: number;
  name: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-page-size-selector-new',
  templateUrl: './page-size-selector-new.component.html',
  styleUrls: ['./page-size-selector-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageSizeSelectorNewComponent implements OnInit {
  @Input() options: number[];
  @Input() selectedOption: number;
  @Output() selectedOptionChange = new EventEmitter<number>();

  get formattedOptions(): SelectItem[] {
    return (this.options || []).map(option => ({
      label: option.toString(),
      value: option
    }));
  }
  constructor() {}

  ngOnInit(): void {}

  emitSelectionChange(selected: any): void {
    this.selectedOptionChange.emit(parseInt(selected));
  }

  compareFn(optionOne: IPageSizeOption, optionTwo: IPageSizeOption): boolean {
    return optionOne.size === optionTwo.size;
  }
}
