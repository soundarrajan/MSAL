import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-bunkering-plan',
  templateUrl: './bunkering-plan.component.html',
  styleUrls: ['./bunkering-plan.component.scss']
})
export class BunkeringPlanComponent implements OnInit {

  @Output() changeVessel = new EventEmitter();
  @Input('vesselData') vesselData;
  @Input('vesselList') vesselList;


  public countArray = [];//Temp Variable to store the count of accordions to be displayed

  constructor() { }

  ngOnInit() {//Temp Variable to store the count of accordions to be displayed
    for (let i = 0; i < 20; i++) {
      this.countArray.push({ expanded: false });
    }
  }

}
import {
  Injector,
  Pipe,
  PipeTransform
} from '@angular/core';
@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  public constructor(private readonly injector: Injector) {
  }

  transform(value: Array<any>): any {
    if ((value.filter(e => e.expanded == true)).length == 0)
      return value.filter(e => e.expanded == false);
    else
      return value.filter(e => e.expanded == true);
  }
}