import { Component, Input, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {FormControl} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'shiptech-date-picker-from-to',
  templateUrl: './date-picker-from-to.component.html',
  styleUrls: ['./date-picker-from-to.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DatePickerFromToComponent implements OnInit {
  
  @Input() selectedFromDate: Date;
  @Input() selectedToDate: Date;
  @Output() onDateChange = new EventEmitter<any>();
  fromDate = new FormControl();
  toDate = new FormControl();

  constructor(private dateAdapter: DateAdapter<Date>) { 
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.selectedFromDate = this.selectedFromDate? new Date(this.selectedFromDate): new Date();
    this.selectedToDate = this.selectedToDate? new Date(this.selectedToDate): new Date();
    this.fromDate = new FormControl(this.selectedFromDate);
    this.toDate = new FormControl(this.selectedToDate);
  }

  onDatePickerChange(inputMode, event) {
    
  let selectedDate = {
    fromDate: this.fromDate?.value,
    toDate: this.toDate?.value
  }
  this.onDateChange.emit(selectedDate);
  }


}
