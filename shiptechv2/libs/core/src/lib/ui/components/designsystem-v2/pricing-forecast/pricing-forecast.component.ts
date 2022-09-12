import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pricing-forecast',
  templateUrl: './pricing-forecast.component.html',
  styleUrls: ['./pricing-forecast.component.css']
})
export class PricingForecastComponent implements OnInit {

  @Input('data') items;
  constructor() { }

  ngOnInit(): void {
  }

}
