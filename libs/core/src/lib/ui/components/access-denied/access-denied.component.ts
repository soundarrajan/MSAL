import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'shiptech-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessDeniedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
