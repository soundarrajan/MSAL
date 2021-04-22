import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'readonly-details',
  templateUrl: './readonly-details.component.html',
  styleUrls: ['./readonly-details.component.css']
})
export class ReadonlyDetailsComponent implements OnInit {
  @Input('data') data;
  constructor() { }

  ngOnInit(): void {
  }

}
