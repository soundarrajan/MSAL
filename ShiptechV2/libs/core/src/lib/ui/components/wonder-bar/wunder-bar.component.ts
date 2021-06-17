import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'shiptech-wunderbar',
  templateUrl: './wunder-bar.component.html',
  styleUrls: ['./wunder-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WunderBarComponent implements OnInit {
  isQcScreen: boolean = false;
  constructor(private router: Router) {
    if (this.router.url.includes('quantity-control/report/')) {
      this.isQcScreen = true;
    }
  }

  ngOnInit(): void {}
}
