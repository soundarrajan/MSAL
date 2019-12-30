import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'shiptech-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {

  @Input() value: any;
  @Input() placeholder: string;
  @Output() valueChanged = new EventEmitter<string>();

  formControl = new FormControl();

  constructor() {
  }

  ngOnInit(): void {
  }

  search(): void {
    this.valueChanged.emit(this.formControl.value);
  }
}
