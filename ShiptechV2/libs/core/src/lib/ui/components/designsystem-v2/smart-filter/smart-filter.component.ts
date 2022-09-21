import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
@Component({
  selector: 'app-smart-filter',
  templateUrl: './smart-filter.component.html',
  styleUrls: ['./smart-filter.component.css']
})
export class SmartFilterComponent implements OnInit {

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @Input('smartFilterArray') smartFilterArray;
  @Input('toggleSmartFilter') toggleSmartFilter;
  @Input('enableAddNew') enableAddNew;
  @Input('enableRemoveFilter') enableRemoveFilter;
  @Output() onSmartFilterChange = new EventEmitter();
  selectedArrayList = [];
  constructor() { }

  ngOnInit(): void {
  }
  openAddFilter($event) {
    $event.stopPropagation();
    this.selectedArrayList = this.smartFilterArray.map(item => Object.assign({}, item));
    this.menuTrigger.openMenu();
  }
  addFilter() {
    this.smartFilterArray = this.selectedArrayList;
    this.menuTrigger.closeMenu();
    this.onSmartFilterChange.emit(this.smartFilterArray);
  }
  removeChip(data) {
    this.smartFilterArray.forEach(element => {
      if (element.name == data.name) {
        data.checked = false;
      }
    });
    this.onSmartFilterChange.emit(this.smartFilterArray);
  }
  changeSelection(item) {
    this.selectedArrayList.forEach(element => {
      if (element.name == item.name) {
        element.checked = !item.checked;
      }
    });
  }
}
