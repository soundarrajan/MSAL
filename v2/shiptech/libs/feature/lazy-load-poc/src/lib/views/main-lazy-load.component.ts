import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'shiptech-main-lazy-load',
  templateUrl: './main-lazy-load.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLazyLoadComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
