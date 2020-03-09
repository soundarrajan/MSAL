import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'shiptech-lazy-view',
  templateUrl: './lazy-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyViewComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
