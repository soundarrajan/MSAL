import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header-filter-chip',
  templateUrl: './header-filter-chip.component.html',
  styleUrls: ['./header-filter-chip.component.css']
})
export class HeaderFilterChipComponent implements OnInit {

  @Input() filter;
  @Output() toggleChipPinning = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  toggleChip() {
    this.toggleChipPinning.emit(this.filter);
  }
}
