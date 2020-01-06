import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'shiptech-wunderbar',
  templateUrl: './wunder-bar.component.html',
  styleUrls: ['./wunder-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WunderBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
