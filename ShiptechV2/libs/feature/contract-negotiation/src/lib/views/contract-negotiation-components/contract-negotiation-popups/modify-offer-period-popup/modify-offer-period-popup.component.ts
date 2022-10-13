import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modify-offer-period-popup',
  templateUrl: './modify-offer-period-popup.component.html',
  styleUrls: ['./modify-offer-period-popup.component.scss']
})
export class ModifyOfferPeriodPopupComponent implements OnInit {
  value = 6;
  constructor() { }

  ngOnInit(): void {
  }

}
