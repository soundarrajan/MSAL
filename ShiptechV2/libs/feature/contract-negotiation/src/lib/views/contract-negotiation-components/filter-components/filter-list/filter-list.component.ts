import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.css']
})
export class FilterListComponent implements OnInit {
  @Input('filterList') filterList;
  @Input('switchTheme') switchTheme?;
  @Output() toggleChipSelected = new EventEmitter();

  selectedFilterList = [];
  constructor() { }

  ngOnInit(): void {
    this.selectedFilterList = this.filterList.filters.filter((element) => element.pinned == true || element.defaultFilter == true);
    this.sortByPosition();
  }
  sortByPosition() {
    this.selectedFilterList.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0))
  }
  toggleChip(filter) {
    if (filter.selected) {//we are unpinning
      filter.selected = !filter.selected;
    }
    else {//we are pinning
      this.filterList.filters.forEach(element => {
        if (element.name == filter.name) {
          element.selected = true;
          this.toggleChipSelected.emit(filter);
        }
        else
          element.selected = false;
      });

    }

  }
  updateFilterList(filter) {
    if (filter) {
      this.filterList.filters = filter;
      this.selectedFilterList = this.filterList.filters.filter((element) => element.pinned == true || element.selected == true);
      this.sortByPosition();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // alert();
  }

}
