import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'readonly-details',
  templateUrl: './readonly-details.component.html',
  styleUrls: ['./readonly-details.component.css']
})
export class ReadonlyDetailsComponent implements OnInit {
  @Input('options') data:IRODataValues;
  constructor() { }

  ngOnInit(): void {

  }

}

export interface IRODataValues{
  contents:IROItemdata[], 
  hasSeparator:boolean
}

export interface IROItemdata{
  label:string,
  value:string,
  customLabelClass?:string[],
  customValueClass?:string[],
}