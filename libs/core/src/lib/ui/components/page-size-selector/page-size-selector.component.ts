import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  @Output() selectedOptionChange = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  emitSelectionChange(selected: any): void {

    this.selectedOptionChange.emit(parseInt(selected, 10));
  }

  compareFn(optionOne: IPageSizeOption, optionTwo: IPageSizeOption): boolean {
    return optionOne.size === optionTwo.size;
  }
}
