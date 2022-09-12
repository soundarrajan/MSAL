import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'shiptech-lazy-view',
  templateUrl: './lazy-view.component.html',
  styleUrls: ['./lazy-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyViewComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
