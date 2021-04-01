import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filterchips',
  templateUrl: './filterchips.component.html',
  styleUrls: ['./filterchips.component.scss']
})
export class FilterchipsComponent implements OnInit {

  @Input('highIntensity') highIntensity: boolean;
  @Input('filterData') filterData;
  @Input('lastUpdatedOn') lastUpdatedOn;
  @Output() filterClick = new EventEmitter();
  public selectedFillterTag = 'All My Vessels';
  constructor() { }

  ngOnInit() {
  }

  filter(item){
    this.filterClick.emit(item);
    this.selectedFillterTag = item.name;
  }
}
