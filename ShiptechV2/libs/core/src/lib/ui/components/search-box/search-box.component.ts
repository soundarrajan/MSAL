import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';

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

  constructor() { }

  ngOnInit(): void {
    this.formControl.valueChanges.pipe(
      debounceTime(400),
      tap(val => this.valueChanged.emit(val))
    ).subscribe();
  }

}
