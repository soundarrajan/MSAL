import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-badge-v2',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponentV2 implements OnInit {
  @Input()badgeColor: string = "lightblue-badge";
  @Input()heading: string = "Exposure";
  @Input()value: string = "50,12345678";
  @Input()unit: string = "bbl";

  constructor() {
  }

  ngOnInit() {
  }

}
