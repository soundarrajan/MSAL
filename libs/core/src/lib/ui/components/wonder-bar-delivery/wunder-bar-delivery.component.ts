import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'shiptech-wunderbar-delivery',
  templateUrl: './wunder-bar-delivery.component.html',
  styleUrls: ['./wunder-bar-delivery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WunderBarDeliveryComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
